import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  showArrow?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  showArrow = false,
}: ButtonProps) {
  const baseClasses =
    'cursor-pointer group transition-all inline-flex items-center justify-center font-sora font-medium disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#030712] text-white hover:bg-[#030712]/90',
    secondary:
      'bg-white text-[#030712] border border-[#ebecec] hover:bg-[#ebecec]/5',
    outline:
      'bg-transparent text-[#030712] border border-[#ebecec] hover:bg-[#ebecec]/5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-full',
    md: 'px-6 py-3 rounded-full',
    lg: 'px-8 py-4 text-lg rounded-full',
  };

  const variantClasses = variants[variant];
  const sizeClasses = sizes[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
      {showArrow && (
        <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
      )}
    </button>
  );
}
