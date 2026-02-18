'use client';

import { useState } from 'react';
import { Client, Channel, CHANNELS } from '@/types/communications';
import '../info-request/info-request.css';

// =============================================================================
// TYPES
// =============================================================================

type UploadStep = 'message' | 'upload' | 'success';

// =============================================================================
// COMPONENT
// =============================================================================

export interface DocumentRequestPreviewProps {
  client: Client;
  channel: Channel;
  message: string;
  documents?: string[];
  onClose: () => void;
}

export function DocumentRequestPreview({
  client,
  channel,
  message,
  documents = [],
  onClose,
}: DocumentRequestPreviewProps) {
  const [step, setStep] = useState<UploadStep>('message');

  // Replace placeholders in message
  const renderedMessage = message
    .replace(/\{FirstName\}/g, client.firstName)
    .replace(/\{LastName\}/g, client.lastName)
    .replace(/\{Link\}/g, 'https://portal.elitewealth.co.za/upload/x8Kj2...')
    .replace(/\{AdviserName\}/g, 'Rassie du Preez')
    .replace(/\{DocumentList\}/g, documents.length > 0
      ? documents.map(d => `- ${d}`).join('\n')
      : '- Payslips\n- Bank statements');

  // Step labels for navigation
  const steps: { key: UploadStep; label: string }[] = [
    { key: 'message', label: 'Request Received' },
    { key: 'upload', label: 'Upload Documents' },
    { key: 'success', label: 'Submitted' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  // Documents to display (use provided or fallback)
  const displayDocs = documents.length > 0
    ? documents
    : ['Payslips', 'Bank statements'];

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
                  Client taps the upload link
                </div>
              </div>

              <div className="journey-channel-badge">
                <span className="material-icons-outlined">{CHANNELS[channel].icon}</span>
                {CHANNELS[channel].label}
              </div>
            </div>
          )}

          {/* Step 2: Upload Documents */}
          {step === 'upload' && (
            <div className="journey-screen-container">
              <div className="journey-screen journey-screen-portal">
                {/* Elite Wealth header bar */}
                <div className="journey-portal-header">
                  <div className="journey-screen-brand">
                    <span className="brand-elite">ELITE</span>
                    <span className="brand-wealth">{' '}WEALTH</span>
                  </div>
                </div>

                {/* Upload content */}
                <div className="journey-portal-content">
                  <h2>Upload Your Documents</h2>
                  <p className="journey-portal-subtitle">
                    Your adviser has requested the following documents. Please upload each one below.
                  </p>

                  {/* Document upload slots */}
                  <div className="journey-upload-list">
                    {displayDocs.map((doc, i) => (
                      <div key={i} className="journey-upload-slot">
                        <div className="journey-upload-slot-info">
                          <span className="material-icons-outlined">description</span>
                          <span className="journey-upload-slot-name">{doc}</span>
                        </div>
                        <div className="journey-upload-slot-action">
                          <span className="material-icons-outlined">cloud_upload</span>
                          <span>Choose file</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="journey-upload-hint">
                    <span className="material-icons-outlined">info</span>
                    Accepted formats: PDF, JPG, PNG (max 10MB per file)
                  </div>

                  <button className="journey-portal-next">
                    Submit Documents
                    <span className="material-icons-outlined">send</span>
                  </button>
                </div>
              </div>

              <div className="journey-info-callout">
                <span className="material-icons-outlined">info</span>
                <div>
                  <strong>Common issues at this step:</strong>
                  <ul>
                    <li>File too large - max 10MB per document</li>
                    <li>Wrong format - only PDF, JPG, PNG accepted</li>
                    <li>Missing document - client can upload later</li>
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

                <h2 className="journey-screen-title">Documents Submitted</h2>
                <p className="journey-screen-subtitle">
                  Thank you, {client.firstName}. Your documents have been securely uploaded and your adviser has been notified.
                </p>

                {/* Submitted documents summary */}
                <div className="journey-login-details">
                  <div className="journey-login-details-title">Submitted Documents</div>
                  {displayDocs.map((doc, i) => (
                    <div key={i} className="journey-login-row">
                      <span>{doc}</span>
                      <span style={{ color: 'var(--success, #10b981)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-icons-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                        Uploaded
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="journey-info-callout journey-info-success">
                <span className="material-icons-outlined">check_circle</span>
                <div>
                  <strong>Documents received</strong>
                  <p>You&apos;ll be notified when documents are uploaded. Review them in the client&apos;s communication detail page.</p>
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

export default DocumentRequestPreview;
