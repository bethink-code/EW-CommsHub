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
    title: 'Choose Recipients',
    subtitle: 'Who should receive this?',
  },
  commtype: {
    id: 'commtype',
    label: 'Type',
    description: 'Choose communication type',
    title: 'Communication Type',
    subtitle: 'What would you like to send?',
  },
  compose: {
    id: 'compose',
    label: 'Compose',
    description: 'Write your message',
    title: 'Compose',
    subtitle: 'Review the template — edit if needed',
  },
  preview: {
    id: 'preview',
    label: 'Review',
    description: 'Review and send',
    title: 'Review & Send',
    subtitle: 'Confirm the details before sending',
  },
};

/**
 * Get step metadata from base steps or comm type config.
 */
export function getStepMetadata(stepId: string, commType: string | null): {
  id: string;
  label: string;
  description: string;
  title?: string;
  subtitle?: string;
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
        return {
          id: additionalStep.id,
          label: additionalStep.label,
          description: additionalStep.description,
          title: additionalStep.title || additionalStep.label,
          subtitle: additionalStep.subtitle || additionalStep.description,
        };
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

  // Dynamic type-specific steps (inserted between Type and Compose)
  if (commType) {
    const config = COMM_TYPE_CONFIGS[commType];
    if (config?.additionalSteps?.length) {
      config.additionalSteps.forEach(s => steps.push(s.id));
    }
  }

  // Final steps: Compose + Preview
  steps.push('compose');

  // Skip preview for simple message types (no additional steps, messages group)
  const config = commType ? COMM_TYPE_CONFIGS[commType] : null;
  const isSimpleMessage = config && config.group === 'messages';
  if (!isSimpleMessage) {
    steps.push('preview');
  }

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
