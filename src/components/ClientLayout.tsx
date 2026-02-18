'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface ClientLayoutProps {
  children: ReactNode;
  showBackToAdviser?: boolean;
}

/**
 * Client-facing layout - minimal, mobile-friendly
 * Used for client flows like info requests and portal activation
 */
export default function ClientLayout({ children, showBackToAdviser = true }: ClientLayoutProps) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#094161',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 198 192" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M178 95.9995H18C18 93.4403 18.9763 90.881 20.9289 88.9284L90.9288 18.9288C94.834 15.0236 101.166 15.0236 105.071 18.9288L175.071 88.9284C177.023 90.881 178 93.4403 178 95.9995Z"
                  fill="#BCBDC0"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.0013 95.9991L178.001 95.9992C178.001 98.5584 177.025 101.118 175.072 103.07L105.072 173.07C101.167 176.975 94.8353 176.975 90.93 173.07L20.9302 103.07C18.9776 101.118 18.0013 98.5584 18.0013 95.9991Z"
                  fill="#016991"
                />
              </g>
            </svg>
          </div>
          <span style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#094161',
          }}>
            Elite Wealth
          </span>
        </div>

        {/* Back to Adviser Link (for demo purposes) */}
        {showBackToAdviser && (
          <Link
            href="/comms-hub"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: '#f1f5f9',
            }}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>arrow_back</span>
            Back to Adviser View
          </Link>
        )}
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '480px',
        }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#94a3b8',
        borderTop: '1px solid #e2e8f0',
      }}>
        <p style={{ margin: 0 }}>Powered by Elite Wealth</p>
        <p style={{ margin: '4px 0 0 0' }}>Your information is secure and encrypted</p>
      </footer>
    </div>
  );
}
