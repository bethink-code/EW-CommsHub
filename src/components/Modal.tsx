'use client';

import { useEffect, useCallback, ReactNode } from 'react';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Width variant - default is 'md' (560px) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Optional class name for the modal container */
  className?: string;
}

/**
 * Modal Component
 *
 * A reusable modal/popup component for wizard flows, confirmations, and quick actions.
 *
 * Usage:
 * ```tsx
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Confirm Action"
 *   footer={
 *     <>
 *       <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
 *       <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
 *     </>
 *   }
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
}: ModalProps) {
  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  // Add/remove event listeners and manage body scroll
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Don't render if not open
  if (!isOpen) return null;

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className={`modal modal-${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Standard modal footer with Cancel and Primary action buttons
 */
export interface ModalFooterProps {
  onCancel: () => void;
  onPrimary: () => void;
  cancelLabel?: string;
  primaryLabel: string;
  primaryIcon?: string;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  /** Show back button instead of cancel */
  showBack?: boolean;
  onBack?: () => void;
}

export function ModalFooter({
  onCancel,
  onPrimary,
  cancelLabel = 'Cancel',
  primaryLabel,
  primaryIcon,
  primaryDisabled = false,
  primaryLoading = false,
  showBack = false,
  onBack,
}: ModalFooterProps) {
  return (
    <>
      <div className="modal-footer-left">
        {showBack && onBack ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
          >
            <span className="material-icons-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Back
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
        )}
      </div>
      <div className="modal-footer-right">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onPrimary}
          disabled={primaryDisabled || primaryLoading}
        >
          {primaryLoading ? (
            <>
              <span className="modal-spinner"></span>
              Sending...
            </>
          ) : (
            <>
              {primaryIcon && (
                <span className="material-icons-outlined" style={{ fontSize: '18px' }}>{primaryIcon}</span>
              )}
              {primaryLabel}
            </>
          )}
        </button>
      </div>
    </>
  );
}

/**
 * Form field wrapper with label
 */
export interface ModalFieldProps {
  label: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  error?: string;
  hint?: string;
}

export function ModalField({ label, htmlFor, children, error, hint }: ModalFieldProps) {
  return (
    <div className="modal-field">
      <label className="modal-field-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && <span className="modal-field-error">{error}</span>}
      {hint && !error && <span className="modal-field-hint">{hint}</span>}
    </div>
  );
}

/**
 * Info banner for important messages
 */
export interface ModalInfoProps {
  children: ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'error';
}

export function ModalInfo({ children, variant = 'info' }: ModalInfoProps) {
  const icons = {
    info: 'info',
    warning: 'warning',
    success: 'check_circle',
    error: 'error',
  };

  return (
    <div className={`modal-info modal-info-${variant}`}>
      <span className="material-icons-outlined modal-info-icon">{icons[variant]}</span>
      <span className="modal-info-text">{children}</span>
    </div>
  );
}

/**
 * Section header within modal content
 */
export function ModalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="modal-section">
      <h3 className="modal-section-title">{title}</h3>
      {children}
    </div>
  );
}

/**
 * Required section indicator (locked, always included)
 */
export function ModalRequiredSection({ label }: { label: string }) {
  return (
    <div className="modal-required-section">
      <span className="material-icons-outlined modal-required-icon">info</span>
      <span className="modal-required-label">{label}</span>
      <span className="modal-required-badge">Required</span>
    </div>
  );
}

export default Modal;
