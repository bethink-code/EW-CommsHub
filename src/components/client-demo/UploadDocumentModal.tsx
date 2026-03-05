'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { REQUESTED_DOCUMENTS } from './client-demo-data';
import '../info-request/info-request.css';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadDocumentModal({ isOpen, onClose }: UploadDocumentModalProps) {
  const [uploadedSlots, setUploadedSlots] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const handleSlotClick = (index: number) => {
    setUploadedSlots(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleClose = () => {
    setUploadedSlots(new Set());
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Upload Documents" size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <button className="btn btn-primary" onClick={handleClose}>
              Done
            </button>
          </div>
        }
      >
        <div className="upload-success-state">
          <div className="upload-success-icon">
            <span className="material-icons-outlined">check</span>
          </div>
          <div className="upload-success-title">Documents Submitted</div>
          <div className="upload-success-subtitle">
            Your adviser will be notified. You can check the status in your Documents section.
          </div>

          <div style={{ width: '100%', marginTop: 8 }}>
            {REQUESTED_DOCUMENTS.map((doc, i) => (
              <div key={i} className="upload-doc-status" style={{ padding: '6px 0' }}>
                <span className="material-icons-outlined">
                  {uploadedSlots.has(i) ? 'check_circle' : 'schedule'}
                </span>
                {doc}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Documents"
      size="md"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={uploadedSlots.size === 0}
          >
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>send</span>
            Submit Documents
          </button>
        </div>
      }
    >
      <p className="upload-intro">
        Your adviser has requested the following documents. Please upload each one below.
      </p>

      {/* Upload slots */}
      <div className="journey-upload-list">
        {REQUESTED_DOCUMENTS.map((doc, i) => (
          <div
            key={i}
            className="journey-upload-slot"
            style={{
              cursor: 'pointer',
              borderColor: uploadedSlots.has(i) ? '#10b981' : undefined,
              background: uploadedSlots.has(i) ? '#F0FDF4' : undefined,
            }}
            onClick={() => handleSlotClick(i)}
          >
            <div className="journey-upload-slot-info">
              <span className="material-icons-outlined">
                {uploadedSlots.has(i) ? 'check_circle' : 'description'}
              </span>
              <span className="journey-upload-slot-name">{doc}</span>
            </div>
            <div className="journey-upload-slot-action">
              {uploadedSlots.has(i) ? (
                <span style={{ color: '#10b981', fontSize: 13, fontWeight: 500 }}>Uploaded</span>
              ) : (
                <>
                  <span className="material-icons-outlined">cloud_upload</span>
                  <span>Choose file</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="journey-upload-hint">
        <span className="material-icons-outlined">info</span>
        Accepted formats: PDF, JPG, PNG (max 10MB per file)
      </div>
    </Modal>
  );
}
