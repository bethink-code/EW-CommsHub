'use client';

import { useState, useCallback, useMemo } from 'react';
import { ModalField, ModalInfo, ModalFooter, ModalSection } from '../Modal';
import { Client, Channel, CHANNELS } from '@/types/communications';

// =============================================================================
// VALIDATION
// =============================================================================

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Allow various phone formats, at least 8 digits
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8;
}

// Channels that require phone vs email
const PHONE_CHANNELS: Channel[] = ['sms', 'whatsapp'];
const EMAIL_CHANNELS: Channel[] = ['email'];
// in-app can work with either

// =============================================================================
// COMPONENT
// =============================================================================

export interface ConfirmContactStepProps {
  client: Client;
  email: string;
  phone: string;
  channels: Channel[];
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
  onChannelToggle: (channel: Channel) => void;
  onCancel: () => void;
  onNext: () => void;
}

export function ConfirmContactStep({
  client,
  email,
  phone,
  channels,
  onEmailChange,
  onPhoneChange,
  onChannelToggle,
  onCancel,
  onNext,
}: ConfirmContactStepProps) {
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [touched, setTouched] = useState({ email: false, phone: false });

  const allChannels: Channel[] = ['sms', 'whatsapp', 'email', 'in-app'];

  // Determine which fields are required based on selected channels
  const requiresPhone = channels.some(ch => PHONE_CHANNELS.includes(ch));
  const requiresEmail = channels.some(ch => EMAIL_CHANNELS.includes(ch));
  const hasChannelSelected = channels.length > 0;

  // Validate on blur
  const validateEmail = useCallback((value: string, required: boolean) => {
    if (required && !value.trim()) {
      return 'Email is required for this channel';
    }
    if (value.trim() && !isValidEmail(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  }, []);

  const validatePhone = useCallback((value: string, required: boolean) => {
    if (required && !value.trim()) {
      return 'Phone number is required for this channel';
    }
    if (value.trim() && !isValidPhone(value)) {
      return 'Please enter a valid phone number';
    }
    return undefined;
  }, []);

  const handleEmailBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, email: true }));
    setEmailError(validateEmail(email, requiresEmail));
  }, [email, requiresEmail, validateEmail]);

  const handlePhoneBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, phone: true }));
    setPhoneError(validatePhone(phone, requiresPhone));
  }, [phone, requiresPhone, validatePhone]);

  // Handle channel toggle and re-validate
  const handleChannelToggle = useCallback((toggledChannel: Channel) => {
    // Calculate new channels array
    const isSelected = channels.includes(toggledChannel);
    const newChannels = isSelected
      ? channels.filter(c => c !== toggledChannel)
      : [...channels, toggledChannel];

    // Calculate new requirements
    const newRequiresPhone = newChannels.some(ch => PHONE_CHANNELS.includes(ch));
    const newRequiresEmail = newChannels.some(ch => EMAIL_CHANNELS.includes(ch));

    // Re-validate if touched
    if (touched.email) {
      setEmailError(validateEmail(email, newRequiresEmail));
    }
    if (touched.phone) {
      setPhoneError(validatePhone(phone, newRequiresPhone));
    }

    onChannelToggle(toggledChannel);
  }, [channels, onChannelToggle, email, phone, touched, validateEmail, validatePhone]);

  // Validate and proceed
  const handleNext = useCallback(() => {
    const emailErr = validateEmail(email, requiresEmail);
    const phoneErr = validatePhone(phone, requiresPhone);

    setEmailError(emailErr);
    setPhoneError(phoneErr);
    setTouched({ email: true, phone: true });

    if (!emailErr && !phoneErr) {
      onNext();
    }
  }, [email, phone, requiresEmail, requiresPhone, validateEmail, validatePhone, onNext]);

  // Check if form is valid for current channels
  const isValid = useMemo(() => {
    if (!hasChannelSelected) return false;
    const emailErr = validateEmail(email, requiresEmail);
    const phoneErr = validatePhone(phone, requiresPhone);
    return !emailErr && !phoneErr;
  }, [email, phone, requiresEmail, requiresPhone, hasChannelSelected, validateEmail, validatePhone]);

  return (
    <>
      {/* Client header */}
      <div className="modal-client-header">
        <div className="modal-client-avatar">
          <span className="material-icons-outlined">person</span>
        </div>
        <h3 className="modal-client-name">
          {client.firstName} {client.lastName}
        </h3>
      </div>

      {/* Contact details section */}
      <ModalSection title="Contact details">
        {/* Email field - uses text style for required */}
        <ModalField
          label={<>Email{requiresEmail && <span className="required-text">(required)</span>}</>}
          htmlFor="contact-email"
          error={touched.email ? emailError : undefined}
        >
          <input
            type="email"
            id="contact-email"
            value={email}
            onChange={(e) => {
              onEmailChange(e.target.value);
              if (touched.email) {
                setEmailError(validateEmail(e.target.value, requiresEmail));
              }
            }}
            onBlur={handleEmailBlur}
            placeholder="client@example.com"
            autoComplete="email"
            className={requiresEmail ? '' : 'optional-field'}
          />
        </ModalField>

        {/* Phone field - uses asterisk style for required */}
        <ModalField
          label={<>Phone{requiresPhone && <span className="required-asterisk">*</span>}</>}
          htmlFor="contact-phone"
          error={touched.phone ? phoneError : undefined}
        >
          <input
            type="tel"
            id="contact-phone"
            value={phone}
            onChange={(e) => {
              onPhoneChange(e.target.value);
              if (touched.phone) {
                setPhoneError(validatePhone(e.target.value, requiresPhone));
              }
            }}
            onBlur={handlePhoneBlur}
            placeholder="+27 82 123 4567"
            autoComplete="tel"
            className={requiresPhone ? '' : 'optional-field'}
          />
        </ModalField>
      </ModalSection>

      {/* Channel selection (multi-select) - moved to bottom */}
      <ModalSection title="Send via (select one or more)">
        <div className="channel-tabs">
          {allChannels.map((ch) => (
            <button
              key={ch}
              type="button"
              className={`channel-tab ${channels.includes(ch) ? 'selected' : ''}`}
              onClick={() => handleChannelToggle(ch)}
            >
              <span className="channel-tab-label">{CHANNELS[ch].label}</span>
              {channels.includes(ch) && (
                <span className="channel-tab-check">
                  <span className="material-icons-outlined">check</span>
                </span>
              )}
            </button>
          ))}
        </div>
        {!hasChannelSelected && (
          <div className="channel-error">Please select at least one channel</div>
        )}
      </ModalSection>

      {/* Info message */}
      <ModalInfo variant="info">
        {!hasChannelSelected && 'Select at least one channel to send the information request.'}
        {hasChannelSelected && requiresEmail && !email.trim() && 'An email address is required for Email channel.'}
        {hasChannelSelected && requiresPhone && !phone.trim() && 'A phone number is required for SMS/WhatsApp channels.'}
        {hasChannelSelected && !requiresEmail && !requiresPhone && channels.includes('in-app') &&
          'In-app notifications will appear in the client\'s portal.'}
        {hasChannelSelected && isValid && channels.length === 1 &&
          `We'll send the information request via ${CHANNELS[channels[0]].label}.`}
        {hasChannelSelected && isValid && channels.length > 1 &&
          `We'll send via ${channels.map(ch => CHANNELS[ch].label).join(', ')}.`}
      </ModalInfo>

      {/* Footer */}
      <div className="step-footer">
        <ModalFooter
          onCancel={onCancel}
          onPrimary={handleNext}
          primaryLabel="Confirm & Continue"
          primaryIcon="arrow_forward"
          primaryDisabled={touched.email && touched.phone && !isValid}
        />
      </div>
    </>
  );
}

export default ConfirmContactStep;
