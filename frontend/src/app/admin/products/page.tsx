"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Download,
  Edit3,
  Trash2,
  Eye,
  Package,
  AlertCircle,
} from "lucide-react";

const products = [
  { id: "PRO-001", name: "Wireless Bluetooth Headphones", category: "Electronics", price: "₹1,999", stock: 342, sales: 1247, status: "Active", image: "🎧" },
  { id: "PRO-002", name: "Premium Cotton T-Shirts Pack", category: "Fashion", price: "₹699", stock: 892, sales: 982, status: "Active", image: "👕" },
  { id: "PRO-003", name: "Smart Watch Pro Max", category: "Electronics", price: "₹4,999", stock: 56, sales: 756, status: "Active", image: "⌚" },
  { id: "PRO-004", name: "Organic Green Tea Collection", category: "Groceries", price: "₹249", stock: 120, sales: 634, status: "Active", image: "🍵" },
  { id: "PRO-005", name: "Handcrafted Leather Bag", category: "Fashion", price: "₹2,499", stock: 28, sales: 521, status: "Low Stock", image: "👜" },
  { id: "PRO-006", name: "Stainless Steel Water Bottle", category: "Lifestyle", price: "₹499", stock: 0, sales: 412, status: "Out of Stock", image: "🍶" },
  { id: "PRO-007", name: "Yoga Mat Premium Extra Thick", category: "Sports", price: "₹1,299", stock: 167, sales: 389, status: "Active", image: "🧘" },
  { id: "PRO-008", name: "Silk Saree Collection", category: "Fashion", price: "₹4,499", stock: 45, sales: 298, status: "Low Stock", image: "👗" },
];

const categories = ["All", "Electronics", "Fashion", "Groceries", "Lifestyle", "Sports"];
const stockFilters = ["All", "Active", "Low Stock", "Out of Stock"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStock, setActiveStock] = useState("All");

  const filtered = products.filter((p) => {
    const catMatch = activeCategory === "All" || p.category === activeCategory;
    const stockMatch = activeStock === "All" || p.status === activeStock;
    return catMatch && stockMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zumbii-500 rounded-lg hover:bg-zumbii-600 transition-colors">
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map((c) => (
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
        <div className="h-6 w-px bg-gray-200" />
        {stockFilters.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStock(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeStock === s
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
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
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Product</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Price</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Stock</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Sales</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                        {p.image}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{p.price}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${
                      p.stock === 0 ? "text-red-600" : p.stock < 50 ? "text-amber-600" : "text-gray-900"
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{p.sales.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.status === "Active" ? "bg-emerald-100 text-emerald-700" :
                      p.status === "Low Stock" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {p.status === "Out of Stock" && <AlertCircle size={12} />}
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                        <Eye size={15} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-blue-600">
                        <Edit3 size={15} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No products found</div>
        )}
      </motion.div>
    </div>
  );
}
