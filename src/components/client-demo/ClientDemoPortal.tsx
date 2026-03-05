'use client';

import { useState, useCallback } from 'react';
import ClientDemoLogin from './ClientDemoLogin';
import ClientDemoDashboard from './ClientDemoDashboard';
import ViewSharedDocumentModal from './ViewSharedDocumentModal';
import UploadDocumentModal from './UploadDocumentModal';
import './client-demo.css';

interface ClientDemoPortalProps {
  onClose: () => void;
  initialAction?: 'view-shared' | 'upload-requested' | null;
}

export default function ClientDemoPortal({ onClose, initialAction }: ClientDemoPortalProps) {
  const [screen, setScreen] = useState<'login' | 'dashboard'>('login');
  const [showViewDoc, setShowViewDoc] = useState(false);
  const [showUploadDoc, setShowUploadDoc] = useState(false);

  const handleLogin = useCallback(() => {
    setScreen('dashboard');
  }, []);

  const handleViewDoc = useCallback(() => {
    setShowViewDoc(true);
  }, []);

  const handleUploadDoc = useCallback(() => {
    setShowUploadDoc(true);
  }, []);

  return (
    <div className="client-demo-overlay">
      {/* Exit bar */}
      <div className="client-demo-exit-bar">
        <span>Client Portal Demo — This is what your client sees</span>
        <button onClick={onClose}>
          <span className="material-icons-outlined">close</span>
          Exit Demo
        </button>
      </div>

      {/* Main content */}
      <div className="client-demo-body">
        {screen === 'login' ? (
          <ClientDemoLogin onLogin={handleLogin} />
        ) : (
          <ClientDemoDashboard
            initialAction={initialAction}
            onViewDoc={handleViewDoc}
            onUploadDoc={handleUploadDoc}
          />
        )}
      </div>

      {/* Modals */}
      <ViewSharedDocumentModal
        isOpen={showViewDoc}
        onClose={() => setShowViewDoc(false)}
      />
      <UploadDocumentModal
        isOpen={showUploadDoc}
        onClose={() => setShowUploadDoc(false)}
      />
    </div>
  );
}
