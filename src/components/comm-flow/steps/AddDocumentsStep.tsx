'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { StepProps } from '@/lib/comm-flow/types';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// TYPES
// =============================================================================

interface MockFile {
  id: string;
  name: string;
  size: string;
  source: 'drive' | 'client-docs' | 'templates';
}

interface AddDocumentsStepData {
  files: MockFile[];
}

// =============================================================================
// MOCK DATA
// =============================================================================

interface DocTreeFolder {
  id: string;
  label: string;
  count: number;
  expandable: boolean;
  files: { id: string; name: string; entity: string; size: string }[];
}

const MOCK_DOC_TREE: DocTreeFolder[] = [
  { id: 'imported', label: 'Documents imported', count: 500, expandable: false, files: [] },
  {
    id: 'entity', label: 'Entity', count: 5, expandable: true, files: [
      { id: 'e1', name: '2024.03.15-Entity Registration Certificate', entity: 'Kevin Patrick', size: '1.2MB' },
      { id: 'e2', name: '2024.01.22-Entity Tax Clearance', entity: 'Kevin Patrick', size: '890KB' },
      { id: 'e3', name: '2023.09.10-Trust Deed Amendment', entity: 'Kevin Patrick', size: '2.1MB' },
      { id: 'e4', name: '2023.06.01-Entity Annual Return', entity: 'Kevin Patrick', size: '450KB' },
      { id: 'e5', name: '2022.12.15-Entity Formation Documents', entity: 'Kevin Patrick', size: '3.5MB' },
    ],
  },
  { id: 'general', label: 'General', count: 14, expandable: false, files: [] },
  {
    id: 'planning', label: 'Planning / FAIS', count: 16, expandable: true, files: [
      { id: 'p1', name: '2021.11.11-Burgess A - Letter of Introduction', entity: 'Kevin Patrick', size: '1.8MB' },
      { id: 'p2', name: '2021.11.11-Burgess A - Record of Advice', entity: 'Kevin Patrick', size: '2.3MB' },
      { id: 'p3', name: '2022.03.15-Annual Review Notes', entity: 'Kevin Patrick', size: '950KB' },
    ],
  },
  {
    id: 'portfolio', label: 'Portfolio', count: 21, expandable: true, files: [
      { id: 'pf1', name: '2024.06.30-Portfolio Valuation Q2', entity: 'Kevin Patrick', size: '1.5MB' },
      { id: 'pf2', name: '2024.03.31-Portfolio Valuation Q1', entity: 'Kevin Patrick', size: '1.4MB' },
      { id: 'pf3', name: '2023.12.31-Portfolio Valuation Q4', entity: 'Kevin Patrick', size: '1.6MB' },
    ],
  },
  {
    id: 'reporting', label: 'Reporting', count: 29, expandable: true, files: [
      { id: 'r1', name: '2024.06-Monthly Performance Report', entity: 'Kevin Patrick', size: '2.0MB' },
      { id: 'r2', name: '2024.05-Monthly Performance Report', entity: 'Kevin Patrick', size: '1.9MB' },
      { id: 'r3', name: '2024.04-Monthly Performance Report', entity: 'Kevin Patrick', size: '1.8MB' },
    ],
  },
  { id: 'uploaded', label: 'Uploaded by client', count: 48, expandable: false, files: [] },
];

const MOCK_TEMPLATES = [
  { id: 'tpl-cover-letter', name: 'Cover Letter Template', size: '45KB' },
  { id: 'tpl-fee-disclosure', name: 'Fee Disclosure Document', size: '120KB' },
  { id: 'tpl-mandate', name: 'Investment Mandate Template', size: '85KB' },
  { id: 'tpl-kyc-form', name: 'KYC Form Template', size: '200KB' },
  { id: 'tpl-risk-profile', name: 'Risk Profile Questionnaire', size: '150KB' },
];

// Simulated file names for drag-drop
const MOCK_DRIVE_NAMES = [
  'Sanlam Short Term Insurance 20240626.pdf',
  'Tax_Certificate_2025.pdf',
  'Portfolio_Review_Q1.xlsx',
  'Client_Meeting_Notes.docx',
  'Fee_Schedule_Update.pdf',
];

let mockDriveIndex = 0;

// =============================================================================
// COMPONENT
// =============================================================================

type Tab = 'drive' | 'client-docs' | 'templates';

export function AddDocumentsStep({
  data,
  onStepDataChange,
  hideStepHeader,
}: StepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>('drive');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<{ name: string; progress: number } | null>(null);
  const [drilledFolder, setDrilledFolder] = useState<string | null>(null);
  const [checkedClientFiles, setCheckedClientFiles] = useState<Set<string>>(new Set());
  const [includeSubcategories, setIncludeSubcategories] = useState(true);

  // Step data
  const stepData: AddDocumentsStepData = (data.stepData['add-documents'] as AddDocumentsStepData) || { files: [] };

  // Initialize on mount
  useEffect(() => {
    if (!data.stepData['add-documents']) {
      onStepDataChange('add-documents', { files: [] } as AddDocumentsStepData);
    }
  }, [data.stepData, onStepDataChange]);

  const updateFiles = useCallback((files: MockFile[]) => {
    onStepDataChange('add-documents', { files } as AddDocumentsStepData);
  }, [onStepDataChange]);

  const removeFile = useCallback((fileId: string) => {
    updateFiles(stepData.files.filter(f => f.id !== fileId));
  }, [stepData.files, updateFiles]);

  // Tab counts
  const driveCount = stepData.files.filter(f => f.source === 'drive').length;
  const clientDocsCount = stepData.files.filter(f => f.source === 'client-docs').length;
  const templatesCount = stepData.files.filter(f => f.source === 'templates').length;

  // -------------------------------------------------------------------------
  // DRIVE TAB
  // -------------------------------------------------------------------------

  const simulateUpload = useCallback((fileName: string) => {
    const size = `${(Math.random() * 4 + 0.5).toFixed(1)}MB`;
    setUploadingFile({ name: fileName, progress: 0 });

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadingFile(null);
        const newFile: MockFile = {
          id: `drive-${Date.now()}`,
          name: fileName,
          size,
          source: 'drive',
        };
        updateFiles([...stepData.files, newFile]);
      } else {
        setUploadingFile({ name: fileName, progress: Math.min(progress, 95) });
      }
    }, 200);
  }, [stepData.files, updateFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (uploadingFile) return;
    // Use real file name if available, otherwise mock
    const droppedFiles = e.dataTransfer.files;
    const name = droppedFiles.length > 0
      ? droppedFiles[0].name
      : MOCK_DRIVE_NAMES[mockDriveIndex++ % MOCK_DRIVE_NAMES.length];
    simulateUpload(name);
  }, [uploadingFile, simulateUpload]);

  const handleChooseFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadingFile) return;
    simulateUpload(file.name);
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [uploadingFile, simulateUpload]);

  // -------------------------------------------------------------------------
  // CLIENT DOCS TAB
  // -------------------------------------------------------------------------

  const drilledFolderData = drilledFolder
    ? MOCK_DOC_TREE.find(f => f.id === drilledFolder)
    : null;

  const toggleClientFileCheck = (fileId: string) => {
    setCheckedClientFiles(prev => {
      const next = new Set(prev);
      if (next.has(fileId)) next.delete(fileId);
      else next.add(fileId);
      return next;
    });
  };

  const handleSelectClientFiles = () => {
    if (!drilledFolderData) return;
    const newFiles: MockFile[] = [];
    drilledFolderData.files.forEach(f => {
      if (checkedClientFiles.has(f.id) && !stepData.files.some(sf => sf.id === f.id)) {
        newFiles.push({ id: f.id, name: f.name, size: f.size, source: 'client-docs' });
      }
    });
    if (newFiles.length > 0) {
      updateFiles([...stepData.files, ...newFiles]);
    }
    setCheckedClientFiles(new Set());
    setDrilledFolder(null);
  };

  // -------------------------------------------------------------------------
  // TEMPLATES TAB
  // -------------------------------------------------------------------------

  const isTemplateAttached = (tplId: string) => stepData.files.some(f => f.id === tplId);

  const toggleTemplate = (tpl: typeof MOCK_TEMPLATES[0]) => {
    if (isTemplateAttached(tpl.id)) {
      updateFiles(stepData.files.filter(f => f.id !== tpl.id));
    } else {
      updateFiles([...stepData.files, { id: tpl.id, name: tpl.name, size: tpl.size, source: 'templates' }]);
    }
  };

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------

  return (
    <div className="add-docs-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Attach your documents</h2>
        </div>
      )}

      {/* Tabs + content in white card */}
      <div className="config-card" style={{ padding: 0 }}>
      <div className="add-docs-tabs">
        <button
          type="button"
          className={`add-docs-tab ${activeTab === 'drive' ? 'active' : ''}`}
          onClick={() => setActiveTab('drive')}
        >
          Drive{driveCount > 0 && ` (${driveCount} file${driveCount !== 1 ? 's' : ''})`}
        </button>
        <button
          type="button"
          className={`add-docs-tab ${activeTab === 'client-docs' ? 'active' : ''}`}
          onClick={() => { setActiveTab('client-docs'); setDrilledFolder(null); setCheckedClientFiles(new Set()); }}
        >
          Client documents{clientDocsCount > 0 && ` (${clientDocsCount} file${clientDocsCount !== 1 ? 's' : ''})`}
        </button>
        <button
          type="button"
          className={`add-docs-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates{templatesCount > 0 && ` (${templatesCount})`}
        </button>
      </div>

      {/* Tab content */}
      <div className="add-docs-content">

        {/* ============= DRIVE TAB ============= */}
        {activeTab === 'drive' && (
          <div className="add-docs-drive">
            <p className="add-docs-hint">Upload files by drag&amp;drop them here or selecting from your drive.</p>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />

            {/* Drop zone */}
            <div
              className={`add-docs-dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadingFile ? (
                <div className="add-docs-uploading">
                  <span className="add-docs-uploading-label">Uploading</span>
                  <div className="add-docs-uploading-file">
                    <span className="material-icons-outlined">description</span>
                    <span className="add-docs-uploading-name">{uploadingFile.name}</span>
                    <span className="add-docs-uploading-percent">{Math.round(uploadingFile.progress)}%</span>
                  </div>
                  <div className="add-docs-progress-track">
                    <div
                      className="add-docs-progress-fill"
                      style={{ width: `${uploadingFile.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="add-docs-dropzone-content">
                  <span className="material-icons-outlined add-docs-dropzone-icon">cloud_upload</span>
                  <p className="add-docs-dropzone-text">
                    Drag &amp; Drop here or{' '}
                    <button type="button" className="add-docs-dropzone-link" onClick={handleChooseFile}>
                      Choose from drive
                    </button>
                    {' '}to upload
                  </p>
                  <p className="add-docs-dropzone-limit">Max size 25 MB</p>
                </div>
              )}
            </div>

            {/* Uploaded files */}
            {driveCount > 0 && (
              <div className="add-docs-file-list">
                {stepData.files.filter(f => f.source === 'drive').map(file => (
                  <div key={file.id} className="add-docs-file-row">
                    <span className="material-icons-outlined add-docs-file-icon">description</span>
                    <div className="add-docs-file-info">
                      <span className="add-docs-file-name">{file.name}</span>
                      <span className="add-docs-file-size">{file.size}</span>
                    </div>
                    <button
                      type="button"
                      className="add-docs-file-delete"
                      onClick={() => removeFile(file.id)}
                      title="Remove file"
                    >
                      <span className="material-icons-outlined">delete_outline</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============= CLIENT DOCS TAB ============= */}
        {activeTab === 'client-docs' && (
          <div className="add-docs-client">
            {/* Attached client document files — shown at top */}
            {clientDocsCount > 0 && (
              <div className="add-docs-file-list">
                <p className="add-docs-file-list-label">Attached from client documents:</p>
                {stepData.files.filter(f => f.source === 'client-docs').map(file => (
                  <div key={file.id} className="add-docs-file-row">
                    <span className="material-icons-outlined add-docs-file-icon">description</span>
                    <div className="add-docs-file-info">
                      <span className="add-docs-file-name">{file.name}</span>
                      <span className="add-docs-file-size">{file.size}</span>
                    </div>
                    <button
                      type="button"
                      className="add-docs-file-delete"
                      onClick={() => removeFile(file.id)}
                      title="Remove file"
                    >
                      <span className="material-icons-outlined">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="add-docs-hint">You can select multiple files.</p>

            {!drilledFolder ? (
              /* Folder tree view */
              <div className="add-docs-tree">
                {/* Subcategories checkbox */}
                <label className="add-docs-subcategories">
                  <input
                    type="checkbox"
                    checked={includeSubcategories}
                    onChange={() => setIncludeSubcategories(!includeSubcategories)}
                  />
                  <span>Include subcategories in your search</span>
                </label>

                {/* Tree */}
                <div className="add-docs-tree-list">
                  <div className="add-docs-tree-root">
                    <span className="material-icons-outlined add-docs-tree-toggle">remove</span>
                    <span className="add-docs-tree-root-label">All documents</span>
                  </div>
                  {MOCK_DOC_TREE.map(folder => (
                    <div
                      key={folder.id}
                      className={`add-docs-tree-node ${folder.expandable ? 'expandable' : ''}`}
                      onClick={() => folder.expandable && setDrilledFolder(folder.id)}
                    >
                      {folder.expandable && (
                        <span className="material-icons-outlined add-docs-tree-toggle">add</span>
                      )}
                      <span className={`add-docs-tree-label ${!folder.expandable ? 'leaf' : ''}`}>
                        {folder.label} ({folder.count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Drilled-in file table */
              <div className="add-docs-drilled">
                <button
                  type="button"
                  className="add-docs-back"
                  onClick={() => { setDrilledFolder(null); setCheckedClientFiles(new Set()); }}
                >
                  <span className="material-icons-outlined">chevron_left</span>
                  <span>Path: {drilledFolderData?.label} ({drilledFolderData?.count})</span>
                </button>
                <p className="add-docs-found">Documents found: {drilledFolderData?.files.length || 0}</p>

                <table className="add-docs-file-table">
                  <thead>
                    <tr>
                      <th className="add-docs-th-select">Select</th>
                      <th>File name</th>
                      <th>Entity name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drilledFolderData?.files.map(file => {
                      const isChecked = checkedClientFiles.has(file.id);
                      const alreadyAdded = stepData.files.some(f => f.id === file.id);
                      return (
                        <tr
                          key={file.id}
                          className={`${isChecked ? 'checked' : ''} ${alreadyAdded ? 'already-added' : ''}`}
                          onClick={() => !alreadyAdded && toggleClientFileCheck(file.id)}
                        >
                          <td className="add-docs-td-select">
                            <input
                              type="checkbox"
                              checked={isChecked || alreadyAdded}
                              disabled={alreadyAdded}
                              onChange={() => !alreadyAdded && toggleClientFileCheck(file.id)}
                            />
                          </td>
                          <td>{file.name}</td>
                          <td>{file.entity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {checkedClientFiles.size > 0 && (
                  <div className="add-docs-select-action">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleSelectClientFiles}
                    >
                      Select
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ============= TEMPLATES TAB ============= */}
        {activeTab === 'templates' && (
          <div className="add-docs-templates">
            <p className="add-docs-hint">Select template documents to include.</p>
            <div className="add-docs-template-list">
              {MOCK_TEMPLATES.map(tpl => {
                const attached = isTemplateAttached(tpl.id);
                return (
                  <label
                    key={tpl.id}
                    className={`flow-checkbox ${attached ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={attached}
                      onChange={() => toggleTemplate(tpl)}
                    />
                    <div className="modal-checkbox-content">
                      <span className="modal-checkbox-label">{tpl.name}</span>
                      <span className="modal-checkbox-hint">{tpl.size}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </div>{/* close config-card */}

      {/* Validation */}
      {stepData.files.length === 0 && (
        <div className="validation-message">
          <span className="material-icons-outlined">info</span>
          <span>Attach at least one document to continue.</span>
        </div>
      )}
    </div>
  );
}

// Register this step
registerStep('add-documents', AddDocumentsStep);

export default AddDocumentsStep;
