'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { NotesButton } from '@/components/GlobalNotes';
import { useNotificationCenter } from '@/components/NotificationCenter';
import { useCommFlows } from '@/contexts/CommFlowsContext';
import {
  Notification,
  NotificationNature,
  CommtypeId,
  ClientNotification,
  COMMTYPES,
} from '@/types/communications';
import {
  getAdviserNotifications,
  getUnreadAdviserNotificationCount,
  getNotificationsGroupedByDate,
  MOCK_NOTIFICATIONS,
} from '../mock-data';
import '../comms-hub.css';

// =============================================================================
// TYPES
// =============================================================================

type ViewTab = 'client' | 'adviser';
type NatureFilter = 'all' | NotificationNature;
type ReadFilter = 'all' | 'unread' | 'read';

// =============================================================================
// RELATIVE TIME HELPER
// =============================================================================

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function NotificationsPage() {
  const router = useRouter();
  const { startFlow } = useCommFlows();
  const {
    notifications: clientNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    unreadCount: clientUnreadCount,
  } = useNotificationCenter();

  // View tab
  const [activeView, setActiveView] = useState<ViewTab>('client');

  // Client view filters
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [clientReadFilter, setClientReadFilter] = useState<ReadFilter>('unread');

  // Adviser view filters
  const [natureFilter, setNatureFilter] = useState<NatureFilter>('all');
  const [adviserReadFilter, setAdviserReadFilter] = useState<ReadFilter>('all');
  const [commtypeFilter, setCommtypeFilter] = useState<CommtypeId | 'all'>('all');

  // Adviser data
  const adviserUnreadCount = getUnreadAdviserNotificationCount();
  const allAdviserNotifications = getAdviserNotifications();

  // ---------------------------------------------------------------------------
  // CLIENT VIEW FILTERING
  // ---------------------------------------------------------------------------

  const clientOptions = Array.from(
    new Map(clientNotifications.map(n => [n.clientId, n.clientName])).entries()
  ).sort((a, b) => a[1].localeCompare(b[1]));

  let clientFiltered = selectedClientId === 'all'
    ? clientNotifications
    : clientNotifications.filter(n => n.clientId === selectedClientId);

  if (clientReadFilter === 'unread') {
    clientFiltered = clientFiltered.filter(n => !n.read);
  } else if (clientReadFilter === 'read') {
    clientFiltered = clientFiltered.filter(n => n.read);
  }

  const filteredClientNotifs = clientSearch.trim()
    ? clientFiltered.filter(n =>
        n.title.toLowerCase().includes(clientSearch.toLowerCase()) ||
        n.subtitle.toLowerCase().includes(clientSearch.toLowerCase())
      )
    : clientFiltered;

  // ---------------------------------------------------------------------------
  // ADVISER VIEW FILTERING
  // ---------------------------------------------------------------------------

  const filteredAdviserNotifs = useMemo(() => {
    return allAdviserNotifications.filter(n => {
      if (natureFilter !== 'all' && n.nature !== natureFilter) return false;
      if (adviserReadFilter === 'unread' && n.read) return false;
      if (adviserReadFilter === 'read' && !n.read) return false;
      if (commtypeFilter !== 'all' && n.commtypeId !== commtypeFilter) return false;
      return true;
    });
  }, [allAdviserNotifications, natureFilter, adviserReadFilter, commtypeFilter]);

  const groupedAdviserNotifs = useMemo(() => {
    return getNotificationsGroupedByDate(filteredAdviserNotifs);
  }, [filteredAdviserNotifs]);

  const transactionalCount = allAdviserNotifications.filter(n => n.nature === 'transactional').length;
  const informationalCount = allAdviserNotifications.filter(n => n.nature === 'informational').length;

  const hasActiveAdviserFilters = natureFilter !== 'all' || adviserReadFilter !== 'all' || commtypeFilter !== 'all';

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleNewNotification = () => {
    startFlow({
      commType: 'in-app',
      onComplete: (result) => {
        if (result.success && result.data.recipients.length > 0) {
          result.data.recipients.forEach((client, i) => {
            const notif: ClientNotification = {
              id: `cn-new-${Date.now()}-${i}`,
              clientId: client.id,
              clientName: `${client.firstName} ${client.lastName}`,
              icon: 'notifications_none',
              title: result.data.subject || 'New notification',
              subtitle: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }),
              adviserName: 'Rassie du Preez',
              adviserInitial: 'R',
              read: false,
              createdAt: new Date(),
            };
            addNotification(notif);
          });
        }
      },
    });
  };

  const handleAdviserMarkAllRead = () => {
    MOCK_NOTIFICATIONS.forEach(n => {
      if (n.audience === 'adviser') n.read = true;
    });
    setAdviserReadFilter(adviserReadFilter);
  };

  const handleAdviserNotifClick = (notification: Notification) => {
    const found = MOCK_NOTIFICATIONS.find(n => n.id === notification.id);
    if (found) found.read = true;
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    } else if (notification.communicationId) {
      router.push(`/comms-hub/communication/${notification.communicationId}`);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  const unreadNotifCount = clientUnreadCount + adviserUnreadCount;
  const hasActiveClientFilters = selectedClientId !== 'all' || clientReadFilter !== 'all';

  return (
    <AppLayout>
      <div className="comms-dashboard">
        {/* Page Header — standard pattern */}
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
          <Link href="/comms-hub/notifications" className="tab active">
            Notifications
            {unreadNotifCount > 0 && (
              <span className="tab-badge">{unreadNotifCount}</span>
            )}
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
        </nav>

        {/* Section Card */}
        <div className="section-card">
          {/* Section Header — title + actions */}
          <div className="section-card-header">
            <h2 className="section-card-title">Notification Center</h2>
            <div className="section-card-actions">
              {activeView === 'client' && (
                <button className="btn btn-primary" onClick={handleNewNotification}>
                  <span className="material-icons-outlined">add</span>
                  New Notification
                </button>
              )}
              {activeView === 'client' && clientUnreadCount > 0 && (
                <button className="btn btn-secondary" onClick={markAllAsRead}>
                  <span className="material-icons-outlined icon-sm">done_all</span>
                  Mark All Read
                </button>
              )}
              {activeView === 'adviser' && adviserUnreadCount > 0 && (
                <button className="btn btn-secondary" onClick={handleAdviserMarkAllRead}>
                  <span className="material-icons-outlined icon-sm">done_all</span>
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* View Tabs — below header, inside card */}
          <div className="notif-center-tabs">
            <button
              className={`notif-center-tab ${activeView === 'client' ? 'active' : ''}`}
              onClick={() => setActiveView('client')}
            >
              <span className="material-icons-outlined icon-sm">person</span>
              Client View
            </button>
            <button
              className={`notif-center-tab ${activeView === 'adviser' ? 'active' : ''}`}
              onClick={() => setActiveView('adviser')}
            >
              <span className="material-icons-outlined icon-sm">admin_panel_settings</span>
              Your View
            </button>
          </div>

          {/* ================================================================= */}
          {/* CLIENT VIEW                                                       */}
          {/* ================================================================= */}
          {activeView === 'client' && (
            <>
              {/* Toolbar — same pattern as Communications page */}
              <div className="section-card-content">
                <div className="section-card-toolbar">
                  <div className="filter-bar-inline">
                    <span className="filter-label">Filter:</span>

                    {/* Client dropdown */}
                    <div className="filter-dropdown-group">
                      <button className={`filter-dropdown ${selectedClientId !== 'all' ? 'has-value' : ''}`}>
                        Client
                        <span className="material-icons-outlined">expand_more</span>
                      </button>
                      <div className="filter-dropdown-menu">
                        <button className={selectedClientId === 'all' ? 'active' : ''} onClick={() => setSelectedClientId('all')}>All Clients</button>
                        {clientOptions.map(([id, name]) => (
                          <button key={id} className={selectedClientId === id ? 'active' : ''} onClick={() => setSelectedClientId(id)}>
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active filter chips */}
                    {selectedClientId !== 'all' && (
                      <span className="filter-chip type">
                        {clientOptions.find(([id]) => id === selectedClientId)?.[1] || selectedClientId}
                        <button onClick={() => setSelectedClientId('all')} className="chip-clear">&times;</button>
                      </span>
                    )}
                    {clientReadFilter !== 'all' && (
                      <span className="filter-chip type">
                        {clientReadFilter === 'unread' ? 'Unread' : 'Read'}
                        <button onClick={() => setClientReadFilter('all')} className="chip-clear">&times;</button>
                      </span>
                    )}
                    {hasActiveClientFilters && (
                      <button className="filter-chip clear-all" onClick={() => { setSelectedClientId('all'); setClientReadFilter('all'); setClientSearch(''); }}>
                        Clear all
                        <span className="chip-clear">&times;</span>
                      </button>
                    )}
                  </div>

                  {/* Right side: search + read toggle */}
                  <div className="search-container">
                    <span className="material-icons-outlined search-icon">search</span>
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="search-input"
                    />
                    {clientSearch && (
                      <button className="search-clear" onClick={() => setClientSearch('')} title="Clear search">
                        <span className="material-icons-outlined">close</span>
                      </button>
                    )}
                  </div>

                  <div className="notif-read-filter">
                    {(['unread', 'all', 'read'] as ReadFilter[]).map((f) => (
                      <button
                        key={f}
                        className={`notif-read-filter-btn ${clientReadFilter === f ? 'active' : ''}`}
                        onClick={() => setClientReadFilter(f)}
                      >
                        {f === 'unread' ? 'Unread' : f === 'all' ? 'All' : 'Read'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Client Notification List */}
              <div className="section-card-content">
                {filteredClientNotifs.length === 0 ? (
                  <div className="empty-state-card">
                    <span className="material-icons-outlined">notifications_none</span>
                    <p>No notifications match your filters</p>
                  </div>
                ) : (
                  <div className="notif-center-list" style={{ gap: 0 }}>
                    {filteredClientNotifs.map((notif) => (
                      <div
                        key={notif.id}
                        className={`notif-card ${notif.read ? 'notif-card-read' : 'notif-card-unread'}`}
                        onClick={() => { if (!notif.read) markAsRead(notif.id); }}
                        style={{ cursor: notif.read ? 'default' : 'pointer' }}
                      >
                        {/* Unread indicator */}
                        <div className="notif-card-indicator">
                          {!notif.read && <span className="notif-unread-dot" />}
                        </div>

                        {/* Type Icon */}
                        <div className="notif-card-icon">
                          <span className="material-icons-outlined">{notif.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="notif-card-content">
                          <p className="notif-card-title">{notif.title}</p>
                          <p className="notif-card-subtitle">
                            {notif.subtitle}
                            {notif.adviserName && <span className="notif-card-adviser-name"> &middot; {notif.adviserName}</span>}
                          </p>
                        </div>

                        {/* Client name badge */}
                        <div style={{ flexShrink: 0, marginRight: 'var(--spacing-sm)' }}>
                          <span style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-muted)',
                            backgroundColor: 'var(--color-surface-secondary)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}>
                            {notif.clientName}
                          </span>
                        </div>

                        {/* CTA button */}
                        {notif.actionLabel && (
                          <div className="notif-card-actions">
                            <button className="notif-card-cta" onClick={(e) => { e.stopPropagation(); }}>
                              {notif.actionLabel}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================================================================= */}
          {/* ADVISER VIEW                                                      */}
          {/* ================================================================= */}
          {activeView === 'adviser' && (
            <>
              {/* Summary Cards */}
              <div className="section-card-summary">
                <div className="summary-cards-grid cols-4">
                  <button
                    className={`summary-card-ref clickable ${adviserReadFilter === 'unread' ? 'active' : ''}`}
                    onClick={() => setAdviserReadFilter(adviserReadFilter === 'unread' ? 'all' : 'unread')}
                  >
                    <span className="summary-card-ref-label">Unread</span>
                    <span className="summary-card-ref-value">{adviserUnreadCount}</span>
                  </button>
                  <button
                    className={`summary-card-ref clickable ${natureFilter === 'transactional' ? 'active' : ''}`}
                    onClick={() => setNatureFilter(natureFilter === 'transactional' ? 'all' : 'transactional')}
                  >
                    <span className="summary-card-ref-label">Action Required</span>
                    <span className="summary-card-ref-value">{transactionalCount}</span>
                  </button>
                  <button
                    className={`summary-card-ref clickable ${natureFilter === 'informational' ? 'active' : ''}`}
                    onClick={() => setNatureFilter(natureFilter === 'informational' ? 'all' : 'informational')}
                  >
                    <span className="summary-card-ref-label">Informational</span>
                    <span className="summary-card-ref-value">{informationalCount}</span>
                  </button>
                  <button
                    className={`summary-card-ref clickable ${adviserReadFilter === 'read' ? 'active' : ''}`}
                    onClick={() => setAdviserReadFilter(adviserReadFilter === 'read' ? 'all' : 'read')}
                  >
                    <span className="summary-card-ref-label">Read</span>
                    <span className="summary-card-ref-value">{allAdviserNotifications.filter(n => n.read).length}</span>
                  </button>
                </div>
              </div>

              {/* Filter bar — same pattern as Communications page */}
              <div className="section-card-content">
                <div className="section-card-toolbar">
                  <div className="filter-bar-inline">
                    <span className="filter-label">Filter:</span>
                    <div className="filter-dropdown-group">
                      <button className={`filter-dropdown ${commtypeFilter !== 'all' ? 'has-value' : ''}`}>
                        Type
                        <span className="material-icons-outlined">expand_more</span>
                      </button>
                      <div className="filter-dropdown-menu">
                        <button className={commtypeFilter === 'all' ? 'active' : ''} onClick={() => setCommtypeFilter('all')}>All Types</button>
                        {(Object.keys(COMMTYPES) as CommtypeId[]).map(id => (
                          <button key={id} className={commtypeFilter === id ? 'active' : ''} onClick={() => setCommtypeFilter(id)}>
                            {COMMTYPES[id].name}
                          </button>
                        ))}
                      </div>
                    </div>
                    {natureFilter !== 'all' && (
                      <span className="filter-chip type">
                        {natureFilter === 'transactional' ? 'Action Required' : 'Informational'}
                        <button onClick={() => setNatureFilter('all')} className="chip-clear">&times;</button>
                      </span>
                    )}
                    {adviserReadFilter !== 'all' && (
                      <span className="filter-chip type">
                        {adviserReadFilter === 'unread' ? 'Unread' : 'Read'}
                        <button onClick={() => setAdviserReadFilter('all')} className="chip-clear">&times;</button>
                      </span>
                    )}
                    {commtypeFilter !== 'all' && (
                      <span className="filter-chip type">
                        {COMMTYPES[commtypeFilter].name}
                        <button onClick={() => setCommtypeFilter('all')} className="chip-clear">&times;</button>
                      </span>
                    )}
                    {hasActiveAdviserFilters && (
                      <button className="filter-chip clear-all" onClick={() => { setNatureFilter('all'); setAdviserReadFilter('all'); setCommtypeFilter('all'); }}>
                        Clear all
                        <span className="chip-clear">&times;</span>
                      </button>
                    )}
                  </div>

                  <div className="search-container">
                    <span className="material-icons-outlined search-icon">search</span>
                    <input
                      type="text"
                      placeholder="Search by client name..."
                      className="search-input"
                      disabled
                    />
                  </div>
                </div>

                {/* Adviser Notification List — grouped by date */}
                <div className="notif-list">
                  {groupedAdviserNotifs.map(group => (
                    <div key={group.label} className="notif-group">
                      <div className="notif-group-label">{group.label}</div>
                      {group.notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`notif-item ${!notif.read ? 'unread' : ''} ${notif.nature === 'transactional' ? 'transactional' : ''}`}
                          onClick={() => handleAdviserNotifClick(notif)}
                        >
                          <div className="notif-item-indicator">
                            {!notif.read && <span className="notif-unread-dot" />}
                          </div>
                          <div className={`notif-item-icon ${notif.nature}`}>
                            <span className="material-icons-outlined">
                              {notif.nature === 'transactional' ? 'task_alt' : 'info'}
                            </span>
                          </div>
                          <div className="notif-item-content">
                            <div className="notif-item-title">{notif.title}</div>
                            {notif.body && <div className="notif-item-body">{notif.body}</div>}
                            <div className="notif-item-meta">
                              <span className={`notif-nature-badge ${notif.nature}`}>
                                {notif.nature === 'transactional' ? 'Action Required' : 'Info'}
                              </span>
                              <span className="notif-item-type">{notif.commtypeName}</span>
                              <span className="notif-item-time">{formatRelativeTime(notif.createdAt)}</span>
                            </div>
                          </div>
                          {notif.nature === 'transactional' && notif.actionLabel && !notif.actioned && (
                            <div className="notif-item-action">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={(e) => { e.stopPropagation(); handleAdviserNotifClick(notif); }}
                              >
                                {notif.actionLabel}
                              </button>
                            </div>
                          )}
                          <div className="notif-item-chevron">
                            <span className="material-icons-outlined">chevron_right</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  {filteredAdviserNotifs.length === 0 && (
                    <div className="empty-state-card">
                      <span className="material-icons-outlined">notifications_none</span>
                      <p>No notifications match your filters</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
