/**
 * useCommFlow Hook
 *
 * Core hook for managing unified communication flows.
 * Handles step navigation, data management, validation, and sending.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  CommFlowContext,
  CommFlowData,
  FlowStep,
  SendingStatus,
  UseCommFlowReturn,
} from './types';
import { getMessageTemplate } from './templates';
import { assembleStepIds, buildFlowSteps } from './stepRegistry';
import { COMM_TYPE_CONFIGS, Channel } from '@/types/communications';

// =============================================================================
// INITIAL DATA FACTORY
// =============================================================================

/**
 * Create initial flow data based on context.
 */
function createInitialData(context: CommFlowContext): CommFlowData {
  // Determine initial recipients
  const recipients = context.preSelectedClient
    ? [context.preSelectedClient]
    : context.preSelectedClients || [];

  // Determine initial comm type
  const commType = context.preSelectedCommType || null;

  // Pre-select ALL available channels for the comm type
  let channels: Channel[] = ['email'];
  if (commType) {
    const config = COMM_TYPE_CONFIGS[commType];
    if (config) {
      channels = [...config.channels];
    }
  }

  // Get initial message template (use first channel for template)
  const message = commType ? getMessageTemplate(commType, channels[0]) : '';

  return {
    recipients,
    commType,
    channels,
    subject: '',
    message,
    stepData: {},
  };
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate a step's data.
 */
function validateStep(
  stepId: string,
  data: CommFlowData,
  context: CommFlowContext
): boolean {
  switch (stepId) {
    case 'recipients':
      return data.recipients.length > 0;

    case 'commtype':
      return data.commType !== null;

    case 'configure-access': {
      // Portal Invite: need a valid username
      const accessData = data.stepData['configure-access'] as {
        username?: string;
      } | undefined;
      return (accessData?.username?.trim().length || 0) > 0;
    }

    case 'confirm-contact': {
      // Info Request: need email or mobile
      const contactData = data.stepData['confirm-contact'] as {
        email?: string;
        mobile?: string;
      } | undefined;
      return (contactData?.email?.trim().length || 0) > 0 ||
             (contactData?.mobile?.trim().length || 0) > 0;
    }

    case 'configure-request': {
      // Info Request: need at least one section selected
      const configData = data.stepData['configure-request'] as {
        selectedSections?: string[];
      } | undefined;
      return (configData?.selectedSections?.length || 0) > 0;
    }

    case 'select-documents': {
      // Document Request: need at least one document
      const docData = data.stepData['select-documents'] as {
        documents?: string[];
        customDocuments?: string[];
      } | undefined;
      return (docData?.documents?.length || 0) > 0 ||
             (docData?.customDocuments?.length || 0) > 0;
    }

    case 'schedule':
      // Meetings: always valid for now
      return true;

    case 'compose':
      // Compose: message required
      return data.message.trim().length > 0;

    case 'preview':
      // Preview: always valid (ready to send)
      return true;

    default:
      return true;
  }
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Main hook for managing a communication flow.
 */
export function useCommFlow(context: CommFlowContext): UseCommFlowReturn {
  // -------------------------------------------------------------------------
  // STATE
  // -------------------------------------------------------------------------

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState<CommFlowData>(() => createInitialData(context));
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>({ status: 'idle' });

  // -------------------------------------------------------------------------
  // COMPUTED: STEPS
  // -------------------------------------------------------------------------

  const steps = useMemo<FlowStep[]>(() => {
    // Determine what's pre-selected
    const hasPreSelectedClient = !!(
      context.preSelectedClient || context.preSelectedClients?.length
    );
    const hasPreSelectedCommType = !!context.preSelectedCommType;

    // Assemble step IDs
    const stepIds = assembleStepIds(
      hasPreSelectedClient,
      hasPreSelectedCommType,
      data.commType
    );

    // Build full step objects
    return buildFlowSteps(stepIds, data.commType);
  }, [context, data.commType]);

  const currentStep = steps[currentStepIndex] || steps[0];

  // -------------------------------------------------------------------------
  // COMPUTED: VALIDATION
  // -------------------------------------------------------------------------

  const canProceed = useMemo(() => {
    if (!currentStep) return false;
    return validateStep(currentStep.id, data, context);
  }, [currentStep, data, context]);

  // -------------------------------------------------------------------------
  // NAVIGATION
  // -------------------------------------------------------------------------

  const goNext = useCallback(() => {
    if (canProceed && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(i => i + 1);
    }
  }, [canProceed, currentStepIndex, steps.length]);

  const goBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((stepId: string) => {
    const index = steps.findIndex(s => s.id === stepId);
    if (index !== -1 && index <= currentStepIndex) {
      // Can only go back to previous steps
      setCurrentStepIndex(index);
    }
  }, [steps, currentStepIndex]);

  // -------------------------------------------------------------------------
  // DATA UPDATES
  // -------------------------------------------------------------------------

  const updateData = useCallback((partial: Partial<CommFlowData>) => {
    setData(prev => {
      const next = { ...prev, ...partial };

      // If comm type changed, select ALL channels and update message template
      if (partial.commType && partial.commType !== prev.commType) {
        const config = COMM_TYPE_CONFIGS[partial.commType];
        if (config) {
          next.channels = [...config.channels];
          next.message = getMessageTemplate(partial.commType, config.channels[0]);
        }
      }

      // If channels changed, potentially update message based on first channel
      if (partial.channels && prev.commType) {
        const primaryChannel = partial.channels[0];
        const prevPrimary = prev.channels[0];
        if (primaryChannel && primaryChannel !== prevPrimary) {
          const prevTemplate = getMessageTemplate(prev.commType, prevPrimary);
          if (prev.message === prevTemplate) {
            next.message = getMessageTemplate(prev.commType, primaryChannel);
          }
        }
      }

      return next;
    });
  }, []);

  const updateStepData = useCallback(<T,>(stepId: string, stepDataValue: T) => {
    setData(prev => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        [stepId]: stepDataValue,
      },
    }));
  }, []);

  // -------------------------------------------------------------------------
  // SEND
  // -------------------------------------------------------------------------

  const send = useCallback(async () => {
    if (sendingStatus.status === 'sending') return;

    setSendingStatus({ status: 'sending' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const sentAt = new Date();
      setSendingStatus({
        status: 'sent',
        sentAt,
      });

      // Simulate delivery confirmation
      setTimeout(() => {
        setSendingStatus(prev => ({
          ...prev,
          deliveredAt: new Date(),
        }));
      }, 2000);

      // Call completion callback
      if (context.onComplete) {
        context.onComplete({
          success: true,
          data,
          sentAt,
        });
      }
    } catch (error) {
      setSendingStatus({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Failed to send',
      });
    }
  }, [sendingStatus.status, data, context]);

  // -------------------------------------------------------------------------
  // RESET
  // -------------------------------------------------------------------------

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setData(createInitialData(context));
    setSendingStatus({ status: 'idle' });
  }, [context]);

  // -------------------------------------------------------------------------
  // RETURN
  // -------------------------------------------------------------------------

  return {
    steps,
    currentStep,
    currentStepIndex,
    data,
    sendingStatus,

    goNext,
    goBack,
    goToStep,

    updateData,
    updateStepData,

    canProceed,

    send,
    reset,
  };
}
