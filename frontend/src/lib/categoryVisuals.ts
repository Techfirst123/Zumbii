import {
  Zap,
  Sparkles,
  Package,
  Building2,
  Leaf,
  HeartHandshake,
  Truck,
  TrendingUp,
  SprayCan,
  Soup,
  Wheat,
  Coffee,
  UtensilsCrossed,
  Shirt,
  Smartphone,
  HeartPulse,
  Sofa,
  Factory,
  ShieldCheck,
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

// Keyword -> specific icon, so a category like "Cleaning Supplies" or
// "Masalas & Spices" gets a visually relevant placeholder instead of a
// generic one. Checked in order; first match wins.
const KEYWORD_ICONS: { keywords: string[]; icon: LucideIcon; gradient: string }[] = [
  { keywords: ["clean"], icon: SprayCan, gradient: "from-zumbii-500 to-zumbii-300" },
  { keywords: ["masala", "spice"], icon: Soup, gradient: "from-brand-red-600 to-gold-500" },
  { keywords: ["dry fruit", "nuts"], icon: Wheat, gradient: "from-gold-600 to-gold-400" },
  { keywords: ["beverage", "drink", "tea", "coffee"], icon: Coffee, gradient: "from-zumbii-800 to-zumbii-600" },
  { keywords: ["food"], icon: UtensilsCrossed, gradient: "from-leaf-600 to-gold-500" },
  { keywords: ["fashion", "cloth", "apparel", "wear"], icon: Shirt, gradient: "from-brand-red-500 to-brand-red-300" },
  { keywords: ["electronic", "gadget", "tech"], icon: Smartphone, gradient: "from-zumbii-700 to-zumbii-500" },
  { keywords: ["health", "medical", "pharma"], icon: HeartPulse, gradient: "from-brand-red-600 to-gold-400" },
  { keywords: ["beauty", "cosmetic", "skincare", "personal care"], icon: Sparkles, gradient: "from-gold-500 to-brand-red-300" },
  { keywords: ["home", "living", "furniture", "decor"], icon: Sofa, gradient: "from-zumbii-600 to-gold-400" },
  { keywords: ["industrial", "tool", "machine", "hardware"], icon: Factory, gradient: "from-zumbii-900 to-zumbii-600" },
  { keywords: ["safety", "protect"], icon: ShieldCheck, gradient: "from-leaf-700 to-leaf-500" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Deterministic icon+gradient for a category, keyed by name/slug so the same
 * category always renders the same visual wherever it appears — falls back
 * to a keyword match (e.g. "cleaning" -> spray bottle) before a stable hash
 * into the generic palette.
 */
export function categoryVisual(category: string): CategoryVisual {
  const name = category.toLowerCase();
  const match = KEYWORD_ICONS.find(({ keywords }) => keywords.some((kw) => name.includes(kw)));
  if (match) return { icon: match.icon, gradient: match.gradient };
  return PALETTE[hashString(name) % PALETTE.length];
}
