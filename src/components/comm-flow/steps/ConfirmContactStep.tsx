'use client';

import { useState, useMemo, useEffect } from 'react';
import { StepProps, InfoRequestContactData } from '@/lib/comm-flow/types';
import { getClientDisplayName } from '@/types/communications';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// COMPONENT
// =============================================================================

export function ConfirmContactStep({
  data,
  client,
  onStepDataChange,
  hideStepHeader,
}: StepProps) {
  const isBulk = data.recipients.length > 1;
  const [currentIndex, setCurrentIndex] = useState(0);

  // The client we're currently viewing
  const currentClient = isBulk ? data.recipients[currentIndex] : client;

  // Get current step data or initialize
  const stepData: InfoRequestContactData = (data.stepData['confirm-contact'] as InfoRequestContactData) || {
    email: currentClient?.email || '',
    mobile: currentClient?.phone || '',
  };

  // Initialize step data on mount if not set
  useEffect(() => {
    if (!data.stepData['confirm-contact']) {
      onStepDataChange('confirm-contact', {
        email: currentClient?.email || '',
        mobile: currentClient?.phone || '',
      } as InfoRequestContactData);
    }
  }, [currentClient?.email, currentClient?.phone, data.stepData, onStepDataChange]);

  // Update displayed fields when stepping through recipients
  useEffect(() => {
    if (isBulk && currentClient) {
      onStepDataChange('confirm-contact', {
        email: currentClient.email || '',
        mobile: currentClient.phone || '',
      } as InfoRequestContactData);
    }
  }, [currentIndex, isBulk, currentClient, onStepDataChange]);

  // Update step data
  const updateData = (updates: Partial<InfoRequestContactData>) => {
    onStepDataChange('confirm-contact', {
      ...stepData,
      ...updates,
    } as InfoRequestContactData);
  };

  const hasContact = stepData.email.trim().length > 0 || stepData.mobile.trim().length > 0;

  return (
    <div className="confirm-contact-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Confirm Contact Details</h2>
          <p className="step-subtitle">Verify the contact details before sending</p>
        </div>
      )}

      {/* Client badge — single recipient only */}
      {!isBulk && currentClient && (
        <div className="config-client-badge">
          <span className="material-icons-outlined">person</span>
          <span>{getClientDisplayName(currentClient)}</span>
        </div>
      )}

      {/* Bulk recipient nav */}
      {isBulk && (
        <div className="preview-bulk-banner">
          <div className="preview-bulk-banner-content">
            <span className="material-icons-outlined" style={{ fontSize: '18px' }}>person</span>
            <span>
              Viewing <strong>{getClientDisplayName(currentClient!)}</strong> — {currentIndex + 1} of {data.recipients.length} recipients.
            </span>
          </div>
          <div className="preview-recipient-nav">
            <button
              type="button"
              className="preview-recipient-nav-btn"
              disabled={currentIndex <= 0}
              onClick={() => setCurrentIndex(i => i - 1)}
              title="Previous recipient"
            >
              <span className="material-icons-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
            </button>
            <button
              type="button"
              className="preview-recipient-nav-btn"
              disabled={currentIndex >= data.recipients.length - 1}
              onClick={() => setCurrentIndex(i => i + 1)}
              title="Next recipient"
            >
              <span className="material-icons-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* Email */}
      <div className="flow-form-group">
        <label className="flow-form-label">Email Address</label>
        <input
          type="email"
          value={stepData.email}
          onChange={(e) => updateData({ email: e.target.value })}
          className="flow-form-input"
          placeholder="client@email.com"
        />
      </div>

      {/* Mobile */}
      <div className="flow-form-group">
        <label className="flow-form-label">Mobile Number</label>
        <input
          type="tel"
          value={stepData.mobile}
          onChange={(e) => updateData({ mobile: e.target.value })}
          className="flow-form-input"
          placeholder="+27 82 123 4567"
        />
      </div>

      {/* Info notice */}
      <div className="flow-info-box">
        <span className="material-icons-outlined">info</span>
        <span>These details will be used to send the request and for client verification.</span>
      </div>

      {/* Validation warning */}
      {!hasContact && (
        <div className="flow-info-box warning">
          <span className="material-icons-outlined">warning</span>
          <span>Please provide at least one contact method.</span>
        </div>
      )}

    </div>
  );
}

// Register this step
registerStep('confirm-contact', ConfirmContactStep);

export default ConfirmContactStep;
