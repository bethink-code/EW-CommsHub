/**
 * Unified Message Templates
 *
 * All message templates for all comm types and channels,
 * consolidated in one place.
 */

import { Channel } from '@/types/communications';

// =============================================================================
// TEMPLATE TYPES
// =============================================================================

export type TemplateKey =
  | 'portal-invite'
  | 'info-request'
  | 'onboarding'
  | 'document-request'
  | 'share-document'
  | 'password-reset'
  | 'message'
  | 'sms'
  | 'email'
  | 'whatsapp'
  | 'in-app'
  | 'default';

// =============================================================================
// MESSAGE TEMPLATES
// =============================================================================

/**
 * Message templates organized by comm type and channel.
 *
 * Placeholders:
 * - {FirstName} - Client's first name
 * - {LastName} - Client's last name
 * - {AdviserName} - Adviser's name
 * - {Link} - Action link (portal, form, etc.)
 * - {DocumentList} - List of requested documents
 * - {Message} - Custom message content
 */
export const MESSAGE_TEMPLATES: Record<TemplateKey, Partial<Record<Channel, string>>> = {
  // =========================================================================
  // PORTAL INVITE
  // =========================================================================
  'portal-invite': {
    sms: `Hi {FirstName},

I'd like to give you access to your personal Wealth Portal. View your portfolio, statements, and more – all in one secure place.

Set up your account here:
{Link}

Questions? Just reply to this message.

Regards,
{AdviserName}
Elite Wealth`,

    whatsapp: `Dear {FirstName},

Your adviser {AdviserName} has invited you to activate your Elite Wealth client portal. Please follow the link below to get started.

If you have any questions, please don't hesitate to reach out to them.`,

    email: `Dear {FirstName},

I'm pleased to invite you to access your personal Wealth Portal – a secure platform where you can view your portfolio, download statements, and track your investments at any time.

Setting up your account takes just a few minutes:
{Link}

The same login will work on both our web portal and mobile app, giving you flexibility to check in whenever suits you.

If you have any questions, please don't hesitate to reach out.

Kind regards,
{AdviserName}
Elite Wealth
+27 82 555 1234`,

    'in-app': `You've been invited to access the Elite Wealth Portal. Set up your account to view your portfolio and documents.`,
  },

  // =========================================================================
  // INFO REQUEST
  // =========================================================================
  'info-request': {
    sms: `Hi {FirstName},

To ensure I'm giving you the best advice, I need to gather some information about your current situation.

Please complete this secure form:
{Link}

It should take about 10-15 minutes.

Thanks,
{AdviserName}`,

    whatsapp: `Dear {FirstName},

Your adviser {AdviserName} has requested some information from you. Please follow the link below to complete the request.

If you have any questions, please don't hesitate to reach out to them.`,

    email: `Dear {FirstName},

To ensure I'm providing you with the most relevant financial advice, I need to gather some information about your current situation.

Please complete this secure form:
{Link}

The form should take about 10-15 minutes to complete. You can save your progress and return later if needed.

If you have any questions, please don't hesitate to reach out.

Kind regards,
{AdviserName}
Elite Wealth`,

    'in-app': `We need to gather some information from you. Please complete the secure form — it should take about 10-15 minutes.`,
  },

  // =========================================================================
  // CLIENT ONBOARDING (same flow as info-request, welcoming tone)
  // =========================================================================
  'onboarding': {
    sms: `Hi {FirstName},

Welcome to Elite Wealth! To get you set up, I need to gather some information.

Please complete this form:
{Link}

It should take about 10-15 minutes.

Thanks,
{AdviserName}`,

    whatsapp: `Dear {FirstName},

Welcome to Elite Wealth. Your adviser {AdviserName} has started your onboarding process. Please follow the link below to continue.

If you have any questions, please don't hesitate to reach out to them.`,

    email: `Dear {FirstName},

Welcome to Elite Wealth — I'm looking forward to working with you.

To get started, I need to gather some information about your current financial situation. Please complete this secure form:
{Link}

The form should take about 10-15 minutes to complete. You can save your progress and return later if needed.

If you have any questions, please don't hesitate to reach out.

Kind regards,
{AdviserName}
Elite Wealth`,

    'in-app': `Welcome to Elite Wealth! Please complete your onboarding form to get started — it should take about 10-15 minutes.`,
  },

  // =========================================================================
  // DOCUMENT REQUEST
  // =========================================================================
  'document-request': {
    sms: `Hi {FirstName},

I need a few documents from you to proceed with your financial planning:

{DocumentList}

Please upload them here: {Link}

Thanks,
{AdviserName}`,

    whatsapp: `Dear {FirstName},

Your adviser {AdviserName} has requested the following documents from you: {DocumentList}. Please follow the link below to upload them.

If you have any questions, please don't hesitate to reach out to them.`,

    email: `Dear {FirstName},

I hope this message finds you well.

To proceed with your financial planning, I need the following documents:

{DocumentList}

Please upload them securely using this link:
{Link}

You can also reply to this email with the documents attached if you prefer.

If you have any questions, please don't hesitate to reach out.

Best regards,
{AdviserName}
Elite Wealth`,

    'in-app': `We need some documents from you. Please upload them via the secure link in your portal.`,
  },

  // =========================================================================
  // SHARE DOCUMENT
  // =========================================================================
  'share-document': {
    sms: `Hi {FirstName},

I've shared a document with you via the Elite Wealth Portal.

View it here: {Link}

Regards,
{AdviserName}`,

    whatsapp: `Dear {FirstName},

Your adviser {AdviserName} has shared a document with you. Please follow the link below to view it.

If you have any questions, please don't hesitate to reach out to them.`,

    email: `Dear {FirstName},

I've shared a document with you via the Elite Wealth Portal.

You can view and download it by logging in to your portal:
{Link}

If you have any questions about the document, please don't hesitate to reach out.

Kind regards,
{AdviserName}
Elite Wealth`,

    'in-app': `A document has been shared with you. View and download it from your portal.`,
  },

  // =========================================================================
  // PASSWORD RESET
  // =========================================================================
  'password-reset': {
    email: `Dear {FirstName},

We received a request to reset your portal password.

Click the link below to set a new password:
{Link}

This link will expire in 24 hours. If you did not request this, you can safely ignore this email.

Kind regards,
{AdviserName}
Elite Wealth`,

    sms: `Hi {FirstName},

Your password reset link:
{Link}

This link expires in 24 hours.

Regards,
{AdviserName}`,

    whatsapp: `Dear {FirstName},

A password reset has been requested for your Elite Wealth account. Please follow the link below to set a new password. This link will expire in 24 hours.

If you did not request this, please contact your adviser {AdviserName} immediately.`,

    'in-app': `Your password reset link is ready. Click below to set a new password. This link expires in 24 hours.`,
  },

  // =========================================================================
  // MESSAGE (freeform — all channels)
  // =========================================================================
  'message': {
    sms: `Hi {FirstName},

{Message}

Regards,
{AdviserName}`,

    email: `Dear {FirstName},

{Message}

Kind regards,
{AdviserName}
Elite Wealth`,

    whatsapp: `Dear {FirstName},

Your adviser {AdviserName} has sent you a message:

Type your message here...

If you have any questions, please don't hesitate to reach out.`,

    'in-app': `{Message}`,
  },

  // =========================================================================
  // SIMPLE CHANNEL TYPES (single-channel flows)
  // =========================================================================
  sms: {
    sms: `Hi {FirstName},

{Message}

Regards,
{AdviserName}`,
  },

  email: {
    email: `Dear {FirstName},

{Message}

Kind regards,
{AdviserName}
Elite Wealth`,
  },

  whatsapp: {
    whatsapp: `Dear {FirstName},

Your adviser {AdviserName} has sent you a message:

Type your message here...

If you have any questions, please don't hesitate to reach out.`,
  },

  'in-app': {
    'in-app': `{Message}`,
  },

  // =========================================================================
  // DEFAULT
  // =========================================================================
  default: {
    sms: `Hi {FirstName},

{Message}

Regards,
{AdviserName}
Elite Wealth`,

    email: `Dear {FirstName},

{Message}

Kind regards,
{AdviserName}
Elite Wealth`,

    whatsapp: `Dear {FirstName},

Your adviser {AdviserName} has sent you a message:

Type your message here...

If you have any questions, please don't hesitate to reach out.`,

    'in-app': `{Message}`,
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the message template for a comm type and channel.
 */
export function getMessageTemplate(commType: string, channel: Channel): string {
  const typeTemplates = MESSAGE_TEMPLATES[commType as TemplateKey];
  if (typeTemplates && typeTemplates[channel]) {
    return typeTemplates[channel];
  }

  // Fall back to default templates
  const defaultTemplates = MESSAGE_TEMPLATES.default;
  return defaultTemplates[channel] || '';
}

/**
 * Replace placeholders in a template with actual values.
 */
export function renderTemplate(
  template: string,
  values: {
    firstName?: string;
    lastName?: string;
    adviserName?: string;
    link?: string;
    documentList?: string;
    message?: string;
  }
): string {
  let result = template;

  if (values.firstName) {
    result = result.replace(/\{FirstName\}/g, values.firstName);
  }
  if (values.lastName) {
    result = result.replace(/\{LastName\}/g, values.lastName);
  }
  if (values.adviserName) {
    result = result.replace(/\{AdviserName\}/g, values.adviserName);
  }
  if (values.link) {
    result = result.replace(/\{Link\}/g, values.link);
  }
  if (values.documentList) {
    result = result.replace(/\{DocumentList\}/g, values.documentList);
  }
  if (values.message) {
    result = result.replace(/\{Message\}/g, values.message);
  }

  return result;
}

/**
 * Check if switching channels should update the message.
 * Returns true if the current message matches the previous channel's default template.
 */
export function shouldUpdateMessageOnChannelChange(
  currentMessage: string,
  previousChannel: Channel,
  commType: string
): boolean {
  const previousTemplate = getMessageTemplate(commType, previousChannel);
  return currentMessage === previousTemplate;
}
