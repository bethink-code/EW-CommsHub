'use client';

import { useMemo, useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import { Modal } from '@/components/Modal';
import { CommFlowContext, FlowStep } from '@/lib/comm-flow/types';
import { useCommFlow } from '@/lib/comm-flow/useCommFlow';
import './comm-flow.css';

// Import all steps to register them
import './steps';

// =============================================================================
// ANIMATED HEIGHT WRAPPER
// =============================================================================

function AnimatedHeight({ children }: { children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const isFirstRender = useRef(true);

  const updateHeight = useCallback(() => {
    if (innerRef.current) {
      setHeight(innerRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    // Set initial height without transition
    setHeight(el.scrollHeight);
    // Allow transitions after first paint
    requestAnimationFrame(() => {
      isFirstRender.current = false;
    });

    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateHeight]);

  return (
    <div
      className="animated-height"
      style={{
        height: height !== undefined ? height : 'auto',
        transition: isFirstRender.current ? 'none' : 'height 250ms ease-out',
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

// =============================================================================
// TYPES
// =============================================================================

export interface CommFlowProps {
  context: CommFlowContext;
}

// =============================================================================
// FLOW PROGRESS COMPONENT
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

  // Render based on mode
  if (context.renderMode === 'modal') {
    // Determine modal title based on state
    let title = flow.currentStep?.label || 'Communication';
    if (isSending) {
      title = 'Sending...';
    } else if (isSent) {
      title = 'Sent Successfully';
    }

    // Build modal footer (pinned to bottom)
    const modalFooter = isSending || isSent ? null : (
      <div className="comm-flow-modal-footer">
        <div className="modal-footer-left">
          {isFirstStep ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={context.onCancel || (() => {})}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
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
        title={title}
        size="lg"
        closeOnOverlayClick={!isSending}
        closeOnEscape={!isSending}
        footer={modalFooter}
      >
        {/* Progress bar */}
        <FlowProgress
          steps={flow.steps}
          currentIndex={flow.currentStepIndex}
          onStepClick={flow.goToStep}
          mode="modal"
        />

        {/* Step content — height animates smoothly between steps */}
        <div className="comm-flow-content">
          <AnimatedHeight>
            {StepComponent && <StepComponent {...stepProps} />}
          </AnimatedHeight>
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
