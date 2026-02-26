/**
 * Comm Flow Step Components
 *
 * All step components for the unified communication flow system.
 * Importing this module will register all steps with the step registry.
 */

// Core steps (always used)
export { RecipientsStep } from './RecipientsStep';
export { CommTypeStep } from './CommTypeStep';
export { ComposeStep } from './ComposeStep';
export { PreviewStep } from './PreviewStep';

// Portal Invite steps
export { ConfigureAccessStep } from './ConfigureAccessStep';

// Document Request steps
export { SelectDocumentsStep, STANDARD_DOCUMENTS } from './SelectDocumentsStep';
export type { DocumentOption } from './SelectDocumentsStep';

// Info Request steps
export { ConfirmContactStep } from './ConfirmContactStep';
export { ConfigureRequestStep } from './ConfigureRequestStep';

// Register all steps by importing them
// This ensures they're registered with the step registry
import './RecipientsStep';
import './CommTypeStep';
import './ComposeStep';
import './PreviewStep';
import './ConfigureAccessStep';
import './SelectDocumentsStep';
import './ConfirmContactStep';
import './ConfigureRequestStep';
