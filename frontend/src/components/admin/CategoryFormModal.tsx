"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import {
  categoriesApi,
  uploadApi,
  resolveImageUrl,
  ApiError,
  type BackendCategory,
} from "@/lib/api";
import { ImagePlus, Loader2, X, AlertCircle } from "lucide-react";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  categories: BackendCategory[];
  category?: BackendCategory | null;
  onSaved: (category: BackendCategory) => void;
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
  description: "",
  parentId: "",
  isActive: true,
};

export function CategoryFormModal({
  open,
  onClose,
  categories,
  category,
  onSaved,
}: CategoryFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    setError("");
    if (category) {
      setForm({
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        parentId: category.parentId ?? "",
        isActive: category.isActive,
      });
      setImage(category.image ?? null);
      setSlugTouched(true);
    } else {
      setForm(emptyForm);
      setImage(null);
      setSlugTouched(false);
    }
  }, [open, category]);

  if (!open) return null;

  const isEdit = Boolean(category);
  const parentOptions = categories.filter((c) => c.id !== category?.id);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const [url] = await uploadApi.images([file]);
      setImage(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Category name is required.";
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
        description: form.description || undefined,
        image: image || undefined,
        parentId: form.parentId || undefined,
        isActive: form.isActive,
      };

      const saved = isEdit
        ? await categoriesApi.update(category!.id, payload)
        : await categoriesApi.create(payload);

      onSaved(saved);
      onClose();
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Category" : "Add Category"} size="md">
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

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Category Name</label>
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
            placeholder="Electronics"
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
            placeholder="electronics"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400 resize-none"
            placeholder="Optional description shown on the category page"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Parent Category</label>
          <select
            value={form.parentId}
            onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400 bg-white"
          >
            <option value="">None (top-level category)</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Category Image</label>
          <div className="flex gap-3">
            {image ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                <Image src={resolveImageUrl(image)} alt="Category" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
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

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-300 text-zumbii-600 focus:ring-zumbii-400"
          />
          <span className="text-sm text-gray-700">Active (visible to customers)</span>
        </label>

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
            {isEdit ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
