import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'primary';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'primary', children, className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}
