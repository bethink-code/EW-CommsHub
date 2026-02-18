'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/AppLayout';
import {
  Communication,
  COMMTYPES,
  CHANNELS,
  HEALTH_CONFIG,
  Notification,
  getStageIndex,
  getClientDisplayName,
  isTerminalStage,
} from '@/types/communications';
import { MOCK_COMMUNICATIONS, getNotificationsForComm, getUnreadAdviserNotificationCount } from '../../mock-data';
import '../../comms-hub.css';
import './detail.css';

// =============================================================================
// TAB TYPES
// =============================================================================

// =============================================================================
// HELPER: Get badge class for stage
// =============================================================================

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getFirstSentAt(comm: Communication): Date | undefined {
  return comm.channelStatus.find(s => s.sentAt)?.sentAt;
}

function getFirstDeliveredAt(comm: Communication): Date | undefined {
  return comm.channelStatus.find(s => s.deliveredAt)?.deliveredAt;
}

function getFirstOpenedAt(comm: Communication): Date | undefined {
  return comm.channelStatus.find(s => s.openedAt)?.openedAt;
}

function formatChannelsList(comm: Communication): string {
  return comm.channels.map(ch => CHANNELS[ch].label).join(', ');
}

// =============================================================================
// ACTIVITY EVENTS
// =============================================================================

interface ActivityEvent {
  id: string;
  timestamp?: Date;
  icon: string;
  iconClass: string;
  description: string;
  viewMessageContent?: {
    subject?: string;
    body: string;
    channel?: string;
  };
  // Notification data (when this event is a notification)
  notification?: Notification;
}

function getMessageBodyForCommtype(comm: Communication): string {
  const clientName = comm.client.firstName;

  switch (comm.commtype) {
    case 'document-request':
      return `Dear ${clientName},

We hope this message finds you well.

As part of our ongoing commitment to maintaining accurate records and ensuring compliance with regulatory requirements, we kindly request that you provide the following documentation:

• ${comm.subject || 'Required documents'}

Please upload the requested documents through our secure portal at your earliest convenience.

Thank you for your prompt attention to this matter.

Kind regards,
Elite Wealth Advisory Team`;

    case 'onboarding':
      return `Dear ${clientName},

Welcome to Elite Wealth! We're delighted to have you join us.

To complete your onboarding process, please follow the link below to access your personalized onboarding portal.

You'll be guided through a few simple steps to verify your identity, complete your investor profile, and sign required agreements.

We look forward to supporting your financial journey.

Warm regards,
Elite Wealth Advisory Team`;

    case 'wealth-portal':
      return `Dear ${clientName},

Your Elite Wealth Portal is now ready for you to access.

The Wealth Portal gives you 24/7 visibility into your complete financial picture, including portfolio performance, document vault, and secure messaging with your adviser.

Click the link to activate your account.

Best regards,
Elite Wealth Advisory Team`;

    case 'password-reset':
      return `Dear ${clientName},

We received a request to reset your portal password.

Click the link below to set a new password. This link will expire in 24 hours.

If you did not request this change, you can safely ignore this email — your current password will remain unchanged.

Kind regards,
Elite Wealth Advisory Team`;

    default:
      return `Dear ${clientName},

${comm.subject || 'Please see the attached information.'}

If you have any questions, please don't hesitate to contact us.

Kind regards,
Elite Wealth Advisory Team`;
  }
}

function buildActivityEvents(comm: Communication): ActivityEvent[] {
  const events: ActivityEvent[] = [];
  const currentStageIndex = getStageIndex(comm.commtype, comm.stage);
  const commtype = COMMTYPES[comm.commtype];
  const sentAt = getFirstSentAt(comm);
  const deliveredAt = getFirstDeliveredAt(comm);
  const openedAt = getFirstOpenedAt(comm);

  // Add events in reverse chronological order (most recent first)

  // Current stage event (if not a simple transition)
  if (comm.stage === 'opened' && openedAt) {
    events.push({
      id: 'opened',
      timestamp: openedAt,
      icon: 'visibility',
      iconClass: 'opened',
      description: `${getClientDisplayName(comm.client)} opened the message`,
      viewMessageContent: {
        subject: comm.subject || `${COMMTYPES[comm.commtype].name} Request`,
        body: getMessageBodyForCommtype(comm),
        channel: formatChannelsList(comm),
      },
    });
  }

  if (comm.stage === 'uploaded' || currentStageIndex > getStageIndex(comm.commtype, 'uploaded')) {
    events.push({
      id: 'uploaded',
      timestamp: comm.updatedAt,
      icon: 'upload_file',
      iconClass: 'uploaded',
      description: `${getClientDisplayName(comm.client)} uploaded document`,
    });
  }

  if (comm.stage === 'started' && openedAt) {
    events.push({
      id: 'started',
      timestamp: openedAt,
      icon: 'play_circle',
      iconClass: 'opened',
      description: `${getClientDisplayName(comm.client)} started the process`,
    });
  }

  // Check if there was a reminder (if stage includes reminded or past it)
  const remindedStageIndex = commtype.stages.findIndex(s => s.id === 'reminded');
  if (remindedStageIndex >= 0 && currentStageIndex >= remindedStageIndex) {
    const reminderDate = deliveredAt ? new Date(deliveredAt.getTime() + 3 * 24 * 60 * 60 * 1000) : undefined;
    events.push({
      id: 'reminder',
      timestamp: reminderDate,
      icon: 'notifications',
      iconClass: 'reminder',
      description: `Reminder sent via ${formatChannelsList(comm)}`,
      viewMessageContent: {
        subject: `Reminder: ${comm.subject || COMMTYPES[comm.commtype].name}`,
        body: `Dear ${comm.client.firstName},\n\nThis is a friendly reminder regarding our previous request. We noticed that this item is still pending your action.\n\nPlease complete the required action at your earliest convenience.\n\nKind regards,\nElite Wealth`,
        channel: formatChannelsList(comm),
      },
    });
  }

  // Delivery event
  if (deliveredAt) {
    events.push({
      id: 'delivered',
      timestamp: deliveredAt,
      icon: 'check_circle',
      iconClass: 'delivered',
      description: `Delivered to ${comm.client.email || comm.client.phone}`,
    });
  }

  // Sent event
  if (sentAt) {
    events.push({
      id: 'sent',
      timestamp: sentAt,
      icon: 'send',
      iconClass: 'sent',
      description: `Communication sent via ${formatChannelsList(comm)}`,
      viewMessageContent: {
        subject: comm.subject || `${COMMTYPES[comm.commtype].name} Request`,
        body: getMessageBodyForCommtype(comm),
        channel: formatChannelsList(comm),
      },
    });
  }

  // Sort by timestamp (most recent first)
  return events.sort((a, b) => {
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
}

// =============================================================================
// CONTEXTUAL ACTIONS
// =============================================================================

interface ContextualAction {
  id: string;
  label: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'warning';
  condition: (comm: Communication) => boolean;
}

const CONTEXTUAL_ACTIONS: ContextualAction[] = [
  {
    id: 'send-reminder',
    label: 'Send Reminder',
    icon: 'notifications',
    variant: 'warning',
    condition: (c) => ['sent', 'delivered', 'opened', 'started', 'in-progress'].includes(c.stage) && c.health !== 'on-track',
  },
  {
    id: 'mark-complete',
    label: 'Mark Complete',
    icon: 'check_circle',
    variant: 'primary',
    condition: (c) => ['uploaded', 'review', 'responded', 'activated'].includes(c.stage),
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function CommunicationDetail() {
  const params = useParams();
  const router = useRouter();
  const commId = params.id as string;
  const unreadNotifCount = useMemo(() => getUnreadAdviserNotificationCount(), []);

  const communication = useMemo(() => {
    return MOCK_COMMUNICATIONS.find(c => c.id === commId);
  }, [commId]);

  const activityEvents = useMemo(() => {
    if (!communication) return [];
    const events = buildActivityEvents(communication);

    // Merge notification records into the timeline
    const notifications = getNotificationsForComm(communication.id);
    for (const notif of notifications) {
      events.push({
        id: `notif-${notif.id}`,
        timestamp: notif.createdAt,
        icon: notif.nature === 'transactional' ? 'campaign' : 'info',
        iconClass: notif.audience === 'client'
          ? 'notification-client'
          : notif.nature === 'transactional'
            ? 'notification-transactional'
            : 'notification-informational',
        description: notif.title,
        notification: notif,
      });
    }

    // Sort by timestamp (most recent first)
    return events.sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }, [communication]);

  const availableActions = useMemo(() => {
    if (!communication) return [];
    return CONTEXTUAL_ACTIONS.filter(action => action.condition(communication));
  }, [communication]);

  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ActivityEvent | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);


  // Format helpers
  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTimestamp = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Today, ${date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  // Not found state
  if (!communication) {
    return (
      <AppLayout>
        <div className="comms-dashboard">
          <div className="page-header">
            <h1 className="page-title">Communications Hub</h1>
          </div>
          <nav className="tabs">
            <Link href="/comms-hub" className="tab active">Communications</Link>
            <Link href="/comms-hub/notifications" className="tab">
              Alerts
              {unreadNotifCount > 0 && <span className="tab-badge">{unreadNotifCount}</span>}
            </Link>
            <Link href="/comms-hub/relationships" className="tab">Contact Book</Link>
            <Link href="/comms-hub/campaigns" className="tab">Campaigns</Link>
            <Link href="/comms-hub/templates" className="tab">Templates</Link>
            <Link href="/comms-hub/settings" className="tab">Settings</Link>
          </nav>
          <div className="detail-page">
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <span className="material-icons-outlined" style={{ fontSize: '48px', color: 'var(--color-text-muted)' }}>
                error_outline
              </span>
              <h2 style={{ marginTop: 'var(--spacing-base)' }}>Communication Not Found</h2>
              <p className="text-muted">The communication you're looking for doesn't exist.</p>
              <Link href="/comms-hub" className="btn btn-primary" style={{ marginTop: 'var(--spacing-base)' }}>
                Back to Hub
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const commtype = COMMTYPES[communication.commtype];
  const healthConfig = HEALTH_CONFIG[communication.health];
  const currentStageIndex = getStageIndex(communication.commtype, communication.stage);

  // Action handler
  const handleAction = async (actionId: string) => {
    setIsActionLoading(actionId);
    await new Promise(resolve => setTimeout(resolve, 1000));

    switch (actionId) {
      case 'send-reminder':
        alert('Reminder sent!');
        break;
      case 'mark-complete':
        alert('Marked as complete!');
        router.push('/comms-hub');
        return;
      case 'cancel':
        if (confirm('Are you sure you want to cancel this communication?')) {
          alert('Communication cancelled');
          router.push('/comms-hub');
          return;
        }
        break;
    }
    setIsActionLoading(null);
  };

  return (
    <AppLayout>
      <div className="comms-dashboard">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Communications Hub</h1>
          <Link href="/comms-hub/send" className="btn btn-primary">
            <span className="material-icons-outlined">add</span>
            Send New
          </Link>
        </div>

        {/* Tabs */}
        <nav className="tabs">
          <Link href="/comms-hub" className="tab active">Communications</Link>
          <Link href="/comms-hub/notifications" className="tab">
            Alerts
            {unreadNotifCount > 0 && <span className="tab-badge">{unreadNotifCount}</span>}
          </Link>
          <Link href="/comms-hub/relationships" className="tab">Contact Book</Link>
          <Link href="/comms-hub/campaigns" className="tab">Campaigns</Link>
          <Link href="/comms-hub/templates" className="tab">Templates</Link>
          <Link href="/comms-hub/settings" className="tab">Settings</Link>
        </nav>

        {/* Context Bar: Back + Client + Actions */}
        <div className="detail-context-bar">
          <div className="context-bar-left">
            <button className="back-link" onClick={() => router.back()}>
              <span className="material-icons-outlined">arrow_back</span>
              Back
            </button>
            <div className="context-bar-client">
              <div className="client-avatar-sm">
                {communication.client.firstName[0]}{communication.client.lastName[0]}
              </div>
              <div className="client-card-info">
                <span className="client-card-name">{getClientDisplayName(communication.client)}</span>
                <div className="client-card-contacts">
                  {communication.client.email && (
                    <a href={`mailto:${communication.client.email}`} className="client-contact-link">
                      <span className="material-icons-outlined">email</span>
                      {communication.client.email}
                    </a>
                  )}
                  {communication.client.phone && (
                    <a href={`tel:${communication.client.phone}`} className="client-contact-link">
                      <span className="material-icons-outlined">phone</span>
                      {communication.client.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Content */}
        <div className="detail-page">
          {/* Communication Detail Content */}
              {/* Communication Header Block */}
              <div className="detail-header-block">
                <div className="header-main">
                  <div className="header-top-row">
                    <h1 className="header-subject">{communication.subject || commtype.name}</h1>
                    <div className="header-actions">
                      <span className={`health-badge ${communication.health}`}>
                        <span className="health-dot"></span>
                        {healthConfig.label}
                      </span>
                      {availableActions.map(action => (
                        <button
                          key={action.id}
                          className={`btn btn-sm btn-${action.variant}`}
                          onClick={() => handleAction(action.id)}
                          disabled={isActionLoading === action.id}
                        >
                          <span className="material-icons-outlined">{action.icon}</span>
                          {isActionLoading === action.id ? '...' : action.label}
                        </button>
                      ))}
                      <div className="more-menu-container">
                        <button
                          className="btn-more"
                          title="More actions"
                          onClick={() => setShowMoreMenu(!showMoreMenu)}
                        >
                          <span className="material-icons-outlined">more_vert</span>
                        </button>
                        {showMoreMenu && (
                          <div className="more-menu">
                            <button className="more-menu-item" onClick={() => { alert('Resend'); setShowMoreMenu(false); }}>
                              <span className="material-icons-outlined">refresh</span>
                              Resend
                            </button>
                            <button className="more-menu-item" onClick={() => { alert('Copy link'); setShowMoreMenu(false); }}>
                              <span className="material-icons-outlined">link</span>
                              Copy Link
                            </button>
                            <button className="more-menu-item" onClick={() => { alert('Archive'); setShowMoreMenu(false); }}>
                              <span className="material-icons-outlined">archive</span>
                              Archive
                            </button>
                            <div className="more-menu-divider" />
                            <button className="more-menu-item danger" onClick={() => { handleAction('cancel'); setShowMoreMenu(false); }}>
                              <span className="material-icons-outlined">cancel</span>
                              Cancel Communication
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="header-meta">
                    <span>{commtype.name}</span>
                    <span className="meta-sep">•</span>
                    <span>{formatChannelsList(communication)}</span>
                    <span className="meta-sep">•</span>
                    <span>Sent {formatRelativeTime(getFirstSentAt(communication) || communication.createdAt)}</span>
                  </div>
                </div>

                {/* Stage Stepper - inside header block */}
                <div className="stage-stepper-inline">
            <div className="stage-stepper-track">
              {commtype.stages.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                const isPending = index > currentStageIndex;

                // Get timestamp for this stage
                let timestamp: Date | undefined;
                const sentAt = getFirstSentAt(communication);
                const deliveredAt = getFirstDeliveredAt(communication);
                const openedAt = getFirstOpenedAt(communication);

                if (stage.id === 'sent' && sentAt) timestamp = sentAt;
                else if (stage.id === 'delivered' && deliveredAt) timestamp = deliveredAt;
                else if ((stage.id === 'opened' || stage.id === 'started') && openedAt) timestamp = openedAt;
                else if (stage.id === 'complete' && communication.completedAt) timestamp = communication.completedAt;
                else if (isCompleted && sentAt) {
                  timestamp = new Date(sentAt.getTime() + index * 24 * 60 * 60 * 1000);
                }

                return (
                    <div
                      key={stage.id}
                      className={`stepper-stage ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''} ${isCurrent ? communication.health : ''}`}
                    >
                      <div className="stepper-node" />
                      <span className="stepper-label">{stage.label}</span>
                      {(isCompleted || isCurrent) && timestamp && (
                        <span className="stepper-time">{formatRelativeTime(timestamp)}</span>
                      )}
                    </div>
                  );
                })}
                </div>
              </div>
              </div>

              {/* Activity Feed */}
          <div className="activity-section">
            <div className="activity-header">
              <h2 className="activity-title">Activity</h2>
            </div>
            <div className="activity-feed">
              {activityEvents.length > 0 ? (
                activityEvents.map((event, index) => (
                  <div key={event.id} className={`activity-item ${event.notification ? `activity-notification${event.notification.audience === 'client' ? ' activity-notification--client' : event.notification.nature === 'transactional' ? ' activity-notification--transactional' : ''}` : ''}`}>
                    <div className={`activity-dot ${event.iconClass}`} />
                    <div className="activity-content">
                      <div className="activity-timestamp">
                        {formatTimestamp(event.timestamp)}
                        {event.notification && (
                          <span className={`activity-audience-tag ${event.notification.audience}`}>
                            {event.notification.audience === 'client' ? 'To Client' : 'To Adviser'}
                          </span>
                        )}
                      </div>
                      <div className="activity-description">
                        <span>{event.description}</span>
                        {/* Notification-specific elements */}
                        {event.notification && (
                          <span className="activity-actions-inline">
                            <span className={`activity-nature-tag ${event.notification.nature}`}>
                              {event.notification.nature === 'transactional' ? 'Action Required' : 'Info'}
                            </span>
                            {event.notification.channel && (
                              <span className="activity-channel-tag">
                                via {CHANNELS[event.notification.channel].label}
                              </span>
                            )}
                            {event.notification.nature === 'transactional' && event.notification.actionLabel && !event.notification.actioned && (
                              <button className="activity-inline-btn">
                                {event.notification.actionLabel}
                              </button>
                            )}
                          </span>
                        )}
                        {/* Standard activity inline actions */}
                        {!event.notification && (event.viewMessageContent || event.id === 'uploaded' || (index === 0 && communication.health !== 'on-track' && !['complete', 'uploaded', 'review'].includes(communication.stage))) && (
                          <span className="activity-actions-inline">
                            {event.viewMessageContent && (
                              <button
                                className="activity-inline-btn"
                                onClick={() => setSelectedMessage(event)}
                              >
                                View message
                              </button>
                            )}
                            {event.id === 'uploaded' && (
                              <button className="activity-inline-btn">
                                View document
                              </button>
                            )}
                            {index === 0 && communication.health !== 'on-track' && !['complete', 'uploaded', 'review'].includes(communication.stage) && (
                              <button
                                className="activity-inline-btn warning"
                                onClick={() => handleAction('send-reminder')}
                              >
                                Send reminder
                              </button>
                            )}
                          </span>
                        )}
                      </div>
                      {event.notification?.body && (
                        <div className="activity-notification-body">{event.notification.body}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="activity-empty">
                  <span className="material-icons-outlined">history</span>
                  <span>No activity recorded yet</span>
                </div>
              )}
            </div>
          </div>

          {/* Documents Section (for document-request type) */}
              {communication.commtype === 'document-request' && (
                <div className="documents-section">
                  <div className="documents-header">
                    <h2 className="documents-title">Documents</h2>
                  </div>
                  <div className="documents-body">
                    {communication.stage === 'uploaded' || communication.stage === 'review' || communication.stage === 'complete' ? (
                      <div className="document-item">
                        <div className="document-icon">
                          <span className="material-icons-outlined">description</span>
                        </div>
                        <div className="document-info">
                          <span className="document-name">uploaded_document.pdf</span>
                          <span className="document-meta">Uploaded {formatRelativeTime(communication.updatedAt)}</span>
                        </div>
                        <div className="document-actions">
                          <button className="btn-icon" title="Preview">
                            <span className="material-icons-outlined">visibility</span>
                          </button>
                          <button className="btn-icon" title="Download">
                            <span className="material-icons-outlined">download</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="documents-empty">
                        <span className="material-icons-outlined">folder_open</span>
                        <span>No documents uploaded yet</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
        </div>
      </div>

      {/* Message Fly-in Panel */}
      <AnimatePresence>
        {selectedMessage && selectedMessage.viewMessageContent && (
          <>
            <motion.div
              className="message-panel-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedMessage(null)}
            />
            <motion.div
              className="message-panel"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            >
              <div className="message-panel-header">
                <h3>
                  {selectedMessage.id === 'sent' || selectedMessage.id === 'reminder'
                    ? 'Outgoing Message'
                    : 'Message Details'}
                </h3>
                <button className="message-panel-close" onClick={() => setSelectedMessage(null)} title="Close">
                  <span className="material-icons-outlined">close</span>
                </button>
              </div>
              <div className="message-panel-body">
                <div className="message-meta-grid">
                  {selectedMessage.viewMessageContent.channel && (
                    <>
                      <span className="message-meta-label">Channel</span>
                      <span className="message-meta-value">{selectedMessage.viewMessageContent.channel}</span>
                    </>
                  )}
                  <span className="message-meta-label">Date</span>
                  <span className="message-meta-value">
                    {selectedMessage.timestamp ? formatDate(selectedMessage.timestamp) : '-'}
                  </span>
                  <span className="message-meta-label">To</span>
                  <span className="message-meta-value">{getClientDisplayName(communication.client)}</span>
                </div>

                {selectedMessage.viewMessageContent.subject && (
                  <div className="message-subject">
                    <div className="message-subject-label">Subject</div>
                    <p className="message-subject-text">{selectedMessage.viewMessageContent.subject}</p>
                  </div>
                )}

                <div className="message-body">
                  <div className="message-body-label">Message</div>
                  <div className="message-body-content">
                    {selectedMessage.viewMessageContent.body}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
