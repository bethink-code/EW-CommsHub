'use client';

import { useMemo, useRef, useCallback } from 'react';
import { StepProps } from '@/lib/comm-flow/types';
import { CHANNELS, Channel } from '@/types/communications';
import { registerStep } from '@/lib/comm-flow/stepRegistry';
import { VariableEditor, VariableEditorHandle } from '@/components/comm-flow/VariableEditor';

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

  const isInApp = activeChannel === 'in-app';
  const showSubject = activeChannel === 'email' || isInApp;

  // Variable resolution map
  const variables = useMemo(() => ({
    FirstName: client?.firstName || 'Client',
    LastName: client?.lastName || '',
    Link: 'secure.elitewealth.co.za/portal/abc123',
    AdviserName: 'Rassie du Preez',
    DocumentList: '• ID Document\n• Proof of Address\n• Bank Statement',
    Message: '...',
  }), [client?.firstName, client?.lastName]);

  // Insert variable via editor imperative handle
  const insertVariable = useCallback((varName: string) => {
    editorRef.current?.insertVariable(varName);
  }, []);

  return (
    <div className="compose-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Compose Message</h2>
          <p className="step-subtitle">
            {client ? `Write your message to ${client.firstName}` : 'Write your message'}
          </p>
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

      {/* Compose card */}
      <div className={`compose-card ${charInfo.status === 'error' ? 'has-error' : ''}`}>
        {/* Subject — shown for email and in-app */}
        {showSubject && (
          <div className="compose-card-subject">
            <input
              type="text"
              placeholder={isInApp ? 'Notification heading...' : 'Subject...'}
              value={data.subject}
              onChange={(e) => onDataChange({ subject: e.target.value })}
              className="compose-subject-input"
            />
          </div>
        )}

        {/* Message editor */}
        <div className="compose-card-body">
          <VariableEditor
            ref={editorRef}
            value={currentDraft}
            onChange={updateDraft}
            variables={variables}
            placeholder={isInApp ? 'Notification body...' : 'Type your message...'}
            rows={isInApp ? 4 : 8}
          />
        </div>

        {/* Insert bar */}
        <div className="compose-insert-bar">
          <span className="compose-insert-label">Insert:</span>
          <button type="button" className="compose-insert-btn" onClick={() => insertVariable('FirstName')}>First Name</button>
          <button type="button" className="compose-insert-btn" onClick={() => insertVariable('LastName')}>Last Name</button>
          <button type="button" className="compose-insert-btn" onClick={() => insertVariable('Link')}>Link</button>
          <span className="compose-insert-spacer" />
          <span className={`compose-status-count ${charInfo.status}`}>{charInfo.countText}</span>
          {charInfo.segmentText && (
            <span className={`compose-status-segments ${charInfo.status}`}>{charInfo.segmentText}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Register this step
registerStep('compose', ComposeStep);

export default ComposeStep;
