'use client';

import { useEffect } from 'react';
import { StepProps, ScheduleStepData } from '@/lib/comm-flow/types';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// COMPONENT
// =============================================================================

export function ScheduleStep({
  data,
  client,
  onStepDataChange,
  hideStepHeader,
}: StepProps) {
  // Get current step data or initialize
  const stepData: ScheduleStepData = (data.stepData['schedule'] as ScheduleStepData) || {
    date: '',
    time: '',
    location: '',
    duration: 60,
    notes: '',
  };

  // Initialize step data on mount if not set
  useEffect(() => {
    if (!data.stepData['schedule']) {
      onStepDataChange('schedule', {
        date: '',
        time: '',
        location: '',
        duration: 60,
        notes: '',
      } as ScheduleStepData);
    }
  }, [data.stepData, onStepDataChange]);

  // Update step data
  const updateData = (updates: Partial<ScheduleStepData>) => {
    onStepDataChange('schedule', {
      ...stepData,
      ...updates,
    } as ScheduleStepData);
  };

  // For demo purposes, always allow proceeding
  const canProceed = true;

  return (
    <div className="schedule-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Schedule Meeting</h2>
          <p className="step-subtitle">
            Set the date, time, and location for your meeting with {client?.firstName || 'the client'}
          </p>
        </div>
      )}

      {/* Date and Time */}
      <div className="schedule-row">
        <div className="flow-form-group" style={{ flex: 1 }}>
          <label className="flow-form-label">Date</label>
          <input
            type="date"
            value={stepData.date}
            onChange={(e) => updateData({ date: e.target.value })}
            className="flow-form-input"
          />
        </div>

        <div className="flow-form-group" style={{ flex: 1 }}>
          <label className="flow-form-label">Time</label>
          <input
            type="time"
            value={stepData.time}
            onChange={(e) => updateData({ time: e.target.value })}
            className="flow-form-input"
          />
        </div>
      </div>

      {/* Duration */}
      <div className="flow-form-group">
        <label className="flow-form-label">Duration</label>
        <select
          value={stepData.duration}
          onChange={(e) => updateData({ duration: parseInt(e.target.value, 10) })}
          className="flow-form-input"
        >
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </select>
      </div>

      {/* Location */}
      <div className="flow-form-group">
        <label className="flow-form-label">Location</label>
        <input
          type="text"
          value={stepData.location}
          onChange={(e) => updateData({ location: e.target.value })}
          className="flow-form-input"
          placeholder="e.g., Elite Wealth Office, Client's home, Virtual (Zoom)"
        />
      </div>

      {/* Notes */}
      <div className="flow-form-group">
        <label className="flow-form-label">Notes (optional)</label>
        <textarea
          value={stepData.notes}
          onChange={(e) => updateData({ notes: e.target.value })}
          className="flow-form-textarea"
          rows={3}
          placeholder="Any additional details for the meeting..."
        />
      </div>

      {/* Info notice */}
      <div className="flow-info-box">
        <span className="material-icons-outlined">info</span>
        <span>
          Meeting details will be included in the invitation message.
          The client will receive calendar integration links.
        </span>
      </div>

    </div>
  );
}

// Register this step
registerStep('schedule', ScheduleStep);

export default ScheduleStep;
