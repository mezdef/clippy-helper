'use client';
import React, { JSX } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ButtonVariant, ComponentSize } from '@/types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children?: React.ReactNode;
}

const buttonVariants = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
  destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  outline:
    'border border-gray-300 hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300',
  secondary:
    'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100',
  ghost:
    'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
  link: 'text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline dark:text-blue-400 dark:hover:text-blue-300',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled,
  className,
  children,
  ...props
}): JSX.Element => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        buttonVariants[variant],
        buttonSizes[size],
        // Adjust padding for icon-only buttons
        !children && Icon && 'px-2',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="h-4 w-4" />
      )}

      {children && <span>{children}</span>}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="h-4 w-4" />
      )}
    </button>
  );
};
