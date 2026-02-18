'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import ClientLayout from '@/components/ClientLayout';
import { INFO_SECTIONS, InfoSection, DOCUMENT_TYPES, DocumentType } from '@/types/communications';

// =============================================================================
// TYPES
// =============================================================================

type FlowStep = 'otp' | 'welcome-back' | 'form' | 'complete';

interface FormData {
  // Contact Details
  firstName: string;
  surname: string;
  email: string;
  mobile: string;
  address: string;
  // Financial
  monthlyIncome: string;
  monthlyExpenses: string;
  totalAssets: string;
  totalLiabilities: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_CLIENT = {
  firstName: 'Sarah',
  lastName: 'van der Berg',
  email: 'sarah@example.com',
  phone: '+27 83 234 5678',
  adviserName: 'Rassie du Preez',
  isReturning: false,
  completedSections: [] as InfoSection[],
};

const REQUESTED_SECTIONS: InfoSection[] = [
  'contact-details',
  'family-members',
  'employment',
  'financial',
  'tax',
];

const REQUESTED_DOCUMENTS: DocumentType[] = [
  'id-document',
  'proof-of-address',
  'bank-statement',
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function InfoRequestClientPage() {
  const params = useParams();
  const token = params.token as string;

  // Flow state
  const [step, setStep] = useState<FlowStep>('otp');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // OTP state
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    surname: '',
    email: '',
    mobile: '',
    address: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    totalAssets: '',
    totalLiabilities: '',
  });

  // Get current section
  const currentSection = REQUESTED_SECTIONS[currentSectionIndex];
  const totalSections = REQUESTED_SECTIONS.length;

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyOtp = () => {
    const code = otpCode.join('');
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    // Demo: any 6 digits work
    if (MOCK_CLIENT.isReturning) {
      setStep('welcome-back');
    } else {
      setStep('form');
    }
  };

  const resendOtp = () => {
    setOtpCode(['', '', '', '', '', '']);
    alert('A new code has been sent to your phone');
  };

  // Form navigation
  const goToNextSection = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      setStep('complete');
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  // Render section form
  const renderSectionForm = () => {
    switch (currentSection) {
      case 'contact-details':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={inputStyle}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label style={labelStyle}>Surname</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                style={inputStyle}
                placeholder="Enter your surname"
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={inputStyle}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label style={labelStyle}>Mobile Number</label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                style={inputStyle}
                placeholder="+27 XX XXX XXXX"
              />
            </div>
            <div>
              <label style={labelStyle}>Residential Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                placeholder="Enter your full address"
              />
            </div>
          </div>
        );

      case 'family-members':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>
              Add details about your family members (spouse, children, dependents).
            </p>
            <div style={{
              padding: '40px 20px',
              border: '2px dashed #e2e8f0',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#94a3b8',
            }}>
              <span className="material-icons" style={{ fontSize: '40px', marginBottom: '8px', display: 'block' }}>family_restroom</span>
              <p style={{ margin: 0 }}>Family member form placeholder</p>
              <button style={{
                marginTop: '16px',
                padding: '8px 16px',
                border: '1px solid #016991',
                borderRadius: '6px',
                background: 'white',
                color: '#016991',
                cursor: 'pointer',
              }}>
                + Add Family Member
              </button>
            </div>
          </div>
        );

      case 'employment':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>
              Provide information about your current employment status.
            </p>
            <div style={{
              padding: '40px 20px',
              border: '2px dashed #e2e8f0',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#94a3b8',
            }}>
              <span className="material-icons" style={{ fontSize: '40px', marginBottom: '8px', display: 'block' }}>work</span>
              <p style={{ margin: 0 }}>Employment details form placeholder</p>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Monthly Gross Income</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}>R</span>
                <input
                  type="text"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: '28px' }}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Monthly Expenses</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}>R</span>
                <input
                  type="text"
                  value={formData.monthlyExpenses}
                  onChange={(e) => setFormData({ ...formData, monthlyExpenses: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: '28px' }}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Total Assets</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}>R</span>
                <input
                  type="text"
                  value={formData.totalAssets}
                  onChange={(e) => setFormData({ ...formData, totalAssets: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: '28px' }}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Total Liabilities</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}>R</span>
                <input
                  type="text"
                  value={formData.totalLiabilities}
                  onChange={(e) => setFormData({ ...formData, totalLiabilities: e.target.value })}
                  style={{ ...inputStyle, paddingLeft: '28px' }}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        );

      case 'tax':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>
              Provide your tax-related information.
            </p>
            <div style={{
              padding: '40px 20px',
              border: '2px dashed #e2e8f0',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#94a3b8',
            }}>
              <span className="material-icons" style={{ fontSize: '40px', marginBottom: '8px', display: 'block' }}>receipt_long</span>
              <p style={{ margin: 0 }}>Tax information form placeholder</p>
            </div>
          </div>
        );

      default:
        return (
          <div style={{
            padding: '40px 20px',
            border: '2px dashed #e2e8f0',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#94a3b8',
          }}>
            <p style={{ margin: 0 }}>Section form placeholder</p>
          </div>
        );
    }
  };

  // Styles
  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <ClientLayout>
      {/* OTP Verification */}
      {step === 'otp' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <span className="material-icons" style={{ fontSize: '32px', color: '#016991' }}>lock</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>
            Verify Your Identity
          </h1>
          <p style={{ color: '#64748b', margin: '0 0 32px 0' }}>
            We've sent a 6-digit code to<br />
            <strong>+27 83 *** 5678</strong>
          </p>

          {/* OTP Input */}
          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '16px',
          }}>
            {otpCode.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                style={{
                  width: '48px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 600,
                  border: otpError ? '2px solid #ef4444' : '2px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none',
                }}
              />
            ))}
          </div>

          {otpError && (
            <p style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 16px 0' }}>{otpError}</p>
          )}

          <button
            onClick={verifyOtp}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#016991',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            Verify & Continue
          </button>

          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Didn't receive a code?{' '}
            <button
              onClick={resendOtp}
              style={{
                background: 'none',
                border: 'none',
                color: '#016991',
                cursor: 'pointer',
                fontWeight: 500,
                padding: 0,
              }}
            >
              Resend
            </button>
          </p>
        </div>
      )}

      {/* Welcome Back (Returning Client) */}
      {step === 'welcome-back' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <span className="material-icons" style={{ fontSize: '32px', color: '#16a34a' }}>waving_hand</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>
            Welcome Back, {MOCK_CLIENT.firstName}
          </h1>
          <p style={{ color: '#64748b', margin: '0 0 24px 0' }}>
            You've made progress. Pick up where you left off.
          </p>

          {/* Progress Checklist */}
          <div style={{
            textAlign: 'left',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            {REQUESTED_SECTIONS.map((section, index) => {
              const isComplete = MOCK_CLIENT.completedSections.includes(section);
              const isCurrent = index === MOCK_CLIENT.completedSections.length;
              return (
                <div key={section} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 0',
                  borderBottom: index < REQUESTED_SECTIONS.length - 1 ? '1px solid #e2e8f0' : 'none',
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isComplete ? '#16a34a' : isCurrent ? '#016991' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {isComplete ? (
                      <span className="material-icons" style={{ fontSize: '16px', color: 'white' }}>check</span>
                    ) : (
                      <span style={{ fontSize: '12px', color: isCurrent ? 'white' : '#94a3b8' }}>{index + 1}</span>
                    )}
                  </div>
                  <span style={{
                    color: isComplete ? '#16a34a' : isCurrent ? '#016991' : '#64748b',
                    fontWeight: isCurrent ? 600 : 400,
                  }}>
                    {INFO_SECTIONS[section].label}
                  </span>
                  {isCurrent && (
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '12px',
                      backgroundColor: '#016991',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}>
                      Continue here
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setStep('form')}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#016991',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue
            </button>
            <button
              onClick={() => {
                setCurrentSectionIndex(0);
                setStep('form');
              }}
              style={{
                padding: '14px 20px',
                backgroundColor: 'white',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {/* Multi-Step Form */}
      {step === 'form' && (
        <div>
          {/* Step Indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '24px',
          }}>
            {REQUESTED_SECTIONS.map((_, index) => (
              <div
                key={index}
                style={{
                  width: index === currentSectionIndex ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: index <= currentSectionIndex ? '#016991' : '#e2e8f0',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          {/* Section Title */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 4px 0' }}>
              Step {currentSectionIndex + 1} of {totalSections}
            </p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: '#1e293b' }}>
              {INFO_SECTIONS[currentSection].label}
            </h2>
          </div>

          {/* Section Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            {renderSectionForm()}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {currentSectionIndex > 0 && (
              <button
                onClick={goToPrevSection}
                style={{
                  padding: '14px 20px',
                  backgroundColor: 'white',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
                Back
              </button>
            )}
            <button
              onClick={goToNextSection}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#016991',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              {currentSectionIndex < totalSections - 1 ? (
                <>
                  Next: {INFO_SECTIONS[REQUESTED_SECTIONS[currentSectionIndex + 1]].label}
                  <span className="material-icons" style={{ fontSize: '18px' }}>arrow_forward</span>
                </>
              ) : (
                <>
                  Submit
                  <span className="material-icons" style={{ fontSize: '18px' }}>check</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Completion */}
      {step === 'complete' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <span className="material-icons" style={{ fontSize: '40px', color: '#16a34a' }}>check_circle</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>
            Thank You!
          </h1>
          <p style={{ color: '#64748b', margin: '0 0 32px 0' }}>
            Your information has been submitted successfully.
            {MOCK_CLIENT.adviserName} will review your details and be in touch soon.
          </p>

          <div style={{
            backgroundColor: '#f0f9ff',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <p style={{ margin: 0, color: '#0369a1', fontSize: '14px' }}>
              <span className="material-icons" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '8px' }}>info</span>
              We'll notify you if any additional information is needed.
            </p>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            You can close this window now.
          </p>
        </div>
      )}
    </ClientLayout>
  );
}
