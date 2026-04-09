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
  parameterOrder: string[]; // body placeholder names in Meta's positional order
  buttonParam?: string;     // if set, this named param becomes a dynamic URL button
  /** Header text shown above the body (optional) */
  header?: string;
  /** Header media (image/document/video) — file in public/whatsapp-media/ */
  headerMedia?: {
    type: 'image' | 'document' | 'video';
    /** Path relative to public/, e.g. /whatsapp-media/portal-invite.jpg */
    url: string;
    /** Optional filename for documents (Meta uses this for download) */
    filename?: string;
  };
  /** The actual template body text with {{1}}, {{2}} etc replaced by named placeholders */
  bodyPreview: string;
  /** Footer text shown below the body */
  footer: string;
  /** Button label (if template has a CTA button) */
  buttonLabel?: string;
  /** Whether the Message param is editable by the adviser */
  editableParam?: string;
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
    parameterOrder: ['FirstName', 'AdviserName'],
    buttonParam: 'Link',
    header: 'Welcome to your Elite Wealth portal',
    headerMedia: { type: 'image', url: '/whatsapp-media/portal-invite.jpg' },
    bodyPreview: 'Dear {FirstName},\n\nYour adviser {AdviserName} has invited you to activate your Elite Wealth client portal. Please follow the link below to get started.\n\nIf you have any questions, please don\'t hesitate to reach out to them.',
    footer: 'Elite Wealth © 2026',
    buttonLabel: 'Activate your portal',
  },
  'info-request': {
    metaTemplateName: 'ew_info_request',
    language: 'en',
    parameterOrder: ['FirstName', 'AdviserName'],
    buttonParam: 'Link',
    headerMedia: { type: 'image', url: '/whatsapp-media/info-request.jpg' },
    bodyPreview: 'Dear {FirstName},\n\nYour adviser {AdviserName} has requested some information from you. Please follow the link below to complete the request.\n\nIf you have any questions, please don\'t hesitate to reach out to them.',
    footer: 'Elite Wealth © 2026',
    buttonLabel: 'Complete request',
  },
  'onboarding': {
    metaTemplateName: 'ew_onboarding',
    language: 'en',
    parameterOrder: ['AdviserName'],
    buttonParam: 'Link',
    headerMedia: { type: 'image', url: '/whatsapp-media/onboarding.jpg' },
    bodyPreview: 'Your adviser {AdviserName} has started your onboarding process. Please follow the link below to continue.\n\nIf you have any questions, please don\'t hesitate to reach out to them.',
    footer: 'Elite Wealth © 2026',
    buttonLabel: 'Start onboarding',
  },
  'document-request': {
    metaTemplateName: 'ew_document_request',
    language: 'en',
    parameterOrder: ['FirstName', 'AdviserName', 'DocumentList'],
    buttonParam: 'Link',
    headerMedia: { type: 'image', url: '/whatsapp-media/document-request.jpg' },
    bodyPreview: 'Dear {FirstName},\n\nYour adviser {AdviserName} has requested the following documents from you: {DocumentList}. Please follow the link below to upload them.\n\nIf you have any questions, please don\'t hesitate to reach out to them.',
    footer: 'Elite Wealth © 2026',
    buttonLabel: 'Upload documents',
  },
  'share-document': {
    metaTemplateName: 'ew_share_document',
    language: 'en',
    parameterOrder: ['FirstName', 'AdviserName'],
    buttonParam: 'Link',
    headerMedia: { type: 'image', url: '/whatsapp-media/share-document.jpg' },
    bodyPreview: 'Dear {FirstName},\n\nYour adviser {AdviserName} has shared a document with you. Please follow the link below to view it.\n\nIf you have any questions, please don\'t hesitate to reach out to them.',
    footer: 'Elite Wealth © 2026',
    buttonLabel: 'View document',
  },
  'password-reset': {
    metaTemplateName: 'ew_password_reset',
    language: 'en',
    parameterOrder: ['FirstName', 'AdviserName'],
    buttonParam: 'Link',
    headerMedia: { type: 'document', url: '/whatsapp-media/password-reset.pdf', filename: 'password-reset-instructions.pdf' },
    bodyPreview: 'Dear {FirstName},\n\nA password reset has been requested for your Elite Wealth account. Please follow the link below to set a new password. This link will expire in 24 hours.\n\nIf you did not request this, please contact your adviser {AdviserName} immediately.',
    footer: 'Elite Wealth © 2026',
    buttonLabel: 'Reset password',
  },
  'message': {
    metaTemplateName: 'ew_general_message',
    language: 'en',
    parameterOrder: ['FirstName', 'AdviserName', 'Message'],
    bodyPreview: 'Dear {FirstName},\n\nYour adviser {AdviserName} has sent you a message:\n{Message}\n\nIf you have any questions, please don\'t hesitate to reach out.',
    footer: 'Elite Wealth © 2026',
    editableParam: 'Message',
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

  // Build positional body parameters from our named placeholders
  const bodyParameters = mapping.parameterOrder.map(name => ({
    type: 'text' as const,
    text: templateParams[name] || '',
  }));

  const components: Array<Record<string, unknown>> = [];

  // Add header media component if template has one
  if (mapping.headerMedia) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ew-comms-hub.vercel.app';
    const mediaUrl = mapping.headerMedia.url.startsWith('http')
      ? mapping.headerMedia.url
      : `${baseUrl}${mapping.headerMedia.url}`;

    const mediaParam: Record<string, unknown> = { link: mediaUrl };
    if (mapping.headerMedia.type === 'document' && mapping.headerMedia.filename) {
      mediaParam.filename = mapping.headerMedia.filename;
    }

    components.push({
      type: 'header',
      parameters: [
        {
          type: mapping.headerMedia.type,
          [mapping.headerMedia.type]: mediaParam,
        },
      ],
    });
  }

  // Body component
  components.push({
    type: 'body',
    parameters: bodyParameters,
  });

  // Add dynamic URL button component if this template has one
  if (mapping.buttonParam) {
    components.push({
      type: 'button',
      sub_type: 'url',
      index: '0',
      parameters: [
        {
          type: 'text',
          text: templateParams[mapping.buttonParam] || '',
        },
      ],
    });
  }

  const body = {
    messaging_product: 'whatsapp',
    to: normalizedPhone,
    type: 'template',
    template: {
      name: mapping.metaTemplateName,
      language: { code: mapping.language },
      components,
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
