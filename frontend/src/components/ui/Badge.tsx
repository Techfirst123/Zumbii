'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Sparkles, Tag, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'new' | 'sale' | 'brand';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-tertiary text-text-secondary border-border',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  new: 'bg-gold-100 text-gold-800 border-gold-200',
  sale: 'bg-rose-50 text-rose-700 border-rose-200',
  brand: 'bg-zumbii-950 text-gold-400 border-zumbii-900',
};

const sizeStyles = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
};

const variantIcons: Record<BadgeVariant, ReactNode | null> = {
  default: null,
  success: <CheckCircle className="w-3 h-3" />,
  warning: <AlertTriangle className="w-3 h-3" />,
  danger: <AlertCircle className="w-3 h-3" />,
  info: <Info className="w-3 h-3" />,
  new: <Sparkles className="w-3 h-3" />,
  sale: <Tag className="w-3 h-3" />,
  brand: null,
};

function Badge({ variant = 'default', children, className, size = 'md' }: BadgeProps) {
  const icon = variantIcons[variant];

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium border rounded-full whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
