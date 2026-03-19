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
  { id: 'tax-certificate', label: 'Tax Certificate' },
  { id: 'portfolio-valuation', label: 'Portfolio Valuation Report' },
  { id: 'market-commentary', label: 'Market Commentary' },
  { id: 'financial-plan', label: 'Financial Plan' },
  { id: 'investment-proposal', label: 'Investment Proposal' },
  { id: 'fee-schedule', label: 'Fee Schedule' },
  { id: 'fund-fact-sheet', label: 'Fund Fact Sheet' },
  { id: 'policy-schedule', label: 'Policy Schedule' },
  { id: 'annual-report', label: 'Annual Report' },
  { id: 'compliance-confirmation', label: 'Compliance Confirmation' },
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

  // Select all / deselect all
  const allSelected = SHAREABLE_DOCUMENTS.every(doc => stepData.documents.includes(doc.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      updateData({ documents: [] });
    } else {
      updateData({ documents: SHAREABLE_DOCUMENTS.map(doc => doc.id) });
    }
  };

  return (
    <div className="select-documents-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Which documents do you want to share?</h2>
        </div>
      )}

      {/* Available documents card */}
      <div className="config-card">
        <h3 className="config-card-title">Available documents</h3>

        {/* Select all */}
        <label className="config-checkbox-row">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
          />
          <span className="config-checkbox-text">Select all</span>
        </label>

        {/* Document checkboxes */}
        {SHAREABLE_DOCUMENTS.map(doc => {
          const isSelected = stepData.documents.includes(doc.id);
          return (
            <label key={doc.id} className="config-checkbox-row">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleDocument(doc.id)}
              />
              <span className="config-checkbox-text">
                <strong>{doc.label}</strong>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// Register this step
registerStep('share-documents', ShareDocumentsStep);

export default ShareDocumentsStep;
