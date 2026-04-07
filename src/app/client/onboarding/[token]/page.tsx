'use client';

import { useState } from 'react';
import ClientLayout from '@/components/ClientLayout';
import { INFO_SECTIONS, InfoSection } from '@/types/communications';

type FlowStep = 'otp' | 'form' | 'complete';

const MOCK_CLIENT = {
  firstName: 'Sarah',
  lastName: 'van der Berg',
  adviserName: 'Rassie du Preez',
};

// Onboarding requests ALL sections
const REQUESTED_SECTIONS: InfoSection[] = [
  'contact-details',
  'personal-information',
  'related-entities',
  'financial',
  'insurance',
  'will-estate',
  'documents',
];

export default function OnboardingClientPage() {
  const [step, setStep] = useState<FlowStep>('otp');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');

  const currentSection = REQUESTED_SECTIONS[currentSectionIndex];
  const totalSections = REQUESTED_SECTIONS.length;

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    setOtpError('');
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const verifyOtp = () => {
    if (otpCode.join('').length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    setStep('form');
  };

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

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px',
    fontSize: '16px', outline: 'none', boxSizing: 'border-box',
  };

  const renderSectionForm = () => {
    switch (currentSection) {
      case 'contact-details':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div><label style={labelStyle}>First Name</label><input type="text" style={inputStyle} placeholder="Enter your first name" /></div>
            <div><label style={labelStyle}>Surname</label><input type="text" style={inputStyle} placeholder="Enter your surname" /></div>
            <div><label style={labelStyle}>Email Address</label><input type="email" style={inputStyle} placeholder="Enter your email" /></div>
            <div><label style={labelStyle}>Mobile Number</label><input type="tel" style={inputStyle} placeholder="+27 XX XXX XXXX" /></div>
            <div><label style={labelStyle}>Residential Address</label><textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Enter your full address" /></div>
          </div>
        );
      case 'personal-information':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>Add details about your family members (spouse, children, dependents).</p>
            <div style={{ padding: '40px 20px', border: '2px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', color: '#94a3b8' }}>
              <span className="material-icons" style={{ fontSize: '40px', marginBottom: '8px', display: 'block' }}>family_restroom</span>
              <p style={{ margin: 0 }}>Family member form placeholder</p>
              <button style={{ marginTop: '16px', padding: '8px 16px', border: '1px solid #016991', borderRadius: '6px', background: 'white', color: '#016991', cursor: 'pointer' }}>+ Add Family Member</button>
            </div>
          </div>
        );
      case 'related-entities':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>Provide information about your current employment status.</p>
            <div style={{ padding: '40px 20px', border: '2px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', color: '#94a3b8' }}>
              <span className="material-icons" style={{ fontSize: '40px', marginBottom: '8px', display: 'block' }}>work</span>
              <p style={{ margin: 0 }}>Employment details form placeholder</p>
            </div>
          </div>
        );
      case 'financial':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div><label style={labelStyle}>Monthly Gross Income</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>R</span>
                <input type="text" style={{ ...inputStyle, paddingLeft: '28px' }} placeholder="0.00" />
              </div>
            </div>
            <div><label style={labelStyle}>Monthly Expenses</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>R</span>
                <input type="text" style={{ ...inputStyle, paddingLeft: '28px' }} placeholder="0.00" />
              </div>
            </div>
            <div><label style={labelStyle}>Total Assets</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>R</span>
                <input type="text" style={{ ...inputStyle, paddingLeft: '28px' }} placeholder="0.00" />
              </div>
            </div>
            <div><label style={labelStyle}>Total Liabilities</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>R</span>
                <input type="text" style={{ ...inputStyle, paddingLeft: '28px' }} placeholder="0.00" />
              </div>
            </div>
          </div>
        );
      case 'insurance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>Provide details about your existing insurance policies.</p>
            <div style={{ padding: '40px 20px', border: '2px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', color: '#94a3b8' }}>
              <span className="material-icons" style={{ fontSize: '40px', marginBottom: '8px', display: 'block' }}>shield</span>
              <p style={{ margin: 0 }}>Insurance details form placeholder</p>
            </div>
          </div>
        );
      case 'will-estate':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>Provide details about your will and estate planning.</p>
            <div style={{ padding: '40px 20px', border: '2px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', color: '#94a3b8' }}>
              <span className="material-icons" style={{ fontSize: '40px', marginBottom: '8px', display: 'block' }}>gavel</span>
              <p style={{ margin: 0 }}>Will & estate form placeholder</p>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>Upload the required documents to complete your onboarding.</p>
            {['ID Document', 'Proof of Address', 'Bank Statements', 'Proof of Bank Account', 'Company Documents'].map((doc) => (
              <div key={doc} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="material-icons" style={{ color: '#94a3b8' }}>description</span>
                  <span style={{ fontWeight: 500, color: '#334155' }}>{doc}</span>
                </div>
                <button style={{
                  padding: '6px 12px', border: '1px solid #016991', borderRadius: '6px',
                  background: 'white', color: '#016991', cursor: 'pointer', fontSize: '13px',
                }}>Upload</button>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div style={{ padding: '40px 20px', border: '2px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ margin: 0 }}>Section form placeholder</p>
          </div>
        );
    }
  };

  return (
    <ClientLayout>
      {/* OTP */}
      {step === 'otp' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="material-icons" style={{ fontSize: '32px', color: '#016991' }}>how_to_reg</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>Welcome to Elite Wealth</h1>
          <p style={{ color: '#64748b', margin: '0 0 8px 0' }}>
            Your adviser <strong>{MOCK_CLIENT.adviserName}</strong> has started your onboarding process.
          </p>
          <p style={{ color: '#64748b', margin: '0 0 32px 0' }}>
            We've sent a 6-digit code to <strong>+27 83 *** 5678</strong>
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
            {otpCode.map((digit, index) => (
              <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                style={{ width: '48px', height: '56px', textAlign: 'center', fontSize: '24px', fontWeight: 600, border: otpError ? '2px solid #ef4444' : '2px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} />
            ))}
          </div>
          {otpError && <p style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 16px 0' }}>{otpError}</p>}
          <button onClick={verifyOtp}
            style={{ width: '100%', padding: '14px', backgroundColor: '#016991', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', marginBottom: '16px' }}>
            Verify & Start Onboarding
          </button>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Didn't receive a code?{' '}
            <button onClick={() => { setOtpCode(['', '', '', '', '', '']); alert('A new code has been sent'); }}
              style={{ background: 'none', border: 'none', color: '#016991', cursor: 'pointer', fontWeight: 500, padding: 0 }}>Resend</button>
          </p>
        </div>
      )}

      {/* Multi-Step Form */}
      {step === 'form' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            {REQUESTED_SECTIONS.map((_, index) => (
              <div key={index} style={{
                width: index === currentSectionIndex ? '32px' : '8px', height: '8px', borderRadius: '4px',
                backgroundColor: index <= currentSectionIndex ? '#016991' : '#e2e8f0', transition: 'all 0.2s',
              }} />
            ))}
          </div>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 4px 0' }}>Step {currentSectionIndex + 1} of {totalSections}</p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: '#1e293b' }}>
              {INFO_SECTIONS[currentSection]?.label || currentSection}
            </h2>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {renderSectionForm()}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {currentSectionIndex > 0 && (
              <button onClick={goToPrevSection}
                style={{ padding: '14px 20px', backgroundColor: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span> Back
              </button>
            )}
            <button onClick={goToNextSection}
              style={{ flex: 1, padding: '14px', backgroundColor: '#016991', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              {currentSectionIndex < totalSections - 1 ? (
                <>{INFO_SECTIONS[REQUESTED_SECTIONS[currentSectionIndex + 1]]?.label || 'Next'}<span className="material-icons" style={{ fontSize: '18px' }}>arrow_forward</span></>
              ) : (
                <>Submit<span className="material-icons" style={{ fontSize: '18px' }}>check</span></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Complete */}
      {step === 'complete' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="material-icons" style={{ fontSize: '40px', color: '#16a34a' }}>check_circle</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>Onboarding Complete!</h1>
          <p style={{ color: '#64748b', margin: '0 0 32px 0' }}>
            Thank you, {MOCK_CLIENT.firstName}. Your information has been submitted successfully.
            {MOCK_CLIENT.adviserName} will review your details and be in touch soon.
          </p>
          <div style={{ backgroundColor: '#f0f9ff', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <p style={{ margin: 0, color: '#0369a1', fontSize: '14px' }}>
              <span className="material-icons" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '8px' }}>info</span>
              We'll notify you if any additional information is needed.
            </p>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>You can close this window now.</p>
        </div>
      )}
    </ClientLayout>
  );
}
