'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { NotesButton } from '@/components/GlobalNotes';
import { useCommFlows } from '@/contexts/CommFlowsContext';
import {
  Notification,
  NotificationNature,
  CommtypeId,
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

type NatureFilter = 'all' | NotificationNature;
type ReadFilter = 'all' | 'unread' | 'read';

// =============================================================================
// COMPONENT
// =============================================================================

export default function NotificationsPage() {
  const router = useRouter();
  const { startFlow } = useCommFlows();

  // Filter state
  const [natureFilter, setNatureFilter] = useState<NatureFilter>('all');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [commtypeFilter, setCommtypeFilter] = useState<CommtypeId | 'all'>('all');

  // Stats
  const unreadCount = getUnreadAdviserNotificationCount();
  const allAdviserNotifications = getAdviserNotifications();

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return allAdviserNotifications.filter(n => {
      if (natureFilter !== 'all' && n.nature !== natureFilter) return false;
      if (readFilter === 'unread' && n.read) return false;
      if (readFilter === 'read' && !n.read) return false;
      if (commtypeFilter !== 'all' && n.commtypeId !== commtypeFilter) return false;
      return true;
    });
  }, [allAdviserNotifications, natureFilter, readFilter, commtypeFilter]);

  // Grouped by date
  const groupedNotifications = useMemo(() => {
    return getNotificationsGroupedByDate(filteredNotifications);
  }, [filteredNotifications]);

  // Stats for filters
  const transactionalCount = allAdviserNotifications.filter(n => n.nature === 'transactional').length;
  const informationalCount = allAdviserNotifications.filter(n => n.nature === 'informational').length;

  const hasActiveFilters = natureFilter !== 'all' || readFilter !== 'all' || commtypeFilter !== 'all';

  const clearFilters = () => {
    setNatureFilter('all');
    setReadFilter('all');
    setCommtypeFilter('all');
  };

  // Mark all as read (mock — would mutate real state)
  const handleMarkAllRead = () => {
    MOCK_NOTIFICATIONS.forEach(n => {
      if (n.audience === 'adviser') n.read = true;
    });
    // Force re-render (in real app, this would go through state management)
    setReadFilter(readFilter);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    const found = MOCK_NOTIFICATIONS.find(n => n.id === notification.id);
    if (found) found.read = true;

    // Navigate to the parent communication
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    } else if (notification.communicationId) {
      router.push(`/comms-hub/communication/${notification.communicationId}`);
    }
  };

  // Format time for display
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <AppLayout>
      <div className="comms-dashboard">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Alerts</h1>
            <div className="page-header-stats">
              <span className="header-stat">
                <span className="header-stat-value">{allAdviserNotifications.length}</span> total
              </span>
              {unreadCount > 0 && (
                <span className="header-stat attention">
                  <span className="header-stat-value">{unreadCount}</span> unread
                </span>
              )}
            </div>
          </div>
          <div className="page-header-right">
            <NotesButton />
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="tabs">
          <Link href="/comms-hub" className="tab">
            Communications
          </Link>
          <Link href="/comms-hub/notifications" className="tab active">
            Alerts
            {unreadCount > 0 && (
              <span className="tab-badge">{unreadCount}</span>
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

        {/* Main Section Card */}
        <div className="section-card">
          {/* Section Header */}
          <div className="section-card-header">
            <h2 className="section-card-title">Your Alerts</h2>
            <div className="section-card-actions">
              {unreadCount > 0 && (
                <button className="btn btn-secondary" onClick={handleMarkAllRead}>
                  <span className="material-icons-outlined">done_all</span>
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="section-card-summary">
            <div className="summary-cards-grid cols-4">
              <button
                className={`summary-card-ref clickable ${readFilter === 'unread' ? 'active' : ''}`}
                onClick={() => setReadFilter(readFilter === 'unread' ? 'all' : 'unread')}
              >
                <span className="summary-card-ref-label">Unread</span>
                <span className="summary-card-ref-value">{unreadCount}</span>
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
                className={`summary-card-ref clickable ${readFilter === 'read' ? 'active' : ''}`}
                onClick={() => setReadFilter(readFilter === 'read' ? 'all' : 'read')}
              >
                <span className="summary-card-ref-label">Read</span>
                <span className="summary-card-ref-value">{allAdviserNotifications.filter(n => n.read).length}</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="section-card-content">
            {/* Filter bar */}
            <div className="section-card-toolbar">
              <div className="filter-bar-inline">
                <span className="filter-label">Filter:</span>

                {/* Commtype filter */}
                <div className="filter-dropdown-group">
                  <button
                    className={`filter-dropdown ${commtypeFilter !== 'all' ? 'has-value' : ''}`}
                  >
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

                {/* Active Filter Chips */}
                {natureFilter !== 'all' && (
                  <span className="filter-chip type">
                    {natureFilter === 'transactional' ? 'Action Required' : 'Informational'}
                    <button onClick={() => setNatureFilter('all')} className="chip-clear">&times;</button>
                  </span>
                )}
                {readFilter !== 'all' && (
                  <span className="filter-chip type">
                    {readFilter === 'unread' ? 'Unread' : 'Read'}
                    <button onClick={() => setReadFilter('all')} className="chip-clear">&times;</button>
                  </span>
                )}
                {commtypeFilter !== 'all' && (
                  <span className="filter-chip type">
                    {COMMTYPES[commtypeFilter].name}
                    <button onClick={() => setCommtypeFilter('all')} className="chip-clear">&times;</button>
                  </span>
                )}
                {hasActiveFilters && (
                  <button className="filter-chip clear-all" onClick={clearFilters}>
                    Clear all
                    <span className="chip-clear">&times;</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notification List — grouped by date */}
            <div className="notif-list">
              {groupedNotifications.map(group => (
                <div key={group.label} className="notif-group">
                  <div className="notif-group-label">{group.label}</div>
                  {group.notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`notif-item ${!notif.read ? 'unread' : ''} ${notif.nature === 'transactional' ? 'transactional' : ''}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      {/* Unread dot */}
                      <div className="notif-item-indicator">
                        {!notif.read && <span className="notif-unread-dot" />}
                      </div>

                      {/* Icon */}
                      <div className={`notif-item-icon ${notif.nature}`}>
                        <span className="material-icons-outlined">
                          {notif.nature === 'transactional' ? 'task_alt' : 'info'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="notif-item-content">
                        <div className="notif-item-title">{notif.title}</div>
                        {notif.body && (
                          <div className="notif-item-body">{notif.body}</div>
                        )}
                        <div className="notif-item-meta">
                          <span className={`notif-nature-badge ${notif.nature}`}>
                            {notif.nature === 'transactional' ? 'Action Required' : 'Info'}
                          </span>
                          <span className="notif-item-type">{notif.commtypeName}</span>
                          <span className="notif-item-time">{formatTime(notif.createdAt)}</span>
                        </div>
                      </div>

                      {/* Action button (transactional only) */}
                      {notif.nature === 'transactional' && notif.actionLabel && !notif.actioned && (
                        <div className="notif-item-action">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notif);
                            }}
                          >
                            {notif.actionLabel}
                          </button>
                        </div>
                      )}

                      {/* Chevron */}
                      <div className="notif-item-chevron">
                        <span className="material-icons-outlined">chevron_right</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="empty-state-card">
                  <span className="material-icons-outlined">notifications_none</span>
                  <p>No alerts match your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
