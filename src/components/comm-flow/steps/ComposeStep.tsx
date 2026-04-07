'use client';

import { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { StepProps } from '@/lib/comm-flow/types';
import { CHANNELS, COMM_TYPE_CONFIGS, Channel } from '@/types/communications';
import { registerStep } from '@/lib/comm-flow/stepRegistry';
import { VariableEditor, VariableEditorHandle } from '@/components/comm-flow/VariableEditor';
import { buildDocumentTitle } from '@/app/comms-hub/demo-flows/notification-scenarios';
import { META_TEMPLATE_MAP } from '@/lib/whatsapp';

// =============================================================================
// CHARACTER LIMITS
// =============================================================================

const CHAR_LIMITS: Record<Channel, number | null> = {
  sms: 918,
  whatsapp: 4096,
  email: null,
  'in-app': 500,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ComposeStep({
  data,
  client,
  onDataChange,
  hideStepHeader,
}: StepProps) {
  const editorRef = useRef<VariableEditorHandle>(null);

  // Active channel — use data.activeComposeChannel or first channel
  const activeChannel = data.activeComposeChannel && data.channels.includes(data.activeComposeChannel)
    ? data.activeComposeChannel
    : data.channels[0];
  const hasMultipleChannels = data.channels.length > 1;

  // Current draft for active channel
  const currentDraft = data.channelDrafts[activeChannel] || '';

  // Switch channel tab
  const switchChannel = useCallback((ch: Channel) => {
    onDataChange({ activeComposeChannel: ch });
  }, [onDataChange]);

  // Update draft for active channel
  const updateDraft = useCallback((message: string) => {
    onDataChange({
      channelDrafts: { ...data.channelDrafts, [activeChannel]: message },
      channelEdited: { ...data.channelEdited, [activeChannel]: true },
      message, // Keep backward compat
    });
  }, [activeChannel, data.channelDrafts, data.channelEdited, onDataChange]);

  // Character counting
  const charCount = currentDraft.length;
  const effectiveLimit = useMemo(() => {
    const limit = CHAR_LIMITS[activeChannel];
    return limit;
  }, [activeChannel]);

  const hasSms = activeChannel === 'sms';

  const charInfo = useMemo(() => {
    if (hasSms) {
      const segments = Math.ceil(charCount / 160) || 1;
      if (charCount > 918) {
        return { countText: `${charCount} chars`, segmentText: `${segments} segments (over limit)`, status: 'error' as const };
      }
      if (charCount > 480) {
        return { countText: `${charCount} chars`, segmentText: `${segments} of 6 segments`, status: 'warning' as const };
      }
      if (charCount > 160) {
        return { countText: `${charCount} chars`, segmentText: `${segments} of 6 segments`, status: 'ok' as const };
      }
      return { countText: `${charCount} chars`, segmentText: null, status: 'ok' as const };
    }
    if (effectiveLimit && charCount > effectiveLimit) {
      return { countText: `${charCount} / ${effectiveLimit}`, segmentText: null, status: 'error' as const };
    }
    return { countText: `${charCount} chars`, segmentText: null, status: 'ok' as const };
  }, [charCount, effectiveLimit, hasSms]);

  const isWhatsApp = activeChannel === 'whatsapp';
  const isInApp = activeChannel === 'in-app';
  const showSubject = activeChannel === 'email' || isInApp;
  const inAppTitleLimit = 80;

  // Fetch Meta template status for WhatsApp indicator
  const [metaTemplateStatus, setMetaTemplateStatus] = useState<string | null>(null);
  useEffect(() => {
    if (!isWhatsApp || !data.commType) {
      setMetaTemplateStatus(null);
      return;
    }
    // Try to fetch the template status from our API
    fetch('/api/whatsapp/templates')
      .then(res => res.ok ? res.json() : null)
      .then(result => {
        if (!result?.templates) return;
        const matched = result.templates.find(
          (t: { mappedCommType: string | null }) => t.mappedCommType === data.commType
        );
        if (matched) {
          setMetaTemplateStatus(matched.status);
        }
      })
      .catch(() => {
        // Silently ignore — indicator just won't show
      });
  }, [isWhatsApp, data.commType]);

  // Auto-build read-only description for in-app notifications
  const inAppDescription = useMemo(() => {
    if (!isInApp) return '';
    const parts: string[] = [];
    const due = data.stepData?.['inapp-due'] as string;
    if (due) parts.push(`Due date: ${due}`);
    parts.push('Rassie du Preez');
    return parts.join(' \u00b7 ');
  }, [isInApp, data.stepData]);

  // Attached file names (from add-documents step)
  const attachedFileNames = useMemo(() => {
    const addData = data.stepData?.['add-documents'] as { files?: { name: string }[] } | undefined;
    if (!addData?.files?.length) return null;
    return addData.files.map(f => f.name);
  }, [data.stepData]);

  // Bulk detection — resolve from first recipient in bulk mode
  const isBulk = data.recipients.length > 1;
  const displayClient = isBulk ? data.recipients[0] : client;

  const otherCount = data.recipients.length - 1;
  const variables = useMemo(() => {
    const firstName = displayClient?.firstName || 'Client';
    return {
      FirstName: isBulk
        ? `${firstName} (and ${otherCount} other contact${otherCount !== 1 ? 's' : ''})`
        : firstName,
      LastName: displayClient?.lastName || '',
      Link: 'secure.elitewealth.co.za/portal/abc123',
      AdviserName: 'Rassie du Preez',
      DocumentList: (() => {
        const docData = data.stepData['select-documents'] as { documents?: string[]; customDocuments?: string[] } | undefined;
        const items: string[] = [];
        if (docData?.documents?.length) {
          const { STANDARD_DOCUMENTS } = require('@/components/comm-flow/steps/SelectDocumentsStep');
          docData.documents.forEach((id: string) => {
            const doc = STANDARD_DOCUMENTS.find((d: { id: string; label: string }) => d.id === id);
            if (doc) items.push(doc.label);
          });
        }
        if (docData?.customDocuments?.length) {
          items.push(...docData.customDocuments);
        }
        return items.length > 0 ? items.map(d => `  • ${d}`).join('\n') : '• (No documents selected)';
      })(),
      Message: '...',
    };
  }, [displayClient?.firstName, displayClient?.lastName, isBulk, otherCount]);

  // Insert variable via editor imperative handle
  const insertVariable = useCallback((varName: string) => {
    editorRef.current?.insertVariable(varName);
  }, []);

  // Auto-update subject + sync description to draft for in-app notifications
  const selectDocCount = (data.stepData['select-documents'] as { documents?: string[] })?.documents?.length || 0;
  const shareDocCount = (data.stepData['share-documents'] as { documents?: string[] })?.documents?.length || 0;
  useEffect(() => {
    if (!isInApp) return;
    // Don't override a subject that's already been set (e.g. prefilled from scenario)
    if (data.subject) return;
    // Use modalTitle as default in-app subject
    if (data.commType) {
      const config = COMM_TYPE_CONFIGS[data.commType];
      if (config?.modalTitle) {
        onDataChange({ subject: config.modalTitle });
        return;
      }
    }
    // Fall back to document-specific title
    const docTitle = buildDocumentTitle(data.stepData, '');
    if (docTitle) {
      onDataChange({ subject: docTitle });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInApp]);

  // Sync in-app description to draft (used as notification subtitle)
  useEffect(() => {
    if (!isInApp || !inAppDescription) return;
    updateDraft(inAppDescription);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInApp, inAppDescription]);

  return (
    <div className="compose-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Review and edit your message below</h2>
        </div>
      )}

      {/* Channel tabs — with edited dot indicators */}
      {hasMultipleChannels && (
        <div className="compose-channels-bar">
          {data.channels.map(channelId => (
            <button
              key={channelId}
              type="button"
              className={`compose-channel-tab ${activeChannel === channelId ? 'active' : ''}`}
              onClick={() => switchChannel(channelId)}
            >
              {CHANNELS[channelId].label}
              {data.channelEdited[channelId] && (
                <span className="compose-channel-edited-dot" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* WhatsApp Meta template notice */}
      {isWhatsApp && (
        <div className="compose-whatsapp-notice">
          <span className="material-icons-outlined" style={{ fontSize: '16px' }}>verified</span>
          <span>
            This message will be sent as a <strong>Meta-approved WhatsApp template</strong>.
            {metaTemplateStatus && (
              <span className={`compose-whatsapp-status ${metaTemplateStatus.toLowerCase()}`}>
                {' '}{metaTemplateStatus}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Compose card — same pattern for all channels */}
      <div className={`config-card compose-card ${charInfo.status === 'error' ? 'has-error' : ''}`}>
        {/* Subject — shown for email and in-app */}
        {showSubject && (
          <div className="compose-card-subject">
            <input
              type="text"
              placeholder={isInApp ? 'Notification title...' : 'Subject...'}
              value={data.subject}
              onChange={(e) => {
                const val = isInApp ? e.target.value.slice(0, inAppTitleLimit) : e.target.value;
                onDataChange({ subject: val });
              }}
              maxLength={isInApp ? inAppTitleLimit : undefined}
              className="compose-subject-input"
            />
            {isInApp && (
              <span className={`compose-subject-count ${(data.subject?.length || 0) > inAppTitleLimit - 10 ? 'warning' : ''}`}>
                {data.subject?.length || 0}/{inAppTitleLimit}
              </span>
            )}
          </div>
        )}

        {/* In-app: read-only description (auto-built from context) */}
        {isInApp ? (
          <div className="compose-inapp-description-row">
            <span className="compose-inapp-description-text">{inAppDescription}</span>
            {attachedFileNames && attachedFileNames.length > 0 && (
              <span className="compose-inapp-files">{attachedFileNames.join(', ')}</span>
            )}
          </div>
        ) : (
          <>
            {/* Message editor — for WhatsApp, use the Meta template as the content */}
            <div className="compose-card-body">
              {isWhatsApp ? (() => {
                const commType = data.commType || 'message';
                const templateMapping = META_TEMPLATE_MAP[commType];
                if (!templateMapping) return null;

                const isEditable = !!templateMapping.editableParam;

                // For editable templates (general message): use VariableEditor with just the message content
                if (isEditable) {
                  return (
                    <VariableEditor
                      ref={editorRef}
                      value={currentDraft}
                      onChange={updateDraft}
                      variables={variables}
                      placeholder="Type your message..."
                      rows={5}
                    />
                  );
                }

                // For structured templates: render read-only resolved text
                const resolvedBody = templateMapping.bodyPreview
                  .replace(/\{FirstName\}/g, variables.FirstName)
                  .replace(/\{AdviserName\}/g, variables.AdviserName)
                  .replace(/\{DocumentList\}/g, variables.DocumentList);

                return (
                  <div style={{
                    padding: '12px 14px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'var(--color-text-secondary)',
                    whiteSpace: 'pre-wrap',
                    minHeight: '120px',
                  }}>
                    {resolvedBody}
                    {templateMapping.buttonLabel && (
                      <div style={{
                        marginTop: '16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#027eb5',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}>
                        <span className="material-icons-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                        {templateMapping.buttonLabel}
                      </div>
                    )}
                  </div>
                );
              })() : (
                <VariableEditor
                  ref={editorRef}
                  value={currentDraft}
                  onChange={updateDraft}
                  variables={variables}
                  placeholder="Type your message..."
                  rows={8}
                />
              )}
            </div>

            {/* Insert bar */}
            <div className="compose-insert-bar">
              {isWhatsApp ? (
                <>
                  <span className="compose-insert-label" style={{ color: 'var(--color-text-muted)' }}>
                    {META_TEMPLATE_MAP[data.commType || 'message']?.editableParam ? 'Your message will be wrapped in the WhatsApp template' : 'This template cannot be edited'}
                  </span>
                  <span className="compose-insert-spacer" />
                  <span className={`compose-status-count ok`}>{charInfo.countText}</span>
                </>
              ) : (
                <>
                  <span className="compose-insert-label">Insert:</span>
                  <button type="button" className="compose-insert-btn" onClick={() => insertVariable('FirstName')}>First Name</button>
                  <button type="button" className="compose-insert-btn" onClick={() => insertVariable('LastName')}>Last Name</button>
                  <button type="button" className="compose-insert-btn" onClick={() => insertVariable('Link')}>Link</button>
                  <span className="compose-insert-spacer" />
                  <span className={`compose-status-count ${charInfo.status}`}>{charInfo.countText}</span>
                  {charInfo.segmentText && (
                    <span className={`compose-status-segments ${charInfo.status}`}>{charInfo.segmentText}</span>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Register this step
registerStep('compose', ComposeStep);

export default ComposeStep;
