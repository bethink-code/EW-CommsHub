'use client';

import { ModalFooter } from '../Modal';
import {
  Client,
  Channel,
  CHANNELS,
  INFO_SECTIONS,
  DOCUMENT_TYPES,
  InfoSection,
  DocumentType,
} from '@/types/communications';
import { InfoRequestData, SendingStatus } from './InfoRequestFlow';

// =============================================================================
// HELPERS
// =============================================================================

const PHONE_CHANNELS: Channel[] = ['sms', 'whatsapp'];

// =============================================================================
// COMPONENT
// =============================================================================

export interface ConfirmSendStepProps {
  client: Client;
  data: InfoRequestData;
  sendingStatus: SendingStatus;
  onBack: () => void;
  onSend: () => void;
  onDone: () => void;
}

export function ConfirmSendStep({
  client,
  data,
  sendingStatus,
  onBack,
  onSend,
  onDone,
}: ConfirmSendStepProps) {
  const isSending = sendingStatus.status === 'sending';
  const isSent = sendingStatus.status === 'sent';

  // Format time
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get contact info for a channel
  const getChannelContact = (ch: Channel): string => {
    if (PHONE_CHANNELS.includes(ch)) return data.phone;
    if (ch === 'email') return data.email;
    return 'Portal';
  };

  // Render confirmation view (before sending)
  if (sendingStatus.status === 'idle') {
    // Get required and optional sections
    const requiredSections = data.sections.filter((s: InfoSection) => INFO_SECTIONS[s].required);
    const optionalSections = data.sections.filter((s: InfoSection) => !INFO_SECTIONS[s].required);

    return (
      <div className="confirm-container">
        {/* Client Card */}
        <div className="confirm-card">
          <div className="confirm-card-header">
            <div className="confirm-client-avatar">
              <span className="material-icons-outlined">person</span>
            </div>
            <div className="confirm-client-info">
              <div className="confirm-client-name">{client.firstName} {client.lastName}</div>
              <div className="confirm-client-contacts">
                {data.email && <span>{data.email}</span>}
                {data.email && data.phone && <span className="confirm-divider">•</span>}
                {data.phone && <span>{data.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Channels */}
        <div className="confirm-section-group">
          <div className="confirm-section-label">Sending via</div>
          <div className="confirm-channel-pills">
            {data.channels.map((ch) => (
              <div key={ch} className="confirm-channel-pill">
                <span className="material-icons-outlined">{CHANNELS[ch].icon}</span>
                <span className="confirm-channel-name">{CHANNELS[ch].label}</span>
                <span className="confirm-channel-to">{getChannelContact(ch)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Information Requested */}
        <div className="confirm-section-group">
          <div className="confirm-section-label">Information requested</div>
          <div className="confirm-request-list">
            {requiredSections.map((section: InfoSection) => (
              <div key={section} className="confirm-request-item">
                <span className="material-icons-outlined confirm-check">check</span>
                <span className="confirm-request-text">{INFO_SECTIONS[section].label}</span>
              </div>
            ))}
            {optionalSections.map((section: InfoSection) => (
              <div key={section} className="confirm-request-item">
                <span className="material-icons-outlined confirm-check">check</span>
                <span className="confirm-request-text">{INFO_SECTIONS[section].label}</span>
              </div>
            ))}
            {data.documents.length > 0 && (
              <div className="confirm-request-item confirm-documents">
                <span className="material-icons-outlined confirm-check">description</span>
                <span className="confirm-request-text">
                  {data.documents.map((doc: DocumentType) => DOCUMENT_TYPES[doc].label).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="step-footer">
          <ModalFooter
            onCancel={onDone}
            onPrimary={onSend}
            primaryLabel={data.channels.length > 1 ? `Send via ${data.channels.length} Channels` : 'Send Now'}
            primaryIcon="send"
            showBack
            onBack={onBack}
          />
        </div>
      </div>
    );
  }

  // Render sending/sent status view
  return (
    <div className="send-status">
      {/* Status cards for each channel */}
      {data.channels.map((ch, index) => (
        <div
          key={ch}
          className={`status-card ${sendingStatus.sentAt ? 'success' : isSending ? 'pending' : ''}`}
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="status-icon">
            {sendingStatus.sentAt ? (
              <span className="material-icons-outlined">check_circle</span>
            ) : isSending ? (
              <div className="status-spinner"></div>
            ) : (
              <span className="material-icons-outlined">schedule</span>
            )}
          </div>
          <div className="status-content">
            <div className="status-title">
              {sendingStatus.sentAt ? 'Sent' : isSending ? 'Sending...' : 'Pending'}
            </div>
            <div className="status-detail">
              <span className="material-icons-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>
                {CHANNELS[ch].icon}
              </span>
              {CHANNELS[ch].label} to {getChannelContact(ch)}
            </div>
            {sendingStatus.sentAt && (
              <div className="status-time">{formatTime(sendingStatus.sentAt)}</div>
            )}
          </div>
        </div>
      ))}

      {/* Delivery status (only show after all sent) */}
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
              {sendingStatus.deliveredAt ? 'Delivered' : 'Awaiting delivery confirmation...'}
            </div>
            {sendingStatus.deliveredAt && (
              <div className="status-time">{formatTime(sendingStatus.deliveredAt)}</div>
            )}
          </div>
        </div>
      )}

      {/* Info message */}
      <div className="send-status-info">
        <span className="material-icons-outlined">info</span>
        <span>
          You can close this window. We&apos;ll track delivery status in the Communications tab.
        </span>
      </div>

      {/* Footer - only Done button */}
      <div className="step-footer send-status-footer">
        <div className="modal-footer-left"></div>
        <div className="modal-footer-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onDone}
            disabled={isSending}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSendStep;
