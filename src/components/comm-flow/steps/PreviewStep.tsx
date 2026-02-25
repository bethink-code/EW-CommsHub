'use client';

import { useState, useMemo } from 'react';
import { StepProps } from '@/lib/comm-flow/types';
import { COMM_TYPE_CONFIGS, CHANNELS, getClientDisplayName } from '@/types/communications';
import { registerStep } from '@/lib/comm-flow/stepRegistry';
import { VariableEditor } from '@/components/comm-flow/VariableEditor';
import { PortalActivationPreview } from '@/components/portal-invite/PortalActivationPreview';
import { ClientJourneyPreview } from '@/components/info-request/ClientJourneyPreview';
import { PasswordResetPreview } from '@/components/password-reset/PasswordResetPreview';
import { DocumentRequestPreview } from '@/components/document-request/DocumentRequestPreview';

// =============================================================================
// COMPONENT
// =============================================================================

export function PreviewStep({
  data,
  client,
  context,
  onCancel,
  sendingStatus,
  hideStepHeader,
}: StepProps) {
  const config = data.commType ? COMM_TYPE_CONFIGS[data.commType] : null;
  const isSending = sendingStatus?.status === 'sending';
  const isSent = sendingStatus?.status === 'sent';
  const [showClientPreview, setShowClientPreview] = useState(false);

  // Bulk detection
  const isBulk = data.recipients.length > 1;
  const [previewAsClient, setPreviewAsClient] = useState<import('@/types/communications').Client | null>(null);

  // In bulk mode, resolve from first recipient by default; previewAsClient overrides
  const resolvedClient = isBulk
    ? (previewAsClient || data.recipients[0])
    : client;

  // Index of currently previewed client (for prev/next nav)
  const currentPreviewIndex = useMemo(() => {
    if (!previewAsClient) return 0; // Default to first recipient
    const idx = data.recipients.findIndex(r => r.id === previewAsClient.id);
    return idx >= 0 ? idx : 0;
  }, [previewAsClient, data.recipients]);

  // Variable resolution — always resolve from the active client
  const otherCount = data.recipients.length - 1;
  const variables = useMemo(() => {
    const firstName = resolvedClient?.firstName || 'Client';
    return {
      FirstName: isBulk
        ? `${firstName} (and ${otherCount} other contact${otherCount !== 1 ? 's' : ''})`
        : firstName,
      LastName: resolvedClient?.lastName || '',
      Link: 'secure.elitewealth.co.za/portal/abc123',
      AdviserName: 'Rassie du Preez',
      DocumentList: '• ID Document\n• Proof of Address\n• Bank Statement',
      Message: '...',
    };
  }, [resolvedClient?.firstName, resolvedClient?.lastName, isBulk, otherCount]);

  // Commtypes that have a client journey preview
  const CLIENT_PREVIEW_TYPES = ['portal-invite', 'info-request', 'password-reset', 'document-request'];
  const hasClientPreview = data.commType ? CLIENT_PREVIEW_TYPES.includes(data.commType) : false;

  // Recipients display — always show resolved name
  const recipientNames = useMemo(() => {
    if (!isBulk) {
      return getClientDisplayName(data.recipients[0]);
    }
    return getClientDisplayName(resolvedClient || data.recipients[0]);
  }, [data.recipients, isBulk, resolvedClient]);

  // Type display — "Portal Invite via SMS, Email"
  const typeDisplay = useMemo(() => {
    const typeName = config?.name || 'Message';
    const channelNames = data.channels.map(ch => CHANNELS[ch].label).join(', ');
    return `${typeName} via ${channelNames}`;
  }, [config, data.channels]);

  // Dynamic send info bar
  const sendInfoText = useMemo(() => {
    const recipientCount = data.recipients.length;
    const channelCount = data.channels.length;
    const totalMessages = recipientCount * channelCount;

    if (channelCount === 1) {
      const channelLabel = CHANNELS[data.channels[0]].label;
      return `${totalMessages} ${channelLabel}${totalMessages !== 1 ? 's' : ''} will be sent immediately`;
    }
    const channelNames = data.channels.map(ch => CHANNELS[ch].label).join(' + ');
    return `${totalMessages} messages will be sent immediately (${recipientCount} recipient${recipientCount !== 1 ? 's' : ''} × ${channelNames})`;
  }, [data.recipients.length, data.channels]);

  // Active channel message for preview
  const previewMessage = data.channelDrafts[data.channels[0]] || data.message;

  // Render sending/sent state
  if (isSending || isSent) {
    return (
      <div className="preview-step">
        <div className="send-status-container">
          <div className="send-status-card">
            {isSending ? (
              <>
                <div className="send-status-icon sending">
                  <span className="material-icons spin">sync</span>
                </div>
                <h3 className="send-status-title">Sending...</h3>
                <p className="send-status-message">
                  Please wait while we send your {config?.name || 'communication'}.
                </p>
              </>
            ) : (
              <>
                <div className="send-status-icon success">
                  <span className="material-icons-outlined">check_circle</span>
                </div>
                <h3 className="send-status-title">Messages Sent</h3>
                <p className="send-status-message">
                  Your {config?.name || 'communication'} has been sent to{' '}
                  {data.recipients.length === 1
                    ? getClientDisplayName(data.recipients[0])
                    : `${data.recipients.length} clients`
                  }.
                </p>

                {sendingStatus?.sentAt && (
                  <p className="send-status-time">
                    Sent at {sendingStatus.sentAt.toLocaleTimeString()}
                  </p>
                )}

                {sendingStatus?.deliveredAt && (
                  <div className="send-status-delivery">
                    <span className="material-icons-outlined">done_all</span>
                    <span>Delivered</span>
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  onClick={onCancel}
                  style={{ marginTop: '24px' }}
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Regular preview state
  return (
    <div className="preview-step">
      {!hideStepHeader && (
        <div className="step-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <h2 className="step-title">Review & Send</h2>
            <p className="step-subtitle">Confirm the details before sending</p>
          </div>
          {hasClientPreview && client && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowClientPreview(true)}
              style={{ flexShrink: 0, gap: '6px', whiteSpace: 'nowrap' }}
            >
              <span className="material-icons-outlined">visibility</span>
              Preview as Client
            </button>
          )}
        </div>
      )}

      {/* "Preview as Client" button for modal mode (hideStepHeader = true) */}
      {hideStepHeader && hasClientPreview && client && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowClientPreview(true)}
            style={{ gap: '6px' }}
          >
            <span className="material-icons-outlined">visibility</span>
            Preview as Client
          </button>
        </div>
      )}

      {/* Summary card */}
      <div className="preview-card">
        {/* To row */}
        <div className="preview-row">
          <span className="preview-label">To</span>
          <span className="preview-detail">
            <span className="preview-client-name">{recipientNames}</span>
            {isBulk && (
              <span className="preview-recipient-badge">
                and {data.recipients.length - 1} other contact{data.recipients.length - 1 !== 1 ? 's' : ''}
              </span>
            )}
          </span>
        </div>

        {/* Type row — "Portal Invite via SMS, Email" */}
        <div className="preview-row">
          <span className="preview-label">Type</span>
          <span className="preview-detail">{typeDisplay}</span>
        </div>

        {/* Subject row (email only) */}
        {data.channels.includes('email') && data.subject && (
          <div className="preview-row">
            <span className="preview-label">Subject</span>
            <span className="preview-detail">{data.subject}</span>
          </div>
        )}

        {/* Type-specific rows */}
        {Object.entries(data.stepData).map(([stepId, stepData]) => (
          <PreviewStepData key={stepId} stepId={stepId} data={stepData} />
        ))}
      </div>

      {/* Send info bar */}
      <div className="preview-notice">
        <span className="material-icons-outlined">schedule</span>
        <span>{sendInfoText}</span>
      </div>

      {/* Client Journey Preview Overlays */}
      {showClientPreview && client && data.commType === 'portal-invite' && (
        <PortalActivationPreview
          client={client}
          channel={data.channels[0] || 'email'}
          message={previewMessage}
          onClose={() => setShowClientPreview(false)}
        />
      )}
      {showClientPreview && client && data.commType === 'info-request' && (
        <ClientJourneyPreview
          client={client}
          channel={data.channels[0] || 'email'}
          message={previewMessage}
          onClose={() => setShowClientPreview(false)}
        />
      )}
      {showClientPreview && client && data.commType === 'password-reset' && (
        <PasswordResetPreview
          client={client}
          channel={data.channels[0] || 'email'}
          message={previewMessage}
          onClose={() => setShowClientPreview(false)}
        />
      )}
      {showClientPreview && client && data.commType === 'document-request' && (
        <DocumentRequestPreview
          client={client}
          channel={data.channels[0] || 'email'}
          message={previewMessage}
          documents={
            (data.stepData['select-documents'] as { documents?: string[]; customDocuments?: string[] })
              ? [
                  ...((data.stepData['select-documents'] as { documents?: string[] })?.documents || []),
                  ...((data.stepData['select-documents'] as { customDocuments?: string[] })?.customDocuments || []),
                ]
              : []
          }
          onClose={() => setShowClientPreview(false)}
        />
      )}
    </div>
  );
}

// =============================================================================
// HELPER: Render type-specific step data as rows
// =============================================================================

function PreviewStepData({ stepId, data }: { stepId: string; data: unknown }) {
  if (!data || typeof data !== 'object') return null;

  switch (stepId) {
    case 'configure-access': {
      const accessData = data as { username?: string };
      return (
        <>
          <div className="preview-row">
            <span className="preview-label">Access</span>
            <span className="preview-detail">Web Portal + Mobile App</span>
          </div>
          {accessData.username && (
            <div className="preview-row">
              <span className="preview-label">Username</span>
              <span className="preview-detail preview-mono">{accessData.username}</span>
            </div>
          )}
        </>
      );
    }

    case 'select-documents': {
      const docData = data as {
        documents?: string[];
        customDocuments?: string[];
        notes?: string;
      };
      const allDocs = [...(docData.documents || []), ...(docData.customDocuments || [])];
      return (
        <>
          {allDocs.length > 0 && (
            <div className="preview-row">
              <span className="preview-label">Documents</span>
              <span className="preview-detail">
                {allDocs.map((doc, i) => (
                  <span key={i} className="preview-tag">{doc}</span>
                ))}
              </span>
            </div>
          )}
          {docData.notes && (
            <div className="preview-row">
              <span className="preview-label">Notes</span>
              <span className="preview-detail">{docData.notes}</span>
            </div>
          )}
        </>
      );
    }

    case 'configure-request': {
      const reqData = data as {
        selectedSections?: string[];
        selectedDocuments?: string[];
        notes?: string;
      };
      return (
        <>
          {reqData.selectedSections && reqData.selectedSections.length > 0 && (
            <div className="preview-row">
              <span className="preview-label">Sections</span>
              <span className="preview-detail">
                {reqData.selectedSections.length} sections selected
              </span>
            </div>
          )}
          {reqData.selectedDocuments && reqData.selectedDocuments.length > 0 && (
            <div className="preview-row">
              <span className="preview-label">Documents</span>
              <span className="preview-detail">
                {reqData.selectedDocuments.length} documents requested
              </span>
            </div>
          )}
        </>
      );
    }

    default:
      return null;
  }
}

// Register this step
registerStep('preview', PreviewStep);

export default PreviewStep;
