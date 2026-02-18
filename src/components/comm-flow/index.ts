/**
 * Unified Communications Flow Component
 *
 * Main component and exports for the unified flow system.
 */

// Main component
export { CommFlow } from './CommFlow';
export type { CommFlowProps } from './CommFlow';

// Re-export types and utilities from lib
export type {
  CommFlowContext,
  CommFlowData,
  CommFlowResult,
  SendingStatus,
  FlowStep,
  StepProps,
} from '@/lib/comm-flow/types';

export { useCommFlow } from '@/lib/comm-flow/useCommFlow';
export { getMessageTemplate, renderTemplate } from '@/lib/comm-flow/templates';

// Step components (for direct usage if needed)
export * from './steps';
