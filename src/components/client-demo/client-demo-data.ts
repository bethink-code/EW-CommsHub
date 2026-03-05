/**
 * Client Demo — Mock Data
 *
 * Static data for the client-facing portal demo.
 * Uses Sarah van der Berg as the demo client.
 */

// =============================================================================
// DEMO CLIENT & ADVISER
// =============================================================================

export const DEMO_CLIENT = {
  id: 'c2',
  firstName: 'Sarah',
  lastName: 'van der Berg',
  email: 'sarah.vdberg@gmail.com',
};

export const DEMO_ADVISER = {
  name: 'Rassie du Preez',
  initials: 'RD',
  title: 'Senior Wealth Adviser',
  email: 'rassie@elitewealth.co.za',
  phone: '+27 82 555 0101',
};

// =============================================================================
// PENDING ACTIONS
// =============================================================================

export interface PendingAction {
  id: string;
  type: 'view-shared' | 'upload-requested';
  icon: string;
  title: string;
  description: string;
  date: string;
}

export const PENDING_ACTIONS: PendingAction[] = [
  {
    id: 'pa-1',
    type: 'view-shared',
    icon: 'description',
    title: 'View Shared Document',
    description: 'Your adviser has shared a document with you.',
    date: '5 March 2026',
  },
  {
    id: 'pa-2',
    type: 'upload-requested',
    icon: 'upload_file',
    title: 'Upload Requested Documents',
    description: 'Your adviser has requested documents from you.',
    date: '4 March 2026',
  },
];

// =============================================================================
// RECENT DOCUMENTS
// =============================================================================

export interface RecentDocument {
  id: string;
  name: string;
  date: string;
  status: 'shared' | 'uploaded' | 'pending';
  statusLabel: string;
}

export const RECENT_DOCUMENTS: RecentDocument[] = [
  {
    id: 'doc-1',
    name: 'Q4 2025 Portfolio Report',
    date: '28 Feb 2026',
    status: 'shared',
    statusLabel: 'Shared by adviser',
  },
  {
    id: 'doc-2',
    name: 'Tax Certificate 2025',
    date: '15 Feb 2026',
    status: 'uploaded',
    statusLabel: 'Uploaded',
  },
  {
    id: 'doc-3',
    name: 'Market Commentary — March 2026',
    date: '5 Mar 2026',
    status: 'shared',
    statusLabel: 'Shared by adviser',
  },
  {
    id: 'doc-4',
    name: 'Proof of Address',
    date: '1 Mar 2026',
    status: 'pending',
    statusLabel: 'Pending upload',
  },
];

// =============================================================================
// SHARED DOCUMENT (for View modal)
// =============================================================================

export const SHARED_DOCUMENT = {
  name: 'Market Commentary — March 2026',
  fileName: 'EW-Market-Commentary-Mar-2026.pdf',
  fileSize: '2.4 MB',
  sharedBy: DEMO_ADVISER.name,
  sharedDate: '5 March 2026',
};

// =============================================================================
// REQUESTED DOCUMENTS (for Upload modal)
// =============================================================================

export const REQUESTED_DOCUMENTS = [
  'Proof of Address (not older than 3 months)',
  'Latest Bank Statement',
  'Copy of ID Document',
];
