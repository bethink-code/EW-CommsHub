'use client';

import { ModalFooter, ModalSection } from '../Modal';
import { Client } from '@/types/communications';

// =============================================================================
// TYPES
// =============================================================================

export interface AccessOptions {
  webPortal: true;
  mobileApp: true;
}

// =============================================================================
// COMPONENT
// =============================================================================

export interface ConfigureAccessStepProps {
  client: Client;
  username: string;
  onUsernameChange: (username: string) => void;
  onCancel: () => void;
  onNext: () => void;
}

export function ConfigureAccessStep({
  client,
  username,
  onUsernameChange,
  onCancel,
  onNext,
}: ConfigureAccessStepProps) {
  const hasValidUsername = username.trim().length > 0 && username.includes('@');

  return (
    <div className="configure-access-step">
      <div className="configure-access-layout">
        {/* Left column: Options */}
        <div className="configure-access-options">
          {/* Access info */}
          <ModalSection title={`Set up portal access for ${client.firstName}`}>
            <p className="access-subtitle">
              The client will get access to the <strong>Wealth Portal</strong> (web) and <strong>Mobile App</strong>. Same login works everywhere.
            </p>
          </ModalSection>

          {/* Username */}
          <div className="username-section">
            <label className="username-label">Username</label>
            <p className="username-hint">This will be their login for both web and mobile. You can change it if needed.</p>
            <input
              type="email"
              id="portal-username"
              className="modal-input"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder="client@example.com"
            />
          </div>
        </div>

        {/* Right column: Preview placeholder */}
        <div className="configure-access-preview">
          <div className="access-preview-placeholder">
            <span className="material-icons-outlined">devices</span>
            <span>Configure portal access for {client.firstName}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="step-footer">
        <ModalFooter
          onCancel={onCancel}
          onPrimary={onNext}
          primaryLabel="Next: Compose Message"
          primaryIcon="arrow_forward"
          primaryDisabled={!hasValidUsername}
        />
      </div>
    </div>
  );
}

export default ConfigureAccessStep;
