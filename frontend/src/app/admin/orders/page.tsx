"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Eye,
  MoreHorizontal,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
} from "lucide-react";

const orders = [
  { id: "#ORD-10241", customer: "Rajesh Sharma", email: "rajesh@email.com", product: "Wireless Bluetooth Headphones", amount: "₹2,499", payment: "Paid", status: "Delivered", date: "28 Jun 2026", items: 2 },
  { id: "#ORD-10242", customer: "Priya Patel", email: "priya@email.com", product: "Cotton T-Shirt Pack", amount: "₹899", payment: "Paid", status: "Processing", date: "28 Jun 2026", items: 1 },
  { id: "#ORD-10243", customer: "Amit Kumar", email: "amit@email.com", product: "Smart Watch Pro", amount: "₹4,999", payment: "Pending", status: "Shipped", date: "27 Jun 2026", items: 1 },
  { id: "#ORD-10244", customer: "Sneha Reddy", email: "sneha@email.com", product: "Organic Green Tea Pack", amount: "₹349", payment: "Paid", status: "Pending", date: "27 Jun 2026", items: 3 },
  { id: "#ORD-10245", customer: "Vikram Singh", email: "vikram@email.com", product: "Leather Wallet", amount: "₹1,299", payment: "Failed", status: "Cancelled", date: "26 Jun 2026", items: 1 },
  { id: "#ORD-10246", customer: "Meera Iyer", email: "meera@email.com", product: "Yoga Mat Premium", amount: "₹1,799", payment: "Paid", status: "Delivered", date: "26 Jun 2026", items: 2 },
  { id: "#ORD-10247", customer: "Arjun Nair", email: "arjun@email.com", product: "Stainless Steel Bottle", amount: "₹599", payment: "Paid", status: "Processing", date: "25 Jun 2026", items: 1 },
  { id: "#ORD-10248", customer: "Kavita Joshi", email: "kavita@email.com", product: "Silk Saree Collection", amount: "₹5,999", payment: "Pending", status: "Pending", date: "25 Jun 2026", items: 1 },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-violet-100 text-violet-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statusIcons: Record<string, typeof CheckCircle> = {
  Delivered: CheckCircle,
  Processing: Clock,
  Shipped: Truck,
  Pending: AlertCircle,
  Cancelled: XCircle,
};

const statuses = ["All", "Delivered", "Processing", "Shipped", "Pending", "Cancelled"];

export default function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState("All");

  const filtered = activeStatus === "All" ? orders : orders.filter((o) => o.status === activeStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeStatus === s
                  ? "bg-zumbii-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Order</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Product</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Payment</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const StatusIcon = statusIcons[order.status] || AlertCircle;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 px-4">
                      <p className="text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">{order.product}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{order.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        order.payment === "Paid" ? "bg-emerald-100 text-emerald-700" :
                        order.payment === "Pending" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {order.payment}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[order.status]}`}>
                        <StatusIcon size={12} />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{order.date}</td>
                    <td className="py-3 px-4">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                        <Eye size={16} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No orders found</div>
        )}
      </motion.div>
    </div>
  );
}
