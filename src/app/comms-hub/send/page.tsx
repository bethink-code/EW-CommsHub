'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { CommFlow } from '@/components/comm-flow';
import { CommFlowContext } from '@/lib/comm-flow/types';
import './send.css';

// =============================================================================
// COMPONENT
// =============================================================================

export default function SendCommunication() {
  const router = useRouter();

  // Create flow context for page mode
  const flowContext: CommFlowContext = {
    // No pre-selections - start from scratch
    renderMode: 'page',
    onComplete: () => {
      // After completion, redirect back to comms hub
      router.push('/comms-hub');
    },
    onCancel: () => {
      router.push('/comms-hub');
    },
  };

  return (
    <AppLayout>
      <div className="send-page">
        {/* Header */}
        <div className="send-header">
          <Link href="/comms-hub" className="back-link">
            <span className="material-icons-outlined">arrow_back</span>
            Back to Communications
          </Link>
          <h1 className="text-2xl font-semibold text-primary">Send Communication</h1>
        </div>

        {/* Unified CommFlow Component */}
        <CommFlow context={flowContext} />
      </div>
    </AppLayout>
  );
}
