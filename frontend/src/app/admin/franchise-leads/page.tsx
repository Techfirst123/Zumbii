"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Flame,
  Snowflake,
  Thermometer,
} from "lucide-react";

const leads = [
  { id: "FL-001", name: "Sunil Verma", email: "sunil@email.com", phone: "+91 98765 43210", location: "Lucknow, UP", investment: "₹15-20 L", status: "Hot", date: "28 Jun 2026", source: "Website", notes: "Owns a retail shop, looking for fashion franchise" },
  { id: "FL-002", name: "Anita Desai", email: "anita@email.com", phone: "+91 87654 32109", location: "Pune, MH", investment: "₹10-15 L", status: "Warm", date: "27 Jun 2026", source: "Referral", notes: "Interested in food franchise" },
  { id: "FL-003", name: "Rahul Jain", email: "rahul@email.com", phone: "+91 76543 21098", location: "Jaipur, RJ", investment: "₹20-30 L", status: "Cold", date: "26 Jun 2026", source: "Facebook", notes: "Just browsing, needs follow-up" },
  { id: "FL-004", name: "Deepa Nair", email: "deepa@email.com", phone: "+91 65432 10987", location: "Kochi, KL", investment: "₹8-12 L", status: "Hot", date: "25 Jun 2026", source: "Google", notes: "Ready to invest, wants retail space" },
  { id: "FL-005", name: "Mohd. Arif", email: "arif@email.com", phone: "+91 54321 09876", location: "Hyderabad, TS", investment: "₹25-40 L", status: "Warm", date: "24 Jun 2026", source: "Instagram", notes: "Looking for multiple locations" },
  { id: "FL-006", name: "Priya Sharma", email: "priya.s@email.com", phone: "+91 43210 98765", location: "Delhi, DL", investment: "₹50 L+", status: "Hot", date: "23 Jun 2026", source: "Website", notes: "Serious investor, wants master franchise" },
  { id: "FL-007", name: "Vikash Yadav", email: "vikash@email.com", phone: "+91 32109 87654", location: "Patna, BR", investment: "₹5-10 L", status: "Cold", date: "22 Jun 2026", source: "WhatsApp", notes: "Limited budget, needs guidance" },
  { id: "FL-008", name: "Sangeeta Roy", email: "sangeeta@email.com", phone: "+91 21098 76543", location: "Kolkata, WB", investment: "₹10-20 L", status: "Warm", date: "21 Jun 2026", source: "Referral", notes: "Experienced business owner" },
];

const statusStyles: Record<string, string> = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-amber-100 text-amber-700",
  Cold: "bg-blue-100 text-blue-700",
};

const statusIcons: Record<string, typeof Flame> = {
  Hot: Flame,
  Warm: Thermometer,
  Cold: Snowflake,
};

const statuses = ["All", "Hot", "Warm", "Cold"];

export default function FranchiseLeadsPage() {
  const [activeStatus, setActiveStatus] = useState("All");

  const filtered = activeStatus === "All" ? leads : leads.filter((l) => l.status === activeStatus);

  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Franchise Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage franchise inquiries and leads</p>
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
            placeholder="Search leads..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
          />
        </div>
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

      {/* Leads Grid / Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Lead</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Location</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Investment</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Source</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const StatusIcon = statusIcons[lead.status] || Thermometer;
                return (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedLead(lead)}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zumbii-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin size={13} />
                        {lead.location}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{lead.investment}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.source}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[lead.status]}`}>
                        <StatusIcon size={12} />
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{lead.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-blue-600">
                          <Phone size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-zumbii-600">
                          <Mail size={14} />
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
          <div className="text-center py-12 text-gray-500 text-sm">No leads found</div>
        )}
      </motion.div>

      {/* Lead Detail Panel */}
      {selectedLead && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Lead Details — {selectedLead.name}</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">Convert</button>
              <button className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">Dismiss</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">Email</p>
              <a href={`mailto:${selectedLead.email}`} className="text-zumbii-600 font-medium">{selectedLead.email}</a>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Phone</p>
              <p className="text-gray-900 font-medium">{selectedLead.phone}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Investment Range</p>
              <p className="text-gray-900 font-medium">{selectedLead.investment}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Source</p>
              <p className="text-gray-900 font-medium">{selectedLead.source}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gray-500 text-xs mb-1">Notes</p>
              <p className="text-gray-900">{selectedLead.notes}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Status</p>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[selectedLead.status]}`}>
                <Clock size={12} />
                {selectedLead.status}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
