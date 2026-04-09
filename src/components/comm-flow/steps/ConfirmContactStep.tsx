'use client';

import { useState, useCallback, useEffect } from 'react';
import { StepProps, InfoRequestContactData } from '@/lib/comm-flow/types';
import { getClientDisplayName, Channel, COMM_TYPE_CONFIGS } from '@/types/communications';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// CHANNEL LABELS
// =============================================================================

const CHANNEL_LABELS: Record<Channel, string> = {
  email: 'Email',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  'in-app': 'In-App',
};

// =============================================================================
// COMPONENT
// =============================================================================

export function ConfirmContactStep({
  data,
  context,
  client,
  onDataChange,
  onStepDataChange,
  hideStepHeader,
}: StepProps) {
  const isBulk = data.recipients.length > 1;
  const [currentIndex, setCurrentIndex] = useState(0);

  // The client we're currently viewing
  const currentClient = isBulk ? data.recipients[currentIndex] : client;

  // Available channels for this comm type
  const availableChannels = data.commType
    ? (COMM_TYPE_CONFIGS[data.commType]?.channels || ['email'])
    : ['email'] as Channel[];

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

  // Channel toggle
  const handleChannelToggle = useCallback((channel: Channel) => {
    const current = data.channels;
    if (current.includes(channel)) {
      if (current.length <= 1) return; // must keep at least one
      onDataChange({ channels: current.filter(c => c !== channel) });
    } else {
      onDataChange({ channels: [...current, channel] });
    }
  }, [data.channels, onDataChange]);

  const hasContact = stepData.email.trim().length > 0 || stepData.mobile.trim().length > 0;

  return (
    <div className="confirm-contact-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Confirm Contact Details</h2>
          <p className="step-subtitle">Verify the contact details before sending</p>
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

      {/* Send via — channel checkboxes in white card */}
      <div className="config-card">
        <div className="flow-form-group">
          <label className="flow-form-label">Send via:</label>
          <div className="channel-checkboxes">
            {availableChannels.map((channel) => (
              <label key={channel} className="channel-checkbox">
                <input
                  type="checkbox"
                  checked={data.channels.includes(channel)}
                  onChange={() => handleChannelToggle(channel)}
                />
                <span className="channel-checkbox-label">{CHANNEL_LABELS[channel] || channel}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="flow-form-group">
        <label className="flow-form-label">Email address</label>
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
        <label className="flow-form-label">Mobile number</label>
        <input
          type="tel"
          value={stepData.mobile}
          onChange={(e) => updateData({ mobile: e.target.value })}
          className="flow-form-input"
          placeholder="+27 82 123 4567"
        />
        {data.channels.includes('whatsapp') && (
          <p className="flow-form-helper">
            Demo: separate multiple numbers with commas to send the WhatsApp to several recipients at once.
          </p>
        )}
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
