'use client';

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Note, NoteContext, Client } from '@/types/communications';

// =============================================================================
// TYPES
// =============================================================================

interface NoteContextData {
  type: NoteContext;
  id?: string;
  label?: string;
  client?: Client;
}

interface GlobalNotesContextType {
  isOpen: boolean;
  openNotes: (context?: NoteContextData) => void;
  closeNotes: () => void;
  currentContext: NoteContextData | null;
  setCurrentContext: (context: NoteContextData | null) => void;
  notes: Note[];
  addNote: (content: string, context: NoteContextData) => void;
}

// =============================================================================
// CONTEXT
// =============================================================================

const GlobalNotesContext = createContext<GlobalNotesContextType | null>(null);

export function useGlobalNotes() {
  const context = useContext(GlobalNotesContext);
  if (!context) {
    throw new Error('useGlobalNotes must be used within a GlobalNotesProvider');
  }
  return context;
}

// =============================================================================
// MOCK NOTES DATA
// =============================================================================

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    content: 'Client mentioned they are considering retirement next year. Follow up on pension options.',
    contextType: 'client',
    contextId: 'c1',
    clientId: 'c1',
    createdBy: 'Rassie du Preez',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 'note-2',
    content: 'Waiting for signed documents - client said they would send by Friday.',
    contextType: 'communication',
    contextId: 'comm-1',
    clientId: 'c1',
    createdBy: 'Rassie du Preez',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 'note-3',
    content: 'Sarah prefers WhatsApp for all communications. Her office email often goes to spam.',
    contextType: 'client',
    contextId: 'c2',
    clientId: 'c2',
    createdBy: 'Rassie du Preez',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
  },
];

// =============================================================================
// PROVIDER
// =============================================================================

export function GlobalNotesProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState<NoteContextData | null>(null);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);

  const openNotes = useCallback((context?: NoteContextData) => {
    setCurrentContext(context || { type: 'general' });
    setIsOpen(true);
  }, []);

  const closeNotes = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addNote = useCallback((content: string, context: NoteContextData) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content,
      contextType: context.type,
      contextId: context.id,
      clientId: context.client?.id || context.id,
      createdBy: 'Rassie du Preez',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  return (
    <GlobalNotesContext.Provider value={{
      isOpen,
      openNotes,
      closeNotes,
      currentContext,
      setCurrentContext,
      notes,
      addNote,
    }}>
      {children}
    </GlobalNotesContext.Provider>
  );
}

// =============================================================================
// HEADER BUTTON (for use in page headers)
// =============================================================================

export function NotesButton() {
  const { openNotes } = useGlobalNotes();

  return (
    <button
      onClick={() => openNotes()}
      className="btn btn-secondary"
      title="Add Note"
    >
      <span className="material-icons">note_add</span>
      Notes
    </button>
  );
}

// =============================================================================
// NOTES MODAL
// =============================================================================

export function GlobalNotesModal() {
  const { isOpen, closeNotes, currentContext, setCurrentContext, notes, addNote } = useGlobalNotes();
  const [noteContent, setNoteContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!noteContent.trim()) return;
    addNote(noteContent.trim(), currentContext || { type: 'general' });
    setNoteContent('');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      closeNotes();
    }, 1500);
  };

  const getContextLabel = () => {
    if (!currentContext) return 'General Note';
    switch (currentContext.type) {
      case 'client':
        return currentContext.client
          ? `Note for ${currentContext.client.firstName} ${currentContext.client.lastName}`
          : 'Client Note';
      case 'communication':
        return currentContext.label || 'Communication Note';
      case 'info-request':
        return currentContext.label || 'Info Request Note';
      default:
        return 'General Note';
    }
  };

  const contextOptions: { type: NoteContext; label: string }[] = [
    { type: 'general', label: 'General Note' },
    { type: 'client', label: 'Client Note' },
    { type: 'communication', label: 'Communication Note' },
    { type: 'info-request', label: 'Info Request Note' },
  ];

  // Get recent notes for context (if applicable)
  const clientId = currentContext?.client?.id || currentContext?.id;
  const contextNotes = clientId
    ? notes.filter(n => n.clientId === clientId).slice(0, 3)
    : notes.slice(0, 3);

  const formatRelativeDate = (date: Date) => {
    const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with fade animation */}
          <motion.div
            className="notes-panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeNotes}
          />
          {/* Slide-in panel from right */}
          <motion.div
            className="notes-panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            {showSuccess ? (
              <div className="notes-panel-success">
                <div className="notes-panel-success-icon">
                  <span className="material-icons">check</span>
                </div>
                <h2 className="notes-success-title">Note Saved</h2>
                <p className="notes-success-message">Your note has been added successfully.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="notes-panel-header">
                  <h2>
                    <span className="material-icons">note_add</span>
                    Add Note
                  </h2>
                  <button className="notes-panel-close" onClick={closeNotes}>
                    <span className="material-icons">close</span>
                  </button>
                </div>

                {/* Body */}
                <div className="notes-panel-body">
                  {/* Context Selector */}
                  <div>
                    <label className="notes-form-label">Context</label>
                    <div className="notes-context-box">
                      <span className="material-icons notes-context-icon">
                        {currentContext?.type === 'client' ? 'person' :
                         currentContext?.type === 'communication' ? 'email' :
                         currentContext?.type === 'info-request' ? 'assignment' : 'note'}
                      </span>
                      <span className="notes-context-label">{getContextLabel()}</span>
                      <select
                        value={currentContext?.type || 'general'}
                        onChange={(e) => setCurrentContext({ type: e.target.value as NoteContext })}
                        className="notes-context-select"
                      >
                        {contextOptions.map(opt => (
                          <option key={opt.type} value={opt.type}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Note Input */}
                  <div>
                    <label className="notes-form-label">Note</label>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Type your note here..."
                      autoFocus
                      className="notes-textarea"
                    />
                  </div>

                  {/* Recent Notes */}
                  {contextNotes.length > 0 && (
                    <div>
                      <label className="notes-form-label-muted">Recent Notes</label>
                      <div className="notes-recent-list">
                        {contextNotes.map(note => (
                          <div key={note.id} className="notes-recent-item">
                            <p className="notes-recent-content">
                              {note.content.length > 80 ? `${note.content.slice(0, 80)}...` : note.content}
                            </p>
                            <span className="notes-recent-meta">
                              {formatRelativeDate(note.createdAt)} by {note.createdBy}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="notes-panel-footer">
                  <button className="btn btn-secondary" onClick={closeNotes}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={!noteContent.trim()}
                  >
                    <span className="material-icons icon-sm">save</span>
                    Save Note
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// COMBINED COMPONENT (Modal only - button is placed in page headers)
// =============================================================================

export function GlobalNotes() {
  return <GlobalNotesModal />;
}

export default GlobalNotes;
