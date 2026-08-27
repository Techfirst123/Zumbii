'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Package,
  Shield,
  Sparkles,
  IndianRupee,
  Building2,
  Smartphone,
  Wallet,
  Landmark,
  Banknote,
  CircleDot,
  Loader2,
  Copy,
  Check,
  X,
  Home,
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Star,
  AlertCircle,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useAuthGuard } from '@/hooks/useRequireAuth';
import { addressApi, ordersApi, couponsApi, ApiError, type BackendAddress, type AddressPayload } from '@/lib/api';

type Step = 'address' | 'shipping' | 'payment' | 'review';

const emptyAddressForm: AddressPayload = {
  label: 'Home',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'IN',
  isDefault: false,
};

const shippingMethods = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: '5-7 business days',
    price: 49,
    icon: Truck,
    eta: 'Arrives by Jul 5 - Jul 8',
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: '2-3 business days',
    price: 149,
    icon: Package,
    eta: 'Arrives by Jul 1 - Jul 2',
    popular: true,
  },
  {
    id: 'sameday',
    name: 'Same Day Delivery',
    description: 'Within 6 hours',
    price: 299,
    icon: Star,
    eta: 'Arrives today by 10 PM',
  },
];

const paymentMethods = [
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
  { id: 'netbanking', name: 'Net Banking', icon: Landmark, description: 'All major banks' },
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'Zumbii Pay balance' },
];

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clear);
  const savedCouponCode = useCartStore((s) => s.couponCode);
  const setSavedCoupon = useCartStore((s) => s.setCoupon);
  const authUser = useAuthStore((s) => s.user);
  const { ready: authReady, authenticated } = useAuthGuard();
  const [currentStep, setCurrentStep] = useState<Step>('address');
  const [addresses, setAddresses] = useState<BackendAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState('express');
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [showCardForm, setShowCardForm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [placeOrderError, setPlaceOrderError] = useState('');
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  const [newAddress, setNewAddress] = useState<AddressPayload>(emptyAddressForm);

  const [errors, setErrors] = useState<Partial<Record<keyof AddressPayload, string>>>({});

  const stepIndex = steps.findIndex((s) => s.id === currentStep);
  const shippingCost = shippingMethods.find((s) => s.id === selectedShipping)?.price ?? 0;
  const tax = Math.round((subtotal - couponDiscount) * 0.12);
  const total = subtotal - couponDiscount + shippingCost + tax;

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      router.replace('/cart');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length, orderPlaced]);

  // A coupon applied on the cart page carries over here via the persisted
  // cart store — re-validate it against this page's subtotal since it may
  // have changed (or the coupon may have expired/hit its usage limit) since.
  useEffect(() => {
    if (!savedCouponCode || subtotal <= 0) {
      setCouponDiscount(0);
      setAppliedCouponCode(null);
      return;
    }
    let cancelled = false;
    couponsApi
      .validate(savedCouponCode, subtotal)
      .then((res) => {
        if (cancelled) return;
        setCouponDiscount(res.discountAmount);
        setAppliedCouponCode(res.code);
      })
      .catch(() => {
        if (cancelled) return;
        setCouponDiscount(0);
        setAppliedCouponCode(null);
        setSavedCoupon(null);
        toast.error('Your coupon is no longer valid and was removed');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedCouponCode, subtotal]);

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    async function loadAddresses() {
      setAddressesLoading(true);
      try {
        const list = await addressApi.list();
        if (cancelled) return;
        setAddresses(list);
        const preferred = list.find((a) => a.isDefault) ?? list[0];
        if (preferred) setSelectedAddress(preferred.id);
        else setShowAddressForm(true);
      } catch (err) {
        if (!cancelled) toast.error(err instanceof ApiError ? err.message : 'Failed to load addresses');
      } finally {
        if (!cancelled) setAddressesLoading(false);
      }
    }
    loadAddresses();
    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  const canProceed = () => {
    if (currentStep === 'address') return !!selectedAddress;
    if (currentStep === 'shipping') return !!selectedShipping;
    if (currentStep === 'payment') {
      if (selectedPayment === 'card' && !showCardForm) return false;
      return !!selectedPayment;
    }
    return true;
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep === 'address' && !selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (currentStep === 'shipping' && !selectedShipping) {
      toast.error('Please select a shipping method');
      return;
    }
    if (currentStep === 'payment' && !selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }
    const idx = steps.findIndex((s) => s.id === currentStep);
    if (idx < steps.length - 1) {
      setCurrentStep(steps[idx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    const idx = steps.findIndex((s) => s.id === currentStep);
    if (idx > 0) {
      setCurrentStep(steps[idx - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [savingAddress, setSavingAddress] = useState(false);

  const validateAddressForm = () => {
    const newErrors: Partial<Record<keyof AddressPayload, string>> = {};
    if (!newAddress.street.trim()) newErrors.street = 'Address is required';
    if (!newAddress.city.trim()) newErrors.city = 'City is required';
    if (!newAddress.state.trim()) newErrors.state = 'State is required';
    if (!/^\d{6}$/.test(newAddress.zipCode)) newErrors.zipCode = 'Enter valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) return;
    setSavingAddress(true);
    try {
      const saved = editingAddress
        ? await addressApi.update(editingAddress, newAddress)
        : await addressApi.create(newAddress);
      const list = await addressApi.list();
      setAddresses(list);
      setSelectedAddress(saved.id);
      toast.success('Address saved successfully');
      setShowAddressForm(false);
      setEditingAddress(null);
      setNewAddress(emptyAddressForm);
      setErrors({});
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    setPlacing(true);
    setPlaceOrderError('');
    try {
      const order = await ordersApi.create({
        addressId: selectedAddress,
        shippingMethod: selectedShipping,
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        ...(appliedCouponCode ? { couponCode: appliedCouponCode } : {}),
      });
      setOrderPlaced(true);
      setOrderNumber(order.orderNumber);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to place order. Please try again.';
      setPlaceOrderError(message);
      toast.error(message);
    } finally {
      setPlacing(false);
    }
  };

  const renderProgressBar = () => (
    <>
      {/* Compact mobile step indicator — the full step bar below is desktop-only */}
      <div className="mb-6 flex items-center gap-3 sm:hidden">
        <span className="shrink-0 text-xs font-semibold text-zumbii-950">
          Step {stepIndex + 1} of {steps.length}: {steps[stepIndex].label}
        </span>
        <div className="flex flex-1 items-center gap-1.5">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className={clsx(
                'h-1.5 flex-1 rounded-full transition-colors',
                idx <= stepIndex ? 'bg-zumbii-950' : 'bg-surface-tertiary'
              )}
            />
          ))}
        </div>
      </div>
    <div className="hidden sm:block mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-zumbii-600 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx <= stepIndex;
          const isCurrent = step.id === currentStep;
          return (
            <button
              key={step.id}
              onClick={() => idx <= stepIndex && goToStep(step.id)}
              disabled={!isActive && step.id !== 'address'}
              className={clsx(
                'relative z-10 flex flex-col items-center gap-1.5',
                idx <= stepIndex ? 'cursor-pointer' : 'cursor-default'
              )}
            >
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isCurrent
                    ? 'bg-zumbii-950 text-gold-400 ring-2 ring-gold-500 shadow-lg shadow-zumbii-950/30 scale-110'
                    : isActive
                    ? 'bg-zumbii-950 text-white'
                    : 'bg-surface-tertiary text-text-tertiary'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={clsx(
                  'text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-zumbii-600' : 'text-text-tertiary'
                )}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
    </>
  );

  const renderAddressStep = () => (
    <motion.div
      key="address"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Delivery Address</h2>
          <p className="text-sm text-text-tertiary mt-1">Select or add a new delivery address</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => { setShowAddressForm(true); setEditingAddress(null); setNewAddress(emptyAddressForm); setErrors({}); }}
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>

      {addressesLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-text-tertiary text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading addresses...
        </div>
      ) : !showAddressForm ? (
        <div className="space-y-3">
          {addresses.length === 0 && (
            <p className="text-sm text-text-tertiary mb-2">
              No saved addresses yet — add one below to continue.
            </p>
          )}
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={clsx(
                'block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all',
                selectedAddress === addr.id
                  ? 'border-zumbii-600 bg-zumbii-50 shadow-md shadow-zumbii-600/10'
                  : 'border-border bg-surface hover:border-zumbii-200 hover:bg-zumbii-50/50'
              )}
              onClick={() => setSelectedAddress(addr.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={clsx(
                    'w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center',
                    selectedAddress === addr.id ? 'border-zumbii-600' : 'border-border'
                  )}
                >
                  {selectedAddress === addr.id && <CircleDot className="w-3 h-3 text-zumbii-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {authUser?.firstName && (
                      <span className="font-semibold text-text-primary text-sm">
                        {authUser.firstName} {authUser.lastName}
                      </span>
                    )}
                    {addr.isDefault && <Badge variant="default" size="sm">Default</Badge>}
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-zumbii-50 text-zumbii-700">
                      {addr.label.toLowerCase() === 'home' ? <Home className="w-3 h-3" /> : addr.label.toLowerCase() === 'work' ? <Briefcase className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                      {addr.label}
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{addr.street}</p>
                  <p className="text-sm text-text-secondary">{addr.city}, {addr.state} - {addr.zipCode}</p>
                  {authUser?.phone && (
                    <p className="text-sm text-text-secondary mt-0.5">Phone: {authUser.phone}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingAddress(addr.id);
                      setNewAddress({
                        label: addr.label,
                        street: addr.street,
                        city: addr.city,
                        state: addr.state,
                        zipCode: addr.zipCode,
                        country: addr.country,
                        isDefault: addr.isDefault,
                      });
                      setShowAddressForm(true);
                    }}
                    className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-zumbii-600"
                    aria-label="Edit address"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </label>
          ))}
        </div>
      ) : (
        <Card className="p-5 sm:p-6" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-text-primary">{editingAddress ? 'Edit Address' : 'New Address'}</h3>
            <button
              onClick={() => { setShowAddressForm(false); setErrors({}); }}
              className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-surface-tertiary transition-colors"
              aria-label="Close address form"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Street Address" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} error={errors.street} placeholder="House / Flat / Building / Street / Landmark" />
            </div>
            <Input label="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} error={errors.city} placeholder="Mumbai" />
            <Input label="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} error={errors.state} placeholder="Maharashtra" />
            <Input label="Pincode" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value.replace(/\D/g, '').slice(0, 6) })} error={errors.zipCode} placeholder="400069" />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Address Type</label>
              <div className="flex flex-wrap gap-2">
                {(['Home', 'Work', 'Other'] as const).map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setNewAddress({ ...newAddress, label })}
                    className={clsx(
                      'flex min-h-11 items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                      newAddress.label === label
                        ? 'border-zumbii-600 bg-zumbii-50 text-zumbii-600'
                        : 'border-border text-text-secondary hover:border-zumbii-200'
                    )}
                  >
                    {label === 'Home' ? <Home className="w-3.5 h-3.5" /> : label === 'Work' ? <Briefcase className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" size="md" onClick={() => { setShowAddressForm(false); setErrors({}); }}>Cancel</Button>
            <Button size="md" onClick={handleSaveAddress} loading={savingAddress}>Save Address</Button>
          </div>
        </Card>
      )}
    </motion.div>
  );

  const renderShippingStep = () => (
    <motion.div
      key="shipping"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-5">
        <h2 className="text-xl font-bold text-text-primary">Shipping Method</h2>
        <p className="text-sm text-text-tertiary mt-1">Choose your preferred delivery option</p>
      </div>
      <div className="space-y-3">
        {shippingMethods.map((method) => {
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className={clsx(
                'block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden',
                selectedShipping === method.id
                  ? 'border-zumbii-600 bg-zumbii-50 shadow-md shadow-zumbii-600/10'
                  : 'border-border bg-surface hover:border-zumbii-200 hover:bg-zumbii-50/50'
              )}
            >
              {method.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gold-500 text-zumbii-950 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    POPULAR
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div
                  className={clsx(
                    'w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center',
                    selectedShipping === method.id ? 'border-zumbii-600' : 'border-border'
                  )}
                >
                  {selectedShipping === method.id && <CircleDot className="w-3 h-3 text-zumbii-600" />}
                </div>
                <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', selectedShipping === method.id ? 'bg-zumbii-100' : 'bg-surface-tertiary')}>
                  <Icon className={clsx('w-6 h-6', selectedShipping === method.id ? 'text-zumbii-600' : 'text-text-tertiary')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary">{method.name}</h3>
                    <span className={clsx(
                      'text-sm font-bold',
                      selectedShipping === method.id ? 'text-zumbii-600' : 'text-text-primary'
                    )}>
                      ₹{method.price}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary mt-0.5">{method.description}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">{method.eta}</p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </motion.div>
  );

  const renderPaymentStep = () => (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-5">
        <h2 className="text-xl font-bold text-text-primary">Payment Method</h2>
        <p className="text-sm text-text-tertiary mt-1">Select a payment method to complete your order</p>
      </div>
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className={clsx(
                'block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all',
                selectedPayment === method.id
                  ? 'border-zumbii-600 bg-zumbii-50 shadow-md shadow-zumbii-600/10'
                  : 'border-border bg-surface hover:border-zumbii-200 hover:bg-zumbii-50/50'
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={clsx(
                    'w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center',
                    selectedPayment === method.id ? 'border-zumbii-600' : 'border-border'
                  )}
                >
                  {selectedPayment === method.id && <CircleDot className="w-3 h-3 text-zumbii-600" />}
                </div>
                <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', selectedPayment === method.id ? 'bg-zumbii-100' : 'bg-surface-tertiary')}>
                  <Icon className={clsx('w-6 h-6', selectedPayment === method.id ? 'text-zumbii-600' : 'text-text-tertiary')} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-text-primary">{method.name}</h3>
                  <p className="text-xs text-text-tertiary mt-0.5">{method.description}</p>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {selectedPayment === 'card' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <Card className="p-5" hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">Card Details</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-1 rounded bg-blue-50 text-blue-600 font-medium">VISA</span>
                <span className="text-[10px] px-2 py-1 rounded bg-red-50 text-red-600 font-medium">MC</span>
                <span className="text-[10px] px-2 py-1 rounded bg-amber-50 text-amber-600 font-medium">RUPAY</span>
              </div>
            </div>
            <div className="space-y-3">
              <Input
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19) })}
              />
              <Input
                label="Cardholder Name"
                placeholder="RAHUL SHARMA"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
                    setCardDetails({ ...cardDetails, expiry: val.slice(0, 5) });
                  }}
                />
                <Input
                  label="CVV"
                  type="password"
                  placeholder="***"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {selectedPayment === 'cod' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3"
        >
          <Banknote className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-800">Cash on Delivery</h4>
            <p className="text-xs text-amber-700 mt-1">
              Pay in cash when your order is delivered. A convenience fee of ₹49 may apply.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderReviewStep = () => {
    const address = addresses.find((a) => a.id === selectedAddress);
    const shipping = shippingMethods.find((s) => s.id === selectedShipping);
    const payment = paymentMethods.find((p) => p.id === selectedPayment);

    return (
      <motion.div
        key="review"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-5">
          <h2 className="text-xl font-bold text-text-primary">Review Your Order</h2>
          <p className="text-sm text-text-tertiary mt-1">Please verify all details before placing the order</p>
        </div>

        <div className="space-y-4">
          <Card className="p-4 sm:p-5" hover={false}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zumbii-600" />
                <h3 className="text-sm font-semibold text-text-primary">Delivery Address</h3>
              </div>
              <button onClick={() => goToStep('address')} className="text-xs font-medium text-zumbii-600 hover:text-zumbii-700">
                Change
              </button>
            </div>
            {address && (
              <div className="text-sm text-text-secondary">
                {authUser?.firstName && (
                  <p className="font-medium text-text-primary">{authUser.firstName} {authUser.lastName}</p>
                )}
                <p>{address.street}</p>
                <p>{address.city}, {address.state} - {address.zipCode}</p>
                {authUser?.phone && <p>Phone: {authUser.phone}</p>}
              </div>
            )}
          </Card>

          <Card className="p-4 sm:p-5" hover={false}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zumbii-600" />
                <h3 className="text-sm font-semibold text-text-primary">Shipping Method</h3>
              </div>
              <button onClick={() => goToStep('shipping')} className="text-xs font-medium text-zumbii-600 hover:text-zumbii-700">
                Change
              </button>
            </div>
            {shipping && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">{shipping.name}</p>
                  <p className="text-xs text-text-tertiary">{shipping.eta}</p>
                </div>
                <span className="text-sm font-bold text-text-primary">₹{shipping.price}</span>
              </div>
            )}
          </Card>

          <Card className="p-4 sm:p-5" hover={false}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-zumbii-600" />
                <h3 className="text-sm font-semibold text-text-primary">Payment Method</h3>
              </div>
              <button onClick={() => goToStep('payment')} className="text-xs font-medium text-zumbii-600 hover:text-zumbii-700">
                Change
              </button>
            </div>
            {payment && (
              <div className="flex items-center gap-3">
                <payment.icon className="w-5 h-5 text-text-secondary" />
                <span className="text-sm text-text-primary">{payment.name}</span>
              </div>
            )}
          </Card>

          <Card className="p-4 sm:p-5" hover={false}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-zumbii-600" />
                <h3 className="text-sm font-semibold text-text-primary">Items ({cartItems.length})</h3>
              </div>
              <button
                onClick={() => setShowFullSummary(!showFullSummary)}
                className="flex items-center gap-1 text-xs font-medium text-zumbii-600 hover:text-zumbii-700"
              >
                {showFullSummary ? 'Hide' : 'View All'}
                {showFullSummary ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <AnimatePresence>
              {showFullSummary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-tertiary shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-primary truncate">{item.name}</p>
                          <p className="text-[11px] text-text-tertiary">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-bold text-text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <Card className="p-4 sm:p-5" hover={false}>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Shipping</span>
                <span className="text-text-primary">₹{shippingCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Tax (GST 12%)</span>
                <span className="text-text-primary">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-leaf-600">Discount {appliedCouponCode ? `(${appliedCouponCode})` : ''}</span>
                  <span className="text-leaf-600">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex justify-between text-base">
                <span className="font-bold text-text-primary">Total</span>
                <span className="font-bold text-zumbii-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-zumbii-50 border border-zumbii-100 flex items-start gap-3">
          <Shield className="w-5 h-5 text-zumbii-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Buyer Protection</h4>
            <p className="text-xs text-text-tertiary mt-1">
              Your order is protected by Zumbii Guarantee. Full refund if the product is not as described or not delivered.
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderOrderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-10 sm:py-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6"
      >
        <CheckCircle className="w-10 h-10 text-emerald-600" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Order Placed Successfully!</h2>
        <p className="text-text-tertiary mt-2 max-w-md mx-auto">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 inline-flex items-center gap-3 p-4 rounded-2xl bg-surface-tertiary border border-border"
      >
        <Package className="w-5 h-5 text-text-tertiary" />
        <div className="text-left">
          <p className="text-[11px] text-text-tertiary">Order Number</p>
          <p className="text-sm font-bold text-text-primary font-mono">{orderNumber}</p>
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(orderNumber); toast.success('Order number copied!'); }}
          className="p-2 rounded-lg hover:bg-surface transition-colors text-text-tertiary hover:text-zumbii-600"
          aria-label="Copy order number"
        >
          <Copy className="w-4 h-4" />
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        <Link href="/orders">
          <Button>
            <Package className="w-4 h-4" />
            View Orders
          </Button>
        </Link>
        <Link href="/marketplace">
          <Button variant="outline">
            Continue Shopping
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );

  if (!authReady || !authenticated) {
    return <div className="min-h-screen bg-surface" />;
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="section-padding py-10">
          {renderOrderConfirmation()}
        </div>
      </div>
    );
  }

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
              href="/cart"
              className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-zumbii-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-zumbii-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Checkout</h1>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-padding py-6 lg:py-8">
        {renderProgressBar()}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="min-w-0 lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 'address' && renderAddressStep()}
              {currentStep === 'shipping' && renderShippingStep()}
              {currentStep === 'payment' && renderPaymentStep()}
              {currentStep === 'review' && renderReviewStep()}
            </AnimatePresence>

            {currentStep === 'review' && placeOrderError && (
              <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{placeOrderError}</span>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                size="md"
                onClick={prevStep}
                disabled={currentStep === 'address'}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              {currentStep === 'review' ? (
                <Button
                  size="lg"
                  onClick={handlePlaceOrder}
                  loading={placing}
                >
                  {placing ? (
                    'Placing Order...'
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button size="lg" onClick={nextStep}>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-1">
            <div className="sticky top-28">
              <Card className="p-5" hover={false}>
                <h3 className="text-sm font-bold text-text-primary mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  {cartItems.slice(0, 2).map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-tertiary shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-primary truncate">{item.name}</p>
                        <p className="text-[11px] text-text-tertiary">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {cartItems.length > 2 && (
                    <p className="text-xs text-text-tertiary text-center">+{cartItems.length - 2} more item(s)</p>
                  )}
                </div>
                <hr className="border-border my-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text-primary font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Shipping</span>
                    <span className="text-text-primary font-medium">₹{shippingCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Tax</span>
                    <span className="text-text-primary font-medium">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-leaf-600">Discount {appliedCouponCode ? `(${appliedCouponCode})` : ''}</span>
                      <span className="text-leaf-600 font-medium">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <hr className="border-border" />
                  <div className="flex justify-between">
                    <span className="font-bold text-text-primary">Total</span>
                    <span className="font-bold text-zumbii-600 text-base">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Card>
              <div className="mt-4 p-4 rounded-2xl bg-leaf-50 border border-leaf-100 flex items-start gap-3">
                <Shield className="w-5 h-5 text-leaf-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-leaf-700">Secure Checkout</h4>
                  <p className="text-[11px] text-leaf-600 mt-0.5">SSL encrypted & secure payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
