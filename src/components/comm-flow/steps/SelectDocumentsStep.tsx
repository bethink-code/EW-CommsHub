'use client';

import { useState, useEffect, useCallback } from 'react';
import { StepProps, DocumentRequestStepData } from '@/lib/comm-flow/types';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// DOCUMENT OPTIONS
// =============================================================================

export interface DocumentOption {
  id: string;
  label: string;
  hint?: string;
}

export const STANDARD_DOCUMENTS: DocumentOption[] = [
  { id: 'id-document', label: 'ID Document', hint: 'Passport or Driver\'s License' },
  { id: 'proof-of-address', label: 'Proof of Address', hint: 'Utility bill or bank statement (< 3 months)' },
  { id: 'bank-statements', label: 'Bank Statements', hint: 'Last 3 months' },
  { id: 'tax-returns', label: 'Tax Returns', hint: 'Most recent year' },
  { id: 'employment-contract', label: 'Employment Contract', hint: 'Current employment' },
  { id: 'payslips', label: 'Payslips', hint: 'Last 3 months' },
  { id: 'investment-statements', label: 'Investment Statements', hint: 'All investment accounts' },
  { id: 'property-valuations', label: 'Property Valuations', hint: 'Recent valuations' },
  { id: 'insurance-policies', label: 'Insurance Policies', hint: 'Life, home, vehicle' },
  { id: 'will-testament', label: 'Will / Testament', hint: 'Current copy' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function SelectDocumentsStep({
  data,
  client,
  onStepDataChange,
  hideStepHeader,
}: StepProps) {
  const [customDocInput, setCustomDocInput] = useState('');

  // Get current step data or initialize
  const stepData: DocumentRequestStepData = (data.stepData['select-documents'] as DocumentRequestStepData) || {
    documents: [],
    customDocuments: [],
    notes: '',
  };

  // Initialize step data on mount if not set
  useEffect(() => {
    if (!data.stepData['select-documents']) {
      onStepDataChange('select-documents', {
        documents: [],
        customDocuments: [],
        notes: '',
      } as DocumentRequestStepData);
    }
  }, [data.stepData, onStepDataChange]);

  // Update step data
  const updateData = useCallback((updates: Partial<DocumentRequestStepData>) => {
    onStepDataChange('select-documents', {
      ...stepData,
      ...updates,
    } as DocumentRequestStepData);
  }, [stepData, onStepDataChange]);

  // Toggle document selection
  const toggleDocument = (docId: string) => {
    const isSelected = stepData.documents.includes(docId);
    updateData({
      documents: isSelected
        ? stepData.documents.filter(id => id !== docId)
        : [...stepData.documents, docId],
    });
  };

  // Add custom document
  const addCustomDocument = () => {
    const doc = customDocInput.trim();
    if (doc && !stepData.customDocuments.includes(doc)) {
      updateData({
        customDocuments: [...stepData.customDocuments, doc],
      });
      setCustomDocInput('');
    }
  };

  // Remove custom document
  const removeCustomDocument = (doc: string) => {
    updateData({
      customDocuments: stepData.customDocuments.filter(d => d !== doc),
    });
  };

  // Handle enter key for custom doc input
  const handleCustomDocKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomDocument();
    }
  };

  const hasDocuments = stepData.documents.length > 0 || stepData.customDocuments.length > 0;

  return (
    <div className="select-documents-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Request Documents</h2>
          <p className="step-subtitle">
            Select the documents you need from {client?.firstName || 'the client'}
          </p>
        </div>
      )}

      {/* Standard documents */}
      <div className="config-section">
        <h3 className="config-section-title">Standard Documents</h3>
        <div className="document-checklist">
          {STANDARD_DOCUMENTS.map(doc => {
            const isSelected = stepData.documents.includes(doc.id);
            return (
              <label
                key={doc.id}
                className={`flow-checkbox ${isSelected ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleDocument(doc.id)}
                />
                <div className="modal-checkbox-content">
                  <span className="modal-checkbox-label">{doc.label}</span>
                  {doc.hint && (
                    <span className="modal-checkbox-hint">{doc.hint}</span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Custom documents */}
      <div className="config-section">
        <h3 className="config-section-title">Custom Documents</h3>
        <p className="config-section-hint">
          Add any specific documents not in the standard list
        </p>

        <div className="custom-doc-input-row">
          <input
            type="text"
            value={customDocInput}
            onChange={(e) => setCustomDocInput(e.target.value)}
            onKeyDown={handleCustomDocKeyDown}
            className="custom-doc-input"
            placeholder="e.g., Old Mutual investment statement"
          />
          <button
            className="btn btn-secondary"
            onClick={addCustomDocument}
            disabled={!customDocInput.trim()}
          >
            Add
          </button>
        </div>

        {stepData.customDocuments.length > 0 && (
          <div className="custom-doc-list">
            {stepData.customDocuments.map(doc => (
              <span key={doc} className="custom-doc-chip">
                <span className="material-icons-outlined">description</span>
                {doc}
                <button
                  className="custom-doc-remove"
                  onClick={() => removeCustomDocument(doc)}
                >
                  <span className="material-icons-outlined">close</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="config-section">
        <div className="flow-form-group">
          <label className="flow-form-label">Additional Notes (optional)</label>
          <textarea
            value={stepData.notes}
            onChange={(e) => updateData({ notes: e.target.value })}
            className="flow-form-textarea"
            rows={3}
            placeholder="e.g., 'Please ensure bank statements show your name and account number'"
          />
        </div>
      </div>

      {/* Validation warning */}
      {!hasDocuments && (
        <div className="validation-message">
          <span className="material-icons-outlined">info</span>
          <span>Select at least one document to request.</span>
        </div>
      )}

    </div>
  );
}

// Register this step
registerStep('select-documents', SelectDocumentsStep);

export default SelectDocumentsStep;
