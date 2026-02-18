'use client';

import { useState, useCallback } from 'react';
import { Modal } from '../Modal';
import { SelectDocumentsStep } from './SelectDocumentsStep';
import { ComposeMessageStep } from './ComposeMessageStep';
import { PreviewSendStep } from './PreviewSendStep';
import { Client, Channel } from '@/types/communications';
import './document-request.css';

// =============================================================================
// TYPES
// =============================================================================

export interface DocumentRequestData {
  // Step 1: Document selection
  documents: string[];
  customDocuments: string[];
  notes: string;

  // Step 2: Message composition
  channel: Channel;
  message: string;
}

export interface SendingStatus {
  status: 'idle' | 'sending' | 'sent' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
}

export type FlowStep = 'select-documents' | 'compose-message' | 'preview-send';

const STEPS: FlowStep[] = ['select-documents', 'compose-message', 'preview-send'];

const STEP_TITLES: Record<FlowStep, string> = {
  'select-documents': 'Request Documents',
  'compose-message': 'Compose Message',
  'preview-send': 'Preview & Send',
};

// Default message templates per channel
const DEFAULT_MESSAGES: Record<Channel, string> = {
  sms: `Hi {FirstName},

I need a few documents from you to proceed with your financial planning:

{DocumentList}

Please upload them here: {Link}

Thanks,
{AdviserName}`,
  whatsapp: `Hi {FirstName},

I need a few documents from you to proceed with your financial planning:

{DocumentList}

Please upload them securely here: {Link}

Let me know if you have any questions!

Thanks,
{AdviserName}`,
  email: `Dear {FirstName},

I hope this message finds you well.

To proceed with your financial planning, I need the following documents:

{DocumentList}

Please upload them securely using this link:
{Link}

You can also reply to this email with the documents attached if you prefer.

If you have any questions, please don't hesitate to reach out.

Best regards,
{AdviserName}`,
  'in-app': `Hi {FirstName},

Please upload the following documents: {Link}

{DocumentList}

Thanks,
{AdviserName}`,
};

// =============================================================================
// COMPONENT
// =============================================================================

export interface DocumentRequestFlowProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onComplete?: (data: DocumentRequestData) => void;
}

export function DocumentRequestFlow({
  isOpen,
  onClose,
  client,
  onComplete,
}: DocumentRequestFlowProps) {
  // Current step
  const [currentStep, setCurrentStep] = useState<FlowStep>('select-documents');

  // Form data
  const [data, setData] = useState<DocumentRequestData>(() => ({
    documents: [],
    customDocuments: [],
    notes: '',
    channel: client.preferredChannel || 'email',
    message: DEFAULT_MESSAGES[client.preferredChannel || 'email'],
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
  // DATA UPDATES
  // =============================================================================

  const updateDocuments = useCallback((documents: string[]) => {
    setData(prev => ({ ...prev, documents }));
    setIsDirty(true);
  }, []);

  const updateCustomDocuments = useCallback((customDocuments: string[]) => {
    setData(prev => ({ ...prev, customDocuments }));
    setIsDirty(true);
  }, []);

  const updateNotes = useCallback((notes: string) => {
    setData(prev => ({ ...prev, notes }));
    setIsDirty(true);
  }, []);

  const handleChannelChange = useCallback((channel: Channel) => {
    setData(prev => ({
      ...prev,
      channel,
      // Update message to channel's default if message matches previous default
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
    setCurrentStep('select-documents');
    setData({
      documents: [],
      customDocuments: [],
      notes: '',
      channel: client.preferredChannel || 'email',
      message: DEFAULT_MESSAGES[client.preferredChannel || 'email'],
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
      case 'select-documents':
        return (
          <SelectDocumentsStep
            documents={data.documents}
            customDocuments={data.customDocuments}
            notes={data.notes}
            onDocumentsChange={updateDocuments}
            onCustomDocumentsChange={updateCustomDocuments}
            onNotesChange={updateNotes}
            onCancel={handleClose}
            onNext={goNext}
          />
        );

      case 'compose-message':
        return (
          <ComposeMessageStep
            client={client}
            channel={data.channel}
            message={data.message}
            documents={data.documents}
            customDocuments={data.customDocuments}
            onChannelChange={handleChannelChange}
            onMessageChange={updateMessage}
            onCancel={handleClose}
            onBack={goBack}
            onNext={goNext}
          />
        );

      case 'preview-send':
        return (
          <PreviewSendStep
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

export default DocumentRequestFlow;
