'use client';

import { useState, useMemo } from 'react';
import { StepProps } from '@/lib/comm-flow/types';
import { COMM_TYPE_CONFIGS, CHANNELS, Channel } from '@/types/communications';
import { getMessageTemplate } from '@/lib/comm-flow/templates';
import { registerStep } from '@/lib/comm-flow/stepRegistry';
import { VariableEditor } from '@/components/comm-flow/VariableEditor';

// =============================================================================
// CHARACTER LIMITS
// =============================================================================

const CHAR_LIMITS: Record<Channel, number | null> = {
  sms: 918,       // 6 SMS segments max
  whatsapp: 4096,
  email: null,     // No limit
  'in-app': 500,
};

// =============================================================================
// COMPONENT
// =============================================================================

export function ComposeStep({
  data,
  client,
  context,
  onDataChange,
}: StepProps) {
  const config = data.commType ? COMM_TYPE_CONFIGS[data.commType] : null;
  const [activeChannel, setActiveChannel] = useState<Channel>(data.channels[0]);

  // Keep activeChannel in sync with available channels
  const currentChannel = data.channels.includes(activeChannel) ? activeChannel : data.channels[0];
  const hasMultipleChannels = data.channels.length > 1;

  // Switch channel tab — load template if message hasn't been customized
  const switchChannel = (ch: Channel) => {
    setActiveChannel(ch);
    if (data.commType) {
      const currentTemplate = getMessageTemplate(data.commType, currentChannel);
      if (data.message === currentTemplate || data.message === '') {
        const newTemplate = getMessageTemplate(data.commType, ch);
        onDataChange({ message: newTemplate });
      }
    }
  };

  const charCount = data.message.length;

  // Most restrictive character limit across all selected channels
  const effectiveLimit = useMemo(() => {
    let min: number | null = null;
    for (const ch of data.channels) {
      const limit = CHAR_LIMITS[ch];
      if (limit !== null) {
        if (min === null || limit < min) min = limit;
      }
    }
    return min;
  }, [data.channels]);

  // Which channels drive the status display
  const hasSms = data.channels.includes('sms');

  // Smart character counting with SMS segment awareness
  const charInfo = useMemo(() => {
    if (hasSms) {
      const segments = Math.ceil(charCount / 160) || 1;
      if (charCount > 918) {
        return {
          countText: `${charCount} chars`,
          segmentText: `${segments} segments (over limit)`,
          status: 'error' as const,
        };
      }
      if (charCount > 480) {
        return {
          countText: `${charCount} chars`,
          segmentText: `${segments} of 6 segments`,
          status: 'warning' as const,
        };
      }
      if (charCount > 160) {
        return {
          countText: `${charCount} chars`,
          segmentText: `${segments} of 6 segments`,
          status: 'ok' as const,
        };
      }
      return {
        countText: `${charCount} chars`,
        segmentText: null,
        status: 'ok' as const,
      };
    }

    if (effectiveLimit && charCount > effectiveLimit) {
      return {
        countText: `${charCount} / ${effectiveLimit}`,
        segmentText: null,
        status: 'error' as const,
      };
    }

    return {
      countText: `${charCount} chars`,
      segmentText: null,
      status: 'ok' as const,
    };
  }, [charCount, effectiveLimit, hasSms]);

  const isInApp = currentChannel === 'in-app';
  const showSubject = currentChannel === 'email' || isInApp;

  // Variable resolution map for inline preview tokens
  const variables = useMemo(() => ({
    FirstName: client?.firstName || 'Client',
    LastName: client?.lastName || '',
    Link: 'secure.elitewealth.co.za/portal/abc123',
    AdviserName: 'Rassie du Preez',
    DocumentList: '• ID Document\n• Proof of Address\n• Bank Statement',
    Message: '...',
  }), [client?.firstName, client?.lastName]);

  return (
    <div className="compose-step">
      <div className="step-header">
        <h2 className="step-title">Compose Message</h2>
        <p className="step-subtitle">
          {client
            ? `Write your message to ${client.firstName}`
            : 'Write your message'}
        </p>
      </div>

      {/* Channel tabs — underline style */}
      {data.channels.length > 0 && (
        <div className="compose-channels-bar">
          <span className="compose-card-sending">Compose the</span>
          {data.channels.map(channelId => (
            <button
              key={channelId}
              type="button"
              className={`compose-channel-tab ${currentChannel === channelId ? 'active' : ''}`}
              onClick={() => switchChannel(channelId)}
              disabled={!hasMultipleChannels}
            >
              <span className="material-icons-outlined">{CHANNELS[channelId].icon}</span>
              {CHANNELS[channelId].label}
            </button>
          ))}
        </div>
      )}

      {/* Compose card */}
      <div className={`compose-card ${charInfo.status === 'error' ? 'has-error' : ''}`}>
        {/* Subject / Heading — shown for email and in-app */}
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

        {/* Card body: unified variable editor */}
        <div className="compose-card-body">
          <VariableEditor
            value={data.message}
            onChange={(message) => onDataChange({ message })}
            variables={variables}
            placeholder={isInApp ? 'Notification body...' : 'Type your message...'}
            rows={isInApp ? 4 : 10}
          />
        </div>

        {/* Card footer: status bar */}
        <div className={`compose-card-status ${charInfo.status}`}>
          <span className="compose-status-count">{charInfo.countText}</span>
          {charInfo.segmentText && (
            <span className="compose-status-segments">{charInfo.segmentText}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Register this step
registerStep('compose', ComposeStep);

export default ComposeStep;
