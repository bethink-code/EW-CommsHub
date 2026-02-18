import { ReactNode, CSSProperties } from 'react';

interface BoxProps {
  children?: ReactNode;
  className?: string;
  padding?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl';
  margin?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl';
  style?: CSSProperties;
}

export function Box({ children, className = '', padding, margin, style }: BoxProps) {
  const paddingClass = padding ? `p-${padding}` : '';
  const marginClass = margin ? `m-${margin}` : '';

  return (
    <div className={`${paddingClass} ${marginClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

interface FlexProps extends BoxProps {
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: 'xs' | 'sm' | 'base' | 'md' | 'lg';
}

export function Flex({
  children,
  className = '',
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 'base',
  padding,
  margin,
  style
}: FlexProps) {
  const gapValue = {
    xs: '4px',
    sm: '8px',
    base: '16px',
    md: '24px',
    lg: '32px',
  }[gap];

  const paddingClass = padding ? `p-${padding}` : '';
  const marginClass = margin ? `m-${margin}` : '';

  return (
    <div
      className={`${paddingClass} ${marginClass} ${className}`}
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align,
        justifyContent: justify === 'start' ? 'flex-start' : justify === 'end' ? 'flex-end' : justify === 'between' ? 'space-between' : justify === 'around' ? 'space-around' : justify,
        gap: gapValue,
        ...style
      }}
    >
      {children}
    </div>
  );
}
