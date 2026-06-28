"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  Store,
  FileText,
  Eye,
  UserCheck,
  Ban,
} from "lucide-react";

const sellers = [
  { id: "SL-001", name: "GreenLeaf Exports", owner: "Ramesh Gupta", email: "ramesh@greenleaf.com", phone: "+91 98765 43210", category: "Organic Foods", products: 45, revenue: "₹12,45,000", status: "Approved", verified: true, date: "28 Jun 2026" },
  { id: "SL-002", name: "TechHub Electronics", owner: "Neha Singh", email: "neha@techhub.in", phone: "+91 87654 32109", category: "Electronics", products: 128, revenue: "₹45,90,000", status: "Approved", verified: true, date: "27 Jun 2026" },
  { id: "SL-003", name: "ArtisanCrafts India", owner: "Vikram Joshi", email: "vikram@artisancrafts.com", phone: "+91 76543 21098", category: "Handicrafts", products: 67, revenue: "₹8,30,000", status: "Pending", verified: false, date: "26 Jun 2026" },
  { id: "SL-004", name: "FreshBake Studio", owner: "Kavita Reddy", email: "kavita@freshbake.com", phone: "+91 65432 10987", category: "Bakery", products: 23, revenue: "₹3,15,000", status: "Approved", verified: true, date: "25 Jun 2026" },
  { id: "SL-005", name: "LuxuryThreads", owner: "Arjun Mehta", email: "arjun@luxurythreads.in", phone: "+91 54321 09876", category: "Fashion", products: 89, revenue: "₹28,50,000", status: "Under Review", verified: false, date: "24 Jun 2026" },
  { id: "SL-006", name: "WellnessHerbs", owner: "Deepa Nair", email: "deepa@wellnessherbs.com", phone: "+91 43210 98765", category: "Ayurveda", products: 34, revenue: "₹5,60,000", status: "Pending", verified: false, date: "23 Jun 2026" },
  { id: "SL-007", name: "FitLife Sports", owner: "Rohit Sharma", email: "rohit@fitlife.in", phone: "+91 32109 87654", category: "Sports", products: 56, revenue: "₹18,20,000", status: "Suspended", verified: true, date: "22 Jun 2026" },
  { id: "SL-008", name: "EcoVibe Décor", owner: "Priya Kapoor", email: "priya@ecovibe.com", phone: "+91 21098 76543", category: "Home Decor", products: 41, revenue: "₹7,85,000", status: "Approved", verified: true, date: "21 Jun 2026" },
  { id: "SL-009", name: "DigitalGizmo", owner: "Sahil Verma", email: "sahil@digitalgizmo.in", phone: "+91 10987 65432", category: "Electronics", products: 72, revenue: "₹32,40,000", status: "Under Review", verified: false, date: "20 Jun 2026" },
  { id: "SL-010", name: "PureOrganics Farm", owner: "Anita Deshmukh", email: "anita@pureorganics.com", phone: "+91 09876 54321", category: "Organic Foods", products: 18, revenue: "₹2,30,000", status: "Rejected", verified: false, date: "19 Jun 2026" },
];

const statusStyles: Record<string, string> = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Suspended: "bg-red-100 text-red-700",
  Rejected: "bg-rose-100 text-rose-700",
};

const statusIcons: Record<string, typeof CheckCircle> = {
  Approved: CheckCircle,
  Pending: Clock,
  "Under Review": AlertTriangle,
  Suspended: Ban,
  Rejected: XCircle,
};

const statusFilters = ["All", "Approved", "Pending", "Under Review", "Suspended", "Rejected"];

export default function SellerApprovalsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? sellers : sellers.filter((s) => s.status === activeFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage seller registrations</p>
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
            placeholder="Search sellers..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
          />
        </div>
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeFilter === s
                ? "bg-zumbii-500 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {statusFilters.slice(1).map((s) => {
          const count = sellers.filter((sl) => sl.status === s).length;
          const Icon = statusIcons[s] || Clock;
          return (
            <div key={s} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3" onClick={() => setActiveFilter(s)}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                s === "Approved" ? "bg-emerald-100 text-emerald-600" :
                s === "Pending" ? "bg-amber-100 text-amber-600" :
                s === "Under Review" ? "bg-blue-100 text-blue-600" :
                s === "Suspended" ? "bg-red-100 text-red-600" :
                "bg-rose-100 text-rose-600"
              }`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500">{s}</p>
              </div>
            </div>
          );
        })}
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
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Seller</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Owner</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Products</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Revenue</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Verification</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((seller, i) => {
                const StatusIcon = statusIcons[seller.status] || Clock;
                return (
                  <motion.tr
                    key={seller.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-zumbii-400 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                          {seller.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{seller.name}</p>
                          <p className="text-xs text-gray-500">{seller.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-900">{seller.owner}</p>
                      <p className="text-xs text-gray-500">{seller.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {seller.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{seller.products}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{seller.revenue}</td>
                    <td className="py-3 px-4">
                      {seller.verified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <Shield size={12} className="text-emerald-500" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                          <AlertTriangle size={12} />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[seller.status]}`}>
                        <StatusIcon size={12} />
                        {seller.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                          <FileText size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-emerald-600">
                          <UserCheck size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-600">
                          <XCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No sellers found</div>
        )}
      </motion.div>
    </div>
  );
}
