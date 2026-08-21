"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Megaphone,
  AlertCircle,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import {
  campaignsApi,
  ApiError,
  type BackendCampaign,
  type EffectiveCampaignStatus,
} from "@/lib/api";
import { CampaignFormModal } from "@/components/admin/CampaignFormModal";

const campaignTypeLabels: Record<string, string> = {
  FESTIVE_SALE: "Festive Sale",
  FLASH_SALE: "Flash Sale",
  CLEARANCE: "Clearance",
  FRANCHISE_BULK_OFFER: "Franchise Bulk Offer",
  NEW_LAUNCH: "New Launch",
};

const statusStyles: Record<EffectiveCampaignStatus, string> = {
  Draft: "bg-gray-100 text-gray-600",
  Scheduled: "bg-sky-100 text-sky-700",
  Active: "bg-emerald-100 text-emerald-700",
  Expired: "bg-red-100 text-red-600",
};

const statusFilters: ("All" | EffectiveCampaignStatus)[] = [
  "All",
  "Draft",
  "Scheduled",
  "Active",
  "Expired",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<BackendCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | EffectiveCampaignStatus>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BackendCampaign | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const res = await campaignsApi.list({
        search: search || undefined,
        status: statusFilter === "All" ? undefined : statusFilter,
        limit: 100,
      });
      setCampaigns(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(loadData, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this campaign? Attached products will not be deleted, only the association.")) return;
    setDeletingId(id);
    try {
      await campaignsApi.remove(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete campaign");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSaved(saved: BackendCampaign) {
    setCampaigns((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev];
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Run festive sales, flash sales, and other time-boxed promotions</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zumbii-500 rounded-lg hover:bg-zumbii-600 transition-colors"
        >
          <Plus size={16} />
          Create Campaign
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === s
                  ? "bg-zumbii-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500 text-sm">
            <Loader2 size={18} className="animate-spin" />
            Loading campaigns...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Campaign</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Start</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">End</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Products</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Orders / Revenue</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link href={`/admin/campaigns/${c.id}`} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-zumbii-50 flex items-center justify-center text-zumbii-500 shrink-0">
                          <Megaphone size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-zumbii-600 transition-colors">
                            {c.name}
                          </p>
                          <p className="text-xs text-gray-500">/{c.slug}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {campaignTypeLabels[c.type] ?? c.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[c.effectiveStatus]}`}
                      >
                        {c.effectiveStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatDate(c.startAt)}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatDate(c.endAt)}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{c._count?.products ?? 0}</td>
                    <td className="py-3 px-4 text-gray-400">—</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/campaigns/${c.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-zumbii-600"
                          aria-label="Manage products"
                        >
                          <ArrowUpRight size={15} />
                        </Link>
                        <button
                          onClick={() => {
                            setEditing(c);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-blue-600"
                          aria-label="Edit campaign"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={deletingId === c.id}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50"
                          aria-label="Delete campaign"
                        >
                          {deletingId === c.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && campaigns.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No campaigns found</div>
        )}
      </motion.div>

      <CampaignFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        campaign={editing}
        onSaved={handleSaved}
      />
    </div>
  );
}
