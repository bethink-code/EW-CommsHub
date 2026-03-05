'use client';

import { useEffect } from 'react';
import {
  DEMO_CLIENT,
  DEMO_ADVISER,
  PENDING_ACTIONS,
  RECENT_DOCUMENTS,
} from './client-demo-data';

interface ClientDemoDashboardProps {
  initialAction?: 'view-shared' | 'upload-requested' | null;
  onViewDoc: () => void;
  onUploadDoc: () => void;
}

export default function ClientDemoDashboard({
  initialAction,
  onViewDoc,
  onUploadDoc,
}: ClientDemoDashboardProps) {
  // Auto-open modal if deep-linked
  useEffect(() => {
    if (initialAction === 'view-shared') {
      const timer = setTimeout(() => onViewDoc(), 400);
      return () => clearTimeout(timer);
    }
    if (initialAction === 'upload-requested') {
      const timer = setTimeout(() => onUploadDoc(), 400);
      return () => clearTimeout(timer);
    }
  }, [initialAction, onViewDoc, onUploadDoc]);

  return (
    <>
      {/* Portal header */}
      <div className="client-portal-header">
        <div className="client-portal-header-left">
          <div className="client-portal-logo">
            <span className="brand-elite">ELITE</span>
            <span className="brand-wealth">&nbsp;WEALTH</span>
          </div>
          <div className="client-portal-nav-links">
            <button className="client-portal-nav-link active">Dashboard</button>
            <button className="client-portal-nav-link">Documents</button>
            <button className="client-portal-nav-link">Portfolio</button>
            <button className="client-portal-nav-link">Messages</button>
          </div>
        </div>
        <div className="client-portal-header-right">
          <button className="client-portal-bell">
            <span className="material-icons-outlined">notifications</span>
            <span className="client-portal-bell-badge" />
          </button>
          <div className="client-portal-avatar">
            {DEMO_CLIENT.firstName[0]}{DEMO_CLIENT.lastName[0]}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="client-portal-layout">
        {/* Sidebar */}
        <aside className="client-portal-sidebar">
          <div className="adviser-card">
            <div className="adviser-card-header">
              <div className="adviser-avatar">{DEMO_ADVISER.initials}</div>
              <div>
                <div className="adviser-card-name">{DEMO_ADVISER.name}</div>
                <div className="adviser-card-title">{DEMO_ADVISER.title}</div>
              </div>
            </div>
            <div className="adviser-card-details">
              <div className="adviser-card-row">
                <span className="material-icons-outlined">email</span>
                {DEMO_ADVISER.email}
              </div>
              <div className="adviser-card-row">
                <span className="material-icons-outlined">phone</span>
                {DEMO_ADVISER.phone}
              </div>
            </div>
          </div>

          <div className="sidebar-quick-links">
            <h3>Quick Links</h3>
            <div className="sidebar-link">
              <span className="material-icons-outlined">account_balance</span>
              My Portfolio
            </div>
            <div className="sidebar-link">
              <span className="material-icons-outlined">folder</span>
              My Documents
            </div>
            <div className="sidebar-link">
              <span className="material-icons-outlined">calendar_today</span>
              Upcoming Meetings
            </div>
            <div className="sidebar-link">
              <span className="material-icons-outlined">help_outline</span>
              Help & Support
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="client-portal-main">
          <h2 className="client-portal-welcome">
            Welcome, {DEMO_CLIENT.firstName}
          </h2>

          {/* Pending Actions */}
          <div className="portal-actions-grid">
            {PENDING_ACTIONS.map(action => (
              <button
                key={action.id}
                className="portal-action-card"
                onClick={() => {
                  if (action.type === 'view-shared') onViewDoc();
                  else onUploadDoc();
                }}
              >
                <div className="portal-action-icon">
                  <span className="material-icons-outlined">{action.icon}</span>
                </div>
                <div className="portal-action-content">
                  <div className="portal-action-title">{action.title}</div>
                  <div className="portal-action-desc">{action.description}</div>
                </div>
                <div className="portal-action-chevron">
                  <span className="material-icons-outlined">chevron_right</span>
                </div>
              </button>
            ))}
          </div>

          {/* Recent Documents */}
          <div className="portal-recent-docs">
            <div className="portal-recent-docs-header">
              <h3>Recent Documents</h3>
            </div>
            {RECENT_DOCUMENTS.map(doc => (
              <div key={doc.id} className="portal-doc-row">
                <span className="material-icons-outlined">description</span>
                <div className="portal-doc-info">
                  <div className="portal-doc-name">{doc.name}</div>
                  <div className="portal-doc-date">{doc.date}</div>
                </div>
                <span className={`portal-doc-badge ${doc.status}`}>
                  {doc.statusLabel}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
