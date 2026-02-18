'use client';

import { ReactNode } from 'react';
import { CommFlowsProvider } from '@/contexts/CommFlowsContext';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers wrapper
 * Wraps the app with all necessary client-side context providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <CommFlowsProvider>
      {children}
    </CommFlowsProvider>
  );
}

export default Providers;
