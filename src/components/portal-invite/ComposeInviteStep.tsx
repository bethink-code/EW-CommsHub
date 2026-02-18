'use client';

import { useState, useMemo } from 'react';
import { ModalFooter } from '../Modal';
import { PhonePreview } from './PhonePreview';
import { PortalActivationPreview } from './PortalActivationPreview';
import { Channel, Client, CHANNELS } from '@/types/communications';
import { SendingStatus } from './PortalInviteFlow';

// =============================================================================
// CHARACTER LIMITS
// =============================================================================

const CHAR_LIMITS: Record<Channel, number | null> = {
  sms: 918, // 6 segments max
  whatsapp: 4096,
  email: null, // No limit
  'in-app': 500,
};

// =============================================================================
// COMPONENT
// =============================================================================

export interface ComposeInviteStepProps {
  client: Client;
  channel: Channel;
  message: string;
  sendingStatus: SendingStatus;
  onChannelChange: (channel: Channel) => void;
  onMessageChange: (message: string) => void;
  onCancel: () => void;
  onBack: () => void;
  onSend: () => void;
}

export function ComposeInviteStep({
  client,
  channel,
  message,
  sendingStatus,
  onChannelChange,
  onMessageChange,
  onCancel,
  onBack,
  onSend,
}: ComposeInviteStepProps) {
  // Track if activation preview is open
  const [showActivationPreview, setShowActivationPreview] = useState(false);

  const isSending = sendingStatus.status === 'sending';
  const isSent = sendingStatus.status === 'sent';

  // Character count info
  const charCount = message.length;
  const charLimit = CHAR_LIMITS[channel];

  const charInfo = useMemo(() => {
    if (!charLimit) {
      return { text: `${charCount} characters`, status: 'ok' as const };
    }

    if (channel === 'sms') {
      const segments = Math.ceil(charCount / 160) || 1;
      if (charCount > 918) {
        return { text: `${charCount} chars · ${segments} segments (max 6)`, status: 'error' as const };
      }
      if (charCount > 480) {
        return { text: `${charCount} chars · ${segments} segments`, status: 'warning' as const };
      }
      return { text: `${charCount} characters`, status: 'ok' as const };
    }

    if (charCount > charLimit) {
      return { text: `${charCount} / ${charLimit} (over limit)`, status: 'error' as const };
    }

    return { text: `${charCount} characters`, status: 'ok' as const };
  }, [charCount, charLimit, channel]);

  // Validation
  const hasValidationError = useMemo(() => {
    if (message.trim().length === 0) return true;
    if (charLimit && charCount > charLimit) return true;
    return false;
  }, [message, charCount, charLimit]);

  // Available channels (no in-app for portal invite)
  const availableChannels: Channel[] = ['sms', 'whatsapp', 'email'];

  // Format time for status
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render sending/sent status view
  if (isSending || isSent) {
    return (
      <div className="send-status">
        {/* Status card */}
        <div className={`status-card ${sendingStatus.sentAt ? 'success' : 'pending'}`}>
          <div className="status-icon">
            {sendingStatus.sentAt ? (
              <span className="material-icons-outlined">check_circle</span>
            ) : (
              <div className="status-spinner"></div>
            )}
          </div>
          <div className="status-content">
            <div className="status-title">
              {sendingStatus.sentAt ? 'Invitation Sent' : 'Sending invitation...'}
            </div>
            <div className="status-detail">
              <span className="material-icons-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>
                {CHANNELS[channel].icon}
              </span>
              {CHANNELS[channel].label} to {client.firstName} {client.lastName}
            </div>
            {sendingStatus.sentAt && (
              <div className="status-time">{formatTime(sendingStatus.sentAt)}</div>
            )}
          </div>
        </div>

        {/* Delivery status */}
        {sendingStatus.sentAt && (
          <div className={`status-card ${sendingStatus.deliveredAt ? 'success' : 'pending'}`}>
            <div className="status-icon">
              {sendingStatus.deliveredAt ? (
                <span className="material-icons-outlined">check_circle</span>
              ) : (
                <div className="status-spinner"></div>
              )}
            </div>
            <div className="status-content">
              <div className="status-title">
                {sendingStatus.deliveredAt ? 'Delivered' : 'Awaiting delivery...'}
              </div>
              {sendingStatus.deliveredAt && (
                <div className="status-time">{formatTime(sendingStatus.deliveredAt)}</div>
              )}
            </div>
          </div>
        )}

        {/* Next steps info */}
        {sendingStatus.deliveredAt && (
          <div className="invite-next-steps">
            <div className="invite-next-steps-title">
              <span className="material-icons-outlined">info</span>
              What happens next?
            </div>
            <ol className="invite-next-steps-list">
              <li>{client.firstName} receives the invitation with activation link</li>
              <li>They verify their identity via OTP</li>
              <li>They create their password</li>
              <li>Portal is activated - you'll be notified</li>
            </ol>
          </div>
        )}

        {/* Info message */}
        <div className="send-status-info">
          <span className="material-icons-outlined">info</span>
          <span>
            You can close this window. We'll track activation progress in the Communications tab.
          </span>
        </div>

        {/* Footer */}
        <div className="step-footer send-status-footer">
          <div className="modal-footer-left"></div>
          <div className="modal-footer-right">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onCancel}
              disabled={isSending}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render compose view
  return (
    <div className="compose-step">
      {/* Two-column layout */}
      <div className="compose-layout">
        {/* Left column: Channel tabs + Message editor */}
        <div className="compose-editor">
          {/* Channel question */}
          <div className="compose-question">How would you like to send this?</div>

          {/* Channel tabs */}
          <div className="compose-channel-tabs">
            {availableChannels.map((ch) => (
              <button
                key={ch}
                type="button"
                className={`channel-tab-pill ${channel === ch ? 'selected' : ''}`}
                onClick={() => onChannelChange(ch)}
              >
                <span className="material-icons-outlined">{CHANNELS[ch].icon}</span>
                {CHANNELS[ch].label}
              </button>
            ))}
          </div>

          {/* Message label */}
          <div className="compose-message-label">Your message</div>

          {/* Message textarea */}
          <div className="compose-textarea-wrapper">
            <textarea
              className={`compose-textarea ${charInfo.status === 'error' ? 'error' : ''}`}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder={`Type your invitation message...`}
              rows={14}
            />
            <div className={`compose-char-count ${charInfo.status}`}>
              {charInfo.text}
            </div>
          </div>
        </div>

        {/* Right column: Phone preview */}
        <div className="compose-preview">
          <PhonePreview
            channel={channel}
            message={message}
            client={client}
          />

          {/* Activation preview button */}
          <button
            type="button"
            className="journey-preview-trigger"
            onClick={() => setShowActivationPreview(true)}
          >
            <span className="material-icons-outlined">visibility</span>
            Preview Client Experience
          </button>
        </div>
      </div>

      {/* Portal Activation Preview Overlay */}
      {showActivationPreview && (
        <PortalActivationPreview
          client={client}
          channel={channel}
          message={message}
          onClose={() => setShowActivationPreview(false)}
        />
      )}

      {/* Footer */}
      <div className="modal-footer">
        <ModalFooter
          onCancel={onCancel}
          onPrimary={onSend}
          primaryLabel="Send Invitation"
          primaryIcon="send"
          primaryDisabled={hasValidationError}
          showBack
          onBack={onBack}
        />
      </div>
    </div>
  );
}

export default ComposeInviteStep;
