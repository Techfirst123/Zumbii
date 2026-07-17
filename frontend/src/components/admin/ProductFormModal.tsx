"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import {
  productsApi,
  uploadApi,
  resolveImageUrl,
  ApiError,
  type BackendProduct,
  type BackendCategory,
} from "@/lib/api";
import { ImagePlus, Loader2, X, AlertCircle } from "lucide-react";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  categories: BackendCategory[];
  product?: BackendProduct | null;
  onSaved: (product: BackendProduct) => void;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyForm = {
  name: "",
  slug: "",
  shortDesc: "",
  description: "",
  price: "",
  comparePrice: "",
  sku: "",
  quantity: "",
  minOrderQty: "1",
  categoryId: "",
  isFeatured: false,
  tags: "",
};

export function ProductFormModal({ open, onClose, categories, product, onSaved }: ProductFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<string[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const categoryId = form.categoryId || categories[0]?.id || "";

  useEffect(() => {
    if (!open) return;
    setError("");
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        shortDesc: product.shortDesc ?? "",
        description: product.description ?? "",
        price: String(product.price),
        comparePrice: product.comparePrice ? String(product.comparePrice) : "",
        sku: product.sku,
        quantity: String(product.quantity),
        minOrderQty: String(product.minOrderQty || 1),
        categoryId: product.categoryId,
        isFeatured: product.isFeatured,
        tags: (product.tags ?? []).join(", "),
      });
      setImages(product.images ?? []);
      setSlugTouched(true);
    } else {
      setForm(emptyForm);
      setImages([]);
      setSlugTouched(false);
    }
  }, [open, product]);

  if (!open) return null;

  const isEdit = Boolean(product);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const urls = await uploadApi.images(files);
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.price || Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
      return "Enter a valid price.";
    }
    if (form.quantity === "" || Number.isNaN(Number(form.quantity)) || Number(form.quantity) < 0) {
      return "Enter a valid stock quantity.";
    }
    if (!categoryId) return "Please select a category.";
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
        shortDesc: form.shortDesc || undefined,
        description: form.description || undefined,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        sku: form.sku || `SKU-${Date.now()}`,
        quantity: Number(form.quantity) || 0,
        minOrderQty: Number(form.minOrderQty) || 1,
        categoryId,
        isFeatured: form.isFeatured,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        images,
      };

      const saved = isEdit
        ? await productsApi.update(product!.id, payload)
        : await productsApi.create(payload);

      onSaved(saved);
      onClose();
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Product" : "Add Product"} size="lg">
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
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Name</label>
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
              placeholder="Premium Wireless Headphones"
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
              placeholder="premium-wireless-headphones"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">SKU</label>
            <input
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
              placeholder="Auto-generated if left blank"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Short Description</label>
            <input
              value={form.shortDesc}
              onChange={(e) => setForm((f) => ({ ...f, shortDesc: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
              placeholder="One-line summary shown on product cards"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400 resize-none"
              placeholder="Full product description customers will see"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Price (₹)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Compare-at Price (₹)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.comparePrice}
              onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
              placeholder="Optional strike-through price"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Stock Quantity</label>
            <input
              type="number"
              min={0}
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Min. Order Qty</label>
            <input
              type="number"
              min={1}
              value={form.minOrderQty}
              onChange={(e) => setForm((f) => ({ ...f, minOrderQty: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400 bg-white"
            >
              {categories.length === 0 && <option value="">No categories available</option>}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
              placeholder="wireless, audio, bestseller"
            />
          </div>

          <label className="flex items-center gap-2 sm:col-span-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-zumbii-600 focus:ring-zumbii-400"
            />
            <span className="text-sm text-gray-700">Feature this product on the homepage</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Images</label>
          <div className="flex flex-wrap gap-3">
            {images.map((url) => (
              <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                <Image src={resolveImageUrl(url)} alt="Product" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-zumbii-400 hover:text-zumbii-500 transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
              <span className="text-[10px]">{uploading ? "Uploading" : "Add"}</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
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
            {isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
