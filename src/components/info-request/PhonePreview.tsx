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
}

export function PhonePreview({ channel, message, client }: PhonePreviewProps) {
  // Replace placeholders with actual values
  const renderedMessage = useMemo(() => {
    return message
      .replace(/\{FirstName\}/g, client.firstName)
      .replace(/\{LastName\}/g, client.lastName)
      .replace(/\{Link\}/g, 'secure.elitewealth.co.za/form/abc123')
      .replace(/\{AdviserName\}/g, 'Your Adviser');
  }, [message, client]);

  // Get channel icon and color
  const channelInfo = CHANNELS[channel];

  // Format time
  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }, []);

  return (
    <div className="phone-preview">
      {/* Phone frame */}
      <div className="phone-frame">
        {/* Phone notch */}
        <div className="phone-notch"></div>

        {/* Status bar */}
        <div className="phone-status-bar">
          <span className="phone-time">{currentTime}</span>
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
            <span className="phone-contact-name">{client.firstName} {client.lastName}</span>
            <span className="phone-contact-channel">
              <span className="material-icons-outlined" style={{ fontSize: '12px' }}>
                {channelInfo.icon}
              </span>
              {channelInfo.label}
            </span>
          </div>
        </div>

        {/* Message area */}
        <div className="phone-message-area">
          <div className="phone-message-bubble outgoing">
            <div className="phone-message-text">
              {renderedMessage.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < renderedMessage.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
            <div className="phone-message-meta">
              <span className="phone-message-time">Now</span>
              <span className="material-icons-outlined phone-message-status">done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview label */}
      <div className="phone-preview-label">
        Preview
      </div>
    </div>
  );
}

export default PhonePreview;
