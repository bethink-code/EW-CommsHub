'use client';

import { useState } from 'react';
import { Client, Channel, CHANNELS } from '@/types/communications';
import './portal-invite.css';

// =============================================================================
// TYPES
// =============================================================================

type ActivationStep = 'message' | 'otp' | 'password' | 'success' | 'login';

// =============================================================================
// COMPONENT
// =============================================================================

export interface PortalActivationPreviewProps {
  client: Client;
  channel: Channel;
  message: string;
  onClose: () => void;
}

export function PortalActivationPreview({
  client,
  channel,
  message,
  onClose,
}: PortalActivationPreviewProps) {
  const [step, setStep] = useState<ActivationStep>('message');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Replace placeholders in message
  const renderedMessage = message
    .replace(/\{FirstName\}/g, client.firstName)
    .replace(/\{LastName\}/g, client.lastName)
    .replace(/\{Link\}/g, 'https://portal.elitewealth.co.za/setup/x8Kj2...')
    .replace(/\{AdviserName\}/g, 'Rassie du Preez');

  // Get masked phone for 2FA display
  const maskedPhone = client.phone
    ? client.phone.replace(/(\+27\s?\d{2})\s?\d{3}\s?(\d{4})/, '$1 *** $2')
    : '+27 82 *** 6717';

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newValues = [...otpValues];
      newValues[index] = value;
      setOtpValues(newValues);
    }
  };

  // Password requirements
  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'Passwords match', met: password.length > 0 && password === confirmPassword },
  ];

  // Step labels for navigation
  const steps: { key: ActivationStep; label: string }[] = [
    { key: 'message', label: 'Invitation' },
    { key: 'otp', label: 'Verify' },
    { key: 'password', label: 'Password' },
    { key: 'success', label: 'Success' },
    { key: 'login', label: 'Login' },
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
                  Client taps the activation link
                </div>
              </div>

              <div className="journey-channel-badge">
                <span className="material-icons-outlined">{CHANNELS[channel].icon}</span>
                {CHANNELS[channel].label}
              </div>
            </div>
          )}

          {/* Step 2: 2FA Verification */}
          {step === 'otp' && (
            <div className="journey-screen-container">
              <div className="journey-screen">
                {/* Elite Wealth header */}
                <div className="journey-screen-brand">
                  <span className="brand-elite">ELITE</span>
                  <span className="brand-wealth">WEALTH</span>
                </div>

                <h2 className="journey-screen-title">Verify Your Identity</h2>
                <p className="journey-screen-subtitle">
                  We've sent a one-time code to <span className="journey-highlight">{maskedPhone}</span>
                </p>

                {/* OTP input boxes */}
                <div className="journey-otp-inputs">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="journey-otp-input"
                      placeholder=""
                    />
                  ))}
                </div>

                <button className="journey-screen-button">Verify & Continue</button>

                <p className="journey-screen-resend">
                  Didn't receive a code? <a href="#">Resend</a>
                </p>
              </div>

              <div className="journey-info-callout">
                <span className="material-icons-outlined">info</span>
                <div>
                  <strong>Common issues at this step:</strong>
                  <ul>
                    <li>Code not received - check client's phone has signal</li>
                    <li>Code expired - valid for 5 minutes</li>
                    <li>Wrong number - client needs to contact you</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Password Creation */}
          {step === 'password' && (
            <div className="journey-screen-container">
              <div className="journey-screen">
                {/* Elite Wealth header */}
                <div className="journey-screen-brand">
                  <span className="brand-elite">ELITE</span>
                  <span className="brand-wealth">WEALTH</span>
                </div>

                <h2 className="journey-screen-title">Create Your Password</h2>
                <p className="journey-screen-subtitle">
                  This password will work for both the web portal and mobile app.
                </p>

                {/* Username (readonly) */}
                <div className="journey-form-field-full">
                  <label>Username</label>
                  <div className="journey-form-value readonly">
                    {client.email || 'peter.vdm@gmail.com'}
                  </div>
                  <div className="journey-form-hint">This is your login for the Wealth Portal</div>
                </div>

                {/* Password input */}
                <div className="journey-form-field-full">
                  <label>Create Password</label>
                  <div className="journey-password-field">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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
                      placeholder="Confirm your password"
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

                <button className="journey-screen-button">Create Account</button>
              </div>

              <div className="journey-info-callout">
                <span className="material-icons-outlined">info</span>
                <div>
                  <strong>Common issues at this step:</strong>
                  <ul>
                    <li>Password too weak - must meet all requirements</li>
                    <li>Passwords don't match - check for typos</li>
                    <li>Forgotten password later - use "Forgot Password" link</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="journey-screen-container">
              <div className="journey-screen journey-screen-success">
                {/* Success icon */}
                <div className="journey-success-icon">
                  <span className="material-icons-outlined">check</span>
                </div>

                <h2 className="journey-screen-title">You're All Set!</h2>
                <p className="journey-screen-subtitle">
                  Your Wealth Portal account is ready. Access your portfolio anytime, anywhere.
                </p>

                {/* Login details box */}
                <div className="journey-login-details">
                  <div className="journey-login-details-title">Your Login Details</div>
                  <div className="journey-login-row">
                    <span>Username</span>
                    <span>{client.email || 'peter.vdm@gmail.com'}</span>
                  </div>
                  <div className="journey-login-row">
                    <span>Password</span>
                    <span>••••••••</span>
                  </div>
                </div>

                <button className="journey-screen-button">
                  <span className="material-icons-outlined">open_in_new</span>
                  Go to Wealth Portal
                </button>

                {/* App store badges */}
                <div className="journey-app-badges">
                  <div className="journey-app-badge">
                    <span className="material-icons-outlined">apple</span>
                    <div>
                      <span className="badge-label">Download on the</span>
                      <span className="badge-store">App Store</span>
                    </div>
                  </div>
                  <div className="journey-app-badge">
                    <span className="material-icons-outlined">android</span>
                    <div>
                      <span className="badge-label">GET IT ON</span>
                      <span className="badge-store">Google Play</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="journey-info-callout journey-info-success">
                <span className="material-icons-outlined">check_circle</span>
                <div>
                  <strong>Portal is now activated!</strong>
                  <p>You'll receive a notification when the client activates. They can now access their portfolio, documents, and message you directly.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Login Screen */}
          {step === 'login' && (
            <div className="journey-screen-container">
              <div className="journey-screen">
                {/* Elite Wealth header */}
                <div className="journey-screen-brand">
                  <span className="brand-elite">ELITE</span>
                  <span className="brand-wealth">WEALTH</span>
                </div>

                <h2 className="journey-screen-title">Welcome Back</h2>
                <p className="journey-screen-subtitle">
                  Sign in to access your Wealth Portal
                </p>

                {/* Username input */}
                <div className="journey-form-field-full">
                  <label>Username</label>
                  <input
                    type="email"
                    value={client.email || 'peter.vdm@gmail.com'}
                    readOnly
                    className="journey-password-input"
                    style={{ backgroundColor: '#f8fafc' }}
                  />
                </div>

                {/* Password input */}
                <div className="journey-form-field-full">
                  <label>Password</label>
                  <div className="journey-password-field">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="journey-password-input"
                    />
                    <button type="button" className="journey-password-toggle">
                      <span className="material-icons-outlined">visibility</span>
                    </button>
                  </div>
                </div>

                <div className="journey-forgot-password">
                  <a href="#">Forgot password?</a>
                </div>

                <button className="journey-screen-button">Sign In</button>

                <div className="journey-login-divider">
                  <span>or continue with</span>
                </div>

                <div className="journey-social-buttons">
                  <button className="journey-social-button">
                    <span className="material-icons-outlined">fingerprint</span>
                    Biometrics
                  </button>
                </div>
              </div>

              <div className="journey-info-callout journey-info-success">
                <span className="material-icons-outlined">celebration</span>
                <div>
                  <strong>End of client journey</strong>
                  <p>The client is now fully onboarded and can access their portfolio, documents, and communicate with you through the portal.</p>
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

export default PortalActivationPreview;
