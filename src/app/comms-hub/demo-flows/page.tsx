'use client';

import { useMemo, useCallback, useState } from 'react';
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
  buildDocumentTitle,
} from './notification-scenarios';
import { Modal } from '@/components/Modal';
import '../comms-hub.css';

// Flows that have pixel-perfect Figma designs completed
const DESIGNED_FLOWS = new Set(['info-request', 'onboarding', 'document-request', 'portal-invite', 'password-reset', 'message', 'in-app']);
const DESIGNED_SCENARIOS = new Set(['notif-share-document', 'notif-share-report']);

// =============================================================================
// UI SPEC DATA
// =============================================================================

const SPECS: Record<string, { title: string; sections: { heading: string; content: string }[] }> = {
  'info-request': {
    title: 'Information Request — UI Pattern Specification',
    sections: [
      { heading: 'Overview', content: `The Information Request flow is a multi-step modal wizard that guides an adviser through requesting information and documents from a client. The flow has 3–4 steps depending on whether "Documents" is selected in Step 2.\n\nSteps: Verify → Select → Documents (conditional) → Confirm and send\n\nThe modal title bar shows the communication type name (e.g. "Information Request") in muted grey text with a close button. Each step has a header zone (white) and a content zone (grey).` },
      { heading: 'Modal Container', content: `• White background, 12px border-radius, 1px border (#EAECF0)\n• Shadow: 0px 1px 3px rgba(16,24,40,0.1), 0px 1px 2px rgba(16,24,40,0.06)\n• Title bar: communication type name, medium weight, #828282 text\n• Close button: top-right, outlined icon` },
      { heading: 'Stepper (Pill Pattern)', content: `• Horizontal row of step pills, each with a rounded-square badge (32×32px, 5px radius)\n• Active step: orange pill (#EA8A2E background), badge (#F1B071), white text\n• Upcoming steps: white pill, badge (#FDF3E8 background, #EA8A2E text), label #333\n• Completed steps: white pill, badge (#C3F1C8 background, #1DB247 check icon), label #333\n• Badge font: 12px Inter Medium, -0.5px letter-spacing\n• Label font: 14px Inter Regular` },
      { heading: 'Header Zone (White)', content: `• Background: white, padding 20px 24px\n• Bottom border: 1px solid #D9E3EA\n• Step title: 24px Inter Semibold, #1F2224, -0.12px letter-spacing\n• Context lines below title:\n  - "To:" label in #828282, value in #0E6A8F\n  - "Type of communication:" label in #828282, value in #0E6A8F\n  - Font: 14px Inter Regular` },
      { heading: 'Content Zone (Grey)', content: `• Background: #F2F2F2, padding 30px 24px\n• Contains white cards (8px border-radius) for form groups\n• Cards: white background, 20px padding, 5px gap between items, 20px margin-bottom\n• Form groups within cards have 0 margin-bottom (card padding handles spacing)` },
      { heading: 'Form Inputs', content: `• Border: 1px solid #E0EBF2, 5px radius\n• Padding: 10px 15px\n• Font: 14px Inter Regular, #171818\n• Focus: 2px solid #016991 border with #E8F3F8 box-shadow ring` },
      { heading: 'Form Labels', content: `• Font: 14px Inter Regular (not medium), #171818\n• 6px gap between label and input` },
      { heading: 'Checkbox Pattern', content: `• Custom styled: 18×18px, 2px border (#D1D5DB), 4px radius\n• Checked: #016991 fill with white checkmark\n• Disabled/required: #BDBDBD fill, cursor default\n• Gap between checkbox and label: 10px\n• Label font: 14px Inter, bold prefix + regular rest (e.g. "Personal information")\n• Gap between rows: 5px` },
      { heading: 'Radio Button Pattern', content: `• Custom styled: 18×18px, 2px border (#D1D5DB), circular\n• Checked: #016991 border with 8×8px #016991 inner dot\n• Rows: 5px vertical padding\n• Label font: 14px Inter Regular, #171818\n• Gap between radio and label: 10px` },
      { heading: 'Footer', content: `• Background: white, padding 15px 45px\n• Top border: 1px solid #D9E3EA\n• Cancel/Back button: outlined, 1px border #016991, 8px radius, 14px Inter Semibold, #016991 text, 40px height\n• Next/Send button: filled #016991, 6px radius, 14px Inter Semibold, white text, 40px height\n• Hover: Cancel → #E8F3F8 background, Next → #014A66 background` },
      { heading: 'Inline Expand Pattern', content: `• "Add custom document" button triggers an inline form expansion within the white card\n• Expand/collapse: max-height transition 650ms ease-out with 150ms delayed opacity fade\n• Separator: 1px solid #EAECF0 border-top above expanded content\n• Form title: 16px Inter Semibold, #1F2224\n• Action buttons (Cancel + Add) sit below the form with 20px top margin` },
      { heading: 'Conditional Steps', content: `• The "Documents" step only appears if the user checks "Documents" in the Select step\n• Step count and stepper pills update dynamically (3 steps without, 4 with)` },
      { heading: 'Send Confirmation', content: `• Standalone small modal (replaces the flow modal entirely)\n• No stepper, no title bar — just white card content\n• Title: "Message sent!" — 24px Inter Bold, #1F2224\n• Message: 14px Inter Regular, #171818\n• Close button: top-right, 32px inset\n• Footer row: "Delivered" status (left) + "Done" button (right)` },
      { heading: 'Colour Reference', content: `• Primary blue: #016991\n• Primary blue dark (hover): #014A66\n• Orange (stepper active): #EA8A2E\n• Orange badge (active): #F1B071\n• Orange badge (upcoming): #FDF3E8\n• Green badge (completed): #C3F1C8 bg, #1DB247 icon\n• Grey background: #F2F2F2\n• Border light: #E0EBF2 (inputs), #D9E3EA (dividers), #EAECF0 (cards)\n• Text primary: #1F2224 / #171818\n• Text muted: #828282\n• Text link/value: #0E6A8F\n• Disabled checkbox: #BDBDBD` },
      { heading: 'Typography Reference', content: `• All body text: 14px Inter — standardised across labels, inputs, checkboxes, context lines\n• Step title: 24px Inter Semibold\n• Card section title: 24px Inter Semibold (e.g. "Standard documents")\n• Modal title bar: 20px Inter Medium, #828282\n• Buttons: 14px Inter Semibold\n• Badge numbers: 12px Inter Medium` },
    ],
  },
  'onboarding': {
    title: 'Client Onboarding — UI Pattern Specification',
    sections: [
      { heading: 'Overview', content: `Client Onboarding is identical to the Information Request flow, presented under a different name for new client contexts.\n\nSteps: Verify → Select → Documents (conditional) → Confirm and send\n\nModal title: "Welcome — let's get you set up"\nTemplates use onboarding-specific welcoming tone.` },
      { heading: 'Shared Patterns', content: `All steps, patterns, and tokens are identical to the Information Request flow. Refer to the Information Request spec for detailed values.` },
    ],
  },
  'document-request': {
    title: 'Document Request — UI Pattern Specification',
    sections: [
      { heading: 'Overview', content: `The Document Request flow is a 3-step modal wizard for requesting documents from a client. It reuses the same UI patterns as Information Request but without the information sections step.\n\nSteps: Verify → Documents → Confirm and send` },
      { heading: 'Step 1: Verify', content: `• Same as Information Request Step 1\n• Title: "Confirm the details below"\n• White card with "Send via" channel checkboxes\n• Email address and mobile number fields on grey background\n• Context lines: To + Type of communication` },
      { heading: 'Step 2: Documents', content: `• Title: "What documents do you need?"\n• Two white cards:\n  1. Standard documents — "Select all" checkbox + document checkboxes (bold labels)\n  2. Custom documents — inline expand form with document name, guidance note, storage location (radio list)\n• Inline expand: 650ms max-height transition with delayed opacity` },
      { heading: 'Step 3: Confirm and send', content: `• Title: "Review and edit your message below"\n• White card with bordered subject input + message editor\n• Footer shows "Send now" instead of "Next"` },
      { heading: 'Shared Patterns', content: `All patterns (stepper, header, footer, checkboxes, radio buttons, form inputs, inline expand, send confirmation) are identical to the Information Request flow. Refer to the Information Request spec for detailed token values.` },
    ],
  },
  'portal-invite': {
    title: 'Portal Invite — UI Pattern Specification',
    sections: [
      { heading: 'Overview', content: `The Portal Invite flow is a 3-step modal wizard for giving clients access to the Wealth Portal.\n\nSteps: Verify → Configure → Confirm and send` },
      { heading: 'Step 1: Verify', content: `• Same contact verification pattern as all other flows\n• Title: "Confirm the details below"\n• White card with "Send via" channel checkboxes (SMS, Email, WhatsApp, In-App)\n• Email address and mobile number fields` },
      { heading: 'Step 2: Configure', content: `• Title: "Set up portal access"\n• Username/email field for portal login credentials\n• Reuses the existing ConfigureAccessStep component` },
      { heading: 'Step 3: Confirm and send', content: `• Title: "Review and edit your message below"\n• White card with subject input + message editor\n• Channel-specific templates with {Link} placeholder for portal activation` },
      { heading: 'Shared Patterns', content: `All visual patterns are identical to the Information Request flow. Refer to the Information Request spec for detailed token values.` },
    ],
  },
  'password-reset': {
    title: 'Password Reset — UI Pattern Specification',
    sections: [
      { heading: 'Overview', content: `The Password Reset flow is a 2-step modal wizard for sending password reset links to clients.\n\nSteps: Verify → Confirm and send` },
      { heading: 'Step 1: Verify', content: `• Same contact verification pattern as all other flows\n• Title: "Confirm the details below"\n• White card with "Send via" channel checkboxes (Email, SMS, In-App)\n• Email address and mobile number fields` },
      { heading: 'Step 2: Confirm and send', content: `• Title: "Review and edit your message below"\n• White card with subject input + message editor\n• Templates include {Link} placeholder with 24-hour expiry note\n• Channel-specific: email has full explanation, SMS is concise with link only` },
      { heading: 'Shared Patterns', content: `All visual patterns are identical to the Information Request flow. Refer to the Information Request spec for detailed token values.` },
    ],
  },
  'message': {
    title: 'Message — UI Pattern Specification',
    sections: [
      { heading: 'Overview', content: `The Message flow is a 2-step modal wizard for sending freeform messages to clients via any channel.\n\nSteps: Verify → Confirm and send` },
      { heading: 'Step 1: Verify', content: `• Same contact verification pattern as all other flows\n• Title: "Confirm the details below"\n• White card with "Send via" channel checkboxes (SMS, Email, WhatsApp, In-App)\n• Email address and mobile number fields` },
      { heading: 'Step 2: Confirm and send', content: `• Title: "Review and edit your message below"\n• White card with subject input + freeform message editor\n• No pre-filled template — adviser writes the message from scratch\n• Channel tabs when multiple channels selected` },
      { heading: 'Shared Patterns', content: `All visual patterns are identical to the Information Request flow. Refer to the Information Request spec for detailed token values.` },
    ],
  },
  'in-app': {
    title: 'In-App Notification — UI Pattern Specification',
    sections: [
      { heading: 'Overview', content: `The In-App Notification flow is a 2-step modal wizard for sending notifications to a client's portal notification centre.\n\nSteps: Verify → Confirm and send` },
      { heading: 'Step 1: Verify', content: `• Same contact verification pattern as all other flows\n• Title: "Confirm the details below"\n• White card with channel checkbox (In-App only)\n• Email address and mobile number fields` },
      { heading: 'Step 2: Confirm and send', content: `• Title: "Review and edit your message below"\n• Notification title field (80 char limit) + auto-built description\n• In-app notifications use structured fields rather than freeform compose` },
      { heading: 'Shared Patterns', content: `All visual patterns are identical to the Information Request flow. Refer to the Information Request spec for detailed token values.` },
    ],
  },
  'notif-share-document': {
    title: 'Share a Document — UI Pattern Specification',
    sections: [
      { heading: 'Overview', content: `The Share a Document flow allows advisers to share documents with clients via in-app notifications.\n\nSteps: Verify → Documents → Attach → Confirm and send\n\nUses the in-app commType with injected share-documents and add-documents steps.` },
      { heading: 'Step 1: Verify', content: `• Contact verification — same pattern as all other flows\n• Single channel: In-App only` },
      { heading: 'Step 2: Documents', content: `• Title: "Which documents do you want to share?"\n• White card with "Select all" + document checkboxes (bold labels)\n• Available documents: Tax Certificate, Portfolio Valuation Report, Market Commentary, Financial Plan, Investment Proposal, Fee Schedule, Fund Fact Sheet, Policy Schedule, Annual Report, Compliance Confirmation` },
      { heading: 'Step 3: Attach', content: `• Title: "Attach your documents"\n• White card with Drive / Client documents / Templates tabs\n• Drag & drop upload zone, file browser, template selector` },
      { heading: 'Step 4: Confirm and send', content: `• Title: "Review and edit your message below"\n• In-app notification: structured title (80 char limit) + auto-built description` },
      { heading: 'Shared Patterns', content: `All visual patterns are identical to the Information Request flow. Refer to the Information Request spec for detailed token values.` },
    ],
  },
  'notif-share-report': {
    title: 'Share a Report — UI Pattern Specification',
    sections: [
      { heading: 'Overview', content: `The Share a Report flow is a simplified variant of Share a Document with documents pre-selected.\n\nSteps: Verify → Attach → Confirm and send\n\nSkips the document selection step since the report type is pre-selected (e.g. Market Commentary).` },
      { heading: 'Step 1: Verify', content: `• Contact verification — same pattern as all other flows\n• Single channel: In-App only` },
      { heading: 'Step 2: Attach', content: `• Title: "Attach your documents"\n• White card with Drive / Client documents / Templates tabs\n• Drag & drop upload zone for the actual report file` },
      { heading: 'Step 3: Confirm and send', content: `• Title: "Review and edit your message below"\n• Auto-generated subject based on pre-selected document type` },
      { heading: 'Shared Patterns', content: `All visual patterns are identical to the Information Request flow. Refer to the Information Request spec for detailed token values.` },
    ],
  },
};

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
  const [specFlow, setSpecFlow] = useState<string | null>(null);

  const specData = specFlow ? SPECS[specFlow] : null;

  const handleDownloadSpec = useCallback(() => {
    if (!specData || !specFlow) return;
    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>${specData.title}</title>
<style>body{font-family:'Inter',-apple-system,sans-serif;max-width:800px;margin:0 auto;padding:40px 24px;color:#1F2224;line-height:1.6}h1{font-size:28px;font-weight:700;margin-bottom:8px}.meta{font-size:14px;color:#828282;margin-bottom:40px}h2{font-size:18px;font-weight:600;color:#016991;margin-top:32px;margin-bottom:8px;border-bottom:1px solid #E0EBF2;padding-bottom:8px}p{font-size:14px;white-space:pre-wrap}</style>
</head><body><h1>${specData.title}</h1><p class="meta">Generated from Elite Wealth Communications Hub — ${new Date().toLocaleDateString('en-ZA')}</p>
${specData.sections.map(s => `<h2>${s.heading}</h2>\n<p>${s.content}</p>`).join('\n')}
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${specFlow}-ui-spec.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [specData, specFlow]);

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
        stepData: {
          ...(scenario.flow.inappDue ? { 'inapp-due': scenario.flow.inappDue } : {}),
          ...(scenario.flow.inappAdviser ? { 'inapp-adviser': scenario.flow.inappAdviser } : {}),
          ...(scenario.flow.prefillStepData || {}),
        },
      },
      additionalStepIds: scenario.flow.additionalStepIds,
      modalTitle: scenario.flow.modalTitle,
      onComplete: (result) => {
        if (result.success && result.data.recipients.length > 0) {
          result.data.recipients.forEach((client, i) => {
            const notif: ClientNotification = {
              id: `cn-demo-${Date.now()}-${i}`,
              clientId: client.id,
              clientName: `${client.firstName} ${client.lastName}`,
              icon: scenario.notificationOutput.icon,
              title: buildDocumentTitle(result.data.stepData, result.data.subject || scenario.flow!.subject),
              subtitle: result.data.channelDrafts?.['in-app'] || scenario.notificationOutput.subtitle,
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
            Notifications
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
          <Link href="/comms-hub/client-demo" className="tab">
            Client Demo
          </Link>
          <Link href="/comms-hub/client-context" className="tab">Client Context</Link>
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
                  const isDesigned = DESIGNED_SCENARIOS.has(scenario.id);
                  return (
                    <div key={scenario.id} className="demo-flow-card-wrapper">
                      <button
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
                      {isDesigned && (
                        <div className="demo-flow-meta">
                          <button
                            type="button"
                            className="designed-spec-link"
                            onClick={(e) => { e.stopPropagation(); setSpecFlow(scenario.id); }}
                          >
                            Designed — View UI Spec
                          </button>
                        </div>
                      )}
                    </div>
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
                {types.map(config => {
                  const isDesigned = DESIGNED_FLOWS.has(config.id);
                  return (
                    <div key={config.id} className="demo-flow-card-wrapper">
                      <button
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
                      {isDesigned && (
                        <div className="demo-flow-meta">
                          <button
                            type="button"
                            className="designed-spec-link"
                            onClick={(e) => { e.stopPropagation(); setSpecFlow(config.id); }}
                          >
                            Designed — View UI Spec
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* UI Spec Modal */}
      {specData && (
        <Modal
          isOpen={true}
          onClose={() => setSpecFlow(null)}
          title={specData.title}
          size="lg"
          footer={
            <div className="comm-flow-modal-footer">
              <div className="modal-footer-left">
                <button type="button" className="comm-flow-btn-cancel" onClick={() => setSpecFlow(null)}>
                  Close
                </button>
              </div>
              <div className="modal-footer-right">
                <button type="button" className="comm-flow-btn-next" onClick={handleDownloadSpec}>
                  <span className="material-icons-outlined" style={{ fontSize: '18px' }}>download</span>
                  Download
                </button>
              </div>
            </div>
          }
        >
          <div className="spec-modal-content">
            {specData.sections.map((section) => (
              <div key={section.heading} className="spec-section">
                <h3 className="spec-section-heading">{section.heading}</h3>
                <p className="spec-section-body">{section.content}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
