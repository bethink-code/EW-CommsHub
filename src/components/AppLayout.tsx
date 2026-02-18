'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlobalNotesProvider, GlobalNotes } from './GlobalNotes';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  const tabs = [
    { id: 'comms-hub', label: 'Comms Hub', href: '/comms-hub' },
    { id: 'activity-dashboard', label: 'Activity dashboard', href: '/activity-dashboard' },
    { id: 'work-portal', label: 'Work portal', href: '/work-portal' },
    { id: 'client-info', label: 'Client info', href: '/client-info' },
    { id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
    { id: 'assets-liabilities', label: 'Assets and liabilities', href: '/assets-liabilities' },
    { id: 'budget', label: 'Budget', href: '/budget' },
    { id: 'financial-planning', label: 'Financial planning', href: '/financial-planning' },
    { id: 'bna', label: 'Bna', href: '/bna' },
    { id: 'design-sys', label: 'Design sys', href: '/design-sys' },
    { id: 'interactions', label: 'Interactions', href: '/comms-hub/interactions' },
  ];

  // Use startsWith for matching child routes (e.g., /comms-hub/contacts should match /comms-hub)
  const activeTab = tabs.find(tab => pathname.startsWith(tab.href))?.id || 'home';

  return (
    <GlobalNotesProvider>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#EFF2F5', margin: 0, padding: 0 }}>
        {/* Left Sidebar - exactly 64px wide, #094161 */}
        <aside
        style={{
          width: '64px',
          minWidth: '64px',
          backgroundColor: '#094161',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '20px',
        }}
      >
        {/* Elite Wealth Logo Icon - Diamond Shape */}
        <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 198 192" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0)">
              {/* Top triangle - light gray #BCBDC0 */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M178 95.9995H18C18 93.4403 18.9763 90.881 20.9289 88.9284L90.9288 18.9288C94.834 15.0236 101.166 15.0236 105.071 18.9288L175.071 88.9284C177.023 90.881 178 93.4403 178 95.9995Z"
                fill="#BCBDC0"
              />
              {/* Bottom triangle - blue #016991 */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.0013 95.9991L178.001 95.9992C178.001 98.5584 177.025 101.118 175.072 103.07L105.072 173.07C101.167 176.975 94.8353 176.975 90.93 173.07L20.9302 103.07C18.9776 101.118 18.0013 98.5584 18.0013 95.9991Z"
                fill="#016991"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="197.536" height="191.803" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 24px' }}>
        {/* Top Navigation Tab Bar */}
        <nav
          role="tablist"
          style={{
            backgroundColor: '#D4E8F4',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '20px',
            paddingRight: '20px',
            gap: '16px',
          }}
        >
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              role="tab"
              aria-selected={tab.id === activeTab}
              style={{
                padding: '8px 0',
                fontSize: '14px',
                fontWeight: 500,
                color: tab.id === activeTab ? '#014b6a' : '#016991',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease-out',
                whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
                borderBottom: tab.id === activeTab ? '2px solid #016991' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Content Area - stretches to fill remaining space */}
        <div style={{ flex: 1, marginTop: '16px', padding: '0 8px', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </main>

      {/* Global Notes FAB and Modal */}
      <GlobalNotes />
    </div>
    </GlobalNotesProvider>
  );
}
