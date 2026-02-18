'use client';

import { useEffect } from 'react';
import { StepProps, PortalInviteStepData } from '@/lib/comm-flow/types';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// COMPONENT
// =============================================================================

export function ConfigureAccessStep({
  data,
  client,
  onStepDataChange,
  hideStepHeader,
}: StepProps) {
  // Get current step data or initialize
  const stepData: PortalInviteStepData = (data.stepData['configure-access'] as PortalInviteStepData) || {
    username: client?.email || '',
  };

  // Initialize step data on mount if not set
  useEffect(() => {
    if (!data.stepData['configure-access']) {
      onStepDataChange('configure-access', {
        username: client?.email || '',
      } as PortalInviteStepData);
    }
  }, [client?.email, data.stepData, onStepDataChange]);

  // Update step data
  const updateData = (updates: Partial<PortalInviteStepData>) => {
    onStepDataChange('configure-access', {
      ...stepData,
      ...updates,
    } as PortalInviteStepData);
  };

  return (
    <div className="configure-access-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Configure Access</h2>
          <p className="step-subtitle">
            Set up portal access for {client?.firstName || 'the client'}
          </p>
        </div>
      )}

      {/* Access info */}
      <div className="config-section">
        <div className="flow-info-box">
          <span className="material-icons-outlined">devices</span>
          <span>The client will get access to the <strong>Wealth Portal</strong> (web) and <strong>Mobile App</strong>. Same login works everywhere.</span>
        </div>
      </div>

      {/* Username */}
      <div className="config-section">
        <div className="flow-form-group">
          <label className="flow-form-label">Username</label>
          <p className="flow-form-hint">This will be their login for both web and mobile. You can change it if needed.</p>
          <input
            type="email"
            value={stepData.username}
            onChange={(e) => updateData({ username: e.target.value })}
            className="flow-form-input"
            placeholder="client@email.com"
          />
        </div>
      </div>

    </div>
  );
}

// Register this step
registerStep('configure-access', ConfigureAccessStep);

export default ConfigureAccessStep;
