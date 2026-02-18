'use client';

import { useMemo } from 'react';
import { ModalFooter } from '../Modal';
import { PhonePreview } from './PhonePreview';
import { Channel, Client, CHANNELS } from '@/types/communications';
import { STANDARD_DOCUMENTS } from './SelectDocumentsStep';

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

export interface ComposeMessageStepProps {
  client: Client;
  channel: Channel;
  message: string;
  documents: string[];
  customDocuments: string[];
  onChannelChange: (channel: Channel) => void;
  onMessageChange: (message: string) => void;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function ComposeMessageStep({
  client,
  channel,
  message,
  documents,
  customDocuments,
  onChannelChange,
  onMessageChange,
  onCancel,
  onBack,
  onNext,
}: ComposeMessageStepProps) {
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

  // Available channels
  const availableChannels: Channel[] = ['email', 'sms', 'whatsapp'];

  // Get document labels for preview
  const documentLabels = useMemo(() => {
    const standardLabels = documents.map(docId => {
      const doc = STANDARD_DOCUMENTS.find(d => d.id === docId);
      return doc?.label || docId;
    });
    return [...standardLabels, ...customDocuments];
  }, [documents, customDocuments]);

  return (
    <div className="compose-step">
      {/* Two-column layout */}
      <div className="compose-layout">
        {/* Left column: Channel tabs + Message editor */}
        <div className="compose-editor">
          {/* Channel question */}
          <div className="compose-question">How would you like to send this request?</div>

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

          {/* Documents summary */}
          <div className="compose-docs-summary">
            <span className="material-icons-outlined">folder</span>
            <span>Requesting {documentLabels.length} document{documentLabels.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Message label */}
          <div className="compose-message-label">Your message</div>

          {/* Message textarea */}
          <div className="compose-textarea-wrapper">
            <textarea
              className={`compose-textarea ${charInfo.status === 'error' ? 'error' : ''}`}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Type your message..."
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
              Use <code>{'{FirstName}'}</code>, <code>{'{Link}'}</code>, <code>{'{DocumentList}'}</code>, and <code>{'{AdviserName}'}</code> as placeholders.
            </span>
          </div>
        </div>

        {/* Right column: Phone preview */}
        <div className="compose-preview">
          <PhonePreview
            channel={channel}
            message={message}
            client={client}
            documents={documentLabels}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <ModalFooter
          onCancel={onCancel}
          onPrimary={onNext}
          primaryLabel="Next: Preview"
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
