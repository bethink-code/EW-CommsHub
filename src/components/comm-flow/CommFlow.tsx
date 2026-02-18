'use client';

import { useMemo } from 'react';
import { Modal } from '@/components/Modal';
import { CommFlowContext, FlowStep } from '@/lib/comm-flow/types';
import { useCommFlow } from '@/lib/comm-flow/useCommFlow';
import { COMM_TYPE_CONFIGS } from '@/types/communications';
import './comm-flow.css';

// Import all steps to register them
import './steps';

// =============================================================================
// TYPES
// =============================================================================

export interface CommFlowProps {
  context: CommFlowContext;
}

// =============================================================================
// PILL STEPPER (modal mode)
// =============================================================================

interface PillStepperProps {
  steps: FlowStep[];
  currentIndex: number;
  allCompleted?: boolean;
  onStepClick: (stepId: string) => void;
}

function PillStepper({ steps, currentIndex, allCompleted, onStepClick }: PillStepperProps) {
  return (
    <div className="pill-stepper">
      {steps.map((step, index) => {
        const isCompleted = allCompleted || index < currentIndex;
        const isCurrent = !allCompleted && index === currentIndex;
        const isUpcoming = !allCompleted && index > currentIndex;

        return (
          <button
            key={step.id}
            className={`pill-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${isUpcoming ? 'upcoming' : ''}`}
            onClick={() => onStepClick(step.id)}
            disabled={isUpcoming}
          >
            <span className="pill-step-badge">
              {isCompleted ? (
                <span className="material-icons-outlined" style={{ fontSize: '16px' }}>check</span>
              ) : (
                index + 1
              )}
            </span>
            <span className="pill-step-label">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// =============================================================================
// FLOW PROGRESS COMPONENT (page mode only)
// =============================================================================

interface FlowProgressProps {
  steps: FlowStep[];
  currentIndex: number;
  onStepClick: (stepId: string) => void;
  mode: 'modal' | 'page';
}

function FlowProgress({ steps, currentIndex, onStepClick, mode }: FlowProgressProps) {
  return (
    <div className={`flow-progress ${mode === 'modal' ? 'mode-modal compact' : ''}`}>
      {steps.map((step, index) => (
        <button
          key={step.id}
          className={`flow-progress-step ${
            index === currentIndex ? 'active' : ''
          } ${index < currentIndex ? 'completed' : ''}`}
          onClick={() => onStepClick(step.id)}
          disabled={index > currentIndex}
        >
          <span className="progress-step-number">
            {index < currentIndex ? (
              <span className="material-icons-outlined" style={{ fontSize: '16px' }}>check</span>
            ) : (
              index + 1
            )}
          </span>
          <span className="progress-step-info">
            <span className="progress-step-label">{step.label}</span>
            <span className="progress-step-desc">{step.description}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// FLOW FOOTER COMPONENT
// =============================================================================

interface FlowFooterProps {
  currentIndex: number;
  totalSteps: number;
  currentLabel: string;
  canProceed: boolean;
  isLastStep: boolean;
  isSending: boolean;
  mode: 'modal' | 'page';
  onBack: () => void;
  onNext: () => void;
  onSend: () => void;
  onCancel: () => void;
}

function FlowFooter({
  currentIndex,
  totalSteps,
  currentLabel,
  canProceed,
  isLastStep,
  isSending,
  mode,
  onBack,
  onNext,
  onSend,
  onCancel,
}: FlowFooterProps) {
  // For modal mode, footer is part of the step component
  if (mode === 'modal') {
    return null;
  }

  return (
    <div className={`flow-footer mode-${mode}`}>
      <div className="flow-footer-left">
        {currentIndex > 0 ? (
          <button className="btn btn-outline-primary" onClick={onBack}>
            <span className="material-icons-outlined">chevron_left</span>
            Previous
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <div className="flow-footer-center">
        <span className="flow-step-indicator">
          Step {currentIndex + 1} / {totalSteps}
        </span>
        <span className="flow-step-label">{currentLabel}</span>
      </div>

      <div className="flow-footer-right">
        {isLastStep ? (
          <button
            className="btn btn-primary"
            onClick={onSend}
            disabled={!canProceed || isSending}
          >
            Send Now
            <span className="material-icons-outlined">send</span>
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!canProceed}
          >
            Next
            <span className="material-icons-outlined">chevron_right</span>
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMMFLOW COMPONENT
// =============================================================================

export function CommFlow({ context }: CommFlowProps) {
  const flow = useCommFlow(context);

  // Determine if this is the first/last step
  const isFirstStep = flow.currentStepIndex === 0;
  const isLastStep = flow.currentStepIndex === flow.steps.length - 1;
  const isSending = flow.sendingStatus.status === 'sending';
  const isSent = flow.sendingStatus.status === 'sent';

  // Get the current step component
  const StepComponent = flow.currentStep?.component;

  // Build step props
  const stepProps = useMemo(() => ({
    data: flow.data,
    context,
    client: flow.data.recipients[0] || null,
    onDataChange: flow.updateData,
    onStepDataChange: flow.updateStepData,
    onNext: flow.goNext,
    onBack: flow.goBack,
    onCancel: context.onCancel || (() => {}),
    sendingStatus: flow.sendingStatus,
    onSend: flow.send,
    isFirstStep,
    isLastStep,
  }), [flow, context, isFirstStep, isLastStep]);

  // Build context chips (shown when steps are skipped via pre-selection)
  const contextChips = useMemo(() => {
    const chips: { label: string; value: string }[] = [];
    if (context.preSelectedClient) {
      chips.push({ label: 'To', value: `${context.preSelectedClient.firstName} ${context.preSelectedClient.lastName}` });
    } else if (context.preSelectedClients?.length) {
      const names = context.preSelectedClients.slice(0, 2).map(c => `${c.firstName} ${c.lastName}`).join(', ');
      const extra = context.preSelectedClients.length > 2
        ? ` +${context.preSelectedClients.length - 2}`
        : '';
      chips.push({ label: 'To', value: names + extra });
    }
    if (context.preSelectedCommType) {
      const config = COMM_TYPE_CONFIGS[context.preSelectedCommType];
      if (config) {
        chips.push({ label: 'Type', value: config.name });
      }
    }
    return chips;
  }, [context]);

  // Render based on mode
  if (context.renderMode === 'modal') {
    // Build modal footer (pinned to bottom)
    const modalFooter = isSending || isSent ? null : (
      <div className="comm-flow-modal-footer">
        <div className="modal-footer-left">
          {isFirstStep ? (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={context.onCancel || (() => {})}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={flow.goBack}
            >
              <span className="material-icons-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              Back
            </button>
          )}
        </div>
        <div className="modal-footer-right">
          {isLastStep ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={flow.send}
              disabled={!flow.canProceed || isSending}
            >
              Send Now
              <span className="material-icons-outlined" style={{ fontSize: '18px' }}>send</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={flow.goNext}
              disabled={!flow.canProceed}
            >
              Next
              <span className="material-icons-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </button>
          )}
        </div>
      </div>
    );

    return (
      <Modal
        isOpen={true}
        onClose={context.onCancel || (() => {})}
        title="New Communication"
        size="lg"
        className="comm-flow-modal"
        closeOnOverlayClick={!isSending}
        closeOnEscape={!isSending}
        footer={modalFooter}
      >
        {/* Zone 1: Header zone — stepper + title/subtitle + context chips */}
        <div className="comm-flow-header-zone">
          <PillStepper
            steps={flow.steps}
            currentIndex={flow.currentStepIndex}
            allCompleted={isSent}
            onStepClick={flow.goToStep}
          />

          {/* Step title + subtitle */}
          {!isSent && flow.currentStep && (
            <div className="comm-flow-step-heading">
              <h3 className="comm-flow-step-title">{flow.currentStep.title || flow.currentStep.label}</h3>
              {flow.currentStep.subtitle && (
                <p className="comm-flow-step-subtitle">{flow.currentStep.subtitle}</p>
              )}
            </div>
          )}

          {/* Context chips for skipped steps */}
          {contextChips.length > 0 && !isSent && (
            <div className="context-chips">
              {contextChips.map((chip) => (
                <span key={chip.label} className="context-chip">
                  <span className="context-chip-label">{chip.label}:</span> {chip.value}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Zone 2: Content zone — grey background */}
        <div className="comm-flow-content-zone">
          {StepComponent && <StepComponent {...stepProps} hideStepHeader />}
        </div>
      </Modal>
    );
  }

  // Page mode
  return (
    <div className="comm-flow mode-page">
      {/* Progress bar */}
      <FlowProgress
        steps={flow.steps}
        currentIndex={flow.currentStepIndex}
        onStepClick={flow.goToStep}
        mode="page"
      />

      {/* Step content */}
      <div className="comm-flow-content">
        {StepComponent && <StepComponent {...stepProps} />}
      </div>

      {/* Footer (page mode only - modal steps have their own footer) */}
      <FlowFooter
        currentIndex={flow.currentStepIndex}
        totalSteps={flow.steps.length}
        currentLabel={flow.currentStep?.label || ''}
        canProceed={flow.canProceed}
        isLastStep={isLastStep}
        isSending={flow.sendingStatus.status === 'sending'}
        mode="page"
        onBack={flow.goBack}
        onNext={flow.goNext}
        onSend={flow.send}
        onCancel={context.onCancel || (() => {})}
      />
    </div>
  );
}

export default CommFlow;
