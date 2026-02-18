'use client';

import { useState, useCallback } from 'react';
import { Modal } from '../Modal';
import { ConfigureAccessStep } from './ConfigureAccessStep';
import { ComposeInviteStep } from './ComposeInviteStep';
import { Client, Channel } from '@/types/communications';
import './portal-invite.css';

// =============================================================================
// TYPES
// =============================================================================

export interface PortalInviteData {
  // Step 1: Access configuration
  username: string;

  // Step 2: Message
  channel: Channel;
  message: string;
}

export interface SendingStatus {
  status: 'idle' | 'sending' | 'sent' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
}

export type FlowStep = 'configure-access' | 'compose-message';

const STEPS: FlowStep[] = ['configure-access', 'compose-message'];

const STEP_TITLES: Record<FlowStep, string> = {
  'configure-access': 'Configure Access',
  'compose-message': 'Compose Invitation',
};

// Default message templates per channel
const DEFAULT_MESSAGES: Record<Channel, string> = {
  sms: `Hi {FirstName},

I'd like to give you access to your personal Wealth Portal. View your portfolio, statements, and more – all in one secure place.

Set up your account here:
{Link}

Questions? Just reply to this message.

Regards,
{AdviserName}
Elite Wealth`,
  whatsapp: `Hi {FirstName},

I'd like to give you access to your personal Wealth Portal. View your portfolio, statements, and more – all in one secure place.

Set up your account here:
{Link}

The same login will work on both our web portal and mobile app.

Questions? Just reply to this message.

Regards,
{AdviserName}
Elite Wealth`,
  email: `Dear {FirstName},

I'm pleased to invite you to access your personal Wealth Portal – a secure platform where you can view your portfolio, download statements, and track your investments at any time.

Setting up your account takes just a few minutes:
{Link}

The same login will work on both our web portal and mobile app, giving you flexibility to check in whenever suits you.

If you have any questions, please don't hesitate to reach out.

Kind regards,
{AdviserName}
Elite Wealth
+27 82 555 1234`,
  'in-app': `Hi {FirstName},

Your client portal is ready for activation: {Link}

{AdviserName}`,
};

// =============================================================================
// COMPONENT
// =============================================================================

export interface PortalInviteFlowProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onComplete?: (data: PortalInviteData) => void;
}

export function PortalInviteFlow({
  isOpen,
  onClose,
  client,
  onComplete,
}: PortalInviteFlowProps) {
  // Current step
  const [currentStep, setCurrentStep] = useState<FlowStep>('configure-access');

  // Form data
  const [data, setData] = useState<PortalInviteData>(() => ({
    username: client.email || '',
    channel: 'sms',
    message: DEFAULT_MESSAGES['sms'],
  }));

  // Sending status
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>({ status: 'idle' });

  // Track if form has been modified
  const [isDirty, setIsDirty] = useState(false);

  // =============================================================================
  // NAVIGATION
  // =============================================================================

  const currentStepIndex = STEPS.indexOf(currentStep);

  const goNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  }, [currentStepIndex]);

  const goBack = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  }, [currentStepIndex]);

  // =============================================================================
  // DATA UPDATE
  // =============================================================================

  const updateUsername = useCallback((username: string) => {
    setData(prev => ({ ...prev, username }));
    setIsDirty(true);
  }, []);

  // Handle channel change - also update message to channel's default if not dirty
  const handleChannelChange = useCallback((channel: Channel) => {
    setData(prev => ({
      ...prev,
      channel,
      // Only replace message if it matches the previous channel's default
      message: prev.message === DEFAULT_MESSAGES[prev.channel]
        ? DEFAULT_MESSAGES[channel]
        : prev.message,
    }));
    setIsDirty(true);
  }, []);

  const updateMessage = useCallback((message: string) => {
    setData(prev => ({ ...prev, message }));
    setIsDirty(true);
  }, []);

  // =============================================================================
  // CLOSE HANDLING
  // =============================================================================

  const handleClose = useCallback(() => {
    // Reset state
    setCurrentStep('configure-access');
    setData({
      username: client.email || '',
      channel: 'sms',
      message: DEFAULT_MESSAGES['sms'],
    });
    setSendingStatus({ status: 'idle' });
    setIsDirty(false);
    onClose();
  }, [client, onClose]);

  // =============================================================================
  // SEND
  // =============================================================================

  const handleSend = useCallback(async () => {
    setSendingStatus({ status: 'sending' });

    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSendingStatus({
      status: 'sent',
      sentAt: new Date(),
    });

    // Simulate delivery confirmation
    setTimeout(() => {
      setSendingStatus(prev => ({
        ...prev,
        deliveredAt: new Date(),
      }));
    }, 2000);

    if (onComplete) {
      onComplete(data);
    }
  }, [data, onComplete]);

  // =============================================================================
  // RENDER
  // =============================================================================

  const renderStep = () => {
    switch (currentStep) {
      case 'configure-access':
        return (
          <ConfigureAccessStep
            client={client}
            username={data.username}
            onUsernameChange={updateUsername}
            onCancel={handleClose}
            onNext={goNext}
          />
        );

      case 'compose-message':
        return (
          <ComposeInviteStep
            client={client}
            channel={data.channel}
            message={data.message}
            sendingStatus={sendingStatus}
            onChannelChange={handleChannelChange}
            onMessageChange={updateMessage}
            onCancel={handleClose}
            onBack={goBack}
            onSend={handleSend}
          />
        );

      default:
        return null;
    }
  };

  // Determine title based on sending status
  const title = sendingStatus.status === 'sending' || sendingStatus.status === 'sent'
    ? 'Sending Invitation'
    : STEP_TITLES[currentStep];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="lg"
      closeOnOverlayClick={!isDirty && sendingStatus.status !== 'sending'}
      closeOnEscape={!isDirty && sendingStatus.status !== 'sending'}
    >
      {renderStep()}
    </Modal>
  );
}

export default PortalInviteFlow;
