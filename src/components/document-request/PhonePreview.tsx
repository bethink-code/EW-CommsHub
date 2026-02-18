'use client';

import { useMemo } from 'react';
import { Channel, Client, CHANNELS } from '@/types/communications';

// =============================================================================
// COMPONENT
// =============================================================================

export interface PhonePreviewProps {
  channel: Channel;
  message: string;
  client: Client;
  documents: string[];
}

export function PhonePreview({
  channel,
  message,
  client,
  documents,
}: PhonePreviewProps) {
  // Process message with template variables
  const processedMessage = useMemo(() => {
    const docList = documents.map(d => `• ${d}`).join('\n');

    return message
      .replace(/{FirstName}/g, client.firstName)
      .replace(/{LastName}/g, client.lastName)
      .replace(/{DocumentList}/g, docList)
      .replace(/{Link}/g, 'wealth.elitewm.co.za/upload/abc123')
      .replace(/{AdviserName}/g, 'John Smith'); // TODO: Get from context
  }, [message, client, documents]);

  // Get current time for preview
  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  return (
    <div className="phone-preview">
      <div className="phone-frame">
        {/* Phone notch */}
        <div className="phone-notch"></div>

        {/* Status bar */}
        <div className="phone-status-bar">
          <span>{currentTime}</span>
          <div className="phone-status-icons">
            <span className="material-icons-outlined">signal_cellular_alt</span>
            <span className="material-icons-outlined">wifi</span>
            <span className="material-icons-outlined">battery_full</span>
          </div>
        </div>

        {/* App header */}
        <div className="phone-app-header">
          <span className="material-icons-outlined">arrow_back</span>
          <div className="phone-contact-info">
            <div className="phone-contact-name">Elite Wealth</div>
            <div className="phone-contact-channel">
              <span className="material-icons-outlined" style={{ fontSize: '12px' }}>
                {CHANNELS[channel].icon}
              </span>
              {CHANNELS[channel].label}
            </div>
          </div>
        </div>

        {/* Message area */}
        <div className="phone-message-area">
          <div className="phone-message-bubble outgoing">
            <div className="phone-message-text">
              {processedMessage.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < processedMessage.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
            <div className="phone-message-meta">
              <span className="phone-message-time">{currentTime}</span>
              <span className="material-icons-outlined phone-message-status">done_all</span>
            </div>
          </div>
        </div>
      </div>

      <div className="phone-preview-label">
        Preview: {CHANNELS[channel].label}
      </div>
    </div>
  );
}

export default PhonePreview;
