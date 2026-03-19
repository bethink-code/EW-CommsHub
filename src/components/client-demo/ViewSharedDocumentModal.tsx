'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { SHARED_DOCUMENT } from './client-demo-data';

interface ViewSharedDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewSharedDocumentModal({ isOpen, onClose }: ViewSharedDocumentModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 1200);
  };

  const handleClose = () => {
    setDownloaded(false);
    setDownloading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Shared Document"
      size="md"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={downloading || downloaded}
          >
            {downloading ? (
              <>
                <span className="material-icons-outlined" style={{ fontSize: 18, animation: 'status-spin 0.8s linear infinite' }}>refresh</span>
                Opening...
              </>
            ) : downloaded ? (
              <>
                <span className="material-icons-outlined" style={{ fontSize: 18 }}>check</span>
                Opened
              </>
            ) : (
              <>
                <span className="material-icons-outlined" style={{ fontSize: 18 }}>open_in_new</span>
                Open
              </>
            )}
          </button>
        </div>
      }
    >
      {/* Metadata */}
      <div className="doc-meta-row">
        <span className="material-icons-outlined">person</span>
        Shared by {SHARED_DOCUMENT.sharedBy}
      </div>
      <div className="doc-meta-row" style={{ marginBottom: 20 }}>
        <span className="material-icons-outlined">calendar_today</span>
        {SHARED_DOCUMENT.sharedDate}
      </div>

      {/* PDF Preview area */}
      <div className="doc-preview-area">
        <span className="material-icons-outlined">picture_as_pdf</span>
        <span className="doc-preview-filename">{SHARED_DOCUMENT.fileName}</span>
        <span className="doc-preview-size">{SHARED_DOCUMENT.fileSize}</span>
      </div>

      {downloaded && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px', background: '#D1FAE5', borderRadius: 8,
          fontSize: 13, color: '#047857',
        }}>
          <span className="material-icons-outlined" style={{ fontSize: 18 }}>check_circle</span>
          Document downloaded successfully
        </div>
      )}
    </Modal>
  );
}
