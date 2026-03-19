'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { NotesButton } from '@/components/GlobalNotes';
import { useCommFlows } from '@/contexts/CommFlowsContext';
import { useNotificationCenter } from '@/components/NotificationCenter';
import { MOCK_CLIENTS, getUnreadAdviserNotificationCount } from '../mock-data';
import '../comms-hub.css';

// Default client
const DEFAULT_CLIENT = MOCK_CLIENTS.find(c => c.id === 'c2')!; // Sarah van der Berg

// Send message options
const SEND_OPTIONS = [
  { id: 'info-request', label: 'Request information' },
  { id: 'share-document', label: 'Share document' },
  { id: 'portal-invite', label: 'Wealth Portal | Mobile App invite' },
  { id: 'message', label: 'Free format' },
];

export default function ClientContextPage() {
  const { startFlow } = useCommFlows();
  const { openNotificationCenter, unreadCount } = useNotificationCenter();
  const unreadNotifCount = useMemo(() => getUnreadAdviserNotificationCount(), []);
  const [sendMenuOpen, setSendMenuOpen] = useState(false);
  const sendMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!sendMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (sendMenuRef.current && !sendMenuRef.current.contains(e.target as Node)) {
        setSendMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sendMenuOpen]);

  const client = DEFAULT_CLIENT;

  const handleSendOption = useCallback((optionId: string) => {
    setSendMenuOpen(false);
    switch (optionId) {
      case 'info-request':
        startFlow({ client, commType: 'info-request' });
        break;
      case 'share-document':
        startFlow({
          client,
          commType: 'in-app',
          prefill: { subject: 'A document has been shared with you', message: '' },
          additionalStepIds: ['share-documents', 'add-documents'],
        });
        break;
      case 'portal-invite':
        startFlow({ client, commType: 'portal-invite' });
        break;
      case 'message':
        startFlow({ client, commType: 'message' });
        break;
    }
  }, [client, startFlow]);

  return (
    <AppLayout>
      <div className="comms-dashboard">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Communications Hub</h1>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <NotesButton />
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="tabs">
          <Link href="/comms-hub" className="tab">Communications</Link>
          <Link href="/comms-hub/notifications" className="tab">
            Notifications
            {unreadNotifCount > 0 && <span className="tab-badge">{unreadNotifCount}</span>}
          </Link>
          <Link href="/comms-hub/demo-flows" className="tab">Demo Flows</Link>
          <Link href="/comms-hub/relationships" className="tab">Contact Book</Link>
          <Link href="/comms-hub/campaigns" className="tab">Campaigns</Link>
          <Link href="/comms-hub/templates" className="tab">Templates</Link>
          <Link href="/comms-hub/settings" className="tab">Settings</Link>
          <Link href="/comms-hub/client-demo" className="tab">Client Demo</Link>
          <Link href="/comms-hub/client-context" className="tab active">Client Context</Link>
        </nav>

        {/* Client Context Card */}
        <div className="cc-card">
          <div className="cc-card-header">
            <div className="cc-card-identity">
              <span className="material-icons-outlined cc-card-icon">badge</span>
              <span className="cc-card-name">{client.firstName} {client.lastName}</span>
              <span className="cc-card-ref">Demo/1/12345 / Client / Client&apos;s company</span>
            </div>
            <button
              type="button"
              className="cc-action-btn cc-action-btn-bell"
              onClick={openNotificationCenter}
              title="Client notifications"
            >
              <span className="material-icons-outlined" style={{ fontSize: '20px' }}>notifications</span>
              {unreadCount > 0 && (
                <span className="cc-bell-badge">{unreadCount}</span>
              )}
            </button>
          </div>

          <div className="cc-card-divider" />

          <div className="cc-card-details">
            <div className="cc-card-demographics">
              <span className="cc-card-demo-text">52 years old / Married</span>
              <button type="button" className="cc-pill-btn">
                Related entities
                <span className="material-icons-outlined" style={{ fontSize: '18px' }}>expand_more</span>
              </button>

              {/* Send message dropdown */}
              <div className="cc-send-wrapper" ref={sendMenuRef}>
                <button
                  type="button"
                  className="cc-pill-btn cc-pill-btn-white"
                  onClick={() => setSendMenuOpen(!sendMenuOpen)}
                >
                  Send message
                  <span className="material-icons-outlined" style={{ fontSize: '18px' }}>expand_more</span>
                </button>

                {sendMenuOpen && (
                  <div className="cc-send-dropdown">
                    <div className="cc-send-options">
                      {SEND_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          className="cc-send-option"
                          onClick={() => handleSendOption(opt.id)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="cc-send-divider" />
                    <button type="button" className="cc-send-settings">
                      Settings
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="cc-card-actions">
              <button type="button" className="cc-action-btn cc-action-btn-blue">
                Choose another client
                <span className="material-icons-outlined" style={{ fontSize: '18px' }}>expand_more</span>
              </button>
              <button type="button" className="cc-action-btn">New client</button>
              <button type="button" className="cc-action-btn cc-action-btn-dots">
                <span className="material-icons-outlined" style={{ fontSize: '20px' }}>more_horiz</span>
              </button>
            </div>
          </div>
        </div>

        {/* Placeholder content area — represents rest of EW app */}
        <div className="cc-content-placeholder">
          <div className="cc-placeholder-sidebar">
            <div className="cc-placeholder-sidebar-item" />
            <div className="cc-placeholder-sidebar-item" />
            <div className="cc-placeholder-sidebar-item" />
            <div className="cc-placeholder-sidebar-item" />
            <div className="cc-placeholder-sidebar-item" />
          </div>
          <div className="cc-placeholder-main">
            <div className="cc-placeholder-block" />
            <div className="cc-placeholder-block cc-placeholder-block-lg" />
            <div className="cc-placeholder-block" />
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
