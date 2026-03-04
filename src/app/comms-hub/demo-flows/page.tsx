'use client';

import { useMemo, useCallback } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { NotesButton } from '@/components/GlobalNotes';
import { useCommFlows } from '@/contexts/CommFlowsContext';
import { useNotificationCenter } from '@/components/NotificationCenter';
import { MOCK_CLIENTS, getUnreadAdviserNotificationCount } from '../mock-data';
import {
  COMM_TYPE_CONFIGS,
  COMM_TYPE_GROUPS,
  COMM_TYPE_GROUP_ORDER,
  ClientNotification,
} from '@/types/communications';
import {
  NOTIFICATION_SCENARIOS,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CATEGORY_ORDER,
  SYSTEM_NOTIFICATIONS,
  NotificationScenario,
} from './notification-scenarios';
import '../comms-hub.css';

// Assign a sample client per group for variety
const GROUP_CLIENTS: Record<string, typeof MOCK_CLIENTS[number]> = {
  workflows: MOCK_CLIENTS.find(c => c.id === 'c2')!,  // Sarah van der Berg
  messages: MOCK_CLIENTS.find(c => c.id === 'c1')!,    // Johan Pretorius
  meetings: MOCK_CLIENTS.find(c => c.id === 'c3')!,    // Michael Naidoo
  other: MOCK_CLIENTS.find(c => c.id === 'c4')!,       // Peter Gillespie
};

export default function DemoFlowsPage() {
  const { startFlow } = useCommFlows();
  const { addNotification, openNotificationCenter } = useNotificationCenter();
  const unreadNotifCount = useMemo(() => getUnreadAdviserNotificationCount(), []);

  // ---------------------------------------------------------------------------
  // SCENARIO HANDLERS
  // ---------------------------------------------------------------------------

  const handleFlowScenario = useCallback((scenario: NotificationScenario) => {
    if (!scenario.flow) return;

    startFlow({
      client: scenario.client,
      commType: 'in-app',
      prefill: {
        subject: scenario.flow.subject,
        message: scenario.flow.message,
      },
      additionalStepIds: scenario.flow.additionalStepIds,
      onComplete: (result) => {
        if (result.success && result.data.recipients.length > 0) {
          result.data.recipients.forEach((client, i) => {
            const notif: ClientNotification = {
              id: `cn-demo-${Date.now()}-${i}`,
              clientId: client.id,
              clientName: `${client.firstName} ${client.lastName}`,
              icon: scenario.notificationOutput.icon,
              title: result.data.subject || scenario.flow!.subject,
              subtitle: scenario.notificationOutput.subtitle,
              adviserName: scenario.notificationOutput.adviserName,
              adviserInitial: scenario.notificationOutput.adviserName?.[0],
              actionLabel: scenario.notificationOutput.actionLabel,
              read: false,
              createdAt: new Date(),
            };
            addNotification(notif);
          });
          // Auto-open notification center after modal closes
          setTimeout(() => openNotificationCenter(), 500);
        }
      },
    });
  }, [startFlow, addNotification, openNotificationCenter]);

  const handleSystemScenario = useCallback((scenario: NotificationScenario) => {
    const systemData = SYSTEM_NOTIFICATIONS[scenario.id];
    if (!systemData) return;

    const notif: ClientNotification = {
      id: `cn-demo-${Date.now()}`,
      clientId: scenario.client.id,
      clientName: `${scenario.client.firstName} ${scenario.client.lastName}`,
      icon: scenario.notificationOutput.icon,
      title: systemData.title,
      subtitle: scenario.notificationOutput.subtitle,
      adviserName: scenario.notificationOutput.adviserName,
      adviserInitial: scenario.notificationOutput.adviserName?.[0],
      actionLabel: scenario.notificationOutput.actionLabel,
      read: false,
      createdAt: new Date(),
    };
    addNotification(notif);
    // Open notification center immediately for system notifications
    setTimeout(() => openNotificationCenter(), 300);
  }, [addNotification, openNotificationCenter]);

  const handleScenario = useCallback((scenario: NotificationScenario) => {
    if (scenario.flow) {
      handleFlowScenario(scenario);
    } else {
      handleSystemScenario(scenario);
    }
  }, [handleFlowScenario, handleSystemScenario]);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

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
            Alerts
            {unreadNotifCount > 0 && <span className="tab-badge">{unreadNotifCount}</span>}
          </Link>
          <Link href="/comms-hub/demo-flows" className="tab active">
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

        {/* ================================================================= */}
        {/* CURRENT SCOPE NOTIFICATIONS                                       */}
        {/* ================================================================= */}

        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="card-body" style={{ padding: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-xs)' }}>
              Current Scope Notifications
            </h2>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
              End-to-end notification scenarios: adviser composes a message, sends it, and the client receives an in-app notification in their Notification Center. System notifications are injected directly.
            </p>
          </div>
        </div>

        {NOTIFICATION_CATEGORY_ORDER.map(categoryId => {
          const categoryConfig = NOTIFICATION_CATEGORIES[categoryId];
          const scenarios = NOTIFICATION_SCENARIOS.filter(s => s.category === categoryId);
          if (scenarios.length === 0) return null;

          return (
            <div key={categoryId} style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--spacing-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
              }}>
                <span className="material-icons-outlined" style={{ fontSize: '16px' }}>
                  {categoryConfig.icon}
                </span>
                {categoryConfig.label}
              </h3>
              <p style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                margin: '0 0 var(--spacing-sm) 0',
              }}>
                {categoryConfig.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--spacing-sm)',
              }}>
                {scenarios.map(scenario => {
                  const isSystem = !scenario.flow;
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      className="card"
                      onClick={() => handleScenario(scenario)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-md) var(--spacing-lg)',
                        cursor: 'pointer',
                        border: '1px solid var(--color-border)',
                        textAlign: 'left',
                        width: '100%',
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
                      <span className="material-icons-outlined" style={{
                        fontSize: '24px',
                        color: isSystem ? 'var(--color-text-muted)' : 'var(--ew-blue)',
                        flexShrink: 0,
                      }}>
                        {scenario.buttonIcon}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 'var(--font-weight-medium)',
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--color-text-primary)',
                        }}>
                          {scenario.label}
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-text-muted)',
                        }}>
                          {isSystem ? 'Simulate' : ''} → {scenario.client.firstName} {scenario.client.lastName}
                        </div>
                      </div>
                      <span className="material-icons-outlined" style={{
                        fontSize: '18px',
                        color: 'var(--color-text-muted)',
                        flexShrink: 0,
                      }}>
                        {isSystem ? 'bolt' : 'chevron_right'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ================================================================= */}
        {/* PROCESS-TRIGGERED FLOWS (existing)                                */}
        {/* ================================================================= */}

        <div className="card" style={{ marginBottom: 'var(--spacing-lg)', marginTop: 'var(--spacing-xl)' }}>
          <div className="card-body" style={{ padding: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-xs)' }}>
              Process-Triggered Flows
            </h2>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
              These buttons simulate how flows are launched from within Elite Wealth when both the client and communication type are already known — e.g. a "Request Documents" button on a client's financial summary.
            </p>
          </div>
        </div>

        {/* Grouped buttons */}
        {COMM_TYPE_GROUP_ORDER.map(groupId => {
          const groupConfig = COMM_TYPE_GROUPS[groupId];
          const client = GROUP_CLIENTS[groupId];
          const types = Object.values(COMM_TYPE_CONFIGS).filter(c => c.group === groupId);
          if (types.length === 0) return null;

          return (
            <div key={groupId} style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 'var(--spacing-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
              }}>
                <span className="material-icons-outlined" style={{ fontSize: '16px' }}>{groupConfig.icon}</span>
                {groupConfig.label}
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--spacing-sm)',
              }}>
                {types.map(config => (
                  <button
                    key={config.id}
                    type="button"
                    className="card"
                    onClick={() => startFlow({ client, commType: config.id })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      padding: 'var(--spacing-md) var(--spacing-lg)',
                      cursor: 'pointer',
                      border: '1px solid var(--color-border)',
                      textAlign: 'left',
                      width: '100%',
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
                    <span className="material-icons-outlined" style={{
                      fontSize: '24px',
                      color: 'var(--ew-blue)',
                      flexShrink: 0,
                    }}>
                      {config.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 'var(--font-weight-medium)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-primary)',
                      }}>
                        {config.name}
                      </div>
                      <div style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text-muted)',
                      }}>
                        → {client.firstName} {client.lastName}
                      </div>
                    </div>
                    <span className="material-icons-outlined" style={{
                      fontSize: '18px',
                      color: 'var(--color-text-muted)',
                      flexShrink: 0,
                    }}>
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
