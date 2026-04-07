/**
 * WhatsApp Status Polling API Route
 *
 * GET /api/whatsapp/status/[wamid]
 * Returns the current delivery status for a WhatsApp message.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMessageStatus } from '@/lib/whatsapp';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ wamid: string }> }
) {
  const { wamid } = await params;

  try {
    const status = await getMessageStatus(wamid);

    if (!status) {
      return NextResponse.json({ status: 'unknown' }, { status: 404 });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Status lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve status' },
      { status: 500 }
    );
  }
}
