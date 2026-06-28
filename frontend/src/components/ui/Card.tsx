import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({ children, className, hover = true, glass = false }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl overflow-hidden",
        glass
          ? "bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg"
          : "bg-white border border-zumbii-100 shadow-sm",
        hover && "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
