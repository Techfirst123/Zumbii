"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit3,
  Ban,
  Search,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Package,
  Trash2,
  Plus,
} from "lucide-react";
import {
  campaignsApi,
  productsApi,
  categoriesApi,
  resolveImageUrl,
  ApiError,
  type BackendCampaign,
  type BackendProduct,
  type BackendCategory,
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface SelectionRow {
  product: BackendProduct;
  campaignPrice: string;
  discountPercent: string;
  stockCap: string;
  lastEdited: "price" | "discount";
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [campaign, setCampaign] = useState<BackendCampaign | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [ending, setEnding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [catalogue, setCatalogue] = useState<BackendProduct[]>([]);
  const [catalogueLoading, setCatalogueLoading] = useState(false);
  const [selection, setSelection] = useState<Record<string, SelectionRow>>({});
  const [attaching, setAttaching] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [attachError, setAttachError] = useState("");

  async function loadCampaign() {
    setLoading(true);
    setLoadError("");
    try {
      const data = await campaignsApi.get(id);
      setCampaign(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        setLoadError(err instanceof ApiError ? err.message : "Failed to load campaign");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaign();
    categoriesApi.list().then(setCategories).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    setCatalogueLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await productsApi.list({
          search: search || undefined,
          categoryId: categoryId || undefined,
          limit: 50,
        });
        if (!cancelled) setCatalogue(res.data);
      } catch {
        if (!cancelled) setCatalogue([]);
      } finally {
        if (!cancelled) setCatalogueLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search, categoryId]);

  function toggleSelect(product: BackendProduct) {
    setSelection((prev) => {
      const next = { ...prev };
      if (next[product.id]) {
        delete next[product.id];
      } else {
        next[product.id] = {
          product,
          campaignPrice: "",
          discountPercent: "10",
          stockCap: "",
          lastEdited: "discount",
        };
      }
      return next;
    });
  }

  function updateRow(productId: string, field: "campaignPrice" | "discountPercent" | "stockCap", value: string) {
    setSelection((prev) => {
      const row = prev[productId];
      if (!row) return prev;
      const regular = Number(row.product.price);
      const updated: SelectionRow = { ...row, [field]: value };

      if (field === "campaignPrice") {
        updated.lastEdited = "price";
        const priceNum = Number(value);
        if (value && !Number.isNaN(priceNum) && regular > 0) {
          updated.discountPercent = String(round2((1 - priceNum / regular) * 100));
        }
      } else if (field === "discountPercent") {
        updated.lastEdited = "discount";
        const pctNum = Number(value);
        if (value && !Number.isNaN(pctNum) && regular > 0) {
          updated.campaignPrice = String(round2(regular * (1 - pctNum / 100)));
        }
      }

      return { ...prev, [productId]: updated };
    });
  }

  async function handleAddSelected() {
    const rows = Object.values(selection);
    if (rows.length === 0) return;

    setAttachError("");
    setWarnings([]);
    setAttaching(true);
    try {
      const items = rows.map((row) => {
        const base: { productId: string; campaignPrice?: number; discountPercent?: number; stockCap?: number } = {
          productId: row.product.id,
        };
        if (row.lastEdited === "price") {
          base.campaignPrice = Number(row.campaignPrice);
        } else {
          base.discountPercent = Number(row.discountPercent);
        }
        if (row.stockCap) base.stockCap = Number(row.stockCap);
        return base;
      });

      const result = await campaignsApi.addProducts(id, items);
      setWarnings(result.warnings);
      setSelection({});
      await loadCampaign();
    } catch (err) {
      setAttachError(err instanceof ApiError ? err.message : "Failed to add products to campaign");
    } finally {
      setAttaching(false);
    }
  }

  async function handleRemoveProduct(productId: string) {
    if (!confirm("Remove this product from the campaign?")) return;
    setRemovingId(productId);
    try {
      await campaignsApi.removeProduct(id, productId);
      setCampaign((prev) =>
        prev
          ? {
              ...prev,
              products: prev.products?.filter((p) => p.productId !== productId),
              _count: prev._count ? { products: Math.max(0, prev._count.products - 1) } : prev._count,
            }
          : prev
      );
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to remove product");
    } finally {
      setRemovingId(null);
    }
  }

  async function handleEndEarly() {
    if (!campaign) return;
    if (!confirm("End this campaign now? Products will immediately revert to their normal price.")) return;
    setEnding(true);
    try {
      const updated = await campaignsApi.endEarly(campaign.id);
      setCampaign((prev) => (prev ? { ...prev, ...updated } : updated));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to end campaign");
    } finally {
      setEnding(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-gray-500 text-sm">
        <Loader2 size={18} className="animate-spin" />
        Loading campaign...
      </div>
    );
  }

  if (notFound || !campaign) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500">Campaign not found.</p>
        <Link href="/admin/campaigns" className="text-sm text-zumbii-600 hover:underline mt-2 inline-block">
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const canEndEarly = campaign.effectiveStatus === "Scheduled" || campaign.effectiveStatus === "Active";
  const attachedProducts = campaign.products ?? [];
  const selectedCount = Object.keys(selection).length;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/admin/campaigns")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Campaigns
      </button>

      {loadError && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle size={16} />
          {loadError}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4 bg-white rounded-xl border border-gray-200 p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{campaign.name}</h1>
            <span
              className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[campaign.effectiveStatus]}`}
            >
              {campaign.effectiveStatus}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {campaignTypeLabels[campaign.type] ?? campaign.type} · /{campaign.slug}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {formatDate(campaign.startAt)} &rarr; {formatDate(campaign.endAt)}
          </p>
          {campaign.description && <p className="text-sm text-gray-500 mt-2 max-w-xl">{campaign.description}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit3 size={15} />
            Edit
          </button>
          {canEndEarly && (
            <button
              onClick={handleEndEarly}
              disabled={ending}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {ending ? <Loader2 size={15} className="animate-spin" /> : <Ban size={15} />}
              End Campaign Early
            </button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-5 space-y-4"
      >
        <h2 className="text-sm font-semibold text-gray-900">Add Products</h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
            />
          </div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="border border-gray-100 rounded-lg max-h-64 overflow-y-auto divide-y divide-gray-50">
          {catalogueLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-gray-500 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Searching catalogue...
            </div>
          ) : catalogue.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No matching products</div>
          ) : (
            catalogue.map((p) => {
              const checked = Boolean(selection[p.id]);
              const alreadyAttached = attachedProducts.some((cp) => cp.productId === p.id);
              return (
                <label
                  key={p.id}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${alreadyAttached ? "opacity-50" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={alreadyAttached}
                    onChange={() => toggleSelect(p)}
                    className="w-4 h-4 rounded border-gray-300 text-zumbii-600 focus:ring-zumbii-400"
                  />
                  <div className="relative w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {p.images?.[0] ? (
                      <Image src={resolveImageUrl(p.images[0])} alt={p.name} fill className="object-cover" sizes="36px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={14} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      {p.sku} · ₹{Number(p.price).toLocaleString("en-IN")} · Stock {p.quantity}
                    </p>
                  </div>
                  {alreadyAttached && <span className="text-[11px] text-gray-400 shrink-0">Already attached</span>}
                </label>
              );
            })
          )}
        </div>

        {selectedCount > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500">{selectedCount} product(s) selected — set campaign pricing</p>
            <div className="space-y-2">
              {Object.values(selection).map((row) => {
                const regular = Number(row.product.price);
                const preview = row.campaignPrice ? Number(row.campaignPrice) : null;
                return (
                  <div key={row.product.id} className="flex flex-wrap items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5">
                    <span className="text-sm font-medium text-gray-800 flex-1 min-w-[140px] truncate">{row.product.name}</span>
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-gray-500">Price ₹</label>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={row.campaignPrice}
                        onChange={(e) => updateRow(row.product.id, "campaignPrice", e.target.value)}
                        className="w-24 px-2 py-1.5 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-gray-500">or Discount %</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.01"
                        value={row.discountPercent}
                        onChange={(e) => updateRow(row.product.id, "discountPercent", e.target.value)}
                        className="w-20 px-2 py-1.5 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-gray-500">Stock cap</label>
                      <input
                        type="number"
                        min={0}
                        value={row.stockCap}
                        onChange={(e) => updateRow(row.product.id, "stockCap", e.target.value)}
                        placeholder="Optional"
                        className="w-20 px-2 py-1.5 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
                      />
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      ₹{regular.toLocaleString("en-IN")}
                      {preview !== null && !Number.isNaN(preview) && (
                        <>
                          {" "}
                          &rarr; <span className="font-semibold text-emerald-600">₹{preview.toLocaleString("en-IN")}</span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSelect(row.product)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove from selection"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            {attachError && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{attachError}</span>
              </div>
            )}

            <button
              onClick={handleAddSelected}
              disabled={attaching}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zumbii-500 rounded-lg hover:bg-zumbii-600 transition-colors disabled:opacity-50"
            >
              {attaching ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Add Selected to Campaign
            </button>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <ul className="space-y-1">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Attached Products ({attachedProducts.length})</h2>
        </div>
        {attachedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">No products attached to this campaign yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Regular Price</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Campaign Price</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Discount</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Stock Cap</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {attachedProducts.map((cp) => (
                  <tr key={cp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {cp.product?.images?.[0] ? (
                            <Image
                              src={resolveImageUrl(cp.product.images[0])}
                              alt={cp.product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Package size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{cp.product?.name}</p>
                          <p className="text-xs text-gray-500">{cp.product?.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 line-through">
                      ₹{cp.product ? Number(cp.product.price).toLocaleString("en-IN") : "—"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">
                      ₹{Number(cp.campaignPrice).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{Number(cp.discountPercent).toFixed(0)}%</td>
                    <td className="py-3 px-4 text-gray-700">{cp.stockCap ?? "—"}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleRemoveProduct(cp.productId)}
                        disabled={removingId === cp.productId}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50"
                        aria-label="Remove product from campaign"
                      >
                        {removingId === cp.productId ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <CampaignFormModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        campaign={campaign}
        onSaved={(saved) => setCampaign((prev) => (prev ? { ...prev, ...saved } : saved))}
      />
    </div>
  );
}
