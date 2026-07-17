"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Smartphone,
  Shirt,
  User,
  Baby,
  Footprints,
  Sparkles,
  HeartPulse,
  Pill,
  Stethoscope,
  ShoppingCart,
  Apple,
  Paintbrush,
  Sofa,
  CookingPot,
  Factory,
  Wheat,
  Sun,
  Zap,
  Settings2,
  Hammer,
  Briefcase,
  Car,
  Trophy,
  BookOpen,
  GraduationCap,
  Dog,
  Pen,
  Monitor,
  Laptop,
  Watch,
  Heart,
  Gem,
  Gift,
  Snowflake,
  Wrench,
  Shield,
  ArrowRight,
  SlidersHorizontal,
  X,
  Package,
} from "lucide-react";
import Container from "@/components/ui/container";

interface Category {
  name: string;
  slug: string;
  icon: React.ElementType;
  description: string;
  color: string;
  gradient: string;
}

const categories: Category[] = [
  { name: "Electronics", slug: "electronics", icon: Smartphone, description: "Gadgets, devices & accessories", color: "text-blue-600", gradient: "from-blue-500 to-cyan-400" },
  { name: "Fashion", slug: "fashion", icon: Shirt, description: "Trendy apparel & accessories", color: "text-pink-600", gradient: "from-pink-500 to-rose-400" },
  { name: "Women's Clothing", slug: "womens-clothing", icon: Shirt, description: "Ethnic, western & more", color: "text-rose-600", gradient: "from-rose-500 to-pink-400" },
  { name: "Men's Clothing", slug: "mens-clothing", icon: User, description: "Formal, casual & sportswear", color: "text-sky-600", gradient: "from-sky-500 to-blue-400" },
  { name: "Kids Fashion", slug: "kids-fashion", icon: Baby, description: "Playful styles for children", color: "text-orange-600", gradient: "from-orange-500 to-amber-400" },
  { name: "Footwear", slug: "footwear", icon: Footprints, description: "Shoes, sandals & sneakers", color: "text-indigo-600", gradient: "from-indigo-500 to-purple-400" },
  { name: "Beauty", slug: "beauty", icon: Sparkles, description: "Skincare, makeup & fragrances", color: "text-fuchsia-600", gradient: "from-fuchsia-500 to-pink-400" },
  { name: "Healthcare", slug: "healthcare", icon: HeartPulse, description: "Wellness & medical needs", color: "text-red-600", gradient: "from-red-500 to-rose-400" },
  { name: "Pharmaceuticals", slug: "pharmaceuticals", icon: Pill, description: "Medicines & health supplies", color: "text-teal-600", gradient: "from-teal-500 to-emerald-400" },
  { name: "Medical Equipment", slug: "medical-equipment", icon: Stethoscope, description: "Hospital & clinic essentials", color: "text-cyan-600", gradient: "from-cyan-500 to-blue-400" },
  { name: "FMCG", slug: "fmcg", icon: ShoppingCart, description: "Fast-moving consumer goods", color: "text-lime-600", gradient: "from-lime-500 to-green-400" },
  { name: "Groceries", slug: "groceries", icon: Apple, description: "Fresh food & daily staples", color: "text-green-600", gradient: "from-green-500 to-emerald-400" },
  { name: "Home Decor", slug: "home-decor", icon: Paintbrush, description: "Decorate your living space", color: "text-amber-600", gradient: "from-amber-500 to-orange-400" },
  { name: "Furniture", slug: "furniture", icon: Sofa, description: "Tables, chairs & more", color: "text-stone-600", gradient: "from-stone-500 to-amber-400" },
  { name: "Kitchen", slug: "kitchen", icon: CookingPot, description: "Cookware & kitchen tools", color: "text-orange-600", gradient: "from-orange-500 to-red-400" },
  { name: "Industrial Equipment", slug: "industrial-equipment", icon: Factory, description: "Heavy machinery & tools", color: "text-slate-600", gradient: "from-slate-500 to-gray-400" },
  { name: "Agriculture", slug: "agriculture", icon: Wheat, description: "Farming & irrigation supplies", color: "text-emerald-600", gradient: "from-emerald-500 to-green-400" },
  { name: "Solar Products", slug: "solar-products", icon: Sun, description: "Solar panels & energy solutions", color: "text-yellow-600", gradient: "from-yellow-500 to-amber-400" },
  { name: "Renewable Energy", slug: "renewable-energy", icon: Zap, description: "Wind, solar & green tech", color: "text-lime-600", gradient: "from-lime-500 to-yellow-400" },
  { name: "Machinery", slug: "machinery", icon: Settings2, description: "Industrial & commercial machines", color: "text-gray-600", gradient: "from-gray-500 to-slate-400" },
  { name: "Construction Materials", slug: "construction-materials", icon: Hammer, description: "Building & renovation supplies", color: "text-amber-600", gradient: "from-amber-500 to-yellow-400" },
  { name: "Office Supplies", slug: "office-supplies", icon: Briefcase, description: "Stationery & office essentials", color: "text-violet-600", gradient: "from-violet-500 to-indigo-400" },
  { name: "Automobile Parts", slug: "automobile-parts", icon: Car, description: "Spare parts & accessories", color: "text-blue-600", gradient: "from-blue-500 to-indigo-400" },
  { name: "Sports", slug: "sports", icon: Trophy, description: "Gear & equipment for sports", color: "text-cyan-600", gradient: "from-cyan-500 to-teal-400" },
  { name: "Books", slug: "books", icon: BookOpen, description: "Fiction, non-fiction & more", color: "text-amber-600", gradient: "from-amber-500 to-orange-400" },
  { name: "Education", slug: "education", icon: GraduationCap, description: "Learning materials & courses", color: "text-indigo-600", gradient: "from-indigo-500 to-blue-400" },
  { name: "Pet Supplies", slug: "pet-supplies", icon: Dog, description: "Food & care for pets", color: "text-orange-600", gradient: "from-orange-500 to-amber-400" },
  { name: "Stationery", slug: "stationery", icon: Pen, description: "Writing & art supplies", color: "text-rose-600", gradient: "from-rose-500 to-pink-400" },
  { name: "Electrical", slug: "electrical", icon: Zap, description: "Wires, switches & fittings", color: "text-yellow-600", gradient: "from-yellow-500 to-orange-400" },
  { name: "Hardware", slug: "hardware", icon: Wrench, description: "Tools, screws & fittings", color: "text-stone-600", gradient: "from-stone-500 to-gray-400" },
  { name: "Safety Equipment", slug: "safety-equipment", icon: Shield, description: "Protective gear & signage", color: "text-red-600", gradient: "from-red-500 to-orange-400" },
  { name: "Mobile Accessories", slug: "mobile-accessories", icon: Smartphone, description: "Cases, chargers & more", color: "text-sky-600", gradient: "from-sky-500 to-blue-400" },
  { name: "Computers", slug: "computers", icon: Monitor, description: "Desktops & peripherals", color: "text-blue-600", gradient: "from-blue-500 to-indigo-400" },
  { name: "Laptops", slug: "laptops", icon: Laptop, description: "Notebooks & ultrabooks", color: "text-indigo-600", gradient: "from-indigo-500 to-violet-400" },
  { name: "Smart Gadgets", slug: "smart-gadgets", icon: Watch, description: "Wearables & smart devices", color: "text-teal-600", gradient: "from-teal-500 to-cyan-400" },
  { name: "Personal Care", slug: "personal-care", icon: Heart, description: "Grooming & hygiene products", color: "text-pink-600", gradient: "from-pink-500 to-rose-400" },
  { name: "Luxury Products", slug: "luxury-products", icon: Gem, description: "Premium & designer goods", color: "text-purple-600", gradient: "from-purple-500 to-fuchsia-400" },
  { name: "Gift Items", slug: "gift-items", icon: Gift, description: "Thoughtful presents for all", color: "text-red-600", gradient: "from-red-500 to-pink-400" },
  { name: "Seasonal Products", slug: "seasonal-products", icon: Snowflake, description: "Festive & seasonal essentials", color: "text-cyan-600", gradient: "from-cyan-500 to-blue-400" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(
    () =>
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-b from-zumbii-50/50 to-transparent" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-zumbii-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-zumbii-50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <Container className="relative z-10 pt-24 pb-16 sm:pt-32 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zumbii-50 border border-zumbii-100 mb-6"
            >
              <Package className="w-4 h-4 text-zumbii-500" />
              <span className="text-sm font-medium text-zumbii-700">
                {categories.length} Categories
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight"
            >
              Shop by{" "}
              <span className="bg-gradient-to-r from-zumbii-600 to-zumbii-400 bg-clip-text text-transparent">
                Category
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-4 text-lg text-text-secondary max-w-xl mx-auto"
            >
              Explore thousands of products across every category imaginable
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 max-w-xl mx-auto relative"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-zumbii-100/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center bg-white border border-border rounded-2xl overflow-hidden shadow-sm shadow-zumbii-100/50 transition-all duration-300 focus-within:shadow-md focus-within:border-zumbii-300">
                  <Search className="ml-4 w-5 h-5 text-text-tertiary shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search categories..."
                    className="flex-1 bg-transparent px-4 py-3.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mr-2 p-1.5 rounded-lg hover:bg-surface-tertiary transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4 text-text-tertiary" />
                    </button>
                  )}
                  <div className="pr-2 flex items-center gap-1 border-l border-border pl-3">
                    <SlidersHorizontal className="w-4 h-4 text-text-tertiary" />
                    <span className="text-xs text-text-tertiary font-medium pr-2">Filter</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-tertiary flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-text-tertiary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No categories found
              </h3>
              <p className="text-text-secondary text-sm max-w-xs mx-auto">
                No results match &ldquo;{searchQuery}&rdquo;. Try a different search term.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
            >
              {filtered.map((cat) => (
                <motion.div key={cat.slug} variants={cardVariants}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="group block h-full"
                  >
                    <div className="relative h-full rounded-2xl border border-border bg-white p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-zumbii-100/50 hover:-translate-y-1 hover:border-zumbii-200">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}
                      >
                        <cat.icon className="w-6 h-6 text-white" />
                      </div>

                      <h3 className="mt-4 font-semibold text-text-primary text-sm leading-snug group-hover:text-zumbii-600 transition-colors">
                        {cat.name}
                      </h3>

                      <p className="mt-1 text-xs text-text-tertiary leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>

                      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zumbii-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 text-center"
            >
              <p className="text-sm text-text-tertiary">
                Showing {filtered.length} of {categories.length} categories
              </p>
            </motion.div>
          )}
        </Container>
      </section>
    </>
  );
}
