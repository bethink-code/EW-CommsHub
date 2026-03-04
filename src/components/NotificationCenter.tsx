'use client';

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientNotification, Notification } from '@/types/communications';
import { MOCK_CLIENT_NOTIFICATIONS, getAdviserNotifications } from '@/app/comms-hub/mock-data';
import { useCommFlows } from '@/contexts/CommFlowsContext';

// =============================================================================
// CONTEXT
// =============================================================================

interface NotificationCenterContextType {
  isOpen: boolean;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  notifications: ClientNotification[];
  addNotification: (notif: ClientNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationCenterContext = createContext<NotificationCenterContextType | null>(null);

export function useNotificationCenter() {
  const context = useContext(NotificationCenterContext);
  if (!context) {
    throw new Error('useNotificationCenter must be used within a NotificationCenterProvider');
  }
  return context;
}

// =============================================================================
// PROVIDER
// =============================================================================

export function NotificationCenterProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ClientNotification[]>(MOCK_CLIENT_NOTIFICATIONS);

  const openNotificationCenter = useCallback(() => setIsOpen(true), []);
  const closeNotificationCenter = useCallback(() => setIsOpen(false), []);

  const addNotification = useCallback((notif: ClientNotification) => {
    setNotifications(prev => [notif, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationCenterContext.Provider value={{
      isOpen,
      openNotificationCenter,
      closeNotificationCenter,
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      unreadCount,
    }}>
      {children}
    </NotificationCenterContext.Provider>
  );
}

// =============================================================================
// BELL BUTTON (for use in nav bar)
// =============================================================================

export function NotificationBell() {
  const { openNotificationCenter, unreadCount } = useNotificationCenter();

  return (
    <button
      onClick={openNotificationCenter}
      className="notif-bell-btn"
      title="Notifications"
    >
      <span className="material-icons-outlined">notifications</span>
      {unreadCount > 0 && (
        <span className="notif-bell-badge">{unreadCount}</span>
      )}
    </button>
  );
}

// =============================================================================
// NOTIFICATION CENTER PANEL
// =============================================================================

type PanelTab = 'client' | 'adviser';
type ReadFilter = 'unread' | 'all' | 'read';

export function NotificationCenterPanel() {
  const { isOpen, closeNotificationCenter, notifications, addNotification, markAsRead, markAllAsRead, unreadCount } = useNotificationCenter();
  const { startFlow } = useCommFlows();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<PanelTab>('client');
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<ReadFilter>('unread');

  const handleNewNotification = () => {
    closeNotificationCenter();
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

  // Derive unique clients for dropdown
  const clientOptions = Array.from(
    new Map(notifications.map(n => [n.clientId, n.clientName])).entries()
  ).sort((a, b) => a[1].localeCompare(b[1]));

  // Client view: filter by client → read status → search
  let clientFiltered = selectedClientId === 'all'
    ? notifications
    : notifications.filter(n => n.clientId === selectedClientId);

  if (readFilter === 'unread') {
    clientFiltered = clientFiltered.filter(n => !n.read);
  } else if (readFilter === 'read') {
    clientFiltered = clientFiltered.filter(n => n.read);
  }

  const filteredClientNotifs = searchQuery.trim()
    ? clientFiltered.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clientFiltered;

  // Adviser view: get adviser notifications, filter by search
  const adviserNotifs = getAdviserNotifications();
  const filteredAdviserNotifs = searchQuery.trim()
    ? adviserNotifs.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.body || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.clientName || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : adviserNotifs;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="notif-center-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeNotificationCenter}
          />

          {/* Panel */}
          <motion.div
            className="notif-center-panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="notif-center-header">
              <h2 className="notif-center-title">Notifications</h2>
              <div className="notif-center-header-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleNewNotification}
                >
                  <span className="material-icons-outlined icon-sm">add</span>
                  New Notification
                </button>
                <button className="notif-center-close" onClick={closeNotificationCenter}>
                  <span className="material-icons-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="notif-center-tabs">
              <button
                className={`notif-center-tab ${activeTab === 'client' ? 'active' : ''}`}
                onClick={() => setActiveTab('client')}
              >
                <span className="material-icons-outlined icon-sm">person</span>
                Client View
              </button>
              <button
                className={`notif-center-tab ${activeTab === 'adviser' ? 'active' : ''}`}
                onClick={() => setActiveTab('adviser')}
              >
                <span className="material-icons-outlined icon-sm">admin_panel_settings</span>
                Your View
              </button>
            </div>

            {/* Client Filter (Client View only) */}
            {activeTab === 'client' && (
              <div className="notif-center-client-filter">
                <span className="material-icons-outlined notif-filter-icon">person</span>
                <select
                  className="notif-filter-select"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                >
                  <option value="all">All Clients</option>
                  {clientOptions.map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Toolbar: search, read filter, mark all */}
            <div className="notif-center-toolbar">
              <div className="notif-center-search">
                <span className="material-icons-outlined notif-center-search-icon">search</span>
                <input
                  type="text"
                  className="notif-center-search-input"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {activeTab === 'client' && (
                <div className="notif-center-filter-row">
                  <div className="notif-read-filter">
                    {(['unread', 'all', 'read'] as ReadFilter[]).map((f) => (
                      <button
                        key={f}
                        className={`notif-read-filter-btn ${readFilter === f ? 'active' : ''}`}
                        onClick={() => setReadFilter(f)}
                      >
                        {f === 'unread' ? 'Unread' : f === 'all' ? 'All' : 'Read'}
                      </button>
                    ))}
                  </div>
                  {unreadCount > 0 && (
                    <button className="notif-mark-all-read" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Notification List */}
            <div className="notif-center-body">
              {activeTab === 'client' ? (
                // CLIENT VIEW — What the client sees
                filteredClientNotifs.length === 0 ? (
                  <div className="notif-center-empty">
                    <span className="material-icons-outlined" style={{ fontSize: 48, color: 'var(--text-disabled)' }}>
                      notifications_none
                    </span>
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="notif-center-list">
                    {filteredClientNotifs.map((notif) => (
                      <ClientNotificationCard key={notif.id} notification={notif} onMarkRead={markAsRead} />
                    ))}
                  </div>
                )
              ) : (
                // ADVISER VIEW — What the adviser sees
                filteredAdviserNotifs.length === 0 ? (
                  <div className="notif-center-empty">
                    <span className="material-icons-outlined" style={{ fontSize: 48, color: 'var(--text-disabled)' }}>
                      notifications_none
                    </span>
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="notif-center-list">
                    {filteredAdviserNotifs.map((notif) => (
                      <AdviserNotificationCard key={notif.id} notification={notif} />
                    ))}
                  </div>
                )
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// CLIENT NOTIFICATION CARD (what the client sees)
// =============================================================================

function ClientNotificationCard({ notification, onMarkRead }: { notification: ClientNotification; onMarkRead: (id: string) => void }) {
  const { id, title, icon, subtitle, adviserName, adviserInitial, actionLabel, read } = notification;

  const handleClick = () => {
    if (!read) onMarkRead(id);
  };

  return (
    <div
      className={`notif-card ${read ? 'notif-card-read' : 'notif-card-unread'}`}
      onClick={handleClick}
      style={{ cursor: read ? 'default' : 'pointer' }}
    >
      {/* Unread indicator */}
      <div className="notif-card-indicator">
        {!read && <span className="notif-unread-dot" />}
      </div>

      {/* Type Icon */}
      <div className="notif-card-icon">
        <span className="material-icons-outlined">{icon}</span>
      </div>

      {/* Content */}
      <div className="notif-card-content">
        <p className="notif-card-title">{title}</p>
        <p className="notif-card-subtitle">
          {subtitle}
          {adviserName && <span className="notif-card-adviser-name"> &middot; {adviserName}</span>}
        </p>
      </div>

      {/* Right side: CTA button */}
      {actionLabel && (
        <div className="notif-card-actions">
          <button className="notif-card-cta" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ADVISER NOTIFICATION CARD (what the adviser sees)
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

function AdviserNotificationCard({ notification }: { notification: Notification }) {
  const { title, body, clientName, commtypeName, nature, read, actionLabel, actioned, createdAt } = notification;

  return (
    <div className={`notif-card notif-card-adviser ${!read ? 'notif-card-unread' : ''}`}>
      {/* Unread indicator */}
      <div className="notif-card-indicator">
        {!read && <span className="notif-unread-dot" />}
      </div>

      {/* Nature icon */}
      <div className={`notif-card-icon ${nature === 'transactional' ? 'notif-card-icon-action' : ''}`}>
        <span className="material-icons-outlined">
          {nature === 'transactional' ? 'task_alt' : 'info'}
        </span>
      </div>

      {/* Content */}
      <div className="notif-card-content">
        <p className="notif-card-title">{title}</p>
        {body && <p className="notif-card-body">{body}</p>}
        <div className="notif-card-meta">
          {nature === 'transactional' && (
            <span className="notif-badge-action">Action Required</span>
          )}
          {nature === 'informational' && (
            <span className="notif-badge-info">Info</span>
          )}
          {commtypeName && <span className="notif-card-type">{commtypeName}</span>}
          <span className="notif-card-time">{formatRelativeTime(createdAt)}</span>
        </div>
      </div>

      {/* Action button for transactional */}
      {nature === 'transactional' && actionLabel && !actioned && (
        <button className="notif-card-cta">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// =============================================================================
// COMBINED EXPORT
// =============================================================================

export function NotificationCenter() {
  return <NotificationCenterPanel />;
}

export default NotificationCenter;
