'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Home,
  Briefcase,
  ArrowLeft,
  CheckCircle,
  CircleDot,
  X,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { addressApi, ApiError, type BackendAddress, type AddressPayload } from '@/lib/api';

const emptyForm: AddressPayload = {
  label: 'Home',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'IN',
  isDefault: false,
};

function labelIcon(label: string) {
  const l = label.toLowerCase();
  if (l === 'home') return Home;
  if (l === 'work') return Briefcase;
  return MapPin;
}

function labelColorClasses(label: string) {
  const l = label.toLowerCase();
  if (l === 'home') return { bg: 'bg-violet-100', text: 'text-violet-600', chipBg: 'bg-violet-50', chipText: 'text-violet-600' };
  if (l === 'work') return { bg: 'bg-amber-100', text: 'text-amber-600', chipBg: 'bg-amber-50', chipText: 'text-amber-600' };
  return { bg: 'bg-sky-100', text: 'text-sky-600', chipBg: 'bg-sky-50', chipText: 'text-sky-600' };
}

function AddressesPage() {
  const [addresses, setAddresses] = useState<BackendAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressPayload>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressPayload, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditing = editingId !== null;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setAddresses(await addressApi.list());
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AddressPayload, string>> = {};
    if (!form.label.trim()) newErrors.label = 'Label is required';
    if (!form.street.trim()) newErrors.street = 'Street address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!/^\d{6}$/.test(form.zipCode)) newErrors.zipCode = 'Enter a valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEditing) {
        await addressApi.update(editingId, form);
        toast.success('Address updated successfully');
      } else {
        await addressApi.create(form);
        toast.success('Address added successfully');
      }
      await load();
      resetForm();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address: BackendAddress) => {
    setForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    try {
      await addressApi.remove(id);
      toast.success('Address deleted');
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to delete address');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleSetDefault = async (address: BackendAddress) => {
    try {
      await addressApi.update(address.id, { isDefault: true });
      toast.success('Default address updated');
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update default address');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-gradient-to-b from-zumbii-50 to-surface pt-6 pb-8 lg:pt-10 lg:pb-12">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-zumbii-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Account
            </Link>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-zumbii-600" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Addresses</h1>
                  <p className="text-sm text-text-tertiary mt-0.5">{addresses.length} saved addresses</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); setErrors({}); }}
                disabled={showForm}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Address</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-padding py-6 lg:py-8">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Card className="p-5 sm:p-6" hover={false}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-text-primary">
                  {isEditing ? 'Edit Address' : 'Add New Address'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
                  aria-label="Close form"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Label</label>
                  <div className="flex gap-2">
                    {(['Home', 'Work', 'Other'] as const).map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setForm({ ...form, label })}
                        className={clsx(
                          'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all',
                          form.label === label
                            ? 'border-zumbii-600 bg-zumbii-50 text-zumbii-600'
                            : 'border-border text-text-secondary hover:border-zumbii-200'
                        )}
                      >
                        {label === 'Home' ? (
                          <Home className="w-3.5 h-3.5" />
                        ) : label === 'Work' ? (
                          <Briefcase className="w-3.5 h-3.5" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5" />
                        )}
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.label && <p className="text-xs text-red-500 mt-1">{errors.label}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Street Address"
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    error={errors.street}
                    placeholder="House / Flat / Building / Street / Landmark"
                  />
                </div>
                <Input
                  label="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  error={errors.city}
                  placeholder="Mumbai"
                />
                <Input
                  label="State"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  error={errors.state}
                  placeholder="Maharashtra"
                />
                <Input
                  label="Pincode"
                  value={form.zipCode}
                  onChange={(e) => setForm({ ...form, zipCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  error={errors.zipCode}
                  placeholder="400069"
                />
              </div>

              <label className="flex items-center gap-2.5 mt-5 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isDefault: !form.isDefault })}
                  className={clsx(
                    'w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
                    form.isDefault
                      ? 'bg-zumbii-600 border-zumbii-600'
                      : 'border-border'
                  )}
                >
                  {form.isDefault && <CheckCircle className="w-3 h-3 text-white" />}
                </button>
                <span className="text-sm text-text-secondary">Set as default address</span>
              </label>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <Button variant="ghost" size="md" onClick={resetForm}>
                  Cancel
                </Button>
                <Button size="md" onClick={handleSave} loading={saving}>
                  {isEditing ? 'Update Address' : 'Save Address'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-text-tertiary text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading addresses...
          </div>
        ) : addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto rounded-3xl bg-surface-tertiary flex items-center justify-center mb-6">
              <MapPin className="w-10 h-10 text-text-tertiary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">No addresses saved</h2>
            <p className="text-text-tertiary mb-8 max-w-md mx-auto">
              Add a delivery address to start shopping. Your addresses are stored securely for faster checkout.
            </p>
            <Button
              size="lg"
              onClick={() => { setShowForm(true); setForm(emptyForm); setErrors({}); }}
            >
              <Plus className="w-5 h-5" />
              Add Address
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {addresses.map((address) => {
                const Icon = labelIcon(address.label);
                const colors = labelColorClasses(address.label);
                return (
                  <motion.div
                    key={address.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card hover={false}>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', colors.bg)}>
                              <Icon className={clsx('w-5 h-5', colors.text)} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                {address.isDefault && (
                                  <Badge variant="default" size="sm">Default</Badge>
                                )}
                                <div className={clsx('flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium', colors.chipBg, colors.chipText)}>
                                  {address.label}
                                </div>
                              </div>
                              <p className="text-sm text-text-secondary mt-1">{address.street}</p>
                              <p className="text-sm text-text-secondary">
                                {address.city}, {address.state} - {address.zipCode}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <button
                              onClick={() => handleEdit(address)}
                              className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-zumbii-600"
                              aria-label="Edit address"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(address.id)}
                              className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-red-500"
                              aria-label="Delete address"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {!address.isDefault && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                            <button
                              onClick={() => handleSetDefault(address)}
                              className="text-xs font-medium text-zumbii-600 hover:text-zumbii-700 flex items-center gap-1"
                            >
                              <CircleDot className="w-3.5 h-3.5" />
                              Set as Default
                            </button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-zumbii-50 to-surface border border-zumbii-100 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-zumbii-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Why save addresses?</h4>
            <p className="text-xs text-text-tertiary mt-1">
              Saved addresses make checkout faster and help us deliver to the right location every time.
              You can add multiple addresses for home, work, or other delivery preferences.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-text-primary text-center">Delete Address?</h3>
              <p className="text-sm text-text-tertiary text-center mt-2">
                Are you sure you want to delete this address? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="md"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AddressesPage;
