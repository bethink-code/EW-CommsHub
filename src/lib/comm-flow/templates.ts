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
  | 'document-request'
  | 'password-reset'
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

    whatsapp: `Hi {FirstName},

I'd like to give you access to your personal Wealth Portal. View your portfolio, statements, and more – all in one secure place.

Set up your account here:
{Link}

The same login will work on both our web portal and mobile app.

Questions? Just reply to this message.

Regards,
{AdviserName}
Elite Wealth`,

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

    'in-app': `Hi {FirstName},

Your client portal is ready for activation: {Link}

{AdviserName}`,
  },

  // =========================================================================
  // INFO REQUEST
  // =========================================================================
  'info-request': {
    sms: `Hi {FirstName},

To ensure I'm giving you the best advice, I need to gather some information.

Please complete this form:
{Link}

Thanks,
{AdviserName}`,

    whatsapp: `Hi {FirstName},

To ensure I'm giving you the best advice, I need to gather some information about your financial situation.

Please complete this secure form:
{Link}

Let me know if you have any questions!

Thanks,
{AdviserName}`,

    email: `Dear {FirstName},

To ensure I'm providing you with the most relevant financial advice, I need to gather some information about your current situation.

Please complete this secure form:
{Link}

The form should take about 10-15 minutes to complete. You can save your progress and return later if needed.

If you have any questions, please don't hesitate to reach out.

Kind regards,
{AdviserName}
Elite Wealth`,

    'in-app': `Hi {FirstName},

Please complete your information request: {Link}

{AdviserName}`,
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

    whatsapp: `Hi {FirstName},

I need a few documents from you to proceed with your financial planning:

{DocumentList}

Please upload them securely here: {Link}

Let me know if you have any questions!

Thanks,
{AdviserName}`,

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

    'in-app': `Hi {FirstName},

Please upload the following documents: {Link}

{DocumentList}

Thanks,
{AdviserName}`,
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
{AdviserName}
Elite Wealth`,
  },

  // =========================================================================
  // SIMPLE MESSAGE TYPES
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
    whatsapp: `Hi {FirstName},

{Message}

Regards,
{AdviserName}`,
  },

  'in-app': {
    'in-app': `Hi {FirstName},

{Message}

{AdviserName}`,
  },

  // =========================================================================
  // DEFAULT
  // =========================================================================
  default: {
    sms: `Hi {FirstName},

{Message}

Regards,
Elite Wealth`,

    email: `Dear {FirstName},

{Message}

Kind regards,
Elite Wealth`,

    whatsapp: `Hi {FirstName},

{Message}

Regards,
Elite Wealth`,

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
