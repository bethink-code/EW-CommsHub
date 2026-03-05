/**
 * Notification Scenarios
 *
 * Defines the 8 concrete notification scenarios (2 per category)
 * matching the client's mobile app screenshot.
 *
 * Each scenario specifies:
 * - The adviser flow (subject + message template for compose step)
 * - The notification output (icon, subtitle, CTA for the client notification card)
 *
 * Templates are kept as clean data here for easy migration to
 * a managed Templates UI in the future.
 */

import { Client } from '@/types/communications';
import { MOCK_CLIENTS } from '../mock-data';

// =============================================================================
// TYPES
// =============================================================================

export type NotificationCategory = 'reminder' | 'info-request' | 'info-share' | 'system';

export interface NotificationScenario {
  id: string;
  category: NotificationCategory;
  label: string;                    // Button label
  description: string;              // Button subtitle
  buttonIcon: string;               // Icon for the scenario button
  client: Client;                   // Pre-assigned client

  // Adviser-initiated: opens CommFlow with in-app commType + prefill
  flow?: {
    subject: string;                // Pre-fills compose subject (notification title)
    message: string;                // Pre-fills compose description (notification subtitle)
    inappDue?: string;              // Structured field: due date
    inappAdviser?: string;          // Structured field: adviser name
    additionalStepIds?: string[];   // Extra steps (e.g. ['select-documents'])
    prefillStepData?: Record<string, unknown>; // Pre-fill step data (skip steps with known context)
  };

  // What the client notification card looks like
  notificationOutput: {
    icon: string;                   // material-icons-outlined name
    subtitle: string;               // e.g. "Due date: 30 May 2026"
    actionLabel?: string;           // CTA button: "View", "Upload", etc.
    adviserName?: string;           // Inline adviser name in subtitle
  };
}

// =============================================================================
// CATEGORY CONFIG
// =============================================================================

export const NOTIFICATION_CATEGORIES: Record<NotificationCategory, {
  label: string;
  icon: string;
  description: string;
}> = {
  reminder: {
    label: 'Reminders',
    icon: 'notifications_none',
    description: '"Something is coming up." No action required from client.',
  },
  'info-request': {
    label: 'Information Requests',
    icon: 'upload_file',
    description: '"We need something from you." Client must act.',
  },
  'info-share': {
    label: 'Information Shares',
    icon: 'waving_hand',
    description: '"Here\'s something for you." Adviser shares a document.',
  },
  system: {
    label: 'System',
    icon: 'settings',
    description: 'Platform housekeeping. Auto-generated, not adviser-initiated.',
  },
};

export const NOTIFICATION_CATEGORY_ORDER: NotificationCategory[] = [
  'reminder',
  'info-request',
  'info-share',
  'system',
];

// =============================================================================
// HELPER
// =============================================================================

function client(id: string): Client {
  return MOCK_CLIENTS.find(c => c.id === id)!;
}

// Document label lookups (request + share)
const REQUEST_DOC_LABELS: Record<string, string> = {
  'id-document': 'ID Document',
  'proof-of-address': 'Proof of Address',
  'bank-statements': 'Bank Statements',
  'tax-returns': 'Tax Returns',
  'employment-contract': 'Employment Contract',
  'payslips': 'Payslips',
  'investment-statements': 'Investment Statements',
  'property-valuations': 'Property Valuations',
  'insurance-policies': 'Insurance Policies',
  'will-testament': 'Will / Testament',
};

const SHARE_DOC_LABELS: Record<string, string> = {
  'tax-certificate': 'Tax Certificate',
  'portfolio-valuation': 'Portfolio Valuation Report',
  'market-commentary': 'Market Commentary',
  'financial-plan': 'Financial Plan',
  'investment-proposal': 'Investment Proposal',
  'fee-schedule': 'Fee Schedule',
  'fund-fact-sheet': 'Fund Fact Sheet',
  'policy-schedule': 'Policy Schedule',
  'annual-report': 'Annual Report',
  'compliance-confirmation': 'Compliance Confirmation',
};

/** Resolve document names from step data (works for both request and share). */
function resolveDocNames(
  stepData: Record<string, unknown>,
  stepKey: string,
  labels: Record<string, string>,
): string[] {
  const docData = stepData[stepKey] as { documents?: string[]; customDocuments?: string[] } | undefined;
  if (!docData) return [];
  const names: string[] = [];
  if (docData.documents) names.push(...docData.documents.map(id => labels[id] || id));
  if (docData.customDocuments) names.push(...docData.customDocuments);
  return names;
}

/**
 * Build a notification title from selected documents.
 * Checks both select-documents (request) and share-documents (share).
 */
export function buildDocumentTitle(
  stepData: Record<string, unknown>,
  fallback: string,
): string {
  // Check request documents
  const requestNames = resolveDocNames(stepData, 'select-documents', REQUEST_DOC_LABELS);
  if (requestNames.length === 1) return `Please upload your ${requestNames[0]}`;
  if (requestNames.length > 1) return 'Please upload your documents. Details in the Elite Wealth Portal';

  // Check share documents
  const shareNames = resolveDocNames(stepData, 'share-documents', SHARE_DOC_LABELS);
  if (shareNames.length === 1) return `Your ${shareNames[0]} has been shared with you`;
  if (shareNames.length > 1) return 'Documents have been shared with you. View in the Elite Wealth Portal';

  return fallback;
}

// =============================================================================
// SCENARIOS
// =============================================================================

export const NOTIFICATION_SCENARIOS: NotificationScenario[] = [
  // ---------------------------------------------------------------------------
  // REMINDERS
  // ---------------------------------------------------------------------------
  {
    id: 'notif-annual-review',
    category: 'reminder',
    label: 'Annual Review Reminder',
    description: 'Remind client about upcoming annual review',
    buttonIcon: 'notifications_none',
    client: client('c1'), // Johan Pretorius
    flow: {
      subject: 'Your annual review is coming up.',
      message: 'Due date: 30 May 2026',
      inappDue: '30 May 2026',
      inappAdviser: 'Rassie du Preez',
    },
    notificationOutput: {
      icon: 'notifications_none',
      subtitle: 'Due date: 30 May 2026',
    },
  },
  {
    id: 'notif-annual-review-followup',
    category: 'reminder',
    label: 'Annual Review Follow-up',
    description: 'Ask if anything has changed since last review',
    buttonIcon: 'notifications_none',
    client: client('c1'), // Johan Pretorius
    flow: {
      subject: 'Has anything changed since your last annual review?',
      message: 'Due date: 30 May 2026',
      inappDue: '30 May 2026',
      inappAdviser: 'Rassie du Preez',
    },
    notificationOutput: {
      icon: 'notifications_none',
      subtitle: 'Due date: 30 May 2026',
    },
  },

  // ---------------------------------------------------------------------------
  // INFORMATION REQUESTS
  // ---------------------------------------------------------------------------
  {
    id: 'notif-request-document',
    category: 'info-request',
    label: 'Request a Document',
    description: 'Ask client to upload a specific document',
    buttonIcon: 'upload_file',
    client: client('c5'), // David Smit
    flow: {
      subject: 'Please upload your documents',
      message: 'Due date: 20 May 2026',
      inappDue: '20 May 2026',
      inappAdviser: 'Rassie du Preez',
      additionalStepIds: ['select-documents'],
    },
    notificationOutput: {
      icon: 'upload_file',
      subtitle: 'Due date: 20 May 2026',
      actionLabel: 'Upload',
      adviserName: 'Rassie du Preez',
    },
  },
  {
    id: 'notif-confirm-details',
    category: 'info-request',
    label: 'Confirm Your Details',
    description: 'Ask client to verify personal details are up to date',
    buttonIcon: 'fact_check',
    client: client('c2'), // Sarah van der Berg
    flow: {
      subject: 'Confirm your details are up to date',
      message: 'Due date: 25 May 2026',
      inappDue: '25 May 2026',
      inappAdviser: 'Rassie du Preez',
    },
    notificationOutput: {
      icon: 'fact_check',
      subtitle: 'Due date: 25 May 2026',
      actionLabel: 'Confirm',
      adviserName: 'Rassie du Preez',
    },
  },

  // ---------------------------------------------------------------------------
  // INFORMATION SHARES
  // ---------------------------------------------------------------------------
  {
    id: 'notif-share-document',
    category: 'info-share',
    label: 'Share a Document',
    description: 'Share one or more documents with the client',
    buttonIcon: 'waving_hand',
    client: client('c7'), // Priya Govender
    flow: {
      subject: 'A document has been shared with you',
      message: '',
      inappAdviser: 'Rassie du Preez',
      additionalStepIds: ['share-documents', 'add-documents'],
    },
    notificationOutput: {
      icon: 'waving_hand',
      subtitle: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }),
      actionLabel: 'View',
      adviserName: 'Rassie du Preez',
    },
  },
  {
    id: 'notif-share-report',
    category: 'info-share',
    label: 'Share a Report',
    description: 'Share a market commentary or performance report',
    buttonIcon: 'waving_hand',
    client: client('c2'), // Sarah van der Berg
    flow: {
      subject: 'Your Market Commentary has been shared with you',
      message: '',
      inappAdviser: 'Rassie du Preez',
      additionalStepIds: ['add-documents'],
      prefillStepData: {
        'share-documents': { documents: ['market-commentary'], customDocuments: [], notes: '' },
      },
    },
    notificationOutput: {
      icon: 'waving_hand',
      subtitle: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }),
      actionLabel: 'View',
      adviserName: 'Rassie du Preez',
    },
  },

  // ---------------------------------------------------------------------------
  // SYSTEM (no adviser compose flow — direct injection)
  // ---------------------------------------------------------------------------
  {
    id: 'notif-portfolio-performance',
    category: 'system',
    label: 'Portfolio Performance Update',
    description: 'System-generated portfolio increase notification',
    buttonIcon: 'trending_up',
    client: client('c7'), // Priya Govender
    notificationOutput: {
      icon: 'notifications_none',
      subtitle: '30 April 2026',
      actionLabel: 'View',
      adviserName: 'Rassie du Preez',
    },
  },
  {
    id: 'notif-password-reset-confirm',
    category: 'system',
    label: 'Password Reset Confirmation',
    description: 'System confirms password was reset successfully',
    buttonIcon: 'lock_reset',
    client: client('c8'), // Thabo Molefe
    notificationOutput: {
      icon: 'lock_reset',
      subtitle: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }),
    },
  },
];

// Pre-built notification data for system scenarios (no compose flow)
export const SYSTEM_NOTIFICATIONS: Record<string, { title: string }> = {
  'notif-portfolio-performance': {
    title: 'There has been a +23.06% increase in your portfolio',
  },
  'notif-password-reset-confirm': {
    title: 'Your password has been reset successfully',
  },
};

// =============================================================================
// NOTIFICATION TEMPLATES (decoupled from clients — for type picker)
// =============================================================================

/**
 * Template definition for the notification type picker.
 * Decoupled from specific clients — adviser picks template,
 * then picks recipients in the flow.
 */
export interface NotificationTemplate {
  id: string;
  category: NotificationCategory;
  label: string;
  description: string;
  icon: string;
  bulkCapable: boolean;
  flow: {
    subject: string;
    message: string;
    inappDue?: string;
    inappAdviser?: string;
    additionalStepIds?: string[];
  };
  notificationOutput: {
    icon: string;
    subtitle: string;
    actionLabel?: string;
    adviserName?: string;
  };
}

/** Categories shown in the notification type picker (excludes system). */
export const PICKER_CATEGORIES: NotificationCategory[] = ['reminder', 'info-request', 'info-share'];

/** Reusable notification templates derived from the scenario data. */
export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = NOTIFICATION_SCENARIOS
  .filter((s): s is NotificationScenario & { flow: NonNullable<NotificationScenario['flow']> } => !!s.flow)
  .map(s => ({
    id: s.id,
    category: s.category,
    label: s.label,
    description: s.description,
    icon: s.buttonIcon,
    bulkCapable: s.category === 'reminder' || s.category === 'info-share',
    flow: s.flow,
    notificationOutput: s.notificationOutput,
  }));
