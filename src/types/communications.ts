/**
 * Communications Hub Domain Model
 *
 * Core concepts from the functional spec:
 * - Commtype: A category of communication with defined workflow, templates, and states
 * - Archetype: A pattern that commtypes inherit from (Request, Workflow, Notification, etc.)
 * - Stage: Where a communication is in its flow (Sent → Delivered → Opened → ...)
 * - Health: SLA status independent of stage (on-track, at-risk, overdue)
 */

// =============================================================================
// ARCHETYPES
// =============================================================================

export type Archetype =
  | 'Workflow'      // Full client-side journey, multi-step, resumable
  | 'Request'       // Expects specific deliverable, tracks completion
  | 'Notification'  // One-way info, normal priority
  | 'Alert'         // One-way info, high priority
  | 'Broadcast'     // One-to-many, marketing/content
  | 'Touchpoint'    // Relational, human moment
  | 'Conversation'; // Free-form, adviser-driven

// =============================================================================
// COMMTYPES
// =============================================================================

export type CommtypeId =
  | 'document-request'
  | 'onboarding'
  | 'wealth-portal'
  | 'free-format'
  | 'message'
  | 'newsletter'
  | 'birthday'
  | 'portal-invite'
  | 'info-request'
  | 'password-reset';

// =============================================================================
// STAGE NOTIFICATIONS
// Declared on commtype stages — fire automatically on stage transitions.
// =============================================================================

export type NotificationAudience = 'client' | 'adviser';
export type NotificationNature = 'informational' | 'transactional';

/**
 * Declares a notification that fires when a Communication enters a stage.
 * Template placeholders: {client}, {commtype}, {adviser}
 */
export interface StageNotificationConfig {
  audience: NotificationAudience;
  nature: NotificationNature;
  titleTemplate: string;
  bodyTemplate?: string;
  actionLabel?: string;         // For transactional: "Review Documents", "Send Reminder"
  channel?: Channel;            // For client notifications: delivery channel
}

export interface StageDefinition {
  id: string;
  label: string;
  description?: string;
  notifications?: StageNotificationConfig[];
}

export interface CommtypeDefinition {
  id: CommtypeId;
  name: string;
  archetype: Archetype;
  stages: StageDefinition[];
  defaultChannel: Channel;
  requiresResponse: boolean;
}

// =============================================================================
// COMMTYPE DEFINITIONS
// =============================================================================

export const COMMTYPES: Record<CommtypeId, CommtypeDefinition> = {
  'document-request': {
    id: 'document-request',
    name: 'Document Request',
    archetype: 'Request',
    defaultChannel: 'email',
    requiresResponse: true,
    stages: [
      { id: 'sent', label: 'Sent', notifications: [
        { audience: 'client', nature: 'transactional', titleTemplate: 'Please upload your requested documents', channel: 'email' },
      ]},
      { id: 'delivered', label: 'Delivered' },
      { id: 'opened', label: 'Opened', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} opened the document request' },
      ]},
      { id: 'reminded', label: 'Reminded', notifications: [
        { audience: 'client', nature: 'transactional', titleTemplate: 'Reminder: please upload your documents', channel: 'email' },
        { audience: 'adviser', nature: 'informational', titleTemplate: 'Reminder sent to {client} for document request' },
      ]},
      { id: 'uploaded', label: 'Uploaded', notifications: [
        { audience: 'adviser', nature: 'transactional', titleTemplate: '{client} has uploaded documents', actionLabel: 'Review Documents' },
        { audience: 'client', nature: 'informational', titleTemplate: 'We have received your documents', channel: 'email' },
      ]},
      { id: 'review', label: 'Review' },
      { id: 'complete', label: 'Complete', notifications: [
        { audience: 'client', nature: 'informational', titleTemplate: 'Your document request is complete', channel: 'email' },
        { audience: 'adviser', nature: 'informational', titleTemplate: 'Document request for {client} is complete' },
      ]},
      { id: 'expired', label: 'Expired', notifications: [
        { audience: 'adviser', nature: 'transactional', titleTemplate: 'Document request for {client} has expired', actionLabel: 'Send Reminder' },
      ]},
    ],
  },
  'onboarding': {
    id: 'onboarding',
    name: 'Onboarding',
    archetype: 'Workflow',
    defaultChannel: 'email',
    requiresResponse: true,
    stages: [
      { id: 'sent', label: 'Sent', notifications: [
        { audience: 'client', nature: 'transactional', titleTemplate: 'Welcome! Let\u2019s get you started', channel: 'email' },
      ]},
      { id: 'delivered', label: 'Delivered' },
      { id: 'started', label: 'Started', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} has started their onboarding' },
      ]},
      { id: 'in-progress', label: 'In Progress', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} is making progress on onboarding' },
      ]},
      { id: 'completing', label: 'Completing', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} is completing their onboarding' },
      ]},
      { id: 'complete', label: 'Complete', notifications: [
        { audience: 'client', nature: 'informational', titleTemplate: 'Your onboarding is complete \u2014 welcome!', channel: 'email' },
        { audience: 'adviser', nature: 'informational', titleTemplate: 'Onboarding complete for {client}' },
      ]},
      { id: 'expired', label: 'Expired', notifications: [
        { audience: 'adviser', nature: 'transactional', titleTemplate: 'Onboarding for {client} has expired', actionLabel: 'Resend Invite' },
      ]},
    ],
  },
  'wealth-portal': {
    id: 'wealth-portal',
    name: 'Wealth Portal',
    archetype: 'Workflow',
    defaultChannel: 'email',
    requiresResponse: true,
    stages: [
      { id: 'sent', label: 'Sent', notifications: [
        { audience: 'client', nature: 'transactional', titleTemplate: 'Set up your Wealth Portal access', channel: 'email' },
      ]},
      { id: 'delivered', label: 'Delivered' },
      { id: 'opened', label: 'Opened', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} opened the Wealth Portal invite' },
      ]},
      { id: 'activated', label: 'Activated', notifications: [
        { audience: 'client', nature: 'informational', titleTemplate: 'Your Wealth Portal is now active', channel: 'email' },
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} has activated their Wealth Portal' },
      ]},
      { id: 'complete', label: 'Complete', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: 'Wealth Portal setup for {client} is complete' },
      ]},
    ],
  },
  'free-format': {
    id: 'free-format',
    name: 'Free Format',
    archetype: 'Conversation',
    defaultChannel: 'email',
    requiresResponse: false,
    stages: [
      { id: 'sent', label: 'Sent' },
      { id: 'delivered', label: 'Delivered' },
      { id: 'opened', label: 'Opened', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} opened your message' },
      ]},
      { id: 'responded', label: 'Responded', notifications: [
        { audience: 'adviser', nature: 'transactional', titleTemplate: '{client} has responded to your message', actionLabel: 'View Response' },
      ]},
      { id: 'closed', label: 'Closed' },
    ],
  },
  'message': {
    id: 'message',
    name: 'Message',
    archetype: 'Conversation',
    defaultChannel: 'email',
    requiresResponse: false,
    stages: [
      { id: 'sent', label: 'Sent' },
      { id: 'delivered', label: 'Delivered' },
    ],
  },
  'newsletter': {
    id: 'newsletter',
    name: 'Newsletter',
    archetype: 'Broadcast',
    defaultChannel: 'email',
    requiresResponse: false,
    stages: [
      { id: 'sent', label: 'Sent' },
      { id: 'delivered', label: 'Delivered' },
      { id: 'opened', label: 'Opened', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} opened the newsletter' },
      ]},
      { id: 'clicked', label: 'Clicked', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} clicked a link in the newsletter' },
      ]},
      { id: 'unsubscribed', label: 'Unsubscribed', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} has unsubscribed from newsletters' },
      ]},
    ],
  },
  'birthday': {
    id: 'birthday',
    name: 'Birthday',
    archetype: 'Touchpoint',
    defaultChannel: 'whatsapp',
    requiresResponse: false,
    stages: [
      { id: 'sent', label: 'Sent' },
      { id: 'delivered', label: 'Delivered', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: 'Birthday message delivered to {client}' },
      ]},
      { id: 'opened', label: 'Opened', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} opened their birthday message' },
      ]},
    ],
  },
  'portal-invite': {
    id: 'portal-invite',
    name: 'Portal Invite',
    archetype: 'Workflow',
    defaultChannel: 'sms',
    requiresResponse: true,
    stages: [
      { id: 'invited', label: 'Invited', notifications: [
        { audience: 'client', nature: 'transactional', titleTemplate: 'You\u2019ve been invited to the client portal', channel: 'sms' },
      ]},
      { id: 'opened', label: 'Link Opened', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} opened the portal invite link' },
      ]},
      { id: 'password-set', label: 'Password Set', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} has set their portal password' },
      ]},
      { id: 'activated', label: 'Activated', notifications: [
        { audience: 'client', nature: 'informational', titleTemplate: 'Your portal account is now active', channel: 'email' },
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} has activated their portal account' },
      ]},
    ],
  },
  'info-request': {
    id: 'info-request',
    name: 'Info Request',
    archetype: 'Request',
    defaultChannel: 'email',
    requiresResponse: true,
    stages: [
      { id: 'requested', label: 'Requested', notifications: [
        { audience: 'client', nature: 'transactional', titleTemplate: 'We need some information from you', channel: 'email' },
      ]},
      { id: 'started', label: 'Started', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} has started the information request' },
      ]},
      { id: 'in-progress', label: 'In Progress', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} is working on the information request' },
      ]},
      { id: 'complete', label: 'Complete', notifications: [
        { audience: 'client', nature: 'informational', titleTemplate: 'Thank you \u2014 we have received your information', channel: 'email' },
        { audience: 'adviser', nature: 'transactional', titleTemplate: '{client} has submitted their information', actionLabel: 'Review Submission' },
      ]},
    ],
  },
  'password-reset': {
    id: 'password-reset',
    name: 'Password Reset',
    archetype: 'Workflow',
    defaultChannel: 'email',
    requiresResponse: true,
    stages: [
      { id: 'requested', label: 'Requested', notifications: [
        { audience: 'client', nature: 'transactional', titleTemplate: 'Your password reset link is on its way', channel: 'email' },
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} has requested a password reset' },
      ]},
      { id: 'link-sent', label: 'Link Sent', notifications: [
        { audience: 'client', nature: 'transactional', titleTemplate: 'Your password reset link', channel: 'email' },
      ]},
      { id: 'link-opened', label: 'Link Opened', notifications: [
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} opened the password reset link' },
      ]},
      { id: 'password-reset', label: 'Password Reset', notifications: [
        { audience: 'client', nature: 'informational', titleTemplate: 'Your password has been updated successfully', channel: 'email' },
        { audience: 'adviser', nature: 'informational', titleTemplate: '{client} has reset their portal password' },
      ]},
      { id: 'expired', label: 'Expired', notifications: [
        { audience: 'adviser', nature: 'transactional', titleTemplate: 'Password reset for {client} has expired', actionLabel: 'Resend Link' },
      ]},
    ],
  },
};

// =============================================================================
// CHANNELS
// =============================================================================

export type Channel = 'email' | 'sms' | 'whatsapp' | 'in-app';

export const CHANNELS: Record<Channel, { label: string; icon: string }> = {
  email: { label: 'Email', icon: 'email' },
  sms: { label: 'SMS', icon: 'sms' },
  whatsapp: { label: 'WhatsApp', icon: 'chat' },
  'in-app': { label: 'In-App', icon: 'notifications' },
};

// =============================================================================
// UNIFIED COMM TYPE CONFIGURATION
// All comm types (simple + workflow) in a single configurable schema
// =============================================================================

export interface WizardStep {
  id: string;
  label: string;
  description: string;
  title?: string;
  subtitle?: string;
}

export type CommTypeGroup = 'workflows' | 'messages';

export const COMM_TYPE_GROUP_ORDER: CommTypeGroup[] = ['workflows', 'messages'];

export const COMM_TYPE_GROUPS: Record<CommTypeGroup, { label: string; icon: string }> = {
  workflows: { label: 'Workflows', icon: 'account_tree' },
  messages: { label: 'Messages', icon: 'chat_bubble_outline' },
};

export interface CommTypeConfig {
  id: string;
  name: string;
  icon: string;
  description?: string;
  group: CommTypeGroup;
  channels: Channel[];
  defaultChannel: Channel;
  hasTemplates: boolean;
  additionalSteps: WizardStep[];  // Steps inserted between Type and Compose
  stages: { id: string; label: string }[];
  clientFlowPath?: string;  // For workflows with client-side experience
}

export const COMM_TYPE_CONFIGS: Record<string, CommTypeConfig> = {
  // ===================
  // WORKFLOW TYPES (complex flows with additional steps)
  // ===================
  'portal-invite': {
    id: 'portal-invite',
    name: 'Portal Invite',
    icon: 'key',
    description: 'Give clients access to their Wealth Portal',
    group: 'workflows',
    channels: ['sms', 'email', 'whatsapp'],
    defaultChannel: 'sms',
    hasTemplates: true,
    additionalSteps: [
      { id: 'configure-access', label: 'Configure', description: 'Set up portal access', title: 'Portal Access', subtitle: 'Set up the client\'s login credentials' },
    ],
    stages: [
      { id: 'invited', label: 'Invited' },
      { id: 'opened', label: 'Link Opened' },
      { id: 'password-set', label: 'Password Set' },
      { id: 'activated', label: 'Activated' },
    ],
    clientFlowPath: '/client/portal-activate/[token]',
  },
  'info-request': {
    id: 'info-request',
    name: 'Information Request',
    icon: 'assignment',
    description: 'Request information and documents from clients',
    group: 'workflows',
    channels: ['sms', 'email', 'whatsapp'],
    defaultChannel: 'email',
    hasTemplates: true,
    additionalSteps: [
      { id: 'confirm-contact', label: 'Contact', description: 'Verify contact details', title: 'Contact Details', subtitle: 'Verify the client\'s contact information' },
      { id: 'configure-request', label: 'Configure', description: 'Select information to request', title: 'Configure Request', subtitle: 'Select what information to request' },
    ],
    stages: [
      { id: 'requested', label: 'Requested' },
      { id: 'started', label: 'Started' },
      { id: 'in-progress', label: 'In Progress' },
      { id: 'complete', label: 'Complete' },
    ],
    clientFlowPath: '/client/info-request/[token]',
  },
  'password-reset': {
    id: 'password-reset',
    name: 'Password Reset',
    icon: 'lock_reset',
    description: 'Reset a client\u2019s portal password',
    group: 'workflows',
    channels: ['email', 'sms'],
    defaultChannel: 'email',
    hasTemplates: true,
    additionalSteps: [],
    stages: [
      { id: 'requested', label: 'Requested' },
      { id: 'link-sent', label: 'Link Sent' },
      { id: 'link-opened', label: 'Link Opened' },
      { id: 'password-reset', label: 'Password Reset' },
      { id: 'expired', label: 'Expired' },
    ],
    clientFlowPath: '/client/password-reset/[token]',
  },
  'document-request': {
    id: 'document-request',
    name: 'Document Request',
    icon: 'upload_file',
    description: 'Request specific documents from clients',
    group: 'workflows',
    channels: ['sms', 'email', 'whatsapp'],
    defaultChannel: 'email',
    hasTemplates: true,
    additionalSteps: [
      { id: 'select-documents', label: 'Documents', description: 'Select documents to request', title: 'Select Documents', subtitle: 'Choose which documents to request' },
    ],
    stages: [
      { id: 'sent', label: 'Sent' },
      { id: 'delivered', label: 'Delivered' },
      { id: 'opened', label: 'Opened' },
      { id: 'uploading', label: 'Uploading' },
      { id: 'review', label: 'Review' },
      { id: 'complete', label: 'Complete' },
    ],
    clientFlowPath: '/client/document-request/[token]',
  },

  // ===================
  // UNIFIED MESSAGE TYPE (multi-channel freeform)
  // ===================
  'message': {
    id: 'message',
    name: 'Message',
    icon: 'chat_bubble_outline',
    description: 'Send a freeform message to clients',
    group: 'messages',
    channels: ['sms', 'email', 'whatsapp', 'in-app'],
    defaultChannel: 'email',
    hasTemplates: false,
    additionalSteps: [],
    stages: [
      { id: 'sent', label: 'Sent' },
      { id: 'delivered', label: 'Delivered' },
    ],
  },

  // ===================
  // SIMPLE MESSAGE TYPES (no additional steps)
  // ===================
  'sms': {
    id: 'sms',
    name: 'SMS',
    icon: 'sms',
    group: 'messages',
    channels: ['sms'],
    defaultChannel: 'sms',
    hasTemplates: true,
    additionalSteps: [],
    stages: [
      { id: 'sent', label: 'Sent' },
      { id: 'delivered', label: 'Delivered' },
    ],
  },
  'email': {
    id: 'email',
    name: 'Email',
    icon: 'email',
    group: 'messages',
    channels: ['email'],
    defaultChannel: 'email',
    hasTemplates: true,
    additionalSteps: [],
    stages: [
      { id: 'sent', label: 'Sent' },
      { id: 'delivered', label: 'Delivered' },
      { id: 'opened', label: 'Opened' },
    ],
  },
  'whatsapp': {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'chat',
    group: 'messages',
    channels: ['whatsapp'],
    defaultChannel: 'whatsapp',
    hasTemplates: true,
    additionalSteps: [],
    stages: [
      { id: 'sent', label: 'Sent' },
      { id: 'delivered', label: 'Delivered' },
      { id: 'read', label: 'Read' },
    ],
  },
  'in-app': {
    id: 'in-app',
    name: 'In-App Notification',
    icon: 'notifications',
    group: 'messages',
    channels: ['in-app'],
    defaultChannel: 'in-app',
    hasTemplates: true,
    additionalSteps: [],
    stages: [
      { id: 'sent', label: 'Sent' },
      { id: 'delivered', label: 'Delivered' },
      { id: 'read', label: 'Read' },
    ],
  },

};

// Helper functions for CommTypeConfig
export function getCommTypeConfig(typeId: string): CommTypeConfig | undefined {
  return COMM_TYPE_CONFIGS[typeId];
}

export function isWorkflowType(typeId: string): boolean {
  const config = COMM_TYPE_CONFIGS[typeId];
  return config ? config.additionalSteps.length > 0 : false;
}

export function getWizardSteps(typeId: string | null): WizardStep[] {
  const baseSteps: WizardStep[] = [
    { id: 'recipients', label: 'Recipients', description: 'Select clients' },
    { id: 'commtype', label: 'Type', description: 'Choose communication type' },
  ];

  const additionalSteps = typeId
    ? COMM_TYPE_CONFIGS[typeId]?.additionalSteps || []
    : [];

  const finalSteps: WizardStep[] = [
    { id: 'compose', label: 'Compose', description: 'Write your message' },
    { id: 'preview', label: 'Preview', description: 'Review and send' },
  ];

  return [...baseSteps, ...additionalSteps, ...finalSteps];
}

// =============================================================================
// HEALTH (SLA STATUS)
// =============================================================================

export type Health = 'on-track' | 'at-risk' | 'overdue';

export const HEALTH_CONFIG: Record<Health, { label: string; color: string; priority: number }> = {
  'overdue': { label: 'Overdue', color: 'error', priority: 0 },
  'at-risk': { label: 'At Risk', color: 'warning', priority: 1 },
  'on-track': { label: 'On Track', color: 'primary', priority: 2 },
};

// =============================================================================
// CLIENT
// =============================================================================

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  preferredChannel?: Channel;
}

// =============================================================================
// COMMUNICATION
// =============================================================================

/**
 * Per-channel delivery tracking
 * Each channel in a multi-channel flow has its own delivery status
 */
export interface ChannelDeliveryStatus {
  channel: Channel;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  failedAt?: Date;
  failureReason?: string;
}

export interface Communication {
  id: string;
  client: Client;
  commtype: CommtypeId;

  // Multi-channel support: a flow can be sent via multiple channels
  channels: Channel[];
  channelStatus: ChannelDeliveryStatus[];

  stage: string;
  health: Health;

  // Timestamps (flow-level, not channel-level)
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;

  // SLA
  dueDate?: Date;
  daysInCurrentStage: number;

  // Metadata
  subject?: string;
  triggeredBy: 'adviser' | 'assistant' | 'system' | 'client';
  adviserId: string;
}

// Helper to get best delivery status across all channels
export function getFlowDeliveryStatus(comm: Communication): {
  anySent: boolean;
  anyDelivered: boolean;
  anyOpened: boolean;
  allFailed: boolean;
} {
  const statuses = comm.channelStatus;
  return {
    anySent: statuses.some(s => s.sentAt),
    anyDelivered: statuses.some(s => s.deliveredAt),
    anyOpened: statuses.some(s => s.openedAt),
    allFailed: statuses.length > 0 && statuses.every(s => s.failedAt),
  };
}

// =============================================================================
// NOTIFICATIONS (Generated Records)
// =============================================================================

/**
 * A notification generated by a stage transition or health change.
 * Links back to the parent Communication.
 */
export interface Notification {
  id: string;
  communicationId: string;
  stageId: string;
  audience: NotificationAudience;
  nature: NotificationNature;
  title: string;                // Resolved template (placeholders filled)
  body?: string;
  actionLabel?: string;
  actionUrl?: string;           // Deep link: "/comms-hub/communication/{commId}"

  // State
  read: boolean;
  actioned: boolean;            // For transactional: has the action been taken?
  createdAt: Date;
  readAt?: Date;

  // Client delivery (for client-directed notifications sent via channel)
  channel?: Channel;
  deliveredAt?: Date;

  // Context (denormalized for display without joining)
  clientName?: string;
  commtypeName?: string;
  commtypeId?: CommtypeId;
}

/**
 * Health-triggered notifications (global rules, not per-stage).
 * Fire when a Communication's health status changes.
 */
export const HEALTH_NOTIFICATIONS: Record<Health, StageNotificationConfig[]> = {
  'on-track': [],
  'at-risk': [
    { audience: 'adviser', nature: 'informational', titleTemplate: '{commtype} for {client} is at risk' },
  ],
  'overdue': [
    { audience: 'adviser', nature: 'transactional', titleTemplate: '{commtype} for {client} is overdue', actionLabel: 'Send Reminder' },
  ],
};

/**
 * Resolve a notification template by replacing placeholders.
 */
export function resolveNotificationTemplate(
  template: string,
  context: { clientName?: string; commtypeName?: string; adviserName?: string }
): string {
  let result = template;
  if (context.clientName) result = result.replace(/\{client\}/g, context.clientName);
  if (context.commtypeName) result = result.replace(/\{commtype\}/g, context.commtypeName);
  if (context.adviserName) result = result.replace(/\{adviser\}/g, context.adviserName);
  return result;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getCommtype(id: CommtypeId): CommtypeDefinition {
  return COMMTYPES[id];
}

export function getStageLabel(commtypeId: CommtypeId, stageId: string): string {
  const commtype = COMMTYPES[commtypeId];
  const stage = commtype.stages.find(s => s.id === stageId);
  return stage?.label ?? stageId;
}

export function getStageIndex(commtypeId: CommtypeId, stageId: string): number {
  const commtype = COMMTYPES[commtypeId];
  return commtype.stages.findIndex(s => s.id === stageId);
}

export function isTerminalStage(commtypeId: CommtypeId, stageId: string): boolean {
  const terminalStages = ['complete', 'closed', 'expired', 'unsubscribed'];
  return terminalStages.includes(stageId);
}

export function getClientDisplayName(client: Client): string {
  return `${client.firstName} ${client.lastName}`;
}

// =============================================================================
// STATS TYPES
// =============================================================================

export interface CommtypeStats {
  commtype: CommtypeId;
  total: number;
  byHealth: Record<Health, number>;
  byStage: Record<string, number>;
}

export interface OverallStats {
  total: number;
  byHealth: Record<Health, number>;
  byCommtype: Record<CommtypeId, CommtypeStats>;
}

// =============================================================================
// LEGACY INTERACTIONS (Existing System)
// =============================================================================

export type InteractionType =
  | 'email'
  | 'email-annual-review'
  | 'fax'
  | 'gift'
  | 'invitation'
  | 'mail-post'
  | 'meeting-adhoc'
  | 'meeting-annual'
  | 'meeting-introduction'
  | 'meeting-proposal'
  | 'meeting-review'
  | 'other'
  | 'personal'
  | 'quarterly-statements'
  | 'regular-report'
  | 'sms'
  | 'telephonic'
  | 'whatsapp';

export const INTERACTION_TYPES: Record<InteractionType, { label: string; icon: string }> = {
  'email': { label: 'Email', icon: 'email' },
  'email-annual-review': { label: 'Email - Annual Review', icon: 'email' },
  'fax': { label: 'Fax', icon: 'fax' },
  'gift': { label: 'Gift', icon: 'card_giftcard' },
  'invitation': { label: 'Invitation', icon: 'mail' },
  'mail-post': { label: 'Mail (post)', icon: 'local_post_office' },
  'meeting-adhoc': { label: 'Meeting (Ad-hoc)', icon: 'groups' },
  'meeting-annual': { label: 'Meeting (Annual)', icon: 'event' },
  'meeting-introduction': { label: 'Meeting (Introduction)', icon: 'handshake' },
  'meeting-proposal': { label: 'Meeting (Proposal)', icon: 'description' },
  'meeting-review': { label: 'Meeting (Review)', icon: 'rate_review' },
  'other': { label: 'Other', icon: 'more_horiz' },
  'personal': { label: 'Personal', icon: 'person' },
  'quarterly-statements': { label: 'Quarterly Statements', icon: 'summarize' },
  'regular-report': { label: 'Regular report', icon: 'assessment' },
  'sms': { label: 'SMS', icon: 'sms' },
  'telephonic': { label: 'Telephonic', icon: 'phone' },
  'whatsapp': { label: 'WhatsApp', icon: 'chat' },
};

export interface Interaction {
  id: string;
  clientId: string;
  type: InteractionType;
  description: string;
  details?: string;
  interactionDate: Date;
  documentsAttached: number;
  createdBy: string;
  dateLoaded: Date;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  isDeleted?: boolean;
}

// =============================================================================
// CLIENT INFORMATION REQUESTS (Portal Onboarding)
// =============================================================================

export type InfoRequestStatus = 'not-requested' | 'requested' | 'in-progress' | 'complete';

export const INFO_REQUEST_STATUS: Record<InfoRequestStatus, { label: string; color: string }> = {
  'not-requested': { label: 'Not Requested', color: 'neutral' },
  'requested': { label: 'Requested', color: 'warning' },
  'in-progress': { label: 'In Progress', color: 'info' },
  'complete': { label: 'Complete', color: 'success' },
};

export type InfoSection =
  | 'contact-details'
  | 'family-members'
  | 'employment'
  | 'financial'
  | 'tax'
  | 'insurance'
  | 'will-testament';

export const INFO_SECTIONS: Record<InfoSection, { label: string; required: boolean }> = {
  'contact-details': { label: 'Contact details', required: true },
  'family-members': { label: 'Family members', required: true },
  'employment': { label: 'Employment information', required: true },
  'financial': { label: 'Financial information', required: true },
  'tax': { label: 'Tax information', required: true },
  'insurance': { label: 'Insurance (short-term, life, medical)', required: false },
  'will-testament': { label: 'Will & testament', required: false },
};

export type DocumentType =
  | 'id-document'
  | 'proof-of-address'
  | 'bank-statement'
  | 'tax-certificate'
  | 'payslip'
  | 'marriage-certificate';

export const DOCUMENT_TYPES: Record<DocumentType, { label: string }> = {
  'id-document': { label: 'ID Document' },
  'proof-of-address': { label: 'Proof of Address' },
  'bank-statement': { label: 'Bank Statement' },
  'tax-certificate': { label: 'Tax Certificate' },
  'payslip': { label: 'Payslip' },
  'marriage-certificate': { label: 'Marriage Certificate' },
};

export interface InfoRequestSectionProgress {
  sectionId: InfoSection;
  completed: boolean;
  completedAt?: Date;
}

export interface InfoRequest {
  id: string;
  client: Client;
  status: InfoRequestStatus;

  // Configuration (what adviser requested)
  requestedSections: InfoSection[];
  requestedDocuments: DocumentType[];
  notes?: string;

  // Progress tracking
  sectionProgress: InfoRequestSectionProgress[];
  documentsReceived: DocumentType[];

  // Channel used
  channel: Channel;

  // Timestamps
  createdAt: Date;
  sentAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  lastActivityAt?: Date;

  // Adviser
  adviserId: string;
  adviserName: string;
}

// =============================================================================
// NOTES (Adviser Memory Layer)
// =============================================================================

export type NoteContext = 'client' | 'communication' | 'info-request' | 'general';

export interface Note {
  id: string;
  content: string;
  contextType: NoteContext;
  contextId?: string; // ID of the client, communication, or info-request
  clientId?: string; // Always populated for quick lookup
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// PORTAL INVITE (Wealth Portal Access)
// =============================================================================

export type PortalInviteStatus = 'not-invited' | 'invited' | 'opened' | 'password-set' | 'activated';

export const PORTAL_INVITE_STATUS: Record<PortalInviteStatus, { label: string; color: string }> = {
  'not-invited': { label: 'Not Invited', color: 'neutral' },
  'invited': { label: 'Invited', color: 'warning' },
  'opened': { label: 'Opened', color: 'info' },
  'password-set': { label: 'Password Set', color: 'info' },
  'activated': { label: 'Activated', color: 'success' },
};

export interface PortalInvite {
  id: string;
  client: Client;
  status: PortalInviteStatus;

  // Channel used
  channel: Channel;

  // Timestamps
  createdAt: Date;
  sentAt?: Date;
  openedAt?: Date;
  passwordSetAt?: Date;
  activatedAt?: Date;
  lastActivityAt?: Date;

  // Adviser
  adviserId: string;
  adviserName: string;
}

// =============================================================================
// EXTENDED CLIENT (with Info Request status)
// =============================================================================

export interface ClientWithInfoRequest extends Client {
  infoRequest?: InfoRequest;
}

export interface ClientWithPortalInvite extends Client {
  portalInvite?: PortalInvite;
}
