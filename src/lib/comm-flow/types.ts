/**
 * Unified Communications Flow Types
 *
 * Core type definitions for the unified flow system that works
 * in both modal and page modes.
 */

import { ComponentType } from 'react';
import { Client, Channel } from '@/types/communications';

// =============================================================================
// FLOW CONTEXT
// =============================================================================

/**
 * Context passed when starting a flow.
 * Determines what's pre-filled and how the flow renders.
 */
export interface CommFlowContext {
  // What's pre-filled (from calling context)
  preSelectedClient?: Client;
  preSelectedClients?: Client[];
  preSelectedCommType?: string;

  // How to render
  renderMode: 'modal' | 'page';

  // Callbacks
  onComplete?: (result: CommFlowResult) => void;
  onCancel?: () => void;
}

// =============================================================================
// FLOW DATA
// =============================================================================

/**
 * Unified form data structure for all comm flows.
 */
export interface CommFlowData {
  // Core selections
  recipients: Client[];
  commType: string | null;
  channels: Channel[];

  // Message (legacy single-message field, kept in sync with active channel draft)
  subject: string;
  message: string;

  // Per-channel drafts
  channelDrafts: Partial<Record<Channel, string>>;
  channelEdited: Partial<Record<Channel, boolean>>;
  activeComposeChannel: Channel | null;

  // Type-specific data (keyed by step ID)
  // e.g., stepData['configure-access'] = { username: 'client@email.com' }
  stepData: Record<string, unknown>;
}

/**
 * Result returned when a flow completes.
 */
export interface CommFlowResult {
  success: boolean;
  data: CommFlowData;
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
}

// =============================================================================
// SENDING STATUS
// =============================================================================

export interface SendingStatus {
  status: 'idle' | 'sending' | 'sent' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
}

// =============================================================================
// STEP DEFINITIONS
// =============================================================================

/**
 * Definition for a flow step.
 */
export interface FlowStep {
  id: string;
  label: string;
  description: string;
  title?: string;     // Large title for modal header zone (e.g., "Choose Recipients")
  subtitle?: string;  // Subtitle for modal header zone (e.g., "Who should receive this?")
  component: ComponentType<StepProps>;
  validate?: (data: CommFlowData, context: CommFlowContext) => boolean;
}

/**
 * Standard props passed to all step components.
 */
export interface StepProps {
  // Data
  data: CommFlowData;
  context: CommFlowContext;

  // First/current client (convenience)
  client: Client | null;

  // Data updates
  onDataChange: (partial: Partial<CommFlowData>) => void;
  onStepDataChange: <T>(stepId: string, data: T) => void;

  // Navigation
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;

  // Sending (for final step)
  sendingStatus?: SendingStatus;
  onSend?: () => void;

  // Step info
  isFirstStep: boolean;
  isLastStep: boolean;

  // Modal redesign: header zone renders title/subtitle, so steps can skip their own
  hideStepHeader?: boolean;
}

// =============================================================================
// TYPE-SPECIFIC STEP DATA
// =============================================================================

/**
 * Portal Invite step data
 */
export interface PortalInviteStepData {
  username: string;
}

/**
 * Info Request - Contact step data
 */
export interface InfoRequestContactData {
  email: string;
  mobile: string;
}

/**
 * Info Request - Configure step data
 */
export interface InfoRequestConfigData {
  selectedSections: string[];
  selectedDocuments: string[];
  notes: string;
}

/**
 * Document Request step data
 */
export interface DocumentRequestStepData {
  documents: string[];
  customDocuments: string[];
  notes: string;
}

/**
 * Meeting Schedule step data
 */
export interface ScheduleStepData {
  date: string;
  time: string;
  location: string;
  duration: number;
  notes: string;
}

// =============================================================================
// FLOW HOOK RETURN
// =============================================================================

/**
 * Return type for the useCommFlow hook.
 */
export interface UseCommFlowReturn {
  // Current state
  steps: FlowStep[];
  currentStep: FlowStep;
  currentStepIndex: number;
  data: CommFlowData;
  sendingStatus: SendingStatus;

  // Navigation
  goNext: () => void;
  goBack: () => void;
  goToStep: (stepId: string) => void;

  // Data updates
  updateData: (partial: Partial<CommFlowData>) => void;
  updateStepData: <T>(stepId: string, data: T) => void;

  // Validation
  canProceed: boolean;

  // Actions
  send: () => Promise<void>;
  reset: () => void;
}

// =============================================================================
// STEP REGISTRY
// =============================================================================

/**
 * Map of step IDs to their components.
 */
export type StepRegistry = Record<string, ComponentType<StepProps>>;
