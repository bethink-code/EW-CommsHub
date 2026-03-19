'use client';

import { Suspense, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { NotesButton } from '@/components/GlobalNotes';
import ClientDemoPortal from '@/components/client-demo/ClientDemoPortal';
import { getUnreadAdviserNotificationCount } from '../mock-data';
import '../comms-hub.css';

// =============================================================================
// INNER CONTENT (uses useSearchParams)
// =============================================================================

function ClientDemoContent() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action') as 'view-shared' | 'upload-requested' | null;

  const [showPortal, setShowPortal] = useState(!!actionParam);
  const [portalAction, setPortalAction] = useState<'view-shared' | 'upload-requested' | null>(actionParam);
  const unreadNotifCount = useMemo(() => getUnreadAdviserNotificationCount(), []);

  const openPortal = useCallback((action: 'view-shared' | 'upload-requested') => {
    setPortalAction(action);
    setShowPortal(true);
  }, []);

  const closePortal = useCallback(() => {
    setShowPortal(false);
    setPortalAction(null);
  }, []);

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
          <Link href="/comms-hub" className="tab">
            Communications
          </Link>
          <Link href="/comms-hub/notifications" className="tab">
            Notifications
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
          <Link href="/comms-hub/settings" className="tab">
            Settings
          </Link>
          <Link href="/comms-hub/client-demo" className="tab active">
            Client Demo
          </Link>
          <Link href="/comms-hub/client-context" className="tab">Client Context</Link>
        </nav>

        {/* Intro card */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-body" style={{ padding: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-xs)' }}>
              Client Portal Demo
            </h2>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
              Preview what your clients experience when they receive a notification and interact with the portal. Choose a scenario below, or send a notification from the Demo Flows tab — the action button will bring you here automatically.
            </p>
          </div>
        </div>

        {/* Scenario cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--spacing-sm)',
        }}>
          <button
            type="button"
            className="card"
            onClick={() => openPortal('view-shared')}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              cursor: 'pointer', border: '1px solid var(--color-border)',
              textAlign: 'left', width: '100%',
              transition: 'border-color 150ms, box-shadow 150ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--ew-blue)';
              e.currentTarget.style.boxShadow = '0 0 0 1px var(--ew-blue)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span className="material-icons-outlined" style={{ fontSize: 24, color: 'var(--ew-blue)', flexShrink: 0 }}>
              description
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                View Shared Document
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Login → Portal → View document modal
              </div>
            </div>
            <span className="material-icons-outlined" style={{ fontSize: 18, color: 'var(--color-text-muted)', flexShrink: 0 }}>
              chevron_right
            </span>
          </button>

          <button
            type="button"
            className="card"
            onClick={() => openPortal('upload-requested')}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              cursor: 'pointer', border: '1px solid var(--color-border)',
              textAlign: 'left', width: '100%',
              transition: 'border-color 150ms, box-shadow 150ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--ew-blue)';
              e.currentTarget.style.boxShadow = '0 0 0 1px var(--ew-blue)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span className="material-icons-outlined" style={{ fontSize: 24, color: 'var(--ew-blue)', flexShrink: 0 }}>
              upload_file
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                Upload Requested Documents
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Login → Portal → Upload documents modal
              </div>
            </div>
            <span className="material-icons-outlined" style={{ fontSize: 18, color: 'var(--color-text-muted)', flexShrink: 0 }}>
              chevron_right
            </span>
          </button>
        </div>
      </div>

      {/* Full-screen portal overlay */}
      {showPortal && (
        <ClientDemoPortal
          onClose={closePortal}
          initialAction={portalAction}
        />
      )}
    </AppLayout>
  );
}

// =============================================================================
// PAGE WRAPPER (Suspense for useSearchParams)
// =============================================================================

export default function ClientDemoPage() {
  return (
    <Suspense fallback={null}>
      <ClientDemoContent />
    </Suspense>
  );
}
