'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Clock,
  MapPin,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Download,
  HelpCircle,
  CircleDot,
  FileText,
  Loader2,
  Ban,
  Archive,
  Star,
  ShoppingBag,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import type { OrderStatus, Address, CartItem, TrackingInfo } from '@/types';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  shippingAddress: Address;
  estimatedDelivery: string;
  tracking: TrackingInfo[];
  createdAt: string;
  deliveredAt?: string;
  returnEligible: boolean;
  cancelEligible: boolean;
}

const orderStatusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-sky-100 text-sky-700 border-sky-200', icon: Loader2 },
  shipped: { label: 'Shipped', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  returned: { label: 'Returned', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: RotateCcw },
};

const trackingStages = [
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Loader2 },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: MapPin },
];

const sampleOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ZUM-2026-0001',
    items: [
      { id: 'item-1', name: 'Premium Wireless Headphones Pro', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', price: 2499, quantity: 1 },
      { id: 'item-2', name: 'Wireless Charging Pad', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', price: 1499, quantity: 1 },
    ],
    status: 'delivered',
    total: 4247,
    subtotal: 3998,
    shipping: 99,
    tax: 480,
    discount: 330,
    paymentMethod: 'UPI',
    shippingAddress: {
      id: 'addr-1', name: 'Rahul Sharma', phone: '+91 98765 43210',
      line1: '42, Gandhi Nagar, Andheri East', city: 'Mumbai', state: 'Maharashtra', pincode: '400069',
      isDefault: true, type: 'home',
    },
    estimatedDelivery: 'Jun 20, 2026',
    tracking: [
      { status: 'Order Confirmed', location: 'Mumbai', timestamp: 'Jun 14, 2026 10:30 AM', description: 'Order has been confirmed and is being processed.' },
      { status: 'Processing', location: 'Mumbai Warehouse', timestamp: 'Jun 15, 2026 02:15 PM', description: 'Item is being packed and quality checked.' },
      { status: 'Shipped', location: 'Mumbai Hub', timestamp: 'Jun 16, 2026 08:00 AM', description: 'Package has been shipped via SpeedPost.' },
      { status: 'Delivered', location: 'Mumbai - Andheri East', timestamp: 'Jun 18, 2026 11:45 AM', description: 'Package delivered successfully. Signed by Rahul.' },
    ],
    createdAt: 'Jun 14, 2026',
    deliveredAt: 'Jun 18, 2026',
    returnEligible: true,
    cancelEligible: false,
  },
  {
    id: 'ord-2',
    orderNumber: 'ZUM-2026-0002',
    items: [
      { id: 'item-3', name: 'Smart Watch Ultra X2', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', price: 5999, quantity: 1 },
    ],
    status: 'shipped',
    total: 6718,
    subtotal: 5999,
    shipping: 149,
    tax: 720,
    discount: 150,
    paymentMethod: 'Credit Card',
    shippingAddress: {
      id: 'addr-2', name: 'Rahul Sharma', phone: '+91 98765 43210',
      line1: 'Suite 301, Tech Park, MG Road', line2: 'Bellandur', city: 'Bangalore', state: 'Karnataka', pincode: '560001',
      isDefault: false, type: 'work',
    },
    estimatedDelivery: 'Jun 28, 2026',
    tracking: [
      { status: 'Order Confirmed', location: 'Bangalore', timestamp: 'Jun 22, 2026 09:00 AM', description: 'Order confirmed and payment verified.' },
      { status: 'Processing', location: 'Bangalore Warehouse', timestamp: 'Jun 23, 2026 11:30 AM', description: 'Product is being prepared for shipping.' },
      { status: 'Shipped', location: 'Bangalore Hub', timestamp: 'Jun 24, 2026 04:00 PM', description: 'Package is in transit via Express Delivery.' },
    ],
    createdAt: 'Jun 22, 2026',
    returnEligible: false,
    cancelEligible: true,
  },
  {
    id: 'ord-3',
    orderNumber: 'ZUM-2026-0003',
    items: [
      { id: 'item-4', name: 'Organic Cotton T-Shirt Pack', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', price: 1299, quantity: 3 },
      { id: 'item-5', name: 'Running Shoes Ultra Comfort', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', price: 4999, quantity: 1 },
    ],
    status: 'processing',
    total: 9344,
    subtotal: 8896,
    shipping: 0,
    tax: 1068,
    discount: 620,
    paymentMethod: 'Cash on Delivery',
    shippingAddress: {
      id: 'addr-1', name: 'Rahul Sharma', phone: '+91 98765 43210',
      line1: '42, Gandhi Nagar, Andheri East', city: 'Mumbai', state: 'Maharashtra', pincode: '400069',
      isDefault: true, type: 'home',
    },
    estimatedDelivery: 'Jul 2, 2026',
    tracking: [
      { status: 'Order Confirmed', location: 'Mumbai', timestamp: 'Jun 25, 2026 08:15 AM', description: 'Order confirmed.' },
      { status: 'Processing', location: 'Mumbai Warehouse', timestamp: 'Jun 26, 2026 01:00 PM', description: 'Items are being picked and packed.' },
    ],
    createdAt: 'Jun 25, 2026',
    returnEligible: false,
    cancelEligible: true,
  },
  {
    id: 'ord-4',
    orderNumber: 'ZUM-2026-0004',
    items: [
      { id: 'item-6', name: '4K Action Camera HDR', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80', price: 12999, quantity: 1 },
    ],
    status: 'cancelled',
    total: 13098,
    subtotal: 12999,
    shipping: 99,
    tax: 0,
    discount: 0,
    paymentMethod: 'Net Banking',
    shippingAddress: {
      id: 'addr-1', name: 'Rahul Sharma', phone: '+91 98765 43210',
      line1: '42, Gandhi Nagar, Andheri East', city: 'Mumbai', state: 'Maharashtra', pincode: '400069',
      isDefault: true, type: 'home',
    },
    estimatedDelivery: 'Jun 30, 2026',
    tracking: [
      { status: 'Order Confirmed', location: 'Mumbai', timestamp: 'Jun 20, 2026 10:00 AM', description: 'Order confirmed.' },
    ],
    createdAt: 'Jun 20, 2026',
    returnEligible: false,
    cancelEligible: false,
  },
  {
    id: 'ord-5',
    orderNumber: 'ZUM-2026-0005',
    items: [
      { id: 'item-7', name: 'Handcrafted Ceramic Dinner Set', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80', price: 3499, quantity: 1 },
      { id: 'item-8', name: 'Bamboo Cutting Board Set', image: 'https://images.unsplash.com/photo-1594221708774-ec786d2ab66c?w=400&q=80', price: 999, quantity: 2 },
    ],
    status: 'returned',
    total: 5746,
    subtotal: 5497,
    shipping: 0,
    tax: 660,
    discount: 411,
    paymentMethod: 'Wallet',
    shippingAddress: {
      id: 'addr-1', name: 'Rahul Sharma', phone: '+91 98765 43210',
      line1: '42, Gandhi Nagar, Andheri East', city: 'Mumbai', state: 'Maharashtra', pincode: '400069',
      isDefault: true, type: 'home',
    },
    estimatedDelivery: 'Jun 10, 2026',
    tracking: [
      { status: 'Order Confirmed', location: 'Mumbai', timestamp: 'Jun 2, 2026 11:00 AM', description: 'Order confirmed.' },
      { status: 'Processing', location: 'Mumbai Warehouse', timestamp: 'Jun 3, 2026 09:30 AM', description: 'Items packed.' },
      { status: 'Shipped', location: 'Mumbai Hub', timestamp: 'Jun 4, 2026 02:00 PM', description: 'Shipped via Standard Delivery.' },
      { status: 'Delivered', location: 'Mumbai - Andheri East', timestamp: 'Jun 7, 2026 10:00 AM', description: 'Delivered.' },
    ],
    createdAt: 'Jun 2, 2026',
    deliveredAt: 'Jun 7, 2026',
    returnEligible: false,
    cancelEligible: false,
  },
];

const statusFilters: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'returned', label: 'Returned' },
];

function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancelDialog, setCancelDialog] = useState<string | null>(null);
  const [returnDialog, setReturnDialog] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredOrders = sampleOrders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.items.some((item) => item.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCancelOrder = (orderId: string) => {
    setActionLoading(true);
    setTimeout(() => {
      toast.success('Order cancelled successfully');
      setCancelDialog(null);
      setActionLoading(false);
    }, 1500);
  };

  const handleReturnOrder = (orderId: string) => {
    setActionLoading(true);
    setTimeout(() => {
      toast.success('Return request initiated. Pickup scheduled.');
      setReturnDialog(null);
      setActionLoading(false);
    }, 1500);
  };

  const handleReorder = (order: Order) => {
    toast.success('Items added to cart');
  };

  const handleDownloadInvoice = (order: Order) => {
    toast.success('Invoice downloaded');
  };

  const getActiveStageIndex = (status: OrderStatus) => {
    if (status === 'cancelled' || status === 'returned') return -1;
    return trackingStages.findIndex((s) => s.key === status);
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
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-zumbii-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Orders</h1>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-padding py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or product name..."
              className="w-full h-11 pl-10 pr-4 text-sm bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {statusFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={clsx(
                  'whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium transition-all',
                  statusFilter === filter.key
                    ? 'bg-zumbii-600 text-white shadow-md shadow-zumbii-600/20'
                    : 'bg-surface-tertiary text-text-secondary hover:bg-zumbii-50 hover:text-zumbii-600'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto rounded-3xl bg-surface-tertiary flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-text-tertiary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">No orders found</h2>
            <p className="text-text-tertiary mb-8 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'You haven\'t placed any orders yet'}
            </p>
            <Link href="/marketplace">
              <Button size="lg">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = orderStatusConfig[order.status].icon;
              const isExpanded = expandedOrder === order.id;
              const activeStage = getActiveStageIndex(order.status);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="overflow-hidden" hover={false}>
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs text-text-tertiary">Order</p>
                            <p className="text-sm font-bold text-text-primary font-mono">{order.orderNumber}</p>
                          </div>
                          <span className={clsx(
                            'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border',
                            orderStatusConfig[order.status].color
                          )}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {orderStatusConfig[order.status].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-text-tertiary">Placed on</span>
                          <span className="font-medium text-text-primary">{order.createdAt}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-surface-tertiary shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                              <p className="text-xs text-text-tertiary">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold text-text-primary shrink-0">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            className="text-xs font-medium text-zumbii-600 hover:text-zumbii-700 flex items-center gap-1"
                          >
                            {isExpanded ? 'Show less' : `+${order.items.length - 2} more item(s)`}
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {isExpanded && order.items.length > 2 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 pt-3 border-t border-border mt-3">
                              {order.items.slice(2).map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-surface-tertiary shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                                    <p className="text-xs text-text-tertiary">Qty: {item.quantity}</p>
                                  </div>
                                  <span className="text-sm font-semibold text-text-primary shrink-0">
                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-text-tertiary">Total:</span>
                          <span className="text-lg font-bold text-zumbii-600">₹{order.total.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-text-tertiary">via {order.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-zumbii-600"
                            aria-label="Download invoice"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-zumbii-600"
                            aria-label="Toggle details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-border"
                        >
                          <div className="p-4 sm:p-5 bg-surface-secondary space-y-6">
                            {(order.status === 'shipped' || order.status === 'delivered' || order.status === 'processing' || order.status === 'confirmed') && (
                              <div>
                                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Order Timeline</h4>
                                <div className="relative">
                                  <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-border" />
                                  <div className="space-y-0">
                                    {trackingStages.map((stage, idx) => {
                                      const StageIcon = stage.icon;
                                      const isActive = idx <= activeStage;
                                      const isLast = idx === trackingStages.length - 1;
                                      return (
                                        <div key={stage.key} className="relative flex items-start gap-4 pb-6 last:pb-0">
                                          <div
                                            className={clsx(
                                              'relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                                              isActive ? 'bg-zumbii-600 text-white shadow-md shadow-zumbii-600/30' : 'bg-surface text-text-tertiary border-2 border-border'
                                            )}
                                          >
                                            <StageIcon className={clsx('w-4 h-4', isActive ? 'text-white' : 'text-text-tertiary')} />
                                          </div>
                                          <div className="pt-1">
                                            <p className={clsx('text-sm font-medium', isActive ? 'text-text-primary' : 'text-text-tertiary')}>
                                              {stage.label}
                                            </p>
                                            {isLast && order.deliveredAt && (
                                              <p className="text-xs text-emerald-600 font-medium mt-0.5">Delivered on {order.deliveredAt}</p>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}

                            {(order.status === 'cancelled' || order.status === 'returned') && (
                              <div className={clsx(
                                'p-4 rounded-2xl border flex items-start gap-3',
                                order.status === 'cancelled' ? 'bg-red-50 border-red-200' : 'bg-rose-50 border-rose-200'
                              )}>
                                {order.status === 'cancelled' ? (
                                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                ) : (
                                  <RotateCcw className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <h4 className="text-sm font-semibold text-text-primary">
                                    Order {order.status === 'cancelled' ? 'Cancelled' : 'Returned'}
                                  </h4>
                                  <p className="text-xs text-text-tertiary mt-1">
                                    {order.status === 'cancelled'
                                      ? 'Your order has been cancelled. Refund will be processed within 5-7 business days.'
                                      : 'Your return request has been processed. Refund will be initiated after quality check.'}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">Shipping Address</h4>
                                <div className="text-sm text-text-secondary">
                                  <p className="font-medium text-text-primary">{order.shippingAddress.name}</p>
                                  <p>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}</p>
                                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                  <p>{order.shippingAddress.phone}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">Payment Info</h4>
                                <div className="text-sm text-text-secondary">
                                  <p className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-text-tertiary" />
                                    {order.paymentMethod}
                                  </p>
                                  <p>Estimated Delivery: {order.estimatedDelivery}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {order.cancelEligible && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCancelDialog(order.id)}
                                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Cancel Order
                                </Button>
                              )}
                              {order.returnEligible && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setReturnDialog(order.id)}
                                  className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                  Return / Replace
                                </Button>
                              )}
                              {order.status === 'delivered' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReorder(order)}
                                >
                                  <ShoppingBag className="w-4 h-4" />
                                  Reorder
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadInvoice(order)}
                              >
                                <Download className="w-4 h-4" />
                                Invoice
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                <HelpCircle className="w-4 h-4" />
                                Need Help
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {cancelDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setCancelDialog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <XCircle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-text-primary text-center">Cancel Order?</h3>
              <p className="text-sm text-text-tertiary text-center mt-2">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  onClick={() => setCancelDialog(null)}
                >
                  Keep Order
                </Button>
                <Button
                  size="md"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => handleCancelOrder(cancelDialog)}
                  loading={actionLoading}
                >
                  Yes, Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {returnDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setReturnDialog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <RotateCcw className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-text-primary text-center">Return / Replace</h3>
              <p className="text-sm text-text-tertiary text-center mt-2">
                We&apos;ll schedule a free pickup for the item. Refund will be processed after quality check.
              </p>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  onClick={() => setReturnDialog(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="md"
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={() => handleReturnOrder(returnDialog)}
                  loading={actionLoading}
                >
                  Confirm Return
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OrdersPage;
