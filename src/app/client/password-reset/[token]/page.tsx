'use client';

import { useState } from 'react';
import ClientLayout from '@/components/ClientLayout';

type FlowStep = 'form' | 'complete';

interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string, confirmPassword?: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { id: 'length', label: 'At least 8 characters', validator: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', validator: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'One lowercase letter', validator: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'One number', validator: (p) => /[0-9]/.test(p) },
  { id: 'match', label: 'Passwords match', validator: (p, c) => p.length > 0 && p === c },
];

export default function PasswordResetClientPage() {
  const [step, setStep] = useState<FlowStep>('form');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkRequirement = (req: PasswordRequirement) => req.validator(password, confirmPassword);
  const allRequirementsMet = PASSWORD_REQUIREMENTS.every(req => checkRequirement(req));

  const handleResetPassword = async () => {
    if (!allRequirementsMet) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep('complete');
  };

  const inputContainerStyle: React.CSSProperties = { position: 'relative' };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 44px 12px 16px', border: '1px solid #e2e8f0',
    borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box', outline: 'none',
  };
  const toggleStyle: React.CSSProperties = {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', display: 'flex',
  };

  return (
    <ClientLayout>
      {/* Password Form - no OTP needed, the link itself is verification */}
      {step === 'form' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <span className="material-icons" style={{ fontSize: '32px', color: '#d97706' }}>lock_reset</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>Reset Your Password</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
              Enter a new password for your Elite Wealth account.
            </p>
          </div>

          <div style={{ backgroundColor: '#fffbeb', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-icons" style={{ fontSize: '18px', color: '#d97706' }}>schedule</span>
            <span style={{ fontSize: '13px', color: '#92400e' }}>This link expires in 24 hours</span>
          </div>

          {/* New Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>New Password</label>
            <div style={inputContainerStyle}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password" style={inputStyle} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleStyle}>
                <span className="material-icons" style={{ fontSize: '20px' }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Confirm Password</label>
            <div style={inputContainerStyle}>
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password" style={inputStyle} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={toggleStyle}>
                <span className="material-icons" style={{ fontSize: '20px' }}>{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {/* Requirements */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: '0 0 12px 0' }}>Password Requirements</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PASSWORD_REQUIREMENTS.map((req) => {
                const isMet = checkRequirement(req);
                return (
                  <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      border: `2px solid ${isMet ? '#16a34a' : '#cbd5e1'}`,
                      backgroundColor: isMet ? '#16a34a' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isMet && <span className="material-icons" style={{ fontSize: '12px', color: 'white' }}>check</span>}
                    </div>
                    <span style={{ fontSize: '13px', color: isMet ? '#16a34a' : '#64748b' }}>{req.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={handleResetPassword} disabled={!allRequirementsMet || isSubmitting}
            style={{
              width: '100%', padding: '14px', backgroundColor: allRequirementsMet ? '#016991' : '#94a3b8',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600,
              cursor: allRequirementsMet ? 'pointer' : 'not-allowed',
            }}>
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </div>
      )}

      {/* Success */}
      {step === 'complete' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="material-icons" style={{ fontSize: '40px', color: '#16a34a' }}>check_circle</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#1e293b' }}>Password Reset Complete</h1>
          <p style={{ color: '#64748b', margin: '0 0 32px 0' }}>
            Your password has been successfully updated. You can now log in to the Wealth Portal with your new password.
          </p>
          <button onClick={() => alert('This would open the Wealth Portal login')}
            style={{
              width: '100%', padding: '14px', backgroundColor: '#016991', color: 'white', border: 'none',
              borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px',
            }}>
            <span className="material-icons" style={{ fontSize: '18px' }}>login</span>
            Go to Login
          </button>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>You can close this window now.</p>
        </div>
      )}
    </ClientLayout>
  );
}
