/**
 * WhatsApp Send API Route
 *
 * POST /api/whatsapp/send
 * Sends a WhatsApp message via Meta Cloud API using a pre-approved template.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, setMessageStatus } from '@/lib/whatsapp';

interface SendRequest {
  commType: string;
  phone: string;
  templateParams: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendRequest = await request.json();

    if (!body.commType || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'commType and phone are required' },
        { status: 400 }
      );
    }

    const { wamid } = await sendWhatsAppMessage(
      body.phone,
      body.commType,
      body.templateParams || {}
    );

    // Store initial "sent" status
    await setMessageStatus(wamid, {
      wamid,
      status: 'sent',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, wamid });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send WhatsApp message',
      },
      { status: 500 }
    );
  }
}
