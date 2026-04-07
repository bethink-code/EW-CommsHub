/**
 * useCommFlow Hook
 *
 * Core hook for managing unified communication flows.
 * Handles step navigation, data management, validation, and sending.
 */

'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  CommFlowContext,
  CommFlowData,
  FlowStep,
  SendingStatus,
  UseCommFlowReturn,
} from './types';
import { getMessageTemplate } from './templates';
import { assembleStepIds, buildFlowSteps } from './stepRegistry';
import { COMM_TYPE_CONFIGS, INFO_SECTIONS, InfoSection, Channel } from '@/types/communications';

// =============================================================================
// INITIAL DATA FACTORY
// =============================================================================

/**
 * Create initial flow data based on context.
 */
function buildChannelDrafts(
  commType: string | null,
  channels: Channel[]
): Partial<Record<Channel, string>> {
  const drafts: Partial<Record<Channel, string>> = {};
  if (commType) {
    channels.forEach(ch => {
      drafts[ch] = getMessageTemplate(commType, ch);
    });
  }
  return drafts;
}

function createInitialData(context: CommFlowContext): CommFlowData {
  // Determine initial recipients
  const recipients = context.preSelectedClient
    ? [context.preSelectedClient]
    : context.preSelectedClients || [];

  // Determine initial comm type
  const commType = context.preSelectedCommType || null;

  // Default to email only — user must actively select additional channels
  let channels: Channel[] = ['email'];
  if (commType) {
    const config = COMM_TYPE_CONFIGS[commType];
    if (config) {
      channels = config.channels.includes('email') ? ['email'] : [config.channels[0]];
    }
  }

  // Build per-channel drafts from templates
  const channelDrafts = buildChannelDrafts(commType, channels);

  // Get initial message template (use first channel for backward compat)
  const message = commType ? getMessageTemplate(commType, channels[0]) : '';

  // Apply prefill overrides (subject + message body)
  const subject = context.prefill?.subject || '';
  const prefillMessage = context.prefill?.message;

  const finalMessage = prefillMessage || message;
  const finalChannelDrafts = prefillMessage
    ? Object.fromEntries(channels.map(ch => [ch, prefillMessage])) as Partial<Record<Channel, string>>
    : channelDrafts;

  // Build initial step data from prefill or comm-type defaults
  const stepData: Record<string, unknown> = context.prefill?.stepData || {};

  // Onboarding: default all info sections and all documents selected
  if (commType === 'onboarding') {
    if (!stepData['configure-request']) {
      stepData['configure-request'] = {
        selectedSections: Object.keys(INFO_SECTIONS) as InfoSection[],
        selectedDocuments: [],
        notes: '',
      };
    }
    if (!stepData['select-documents']) {
      stepData['select-documents'] = {
        documents: ['id-document', 'proof-of-address', 'bank-statements', 'proof-of-bank', 'company-documents'],
        customDocuments: [],
        notes: '',
      };
    }
  }

  return {
    recipients,
    commType,
    channels,
    subject,
    message: finalMessage,
    channelDrafts: finalChannelDrafts,
    channelEdited: {},
    activeComposeChannel: null,
    stepData,
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

    case 'share-documents': {
      // Document Share: need at least one document
      const shareData = data.stepData['share-documents'] as {
        documents?: string[];
        customDocuments?: string[];
      } | undefined;
      return (shareData?.documents?.length || 0) > 0 ||
             (shareData?.customDocuments?.length || 0) > 0;
    }

    case 'add-documents': {
      // Add Documents: need at least one file attached
      const addData = data.stepData['add-documents'] as {
        files?: { id: string }[];
      } | undefined;
      return (addData?.files?.length || 0) > 0;
    }

    case 'schedule':
      // Meetings: always valid for now
      return true;

    case 'compose': {
      // Compose: all selected channels must have non-empty drafts
      const allChannelsHaveContent = data.channels.every(ch => {
        const draft = data.channelDrafts[ch];
        return draft !== undefined && draft.trim().length > 0;
      });
      return allChannelsHaveContent;
    }

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
    let stepIds = assembleStepIds(
      hasPreSelectedClient,
      hasPreSelectedCommType,
      data.commType,
      context.additionalStepIds,
      data.recipients.length
    );

    // Conditional steps: select-documents only shows if "documents" is checked
    // in the configure-request step (only applies when configure-request is in the flow)
    if (stepIds.includes('configure-request')) {
      const configData = data.stepData['configure-request'] as {
        selectedSections?: string[];
      } | undefined;
      const documentsChecked = configData?.selectedSections?.includes('documents');
      if (!documentsChecked) {
        stepIds = stepIds.filter(id => id !== 'select-documents');
      }
    }

    // Build full step objects
    return buildFlowSteps(stepIds, data.commType);
  }, [context, data.commType, data.recipients.length, data.stepData]);

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

      // If comm type changed, default to email only, rebuild drafts, reset edited state
      if (partial.commType && partial.commType !== prev.commType) {
        const config = COMM_TYPE_CONFIGS[partial.commType];
        if (config) {
          next.channels = config.channels.includes('email') ? ['email'] : [config.channels[0]];
          next.channelDrafts = buildChannelDrafts(partial.commType, config.channels);
          next.channelEdited = {};
          next.activeComposeChannel = null;
          next.message = getMessageTemplate(partial.commType, config.channels[0]);
        }
      }

      // If channels changed (but not from commType change above), update drafts
      if (partial.channels && !partial.commType && prev.commType) {
        const newDrafts = { ...next.channelDrafts };
        // Add missing channel drafts from templates
        partial.channels.forEach(ch => {
          if (!(ch in newDrafts)) {
            newDrafts[ch] = getMessageTemplate(prev.commType!, ch);
          }
        });
        // Remove orphaned drafts
        Object.keys(newDrafts).forEach(ch => {
          if (!partial.channels!.includes(ch as Channel)) {
            delete newDrafts[ch as Channel];
          }
        });
        next.channelDrafts = newDrafts;

        // Keep message synced with active channel
        const activeChannel = next.activeComposeChannel || partial.channels[0];
        if (activeChannel && newDrafts[activeChannel]) {
          next.message = newDrafts[activeChannel]!;
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

  // WhatsApp status polling interval ref
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, []);

  /**
   * Poll WhatsApp delivery status from the API.
   * Polls every 3s for up to 60s, updating sendingStatus as receipts arrive.
   */
  const startWhatsAppPolling = useCallback((wamid: string) => {
    // Clear any existing polling
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/whatsapp/status/${encodeURIComponent(wamid)}`);
        if (!res.ok) return;
        const statusData = await res.json();

        if (statusData.status === 'delivered') {
          setSendingStatus(prev => ({ ...prev, deliveredAt: new Date() }));
        } else if (statusData.status === 'read') {
          setSendingStatus(prev => ({
            ...prev,
            deliveredAt: prev.deliveredAt || new Date(),
            readAt: new Date(),
          }));
          // Stop polling — read is the final status
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
        } else if (statusData.status === 'failed') {
          setSendingStatus(prev => ({
            ...prev,
            status: 'failed',
            error: statusData.errorMessage || 'WhatsApp delivery failed',
          }));
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
        }
      } catch {
        // Silently ignore poll errors — will retry on next interval
      }
    }, 3000);

    // Stop polling after 60 seconds regardless
    pollTimeoutRef.current = setTimeout(() => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }, 60000);
  }, []);

  const send = useCallback(async () => {
    if (sendingStatus.status === 'sending') return;

    setSendingStatus({ status: 'sending' });

    const hasWhatsApp = data.channels.includes('whatsapp');

    try {
      // Send WhatsApp for real if selected, mock everything else
      const sendPromises: Promise<void>[] = [];

      if (hasWhatsApp) {
        // Real WhatsApp send via API
        const recipient = data.recipients[0];
        const phone = recipient?.phone || '';
        const firstName = recipient?.firstName || '';
        const commType = data.commType || 'message';

        const templateParams: Record<string, string> = {
          FirstName: firstName,
          AdviserName: 'Rassie du Preez', // TODO: get from logged-in adviser context
          Link: `/client/${commType}/${recipient?.id || 'demo'}`,
          Message: data.message || '',
          DocumentList: '', // Populated from step data if applicable
        };

        // Extract document list from step data if available
        const docData = data.stepData['select-documents'] as {
          documents?: string[];
          customDocuments?: string[];
        } | undefined;
        if (docData) {
          const allDocs = [...(docData.documents || []), ...(docData.customDocuments || [])];
          if (allDocs.length > 0) {
            templateParams.DocumentList = allDocs.map(d => `- ${d}`).join('\n');
          }
        }

        sendPromises.push(
          fetch('/api/whatsapp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              commType,
              phone,
              templateParams,
            }),
          })
            .then(async res => {
              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'WhatsApp send failed');
              }
              return res.json();
            })
            .then(result => {
              // Store the wamid and start polling for delivery updates
              setSendingStatus(prev => ({
                ...prev,
                whatsappMessageId: result.wamid,
              }));
              startWhatsAppPolling(result.wamid);
            })
        );
      }

      // Mock send for non-WhatsApp channels (or all channels if no WhatsApp)
      const mockDelay = new Promise<void>(resolve => setTimeout(resolve, 1500));
      sendPromises.push(mockDelay);

      await Promise.all(sendPromises);

      const sentAt = new Date();
      setSendingStatus(prev => ({
        ...prev,
        status: 'sent',
        sentAt,
      }));

      // Mock delivery confirmation for non-WhatsApp channels
      if (!hasWhatsApp || data.channels.length > 1) {
        setTimeout(() => {
          setSendingStatus(prev => ({
            ...prev,
            deliveredAt: prev.deliveredAt || new Date(),
          }));
        }, 2000);
      }

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
  }, [sendingStatus.status, data, context, startWhatsAppPolling]);

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
