'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Client } from '@/types/communications';
import { CommFlow } from '@/components/comm-flow';
import { CommFlowContext, CommFlowResult } from '@/lib/comm-flow/types';

// =============================================================================
// TYPES
// =============================================================================

export interface CommFlowsContextType {
  // New unified API - trigger any flow with any combination of pre-filled data
  startFlow: (options: StartFlowOptions) => void;

  // Convenience functions for backwards compatibility
  triggerPortalInvite: (client: Client, onComplete?: (result: CommFlowResult) => void) => void;
  triggerInfoRequest: (client: Client, onComplete?: (result: CommFlowResult) => void) => void;
  triggerDocumentRequest: (client: Client, onComplete?: (result: CommFlowResult) => void) => void;

  // Check if a flow is currently active
  isFlowActive: boolean;

  // Close the current flow
  closeFlow: () => void;
}

export interface StartFlowOptions {
  // Pre-fill options
  client?: Client;
  clients?: Client[];
  commType?: string;

  // Callbacks
  onComplete?: (result: CommFlowResult) => void;
  onCancel?: () => void;
}

// =============================================================================
// CONTEXT
// =============================================================================

const CommFlowsContext = createContext<CommFlowsContextType | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export interface CommFlowsProviderProps {
  children: ReactNode;
}

export function CommFlowsProvider({ children }: CommFlowsProviderProps) {
  // Active flow state
  const [activeFlowContext, setActiveFlowContext] = useState<CommFlowContext | null>(null);

  // =============================================================================
  // UNIFIED START FLOW
  // =============================================================================

  const startFlow = useCallback((options: StartFlowOptions) => {
    const flowContext: CommFlowContext = {
      preSelectedClient: options.client,
      preSelectedClients: options.clients,
      preSelectedCommType: options.commType,
      renderMode: 'modal',
      onComplete: (result) => {
        if (options.onComplete) {
          options.onComplete(result);
        }
        // Don't auto-close - let the flow show its completion state
      },
      onCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
        setActiveFlowContext(null);
      },
    };

    setActiveFlowContext(flowContext);
  }, []);

  // =============================================================================
  // CONVENIENCE FUNCTIONS (backwards compatible)
  // =============================================================================

  const triggerPortalInvite = useCallback((
    client: Client,
    onComplete?: (result: CommFlowResult) => void
  ) => {
    startFlow({
      client,
      commType: 'portal-invite',
      onComplete,
    });
  }, [startFlow]);

  const triggerInfoRequest = useCallback((
    client: Client,
    onComplete?: (result: CommFlowResult) => void
  ) => {
    startFlow({
      client,
      commType: 'info-request',
      onComplete,
    });
  }, [startFlow]);

  const triggerDocumentRequest = useCallback((
    client: Client,
    onComplete?: (result: CommFlowResult) => void
  ) => {
    startFlow({
      client,
      commType: 'document-request',
      onComplete,
    });
  }, [startFlow]);

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const closeFlow = useCallback(() => {
    setActiveFlowContext(null);
  }, []);

  const isFlowActive = activeFlowContext !== null;

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue: CommFlowsContextType = {
    startFlow,
    triggerPortalInvite,
    triggerInfoRequest,
    triggerDocumentRequest,
    isFlowActive,
    closeFlow,
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <CommFlowsContext.Provider value={contextValue}>
      {children}

      {/* Unified CommFlow component - rendered at root level */}
      {activeFlowContext && (
        <CommFlow context={activeFlowContext} />
      )}
    </CommFlowsContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useCommFlows(): CommFlowsContextType {
  const context = useContext(CommFlowsContext);

  if (!context) {
    throw new Error('useCommFlows must be used within a CommFlowsProvider');
  }

  return context;
}

// =============================================================================
// EXPORTS
// =============================================================================

export default CommFlowsProvider;
