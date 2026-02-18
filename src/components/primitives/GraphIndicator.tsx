'use client';

interface GraphIndicatorProps {
  x: number;
  y?: number;
  color?: string;
  showLine?: boolean;
  showCircle?: boolean;
  label?: string;
  height?: string | number;
  className?: string;
}

export function GraphIndicator({
  x,
  y,
  color = '#016991',
  showLine = true,
  showCircle = true,
  label,
  height = '100%',
  className = '',
}: GraphIndicatorProps) {
  return (
    <div
      className={`graph-indicator ${className}`}
      style={{
        left: x,
        top: 0,
        height,
      }}
    >
      {showLine && (
        <div
          className="graph-indicator-line"
          style={{ backgroundColor: color }}
        />
      )}
      {showCircle && y !== undefined && (
        <div
          className="graph-indicator-circle"
          style={{
            backgroundColor: color,
            top: y,
          }}
        />
      )}
      {label && (
        <div
          className="graph-indicator-label"
          style={{
            top: y !== undefined ? y - 30 : 10,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
