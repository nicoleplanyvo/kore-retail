import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

const VARIANTS = {
  primary: 'bg-kore-ink text-white hover:bg-kore-ink/90 disabled:bg-gray-300 disabled:text-gray-500',
  secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500',
};

export function LoadingButton({ isLoading, loadingText, variant = 'primary', children, disabled, className = '', ...props }: LoadingButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
