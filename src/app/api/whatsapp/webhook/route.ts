/**
 * WhatsApp Webhook API Route
 *
 * GET  /api/whatsapp/webhook — Meta verification challenge
 * POST /api/whatsapp/webhook — Receives delivery status updates from Meta
 */

import { NextRequest, NextResponse } from 'next/server';
import { setMessageStatus } from '@/lib/whatsapp';

// =============================================================================
// GET — Webhook Verification
// =============================================================================

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// =============================================================================
// POST — Status Updates
// =============================================================================

interface WebhookStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  errors?: Array<{ code: number; title: string }>;
}

interface WebhookEntry {
  changes: Array<{
    value: {
      statuses?: WebhookStatus[];
      messages?: unknown[];
    };
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entries: WebhookEntry[] = body.entry || [];

    for (const entry of entries) {
      for (const change of entry.changes || []) {
        const statuses = change.value?.statuses || [];

        for (const status of statuses) {
          await setMessageStatus(status.id, {
            wamid: status.id,
            status: status.status,
            timestamp: status.timestamp,
            errorCode: status.errors?.[0]?.code,
            errorMessage: status.errors?.[0]?.title,
          });
        }

        // Ignore inbound messages (change.value.messages) — not handling replies
      }
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
  }

  // Always return 200 — Meta retries on non-200 responses
  return NextResponse.json({ status: 'ok' });
}
