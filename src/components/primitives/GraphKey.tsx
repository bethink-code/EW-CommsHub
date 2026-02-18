'use client';

import { GraphToggle } from './GraphToggle';

export interface GraphKeyItem {
  label: string;
  color: string;
  checked?: boolean;
}

interface GraphKeyProps {
  items: GraphKeyItem[];
  onToggle?: (index: number) => void;
  showToggles?: boolean;
  variant?: 'simple' | 'interactive';
  className?: string;
}

export function GraphKey({
  items,
  onToggle,
  showToggles = false,
  variant = 'simple',
  className = '',
}: GraphKeyProps) {
  const handleToggle = (index: number, checked: boolean) => {
    if (onToggle) {
      onToggle(index);
    }
  };

  return (
    <div className={`graph-key ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="graph-key-item">
          {variant === 'interactive' && showToggles ? (
            <>
              <GraphToggle
                checked={item.checked !== false}
                onChange={(checked) => handleToggle(index, checked)}
                variant="single"
              />
              <div
                className="graph-key-dot"
                style={{ backgroundColor: item.color }}
              />
              <span className="graph-key-label">{item.label}</span>
            </>
          ) : (
            <>
              <div
                className="graph-key-dot"
                style={{ backgroundColor: item.color }}
              />
              <span className="graph-key-label">{item.label}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
