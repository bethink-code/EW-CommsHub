'use client';

import { useState, useMemo } from 'react';
import { ModalFooter } from '../Modal';
import { PhonePreview } from './PhonePreview';
import { ClientJourneyPreview } from './ClientJourneyPreview';
import { Channel, Client, CHANNELS } from '@/types/communications';

// =============================================================================
// CHARACTER LIMITS
// =============================================================================

// Character limits - SMS allows multi-segment so we use a higher practical limit
const CHAR_LIMITS: Record<Channel, number | null> = {
  sms: 918, // 6 segments max (practical limit for cost reasons)
  whatsapp: 4096,
  email: null, // No limit
  'in-app': 500,
};

// =============================================================================
// COMPONENT
// =============================================================================

export interface ComposeMessageStepProps {
  client: Client;
  channels: Channel[];
  messages: Record<Channel, string>;
  onMessageChange: (channel: Channel, message: string) => void;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function ComposeMessageStep({
  client,
  channels,
  messages,
  onMessageChange,
  onCancel,
  onBack,
  onNext,
}: ComposeMessageStepProps) {
  // Track which channel's message is currently being edited
  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0] || 'email');

  // Track if client journey preview is open
  const [showJourneyPreview, setShowJourneyPreview] = useState(false);

  // Get current message for active channel
  const currentMessage = messages[activeChannel] || '';
  const charCount = currentMessage.length;
  const charLimit = CHAR_LIMITS[activeChannel];

  // Character count info
  const charInfo = useMemo(() => {
    if (!charLimit) {
      return { text: `${charCount} characters`, status: 'ok' as const };
    }

    if (activeChannel === 'sms') {
      const segments = Math.ceil(charCount / 160) || 1;
      const remaining = (segments * 160) - charCount;
      if (charCount > 918) {
        return { text: `${charCount} chars · ${segments} segments (max 6 segments)`, status: 'error' as const };
      }
      if (charCount > 480) {
        return { text: `${charCount} chars · ${segments} segments`, status: 'warning' as const };
      }
      return { text: `${charCount} chars · ${segments} segment${segments > 1 ? 's' : ''} · ${remaining} remaining`, status: 'ok' as const };
    }

    if (charCount > charLimit) {
      return { text: `${charCount} / ${charLimit} characters (over limit)`, status: 'error' as const };
    }

    if (charCount > charLimit * 0.9) {
      return { text: `${charCount} / ${charLimit} characters`, status: 'warning' as const };
    }

    return { text: `${charCount} / ${charLimit} characters`, status: 'ok' as const };
  }, [charCount, charLimit, activeChannel]);

  // Check if any channel message is over limit or empty
  const hasValidationError = useMemo(() => {
    return channels.some(ch => {
      const msg = messages[ch] || '';
      const limit = CHAR_LIMITS[ch];
      if (msg.trim().length === 0) return true;
      if (limit && msg.length > limit) return true;
      return false;
    });
  }, [channels, messages]);

  // Get validation status per channel for tab dots
  const getChannelStatus = (ch: Channel): 'valid' | 'error' => {
    const msg = messages[ch] || '';
    const limit = CHAR_LIMITS[ch];
    if (msg.trim().length === 0) return 'error';
    if (limit && msg.length > limit) return 'error';
    return 'valid';
  };

  return (
    <div className="compose-step">
      {/* Two-column layout */}
      <div className="compose-layout">
        {/* Left column: Channel tabs + Message editor */}
        <div className="compose-editor">
          {/* Channel tabs (only show selected channels) */}
          <div className="compose-channel-tabs">
            {channels.map((ch) => {
              const status = getChannelStatus(ch);
              return (
                <button
                  key={ch}
                  type="button"
                  className={`compose-tab ${ch === activeChannel ? 'selected' : ''}`}
                  onClick={() => setActiveChannel(ch)}
                >
                  {CHANNELS[ch].label}
                  <span className={`compose-tab-dot ${status}`} />
                </button>
              );
            })}
          </div>

          {/* Message textarea */}
          <div className="compose-textarea-wrapper">
            <textarea
              className={`compose-textarea ${charInfo.status === 'error' ? 'error' : ''}`}
              value={currentMessage}
              onChange={(e) => onMessageChange(activeChannel, e.target.value)}
              placeholder={`Type your ${CHANNELS[activeChannel].label} message...`}
              rows={12}
            />
            <div className={`compose-char-count ${charInfo.status}`}>
              {charInfo.text}
            </div>
          </div>

          {/* Template variables hint */}
          <div className="compose-hint">
            <span className="material-icons-outlined">info</span>
            <span>
              Available variables: <code>{'{FirstName}'}</code>, <code>{'{LastName}'}</code>, <code>{'{Link}'}</code>, <code>{'{AdviserName}'}</code>
            </span>
          </div>

          {/* Multi-channel info */}
          {channels.length > 1 && (
            <div className="compose-multi-info">
              <span className="material-icons-outlined">campaign</span>
              <span>
                Customize each channel&apos;s message using the tabs above.
                All {channels.length} channels will be sent simultaneously.
              </span>
            </div>
          )}
        </div>

        {/* Right column: Phone preview */}
        <div className="compose-preview">
          <PhonePreview
            channel={activeChannel}
            message={currentMessage}
            client={client}
          />

          {/* Journey preview button */}
          <button
            type="button"
            className="journey-preview-trigger"
            onClick={() => setShowJourneyPreview(true)}
          >
            <span className="material-icons-outlined">visibility</span>
            Preview Full Client Journey
          </button>
        </div>
      </div>

      {/* Client Journey Preview Overlay */}
      {showJourneyPreview && (
        <ClientJourneyPreview
          client={client}
          channel={activeChannel}
          message={currentMessage}
          onClose={() => setShowJourneyPreview(false)}
        />
      )}

      {/* Footer */}
      <div className="modal-footer">
        <ModalFooter
          onCancel={onCancel}
          onPrimary={onNext}
          primaryLabel="Review & Send"
          primaryIcon="arrow_forward"
          primaryDisabled={hasValidationError}
          showBack
          onBack={onBack}
        />
      </div>
    </div>
  );
}

export default ComposeMessageStep;
