'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { NotesButton } from '@/components/GlobalNotes';
import { getUnreadAdviserNotificationCount } from '../mock-data';
import '../comms-hub.css';

export default function CommsHubSettings() {
  const unreadNotifCount = useMemo(() => getUnreadAdviserNotificationCount(), []);

  return (
    <AppLayout>
      <div className="comms-dashboard">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Communications Hub</h1>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <NotesButton />
            <Link href="/comms-hub/send" className="btn btn-primary">
              <span className="material-icons">add</span>
              Send New
            </Link>
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="tabs">
          <Link href="/comms-hub" className="tab">
            Communications
          </Link>
          <Link href="/comms-hub/notifications" className="tab">
            Alerts
            {unreadNotifCount > 0 && <span className="tab-badge">{unreadNotifCount}</span>}
          </Link>
          <Link href="/comms-hub/demo-flows" className="tab">
            Demo Flows
          </Link>
          <Link href="/comms-hub/relationships" className="tab">
            Contact Book
          </Link>
          <Link href="/comms-hub/campaigns" className="tab">
            Campaigns
          </Link>
          <Link href="/comms-hub/templates" className="tab">
            Templates
          </Link>
          <Link href="/comms-hub/settings" className="tab active">
            Settings
          </Link>
        </nav>

        {/* Settings Placeholder */}
        <div className="card">
          <div className="card-body" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
            <span className="material-icons" style={{ fontSize: '48px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', display: 'block' }}>
              settings
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Settings</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Communication preferences and configuration — coming soon</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
