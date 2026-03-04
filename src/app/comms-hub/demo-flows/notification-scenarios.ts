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
    subject: string;                // Pre-fills compose subject
    message: string;                // Pre-fills compose message body
    additionalStepIds?: string[];   // Extra steps (e.g. ['select-documents'])
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
      message: `Hi {FirstName},

Your annual review is coming up. Please ensure you have all relevant documents ready.

Due date: 30 May 2026

Rassie du Preez`,
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
      message: `Hi {FirstName},

Has anything changed since your last annual review? Please let us know if there have been any changes to your financial situation, goals, or personal circumstances.

Due date: 30 May 2026

Rassie du Preez`,
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
    id: 'notif-proof-of-address',
    category: 'info-request',
    label: 'Request Proof of Address',
    description: 'FICA compliance — select documents from scoped list',
    buttonIcon: 'upload_file',
    client: client('c5'), // David Smit
    flow: {
      subject: 'Upload proof of address',
      message: `Hi {FirstName},

As part of our FICA compliance process, we require an updated proof of address. Please upload a recent utility bill, bank statement, or municipal account.

Due date: 20 May 2026

Rassie du Preez`,
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
      message: `Hi {FirstName},

Please confirm your personal details are still correct. This includes your contact information, address, and banking details.

Due date: 25 May 2026

Rassie du Preez`,
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
    id: 'notif-tax-certificate',
    category: 'info-share',
    label: 'Share Tax Certificate',
    description: 'Upload and share tax certificate with client',
    buttonIcon: 'waving_hand',
    client: client('c7'), // Priya Govender
    flow: {
      subject: 'Victoria Jones uploaded your 2025-2026 tax certificate',
      message: `Hi {FirstName},

Your 2025-2026 tax certificate has been uploaded to your portal. You can view and download it at any time.

Victoria Jones`,
    },
    notificationOutput: {
      icon: 'waving_hand',
      subtitle: '25 May 2026',
      actionLabel: 'View',
      adviserName: 'Victoria Jones',
    },
  },
  {
    id: 'notif-market-commentary',
    category: 'info-share',
    label: 'Share Market Commentary',
    description: 'Share latest market commentary report',
    buttonIcon: 'waving_hand',
    client: client('c2'), // Sarah van der Berg
    flow: {
      subject: 'Victoria Jones uploaded market commentary for Q1 2026',
      message: `Hi {FirstName},

The latest market commentary is now available on your portal. This covers key market movements and our outlook for the coming quarter.

Victoria Jones`,
    },
    notificationOutput: {
      icon: 'waving_hand',
      subtitle: '30 April 2026',
      actionLabel: 'View',
      adviserName: 'Victoria Jones',
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
