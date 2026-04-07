/**
 * WhatsApp Cloud API Integration
 *
 * Shared library for sending WhatsApp messages via Meta Cloud API,
 * managing delivery status via Upstash Redis, and syncing templates.
 */

import { Redis } from '@upstash/redis';

// =============================================================================
// REDIS CLIENT
// =============================================================================

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    }
    redis = new Redis({ url, token });
  }
  return redis;
}

// =============================================================================
// TYPES
// =============================================================================

export interface WhatsAppMessageStatus {
  wamid: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  errorCode?: number;
  errorMessage?: string;
}

export interface MetaTemplate {
  name: string;
  status: string;
  category: string;
  language: string;
  body: string;
  parameters: string[];
}

export interface MetaTemplateMapping {
  metaTemplateName: string;
  language: string;
  parameterOrder: string[]; // our placeholder names in Meta's positional order
}

// =============================================================================
// META TEMPLATE MAPPING
// =============================================================================

/**
 * Maps internal commtype IDs to Meta-registered template names.
 *
 * Meta templates use positional parameters ({{1}}, {{2}}, {{3}})
 * while our templates use named placeholders ({FirstName}, {Link}, etc.).
 * The parameterOrder array defines the mapping.
 *
 * Update these names to match what's registered in Meta Business Manager.
 */
export const META_TEMPLATE_MAP: Record<string, MetaTemplateMapping> = {
  'portal-invite': {
    metaTemplateName: 'ew_portal_invite',
    language: 'en',
    parameterOrder: ['FirstName', 'Link', 'AdviserName'],
  },
  'info-request': {
    metaTemplateName: 'ew_info_request',
    language: 'en',
    parameterOrder: ['FirstName', 'Link', 'AdviserName'],
  },
  'onboarding': {
    metaTemplateName: 'ew_onboarding',
    language: 'en',
    parameterOrder: ['FirstName', 'Link', 'AdviserName'],
  },
  'document-request': {
    metaTemplateName: 'ew_document_request',
    language: 'en',
    parameterOrder: ['FirstName', 'DocumentList', 'Link', 'AdviserName'],
  },
  'share-document': {
    metaTemplateName: 'ew_share_document',
    language: 'en',
    parameterOrder: ['FirstName', 'Link', 'AdviserName'],
  },
  'password-reset': {
    metaTemplateName: 'ew_password_reset',
    language: 'en',
    parameterOrder: ['FirstName', 'Link', 'AdviserName'],
  },
  'message': {
    metaTemplateName: 'ew_general_message',
    language: 'en',
    parameterOrder: ['FirstName', 'AdviserName', 'Message'],
  },
};

// =============================================================================
// PHONE NUMBER NORMALISATION
// =============================================================================

/**
 * Normalise a phone number to E.164 format for the Meta API.
 * Handles South African numbers (default market).
 */
export function normalizePhone(phone: string): string {
  // Strip spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Already in E.164 format
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // South African local format (0XX XXX XXXX → +27XX XXX XXXX)
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return '+27' + cleaned.slice(1);
  }

  // Assume South African if no country code
  if (!cleaned.startsWith('27')) {
    return '+27' + cleaned;
  }

  return '+' + cleaned;
}

// =============================================================================
// META CLOUD API — SEND
// =============================================================================

const META_API_VERSION = 'v21.0';

/**
 * Send a WhatsApp message using a pre-approved Meta template.
 * Returns the wamid (WhatsApp message ID) for tracking.
 */
export async function sendWhatsAppMessage(
  phone: string,
  commType: string,
  templateParams: Record<string, string>
): Promise<{ wamid: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error('Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN');
  }

  const mapping = META_TEMPLATE_MAP[commType];
  if (!mapping) {
    throw new Error(`No Meta template mapping for commType: ${commType}`);
  }

  const normalizedPhone = normalizePhone(phone);

  // Build positional parameters from our named placeholders
  const parameters = mapping.parameterOrder.map(name => ({
    type: 'text' as const,
    text: templateParams[name] || '',
  }));

  const body = {
    messaging_product: 'whatsapp',
    to: normalizedPhone,
    type: 'template',
    template: {
      name: mapping.metaTemplateName,
      language: { code: mapping.language },
      components: [
        {
          type: 'body',
          parameters,
        },
      ],
    },
  };

  const response = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(
      `Meta API error (${response.status}): ${error?.error?.message || 'Unknown error'}`
    );
  }

  const result = await response.json();
  const wamid = result.messages?.[0]?.id;

  if (!wamid) {
    throw new Error('No message ID returned from Meta API');
  }

  return { wamid };
}

// =============================================================================
// META CLOUD API — FETCH TEMPLATES
// =============================================================================

/**
 * Fetch all registered message templates from Meta Business Manager.
 */
export async function fetchMetaTemplates(): Promise<MetaTemplate[]> {
  const wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!wabaId || !accessToken) {
    throw new Error('Missing WHATSAPP_BUSINESS_ACCOUNT_ID or WHATSAPP_ACCESS_TOKEN');
  }

  const response = await fetch(
    `https://graph.facebook.com/${META_API_VERSION}/${wabaId}/message_templates?limit=100`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(
      `Meta API error (${response.status}): ${error?.error?.message || 'Unknown error'}`
    );
  }

  const result = await response.json();

  return (result.data || []).map((t: Record<string, unknown>) => {
    // Extract body text and parameters from template components
    const components = (t.components || []) as Array<Record<string, unknown>>;
    const bodyComponent = components.find(
      (c: Record<string, unknown>) => c.type === 'BODY'
    );
    const bodyText = (bodyComponent?.text as string) || '';
    const bodyExample = bodyComponent?.example as Record<string, unknown> | undefined;
    const params = ((bodyExample?.body_text as string[][]) || [[]])[0] || [];

    return {
      name: t.name as string,
      status: t.status as string,
      category: t.category as string,
      language: (t.language as string) || 'en',
      body: bodyText,
      parameters: params,
    };
  });
}

// =============================================================================
// REDIS — MESSAGE STATUS
// =============================================================================

/**
 * Store a message delivery status in Redis (24h TTL).
 */
export async function setMessageStatus(
  wamid: string,
  status: WhatsAppMessageStatus
): Promise<void> {
  const kv = getRedis();
  await kv.set(`wa:${wamid}`, JSON.stringify(status), { ex: 86400 });
}

/**
 * Retrieve a message delivery status from Redis.
 */
export async function getMessageStatus(
  wamid: string
): Promise<WhatsAppMessageStatus | null> {
  const kv = getRedis();
  const raw = await kv.get<string>(`wa:${wamid}`);
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw as unknown as WhatsAppMessageStatus;
}
