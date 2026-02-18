'use client';

import { Toggle } from './Toggle';

interface GraphToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  centerLabel?: string;
  variant?: 'single' | 'labeled' | 'centered';
  className?: string;
}

export function GraphToggle({
  checked = false,
  onChange,
  leftLabel,
  rightLabel,
  centerLabel,
  variant = 'single',
  className = '',
}: GraphToggleProps) {
  if (variant === 'single') {
    return <Toggle checked={checked} onChange={onChange} className={className} />;
  }

  if (variant === 'centered' && centerLabel) {
    return (
      <div className={`graph-toggle-labeled ${className}`}>
        <Toggle checked={checked} onChange={onChange} />
        <span className="graph-toggle-label">{centerLabel}</span>
      </div>
    );
  }

  if (variant === 'labeled' && (leftLabel || rightLabel)) {
    return (
      <div className={`graph-toggle-labeled ${className}`}>
        {leftLabel && <span className="graph-toggle-label">{leftLabel}</span>}
        <Toggle checked={checked} onChange={onChange} />
        {rightLabel && <span className="graph-toggle-label">{rightLabel}</span>}
      </div>
    );
  }

  return <Toggle checked={checked} onChange={onChange} className={className} />;
}
