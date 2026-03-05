'use client';

import { useState, useEffect, useCallback } from 'react';
import { StepProps, DocumentRequestStepData } from '@/lib/comm-flow/types';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// SHAREABLE DOCUMENT OPTIONS
// =============================================================================

export interface ShareableDocument {
  id: string;
  label: string;
  hint?: string;
}

export const SHAREABLE_DOCUMENTS: ShareableDocument[] = [
  { id: 'tax-certificate', label: 'Tax Certificate', hint: 'Annual IT3(b), IT3(c), etc.' },
  { id: 'portfolio-valuation', label: 'Portfolio Valuation Report', hint: 'Current portfolio statement' },
  { id: 'market-commentary', label: 'Market Commentary', hint: 'Quarterly/monthly market insights' },
  { id: 'financial-plan', label: 'Financial Plan', hint: 'Updated or revised financial plan' },
  { id: 'investment-proposal', label: 'Investment Proposal', hint: 'New investment recommendation' },
  { id: 'fee-schedule', label: 'Fee Schedule', hint: 'Fee disclosure / updated schedule' },
  { id: 'fund-fact-sheet', label: 'Fund Fact Sheet', hint: 'Fund performance summary' },
  { id: 'policy-schedule', label: 'Policy Schedule', hint: 'Insurance policy document' },
  { id: 'annual-report', label: 'Annual Report', hint: 'Fund or company annual report' },
  { id: 'compliance-confirmation', label: 'Compliance Confirmation', hint: 'FICA confirmation, regulatory notice' },
];

// Lookup map for title building
export const SHAREABLE_DOCUMENT_LABELS: Record<string, string> = Object.fromEntries(
  SHAREABLE_DOCUMENTS.map(d => [d.id, d.label])
);

// =============================================================================
// COMPONENT
// =============================================================================

export function ShareDocumentsStep({
  data,
  client,
  onStepDataChange,
  hideStepHeader,
}: StepProps) {
  const [customDocInput, setCustomDocInput] = useState('');

  // Reuse same data shape as select-documents
  const stepData: DocumentRequestStepData = (data.stepData['share-documents'] as DocumentRequestStepData) || {
    documents: [],
    customDocuments: [],
    notes: '',
  };

  // Initialize step data on mount if not set
  useEffect(() => {
    if (!data.stepData['share-documents']) {
      onStepDataChange('share-documents', {
        documents: [],
        customDocuments: [],
        notes: '',
      } as DocumentRequestStepData);
    }
  }, [data.stepData, onStepDataChange]);

  // Update step data
  const updateData = useCallback((updates: Partial<DocumentRequestStepData>) => {
    onStepDataChange('share-documents', {
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
          <h2 className="step-title">Share Documents</h2>
          <p className="step-subtitle">
            Select the documents to share with {client?.firstName || 'the client'}
          </p>
        </div>
      )}

      {/* Shareable documents */}
      <div className="config-section">
        <h3 className="config-section-title">Available Documents</h3>
        <div className="document-checklist">
          {SHAREABLE_DOCUMENTS.map(doc => {
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
            placeholder="e.g., Client investment review 2026"
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
            placeholder="e.g., 'Please review the updated fee schedule and let us know if you have questions'"
          />
        </div>
      </div>

      {/* Validation warning */}
      {!hasDocuments && (
        <div className="validation-message">
          <span className="material-icons-outlined">info</span>
          <span>Select at least one document to share.</span>
        </div>
      )}
    </div>
  );
}

// Register this step
registerStep('share-documents', ShareDocumentsStep);

export default ShareDocumentsStep;
