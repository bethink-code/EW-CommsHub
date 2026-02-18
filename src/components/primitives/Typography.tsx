import { ReactNode, CSSProperties } from 'react';

interface TypographyProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// Large Title - 24px, Semi Bold
export function Heading1({ children, className = '', style }: TypographyProps) {
  return (
    <h1
      className={className}
      style={{
        fontSize: 'var(--font-size-2xl)',
        fontWeight: 'var(--font-weight-semibold)',
        lineHeight: 'var(--line-height-normal)',
        color: '#1E293B',
        fontFamily: 'var(--font-family-base)',
        ...style
      }}
    >
      {children}
    </h1>
  );
}

// Medium Title - 20px, Medium
export function Heading2({ children, className = '', style }: TypographyProps) {
  return (
    <h2
      className={className}
      style={{
        fontSize: 'var(--font-size-xl)',
        fontWeight: 'var(--font-weight-medium)',
        lineHeight: 'var(--line-height-normal)',
        color: '#1E293B',
        fontFamily: 'var(--font-family-base)',
        ...style
      }}
    >
      {children}
    </h2>
  );
}

// Section Heading - 18px, Semi Bold
export function Heading3({ children, className = '', style }: TypographyProps) {
  return (
    <h3
      className={className}
      style={{
        fontSize: 'var(--font-size-l)',
        fontWeight: 'var(--font-weight-semibold)',
        lineHeight: 'var(--line-height-normal)',
        color: '#1E293B',
        fontFamily: 'var(--font-family-base)',
        ...style
      }}
    >
      {children}
    </h3>
  );
}

// Text - 16px/14px variants with different weights
export function BodyText({ children, className = '', style }: TypographyProps) {
  return (
    <p
      className={className}
      style={{
        fontSize: 'var(--font-size-base)',
        fontWeight: 'var(--font-weight-regular)',
        lineHeight: 'var(--line-height-normal)',
        color: '#1E293B',
        fontFamily: 'var(--font-family-base)',
        ...style
      }}
    >
      {children}
    </p>
  );
}

// Small Text - 13px, Regular/Medium
export function Label({ children, className = '', style }: TypographyProps) {
  return (
    <label
      className={className}
      style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
        lineHeight: 'var(--line-height-normal)',
        color: '#1E293B',
        fontFamily: 'var(--font-family-base)',
        ...style
      }}
    >
      {children}
    </label>
  );
}

// Caption - 12px, Regular (from design system this is muted text)
export function Caption({ children, className = '', style }: TypographyProps) {
  return (
    <span
      className={className}
      style={{
        fontSize: '12px',
        fontWeight: 'var(--font-weight-regular)',
        lineHeight: '1.4',
        color: '#94A3B8',
        fontFamily: 'var(--font-family-base)',
        ...style
      }}
    >
      {children}
    </span>
  );
}
