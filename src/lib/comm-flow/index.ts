/**
 * Unified Communications Flow System
 *
 * This module provides a unified way to create and manage communication flows
 * that work in both modal and page modes.
 *
 * Usage:
 *
 * ```tsx
 * import { useCommFlow, CommFlowContext } from '@/lib/comm-flow';
 *
 * const context: CommFlowContext = {
 *   preSelectedClient: client,
 *   preSelectedCommType: 'document-request',
 *   renderMode: 'modal',
 *   onComplete: (result) => console.log('Sent!', result),
 *   onCancel: () => console.log('Cancelled'),
 * };
 *
 * const flow = useCommFlow(context);
 * ```
 */

// Types
export type {
  CommFlowContext,
  CommFlowData,
  CommFlowResult,
  SendingStatus,
  FlowStep,
  StepProps,
  UseCommFlowReturn,
  StepRegistry,
  // Type-specific data
  PortalInviteStepData,
  InfoRequestContactData,
  InfoRequestConfigData,
  DocumentRequestStepData,
} from './types';

// Hook
export { useCommFlow } from './useCommFlow';

// Templates
export {
  MESSAGE_TEMPLATES,
  getMessageTemplate,
  renderTemplate,
  shouldUpdateMessageOnChannelChange,
} from './templates';
export type { TemplateKey } from './templates';

// Step Registry
export {
  registerStep,
  getStepComponent,
  hasStepComponent,
  getStepMetadata,
  assembleStepIds,
  buildFlowSteps,
  BASE_STEPS,
} from './stepRegistry';
