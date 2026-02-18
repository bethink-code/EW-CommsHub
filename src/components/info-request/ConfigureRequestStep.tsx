'use client';

import { useCallback } from 'react';
import { ModalSection, ModalFooter } from '../Modal';
import {
  InfoSection,
  DocumentType,
  INFO_SECTIONS,
  DOCUMENT_TYPES,
} from '@/types/communications';

// =============================================================================
// COMPONENT
// =============================================================================

export interface ConfigureRequestStepProps {
  sections: InfoSection[];
  documents: DocumentType[];
  notes: string;
  onSectionsChange: (sections: InfoSection[]) => void;
  onDocumentsChange: (documents: DocumentType[]) => void;
  onNotesChange: (notes: string) => void;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function ConfigureRequestStep({
  sections,
  documents,
  notes,
  onSectionsChange,
  onDocumentsChange,
  onNotesChange,
  onCancel,
  onBack,
  onNext,
}: ConfigureRequestStepProps) {
  // Toggle section
  const toggleSection = useCallback((section: InfoSection) => {
    // Don't allow removing required sections
    if (INFO_SECTIONS[section].required) return;

    if (sections.includes(section)) {
      onSectionsChange(sections.filter(s => s !== section));
    } else {
      onSectionsChange([...sections, section]);
    }
  }, [sections, onSectionsChange]);

  // Toggle document
  const toggleDocument = useCallback((doc: DocumentType) => {
    if (documents.includes(doc)) {
      onDocumentsChange(documents.filter(d => d !== doc));
    } else {
      onDocumentsChange([...documents, doc]);
    }
  }, [documents, onDocumentsChange]);

  // Get all sections - required ones first, then optional
  const allSections = Object.keys(INFO_SECTIONS) as InfoSection[];
  const requiredSections = allSections.filter(s => INFO_SECTIONS[s].required);
  const optionalSections = allSections.filter(s => !INFO_SECTIONS[s].required);

  const allDocuments = Object.keys(DOCUMENT_TYPES) as DocumentType[];

  return (
    <>
      {/* Sections to include - required ones disabled, optional ones selectable */}
      <ModalSection title="Sections to include">
        <div className="modal-checkbox-grid">
          {/* Required sections (disabled, always checked) */}
          {requiredSections.map((section) => (
            <label key={section} className="modal-checkbox modal-checkbox-disabled">
              <input
                type="checkbox"
                checked={true}
                disabled
                readOnly
              />
              <span className="modal-checkbox-label">
                {INFO_SECTIONS[section].label}
              </span>
              <span className="modal-checkbox-required">Required</span>
            </label>
          ))}
          {/* Optional sections */}
          {optionalSections.map((section) => (
            <label key={section} className="modal-checkbox">
              <input
                type="checkbox"
                checked={sections.includes(section)}
                onChange={() => toggleSection(section)}
              />
              <span className="modal-checkbox-label">
                {INFO_SECTIONS[section].label}
              </span>
            </label>
          ))}
        </div>
      </ModalSection>

      {/* Documents to request - as checkboxes */}
      <ModalSection title="Documents to request">
        <div className="modal-checkbox-grid">
          {allDocuments.map((doc) => (
            <label key={doc} className="modal-checkbox">
              <input
                type="checkbox"
                checked={documents.includes(doc)}
                onChange={() => toggleDocument(doc)}
              />
              <span className="modal-checkbox-label">
                {DOCUMENT_TYPES[doc].label}
              </span>
            </label>
          ))}
        </div>
      </ModalSection>

      {/* Notes */}
      <ModalSection title="Notes (optional)">
        <textarea
          className="modal-textarea"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add any additional notes or instructions for the client..."
          rows={3}
        />
      </ModalSection>

      {/* Footer */}
      <div className="step-footer">
        <ModalFooter
          onCancel={onCancel}
          onPrimary={onNext}
          cancelLabel="Cancel"
          primaryLabel="Next: Compose Message"
          primaryIcon="arrow_forward"
          showBack
          onBack={onBack}
        />
      </div>
    </>
  );
}

export default ConfigureRequestStep;
