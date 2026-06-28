"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  IndianRupee,
  Package,
  Users,
  Store,
  Handshake,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const stats = [
  { label: "Total Orders", value: "12,458", change: "+12.5%", up: true, icon: ShoppingCart, color: "from-blue-500 to-blue-600" },
  { label: "Revenue", value: "₹84,52,390", change: "+8.2%", up: true, icon: IndianRupee, color: "from-emerald-500 to-emerald-600" },
  { label: "Products", value: "3,847", change: "+4.1%", up: true, icon: Package, color: "from-violet-500 to-violet-600" },
  { label: "Users", value: "45,291", change: "+18.7%", up: true, icon: Users, color: "from-amber-500 to-amber-600" },
  { label: "Sellers", value: "892", change: "-2.4%", up: false, icon: Store, color: "from-rose-500 to-rose-600" },
  { label: "Franchise Leads", value: "1,247", change: "+32.1%", up: true, icon: Handshake, color: "from-cyan-500 to-cyan-600" },
];

const recentOrders = [
  { id: "#ORD-001", customer: "Rajesh Sharma", product: "Wireless Headphones", amount: "₹2,499", status: "Delivered", time: "2 min ago" },
  { id: "#ORD-002", customer: "Priya Patel", product: "Cotton T-Shirt Pack", amount: "₹899", status: "Processing", time: "15 min ago" },
  { id: "#ORD-003", customer: "Amit Kumar", product: "Smart Watch Pro", amount: "₹4,999", status: "Shipped", time: "1 hr ago" },
  { id: "#ORD-004", customer: "Sneha Reddy", product: "Organic Green Tea", amount: "₹349", status: "Pending", time: "2 hrs ago" },
  { id: "#ORD-005", customer: "Vikram Singh", product: "Leather Wallet", amount: "₹1,299", status: "Delivered", time: "3 hrs ago" },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-violet-100 text-violet-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

const topProducts = [
  { name: "Wireless Bluetooth Headphones", sales: 1247, revenue: "₹31,17,500", growth: 12 },
  { name: "Premium Cotton T-Shirts", sales: 982, revenue: "₹8,83,800", growth: 8 },
  { name: "Smart Watch Pro Max", sales: 756, revenue: "₹37,80,000", growth: 24 },
  { name: "Organic Green Tea Pack", sales: 634, revenue: "₹2,21,900", growth: -3 },
  { name: "Handcrafted Leather Bag", sales: 521, revenue: "₹6,77,300", growth: 18 },
];

const recentLeads = [
  { name: "Sunil Verma", location: "Lucknow, UP", investment: "₹15-20 L", status: "Hot", date: "Today" },
  { name: "Anita Desai", location: "Pune, MH", investment: "₹10-15 L", status: "Warm", date: "Yesterday" },
  { name: "Rahul Jain", location: "Jaipur, RJ", investment: "₹20-30 L", status: "Cold", date: "2 days ago" },
  { name: "Deepa Nair", location: "Kochi, KL", investment: "₹8-12 L", status: "Hot", date: "3 days ago" },
  { name: "Mohd. Arif", location: "Hyderabad, TS", investment: "₹25-40 L", status: "Warm", date: "4 days ago" },
];

const leadStyles: Record<string, string> = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-amber-100 text-amber-700",
  Cold: "bg-blue-100 text-blue-700",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-emerald-600" : "text-red-600"}`}>
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Revenue Overview</h3>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 text-gray-600">
              <option>This Year</option>
              <option>This Month</option>
              <option>This Week</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {Array.from({ length: 12 }).map((_, i) => {
              const h = 30 + Math.random() * 60;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(h * 12000).toLocaleString()}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.4 + i * 0.03, duration: 0.5 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-zumbii-500 to-zumbii-300 hover:from-zumbii-600 hover:to-zumbii-400 transition-colors cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 mt-1">
                    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Top Selling Products</h3>
            <button className="text-xs text-zumbii-600 hover:text-zumbii-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.sales.toLocaleString()} sold &middot; {p.revenue}</p>
                </div>
                <span className={`text-xs font-medium ${p.growth >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {p.growth >= 0 ? "+" : ""}{p.growth}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-xs text-zumbii-600 hover:text-zumbii-700 font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Order</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Customer</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Amount</th>
                  <th className="text-left py-2 px-2 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-2 font-medium text-gray-900">{order.id}</td>
                    <td className="py-2.5 px-2 text-gray-600">{order.customer}</td>
                    <td className="py-2.5 px-2 text-gray-900">{order.amount}</td>
                    <td className="py-2.5 px-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Franchise Leads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Franchise Leads</h3>
            <button className="text-xs text-zumbii-600 hover:text-zumbii-700 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zumbii-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.location} &middot; {lead.investment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${leadStyles[lead.status]}`}>
                    {lead.status}
                  </span>
                  <span className="text-xs text-gray-400">{lead.date}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
