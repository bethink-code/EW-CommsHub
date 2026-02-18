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
  onBack,
  onCancel,
  sendingStatus,
  onSend,
  isFirstStep,
}: StepProps) {
  const config = data.commType ? COMM_TYPE_CONFIGS[data.commType] : null;
  const isSending = sendingStatus?.status === 'sending';
  const isSent = sendingStatus?.status === 'sent';
  const [showClientPreview, setShowClientPreview] = useState(false);

  // Variable resolution map for inline preview tokens
  const variables = useMemo(() => ({
    FirstName: client?.firstName || 'Client',
    LastName: client?.lastName || '',
    Link: 'secure.elitewealth.co.za/portal/abc123',
    AdviserName: 'Rassie du Preez',
    DocumentList: '• ID Document\n• Proof of Address\n• Bank Statement',
    Message: '...',
  }), [client?.firstName, client?.lastName]);

  // Commtypes that have a client journey preview
  const CLIENT_PREVIEW_TYPES = ['portal-invite', 'info-request', 'password-reset', 'document-request'];
  const hasClientPreview = data.commType ? CLIENT_PREVIEW_TYPES.includes(data.commType) : false;

  // Render sending state
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
                <h3 className="send-status-title">Sent Successfully!</h3>
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

  // Build channel pills
  const channelPills = data.channels.map(ch => ({
    key: ch,
    label: CHANNELS[ch].label,
    icon: CHANNELS[ch].icon,
  }));

  // Regular preview state
  return (
    <div className="preview-step">
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

      {/* Summary card */}
      <div className="preview-card">
        {/* Type row */}
        <div className="preview-row">
          <span className="preview-label">
            <span className="material-icons-outlined preview-label-icon">{config?.icon || 'mail'}</span>
            Type
          </span>
          <span className="preview-detail">{config?.name || '-'}</span>
        </div>

        {/* Channels row */}
        <div className="preview-row">
          <span className="preview-label">
            <span className="material-icons-outlined preview-label-icon">send</span>
            Channels
          </span>
          <span className="preview-detail">
            <span className="preview-channel-pills">
              {channelPills.map(ch => (
                <span key={ch.key} className="preview-channel-pill">
                  <span className="material-icons-outlined">{ch.icon}</span>
                  {ch.label}
                </span>
              ))}
            </span>
          </span>
        </div>

        {/* Subject row (email only) */}
        {data.channels.includes('email') && data.subject && (
          <div className="preview-row">
            <span className="preview-label">
              <span className="material-icons-outlined preview-label-icon">subject</span>
              Subject
            </span>
            <span className="preview-detail">{data.subject}</span>
          </div>
        )}

        {/* Type-specific rows */}
        {Object.entries(data.stepData).map(([stepId, stepData]) => (
          <PreviewStepData key={stepId} stepId={stepId} data={stepData} />
        ))}
      </div>

      {/* Message preview */}
      <div className="preview-message-section">
        <div className="preview-message-header">
          <span className="material-icons-outlined">article</span>
          Message
        </div>
        <VariableEditor
          value={data.message}
          variables={variables}
          readOnly
          className="preview-message-body"
        />
      </div>

      {/* Send notice */}
      <div className="preview-notice">
        <span className="material-icons-outlined">schedule</span>
        <span>
          {data.recipients.length} communication{data.recipients.length !== 1 ? 's' : ''}{' '}
          will be created and sent immediately.
        </span>
      </div>

      {/* Client Journey Preview Overlay */}
      {showClientPreview && client && data.commType === 'portal-invite' && (
        <PortalActivationPreview
          client={client}
          channel={data.channels[0] || 'email'}
          message={data.message}
          onClose={() => setShowClientPreview(false)}
        />
      )}
      {showClientPreview && client && data.commType === 'info-request' && (
        <ClientJourneyPreview
          client={client}
          channel={data.channels[0] || 'email'}
          message={data.message}
          onClose={() => setShowClientPreview(false)}
        />
      )}
      {showClientPreview && client && data.commType === 'password-reset' && (
        <PasswordResetPreview
          client={client}
          channel={data.channels[0] || 'email'}
          message={data.message}
          onClose={() => setShowClientPreview(false)}
        />
      )}
      {showClientPreview && client && data.commType === 'document-request' && (
        <DocumentRequestPreview
          client={client}
          channel={data.channels[0] || 'email'}
          message={data.message}
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
            <span className="preview-label">
              <span className="material-icons-outlined preview-label-icon">devices</span>
              Access
            </span>
            <span className="preview-detail">Web Portal + Mobile App</span>
          </div>
          {accessData.username && (
            <div className="preview-row">
              <span className="preview-label">
                <span className="material-icons-outlined preview-label-icon">badge</span>
                Username
              </span>
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
              <span className="preview-label">
                <span className="material-icons-outlined preview-label-icon">description</span>
                Documents
              </span>
              <span className="preview-detail">
                {allDocs.map((doc, i) => (
                  <span key={i} className="preview-tag">{doc}</span>
                ))}
              </span>
            </div>
          )}
          {docData.notes && (
            <div className="preview-row">
              <span className="preview-label">
                <span className="material-icons-outlined preview-label-icon">sticky_note_2</span>
                Notes
              </span>
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
              <span className="preview-label">
                <span className="material-icons-outlined preview-label-icon">view_list</span>
                Sections
              </span>
              <span className="preview-detail">
                {reqData.selectedSections.length} sections selected
              </span>
            </div>
          )}
          {reqData.selectedDocuments && reqData.selectedDocuments.length > 0 && (
            <div className="preview-row">
              <span className="preview-label">
                <span className="material-icons-outlined preview-label-icon">description</span>
                Documents
              </span>
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
