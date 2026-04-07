'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { NotesButton } from '@/components/GlobalNotes';
import { getUnreadAdviserNotificationCount } from '../mock-data';
import { COMM_TYPE_CONFIGS, CHANNELS, Channel } from '@/types/communications';
import { MESSAGE_TEMPLATES, TemplateKey } from '@/lib/comm-flow/templates';
import '../comms-hub.css';
import './templates.css';

// =============================================================================
// TYPES
// =============================================================================

interface MetaTemplateData {
  name: string;
  status: string;
  category: string;
  language: string;
  body: string;
  parameters: string[];
  mappedCommType: string | null;
  mappedParameterOrder: string[] | null;
}

// =============================================================================
// HELPERS
// =============================================================================

/** Comm types that have WhatsApp templates in our system */
const WHATSAPP_COMMTYPES = Object.entries(COMM_TYPE_CONFIGS)
  .filter(([, config]) => config.channels.includes('whatsapp'))
  .map(([id, config]) => ({ id, name: config.name, icon: config.icon }));

function getStatusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'APPROVED': return 'template-status-approved';
    case 'PENDING': return 'template-status-pending';
    case 'REJECTED': return 'template-status-rejected';
    default: return 'template-status-pending';
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CommsHubTemplates() {
  const unreadNotifCount = useMemo(() => getUnreadAdviserNotificationCount(), []);
  const [activeTab, setActiveTab] = useState<'internal' | 'whatsapp'>('whatsapp');
  const [metaTemplates, setMetaTemplates] = useState<MetaTemplateData[]>([]);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const fetchMetaTemplates = useCallback(async () => {
    setMetaLoading(true);
    setMetaError(null);
    try {
      const res = await fetch('/api/whatsapp/templates');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch templates');
      }
      const data = await res.json();
      setMetaTemplates((data.templates || []).filter((t: MetaTemplateData) => t.name.startsWith('ew_')));
    } catch (error) {
      setMetaError(error instanceof Error ? error.message : 'Failed to fetch templates');
    } finally {
      setMetaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'whatsapp') {
      fetchMetaTemplates();
    }
  }, [activeTab, fetchMetaTemplates]);

  return (
    <AppLayout>
      <div className="comms-dashboard">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Communications Hub</h1>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <NotesButton />
            <Link href="/comms-hub/send" className="btn btn-primary">
              <span className="material-icons-outlined">add</span>
              New Message
            </Link>
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="tabs">
          <Link href="/comms-hub" className="tab">Communications</Link>
          <Link href="/comms-hub/notifications" className="tab">
            Notifications
            {unreadNotifCount > 0 && <span className="tab-badge">{unreadNotifCount}</span>}
          </Link>
          <Link href="/comms-hub/demo-flows" className="tab">Demo Flows</Link>
          <Link href="/comms-hub/relationships" className="tab">Contact Book</Link>
          <Link href="/comms-hub/campaigns" className="tab">Campaigns</Link>
          <Link href="/comms-hub/templates" className="tab active">Templates</Link>
          <Link href="/comms-hub/settings" className="tab">Settings</Link>
          <Link href="/comms-hub/client-demo" className="tab">Client Demo</Link>
          <Link href="/comms-hub/client-context" className="tab">Client Context</Link>
        </nav>

        {/* Templates Sub-tabs */}
        <div className="templates-subtabs">
          <button
            type="button"
            className={`templates-subtab ${activeTab === 'whatsapp' ? 'active' : ''}`}
            onClick={() => setActiveTab('whatsapp')}
          >
            <span className="material-icons-outlined" style={{ fontSize: '16px' }}>chat</span>
            WhatsApp Templates
          </button>
          <button
            type="button"
            className={`templates-subtab ${activeTab === 'internal' ? 'active' : ''}`}
            onClick={() => setActiveTab('internal')}
          >
            <span className="material-icons-outlined" style={{ fontSize: '16px' }}>description</span>
            Internal Templates
          </button>
        </div>

        {/* WhatsApp Templates (Meta Synced) */}
        {activeTab === 'whatsapp' && (
          <div className="templates-section">
            <div className="templates-section-header">
              <div>
                <h2 className="templates-section-title">Meta WhatsApp Templates</h2>
                <p className="templates-section-description">
                  Templates registered with Meta Business Manager. Only approved templates can be used for sending.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={fetchMetaTemplates}
                disabled={metaLoading}
              >
                <span className="material-icons-outlined" style={{ fontSize: '16px' }}>refresh</span>
                {metaLoading ? 'Syncing...' : 'Sync'}
              </button>
            </div>

            {metaError && (
              <div className="templates-error">
                <span className="material-icons-outlined">error_outline</span>
                <div>
                  <strong>Could not load templates</strong>
                  <p>{metaError}</p>
                  <p className="templates-error-hint">
                    Check that WHATSAPP_BUSINESS_ACCOUNT_ID and WHATSAPP_ACCESS_TOKEN are configured.
                  </p>
                </div>
              </div>
            )}

            {metaLoading && !metaTemplates.length && (
              <div className="templates-loading">
                <span className="material-icons-outlined templates-spin">sync</span>
                Fetching templates from Meta...
              </div>
            )}

            {!metaLoading && !metaError && metaTemplates.length === 0 && (
              <div className="templates-empty">
                <span className="material-icons-outlined" style={{ fontSize: '32px', color: 'var(--text-muted)' }}>
                  chat_bubble_outline
                </span>
                <p>No templates found. Register templates in Meta Business Manager to see them here.</p>
              </div>
            )}

            {metaTemplates.length > 0 && (
              <div className="templates-grid">
                {metaTemplates.map(template => (
                  <div
                    key={`${template.name}-${template.language}`}
                    className={`template-card ${expandedTemplate === template.name ? 'expanded' : ''}`}
                  >
                    <div
                      className="template-card-header"
                      onClick={() => setExpandedTemplate(
                        expandedTemplate === template.name ? null : template.name
                      )}
                    >
                      <div className="template-card-title-row">
                        <span className="template-card-name">{template.name}</span>
                        <span className={`template-status-badge ${getStatusBadgeClass(template.status)}`}>
                          {template.status}
                        </span>
                      </div>
                      <div className="template-card-meta">
                        <span className="template-card-language">{template.language}</span>
                        <span className="template-card-category">{template.category}</span>
                        {template.mappedCommType && (
                          <span className="template-card-mapped">
                            <span className="material-icons-outlined" style={{ fontSize: '12px' }}>link</span>
                            {COMM_TYPE_CONFIGS[template.mappedCommType]?.name || template.mappedCommType}
                          </span>
                        )}
                      </div>
                      <span className="material-icons-outlined template-card-chevron">
                        {expandedTemplate === template.name ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>

                    {expandedTemplate === template.name && (
                      <div className="template-card-body">
                        <div className="template-card-preview">
                          <div className="template-preview-label">Template Body</div>
                          <pre className="template-preview-text">{template.body || 'No body text'}</pre>
                        </div>
                        {template.mappedParameterOrder && template.mappedParameterOrder.length > 0 && (
                          <div className="template-card-params">
                            <div className="template-preview-label">Parameter Mapping</div>
                            <div className="template-params-list">
                              {template.mappedParameterOrder.map((param, idx) => (
                                <span key={param} className="template-param-chip">
                                  {`{{${idx + 1}}}`} = {`{${param}}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Internal Templates */}
        {activeTab === 'internal' && (
          <div className="templates-section">
            <div className="templates-section-header">
              <div>
                <h2 className="templates-section-title">Internal Message Templates</h2>
                <p className="templates-section-description">
                  Default templates used when composing messages. These are pre-filled in the compose step.
                </p>
              </div>
            </div>

            <div className="templates-grid">
              {WHATSAPP_COMMTYPES.map(({ id, name, icon }) => {
                const templates = MESSAGE_TEMPLATES[id as TemplateKey];
                if (!templates) return null;

                const channels = Object.keys(templates) as Channel[];

                return (
                  <div
                    key={id}
                    className={`template-card ${expandedTemplate === id ? 'expanded' : ''}`}
                  >
                    <div
                      className="template-card-header"
                      onClick={() => setExpandedTemplate(expandedTemplate === id ? null : id)}
                    >
                      <div className="template-card-title-row">
                        <span className="template-card-icon">
                          <span className="material-icons-outlined" style={{ fontSize: '16px' }}>{icon}</span>
                        </span>
                        <span className="template-card-name">{name}</span>
                        <div className="template-channel-pills">
                          {channels.map(ch => (
                            <span key={ch} className="template-channel-pill">
                              <span className="material-icons-outlined" style={{ fontSize: '12px' }}>
                                {CHANNELS[ch].icon}
                              </span>
                              {CHANNELS[ch].label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="material-icons-outlined template-card-chevron">
                        {expandedTemplate === id ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>

                    {expandedTemplate === id && (
                      <div className="template-card-body">
                        {channels.map(ch => (
                          <div key={ch} className="template-card-preview">
                            <div className="template-preview-label">
                              <span className="material-icons-outlined" style={{ fontSize: '14px' }}>
                                {CHANNELS[ch].icon}
                              </span>
                              {CHANNELS[ch].label}
                            </div>
                            <pre className="template-preview-text">{templates[ch]}</pre>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
