import { clsx } from "clsx";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeader({ title, subtitle, eyebrow, align = "center", light = false, className }: SectionHeaderProps) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={clsx(
            "text-xs sm:text-sm font-bold uppercase tracking-widest mb-2",
            light ? "text-gold-400" : "text-brand-red-600"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={clsx(
          "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight",
          light ? "text-white" : "text-text-primary"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            "mt-4 text-lg sm:text-xl leading-relaxed",
            light ? "text-white/70" : "text-text-secondary"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
