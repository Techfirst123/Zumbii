'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Settings,
  Package,
  Heart,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  Edit2,
  Camera,
  Store,
  Star,
  Clock,
  ChevronDown,
  CircleUser,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus,
  Home,
  Briefcase,
  Pencil,
  Building2,
  Smartphone,
  Wallet,
  Landmark,
  Banknote,
  Download,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  ordersCount: number;
  wishlistCount: number;
  addressesCount: number;
}

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

interface SavedPayment {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
  icon: React.ElementType;
}

const profile: UserProfile = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@email.com',
  phone: '+91 98765 43210',
  avatar: '',
  memberSince: 'January 2025',
  ordersCount: 12,
  wishlistCount: 8,
  addressesCount: 2,
};

const savedAddresses: SavedAddress[] = [
  {
    id: 'a1', name: 'Rahul Sharma', phone: '+91 98765 43210',
    line1: '42, Gandhi Nagar, Andheri East', line2: 'Near Railway Station',
    city: 'Mumbai', state: 'Maharashtra', pincode: '400069',
    isDefault: true, type: 'home',
  },
  {
    id: 'a2', name: 'Rahul Sharma', phone: '+91 98765 43210',
    line1: 'Suite 301, Tech Park, MG Road',
    city: 'Bangalore', state: 'Karnataka', pincode: '560001',
    isDefault: false, type: 'work',
  },
];

const paymentMethods: SavedPayment[] = [
  { id: 'p1', type: 'card', name: 'HDFC Bank Credit Card', details: '**** 4532', isDefault: true, icon: CreditCard },
  { id: 'p2', type: 'upi', name: 'Google Pay', details: 'rahul@okhdfcbank', isDefault: false, icon: Smartphone },
  { id: 'p3', type: 'wallet', name: 'Zumbii Pay', details: 'Balance: ₹2,450', isDefault: false, icon: Wallet },
];

const recentActivities = [
  { id: 'act1', action: 'Order Delivered', details: 'Premium Wireless Headphones', time: '2 days ago', icon: Package, color: 'text-emerald-600 bg-emerald-100' },
  { id: 'act2', action: 'Wishlist Updated', details: 'Added 3 new items', time: '5 days ago', icon: Heart, color: 'text-rose-600 bg-rose-100' },
  { id: 'act3', action: 'Order Shipped', details: 'Smart Watch Ultra X2', time: '1 week ago', icon: Package, color: 'text-violet-600 bg-violet-100' },
  { id: 'act4', action: 'Payment Added', details: 'New card added successfully', time: '2 weeks ago', icon: CreditCard, color: 'text-blue-600 bg-blue-100' },
  { id: 'act5', action: 'Address Updated', details: 'Added new work address', time: '3 weeks ago', icon: MapPin, color: 'text-amber-600 bg-amber-100' },
];

type Tab = 'profile' | 'addresses' | 'payments' | 'settings';

function AccountPage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: profile.name, email: profile.email, phone: profile.phone });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    orders: true,
    promotions: false,
    newsletter: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
    setEditing(false);
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion is not available yet');
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin, count: profile.addressesCount },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderProfile = () => (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-5 sm:p-6" hover={false}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gradient-bg flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {profile.avatar ? (
                <Image src={profile.avatar} alt={profile.name} fill className="object-cover rounded-2xl" />
              ) : (
                profile.name.split(' ').map((n) => n[0]).join('')
              )}
              <button
                onClick={() => toast.success('Avatar upload coming soon')}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-border flex items-center justify-center hover:bg-surface-tertiary transition-colors shadow-sm"
                aria-label="Change avatar"
              >
                <Camera className="w-3 h-3 text-text-secondary" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">{profile.name}</h2>
              <p className="text-sm text-text-tertiary">Member since {profile.memberSince}</p>
              <Badge variant="success" size="sm" className="mt-1">Verified Account</Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            <Edit2 className="w-4 h-4" />
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label="Email Address"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Phone Number"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              icon={<Phone className="w-4 h-4" />}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-surface-secondary">
              <div className="flex items-center gap-2 text-xs text-text-tertiary mb-1">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </div>
              <p className="text-sm font-medium text-text-primary">{profile.email}</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-secondary">
              <div className="flex items-center gap-2 text-xs text-text-tertiary mb-1">
                <Phone className="w-3.5 h-3.5" />
                Phone Number
              </div>
              <p className="text-sm font-medium text-text-primary">{profile.phone}</p>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <Link href="/orders">
          <Card className="p-4 text-center" hover>
            <Package className="w-5 h-5 mx-auto text-zumbii-600" />
            <p className="text-xl font-bold text-text-primary mt-2">{profile.ordersCount}</p>
            <p className="text-xs text-text-tertiary">Orders</p>
          </Card>
        </Link>
        <Link href="/wishlist">
          <Card className="p-4 text-center" hover>
            <Heart className="w-5 h-5 mx-auto text-rose-500" />
            <p className="text-xl font-bold text-text-primary mt-2">{profile.wishlistCount}</p>
            <p className="text-xs text-text-tertiary">Wishlist</p>
          </Card>
        </Link>
        <Link href="/account/addresses">
          <Card className="p-4 text-center" hover>
            <MapPin className="w-5 h-5 mx-auto text-amber-500" />
            <p className="text-xl font-bold text-text-primary mt-2">{profile.addressesCount}</p>
            <p className="text-xs text-text-tertiary">Addresses</p>
          </Card>
        </Link>
      </div>

      <Card className="p-5 sm:p-6 mt-6" hover={false}>
        <h3 className="text-base font-bold text-text-primary mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', activity.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                  <p className="text-xs text-text-tertiary">{activity.details}</p>
                </div>
                <span className="text-[11px] text-text-tertiary shrink-0">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-zumbii-50 to-surface border border-zumbii-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-zumbii-600" />
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Become a Seller</h4>
            <p className="text-xs text-text-tertiary">Reach millions of customers across India</p>
          </div>
        </div>
        <Link href="/sell">
          <Button size="sm">
            Learn More
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );

  const renderAddresses = () => (
    <motion.div
      key="addresses"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Saved Addresses</h2>
          <p className="text-sm text-text-tertiary mt-1">Manage your delivery addresses</p>
        </div>
        <Link href="/account/addresses">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4" />
            Manage
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {savedAddresses.map((addr) => (
          <Card key={addr.id} hover={false}>
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                    addr.type === 'home' ? 'bg-violet-100' : 'bg-amber-100'
                  )}>
                    {addr.type === 'home' ? <Home className="w-4 h-4 text-violet-600" /> : <Briefcase className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary text-sm">{addr.name}</span>
                      {addr.isDefault && <Badge variant="default" size="sm">Default</Badge>}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                    <p className="text-sm text-text-secondary">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-sm text-text-secondary mt-0.5">Phone: {addr.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toast.success('Edit address coming soon')}
                    className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-zumbii-600"
                    aria-label="Edit address"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderPayments = () => (
    <motion.div
      key="payments"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Payment Methods</h2>
          <p className="text-sm text-text-tertiary mt-1">Manage your saved payment options</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card key={method.id} hover={false}>
              <div className="p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-tertiary flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-text-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary text-sm">{method.name}</span>
                      {method.isDefault && <Badge variant="default" size="sm">Default</Badge>}
                    </div>
                    <p className="text-xs text-text-tertiary mt-0.5">{method.details}</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.success('Edit payment coming soon')}
                  className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-zumbii-600"
                  aria-label="Edit payment"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-5 sm:p-6" hover={false}>
        <h3 className="text-base font-bold text-text-primary mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {([
            { key: 'email', label: 'Email Notifications', desc: 'Receive order updates and offers via email' },
            { key: 'sms', label: 'SMS Notifications', desc: 'Get shipping alerts on your phone' },
            { key: 'orders', label: 'Order Updates', desc: 'Real-time order status changes' },
            { key: 'promotions', label: 'Promotional Emails', desc: 'Deals, discounts, and marketing' },
            { key: 'newsletter', label: 'Newsletter', desc: 'Weekly market insights and trends' },
          ] as const).map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                <p className="text-xs text-text-tertiary">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                className={clsx(
                  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0',
                  notifications[item.key as keyof typeof notifications] ? 'bg-zumbii-600' : 'bg-surface-tertiary'
                )}
              >
                <span
                  className={clsx(
                    'inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform',
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-[18px]' : 'translate-x-[3px]'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 sm:p-6 mt-4" hover={false}>
        <h3 className="text-base font-bold text-text-primary mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Language</p>
                <p className="text-xs text-text-tertiary">Select your preferred language</p>
              </div>
            </div>
            <select className="text-sm bg-transparent border border-border rounded-lg px-3 py-1.5 text-text-primary focus:outline-none focus:border-zumbii-400">
              <option>English</option>
              <option>Hindi</option>
              <option>Marathi</option>
              <option>Tamil</option>
              <option>Telugu</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sun className={clsx('w-5 h-5 transition-all', darkMode ? 'text-text-tertiary' : 'text-amber-500')} />
                <Moon className={clsx('w-5 h-5 absolute inset-0 transition-all', darkMode ? 'text-zumbii-400' : 'text-text-tertiary')} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Dark Mode</p>
                <p className="text-xs text-text-tertiary">Toggle dark mode appearance</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setDarkMode(!darkMode); toast.success(`Dark mode ${darkMode ? 'disabled' : 'enabled'}`); }}
              className={clsx(
                'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                darkMode ? 'bg-zumbii-600' : 'bg-surface-tertiary'
              )}
            >
              <span
                className={clsx(
                  'inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform',
                  darkMode ? 'translate-x-[18px]' : 'translate-x-[3px]'
                )}
              />
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6 mt-4" hover={false}>
        <h3 className="text-base font-bold text-text-primary mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-tertiary transition-colors">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-text-secondary" />
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">Download My Data</p>
                <p className="text-xs text-text-tertiary">Get a copy of your account data</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-tertiary transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-text-secondary" />
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">Change Password</p>
                <p className="text-xs text-text-tertiary">Update your account password</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-600">Delete Account</p>
                <p className="text-xs text-text-tertiary">Permanently remove your account</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </Card>
    </motion.div>
  );

  const tabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfile();
      case 'addresses': return renderAddresses();
      case 'payments': return renderPayments();
      case 'settings': return renderSettings();
    }
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
            <div className="flex items-center gap-3">
              <CircleUser className="w-6 h-6 text-zumbii-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Account</h1>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-padding py-6 lg:py-8">
        <div className="flex lg:hidden mb-4 overflow-x-auto gap-2 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                  activeTab === tab.id
                    ? 'bg-zumbii-600 text-white shadow-md shadow-zumbii-600/20'
                    : 'bg-surface-tertiary text-text-secondary hover:bg-zumbii-50 hover:text-zumbii-600'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="text-[10px] ml-0.5">({tab.count})</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      activeTab === tab.id
                        ? 'bg-zumbii-50 text-zumbii-700 shadow-sm'
                        : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="text-xs text-text-tertiary">({tab.count})</span>
                      )}
                    </div>
                    {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-zumbii-600" />}
                  </button>
                );
              })}
              <hr className="border-border my-2" />
              <Link
                href="/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-all"
              >
                <Package className="w-4 h-4" />
                My Orders
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-all"
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
              <hr className="border-border my-2" />
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {tabContent()}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
