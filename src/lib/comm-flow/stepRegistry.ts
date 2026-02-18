/**
 * Step Registry
 *
 * Maps step IDs to their component implementations.
 * This allows dynamic step assembly based on comm type config.
 */

import { ComponentType } from 'react';
import { StepProps, FlowStep } from './types';
import { COMM_TYPE_CONFIGS } from '@/types/communications';

// =============================================================================
// STEP COMPONENTS (lazy imports for code splitting)
// =============================================================================

// These will be imported dynamically when the step is needed
// For now, we'll define them as placeholder types that will be replaced
// once we create the actual components

type StepComponent = ComponentType<StepProps>;

// Placeholder registry - will be populated as components are created
const stepRegistry: Record<string, StepComponent> = {};

// =============================================================================
// REGISTRATION FUNCTIONS
// =============================================================================

/**
 * Register a step component.
 * Called by each step component module.
 */
export function registerStep(stepId: string, component: StepComponent): void {
  stepRegistry[stepId] = component;
}

/**
 * Get a step component by ID.
 */
export function getStepComponent(stepId: string): StepComponent | undefined {
  return stepRegistry[stepId];
}

/**
 * Check if a step component is registered.
 */
export function hasStepComponent(stepId: string): boolean {
  return stepId in stepRegistry;
}

// =============================================================================
// STEP ASSEMBLY
// =============================================================================

/**
 * Base step definitions (always available).
 */
const BASE_STEPS = {
  recipients: {
    id: 'recipients',
    label: 'Recipients',
    description: 'Select clients',
  },
  commtype: {
    id: 'commtype',
    label: 'Type',
    description: 'Choose communication type',
  },
  compose: {
    id: 'compose',
    label: 'Compose',
    description: 'Write your message',
  },
  preview: {
    id: 'preview',
    label: 'Preview',
    description: 'Review and send',
  },
};

/**
 * Get step metadata from base steps or comm type config.
 */
export function getStepMetadata(stepId: string, commType: string | null): {
  id: string;
  label: string;
  description: string;
} {
  // Check base steps first
  if (stepId in BASE_STEPS) {
    return BASE_STEPS[stepId as keyof typeof BASE_STEPS];
  }

  // Check comm type config for additional steps
  if (commType) {
    const config = COMM_TYPE_CONFIGS[commType];
    if (config) {
      const additionalStep = config.additionalSteps.find(s => s.id === stepId);
      if (additionalStep) {
        return additionalStep;
      }
    }
  }

  // Fallback
  return {
    id: stepId,
    label: stepId,
    description: '',
  };
}

/**
 * Assemble the list of steps for a flow based on context.
 *
 * @param hasPreSelectedClient - Whether a client is pre-selected
 * @param hasPreSelectedCommType - Whether a comm type is pre-selected
 * @param commType - The comm type ID (if selected)
 */
export function assembleStepIds(
  hasPreSelectedClient: boolean,
  hasPreSelectedCommType: boolean,
  commType: string | null
): string[] {
  const steps: string[] = [];

  // Step 1: Recipients (skip if client pre-selected)
  if (!hasPreSelectedClient) {
    steps.push('recipients');
  }

  // Step 2: Comm Type (skip if type pre-selected)
  if (!hasPreSelectedCommType) {
    steps.push('commtype');
  }

  // Type-specific steps from COMM_TYPE_CONFIGS
  if (commType) {
    const config = COMM_TYPE_CONFIGS[commType];
    if (config && config.additionalSteps) {
      config.additionalSteps.forEach(step => {
        steps.push(step.id);
      });
    }
  }

  // Final steps: Compose + Preview (always)
  steps.push('compose');
  steps.push('preview');

  return steps;
}

/**
 * Build full FlowStep objects from step IDs.
 */
export function buildFlowSteps(
  stepIds: string[],
  commType: string | null
): FlowStep[] {
  return stepIds.map(stepId => {
    const metadata = getStepMetadata(stepId, commType);
    const component = getStepComponent(stepId);

    if (!component) {
      console.warn(`No component registered for step: ${stepId}`);
    }

    return {
      ...metadata,
      component: component as ComponentType<StepProps>,
      validate: undefined, // Will be added by individual step components
    };
  });
}

// =============================================================================
// EXPORTS
// =============================================================================

export { BASE_STEPS };
