import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  variant?: 'default' | 'ivory' | 'glass';
}

export const Card = ({
  className,
  hoverable = false,
  variant = 'default',
  children,
  ...props
}: CardProps) => {
  const variantStyles = {
    default: 'bg-white border-stone-200/70',
    ivory: 'bg-[#fcfaf6] border-stone-200/80',
    glass: 'glass-panel',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'border rounded-2xl p-6 shadow-soft-sm transition-all duration-200',
          variantStyles[variant],
          hoverable && 'hover:shadow-soft-md hover:border-stone-300 hover:-translate-y-0.5',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
