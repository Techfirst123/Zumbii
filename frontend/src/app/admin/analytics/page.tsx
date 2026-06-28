"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  IndianRupee,
  Eye,
  MousePointerClick,
  Percent,
  ArrowUpRight,
  Calendar,
  Download,
} from "lucide-react";

const analyticsStats = [
  { label: "Total Visitors", value: "2,84,591", change: "+12.5%", up: true, icon: Eye, color: "from-blue-500 to-blue-600" },
  { label: "Page Views", value: "8,47,230", change: "+8.2%", up: true, icon: MousePointerClick, color: "from-violet-500 to-violet-600" },
  { label: "Conversion Rate", value: "3.24%", change: "+0.8%", up: true, icon: Percent, color: "from-emerald-500 to-emerald-600" },
  { label: "Avg. Session", value: "4m 32s", change: "-12s", up: false, icon: TrendingUp, color: "from-amber-500 to-amber-600" },
  { label: "Bounce Rate", value: "38.7%", change: "-2.1%", up: true, icon: TrendingDown, color: "from-rose-500 to-rose-600" },
  { label: "Total Sales", value: "₹1,24,52,390", change: "+15.3%", up: true, icon: IndianRupee, color: "from-cyan-500 to-cyan-600" },
];

const pageViews = [
  { page: "/", views: 84520, unique: 62340, avgTime: "2m 15s", bounce: "32%" },
  { page: "/products", views: 56230, unique: 38910, avgTime: "4m 42s", bounce: "28%" },
  { page: "/categories", views: 34120, unique: 21450, avgTime: "3m 08s", bounce: "35%" },
  { page: "/marketplace", views: 28940, unique: 18760, avgTime: "5m 12s", bounce: "24%" },
  { page: "/franchise", views: 12340, unique: 8450, avgTime: "6m 30s", bounce: "18%" },
  { page: "/sell", views: 8760, unique: 5670, avgTime: "7m 15s", bounce: "22%" },
];

const deviceData = [
  { label: "Mobile", percentage: 62, color: "bg-blue-500" },
  { label: "Desktop", percentage: 28, color: "bg-violet-500" },
  { label: "Tablet", percentage: 10, color: "bg-emerald-500" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track performance metrics and user behavior</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-gray-600">Last 30 Days</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {analyticsStats.map((stat, i) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Traffic Overview</h3>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 text-gray-600">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const visitors = 30 + Math.random() * 60;
              const pageviews = visitors * (1.5 + Math.random() * 2);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "100%" }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(pageviews / 200) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="w-full rounded-t-md bg-gradient-to-t from-violet-400 to-violet-300 opacity-60"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(visitors / 200) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-blue-500" />
              Visitors
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-violet-300" />
              Page Views
            </div>
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            {deviceData.map((d) => (
              <div key={d.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">{d.label}</span>
                  <span className="font-medium text-gray-900">{d.percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className={`h-full rounded-full ${d.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Geographic Distribution</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">India</span>
                <span className="font-medium text-gray-900">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">USA</span>
                <span className="font-medium text-gray-900">8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">UAE</span>
                <span className="font-medium text-gray-900">5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Others</span>
                <span className="font-medium text-gray-900">9%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Page Views Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Top Pages</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Page</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Views</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Unique Visitors</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Avg. Time</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              {pageViews.map((p, i) => (
                <motion.tr
                  key={p.page}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.03 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">{p.page}</td>
                  <td className="py-3 px-4 text-gray-900">{p.views.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-600">{p.unique.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-600">{p.avgTime}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {p.bounce}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
