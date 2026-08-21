"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import {
  campaignsApi,
  uploadApi,
  resolveImageUrl,
  ApiError,
  type BackendCampaign,
  type CampaignType,
} from "@/lib/api";
import { ImagePlus, Loader2, X, AlertCircle } from "lucide-react";
import { slugify } from "@/lib/slugify";

interface CampaignFormModalProps {
  open: boolean;
  onClose: () => void;
  campaign?: BackendCampaign | null;
  onSaved: (campaign: BackendCampaign) => void;
}

const campaignTypes: { value: CampaignType; label: string }[] = [
  { value: "FESTIVE_SALE", label: "Festive Sale" },
  { value: "FLASH_SALE", label: "Flash Sale" },
  { value: "CLEARANCE", label: "Clearance" },
  { value: "FRANCHISE_BULK_OFFER", label: "Franchise Bulk Offer" },
  { value: "NEW_LAUNCH", label: "New Launch" },
];

const emptyForm = {
  name: "",
  slug: "",
  type: "FESTIVE_SALE" as CampaignType,
  description: "",
  startAt: "",
  endAt: "",
  showOnHomepage: false,
  status: "DRAFT" as "DRAFT" | "ACTIVE",
};

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CampaignFormModal({ open, onClose, campaign, onSaved }: CampaignFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    setError("");
    if (campaign) {
      setForm({
        name: campaign.name,
        slug: campaign.slug,
        type: campaign.type,
        description: campaign.description ?? "",
        startAt: toDatetimeLocal(campaign.startAt),
        endAt: toDatetimeLocal(campaign.endAt),
        showOnHomepage: campaign.showOnHomepage,
        status: campaign.status === "ENDED" ? "ACTIVE" : campaign.status,
      });
      setBannerImageUrl(campaign.bannerImageUrl ?? null);
      setSlugTouched(true);
    } else {
      setForm(emptyForm);
      setBannerImageUrl(null);
      setSlugTouched(false);
    }
  }, [open, campaign]);

  if (!open) return null;

  const isEdit = Boolean(campaign);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const urls = await uploadApi.images([file]);
      setBannerImageUrl(urls[0] ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Banner upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Campaign name is required.";
    if (!form.slug.trim()) return "Campaign slug is required.";
    if (!form.startAt || !form.endAt) return "Start and end date & time are required.";
    if (new Date(form.endAt) <= new Date(form.startAt)) {
      return "End date must be after start date.";
    }
    return null;
  }

  function showError(message: string) {
    setError(message);
    formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      showError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        type: form.type,
        description: form.description || undefined,
        bannerImageUrl: bannerImageUrl || undefined,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        status: form.status,
        showOnHomepage: form.showOnHomepage,
      };

      const saved = isEdit
        ? await campaignsApi.update(campaign!.id, payload)
        : await campaignsApi.create(payload);

      onSaved(saved);
      onClose();
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Failed to save campaign");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Campaign" : "Create Campaign"} size="lg">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="px-6 pb-6 pt-4 space-y-4 max-h-[75vh] overflow-y-auto"
      >
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Campaign Name</label>
            <input
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({
                  ...f,
                  name,
                  slug: slugTouched ? f.slug : slugify(name),
                }));
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
              placeholder="Diwali Mega Sale"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
              placeholder="diwali-mega-sale"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Campaign Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CampaignType }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400 bg-white"
            >
              {campaignTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400 resize-none"
              placeholder="Shown on the campaign landing page"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Start Date &amp; Time</label>
            <input
              type="datetime-local"
              value={form.startAt}
              onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">End Date &amp; Time</label>
            <input
              type="datetime-local"
              value={form.endAt}
              onChange={(e) => setForm((f) => ({ ...f, endAt: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "DRAFT" | "ACTIVE" }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400 bg-white"
            >
              <option value="DRAFT">Draft (not published)</option>
              <option value="ACTIVE">Active (publish now)</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1">
              Scheduled / Active / Expired is shown automatically based on the date range.
            </p>
          </div>

          <label className="flex items-center gap-2 sm:col-span-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.showOnHomepage}
              onChange={(e) => setForm((f) => ({ ...f, showOnHomepage: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-zumbii-600 focus:ring-zumbii-400"
            />
            <span className="text-sm text-gray-700">Show on homepage</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Banner Image</label>
          <div className="flex flex-wrap gap-3">
            {bannerImageUrl && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                <Image src={resolveImageUrl(bannerImageUrl)} alt="Campaign banner" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => setBannerImageUrl(null)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove banner image"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            {!bannerImageUrl && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-zumbii-400 hover:text-zumbii-500 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                <span className="text-[10px]">{uploading ? "Uploading" : "Add"}</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="px-4 py-2 text-sm font-medium text-white bg-zumbii-600 rounded-lg hover:bg-zumbii-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create Campaign"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
