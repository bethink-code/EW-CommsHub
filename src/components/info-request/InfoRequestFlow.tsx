'use client';

import { useState, useCallback } from 'react';
import { Modal } from '../Modal';
import { ConfirmContactStep } from './ConfirmContactStep';
import { ConfigureRequestStep } from './ConfigureRequestStep';
import { ComposeMessageStep } from './ComposeMessageStep';
import { ConfirmSendStep } from './ConfirmSendStep';
import {
  Client,
  Channel,
  InfoSection,
  DocumentType,
} from '@/types/communications';
import './info-request.css';

// =============================================================================
// TYPES
// =============================================================================

export interface InfoRequestData {
  // Step 1: Contact details & channels
  email: string;
  phone: string;
  channels: Channel[];

  // Step 2: Request configuration
  sections: InfoSection[];
  documents: DocumentType[];
  notes: string;

  // Step 3: Message composition (per-channel messages)
  messages: Record<Channel, string>;
}

export interface SendingStatus {
  status: 'idle' | 'sending' | 'sent' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
}

export type FlowStep = 'confirm-contact' | 'configure-request' | 'compose-message' | 'confirm-send';

const STEPS: FlowStep[] = ['confirm-contact', 'configure-request', 'compose-message', 'confirm-send'];

const STEP_TITLES: Record<FlowStep, string> = {
  'confirm-contact': 'Confirm Contact Details',
  'configure-request': 'Configure Request',
  'compose-message': 'Compose Message',
  'confirm-send': 'Confirm & Send',
};

// Default message templates per channel
const DEFAULT_MESSAGES: Record<Channel, string> = {
  sms: `Hi {FirstName},

To ensure I'm giving you the best possible advice, I need to gather some up-to-date information about your financial situation.

Please complete this short, secure form: {Link}

Thanks,
{AdviserName}`,
  whatsapp: `Hi {FirstName},

To ensure I'm giving you the best possible advice, I need to gather some up-to-date information about your financial situation.

Please complete this short, secure form: {Link}

Let me know if you have any questions!

Thanks,
{AdviserName}`,
  email: `Dear {FirstName},

I hope this message finds you well.

To ensure I'm providing you with the best possible advice, I need to gather some up-to-date information about your financial situation.

Please take a few minutes to complete this secure form:
{Link}

The information you provide will help me better understand your current circumstances and goals.

If you have any questions, please don't hesitate to reach out.

Best regards,
{AdviserName}`,
  'in-app': `Hi {FirstName},

Please complete this short form to update your information: {Link}

Thanks,
{AdviserName}`,
};

// =============================================================================
// COMPONENT
// =============================================================================

export interface InfoRequestFlowProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onComplete?: (data: InfoRequestData) => void;
}

export function InfoRequestFlow({
  isOpen,
  onClose,
  client,
  onComplete,
}: InfoRequestFlowProps) {
  // Current step
  const [currentStep, setCurrentStep] = useState<FlowStep>('confirm-contact');

  // Form data
  const [data, setData] = useState<InfoRequestData>(() => ({
    email: client.email || '',
    phone: client.phone || '',
    channels: client.preferredChannel ? [client.preferredChannel] : ['email'],
    sections: ['contact-details'], // Required section always included
    documents: [],
    notes: '',
    messages: { ...DEFAULT_MESSAGES },
  }));

  // Sending status (for Step 4)
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>({ status: 'idle' });

  // Track if form has been modified (for close confirmation)
  const [isDirty, setIsDirty] = useState(false);

  // =============================================================================
  // NAVIGATION
  // =============================================================================

  const currentStepIndex = STEPS.indexOf(currentStep);

  const goToStep = useCallback((step: FlowStep) => {
    setCurrentStep(step);
  }, []);

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

  const updateData = useCallback(<K extends keyof InfoRequestData>(
    field: K,
    value: InfoRequestData[K]
  ) => {
    setData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  // Toggle channel selection (multi-select)
  const handleChannelToggle = useCallback((channel: Channel) => {
    setData(prev => {
      const isSelected = prev.channels.includes(channel);
      const newChannels = isSelected
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel];
      return { ...prev, channels: newChannels };
    });
    setIsDirty(true);
  }, []);

  // Update message for a specific channel
  const handleMessageChange = useCallback((channel: Channel, message: string) => {
    setData(prev => ({
      ...prev,
      messages: { ...prev.messages, [channel]: message },
    }));
    setIsDirty(true);
  }, []);

  // =============================================================================
  // CLOSE HANDLING
  // =============================================================================

  const handleClose = useCallback(() => {
    if (isDirty && sendingStatus.status !== 'sent') {
      // Could add confirmation dialog here
      // For now, just close
    }
    // Reset state
    setCurrentStep('confirm-contact');
    setData({
      email: client.email || '',
      phone: client.phone || '',
      channels: client.preferredChannel ? [client.preferredChannel] : ['email'],
      sections: ['contact-details'],
      documents: [],
      notes: '',
      messages: { ...DEFAULT_MESSAGES },
    });
    setSendingStatus({ status: 'idle' });
    setIsDirty(false);
    onClose();
  }, [isDirty, sendingStatus.status, client, onClose]);

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
      case 'confirm-contact':
        return (
          <ConfirmContactStep
            client={client}
            email={data.email}
            phone={data.phone}
            channels={data.channels}
            onEmailChange={(email) => updateData('email', email)}
            onPhoneChange={(phone) => updateData('phone', phone)}
            onChannelToggle={handleChannelToggle}
            onCancel={handleClose}
            onNext={goNext}
          />
        );

      case 'configure-request':
        return (
          <ConfigureRequestStep
            sections={data.sections}
            documents={data.documents}
            notes={data.notes}
            onSectionsChange={(sections) => updateData('sections', sections)}
            onDocumentsChange={(documents) => updateData('documents', documents)}
            onNotesChange={(notes) => updateData('notes', notes)}
            onCancel={handleClose}
            onBack={goBack}
            onNext={goNext}
          />
        );

      case 'compose-message':
        return (
          <ComposeMessageStep
            client={client}
            channels={data.channels}
            messages={data.messages}
            onMessageChange={handleMessageChange}
            onCancel={handleClose}
            onBack={goBack}
            onNext={goNext}
          />
        );

      case 'confirm-send':
        return (
          <ConfirmSendStep
            client={client}
            data={data}
            sendingStatus={sendingStatus}
            onBack={goBack}
            onSend={handleSend}
            onDone={handleClose}
          />
        );

      default:
        return null;
    }
  };

  // Determine title based on sending status
  const title = sendingStatus.status === 'sending' || sendingStatus.status === 'sent'
    ? 'Sending Request'
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

export default InfoRequestFlow;
