import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  src?: string | null;
  name?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar = ({ src, name = 'User', fallback, size = 'md', className }: AvatarProps) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const displayName = fallback || name;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={twMerge(clsx('rounded-full object-cover ring-2 ring-white shadow-sm', sizes[size], className))}
      />
    );
  }

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-full bg-gradient-to-tr from-forest-700 to-forest-500 text-white flex items-center justify-center font-medium ring-2 ring-white shadow-soft-sm',
          sizes[size],
          className
        )
      )}
    >
      {initials}
    </div>
  );
};
