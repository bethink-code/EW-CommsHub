'use client';

import { DEMO_CLIENT } from './client-demo-data';
import '../info-request/info-request.css';

interface ClientDemoLoginProps {
  onLogin: () => void;
}

export default function ClientDemoLogin({ onLogin }: ClientDemoLoginProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f6f8',
      padding: '32px',
    }}>
      <div className="journey-screen" style={{ maxWidth: 420 }}>
        {/* Brand */}
        <div className="journey-screen-brand">
          <span className="brand-elite">ELITE</span>
          <span className="brand-wealth"> WEALTH</span>
        </div>

        <h2 className="journey-screen-title">Welcome Back</h2>
        <p className="journey-screen-subtitle">
          Sign in to access your Wealth Portal
        </p>

        {/* Email */}
        <div className="journey-form-field-full" style={{ textAlign: 'left', marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
            Email
          </label>
          <input
            type="email"
            value={DEMO_CLIENT.email}
            readOnly
            className="journey-password-input"
            style={{ backgroundColor: '#f8fafc', width: '100%', padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 14, color: '#111827' }}
          />
        </div>

        {/* Password */}
        <div className="journey-form-field-full" style={{ textAlign: 'left', marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Enter your password"
              defaultValue="demo12345"
              className="journey-password-input"
              style={{ width: '100%', padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 14, color: '#111827', paddingRight: 40 }}
            />
            <button
              type="button"
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4,
              }}
            >
              <span className="material-icons-outlined" style={{ fontSize: 18 }}>visibility</span>
            </button>
          </div>
        </div>

        <div className="journey-forgot-password" style={{ textAlign: 'right', marginBottom: 24 }}>
          <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 13, color: '#016991', textDecoration: 'none' }}>
            Forgot password?
          </a>
        </div>

        <button className="journey-screen-button" onClick={onLogin}>
          Sign In
        </button>

        <div className="journey-login-divider" style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: '#6b7280', fontSize: 13 }}>
          <span style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <span>or continue with</span>
          <span style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', border: '1px solid #e5e7eb', borderRadius: 8,
            background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151',
          }}>
            <span className="material-icons-outlined" style={{ fontSize: 20 }}>fingerprint</span>
            Biometrics
          </button>
        </div>
      </div>
    </div>
  );
}
