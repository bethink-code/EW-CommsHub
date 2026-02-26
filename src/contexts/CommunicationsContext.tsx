'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { Communication } from '@/types/communications';
import { MOCK_COMMUNICATIONS } from '@/app/comms-hub/mock-data';

// =============================================================================
// TYPES
// =============================================================================

export interface CommunicationsContextType {
  communications: Communication[];
  recentlyAdded: Set<string>;
  addCommunications: (comms: Communication[]) => void;
}

// =============================================================================
// CONTEXT
// =============================================================================

const CommunicationsContext = createContext<CommunicationsContextType | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export function CommunicationsProvider({ children }: { children: ReactNode }) {
  const [communications, setCommunications] = useState<Communication[]>(MOCK_COMMUNICATIONS);
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set());
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addCommunications = useCallback((comms: Communication[]) => {
    if (comms.length === 0) return;

    const newIds = comms.map(c => c.id);

    // Prepend new comms to the list
    setCommunications(prev => [...comms, ...prev]);

    // Mark as recently added
    setRecentlyAdded(prev => {
      const next = new Set(prev);
      newIds.forEach(id => next.add(id));
      return next;
    });

    // Clear highlight after 5 seconds
    const timer = setTimeout(() => {
      setRecentlyAdded(prev => {
        const next = new Set(prev);
        newIds.forEach(id => next.delete(id));
        return next;
      });
    }, 5000);

    timersRef.current.push(timer);
  }, []);

  return (
    <CommunicationsContext.Provider value={{ communications, recentlyAdded, addCommunications }}>
      {children}
    </CommunicationsContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useCommunications(): CommunicationsContextType {
  const context = useContext(CommunicationsContext);
  if (!context) {
    throw new Error('useCommunications must be used within a CommunicationsProvider');
  }
  return context;
}
