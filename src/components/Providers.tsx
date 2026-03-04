'use client';

import { ReactNode } from 'react';
import { CommunicationsProvider } from '@/contexts/CommunicationsContext';
import { CommFlowsProvider } from '@/contexts/CommFlowsContext';
import { NotificationCenterProvider } from '@/components/NotificationCenter';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers wrapper
 * Wraps the app with all necessary client-side context providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <CommunicationsProvider>
      <CommFlowsProvider>
        <NotificationCenterProvider>
          {children}
        </NotificationCenterProvider>
      </CommFlowsProvider>
    </CommunicationsProvider>
  );
}

export default Providers;
