'use client';

export interface GraphStatusOption {
  value: string;
  label: string;
  color?: string;
}

interface GraphStatusSelectorProps {
  options: GraphStatusOption[];
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'toggle' | 'radio';
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export function GraphStatusSelector({
  options,
  value,
  onChange,
  variant = 'radio',
  layout = 'horizontal',
  className = '',
}: GraphStatusSelectorProps) {
  const handleClick = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
  };

  return (
    <div
      className={`graph-status-selector ${className}`}
      style={{
        flexDirection: layout === 'vertical' ? 'column' : 'row',
      }}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <div
            key={option.value}
            className="graph-status-option"
            onClick={() => handleClick(option.value)}
            role="radio"
            aria-checked={isActive}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(option.value);
              }
            }}
          >
            <div className={`graph-status-radio ${isActive ? 'active' : ''}`}>
              {option.color && (
                <div
                  style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    background: option.color,
                    borderRadius: '50%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
            </div>
            <span className="graph-toggle-label">{option.label}</span>
          </div>
        );
      })}
    </div>
  );
}
