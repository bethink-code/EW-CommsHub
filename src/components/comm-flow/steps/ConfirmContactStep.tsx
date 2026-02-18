'use client';

import { useEffect } from 'react';
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
  onNext,
  onBack,
  onCancel,
  isFirstStep,
}: StepProps) {
  // Get current step data or initialize
  const stepData: InfoRequestContactData = (data.stepData['confirm-contact'] as InfoRequestContactData) || {
    email: client?.email || '',
    mobile: client?.phone || '',
  };

  // Initialize step data on mount if not set
  useEffect(() => {
    if (!data.stepData['confirm-contact']) {
      onStepDataChange('confirm-contact', {
        email: client?.email || '',
        mobile: client?.phone || '',
      } as InfoRequestContactData);
    }
  }, [client?.email, client?.phone, data.stepData, onStepDataChange]);

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
      <div className="step-header">
        <h2 className="step-title">Confirm Contact Details</h2>
        <p className="step-subtitle">Verify the contact details before sending</p>
      </div>

      {/* Client badge */}
      {client && (
        <div className="config-client-badge">
          <span className="material-icons-outlined">person</span>
          <span>{getClientDisplayName(client)}</span>
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
