'use client';

import { useState } from 'react';
import { Client, Channel, CHANNELS } from '@/types/communications';
import './info-request.css';

// =============================================================================
// TYPES
// =============================================================================

type JourneyStep = 'message' | 'otp' | 'portal';

// =============================================================================
// COMPONENT
// =============================================================================

export interface ClientJourneyPreviewProps {
  client: Client;
  channel: Channel;
  message: string;
  onClose: () => void;
}

export function ClientJourneyPreview({
  client,
  channel,
  message,
  onClose,
}: ClientJourneyPreviewProps) {
  const [step, setStep] = useState<JourneyStep>('message');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);

  // Replace placeholders in message
  const renderedMessage = message
    .replace(/\{FirstName\}/g, client.firstName)
    .replace(/\{LastName\}/g, client.lastName)
    .replace(/\{Link\}/g, 'https://elitewealth.co.za/info/x8Kj2...')
    .replace(/\{AdviserName\}/g, 'Rassie du Preez');

  // Get masked phone for 2FA display
  const maskedPhone = client.phone
    ? client.phone.replace(/(\+27\s?\d{2})\s?\d{3}\s?(\d{4})/, '$1 *** $2')
    : '+27 82 *** 6717';

  // Current time for phone status bar
  const currentTime = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newValues = [...otpValues];
      newValues[index] = value;
      setOtpValues(newValues);
    }
  };

  // Step labels for navigation
  const steps: { key: JourneyStep; label: string }[] = [
    { key: 'message', label: 'Message Received' },
    { key: 'otp', label: '2FA Verification' },
    { key: 'portal', label: 'Enter Portal' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="journey-preview-overlay">
      <div className="journey-preview-container">
        {/* Header */}
        <div className="journey-preview-header">
          <div className="journey-preview-title">
            <span className="material-icons-outlined">visibility</span>
            Client Journey Preview
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
                      <p key={i} className={line.startsWith('http') ? 'journey-link' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Tap indicator */}
                <div className="journey-tap-hint">
                  <span className="material-icons-outlined">touch_app</span>
                  Client taps the link
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
                    <li>Code not received - check spam folder for email</li>
                    <li>Code expired - valid for 5 minutes</li>
                    <li>Wrong number - client needs to contact adviser</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Portal Entry */}
          {step === 'portal' && (
            <div className="journey-screen-container">
              <div className="journey-screen journey-screen-portal">
                {/* Elite Wealth header bar */}
                <div className="journey-portal-header">
                  <div className="journey-screen-brand">
                    <span className="brand-elite">ELITE</span>
                    <span className="brand-wealth">WEALTH</span>
                  </div>
                  <div className="journey-portal-nav">
                    <span className="journey-nav-step active">1</span>
                    <span className="journey-nav-line"></span>
                    <span className="journey-nav-step">2</span>
                    <span className="journey-nav-line"></span>
                    <span className="journey-nav-step">3</span>
                    <span className="journey-nav-line"></span>
                    <span className="journey-nav-step">4</span>
                    <span className="journey-nav-line"></span>
                    <span className="journey-nav-step">5</span>
                    <span className="journey-nav-line"></span>
                    <span className="journey-nav-step">6</span>
                  </div>
                </div>

                {/* Portal content preview */}
                <div className="journey-portal-content">
                  <h2>Your Contact Details</h2>
                  <p className="journey-portal-subtitle">Please confirm or update your contact information.</p>

                  <div className="journey-portal-form-preview">
                    <div className="journey-form-row">
                      <div className="journey-form-field">
                        <label>First Name</label>
                        <div className="journey-form-value">{client.firstName}</div>
                      </div>
                      <div className="journey-form-field">
                        <label>Surname</label>
                        <div className="journey-form-value">{client.lastName}</div>
                      </div>
                    </div>
                    <div className="journey-form-row">
                      <div className="journey-form-field">
                        <label>Email Address</label>
                        <div className="journey-form-value">{client.email || 'client@email.com'}</div>
                      </div>
                      <div className="journey-form-field">
                        <label>Mobile Number</label>
                        <div className="journey-form-value">{client.phone || '+27 82 920 6717'}</div>
                      </div>
                    </div>
                  </div>

                  <button className="journey-portal-next">
                    Next: Family Members
                    <span className="material-icons-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div className="journey-info-callout journey-info-success">
                <span className="material-icons-outlined">check_circle</span>
                <div>
                  <strong>Client is now in the portal</strong>
                  <p>They'll complete each section and submit when done. You'll be notified of their progress.</p>
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

export default ClientJourneyPreview;
