'use client';

import { useMemo } from 'react';
import { ModalFooter } from '../Modal';
import { Client, CHANNELS } from '@/types/communications';
import { DocumentRequestData, SendingStatus } from './DocumentRequestFlow';
import { STANDARD_DOCUMENTS } from './SelectDocumentsStep';

// =============================================================================
// COMPONENT
// =============================================================================

export interface PreviewSendStepProps {
  client: Client;
  data: DocumentRequestData;
  sendingStatus: SendingStatus;
  onBack: () => void;
  onSend: () => void;
  onDone: () => void;
}

export function PreviewSendStep({
  client,
  data,
  sendingStatus,
  onBack,
  onSend,
  onDone,
}: PreviewSendStepProps) {
  const isSending = sendingStatus.status === 'sending';
  const isSent = sendingStatus.status === 'sent';

  // Get document labels
  const documentLabels = useMemo(() => {
    const standardLabels = data.documents.map(docId => {
      const doc = STANDARD_DOCUMENTS.find(d => d.id === docId);
      return doc?.label || docId;
    });
    return [...standardLabels, ...data.customDocuments];
  }, [data.documents, data.customDocuments]);

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
              {sendingStatus.sentAt ? 'Request Sent' : 'Sending request...'}
            </div>
            <div className="status-detail">
              <span className="material-icons-outlined" style={{ fontSize: '14px', marginRight: '4px' }}>
                {CHANNELS[data.channel].icon}
              </span>
              {CHANNELS[data.channel].label} to {client.firstName} {client.lastName}
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
              <li>{client.firstName} receives the document request</li>
              <li>They click the link to access the secure upload page</li>
              <li>They upload each requested document</li>
              <li>You'll be notified when documents are uploaded</li>
            </ol>
          </div>
        )}

        {/* Info message */}
        <div className="send-status-info">
          <span className="material-icons-outlined">info</span>
          <span>
            You can close this window. We'll track upload progress in the Message Centre.
          </span>
        </div>

        {/* Footer */}
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

  // Render preview view
  return (
    <>
      <div className="confirm-container">
        {/* Client Card */}
        <div className="confirm-card">
          <div className="confirm-card-header">
            <div className="confirm-client-avatar">
              <span className="material-icons-outlined">person</span>
            </div>
            <div className="confirm-client-info">
              <div className="confirm-client-name">
                {client.firstName} {client.lastName}
              </div>
              <div className="confirm-client-contacts">
                {client.email && <span>{client.email}</span>}
                {client.email && client.phone && <span className="confirm-divider">•</span>}
                {client.phone && <span>{client.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Channel */}
        <div className="confirm-section-group">
          <div className="confirm-section-label">Delivery Channel</div>
          <div className="confirm-channel-pills">
            <div className="confirm-channel-pill">
              <span className="material-icons-outlined">{CHANNELS[data.channel].icon}</span>
              <span className="confirm-channel-name">{CHANNELS[data.channel].label}</span>
              <span className="confirm-channel-to">
                {data.channel === 'email' ? client.email : client.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Documents to Request */}
        <div className="confirm-section-group">
          <div className="confirm-section-label">Documents Requested ({documentLabels.length})</div>
          <div className="confirm-request-list">
            {documentLabels.map((doc, index) => (
              <div key={index} className="confirm-request-item">
                <span className="material-icons-outlined confirm-check">description</span>
                <span className="confirm-request-text">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes (if any) */}
        {data.notes && (
          <div className="confirm-section-group">
            <div className="confirm-section-label">Notes for Client</div>
            <div className="confirm-notes">
              {data.notes}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="step-footer">
        <ModalFooter
          onCancel={onDone}
          onPrimary={onSend}
          cancelLabel="Cancel"
          primaryLabel="Send Request"
          primaryIcon="send"
          showBack
          onBack={onBack}
        />
      </div>
    </>
  );
}

export default PreviewSendStep;
