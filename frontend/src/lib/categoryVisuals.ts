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
  { icon: Zap, gradient: "from-zumbii-700 to-zumbii-500" },
  { icon: Sparkles, gradient: "from-gold-500 to-gold-300" },
  { icon: Package, gradient: "from-brand-red-600 to-brand-red-400" },
  { icon: Building2, gradient: "from-zumbii-900 to-zumbii-700" },
  { icon: Leaf, gradient: "from-leaf-600 to-leaf-500" },
  { icon: HeartHandshake, gradient: "from-gold-600 to-gold-400" },
  { icon: Truck, gradient: "from-brand-red-700 to-brand-red-500" },
  { icon: TrendingUp, gradient: "from-zumbii-600 to-gold-500" },
];

export function categoryVisual(index: number): CategoryVisual {
  return PALETTE[index % PALETTE.length];
}
