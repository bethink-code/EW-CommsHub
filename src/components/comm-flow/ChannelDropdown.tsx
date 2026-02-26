'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Channel, CHANNELS } from '@/types/communications';

interface ChannelDropdownProps {
  availableChannels: Channel[];
  selectedChannels: Channel[];
  onToggle: (channel: Channel) => void;
}

export function ChannelDropdown({ availableChannels, selectedChannels, onToggle }: ChannelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleToggle = useCallback((channel: Channel) => {
    const isActive = selectedChannels.includes(channel);
    if (isActive && selectedChannels.length <= 1) return;
    onToggle(channel);
  }, [selectedChannels, onToggle]);

  return (
    <div className="channel-dropdown" ref={ref}>
      <button
        type="button"
        className={`channel-dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-icons-outlined" style={{ fontSize: 16 }}>send</span>
        <span className="channel-dropdown-label">Channels</span>
        <span className="channel-dropdown-count">
          {selectedChannels.length}/{availableChannels.length}
        </span>
        <span className="material-icons-outlined" style={{ fontSize: 16 }}>
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="channel-dropdown-menu">
          {availableChannels.map(channelId => {
            const isActive = selectedChannels.includes(channelId);
            const isLastActive = isActive && selectedChannels.length === 1;
            return (
              <button
                key={channelId}
                type="button"
                className={`channel-dropdown-item ${isActive ? 'selected' : ''}`}
                onClick={() => handleToggle(channelId)}
                disabled={isLastActive}
              >
                <span className={`channel-dropdown-dot ${isActive ? 'checked' : ''}`}>
                  {isActive && (
                    <svg viewBox="0 0 12 12" width="8" height="8">
                      <path d="M2 6l3 3 5-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="material-icons-outlined" style={{ fontSize: 18 }}>
                  {CHANNELS[channelId].icon}
                </span>
                <span>{CHANNELS[channelId].label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ChannelDropdown;
