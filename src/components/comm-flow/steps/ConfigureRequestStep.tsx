'use client';

import { useEffect } from 'react';
import { StepProps, InfoRequestConfigData } from '@/lib/comm-flow/types';
import { INFO_SECTIONS, DOCUMENT_TYPES, InfoSection, DocumentType } from '@/types/communications';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// COMPONENT
// =============================================================================

export function ConfigureRequestStep({
  data,
  client,
  onStepDataChange,
  hideStepHeader,
}: StepProps) {
  // Get current step data or initialize
  const stepData: InfoRequestConfigData = (data.stepData['configure-request'] as InfoRequestConfigData) || {
    selectedSections: ['contact-details', 'family-members', 'employment', 'financial', 'tax'],
    selectedDocuments: ['id-document', 'proof-of-address', 'bank-statement'],
    notes: '',
  };

  // Initialize step data on mount if not set
  useEffect(() => {
    if (!data.stepData['configure-request']) {
      onStepDataChange('configure-request', {
        selectedSections: ['contact-details', 'family-members', 'employment', 'financial', 'tax'],
        selectedDocuments: ['id-document', 'proof-of-address', 'bank-statement'],
        notes: '',
      } as InfoRequestConfigData);
    }
  }, [data.stepData, onStepDataChange]);

  // Update step data
  const updateData = (updates: Partial<InfoRequestConfigData>) => {
    onStepDataChange('configure-request', {
      ...stepData,
      ...updates,
    } as InfoRequestConfigData);
  };

  // Toggle section
  const toggleSection = (section: InfoSection) => {
    // Contact details is always required
    if (section === 'contact-details') return;

    const isSelected = stepData.selectedSections.includes(section);
    updateData({
      selectedSections: isSelected
        ? stepData.selectedSections.filter(s => s !== section)
        : [...stepData.selectedSections, section],
    });
  };

  // Toggle document
  const toggleDocument = (doc: DocumentType) => {
    const isSelected = stepData.selectedDocuments.includes(doc);
    updateData({
      selectedDocuments: isSelected
        ? stepData.selectedDocuments.filter(d => d !== doc)
        : [...stepData.selectedDocuments, doc],
    });
  };

  const hasSections = stepData.selectedSections.length > 0;

  return (
    <div className="configure-request-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Configure Request</h2>
          <p className="step-subtitle">
            Select what information to request from {client?.firstName || 'the client'}
          </p>
        </div>
      )}

      {/* Always Included */}
      <div className="config-section">
        <span className="config-section-label">Always Included</span>
        <div className="config-option locked">
          <input type="checkbox" checked disabled />
          <span>Contact details</span>
          <span className="material-icons-outlined lock-icon">lock</span>
        </div>
      </div>

      {/* Optional Sections */}
      <div className="config-section">
        <span className="config-section-label">Optional Sections</span>
        <div className="config-options-list">
          {(Object.entries(INFO_SECTIONS) as [InfoSection, { label: string; required: boolean }][])
            .filter(([key]) => key !== 'contact-details')
            .map(([key, { label }]) => {
              const isSelected = stepData.selectedSections.includes(key);
              return (
                <label
                  key={key}
                  className={`config-option ${isSelected ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSection(key)}
                  />
                  <span>{label}</span>
                </label>
              );
            })}
        </div>
      </div>

      {/* Documents */}
      <div className="config-section">
        <span className="config-section-label">Documents (Optional)</span>
        <p className="config-hint">Select the documents you'd like to request from the client.</p>
        <div className="config-chips">
          {(Object.entries(DOCUMENT_TYPES) as [DocumentType, { label: string }][]).map(([key, { label }]) => {
            const isSelected = stepData.selectedDocuments.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleDocument(key)}
                className={`config-chip ${isSelected ? 'selected' : ''}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="config-section">
        <div className="flow-form-group">
          <label className="flow-form-label">Notes (optional)</label>
          <textarea
            value={stepData.notes}
            onChange={(e) => updateData({ notes: e.target.value })}
            className="flow-form-textarea"
            rows={3}
            placeholder="e.g., 'Please upload your latest investment statement from Old Mutual'"
          />
        </div>
      </div>

    </div>
  );
}

// Register this step
registerStep('configure-request', ConfigureRequestStep);

export default ConfigureRequestStep;
