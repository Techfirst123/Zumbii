"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  FolderTree,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  categoriesApi,
  resolveImageUrl,
  ApiError,
  type BackendCategory,
} from "@/lib/api";
import { CategoryFormModal } from "@/components/admin/CategoryFormModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BackendCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const data = await categoriesApi.listAdmin();
      setCategories(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = categories.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await categoriesApi.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSaved(saved: BackendCategory) {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev];
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zumbii-500 rounded-lg hover:bg-zumbii-600 transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
        />
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
            Loading categories...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Parent</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Products</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {c.image ? (
                            <Image
                              src={resolveImageUrl(c.image)}
                              alt={c.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FolderTree size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {c.parent?.name ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{c._count?.products ?? 0}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          c.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditing(c);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-blue-600"
                          aria-label="Edit category"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={deletingId === c.id}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50"
                          aria-label="Delete category"
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
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No categories found</div>
        )}
      </motion.div>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        category={editing}
        onSaved={handleSaved}
      />
    </div>
  );
}
