import {
  Zap,
  Sparkles,
  Package,
  Building2,
  Leaf,
  HeartHandshake,
  Truck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

interface CategoryVisual {
  icon: LucideIcon;
  gradient: string;
}

const PALETTE: CategoryVisual[] = [
  { icon: Zap, gradient: "from-blue-500 to-cyan-400" },
  { icon: Sparkles, gradient: "from-pink-500 to-rose-400" },
  { icon: Package, gradient: "from-amber-500 to-orange-400" },
  { icon: Building2, gradient: "from-slate-600 to-slate-500" },
  { icon: Leaf, gradient: "from-emerald-500 to-green-400" },
  { icon: HeartHandshake, gradient: "from-violet-500 to-purple-400" },
  { icon: Truck, gradient: "from-red-500 to-rose-400" },
  { icon: TrendingUp, gradient: "from-teal-500 to-cyan-400" },
];

export function categoryVisual(index: number): CategoryVisual {
  return PALETTE[index % PALETTE.length];
}
