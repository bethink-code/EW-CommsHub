'use client';

import { useState } from 'react';

type ActivationStep = 'otp' | 'password' | 'complete';

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

export default function PortalActivatePage() {
  const [step, setStep] = useState<ActivationStep>('otp');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock client data
  const clientData = {
    firstName: 'Peter',
    phone: '+27 82 *** 6717',
    email: 'peter.vdm@gmail.com',
  };

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.join('').length !== 6) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setStep('password');
  };

  // Password validation
  const checkRequirement = (req: PasswordRequirement) => {
    return req.validator(password, confirmPassword);
  };

  const allRequirementsMet = PASSWORD_REQUIREMENTS.every(req => checkRequirement(req));

  const handleCreateAccount = async () => {
    if (!allRequirementsMet) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep('complete');
  };

  // Shared card container style
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    margin: '0 auto',
  };

  // OTP Verification Screen
  if (step === 'otp') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={cardStyle}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700 }}>
              <span style={{ color: '#094161' }}>ELITE</span>
              {' '}
              <span style={{ color: '#016991' }}>WEALTH</span>
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 600,
            color: '#0f172a',
            margin: '0 0 12px 0',
          }}>
            Verify Your Identity
          </h1>

          <p style={{
            textAlign: 'center',
            color: '#64748b',
            margin: '0 0 32px 0',
            fontSize: '15px',
          }}>
            We've sent a one-time code to{' '}
            <span style={{ color: '#016991', fontWeight: 500 }}>{clientData.phone}</span>
          </p>

          {/* OTP Input */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '24px',
          }}>
            {otp.map((digit, index) => (
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
                  fontSize: '20px',
                  fontWeight: 600,
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#016991'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={otp.join('').length !== 6 || isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: otp.join('').length === 6 ? '#016991' : '#94a3b8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed',
              marginBottom: '16px',
            }}
          >
            {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
          </button>

          {/* Resend Link */}
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '14px',
            margin: 0,
          }}>
            Didn't receive a code?{' '}
            <button
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
      </div>
    );
  }

  // Password Creation Screen
  if (step === 'password') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={cardStyle}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700 }}>
              <span style={{ color: '#094161' }}>ELITE</span>
              {' '}
              <span style={{ color: '#016991' }}>WEALTH</span>
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 600,
            color: '#0f172a',
            margin: '0 0 8px 0',
          }}>
            Create Your Password
          </h1>

          <p style={{
            textAlign: 'center',
            color: '#64748b',
            margin: '0 0 32px 0',
            fontSize: '15px',
          }}>
            This password will work for both the web portal and mobile app.
          </p>

          {/* Username (readonly) */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: '#334155',
              marginBottom: '6px',
            }}>
              Username
            </label>
            <input
              type="text"
              value={clientData.email}
              readOnly
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                backgroundColor: '#f8fafc',
                color: '#64748b',
                boxSizing: 'border-box',
              }}
            />
            <p style={{
              fontSize: '13px',
              color: '#016991',
              margin: '6px 0 0 0',
            }}>
              This is your login for the Wealth Portal
            </p>
          </div>

          {/* Create Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: '#334155',
              marginBottom: '6px',
            }}>
              Create Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: '#334155',
              marginBottom: '6px',
            }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <p style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              margin: '0 0 12px 0',
            }}>
              Password Requirements
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PASSWORD_REQUIREMENTS.map((req) => {
                const isMet = checkRequirement(req);
                return (
                  <div key={req.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: `2px solid ${isMet ? '#16a34a' : '#cbd5e1'}`,
                      backgroundColor: isMet ? '#16a34a' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {isMet && (
                        <span className="material-icons" style={{ fontSize: '12px', color: 'white' }}>
                          check
                        </span>
                      )}
                    </div>
                    <span style={{
                      fontSize: '13px',
                      color: isMet ? '#16a34a' : '#64748b',
                    }}>
                      {req.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Create Account Button */}
          <button
            onClick={handleCreateAccount}
            disabled={!allRequirementsMet || isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: allRequirementsMet ? '#016991' : '#94a3b8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: allRequirementsMet ? 'pointer' : 'not-allowed',
            }}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </div>
    );
  }

  // Success Screen
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={cardStyle}>
        {/* Success Icon */}
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
          <span className="material-icons" style={{ fontSize: '32px', color: '#16a34a' }}>
            check
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 600,
          color: '#0f172a',
          margin: '0 0 8px 0',
        }}>
          You're All Set!
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#64748b',
          margin: '0 0 32px 0',
          fontSize: '15px',
        }}>
          Your Wealth Portal account is ready. Access your portfolio anytime, anywhere.
        </p>

        {/* Login Details Box */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '0 0 12px 0',
          }}>
            Your Login Details
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Username</span>
            <span style={{ fontWeight: 500, fontSize: '14px' }}>{clientData.email}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Password</span>
            <span style={{ fontWeight: 500, fontSize: '14px' }}>••••••••</span>
          </div>
        </div>

        {/* Go to Portal Button */}
        <button
          onClick={() => alert('This would open the Wealth Portal')}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#016991',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          <span className="material-icons" style={{ fontSize: '18px' }}>open_in_new</span>
          Go to Wealth Portal
        </button>

        {/* App Store Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
        }}>
          <a
            href="#"
            style={{
              display: 'block',
              backgroundColor: '#000',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div style={{ fontSize: '8px', lineHeight: 1 }}>Download on the</div>
                <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.2 }}>App Store</div>
              </div>
            </div>
          </a>
          <a
            href="#"
            style={{
              display: 'block',
              backgroundColor: '#000',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z" fill="#00D7FF"/>
                <path d="M17.556 8.232l-3.764 3.768 3.764 3.768 4.245-2.422a1 1 0 000-1.692l-4.245-2.422z" fill="#FFDA00"/>
                <path d="M3.609 1.814L13.792 12l3.764-3.768L5.547.58a1.003 1.003 0 00-1.938 1.234z" fill="#00F076"/>
                <path d="M13.792 12L3.609 22.186A1.003 1.003 0 005.547 23.42l12.009-7.652L13.792 12z" fill="#F63448"/>
              </svg>
              <div>
                <div style={{ fontSize: '8px', lineHeight: 1 }}>GET IT ON</div>
                <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.2 }}>Google Play</div>
              </div>
            </div>
          </a>
        </div>

        {/* Back to Adviser Link (for demo) */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a
            href="/comms-hub/portal-invites"
            style={{
              color: '#64748b',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>arrow_back</span>
            Back to Adviser View
          </a>
        </div>
      </div>
    </div>
  );
}
