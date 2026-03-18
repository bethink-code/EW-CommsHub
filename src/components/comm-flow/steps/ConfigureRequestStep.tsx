'use client';

import { useEffect } from 'react';
import { StepProps, InfoRequestConfigData } from '@/lib/comm-flow/types';
import { INFO_SECTIONS, InfoSection } from '@/types/communications';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// DEFAULT SELECTIONS
// =============================================================================

const DEFAULT_SECTIONS = Object.entries(INFO_SECTIONS)
  .filter(([, config]) => config.defaultChecked)
  .map(([key]) => key);

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
    selectedSections: DEFAULT_SECTIONS,
    selectedDocuments: [],
    notes: '',
  };

  // Initialize step data on mount if not set
  useEffect(() => {
    if (!data.stepData['configure-request']) {
      onStepDataChange('configure-request', {
        selectedSections: DEFAULT_SECTIONS,
        selectedDocuments: [],
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

  // Required sections — always checked, can't be unchecked
  const REQUIRED_SECTIONS: InfoSection[] = ['personal-information', 'contact-details'];

  // Toggle section
  const toggleSection = (section: InfoSection) => {
    if (REQUIRED_SECTIONS.includes(section)) return;
    const isSelected = stepData.selectedSections.includes(section);
    updateData({
      selectedSections: isSelected
        ? stepData.selectedSections.filter(s => s !== section)
        : [...stepData.selectedSections, section],
    });
  };

  return (
    <div className="configure-request-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">What information do you need?</h2>
        </div>
      )}

      {/* Flat checkbox list in white card */}
      <div className="config-card">
        {(Object.entries(INFO_SECTIONS) as [InfoSection, { label: string; boldPrefix: string; rest: string; defaultChecked: boolean }][])
          .map(([key, config]) => {
            const isRequired = REQUIRED_SECTIONS.includes(key as InfoSection);
            const isSelected = isRequired || stepData.selectedSections.includes(key);
            return (
              <label key={key} className={`config-checkbox-row ${isRequired ? 'disabled' : ''}`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isRequired}
                  onChange={() => toggleSection(key as InfoSection)}
                />
                <span className="config-checkbox-text">
                  <strong>{config.boldPrefix}</strong>{config.rest}
                </span>
              </label>
            );
          })}
      </div>
    </div>
  );
}

// Register this step
registerStep('configure-request', ConfigureRequestStep);

export default ConfigureRequestStep;
