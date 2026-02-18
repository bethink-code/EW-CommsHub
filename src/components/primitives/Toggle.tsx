'use client';

import { ChangeEvent } from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
  className?: string;
  id?: string;
}

export function Toggle({
  checked = false,
  onChange,
  disabled = false,
  label,
  labelPosition = 'right',
  className = '',
  id,
}: ToggleProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  const toggleId = id || `toggle-${Math.random().toString(36).substring(7)}`;

  const toggleElement = (
    <label className={`toggle-switch ${className}`} htmlFor={toggleId}>
      <input
        type="checkbox"
        id={toggleId}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        aria-label={label || 'Toggle switch'}
      />
      <span className="toggle-slider"></span>
    </label>
  );

  if (!label) {
    return toggleElement;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {labelPosition === 'left' && (
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#475569',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
          }}
        >
          {label}
        </span>
      )}
      {toggleElement}
      {labelPosition === 'right' && (
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#475569',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
