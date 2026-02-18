import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isError?: boolean;
  isSuccess?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  helperText,
  errorMessage,
  isError = false,
  isSuccess = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
  required = false,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substring(7)}`;

  // Determine state classes
  let stateClass = 'input-default';
  if (isError || errorMessage) {
    stateClass = 'input-error';
  } else if (isSuccess) {
    stateClass = 'input-success';
  } else if (disabled) {
    stateClass = 'input-disabled';
  }

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-container">
        {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}

        <input
          id={inputId}
          className={`input ${stateClass} ${leftIcon ? 'input-with-left-icon' : ''} ${rightIcon ? 'input-with-right-icon' : ''} ${className}`}
          disabled={disabled}
          aria-required={required}
          aria-invalid={isError || !!errorMessage}
          aria-describedby={
            errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}
      </div>

      {helperText && !errorMessage && (
        <span id={`${inputId}-helper`} className="input-helper">
          {helperText}
        </span>
      )}

      {errorMessage && (
        <span id={`${inputId}-error`} className="input-error-message" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isError?: boolean;
  rows?: number;
}

export function TextArea({
  label,
  helperText,
  errorMessage,
  isError = false,
  className = '',
  disabled = false,
  required = false,
  rows = 4,
  id,
  ...props
}: TextAreaProps) {
  const inputId = id || `textarea-${Math.random().toString(36).substring(7)}`;

  // Determine state classes
  let stateClass = 'input-default';
  if (isError || errorMessage) {
    stateClass = 'input-error';
  } else if (disabled) {
    stateClass = 'input-disabled';
  }

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        className={`input textarea ${stateClass} ${className}`}
        disabled={disabled}
        aria-required={required}
        aria-invalid={isError || !!errorMessage}
        aria-describedby={
          errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        {...(props as any)}
      />

      {helperText && !errorMessage && (
        <span id={`${inputId}-helper`} className="input-helper">
          {helperText}
        </span>
      )}

      {errorMessage && (
        <span id={`${inputId}-error`} className="input-error-message" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
