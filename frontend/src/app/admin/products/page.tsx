"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Package,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  productsApi,
  categoriesApi,
  resolveImageUrl,
  ApiError,
  type BackendProduct,
  type BackendCategory,
} from "@/lib/api";
import { ProductFormModal } from "@/components/admin/ProductFormModal";

function stockStatus(quantity: number) {
  if (quantity === 0) return { label: "Out of Stock", className: "bg-red-100 text-red-700" };
  if (quantity < 20) return { label: "Low Stock", className: "bg-amber-100 text-amber-700" };
  return { label: "Active", className: "bg-emerald-100 text-emerald-700" };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BackendProduct | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [productRes, categoryRes] = await Promise.all([
        productsApi.list({ limit: 100 }),
        categoriesApi.list(),
      ]);
      setProducts(productRes.data);
      setCategories(categoryRes);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = products.filter((p) => {
    const catMatch = activeCategory === "All" || p.category?.name === activeCategory;
    const searchMatch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await productsApi.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSaved(saved: BackendProduct) {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev];
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zumbii-500 rounded-lg hover:bg-zumbii-600 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {["All", ...categories.map((c) => c.name)].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeCategory === c
                  ? "bg-zumbii-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {c}
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
            Loading products...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Sold</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const status = stockStatus(p.quantity);
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {p.images?.[0] ? (
                              <Image
                                src={resolveImageUrl(p.images[0])}
                                alt={p.name}
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
                            <p className="font-medium text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {p.category?.name ?? "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        ₹{Number(p.price).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-medium ${
                            p.quantity === 0 ? "text-red-600" : p.quantity < 20 ? "text-amber-600" : "text-gray-900"
                          }`}
                        >
                          {p.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{p.soldCount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}
                        >
                          {status.label === "Out of Stock" && <AlertCircle size={12} />}
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditing(p);
                              setModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-blue-600"
                            aria-label="Edit product"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50"
                            aria-label="Delete product"
                          >
                            {deletingId === p.id ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No products found</div>
        )}
      </motion.div>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        product={editing}
        onSaved={handleSaved}
      />
    </div>
  );
}
