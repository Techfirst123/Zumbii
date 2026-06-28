import { forwardRef, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-zumbii-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-zumbii-600 text-white hover:bg-zumbii-700 active:bg-zumbii-800 shadow-md shadow-zumbii-600/20 hover:shadow-lg hover:shadow-zumbii-600/30": variant === "primary",
            "bg-white text-zumbii-700 border border-zumbii-200 hover:bg-zumbii-50 active:bg-zumbii-100": variant === "secondary",
            "border-2 border-zumbii-600 text-zumbii-600 hover:bg-zumbii-50 active:bg-zumbii-100": variant === "outline",
            "text-zumbii-600 hover:bg-zumbii-50 active:bg-zumbii-100": variant === "ghost",
            "bg-white/90 text-zumbii-700 hover:bg-white shadow-lg backdrop-blur-sm": variant === "white",
            "px-3 py-1.5 text-sm gap-1.5": size === "sm",
            "px-5 py-2.5 text-sm gap-2": size === "md",
            "px-8 py-3.5 text-base gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
