'use client';

import { useState, useCallback } from 'react';
import { ModalSection, ModalFooter } from '../Modal';

// =============================================================================
// DOCUMENT TYPES
// =============================================================================

export interface DocumentOption {
  id: string;
  label: string;
  description?: string;
}

export const STANDARD_DOCUMENTS: DocumentOption[] = [
  { id: 'id-document', label: 'ID Document', description: 'Passport or Driver\'s License' },
  { id: 'proof-of-address', label: 'Proof of Address', description: 'Utility bill or bank statement (< 3 months old)' },
  { id: 'bank-statements', label: 'Bank Statements', description: '3 months of statements' },
  { id: 'tax-returns', label: 'Tax Returns', description: 'Most recent tax year' },
  { id: 'employment-contract', label: 'Employment Contract', description: 'Current employer' },
  { id: 'payslips', label: 'Payslips', description: '3 most recent payslips' },
  { id: 'investment-statements', label: 'Investment Statements', description: 'Portfolio or unit trust statements' },
  { id: 'property-valuations', label: 'Property Valuations', description: 'Recent property valuations' },
  { id: 'insurance-policies', label: 'Insurance Policies', description: 'Life, medical, or short-term' },
  { id: 'will-testament', label: 'Will & Testament', description: 'Most recent version' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export interface SelectDocumentsStepProps {
  documents: string[];
  customDocuments: string[];
  notes: string;
  onDocumentsChange: (documents: string[]) => void;
  onCustomDocumentsChange: (customDocuments: string[]) => void;
  onNotesChange: (notes: string) => void;
  onCancel: () => void;
  onNext: () => void;
}

export function SelectDocumentsStep({
  documents,
  customDocuments,
  notes,
  onDocumentsChange,
  onCustomDocumentsChange,
  onNotesChange,
  onCancel,
  onNext,
}: SelectDocumentsStepProps) {
  const [newCustomDoc, setNewCustomDoc] = useState('');

  // Toggle document selection
  const toggleDocument = useCallback((docId: string) => {
    if (documents.includes(docId)) {
      onDocumentsChange(documents.filter(d => d !== docId));
    } else {
      onDocumentsChange([...documents, docId]);
    }
  }, [documents, onDocumentsChange]);

  // Add custom document
  const addCustomDocument = useCallback(() => {
    const trimmed = newCustomDoc.trim();
    if (trimmed && !customDocuments.includes(trimmed)) {
      onCustomDocumentsChange([...customDocuments, trimmed]);
      setNewCustomDoc('');
    }
  }, [newCustomDoc, customDocuments, onCustomDocumentsChange]);

  // Remove custom document
  const removeCustomDocument = useCallback((doc: string) => {
    onCustomDocumentsChange(customDocuments.filter(d => d !== doc));
  }, [customDocuments, onCustomDocumentsChange]);

  // Handle Enter key in custom document input
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomDocument();
    }
  }, [addCustomDocument]);

  // Validation - need at least one document
  const hasDocuments = documents.length > 0 || customDocuments.length > 0;

  return (
    <>
      {/* Standard Documents */}
      <ModalSection title="Select documents to request">
        <div className="modal-checkbox-grid">
          {STANDARD_DOCUMENTS.map((doc) => (
            <label key={doc.id} className="modal-checkbox">
              <input
                type="checkbox"
                checked={documents.includes(doc.id)}
                onChange={() => toggleDocument(doc.id)}
              />
              <span className="modal-checkbox-content">
                <span className="modal-checkbox-label">{doc.label}</span>
                {doc.description && (
                  <span className="modal-checkbox-hint">{doc.description}</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </ModalSection>

      {/* Custom Documents */}
      <ModalSection title="Request additional documents">
        <div className="custom-doc-input-row">
          <input
            type="text"
            className="custom-doc-input"
            value={newCustomDoc}
            onChange={(e) => setNewCustomDoc(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter document name and press Enter..."
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addCustomDocument}
            disabled={!newCustomDoc.trim()}
          >
            <span className="material-icons-outlined">add</span>
            Add
          </button>
        </div>

        {customDocuments.length > 0 && (
          <div className="custom-doc-list">
            {customDocuments.map((doc, index) => (
              <div key={index} className="custom-doc-chip">
                <span className="material-icons-outlined">description</span>
                <span>{doc}</span>
                <button
                  type="button"
                  className="custom-doc-remove"
                  onClick={() => removeCustomDocument(doc)}
                  aria-label={`Remove ${doc}`}
                >
                  <span className="material-icons-outlined">close</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </ModalSection>

      {/* Notes */}
      <ModalSection title="Notes for client (optional)">
        <textarea
          className="modal-textarea"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add any specific instructions or context for the client..."
          rows={3}
        />
      </ModalSection>

      {/* Validation message */}
      {!hasDocuments && (
        <div className="validation-message">
          <span className="material-icons-outlined">info</span>
          Please select at least one document to request
        </div>
      )}

      {/* Footer */}
      <div className="step-footer">
        <ModalFooter
          onCancel={onCancel}
          onPrimary={onNext}
          cancelLabel="Cancel"
          primaryLabel="Next: Compose Message"
          primaryIcon="arrow_forward"
          primaryDisabled={!hasDocuments}
        />
      </div>
    </>
  );
}

export default SelectDocumentsStep;
