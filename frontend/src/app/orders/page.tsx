'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthGuard } from '@/hooks/useRequireAuth';
import {
  ordersApi,
  resolveImageUrl,
  ApiError,
  type BackendOrder,
  type BackendOrderStatus,
} from '@/lib/api';

const statusConfig: Record<BackendOrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  PROCESSING: { label: 'Processing', color: 'bg-sky-100 text-sky-700 border-sky-200', icon: Loader2 },
  SHIPPED: { label: 'Shipped', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  REFUNDED: { label: 'Refunded', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: RotateCcw },
};

const paymentStatusLabel: Record<string, string> = {
  PENDING: 'Payment pending',
  PAID: 'Paid',
  FAILED: 'Payment failed',
  REFUNDED: 'Refunded',
};

const trackingStages: { key: BackendOrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
  { key: 'PROCESSING', label: 'Processing', icon: Loader2 },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: MapPin },
];

const statusFilters: { key: BackendOrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
  { key: 'REFUNDED', label: 'Refunded' },
];

function money(value: string): string {
  return Number(value).toLocaleString('en-IN');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getActiveStageIndex(status: BackendOrderStatus): number {
  if (status === 'CANCELLED' || status === 'REFUNDED') return -1;
  return trackingStages.findIndex((s) => s.key === status);
}

function OrdersPage() {
  const { ready: authReady, authenticated } = useAuthGuard();

  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BackendOrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    setLoading(true);
    ordersApi
      .myOrders({ page: 1, limit: 10 })
      .then((res) => {
        if (cancelled) return;
        setOrders(res.data);
        setPage(res.page);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof ApiError ? err.message : 'Failed to load orders');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const res = await ordersApi.myOrders({ page: page + 1, limit: 10 });
      setOrders((prev) => [...prev, ...res.data]);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load more orders');
    } finally {
      setLoadingMore(false);
    }
  }

  const filteredOrders = orders.filter((order) => {
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

  if (!authReady || !authenticated) {
    return <div className="min-h-screen bg-surface" />;
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

        {loading ? (
          <div className="flex items-center justify-center py-20 text-text-tertiary">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
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
                : "You haven't placed any orders yet"}
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
              const StatusIcon = statusConfig[order.status].icon;
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
                            statusConfig[order.status].color
                          )}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig[order.status].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-text-tertiary">Placed on</span>
                          <span className="font-medium text-text-primary">{formatDate(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-surface-tertiary shrink-0">
                              <Image src={resolveImageUrl(item.image)} alt={item.name} fill className="object-cover" sizes="64px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                              <p className="text-xs text-text-tertiary">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold text-text-primary shrink-0">
                              ₹{money(item.total)}
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
                                    <Image src={resolveImageUrl(item.image)} alt={item.name} fill className="object-cover" sizes="64px" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                                    <p className="text-xs text-text-tertiary">Qty: {item.quantity}</p>
                                  </div>
                                  <span className="text-sm font-semibold text-text-primary shrink-0">
                                    ₹{money(item.total)}
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
                          <span className="text-lg font-bold text-zumbii-600">₹{money(order.total)}</span>
                          <span className="text-xs text-text-tertiary">
                            {paymentStatusLabel[order.paymentStatus] ?? order.paymentStatus}
                          </span>
                        </div>
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-zumbii-600"
                          aria-label="Toggle details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
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
                            {activeStage >= 0 && (
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
                                              <p className="text-xs text-emerald-600 font-medium mt-0.5">Delivered on {formatDate(order.deliveredAt)}</p>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}

                            {(order.status === 'CANCELLED' || order.status === 'REFUNDED') && (
                              <div className={clsx(
                                'p-4 rounded-2xl border flex items-start gap-3',
                                order.status === 'CANCELLED' ? 'bg-red-50 border-red-200' : 'bg-rose-50 border-rose-200'
                              )}>
                                {order.status === 'CANCELLED' ? (
                                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                ) : (
                                  <RotateCcw className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <h4 className="text-sm font-semibold text-text-primary">
                                    Order {order.status === 'CANCELLED' ? 'Cancelled' : 'Refunded'}
                                  </h4>
                                  <p className="text-xs text-text-tertiary mt-1">
                                    {order.cancelReason ||
                                      (order.status === 'CANCELLED'
                                        ? 'This order was cancelled.'
                                        : 'This order was refunded.')}
                                  </p>
                                  {order.cancelledAt && (
                                    <p className="text-xs text-text-tertiary mt-1">
                                      {formatDate(order.cancelledAt)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">Shipping Address</h4>
                                <div className="text-sm text-text-secondary">
                                  <p className="font-medium text-text-primary">{order.address.label}</p>
                                  <p>{order.address.street}</p>
                                  <p>{order.address.city}, {order.address.state} - {order.address.zipCode}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">Order Summary</h4>
                                <div className="text-sm text-text-secondary space-y-1">
                                  <div className="flex justify-between"><span>Subtotal</span><span>₹{money(order.subtotal)}</span></div>
                                  <div className="flex justify-between"><span>Shipping ({order.shippingMethod})</span><span>₹{money(order.shippingCost)}</span></div>
                                  <div className="flex justify-between"><span>Tax</span><span>₹{money(order.taxAmount)}</span></div>
                                  {Number(order.discountAmount) > 0 && (
                                    <div className="flex justify-between"><span>Discount</span><span>-₹{money(order.discountAmount)}</span></div>
                                  )}
                                  <div className="flex justify-between font-semibold text-text-primary pt-1 border-t border-border mt-1">
                                    <span>Total</span><span>₹{money(order.total)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}

            {page < totalPages && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" onClick={loadMore} loading={loadingMore} disabled={loadingMore}>
                  Load more orders
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
