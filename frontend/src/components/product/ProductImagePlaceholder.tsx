import clsx from "clsx";
import { Package } from "lucide-react";
import { categoryVisual } from "@/lib/categoryVisuals";

interface ProductImagePlaceholderProps {
  categoryName?: string;
  className?: string;
  iconClassName?: string;
}

/**
 * Branded stand-in for products with no uploaded photo yet — a soft
 * category-tinted gradient with a relevant icon, instead of a plain broken
 * "no image" box. Swaps out automatically once a real photo exists, since
 * callers only render this when the image URL is the placeholder sentinel.
 */
export function ProductImagePlaceholder({
  categoryName,
  className,
  iconClassName,
}: ProductImagePlaceholderProps) {
  if (!categoryName) {
    return (
      <div
        className={clsx(
          "w-full h-full flex items-center justify-center bg-gradient-to-br from-zumbii-700 to-zumbii-500",
          className
        )}
      >
        <Package className={clsx("text-white/85", iconClassName || "w-1/3 h-1/3")} />
      </div>
    );
  }

  const { icon: Icon, gradient } = categoryVisual(categoryName);

  return (
    <div className={clsx("w-full h-full flex items-center justify-center bg-gradient-to-br", gradient, className)}>
      <Icon className={clsx("text-white/85", iconClassName || "w-1/3 h-1/3")} />
    </div>
  );
}

export const PLACEHOLDER_IMAGE_SENTINEL = "/placeholder.svg";
