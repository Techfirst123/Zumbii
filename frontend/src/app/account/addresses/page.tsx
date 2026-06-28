'use client';

import { useState } from 'react';
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
  ChevronRight,
  X,
  AlertCircle,
  Star,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Input } from '@/components/ui/input';

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

const initialAddresses: Address[] = [
  {
    id: 'a1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    line1: '42, Gandhi Nagar, Andheri East',
    line2: 'Near Railway Station',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    isDefault: true,
    type: 'home',
  },
  {
    id: 'a2',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    line1: 'Suite 301, Tech Park, MG Road',
    line2: 'Bellandur',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    isDefault: false,
    type: 'work',
  },
];

const emptyForm: Address = {
  id: '',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
  type: 'home',
};

function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Address>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const isEditing = editingId !== null;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Address, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.line1.trim()) newErrors.line1 = 'Address line 1 is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (isEditing) {
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id !== editingId) return addr;
          return { ...form, id: editingId };
        })
      );
      toast.success('Address updated successfully');
    } else {
      const newId = `a${Date.now()}`;
      setAddresses((prev) => {
        const updated = form.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;
        return [...updated, { ...form, id: newId }];
      });
      toast.success('Address added successfully');
    }

    resetForm();
  };

  const handleEdit = (address: Address) => {
    setForm(address);
    setEditingId(address.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
    toast.success('Address deleted');
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast.success('Default address updated');
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
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={errors.name}
                  placeholder="Rahul Sharma"
                />
                <Input
                  label="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  error={errors.phone}
                  placeholder="+91 98765 43210"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Address Line 1"
                    value={form.line1}
                    onChange={(e) => setForm({ ...form, line1: e.target.value })}
                    error={errors.line1}
                    placeholder="House / Flat / Building / Street"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Address Line 2 (Optional)"
                    value={form.line2}
                    onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    placeholder="Landmark / Area / Sector"
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
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  error={errors.pincode}
                  placeholder="400069"
                />
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Address Type</label>
                  <div className="flex gap-2">
                    {(['home', 'work', 'other'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, type })}
                        className={clsx(
                          'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all',
                          form.type === type
                            ? 'border-zumbii-600 bg-zumbii-50 text-zumbii-600'
                            : 'border-border text-text-secondary hover:border-zumbii-200'
                        )}
                      >
                        {type === 'home' ? (
                          <Home className="w-3.5 h-3.5" />
                        ) : type === 'work' ? (
                          <Briefcase className="w-3.5 h-3.5" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5" />
                        )}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
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
                <Button size="md" onClick={handleSave}>
                  {isEditing ? 'Update Address' : 'Save Address'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {addresses.length === 0 ? (
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
              {addresses.map((address) => (
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
                          <div
                            className={clsx(
                              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                              address.type === 'home'
                                ? 'bg-violet-100'
                                : address.type === 'work'
                                ? 'bg-amber-100'
                                : 'bg-sky-100'
                            )}
                          >
                            {address.type === 'home' ? (
                              <Home className="w-5 h-5 text-violet-600" />
                            ) : address.type === 'work' ? (
                              <Briefcase className="w-5 h-5 text-amber-600" />
                            ) : (
                              <MapPin className="w-5 h-5 text-sky-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-text-primary text-sm">{address.name}</span>
                              {address.isDefault && (
                                <Badge variant="default" size="sm">Default</Badge>
                              )}
                              <div className={clsx(
                                'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
                                address.type === 'home'
                                  ? 'bg-violet-50 text-violet-600'
                                  : address.type === 'work'
                                  ? 'bg-amber-50 text-amber-600'
                                  : 'bg-sky-50 text-sky-600'
                              )}>
                                {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                              </div>
                            </div>
                            <p className="text-sm text-text-secondary mt-1">
                              {address.line1}
                              {address.line2 && <>, {address.line2}</>}
                            </p>
                            <p className="text-sm text-text-secondary">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-sm text-text-secondary mt-0.5">Phone: {address.phone}</p>
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
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="text-xs font-medium text-zumbii-600 hover:text-zumbii-700 flex items-center gap-1"
                          >
                            <CircleDot className="w-3.5 h-3.5" />
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
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
