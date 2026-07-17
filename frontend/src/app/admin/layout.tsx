"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useAuthStore, ADMIN_ROLES } from "@/store/authStore";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  FolderTree,
  Users,
  Building2,
  Truck,
  Handshake,
  UserCheck,
  Warehouse,
  Store,
  Percent,
  Wallet,
  BarChart3,
  Megaphone,
  FileText,
  Newspaper,
  LifeBuoy,
  Bell,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  LogOut,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "#", icon: FolderTree },
  { label: "Brands", href: "#", icon: Tags },
  { label: "Customers", href: "#", icon: Users },
  { label: "Businesses", href: "#", icon: Building2 },
  { label: "Suppliers", href: "#", icon: Truck },
  { label: "Franchise Leads", href: "/admin/franchise-leads", icon: Handshake },
  { label: "Seller Approvals", href: "/admin/seller-approvals", icon: UserCheck },
  { label: "Inventory", href: "#", icon: Warehouse },
  { label: "Warehouses", href: "#", icon: Store },
  { label: "Coupons", href: "#", icon: Percent },
  { label: "Payments", href: "#", icon: Wallet },
  { label: "Reports", href: "#", icon: BarChart3 },
  { label: "Marketing", href: "#", icon: Megaphone },
  { label: "CMS", href: "#", icon: FileText },
  { label: "Blog", href: "#", icon: Newspaper },
  { label: "Support Tickets", href: "#", icon: LifeBuoy },
  { label: "Notifications", href: "#", icon: Bell },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart },
  { label: "Settings", href: "#", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      router.replace("/admin/login");
    }
  }, [isLoginPage, user, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        className={clsx(
          "fixed lg:sticky top-0 left-0 h-screen z-50",
          "bg-slate-900 text-white flex flex-col overflow-hidden",
          "lg:block",
          mobileOpen ? "block" : "hidden"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/10 shrink-0">
          <div className={clsx("flex items-center gap-3", collapsed && "justify-center w-full")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zumbii-400 to-zumbii-600 flex items-center justify-center font-bold text-sm shrink-0">
              Z
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-semibold text-lg tracking-tight"
              >
                Zumbii
              </motion.span>
            )}
          </div>
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
            className={clsx(
              "lg:flex hidden items-center justify-center w-6 h-6 rounded-md hover:bg-white/10 transition-colors shrink-0",
              collapsed && "ml-0"
            )}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-thin scrollbar-thumb-white/10">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 group",
                  isActive
                    ? "bg-zumbii-500/20 text-zumbii-300"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                  collapsed && "justify-center px-2"
                )}
              >
                <link.icon size={20} className={clsx("shrink-0", isActive && "text-zumbii-400")} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{link.label}</span>
                )}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-zumbii-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-4 shrink-0">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zumbii-400 to-purple-500 flex items-center justify-center text-xs font-bold shrink-0">
                {(user.firstName?.[0] || user.email[0]).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.firstName || "Admin"}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/admin/login");
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zumbii-400 to-purple-500 flex items-center justify-center text-xs font-bold">
                {(user.firstName?.[0] || user.email[0]).toUpperCase()}
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/admin/login");
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-64 lg:w-96 pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zumbii-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
