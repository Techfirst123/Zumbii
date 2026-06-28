'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, EyeOff, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'search';
  containerClassName?: string;
}

const sizeStyles = {
  sm: 'h-9 text-xs px-3 rounded-lg',
  md: 'h-10 text-sm px-4 rounded-xl',
  lg: 'h-12 text-base px-4 rounded-xl',
};

const iconSizeStyles = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = 'left',
      size = 'md',
      variant = 'default',
      type = 'text',
      disabled,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    const isSearch = variant === 'search';
    const resolvedType = type === 'password' && showPassword ? 'text' : type;

    const inputElement = (
      <div className="relative">
        {(icon || isSearch) && iconPosition === 'left' && (
          <div
            className={clsx(
              'absolute left-0 top-0 flex items-center justify-center pl-3 pointer-events-none',
              sizeStyles[size]
            )}
          >
            {isSearch ? (
              <Search className={clsx('text-text-tertiary', iconSizeStyles[size])} />
            ) : (
              <span className={clsx('text-text-tertiary', iconSizeStyles[size])}>{icon}</span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type={resolvedType}
          disabled={disabled}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={clsx(
            'w-full bg-surface border border-border text-text-primary placeholder:text-text-tertiary transition-all duration-200 outline-none',
            'focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-tertiary',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
            sizeStyles[size],
            (icon || isSearch) && iconPosition === 'left' && 'pl-10',
            iconPosition === 'right' && 'pr-10',
            type === 'password' && 'pr-10',
            isSearch && 'pr-10',
            className
          )}
          {...props}
        />
        {(icon || type === 'password') && iconPosition === 'right' && (
          <div
            className={clsx(
              'absolute right-0 top-0 flex items-center justify-center pr-3',
              sizeStyles[size]
            )}
          >
            {type === 'password' ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-tertiary hover:text-text-secondary transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className={iconSizeStyles[size]} />
                ) : (
                  <Eye className={iconSizeStyles[size]} />
                )}
              </button>
            ) : (
              <span className={clsx('text-text-tertiary', iconSizeStyles[size])}>{icon}</span>
            )}
          </div>
        )}
        <AnimatePresence>
          {focused && !error && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-zumbii-400 rounded-full origin-left pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
    );

    if (!label && !error && !hint) {
      return inputElement;
    }

    return (
      <div className={clsx('space-y-1.5', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        {inputElement}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1 text-xs text-red-500"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </motion.p>
          )}
          {!error && hint && (
            <p className="text-xs text-text-tertiary">{hint}</p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
