'use client';

import { useState } from 'react';
import ClientLayout from '@/components/ClientLayout';

type FlowStep = 'otp' | 'view' | 'downloaded';

const MOCK_CLIENT = {
  firstName: 'Sarah',
  adviserName: 'Rassie du Preez',
};

const MOCK_DOCUMENT = {
  name: 'Portfolio Review Q1 2026.pdf',
  size: '2.4 MB',
  date: '7 April 2026',
  pages: 12,
};

export default function ShareDocumentClientPage() {
  const [step, setStep] = useState<FlowStep>('otp');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');

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
    setStep('view');
  };

  return (
    <ClientLayout>
      {/* OTP */}
      {step === 'otp' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="material-icons" style={{ fontSize: '32px', color: '#016991' }}>description</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>Secure Document</h1>
          <p style={{ color: '#64748b', margin: '0 0 8px 0' }}>
            Your adviser <strong>{MOCK_CLIENT.adviserName}</strong> has shared a document with you.
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
            Verify & View Document
          </button>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Didn't receive a code?{' '}
            <button onClick={() => { setOtpCode(['', '', '', '', '', '']); alert('A new code has been sent'); }}
              style={{ background: 'none', border: 'none', color: '#016991', cursor: 'pointer', fontWeight: 500, padding: 0 }}>Resend</button>
          </p>
        </div>
      )}

      {/* Document View */}
      {(step === 'view' || step === 'downloaded') && (
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>Shared Document</h1>
          <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '15px' }}>
            From {MOCK_CLIENT.adviserName}
          </p>

          {/* Document Card */}
          <div style={{
            border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px',
          }}>
            {/* Document Preview Area */}
            <div style={{
              backgroundColor: '#f8fafc', padding: '40px 20px', textAlign: 'center',
              borderBottom: '1px solid #e2e8f0',
            }}>
              <span className="material-icons" style={{ fontSize: '64px', color: '#ef4444', display: 'block', marginBottom: '8px' }}>picture_as_pdf</span>
              <p style={{ margin: 0, fontWeight: 500, color: '#334155' }}>{MOCK_DOCUMENT.name}</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
                {MOCK_DOCUMENT.pages} pages · {MOCK_DOCUMENT.size}
              </p>
            </div>

            {/* Document Details */}
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Shared on</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>{MOCK_DOCUMENT.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>From</span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>{MOCK_CLIENT.adviserName}</span>
              </div>
            </div>
          </div>

          {step === 'downloaded' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span className="material-icons" style={{ fontSize: '20px', color: '#16a34a' }}>check_circle</span>
                <span style={{ color: '#16a34a', fontWeight: 500 }}>Document downloaded successfully</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>You can close this window now.</p>
            </div>
          ) : (
            <button onClick={() => setStep('downloaded')}
              style={{
                width: '100%', padding: '14px', backgroundColor: '#016991', color: 'white', border: 'none',
                borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
              <span className="material-icons" style={{ fontSize: '20px' }}>download</span>
              Download Document
            </button>
          )}
        </div>
      )}
    </ClientLayout>
  );
}
