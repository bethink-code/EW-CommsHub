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
  { id: 'id-document', label: 'ID document' },
  { id: 'proof-of-address', label: 'Proof of address' },
  { id: 'bank-statements', label: 'Bank statements' },
  { id: 'proof-of-bank', label: 'Proof of bank' },
  { id: 'company-documents', label: 'Company documents' },
];

// =============================================================================
// STORAGE LOCATIONS
// =============================================================================

const STORAGE_LOCATIONS = [
  { id: 'client-documents', label: 'Client Documents' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'financial-planning', label: 'Financial Planning' },
  { id: 'investment-portfolio', label: 'Investment Portfolio' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'estate-planning', label: 'Estate Planning' },
  { id: 'tax', label: 'Tax' },
  { id: 'general', label: 'General' },
];

// =============================================================================
// CUSTOM DOCUMENT TYPE
// =============================================================================

export interface CustomDocument {
  name: string;
  guidanceNote: string;
  storageLocation: string;
}

// =============================================================================
// INLINE ADD FORM
// =============================================================================

interface InlineAddFormProps {
  onAdd: (doc: CustomDocument) => void;
  onCancel: () => void;
}

function InlineAddForm({ onAdd, onCancel }: InlineAddFormProps) {
  const [name, setName] = useState('');
  const [guidanceNote, setGuidanceNote] = useState('');
  const [storageLocation, setStorageLocation] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      guidanceNote: guidanceNote.trim(),
      storageLocation,
    });
  };

  return (
    <div className="inline-add-form">
      <div className="inline-add-form-header">
        <h4 className="inline-add-form-title">Add a custom document request</h4>
      </div>

      <div className="flow-form-group">
        <label className="flow-form-label">Document name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flow-form-input"
          placeholder="e.g. ID document"
          autoFocus
        />
      </div>

      <div className="flow-form-group">
        <label className="flow-form-label">Guidance note</label>
        <input
          type="text"
          value={guidanceNote}
          onChange={(e) => setGuidanceNote(e.target.value)}
          className="flow-form-input"
          placeholder="e.g. ID document, passport or drivers license."
        />
      </div>

      <div className="flow-form-group">
        <label className="flow-form-label">Where should this document be kept in Elite Wealth</label>
        {storageLocation && (
          <div className="storage-location-selected">
            <span>{STORAGE_LOCATIONS.find(l => l.id === storageLocation)?.label}</span>
            <button
              type="button"
              className="storage-location-change"
              onClick={() => setStorageLocation('')}
            >
              Change
            </button>
          </div>
        )}
        <div className={`storage-location-list-wrapper ${storageLocation ? '' : 'expanded'}`}>
          <div className="storage-location-list">
            {STORAGE_LOCATIONS.map(loc => (
              <label key={loc.id} className="storage-location-option">
                <input
                  type="radio"
                  name="storage-location"
                  value={loc.id}
                  checked={storageLocation === loc.id}
                  onChange={() => setStorageLocation(loc.id)}
                />
                <span>{loc.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="inline-add-form-actions">
        <button type="button" className="comm-flow-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="comm-flow-btn-next"
          onClick={handleAdd}
          disabled={!name.trim()}
        >
          Add document request
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SelectDocumentsStep({
  data,
  client,
  onStepDataChange,
  hideStepHeader,
}: StepProps) {
  const [showAddForm, setShowAddForm] = useState(false);

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

  // Select all / deselect all
  const allSelected = STANDARD_DOCUMENTS.every(doc => stepData.documents.includes(doc.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      updateData({ documents: [] });
    } else {
      updateData({ documents: STANDARD_DOCUMENTS.map(doc => doc.id) });
    }
  };

  // Add custom document
  const addCustomDocument = (doc: CustomDocument) => {
    updateData({
      customDocuments: [...stepData.customDocuments, doc.name],
    });
    setShowAddForm(false);
  };

  // Remove custom document
  const removeCustomDocument = (doc: string) => {
    updateData({
      customDocuments: stepData.customDocuments.filter(d => d !== doc),
    });
  };

  return (
    <div className="select-documents-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">What documents do you need?</h2>
        </div>
      )}

      {/* Standard documents card */}
      <div className="config-card">
        <h3 className="config-card-title">Standard documents</h3>

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
        {STANDARD_DOCUMENTS.map(doc => {
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

      {/* Custom documents card */}
      <div className="config-card">
        <h3 className="config-card-title">Custom documents</h3>
        <p className="config-card-subtitle">Add any documents not in the standard list</p>

        {/* List of added custom documents */}
        {stepData.customDocuments.length > 0 && (
          <div className="custom-doc-list">
            {stepData.customDocuments.map(doc => (
              <div key={doc} className="custom-doc-row">
                <span className="material-icons-outlined" style={{ fontSize: '18px', color: '#016991' }}>description</span>
                <span className="custom-doc-name">{doc}</span>
                <button
                  type="button"
                  className="custom-doc-remove"
                  onClick={() => removeCustomDocument(doc)}
                  title="Remove"
                >
                  <span className="material-icons-outlined" style={{ fontSize: '16px' }}>close</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Inline add form (expandable) */}
        <div className={`inline-add-form-wrapper ${showAddForm ? 'expanded' : ''}`}>
          <InlineAddForm
            onAdd={addCustomDocument}
            onCancel={() => setShowAddForm(false)}
          />
        </div>

        {/* Add button (hidden when form is open) */}
        {!showAddForm && (
          <button
            type="button"
            className="comm-flow-btn-cancel"
            onClick={() => setShowAddForm(true)}
          >
            Add custom document
          </button>
        )}
      </div>
    </div>
  );
}

// Register this step
registerStep('select-documents', SelectDocumentsStep);

export default SelectDocumentsStep;
