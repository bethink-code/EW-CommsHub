'use client';

import { useState } from 'react';
import { Client, Channel, CHANNELS } from '@/types/communications';
import '../portal-invite/portal-invite.css';

// =============================================================================
// TYPES
// =============================================================================

type ResetStep = 'message' | 'password' | 'success';

// =============================================================================
// COMPONENT
// =============================================================================

export interface PasswordResetPreviewProps {
  client: Client;
  channel: Channel;
  message: string;
  onClose: () => void;
}

export function PasswordResetPreview({
  client,
  channel,
  message,
  onClose,
}: PasswordResetPreviewProps) {
  const [step, setStep] = useState<ResetStep>('message');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Replace placeholders in message
  const renderedMessage = message
    .replace(/\{FirstName\}/g, client.firstName)
    .replace(/\{LastName\}/g, client.lastName)
    .replace(/\{Link\}/g, 'https://portal.elitewealth.co.za/reset/x8Kj2...')
    .replace(/\{AdviserName\}/g, 'Rassie du Preez');

  // Password requirements
  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'Passwords match', met: password.length > 0 && password === confirmPassword },
  ];

  // Step labels for navigation
  const steps: { key: ResetStep; label: string }[] = [
    { key: 'message', label: 'Reset Link' },
    { key: 'password', label: 'New Password' },
    { key: 'success', label: 'Confirmed' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="journey-preview-overlay">
      <div className="journey-preview-container">
        {/* Header */}
        <div className="journey-preview-header">
          <div className="journey-preview-title">
            <span className="material-icons-outlined">visibility</span>
            Client Experience Preview
          </div>
          <button className="journey-preview-close" onClick={onClose}>
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Step indicator */}
        <div className="journey-steps">
          {steps.map((s, index) => (
            <div
              key={s.key}
              className={`journey-step ${step === s.key ? 'active' : ''} ${
                index < currentStepIndex ? 'completed' : ''
              }`}
              onClick={() => setStep(s.key)}
            >
              <div className="journey-step-number">
                {index < currentStepIndex ? (
                  <span className="material-icons-outlined">check</span>
                ) : (
                  index + 1
                )}
              </div>
              <span className="journey-step-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className="journey-preview-content">
          {/* Step 1: Message Received */}
          {step === 'message' && (
            <div className="journey-phone-container">
              <div className="journey-phone">
                {/* Phone frame - dark header */}
                <div className="journey-phone-header">
                  <span className="journey-phone-brand">Elite Wealth</span>
                  <span className="journey-phone-time">Just now</span>
                </div>

                {/* Message content */}
                <div className="journey-phone-body">
                  <div className="journey-message-content">
                    {renderedMessage.split('\n').map((line, i) => (
                      <p key={i} className={line.includes('http') || line.includes('elitewealth') ? 'journey-link' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Tap indicator */}
                <div className="journey-tap-hint">
                  <span className="material-icons-outlined">touch_app</span>
                  Client taps the reset link
                </div>
              </div>

              <div className="journey-channel-badge">
                <span className="material-icons-outlined">{CHANNELS[channel].icon}</span>
                {CHANNELS[channel].label}
              </div>
            </div>
          )}

          {/* Step 2: New Password */}
          {step === 'password' && (
            <div className="journey-screen-container">
              <div className="journey-screen">
                {/* Elite Wealth header */}
                <div className="journey-screen-brand">
                  <span className="brand-elite">ELITE</span>
                  <span className="brand-wealth">{' '}WEALTH</span>
                </div>

                <h2 className="journey-screen-title">Reset Your Password</h2>
                <p className="journey-screen-subtitle">
                  Create a new password for your Wealth Portal account.
                </p>

                {/* Username (readonly) */}
                <div className="journey-form-field-full">
                  <label>Account</label>
                  <div className="journey-form-value readonly">
                    {client.email || 'client@email.com'}
                  </div>
                </div>

                {/* Password input */}
                <div className="journey-form-field-full">
                  <label>New Password</label>
                  <div className="journey-password-field">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="journey-password-input"
                    />
                    <button type="button" className="journey-password-toggle">
                      <span className="material-icons-outlined">visibility</span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password input */}
                <div className="journey-form-field-full">
                  <label>Confirm Password</label>
                  <div className="journey-password-field">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="journey-password-input"
                    />
                    <button type="button" className="journey-password-toggle">
                      <span className="material-icons-outlined">visibility</span>
                    </button>
                  </div>
                </div>

                {/* Password requirements */}
                <div className="journey-password-requirements">
                  <div className="journey-password-requirements-title">Password Requirements</div>
                  {passwordRequirements.map((req, i) => (
                    <div key={i} className={`journey-password-req ${req.met ? 'met' : ''}`}>
                      <span className="material-icons-outlined">
                        {req.met ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      {req.label}
                    </div>
                  ))}
                </div>

                <button className="journey-screen-button">Reset Password</button>
              </div>

              <div className="journey-info-callout">
                <span className="material-icons-outlined">info</span>
                <div>
                  <strong>Common issues at this step:</strong>
                  <ul>
                    <li>Password too weak - must meet all requirements</li>
                    <li>Reset link expired - valid for 24 hours</li>
                    <li>Client locked out - contact adviser to resend</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="journey-screen-container">
              <div className="journey-screen journey-screen-success">
                {/* Success icon */}
                <div className="journey-success-icon">
                  <span className="material-icons-outlined">check</span>
                </div>

                <h2 className="journey-screen-title">Password Reset Complete</h2>
                <p className="journey-screen-subtitle">
                  Your password has been updated. You can now sign in with your new password.
                </p>

                <button className="journey-screen-button">
                  <span className="material-icons-outlined">login</span>
                  Sign In to Wealth Portal
                </button>
              </div>

              <div className="journey-info-callout journey-info-success">
                <span className="material-icons-outlined">check_circle</span>
                <div>
                  <strong>Password has been reset</strong>
                  <p>The client can now log in with their new password. You&apos;ll be notified when they next sign in.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="journey-preview-footer">
          <button
            className="btn btn-secondary"
            onClick={() => {
              const prevIndex = currentStepIndex - 1;
              if (prevIndex >= 0) {
                setStep(steps[prevIndex].key);
              }
            }}
            disabled={currentStepIndex === 0}
          >
            <span className="material-icons-outlined">arrow_back</span>
            Previous
          </button>

          <div className="journey-footer-center">
            <span className="journey-step-counter">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          {currentStepIndex < steps.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                const nextIndex = currentStepIndex + 1;
                if (nextIndex < steps.length) {
                  setStep(steps[nextIndex].key);
                }
              }}
            >
              Next
              <span className="material-icons-outlined">arrow_forward</span>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>
              Done
              <span className="material-icons-outlined">check</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PasswordResetPreview;
