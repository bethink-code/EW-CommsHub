'use client';

export interface SelectorCardItem {
  label: string;
  value: string;
  color?: string;
}

interface SelectorCardProps {
  items: SelectorCardItem[];
  title?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant?: 'compact' | 'detailed';
  className?: string;
  style?: React.CSSProperties;
}

export function SelectorCard({
  items,
  title,
  position,
  variant = 'detailed',
  className = '',
  style,
}: SelectorCardProps) {
  const positionStyles: React.CSSProperties = position
    ? {
        position: 'absolute',
        ...(position.includes('top') ? { top: '20px' } : { bottom: '20px' }),
        ...(position.includes('left') ? { left: '20px' } : { right: '20px' }),
      }
    : {};

  return (
    <div
      className={`selector-card ${className}`}
      style={{ ...positionStyles, ...style }}
    >
      {title && <div className="selector-card-title">{title}</div>}
      {items.map((item, index) => (
        <div key={index} className="selector-card-item">
          <div className="selector-card-label">
            {item.color && (
              <div
                className="graph-key-dot"
                style={{ backgroundColor: item.color }}
              />
            )}
            {item.label}
          </div>
          <div className="selector-card-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
