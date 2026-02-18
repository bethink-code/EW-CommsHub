/**
 * Communications Hub Mock Data
 *
 * Realistic sample data using the domain model from types/communications.ts
 * South African client names, real-world scenarios
 */

import {
  Communication,
  ChannelDeliveryStatus,
  Client,
  CommtypeId,
  Channel,
  Health,
  Notification,
  NotificationAudience,
  NotificationNature,
  InfoRequest,
  InfoRequestStatus,
  InfoSection,
  DocumentType,
  Interaction,
  InteractionType,
  PortalInvite,
  PortalInviteStatus,
  getClientDisplayName,
} from '@/types/communications';

// Helper to create channel status from legacy single-channel data
function createChannelStatus(
  channel: Channel,
  sentAt?: Date,
  deliveredAt?: Date,
  openedAt?: Date
): ChannelDeliveryStatus[] {
  return [{ channel, sentAt, deliveredAt, openedAt }];
}

// Helper to create multi-channel status
function createMultiChannelStatus(
  statuses: Array<{ channel: Channel; sentAt?: Date; deliveredAt?: Date; openedAt?: Date }>
): ChannelDeliveryStatus[] {
  return statuses.map(s => ({ channel: s.channel, sentAt: s.sentAt, deliveredAt: s.deliveredAt, openedAt: s.openedAt }));
}

// =============================================================================
// CLIENTS
// =============================================================================

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', firstName: 'Johan', lastName: 'Pretorius', email: 'johan@example.com', phone: '+27 82 123 4567', preferredChannel: 'email' },
  { id: 'c2', firstName: 'Sarah', lastName: 'van der Berg', email: 'sarah@example.com', phone: '+27 83 234 5678', preferredChannel: 'whatsapp' },
  { id: 'c3', firstName: 'Michael', lastName: 'Naidoo', email: 'michael@example.com', phone: '+27 84 345 6789', preferredChannel: 'email' },
  { id: 'c4', firstName: 'Peter', lastName: 'Gillespie', email: 'peter@example.com', phone: '+27 82 456 7890', preferredChannel: 'sms' },
  { id: 'c5', firstName: 'David', lastName: 'Smit', email: 'david@example.com', phone: '+27 83 567 8901', preferredChannel: 'whatsapp' },
  { id: 'c6', firstName: 'Nomsa', lastName: 'Dlamini', email: 'nomsa@example.com', phone: '+27 84 678 9012', preferredChannel: 'email' },
  { id: 'c7', firstName: 'Priya', lastName: 'Govender', email: 'priya@example.com', phone: '+27 82 789 0123', preferredChannel: 'email' },
  { id: 'c8', firstName: 'Thabo', lastName: 'Molefe', email: 'thabo@example.com', phone: '+27 83 890 1234', preferredChannel: 'whatsapp' },
  { id: 'c9', firstName: 'James', lastName: 'Wilson', email: 'james@example.com', phone: '+27 84 901 2345', preferredChannel: 'email' },
  { id: 'c10', firstName: 'Linda', lastName: 'Nkosi', email: 'linda@example.com', phone: '+27 82 012 3456', preferredChannel: 'email' },
  { id: 'c11', firstName: 'Robert', lastName: 'du Plessis', email: 'robert@example.com', phone: '+27 83 123 4567', preferredChannel: 'sms' },
  { id: 'c12', firstName: 'Fatima', lastName: 'Patel', email: 'fatima@example.com', phone: '+27 84 234 5678', preferredChannel: 'whatsapp' },
  { id: 'c13', firstName: 'André', lastName: 'Botha', email: 'andre@example.com', phone: '+27 82 345 6789', preferredChannel: 'email' },
  { id: 'c14', firstName: 'Grace', lastName: 'Mthembu', email: 'grace@example.com', phone: '+27 83 456 7890', preferredChannel: 'whatsapp' },
  { id: 'c15', firstName: 'Willem', lastName: 'Jacobs', email: 'willem@example.com', phone: '+27 84 567 8901', preferredChannel: 'email' },
  { id: 'c16', firstName: 'Sipho', lastName: 'Zulu', email: 'sipho@example.com', phone: '+27 82 678 9012', preferredChannel: 'sms' },
  { id: 'c17', firstName: 'Emma', lastName: 'Kruger', email: 'emma@example.com', phone: '+27 83 789 0123', preferredChannel: 'email' },
];

// =============================================================================
// COMMUNICATIONS
// =============================================================================

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

export const MOCK_COMMUNICATIONS: Communication[] = [
  // Document Requests - various stages
  // Multi-channel example: sent via email AND sms
  {
    id: 'comm-1',
    client: MOCK_CLIENTS[0], // Johan Pretorius
    commtype: 'document-request',
    channels: ['email', 'sms'],
    channelStatus: createMultiChannelStatus([
      { channel: 'email', sentAt: daysAgo(10), deliveredAt: daysAgo(10), openedAt: daysAgo(7) },
      { channel: 'sms', sentAt: daysAgo(10), deliveredAt: daysAgo(10) },
    ]),
    stage: 'opened',
    health: 'overdue',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(7),
    dueDate: daysAgo(3),
    daysInCurrentStage: 7,
    subject: 'Tax certificates required',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  // Multi-channel: whatsapp + in-app notification
  {
    id: 'comm-2',
    client: MOCK_CLIENTS[1], // Sarah van der Berg
    commtype: 'document-request',
    channels: ['whatsapp', 'in-app'],
    channelStatus: createMultiChannelStatus([
      { channel: 'whatsapp', sentAt: daysAgo(8), deliveredAt: daysAgo(8), openedAt: daysAgo(6) },
      { channel: 'in-app', sentAt: daysAgo(8), deliveredAt: daysAgo(8) },
    ]),
    stage: 'reminded',
    health: 'overdue',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(5),
    dueDate: daysAgo(2),
    daysInCurrentStage: 5,
    subject: 'ID document copy',
    triggeredBy: 'assistant',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-5',
    client: MOCK_CLIENTS[4], // David Smit
    commtype: 'document-request',
    channels: ['whatsapp'],
    channelStatus: createChannelStatus('whatsapp', daysAgo(5), daysAgo(5), daysAgo(4)),
    stage: 'uploaded',
    health: 'on-track',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    dueDate: daysAgo(-2),
    daysInCurrentStage: 1,
    subject: 'Bank statements',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-6',
    client: MOCK_CLIENTS[5], // Nomsa Dlamini
    commtype: 'document-request',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(2)),
    stage: 'sent',
    health: 'on-track',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    dueDate: daysAgo(-5),
    daysInCurrentStage: 2,
    subject: 'Proof of residence',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-10',
    client: MOCK_CLIENTS[9], // Linda Nkosi
    commtype: 'document-request',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(4), daysAgo(4), daysAgo(2)),
    stage: 'opened',
    health: 'on-track',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
    dueDate: daysAgo(-3),
    daysInCurrentStage: 2,
    subject: 'Employment verification',
    triggeredBy: 'assistant',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-13',
    client: MOCK_CLIENTS[12], // André Botha
    commtype: 'document-request',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(1), daysAgo(1)),
    stage: 'delivered',
    health: 'on-track',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    dueDate: daysAgo(-6),
    daysInCurrentStage: 1,
    subject: 'Investment statements',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-17',
    client: MOCK_CLIENTS[16], // Emma Kruger
    commtype: 'document-request',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(1)),
    stage: 'sent',
    health: 'on-track',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    dueDate: daysAgo(-6),
    daysInCurrentStage: 1,
    subject: 'Insurance policy',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-18',
    client: MOCK_CLIENTS[3], // Peter Gillespie
    commtype: 'document-request',
    channels: ['sms'],
    channelStatus: createChannelStatus('sms', daysAgo(14), daysAgo(14), daysAgo(12)),
    stage: 'complete',
    health: 'on-track',
    createdAt: daysAgo(14),
    updatedAt: daysAgo(0),
    completedAt: daysAgo(0),
    daysInCurrentStage: 0,
    subject: 'FICA documents',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },

  // Onboarding - various stages
  // Multi-channel: email + in-app
  {
    id: 'comm-3',
    client: MOCK_CLIENTS[2], // Michael Naidoo
    commtype: 'onboarding',
    channels: ['email', 'in-app'],
    channelStatus: createMultiChannelStatus([
      { channel: 'email', sentAt: daysAgo(9), deliveredAt: daysAgo(9) },
      { channel: 'in-app', sentAt: daysAgo(9), deliveredAt: daysAgo(9) },
    ]),
    stage: 'started',
    health: 'overdue',
    createdAt: daysAgo(9),
    updatedAt: daysAgo(6),
    dueDate: daysAgo(2),
    daysInCurrentStage: 6,
    subject: 'Welcome to Elite Wealth',
    triggeredBy: 'system',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-4',
    client: MOCK_CLIENTS[3], // Peter Gillespie
    commtype: 'onboarding',
    channels: ['sms'],
    channelStatus: createChannelStatus('sms', daysAgo(21), daysAgo(21)),
    stage: 'complete',
    health: 'on-track',
    createdAt: daysAgo(21),
    updatedAt: daysAgo(0),
    completedAt: daysAgo(0),
    daysInCurrentStage: 0,
    subject: 'Welcome to Elite Wealth',
    triggeredBy: 'system',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-8',
    client: MOCK_CLIENTS[7], // Thabo Molefe
    commtype: 'onboarding',
    channels: ['whatsapp'],
    channelStatus: createChannelStatus('whatsapp', daysAgo(7), daysAgo(7)),
    stage: 'in-progress',
    health: 'at-risk',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(4),
    dueDate: daysAgo(-1),
    daysInCurrentStage: 4,
    subject: 'Welcome to Elite Wealth',
    triggeredBy: 'system',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-12',
    client: MOCK_CLIENTS[11], // Fatima Patel
    commtype: 'onboarding',
    channels: ['whatsapp'],
    channelStatus: createChannelStatus('whatsapp', daysAgo(6), daysAgo(6)),
    stage: 'in-progress',
    health: 'at-risk',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(3),
    dueDate: daysAgo(0),
    daysInCurrentStage: 3,
    subject: 'Welcome to Elite Wealth',
    triggeredBy: 'system',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-16',
    client: MOCK_CLIENTS[15], // Sipho Zulu
    commtype: 'onboarding',
    channels: ['sms'],
    channelStatus: createChannelStatus('sms', daysAgo(18), daysAgo(18)),
    stage: 'complete',
    health: 'on-track',
    createdAt: daysAgo(18),
    updatedAt: daysAgo(2),
    completedAt: daysAgo(2),
    daysInCurrentStage: 0,
    subject: 'Welcome to Elite Wealth',
    triggeredBy: 'system',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-19',
    client: MOCK_CLIENTS[9], // Linda Nkosi
    commtype: 'onboarding',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(1)),
    stage: 'sent',
    health: 'on-track',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    daysInCurrentStage: 1,
    subject: 'Welcome to Elite Wealth',
    triggeredBy: 'system',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-20',
    client: MOCK_CLIENTS[12], // André Botha
    commtype: 'onboarding',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(2), daysAgo(2)),
    stage: 'delivered',
    health: 'on-track',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    daysInCurrentStage: 2,
    subject: 'Welcome to Elite Wealth',
    triggeredBy: 'system',
    adviserId: 'adv-1',
  },

  // Wealth Portal
  {
    id: 'comm-7',
    client: MOCK_CLIENTS[6], // Priya Govender
    commtype: 'wealth-portal',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(5), daysAgo(5), daysAgo(3)),
    stage: 'activated',
    health: 'on-track',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(0),
    daysInCurrentStage: 0,
    subject: 'Access your Wealth Portal',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  // Multi-channel: sms + email
  {
    id: 'comm-11',
    client: MOCK_CLIENTS[10], // Robert du Plessis
    commtype: 'wealth-portal',
    channels: ['sms', 'email'],
    channelStatus: createMultiChannelStatus([
      { channel: 'sms', sentAt: daysAgo(1), deliveredAt: daysAgo(1) },
      { channel: 'email', sentAt: daysAgo(1) },
    ]),
    stage: 'sent',
    health: 'on-track',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    daysInCurrentStage: 1,
    subject: 'Access your Wealth Portal',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-15',
    client: MOCK_CLIENTS[14], // Willem Jacobs
    commtype: 'wealth-portal',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(6), daysAgo(5)),
    stage: 'delivered',
    health: 'at-risk',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(5),
    dueDate: daysAgo(0),
    daysInCurrentStage: 5,
    subject: 'Access your Wealth Portal',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-21',
    client: MOCK_CLIENTS[4], // David Smit
    commtype: 'wealth-portal',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(20), daysAgo(20), daysAgo(18)),
    stage: 'complete',
    health: 'on-track',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(10),
    completedAt: daysAgo(10),
    daysInCurrentStage: 0,
    subject: 'Access your Wealth Portal',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-22',
    client: MOCK_CLIENTS[0], // Johan Pretorius
    commtype: 'wealth-portal',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(4), daysAgo(4), daysAgo(2)),
    stage: 'opened',
    health: 'on-track',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
    daysInCurrentStage: 2,
    subject: 'Access your Wealth Portal',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },

  // Free Format
  {
    id: 'comm-9',
    client: MOCK_CLIENTS[8], // James Wilson
    commtype: 'free-format',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(4)),
    stage: 'sent',
    health: 'at-risk',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(3),
    dueDate: daysAgo(0),
    daysInCurrentStage: 3,
    subject: 'Portfolio review meeting request',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-14',
    client: MOCK_CLIENTS[13], // Grace Mthembu
    commtype: 'free-format',
    channels: ['whatsapp'],
    channelStatus: createChannelStatus('whatsapp', daysAgo(2), daysAgo(2), daysAgo(0)),
    stage: 'opened',
    health: 'on-track',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(0),
    daysInCurrentStage: 0,
    subject: 'Market update',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-23',
    client: MOCK_CLIENTS[1], // Sarah van der Berg
    commtype: 'free-format',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(5), daysAgo(5), daysAgo(4)),
    stage: 'responded',
    health: 'on-track',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    daysInCurrentStage: 1,
    subject: 'Investment strategy discussion',
    triggeredBy: 'adviser',
    adviserId: 'adv-1',
  },

  // Birthday touchpoints - multi-channel: whatsapp + in-app
  {
    id: 'comm-24',
    client: MOCK_CLIENTS[6], // Priya Govender
    commtype: 'birthday',
    channels: ['whatsapp', 'in-app'],
    channelStatus: createMultiChannelStatus([
      { channel: 'whatsapp', sentAt: daysAgo(0), deliveredAt: daysAgo(0) },
      { channel: 'in-app', sentAt: daysAgo(0), deliveredAt: daysAgo(0) },
    ]),
    stage: 'delivered',
    health: 'on-track',
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    daysInCurrentStage: 0,
    subject: 'Happy Birthday!',
    triggeredBy: 'system',
    adviserId: 'adv-1',
  },
  {
    id: 'comm-25',
    client: MOCK_CLIENTS[16], // Emma Kruger
    commtype: 'birthday',
    channels: ['whatsapp'],
    channelStatus: createChannelStatus('whatsapp', daysAgo(3), daysAgo(3), daysAgo(3)),
    stage: 'opened',
    health: 'on-track',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    daysInCurrentStage: 0,
    subject: 'Happy Birthday!',
    triggeredBy: 'system',
    adviserId: 'adv-1',
  },

  // Password Reset — client-initiated, completed quickly
  {
    id: 'comm-26',
    client: MOCK_CLIENTS[7], // Thabo Molefe
    commtype: 'password-reset',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(2), daysAgo(2), daysAgo(2)),
    stage: 'password-reset',
    health: 'on-track',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    daysInCurrentStage: 0,
    subject: 'Password reset',
    triggeredBy: 'client',
    adviserId: 'adv-1',
  },
  // Password Reset — in progress, client clicked link but hasn't set new password yet
  {
    id: 'comm-27',
    client: MOCK_CLIENTS[9], // Linda Nkosi
    commtype: 'password-reset',
    channels: ['email'],
    channelStatus: createChannelStatus('email', daysAgo(1), daysAgo(1), daysAgo(0)),
    stage: 'link-opened',
    health: 'on-track',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(0),
    daysInCurrentStage: 0,
    subject: 'Password reset',
    triggeredBy: 'client',
    adviserId: 'adv-1',
  },
  // Password Reset — expired, client never clicked the link
  {
    id: 'comm-28',
    client: MOCK_CLIENTS[15], // Sipho Zulu
    commtype: 'password-reset',
    channels: ['email', 'sms'],
    channelStatus: createMultiChannelStatus([
      { channel: 'email', sentAt: daysAgo(4), deliveredAt: daysAgo(4) },
      { channel: 'sms', sentAt: daysAgo(4), deliveredAt: daysAgo(4) },
    ]),
    stage: 'expired',
    health: 'overdue',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(0),
    daysInCurrentStage: 0,
    subject: 'Password reset',
    triggeredBy: 'client',
    adviserId: 'adv-1',
  },
];

// =============================================================================
// HELPER FUNCTIONS FOR STATS
// =============================================================================

export function getActiveComms(): Communication[] {
  return MOCK_COMMUNICATIONS.filter(c => !isTerminalStage(c.stage));
}

export function getHealthCounts(comms: Communication[]): Record<Health, number> {
  return comms.reduce((acc, c) => {
    acc[c.health] = (acc[c.health] || 0) + 1;
    return acc;
  }, {} as Record<Health, number>);
}

export function getCommtypeCounts(comms: Communication[]): Record<CommtypeId, number> {
  return comms.reduce((acc, c) => {
    acc[c.commtype] = (acc[c.commtype] || 0) + 1;
    return acc;
  }, {} as Record<CommtypeId, number>);
}

export function getStageCounts(comms: Communication[], commtype: CommtypeId): Record<string, number> {
  return comms
    .filter(c => c.commtype === commtype)
    .reduce((acc, c) => {
      acc[c.stage] = (acc[c.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
}

function isTerminalStage(stage: string): boolean {
  const terminalStages = ['complete', 'closed', 'expired', 'unsubscribed'];
  return terminalStages.includes(stage);
}

// =============================================================================
// WORK QUEUE STATS (Adviser's action-oriented view)
// =============================================================================

export interface WorkQueueStats {
  newActivity: number;      // Client responses/uploads adviser hasn't seen
  needsReview: number;      // Documents/replies awaiting adviser action
  awaitingClient: number;   // Ball in client's court
  overdue: number;          // Past SLA, needs follow-up
}

/**
 * Get work queue stats for the adviser dashboard
 * These represent actionable items, not just status counts
 */
export function getWorkQueueStats(comms: Communication[]): WorkQueueStats {
  const activeComms = comms.filter(c => !isTerminalStage(c.stage));

  // New Activity: Recent client actions (uploaded, responded) in last 24 hours
  // In real app, this would check if adviser has "seen" the activity
  const newActivity = activeComms.filter(c => {
    const recentStages = ['uploaded', 'responded', 'activated'];
    return recentStages.includes(c.stage) && c.daysInCurrentStage <= 1;
  }).length;

  // Needs Review: Documents uploaded or replies received awaiting adviser action
  const needsReview = activeComms.filter(c => {
    const reviewStages = ['uploaded', 'responded', 'review'];
    return reviewStages.includes(c.stage);
  }).length;

  // Awaiting Client: Ball in their court - waiting for client to act
  const awaitingClient = activeComms.filter(c => {
    const waitingStages = ['sent', 'delivered', 'opened', 'reminded', 'started', 'in-progress'];
    return waitingStages.includes(c.stage);
  }).length;

  // Overdue: Past SLA
  const overdue = activeComms.filter(c => c.health === 'overdue').length;

  return {
    newActivity,
    needsReview,
    awaitingClient,
    overdue,
  };
}

// =============================================================================
// CLIENT INFORMATION REQUESTS (Portal Onboarding)
// =============================================================================

export const MOCK_INFO_REQUESTS: InfoRequest[] = [
  // Not Requested - Peter Gillespie
  {
    id: 'ir-1',
    client: MOCK_CLIENTS[3], // Peter Gillespie
    status: 'not-requested',
    requestedSections: [],
    requestedDocuments: [],
    sectionProgress: [],
    documentsReceived: [],
    channel: 'sms',
    createdAt: daysAgo(0),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Requested - Sarah van der Berg (sent 2 days ago)
  {
    id: 'ir-2',
    client: MOCK_CLIENTS[1], // Sarah van der Berg
    status: 'requested',
    requestedSections: ['contact-details', 'family-members', 'employment', 'financial', 'tax'],
    requestedDocuments: ['id-document', 'proof-of-address', 'bank-statement'],
    sectionProgress: [],
    documentsReceived: [],
    channel: 'whatsapp',
    createdAt: daysAgo(3),
    sentAt: daysAgo(2),
    lastActivityAt: daysAgo(2),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // In Progress - Michael Naidoo (last active yesterday)
  {
    id: 'ir-3',
    client: MOCK_CLIENTS[2], // Michael Naidoo
    status: 'in-progress',
    requestedSections: ['contact-details', 'family-members', 'employment', 'financial', 'tax'],
    requestedDocuments: ['id-document', 'proof-of-address'],
    sectionProgress: [
      { sectionId: 'contact-details', completed: true, completedAt: daysAgo(3) },
      { sectionId: 'family-members', completed: true, completedAt: daysAgo(2) },
      { sectionId: 'employment', completed: true, completedAt: daysAgo(1) },
      { sectionId: 'financial', completed: false }, // Current section
      { sectionId: 'tax', completed: false },
    ],
    documentsReceived: [],
    channel: 'email',
    createdAt: daysAgo(5),
    sentAt: daysAgo(5),
    startedAt: daysAgo(3),
    lastActivityAt: daysAgo(1),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Complete - Lisa Thompson (completed 5 Dec)
  {
    id: 'ir-4',
    client: { id: 'c18', firstName: 'Lisa', lastName: 'Thompson', email: 'lisa.t@company.com', phone: '+27 72 987 6543', preferredChannel: 'email' },
    status: 'complete',
    requestedSections: ['contact-details', 'family-members', 'employment', 'financial'],
    requestedDocuments: ['id-document', 'proof-of-address', 'bank-statement'],
    sectionProgress: [
      { sectionId: 'contact-details', completed: true, completedAt: daysAgo(65) },
      { sectionId: 'family-members', completed: true, completedAt: daysAgo(64) },
      { sectionId: 'employment', completed: true, completedAt: daysAgo(63) },
      { sectionId: 'financial', completed: true, completedAt: daysAgo(62) },
    ],
    documentsReceived: ['id-document', 'proof-of-address', 'bank-statement'],
    channel: 'email',
    createdAt: daysAgo(70),
    sentAt: daysAgo(70),
    startedAt: daysAgo(66),
    completedAt: daysAgo(60), // ~Dec 5
    lastActivityAt: daysAgo(60),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Not Requested - Johan Pretorius
  {
    id: 'ir-5',
    client: MOCK_CLIENTS[0], // Johan Pretorius
    status: 'not-requested',
    requestedSections: [],
    requestedDocuments: [],
    sectionProgress: [],
    documentsReceived: [],
    channel: 'email',
    createdAt: daysAgo(0),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // In Progress - Priya Govender
  {
    id: 'ir-6',
    client: MOCK_CLIENTS[6], // Priya Govender
    status: 'in-progress',
    requestedSections: ['contact-details', 'family-members', 'financial', 'tax', 'insurance'],
    requestedDocuments: ['id-document', 'tax-certificate'],
    sectionProgress: [
      { sectionId: 'contact-details', completed: true, completedAt: daysAgo(2) },
      { sectionId: 'family-members', completed: false }, // Current
      { sectionId: 'financial', completed: false },
      { sectionId: 'tax', completed: false },
      { sectionId: 'insurance', completed: false },
    ],
    documentsReceived: [],
    channel: 'email',
    createdAt: daysAgo(4),
    sentAt: daysAgo(4),
    startedAt: daysAgo(2),
    lastActivityAt: daysAgo(2),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Requested - Thabo Molefe
  {
    id: 'ir-7',
    client: MOCK_CLIENTS[7], // Thabo Molefe
    status: 'requested',
    requestedSections: ['contact-details', 'employment', 'financial'],
    requestedDocuments: ['id-document', 'payslip'],
    sectionProgress: [],
    documentsReceived: [],
    channel: 'whatsapp',
    createdAt: daysAgo(1),
    sentAt: daysAgo(1),
    lastActivityAt: daysAgo(1),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
];

// Add Lisa Thompson to clients if not exists
export const MOCK_CLIENTS_WITH_LISA: Client[] = [
  ...MOCK_CLIENTS,
  { id: 'c18', firstName: 'Lisa', lastName: 'Thompson', email: 'lisa.t@company.com', phone: '+27 72 987 6543', preferredChannel: 'email' },
];

// =============================================================================
// LEGACY INTERACTIONS
// =============================================================================

export const MOCK_INTERACTIONS: Interaction[] = [
  {
    id: 'int-1',
    clientId: 'c1', // Johan Pretorius
    type: 'email',
    description: 'Annual review reminder',
    details: 'Sent reminder about upcoming annual review meeting',
    interactionDate: daysAgo(5),
    documentsAttached: 0,
    createdBy: 'Garth Shoebridge',
    dateLoaded: daysAgo(5),
    lastModifiedBy: 'Garth Shoebridge',
    lastModifiedDate: daysAgo(5),
  },
  {
    id: 'int-2',
    clientId: 'c1', // Johan Pretorius
    type: 'meeting-annual',
    description: 'Annual review 2024',
    details: 'Discussed portfolio performance, adjusted risk profile, reviewed retirement goals',
    interactionDate: daysAgo(2),
    documentsAttached: 2,
    createdBy: 'Rassie du Preez',
    dateLoaded: daysAgo(2),
    lastModifiedBy: 'Rassie du Preez',
    lastModifiedDate: daysAgo(1),
  },
  {
    id: 'int-3',
    clientId: 'c2', // Sarah van der Berg
    type: 'telephonic',
    description: 'Query about statement',
    details: 'Client called to clarify investment statement. Explained the fee structure.',
    interactionDate: daysAgo(7),
    documentsAttached: 0,
    createdBy: 'Garth Shoebridge',
    dateLoaded: daysAgo(7),
    lastModifiedBy: 'Garth Shoebridge',
    lastModifiedDate: daysAgo(7),
  },
  {
    id: 'int-4',
    clientId: 'c3', // Michael Naidoo
    type: 'email-annual-review',
    description: 'test',
    details: '',
    interactionDate: daysAgo(0),
    documentsAttached: 1,
    createdBy: 'Garth Shoebridge',
    dateLoaded: daysAgo(0),
    lastModifiedBy: 'Garth Shoebridge',
    lastModifiedDate: daysAgo(0),
  },
  {
    id: 'int-5',
    clientId: 'c4', // Peter Gillespie
    type: 'meeting-introduction',
    description: 'Initial consultation',
    details: 'First meeting with new client. Discussed financial goals and risk tolerance.',
    interactionDate: daysAgo(30),
    documentsAttached: 1,
    createdBy: 'Rassie du Preez',
    dateLoaded: daysAgo(30),
    lastModifiedBy: 'Rassie du Preez',
    lastModifiedDate: daysAgo(30),
  },
  {
    id: 'int-6',
    clientId: 'c4', // Peter Gillespie
    type: 'whatsapp',
    description: 'Follow-up on documents',
    details: 'Reminded client to submit FICA documents',
    interactionDate: daysAgo(14),
    documentsAttached: 0,
    createdBy: 'Rassie du Preez',
    dateLoaded: daysAgo(14),
    lastModifiedBy: 'Rassie du Preez',
    lastModifiedDate: daysAgo(14),
  },
];

// =============================================================================
// INFO REQUEST HELPER FUNCTIONS
// =============================================================================

export function getInfoRequestStats(requests: InfoRequest[]) {
  return {
    total: requests.length,
    notRequested: requests.filter(r => r.status === 'not-requested').length,
    requested: requests.filter(r => r.status === 'requested').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    complete: requests.filter(r => r.status === 'complete').length,
  };
}

export function getInfoRequestProgress(request: InfoRequest): { completed: number; total: number } {
  const total = request.requestedSections.length;
  const completed = request.sectionProgress.filter(s => s.completed).length;
  return { completed, total };
}

export function getCurrentSection(request: InfoRequest): InfoSection | null {
  const incomplete = request.sectionProgress.find(s => !s.completed);
  return incomplete?.sectionId ?? null;
}

// =============================================================================
// PORTAL INVITES (Wealth Portal Access)
// =============================================================================

export const MOCK_PORTAL_INVITES: PortalInvite[] = [
  // Not Invited - Johan Pretorius
  {
    id: 'pi-1',
    client: MOCK_CLIENTS[0], // Johan Pretorius
    status: 'not-invited',
    channel: 'email',
    createdAt: daysAgo(0),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Invited - Sarah van der Berg
  {
    id: 'pi-2',
    client: MOCK_CLIENTS[1], // Sarah van der Berg
    status: 'invited',
    channel: 'whatsapp',
    createdAt: daysAgo(3),
    sentAt: daysAgo(2),
    lastActivityAt: daysAgo(2),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Opened - Michael Naidoo
  {
    id: 'pi-3',
    client: MOCK_CLIENTS[2], // Michael Naidoo
    status: 'opened',
    channel: 'email',
    createdAt: daysAgo(5),
    sentAt: daysAgo(5),
    openedAt: daysAgo(3),
    lastActivityAt: daysAgo(3),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Password Set - Peter Gillespie
  {
    id: 'pi-4',
    client: MOCK_CLIENTS[3], // Peter Gillespie
    status: 'password-set',
    channel: 'sms',
    createdAt: daysAgo(7),
    sentAt: daysAgo(7),
    openedAt: daysAgo(6),
    passwordSetAt: daysAgo(1),
    lastActivityAt: daysAgo(1),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Activated - David Smit
  {
    id: 'pi-5',
    client: MOCK_CLIENTS[4], // David Smit
    status: 'activated',
    channel: 'email',
    createdAt: daysAgo(30),
    sentAt: daysAgo(30),
    openedAt: daysAgo(28),
    passwordSetAt: daysAgo(27),
    activatedAt: daysAgo(25),
    lastActivityAt: daysAgo(2),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Activated - Priya Govender
  {
    id: 'pi-6',
    client: MOCK_CLIENTS[6], // Priya Govender
    status: 'activated',
    channel: 'email',
    createdAt: daysAgo(60),
    sentAt: daysAgo(60),
    openedAt: daysAgo(58),
    passwordSetAt: daysAgo(58),
    activatedAt: daysAgo(55),
    lastActivityAt: daysAgo(0),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Invited - Thabo Molefe
  {
    id: 'pi-7',
    client: MOCK_CLIENTS[7], // Thabo Molefe
    status: 'invited',
    channel: 'whatsapp',
    createdAt: daysAgo(1),
    sentAt: daysAgo(1),
    lastActivityAt: daysAgo(1),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
  // Not Invited - Linda Nkosi
  {
    id: 'pi-8',
    client: MOCK_CLIENTS[9], // Linda Nkosi
    status: 'not-invited',
    channel: 'email',
    createdAt: daysAgo(0),
    adviserId: 'adv-1',
    adviserName: 'Rassie du Preez',
  },
];

// =============================================================================
// NOTIFICATIONS (Generated from stage transitions)
// =============================================================================

/**
 * Mock notifications — simulating what the system would generate as
 * Communications progress through their stages. Mix of:
 * - adviser + client audience
 * - informational + transactional nature
 * - read + unread state
 * - various commtypes and recency
 */
export const MOCK_NOTIFICATIONS: Notification[] = [
  // --- Recent / unread adviser notifications ---
  {
    id: 'notif-1',
    communicationId: 'comm-5',
    stageId: 'uploaded',
    audience: 'adviser',
    nature: 'transactional',
    title: 'David Smit has uploaded documents',
    body: 'Bank statements have been uploaded and are ready for your review.',
    actionLabel: 'Review Documents',
    actionUrl: '/comms-hub/communication/comm-5',
    read: false,
    actioned: false,
    createdAt: daysAgo(1),
    clientName: 'David Smit',
    commtypeName: 'Document Request',
    commtypeId: 'document-request',
  },
  {
    id: 'notif-2',
    communicationId: 'comm-23',
    stageId: 'responded',
    audience: 'adviser',
    nature: 'transactional',
    title: 'Sarah van der Berg has responded to your message',
    body: 'Re: Investment strategy discussion',
    actionLabel: 'View Response',
    actionUrl: '/comms-hub/communication/comm-23',
    read: false,
    actioned: false,
    createdAt: daysAgo(1),
    clientName: 'Sarah van der Berg',
    commtypeName: 'Free Format',
    commtypeId: 'free-format',
  },
  {
    id: 'notif-3',
    communicationId: 'comm-7',
    stageId: 'activated',
    audience: 'adviser',
    nature: 'informational',
    title: 'Priya Govender has activated their Wealth Portal',
    read: false,
    actioned: false,
    createdAt: daysAgo(0),
    clientName: 'Priya Govender',
    commtypeName: 'Wealth Portal',
    commtypeId: 'wealth-portal',
  },
  {
    id: 'notif-4',
    communicationId: 'comm-24',
    stageId: 'delivered',
    audience: 'adviser',
    nature: 'informational',
    title: 'Birthday message delivered to Priya Govender',
    read: false,
    actioned: false,
    createdAt: daysAgo(0),
    clientName: 'Priya Govender',
    commtypeName: 'Birthday',
    commtypeId: 'birthday',
  },
  // Health-triggered: overdue
  {
    id: 'notif-5',
    communicationId: 'comm-1',
    stageId: 'opened',
    audience: 'adviser',
    nature: 'transactional',
    title: 'Document Request for Johan Pretorius is overdue',
    body: 'Tax certificates required — client opened 7 days ago but has not uploaded.',
    actionLabel: 'Send Reminder',
    actionUrl: '/comms-hub/communication/comm-1',
    read: false,
    actioned: false,
    createdAt: daysAgo(0),
    clientName: 'Johan Pretorius',
    commtypeName: 'Document Request',
    commtypeId: 'document-request',
  },
  {
    id: 'notif-6',
    communicationId: 'comm-3',
    stageId: 'started',
    audience: 'adviser',
    nature: 'transactional',
    title: 'Onboarding for Michael Naidoo is overdue',
    body: 'Client started onboarding 6 days ago but has not progressed.',
    actionLabel: 'Send Reminder',
    actionUrl: '/comms-hub/communication/comm-3',
    read: false,
    actioned: false,
    createdAt: daysAgo(0),
    clientName: 'Michael Naidoo',
    commtypeName: 'Onboarding',
    commtypeId: 'onboarding',
  },

  // --- Read adviser notifications (older) ---
  {
    id: 'notif-7',
    communicationId: 'comm-3',
    stageId: 'started',
    audience: 'adviser',
    nature: 'informational',
    title: 'Michael Naidoo has started their onboarding',
    read: true,
    actioned: false,
    createdAt: daysAgo(6),
    readAt: daysAgo(5),
    clientName: 'Michael Naidoo',
    commtypeName: 'Onboarding',
    commtypeId: 'onboarding',
  },
  {
    id: 'notif-8',
    communicationId: 'comm-1',
    stageId: 'opened',
    audience: 'adviser',
    nature: 'informational',
    title: 'Johan Pretorius opened the document request',
    read: true,
    actioned: false,
    createdAt: daysAgo(7),
    readAt: daysAgo(6),
    clientName: 'Johan Pretorius',
    commtypeName: 'Document Request',
    commtypeId: 'document-request',
  },
  {
    id: 'notif-9',
    communicationId: 'comm-22',
    stageId: 'opened',
    audience: 'adviser',
    nature: 'informational',
    title: 'Johan Pretorius opened the Wealth Portal invite',
    read: true,
    actioned: false,
    createdAt: daysAgo(2),
    readAt: daysAgo(2),
    clientName: 'Johan Pretorius',
    commtypeName: 'Wealth Portal',
    commtypeId: 'wealth-portal',
  },
  {
    id: 'notif-10',
    communicationId: 'comm-14',
    stageId: 'opened',
    audience: 'adviser',
    nature: 'informational',
    title: 'Grace Mthembu opened your message',
    read: true,
    actioned: false,
    createdAt: daysAgo(0),
    readAt: daysAgo(0),
    clientName: 'Grace Mthembu',
    commtypeName: 'Free Format',
    commtypeId: 'free-format',
  },
  {
    id: 'notif-11',
    communicationId: 'comm-25',
    stageId: 'opened',
    audience: 'adviser',
    nature: 'informational',
    title: 'Emma Kruger opened their birthday message',
    read: true,
    actioned: false,
    createdAt: daysAgo(3),
    readAt: daysAgo(3),
    clientName: 'Emma Kruger',
    commtypeName: 'Birthday',
    commtypeId: 'birthday',
  },
  // Health-triggered: at-risk (read)
  {
    id: 'notif-12',
    communicationId: 'comm-8',
    stageId: 'in-progress',
    audience: 'adviser',
    nature: 'informational',
    title: 'Onboarding for Thabo Molefe is at risk',
    body: 'Client has been in progress for 4 days.',
    read: true,
    actioned: false,
    createdAt: daysAgo(2),
    readAt: daysAgo(1),
    clientName: 'Thabo Molefe',
    commtypeName: 'Onboarding',
    commtypeId: 'onboarding',
  },
  {
    id: 'notif-13',
    communicationId: 'comm-15',
    stageId: 'delivered',
    audience: 'adviser',
    nature: 'informational',
    title: 'Wealth Portal for Willem Jacobs is at risk',
    body: 'Portal invite delivered 5 days ago, not yet opened.',
    read: true,
    actioned: false,
    createdAt: daysAgo(1),
    readAt: daysAgo(0),
    clientName: 'Willem Jacobs',
    commtypeName: 'Wealth Portal',
    commtypeId: 'wealth-portal',
  },
  // Completed comm notification (actioned)
  {
    id: 'notif-14',
    communicationId: 'comm-18',
    stageId: 'complete',
    audience: 'adviser',
    nature: 'informational',
    title: 'Document request for Peter Gillespie is complete',
    read: true,
    actioned: true,
    createdAt: daysAgo(0),
    readAt: daysAgo(0),
    clientName: 'Peter Gillespie',
    commtypeName: 'Document Request',
    commtypeId: 'document-request',
  },
  {
    id: 'notif-15',
    communicationId: 'comm-4',
    stageId: 'complete',
    audience: 'adviser',
    nature: 'informational',
    title: 'Onboarding complete for Peter Gillespie',
    read: true,
    actioned: true,
    createdAt: daysAgo(0),
    readAt: daysAgo(0),
    clientName: 'Peter Gillespie',
    commtypeName: 'Onboarding',
    commtypeId: 'onboarding',
  },

  // --- Client-directed notifications (adviser can see what was sent) ---
  {
    id: 'notif-16',
    communicationId: 'comm-5',
    stageId: 'uploaded',
    audience: 'client',
    nature: 'informational',
    title: 'We have received your documents',
    channel: 'email',
    deliveredAt: daysAgo(1),
    read: true,
    actioned: false,
    createdAt: daysAgo(1),
    clientName: 'David Smit',
    commtypeName: 'Document Request',
    commtypeId: 'document-request',
  },
  {
    id: 'notif-17',
    communicationId: 'comm-2',
    stageId: 'reminded',
    audience: 'client',
    nature: 'transactional',
    title: 'Reminder: please upload your documents',
    channel: 'whatsapp',
    deliveredAt: daysAgo(5),
    read: true,
    actioned: false,
    createdAt: daysAgo(5),
    clientName: 'Sarah van der Berg',
    commtypeName: 'Document Request',
    commtypeId: 'document-request',
  },
  {
    id: 'notif-18',
    communicationId: 'comm-7',
    stageId: 'activated',
    audience: 'client',
    nature: 'informational',
    title: 'Your Wealth Portal is now active',
    channel: 'email',
    deliveredAt: daysAgo(0),
    read: true,
    actioned: false,
    createdAt: daysAgo(0),
    clientName: 'Priya Govender',
    commtypeName: 'Wealth Portal',
    commtypeId: 'wealth-portal',
  },

  // --- Password Reset notifications ---
  // Thabo Molefe — completed reset (adviser kept informed)
  {
    id: 'notif-19',
    communicationId: 'comm-26',
    stageId: 'requested',
    audience: 'adviser',
    nature: 'informational',
    title: 'Thabo Molefe has requested a password reset',
    read: true,
    actioned: false,
    createdAt: daysAgo(2),
    readAt: daysAgo(2),
    clientName: 'Thabo Molefe',
    commtypeName: 'Password Reset',
    commtypeId: 'password-reset',
  },
  {
    id: 'notif-20',
    communicationId: 'comm-26',
    stageId: 'link-opened',
    audience: 'adviser',
    nature: 'informational',
    title: 'Thabo Molefe opened the password reset link',
    read: true,
    actioned: false,
    createdAt: daysAgo(2),
    readAt: daysAgo(2),
    clientName: 'Thabo Molefe',
    commtypeName: 'Password Reset',
    commtypeId: 'password-reset',
  },
  {
    id: 'notif-21',
    communicationId: 'comm-26',
    stageId: 'password-reset',
    audience: 'adviser',
    nature: 'informational',
    title: 'Thabo Molefe has reset their portal password',
    read: true,
    actioned: false,
    createdAt: daysAgo(2),
    readAt: daysAgo(2),
    clientName: 'Thabo Molefe',
    commtypeName: 'Password Reset',
    commtypeId: 'password-reset',
  },
  {
    id: 'notif-22',
    communicationId: 'comm-26',
    stageId: 'password-reset',
    audience: 'client',
    nature: 'informational',
    title: 'Your password has been updated successfully',
    channel: 'email',
    deliveredAt: daysAgo(2),
    read: true,
    actioned: false,
    createdAt: daysAgo(2),
    clientName: 'Thabo Molefe',
    commtypeName: 'Password Reset',
    commtypeId: 'password-reset',
  },
  // Linda Nkosi — in progress (link opened, not yet reset)
  {
    id: 'notif-23',
    communicationId: 'comm-27',
    stageId: 'requested',
    audience: 'adviser',
    nature: 'informational',
    title: 'Linda Nkosi has requested a password reset',
    read: true,
    actioned: false,
    createdAt: daysAgo(1),
    readAt: daysAgo(1),
    clientName: 'Linda Nkosi',
    commtypeName: 'Password Reset',
    commtypeId: 'password-reset',
  },
  {
    id: 'notif-24',
    communicationId: 'comm-27',
    stageId: 'link-opened',
    audience: 'adviser',
    nature: 'informational',
    title: 'Linda Nkosi opened the password reset link',
    read: false,
    actioned: false,
    createdAt: daysAgo(0),
    clientName: 'Linda Nkosi',
    commtypeName: 'Password Reset',
    commtypeId: 'password-reset',
  },
  {
    id: 'notif-25',
    communicationId: 'comm-27',
    stageId: 'link-sent',
    audience: 'client',
    nature: 'transactional',
    title: 'Your password reset link',
    channel: 'email',
    deliveredAt: daysAgo(1),
    read: true,
    actioned: false,
    createdAt: daysAgo(1),
    clientName: 'Linda Nkosi',
    commtypeName: 'Password Reset',
    commtypeId: 'password-reset',
  },
  // Sipho Zulu — expired, adviser needs to resend
  {
    id: 'notif-26',
    communicationId: 'comm-28',
    stageId: 'requested',
    audience: 'adviser',
    nature: 'informational',
    title: 'Sipho Zulu has requested a password reset',
    read: true,
    actioned: false,
    createdAt: daysAgo(4),
    readAt: daysAgo(4),
    clientName: 'Sipho Zulu',
    commtypeName: 'Password Reset',
    commtypeId: 'password-reset',
  },
  {
    id: 'notif-27',
    communicationId: 'comm-28',
    stageId: 'expired',
    audience: 'adviser',
    nature: 'transactional',
    title: 'Password reset for Sipho Zulu has expired',
    body: 'The reset link was sent 4 days ago and has not been used.',
    actionLabel: 'Resend Link',
    actionUrl: '/comms-hub/communication/comm-28',
    read: false,
    actioned: false,
    createdAt: daysAgo(0),
    clientName: 'Sipho Zulu',
    commtypeName: 'Password Reset',
    commtypeId: 'password-reset',
  },
];

// =============================================================================
// NOTIFICATION HELPER FUNCTIONS
// =============================================================================

/** Get all adviser-directed notifications (for the Notifications tab) */
export function getAdviserNotifications(): Notification[] {
  return MOCK_NOTIFICATIONS
    .filter(n => n.audience === 'adviser')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/** Get unread adviser notification count (for badge) */
export function getUnreadAdviserNotificationCount(): number {
  return MOCK_NOTIFICATIONS.filter(n => n.audience === 'adviser' && !n.read).length;
}

/** Get notifications for a specific communication (for activity timeline) */
export function getNotificationsForComm(communicationId: string): Notification[] {
  return MOCK_NOTIFICATIONS
    .filter(n => n.communicationId === communicationId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

/** Get notifications grouped by date (for the inbox) */
export function getNotificationsGroupedByDate(notifications: Notification[]): { label: string; notifications: Notification[] }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; notifications: Notification[] }[] = [
    { label: 'Today', notifications: [] },
    { label: 'Yesterday', notifications: [] },
    { label: 'Older', notifications: [] },
  ];

  notifications.forEach(n => {
    const created = new Date(n.createdAt);
    created.setHours(0, 0, 0, 0);
    if (created.getTime() >= today.getTime()) {
      groups[0].notifications.push(n);
    } else if (created.getTime() >= yesterday.getTime()) {
      groups[1].notifications.push(n);
    } else {
      groups[2].notifications.push(n);
    }
  });

  return groups.filter(g => g.notifications.length > 0);
}

// =============================================================================
// PORTAL INVITE HELPER FUNCTIONS
// =============================================================================

export function getPortalInviteStats(invites: PortalInvite[]) {
  return {
    total: invites.length,
    notInvited: invites.filter(i => i.status === 'not-invited').length,
    invited: invites.filter(i => i.status === 'invited').length,
    opened: invites.filter(i => i.status === 'opened').length,
    passwordSet: invites.filter(i => i.status === 'password-set').length,
    activated: invites.filter(i => i.status === 'activated').length,
  };
}
