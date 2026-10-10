import React, { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-slate-800 tracking-tight">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2.5 bg-white border border-stone-200/90 rounded-xl text-slate-900 placeholder:text-stone-400',
              'text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 shadow-soft-sm',
              'disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed',
              error && 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500',
              className
            )
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
        {helperText && !error && <p className="text-xs text-stone-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
