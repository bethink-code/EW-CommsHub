'use client';

import { useState } from 'react';

type FlowStep = 'otp' | 'upload' | 'complete';

const MOCK_CLIENT = {
  firstName: 'Sarah',
  adviserName: 'Rassie du Preez',
};

const REQUESTED_DOCUMENTS = [
  { id: 'id-document', label: 'ID Document', description: 'South African ID or passport' },
  { id: 'proof-of-address', label: 'Proof of Address', description: 'Utility bill or bank statement (not older than 3 months)' },
  { id: 'bank-statement', label: 'Bank Statement', description: 'Most recent 3 months' },
];

export default function DocumentRequestClientPage() {
  const [step, setStep] = useState<FlowStep>('otp');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});

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
    setStep('upload');
  };

  const handleMockUpload = (docId: string) => {
    // Simulate file selection
    setUploadedDocs(prev => ({ ...prev, [docId]: `${docId}-scan.pdf` }));
  };

  const allUploaded = REQUESTED_DOCUMENTS.every(doc => uploadedDocs[doc.id]);

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    width: '100%', maxWidth: '400px', padding: '40px', margin: '0 auto',
  };

  const logoBlock = (
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <span style={{ fontSize: '20px', fontWeight: 700 }}>
        <span style={{ color: '#094161' }}>ELITE</span>{' '}
        <span style={{ color: '#016991' }}>WEALTH</span>
      </span>
    </div>
  );

  // OTP Screen
  if (step === 'otp') {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          {logoBlock}
          <h1 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 600, color: '#0f172a', margin: '0 0 12px 0' }}>
            Document Upload
          </h1>
          <p style={{ textAlign: 'center', color: '#64748b', margin: '0 0 32px 0', fontSize: '15px' }}>
            We've sent a one-time code to{' '}
            <span style={{ color: '#016991', fontWeight: 500 }}>+27 83 *** 5678</span>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            {otpCode.map((digit, index) => (
              <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                style={{ width: '48px', height: '56px', textAlign: 'center', fontSize: '20px', fontWeight: 600, border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }} />
            ))}
          </div>
          {otpError && <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '14px', margin: '0 0 16px 0' }}>{otpError}</p>}
          <button onClick={verifyOtp}
            style={{ width: '100%', padding: '14px', backgroundColor: '#016991', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginBottom: '16px' }}>
            Verify & Continue
          </button>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
            Didn't receive a code?{' '}
            <button onClick={() => { setOtpCode(['', '', '', '', '', '']); alert('A new code has been sent'); }}
              style={{ background: 'none', border: 'none', color: '#016991', cursor: 'pointer', fontWeight: 500, padding: 0 }}>Resend</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif", padding: '24px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

      {/* Upload */}
      {step === 'upload' && (
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>Upload Documents</h1>
          <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '15px' }}>
            Please upload the following documents requested by {MOCK_CLIENT.adviserName}.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {REQUESTED_DOCUMENTS.map((doc) => {
              const isUploaded = !!uploadedDocs[doc.id];
              return (
                <div key={doc.id} style={{
                  padding: '16px', border: `1px solid ${isUploaded ? '#86efac' : '#e2e8f0'}`,
                  borderRadius: '12px', backgroundColor: isUploaded ? '#f0fdf4' : 'white',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="material-icons" style={{ fontSize: '20px', color: isUploaded ? '#16a34a' : '#94a3b8' }}>
                          {isUploaded ? 'check_circle' : 'description'}
                        </span>
                        <span style={{ fontWeight: 500, color: '#334155' }}>{doc.label}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b', paddingLeft: '28px' }}>{doc.description}</p>
                      {isUploaded && (
                        <p style={{ margin: '4px 0 0 28px', fontSize: '13px', color: '#16a34a' }}>
                          {uploadedDocs[doc.id]} uploaded
                        </p>
                      )}
                    </div>
                    <button onClick={() => handleMockUpload(doc.id)}
                      style={{
                        padding: '8px 16px', border: `1px solid ${isUploaded ? '#16a34a' : '#016991'}`,
                        borderRadius: '6px', background: 'white', color: isUploaded ? '#16a34a' : '#016991',
                        cursor: 'pointer', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap',
                      }}>
                      {isUploaded ? 'Replace' : 'Upload'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ backgroundColor: '#fffbeb', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-icons" style={{ fontSize: '18px', color: '#d97706' }}>info</span>
            <span style={{ fontSize: '13px', color: '#92400e' }}>Accepted formats: PDF, JPG, PNG (max 10MB each)</span>
          </div>

          <button onClick={() => setStep('complete')} disabled={!allUploaded}
            style={{
              width: '100%', padding: '14px', backgroundColor: allUploaded ? '#016991' : '#94a3b8',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600,
              cursor: allUploaded ? 'pointer' : 'not-allowed',
            }}>
            Submit Documents
          </button>
        </div>
      )}

      {/* Complete */}
      {step === 'complete' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="material-icons" style={{ fontSize: '40px', color: '#16a34a' }}>check_circle</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>Documents Submitted!</h1>
          <p style={{ color: '#64748b', margin: '0 0 32px 0' }}>
            Thank you, {MOCK_CLIENT.firstName}. Your documents have been uploaded successfully.
            {MOCK_CLIENT.adviserName} will review them and be in touch if anything further is needed.
          </p>
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0' }}>Uploaded Documents</p>
            {REQUESTED_DOCUMENTS.map((doc) => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span className="material-icons" style={{ fontSize: '16px', color: '#16a34a' }}>check</span>
                <span style={{ fontSize: '14px', color: '#334155' }}>{doc.label}</span>
              </div>
            ))}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>You can close this window now.</p>
        </div>
      )}
      </div>
    </div>
  );
}
