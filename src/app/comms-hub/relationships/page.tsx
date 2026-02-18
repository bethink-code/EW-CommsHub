'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { NotesButton } from '@/components/GlobalNotes';
import { useCommFlows } from '@/contexts/CommFlowsContext';
import { MOCK_CLIENTS, MOCK_COMMUNICATIONS, getWorkQueueStats, getUnreadAdviserNotificationCount } from '../mock-data';
import {
  Client,
  Communication,
  CHANNELS,
  COMMTYPES,
  Health,
  Channel,
  CommtypeId,
  getStageLabel,
  getClientDisplayName,
} from '@/types/communications';
import '../comms-hub.css';

// =============================================================================
// TYPES & HELPERS
// =============================================================================

interface ClientWithStats extends Client {
  activeCount: number;
  overdueCount: number;
  atRiskCount: number;
  lastActivity: Date | null;
  worstHealth: Health;
  communications: Communication[];
}

type ClientSortField = 'name' | 'activity' | 'active';
type CommSortField = 'date' | 'type' | 'stage';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'completed';

function getClientsWithStats(
  clients: Client[],
  communications: Communication[]
): ClientWithStats[] {
  return clients.map(client => {
    const clientComms = communications.filter(c => c.client.id === client.id);
    const activeComms = clientComms.filter(c =>
      !['complete', 'closed', 'expired', 'unsubscribed'].includes(c.stage)
    );

    const overdueCount = activeComms.filter(c => c.health === 'overdue').length;
    const atRiskCount = activeComms.filter(c => c.health === 'at-risk').length;

    let worstHealth: Health = 'on-track';
    if (overdueCount > 0) worstHealth = 'overdue';
    else if (atRiskCount > 0) worstHealth = 'at-risk';

    const sortedComms = [...clientComms].sort((a, b) =>
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
    const lastActivity = sortedComms.length > 0 ? sortedComms[0].updatedAt : null;

    return {
      ...client,
      activeCount: activeComms.length,
      overdueCount,
      atRiskCount,
      lastActivity,
      worstHealth,
      communications: clientComms,
    };
  });
}

function formatRelativeDate(date: Date | null): string {
  if (!date) return 'No activity';
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function getStageBadgeClass(comm: Communication): string {
  if (comm.health === 'overdue') return 'badge-error';
  if (comm.health === 'at-risk') return 'badge-warning';
  if (['complete', 'closed'].includes(comm.stage)) return 'badge-success';
  return 'badge-default';
}

// =============================================================================
// MAIN EXPORT WITH SUSPENSE BOUNDARY
// =============================================================================

export default function RelationshipsPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="comms-dashboard">
          <div className="page-header">
            <h1 className="page-title">Communications Hub</h1>
          </div>
          <nav className="tabs">
            <Link href="/comms-hub" className="tab">Communications</Link>
            <Link href="/comms-hub/demo-flows" className="tab">Demo Flows</Link>
            <span className="tab active">Contact Book</span>
          </nav>
          <div className="section-card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
            <span className="material-icons" style={{ fontSize: '48px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', display: 'block' }}>hourglass_empty</span>
            Loading...
          </div>
        </div>
      </AppLayout>
    }>
      <RelationshipsContent />
    </Suspense>
  );
}

// =============================================================================
// CONTENT COMPONENT (uses useSearchParams)
// =============================================================================

function RelationshipsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unreadNotifCount = useMemo(() => getUnreadAdviserNotificationCount(), []);

  // Selected client state (from URL or user selection)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Initialize from URL param
  useEffect(() => {
    const clientParam = searchParams.get('client');
    if (clientParam) {
      setSelectedClientId(clientParam);
    }
  }, [searchParams]);

  // Client picker state (State A)
  const [clientSearch, setClientSearch] = useState('');
  const [clientSortField, setClientSortField] = useState<ClientSortField>('name');
  const [clientSortDirection, setClientSortDirection] = useState<SortDirection>('asc');

  // Client detail state (State B)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [healthFilter, setHealthFilter] = useState<Health | 'all'>('all');
  const [commtypeFilter, setCommtypeFilter] = useState<CommtypeId | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all');

  // Comm flows context (in-context triggering)
  const { startFlow } = useCommFlows();

  // =============================================================================
  // COMPUTED DATA
  // =============================================================================

  // All clients with stats
  const clientsWithStats = useMemo(() => {
    return getClientsWithStats(MOCK_CLIENTS, MOCK_COMMUNICATIONS);
  }, []);

  // Selected client data
  const selectedClient = useMemo(() => {
    if (!selectedClientId) return null;
    return clientsWithStats.find(c => c.id === selectedClientId) || null;
  }, [selectedClientId, clientsWithStats]);

  // Filtered clients for picker (State A)
  const filteredClients = useMemo(() => {
    let filtered = [...clientsWithStats];

    if (clientSearch) {
      const query = clientSearch.toLowerCase();
      filtered = filtered.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query) ||
        c.phone?.includes(query)
      );
    }

    // Sort by health priority first (overdue clients at top)
    filtered.sort((a, b) => {
      const healthOrder = { 'overdue': 0, 'at-risk': 1, 'on-track': 2 };
      const healthDiff = healthOrder[a.worstHealth] - healthOrder[b.worstHealth];
      if (healthDiff !== 0) return healthDiff;

      let comparison = 0;
      switch (clientSortField) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'activity':
          if (!a.lastActivity && !b.lastActivity) comparison = 0;
          else if (!a.lastActivity) comparison = 1;
          else if (!b.lastActivity) comparison = -1;
          else comparison = b.lastActivity.getTime() - a.lastActivity.getTime();
          break;
        case 'active':
          comparison = b.activeCount - a.activeCount;
          break;
      }
      return clientSortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [clientsWithStats, clientSearch, clientSortField, clientSortDirection]);

  // Client's communications (State B)
  const clientComms = useMemo(() => {
    if (!selectedClient) return [];

    let comms = [...selectedClient.communications];

    // Status filter
    if (statusFilter === 'active') {
      comms = comms.filter(c => !['complete', 'closed', 'expired', 'unsubscribed'].includes(c.stage));
    } else if (statusFilter === 'completed') {
      comms = comms.filter(c => ['complete', 'closed', 'expired', 'unsubscribed'].includes(c.stage));
    }

    // Health filter
    if (healthFilter !== 'all') {
      comms = comms.filter(c => c.health === healthFilter);
    }

    // Commtype filter
    if (commtypeFilter !== 'all') {
      comms = comms.filter(c => c.commtype === commtypeFilter);
    }

    // Stage filter
    if (stageFilter !== 'all') {
      comms = comms.filter(c => c.stage === stageFilter);
    }

    // Channel filter
    if (channelFilter !== 'all') {
      comms = comms.filter(c => c.channels.includes(channelFilter));
    }

    // Sort by date (newest first)
    comms.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return comms;
  }, [selectedClient, statusFilter, healthFilter, commtypeFilter, stageFilter, channelFilter]);

  // Work queue stats for selected client
  const clientWorkQueueStats = useMemo(() => {
    if (!selectedClient) return { newActivity: 0, needsReview: 0, awaitingClient: 0, overdue: 0 };

    const activeComms = selectedClient.communications.filter(c =>
      !['complete', 'closed', 'expired', 'unsubscribed'].includes(c.stage)
    );

    return getWorkQueueStats(activeComms);
  }, [selectedClient]);

  // Check if any filters are active
  const hasActiveFilters = statusFilter !== 'all' || healthFilter !== 'all' || commtypeFilter !== 'all' || stageFilter !== 'all' || channelFilter !== 'all';

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setHealthFilter('all');
    setCommtypeFilter('all');
    setStageFilter('all');
    setChannelFilter('all');
  };

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    // Update URL without full navigation
    router.push(`/comms-hub/relationships?client=${clientId}`, { scroll: false });
  };

  const handleClearClient = () => {
    setSelectedClientId(null);
    clearFilters();
    router.push('/comms-hub/relationships', { scroll: false });
  };

  const handleClientSort = (field: ClientSortField) => {
    if (clientSortField === field) {
      setClientSortDirection(clientSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setClientSortField(field);
      setClientSortDirection('asc');
    }
  };

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const ClientSortIcon = ({ field }: { field: ClientSortField }) => {
    if (clientSortField !== field) {
      return <span className="material-icons sort-icon">unfold_more</span>;
    }
    return (
      <span className="material-icons sort-icon active">
        {clientSortDirection === 'asc' ? 'expand_less' : 'expand_more'}
      </span>
    );
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <AppLayout>
      <div className="comms-dashboard">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Communications Hub</h1>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <NotesButton />
            <Link href="/comms-hub/send" className="btn btn-primary">
              <span className="material-icons">add</span>
              Send New
            </Link>
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="tabs">
          <Link href="/comms-hub" className="tab">
            Communications
          </Link>
          <Link href="/comms-hub/notifications" className="tab">
            Alerts
            {unreadNotifCount > 0 && <span className="tab-badge">{unreadNotifCount}</span>}
          </Link>
          <Link href="/comms-hub/demo-flows" className="tab">
            Demo Flows
          </Link>
          <Link href="/comms-hub/relationships" className="tab active">
            Contact Book
          </Link>
          <Link href="/comms-hub/campaigns" className="tab">
            Campaigns
          </Link>
          <Link href="/comms-hub/templates" className="tab">
            Templates
          </Link>
          <Link href="/comms-hub/settings" className="tab">
            Settings
          </Link>
        </nav>

        {/* =================================================================
            STATE A: CLIENT PICKER (No client selected)
            ================================================================= */}
        {!selectedClient && (
          <>
            {/* Section Card */}
            <div className="section-card">
              <div className="section-card-header">
                <div className="section-card-title">
                  <h2>Select a Contact</h2>
                </div>
              </div>

              {/* Toolbar with Search */}
              <div className="section-card-toolbar" style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ maxWidth: '800px' }}>
                  <label className="text-sm text-muted" style={{ display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                    Choose a client to view their communication history
                  </label>
                  <div className="search-container" style={{ maxWidth: '100%', marginLeft: 0 }}>
                    <span className="material-icons search-icon">search</span>
                    <input
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="search-input"
                      style={{ paddingLeft: 'var(--spacing-base)' }}
                    />
                  {clientSearch && (
                    <button className="search-clear" onClick={() => setClientSearch('')} title="Clear search">
                      <span className="material-icons">close</span>
                    </button>
                  )}
                  </div>
                </div>
              </div>

              {/* Client List */}
              <div className="section-card-content">
                <div className="table-container">
                  <table className="comms-table">
                    <thead>
                      <tr>
                        <th className="sortable" onClick={() => handleClientSort('name')} style={{ width: '160px' }}>
                          Client <ClientSortIcon field="name" />
                        </th>
                        <th style={{ minWidth: '180px' }}>Email</th>
                        <th style={{ width: '120px' }}>Phone</th>
                        <th className="sortable" onClick={() => handleClientSort('active')} style={{ width: '60px', textAlign: 'center' }}>
                          Comms <ClientSortIcon field="active" />
                        </th>
                        <th style={{ width: '80px' }}>Channel</th>
                        <th className="sortable" onClick={() => handleClientSort('activity')} style={{ width: '100px' }}>
                          Last Active <ClientSortIcon field="activity" />
                        </th>
                        <th style={{ width: '40px' }}></th>
                        <th style={{ width: '48px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr
                          key={client.id}
                          className="clickable-row"
                          onClick={() => handleSelectClient(client.id)}
                        >
                          {/* Client Name */}
                          <td className="td-client">
                            {client.firstName} {client.lastName}
                          </td>

                          {/* Email */}
                          <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                            {client.email || '—'}
                          </td>

                          {/* Phone */}
                          <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                            {client.phone || '—'}
                          </td>

                          {/* Communications Count */}
                          <td style={{ textAlign: 'center' }}>
                            {client.activeCount > 0 ? (
                              <span className={`badge badge-${client.worstHealth === 'overdue' ? 'error' : client.worstHealth === 'at-risk' ? 'warning' : 'primary'}`}>
                                {client.activeCount}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                            )}
                          </td>

                          {/* Preferred Channel */}
                          <td className="td-channel">
                            {client.preferredChannel && (
                              <span className="channel-icon" title={CHANNELS[client.preferredChannel].label}>
                                <span className="material-icons-outlined" style={{ fontSize: '16px' }}>
                                  {CHANNELS[client.preferredChannel].icon}
                                </span>
                              </span>
                            )}
                          </td>

                          {/* Last Active */}
                          <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                            {formatRelativeDate(client.lastActivity)}
                          </td>

                          {/* Health Dot */}
                          <td className="td-health">
                            {client.activeCount > 0 && (
                              <span className={`health-dot health-${client.worstHealth}`} title={client.worstHealth === 'on-track' ? 'On Track' : client.worstHealth === 'at-risk' ? 'At Risk' : 'Overdue'}></span>
                            )}
                          </td>

                          {/* Chevron */}
                          <td className="td-action">
                            <button className="btn-icon-md" title="View client">
                              <span className="material-icons-outlined">chevron_right</span>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredClients.length === 0 && (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                            <span className="material-icons-outlined" style={{ fontSize: 'var(--font-size-4xl)', display: 'block', marginBottom: 'var(--spacing-sm)', opacity: 0.5 }}>
                              person_search
                            </span>
                            No clients found matching your search
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              marginTop: 'var(--spacing-sm)',
            }}>
              Showing {filteredClients.length} of {clientsWithStats.length} clients
            </div>
          </>
        )}

        {/* =================================================================
            STATE B: CLIENT DETAIL (Client selected)
            ================================================================= */}
        {selectedClient && (
          <>
            {/* Client Header */}
            <div className="section-card" style={{ marginBottom: 'var(--spacing-md)' }}>
              <div className="section-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <button
                    onClick={handleClearClient}
                    className="btn btn-tertiary"
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', flexShrink: 0 }}
                  >
                    <span className="material-icons-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                    All Clients
                  </button>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      flexShrink: 0,
                    }}
                  >
                    {selectedClient.firstName[0]}{selectedClient.lastName[0]}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)' }}>
                      {selectedClient.firstName} {selectedClient.lastName}
                    </h2>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {selectedClient.email}
                      {selectedClient.phone && ` · ${selectedClient.phone}`}
                      {selectedClient.preferredChannel && (
                        <span style={{ marginLeft: 'var(--spacing-sm)' }}>
                          · Preferred: {CHANNELS[selectedClient.preferredChannel].label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => startFlow({ client: selectedClient })}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', flexShrink: 0 }}
                >
                  <span className="material-icons-outlined" style={{ fontSize: '18px' }}>send</span>
                  Send Message
                </button>
              </div>
            </div>

            {/* Summary Cards for this client */}
            <div className="section-card">
              <div className="section-card-summary">
                <div className="summary-cards-grid cols-4">
                  <div className="summary-card-ref">
                    <span className="summary-card-ref-label">New Activity</span>
                    <span className="summary-card-ref-value">{clientWorkQueueStats.newActivity}</span>
                  </div>
                  <div className="summary-card-ref">
                    <span className="summary-card-ref-label">Needs Review</span>
                    <span className="summary-card-ref-value">{clientWorkQueueStats.needsReview}</span>
                  </div>
                  <div className="summary-card-ref">
                    <span className="summary-card-ref-label">Awaiting Client</span>
                    <span className="summary-card-ref-value">{clientWorkQueueStats.awaitingClient}</span>
                  </div>
                  <div className="summary-card-ref">
                    <span className="summary-card-ref-label">Overdue</span>
                    <span className="summary-card-ref-value">{clientWorkQueueStats.overdue}</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="section-card-toolbar">
                <div className="filter-bar-inline">
                  <span className="filter-label">Filter:</span>

                  {/* Status Filter Dropdown */}
                  <div className="filter-dropdown-group">
                    <button
                      className={`filter-dropdown ${statusFilter !== 'all' ? 'has-value' : ''}`}
                    >
                      {statusFilter !== 'all' && <span className="filter-indicator type" />}
                      Status
                      <span className="material-icons">expand_more</span>
                    </button>
                    <div className="filter-dropdown-menu">
                      <button className={statusFilter === 'all' ? 'active' : ''} onClick={() => setStatusFilter('all')}>All</button>
                      <button className={statusFilter === 'active' ? 'active' : ''} onClick={() => setStatusFilter('active')}>Active Only</button>
                      <button className={statusFilter === 'completed' ? 'active' : ''} onClick={() => setStatusFilter('completed')}>Completed Only</button>
                    </div>
                  </div>

                  {/* Type Filter Dropdown */}
                  <div className="filter-dropdown-group">
                    <button
                      className={`filter-dropdown ${commtypeFilter !== 'all' ? 'has-value' : ''}`}
                    >
                      {commtypeFilter !== 'all' && <span className="filter-indicator type" />}
                      Type
                      <span className="material-icons">expand_more</span>
                    </button>
                    <div className="filter-dropdown-menu">
                      <button className={commtypeFilter === 'all' ? 'active' : ''} onClick={() => { setCommtypeFilter('all'); setStageFilter('all'); }}>All Types</button>
                      {(Object.keys(COMMTYPES) as CommtypeId[]).map(id => (
                        <button key={id} className={commtypeFilter === id ? 'active' : ''} onClick={() => { setCommtypeFilter(id); setStageFilter('all'); }}>
                          {COMMTYPES[id].name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stage Filter Dropdown - only when Type is selected */}
                  {commtypeFilter !== 'all' && (
                    <div className="filter-dropdown-group">
                      <button
                        className={`filter-dropdown ${stageFilter !== 'all' ? 'has-value' : ''}`}
                      >
                        {stageFilter !== 'all' && <span className="filter-indicator stage" />}
                        Stage
                        <span className="material-icons">expand_more</span>
                      </button>
                      <div className="filter-dropdown-menu">
                        <button className={stageFilter === 'all' ? 'active' : ''} onClick={() => setStageFilter('all')}>All Stages</button>
                        {COMMTYPES[commtypeFilter].stages.map(stageDef => (
                          <button key={stageDef.id} className={stageFilter === stageDef.id ? 'active' : ''} onClick={() => setStageFilter(stageDef.id)}>
                            {stageDef.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Filter Chips */}
                  {statusFilter !== 'all' && (
                    <span className="filter-chip type">
                      {statusFilter === 'active' ? 'Active' : 'Completed'}
                      <button onClick={() => setStatusFilter('all')} className="chip-clear">×</button>
                    </span>
                  )}
                  {commtypeFilter !== 'all' && (
                    <span className="filter-chip type">
                      {COMMTYPES[commtypeFilter].name}
                      <button onClick={() => { setCommtypeFilter('all'); setStageFilter('all'); }} className="chip-clear">×</button>
                    </span>
                  )}
                  {stageFilter !== 'all' && commtypeFilter !== 'all' && (
                    <span className="filter-chip stage">
                      {getStageLabel(commtypeFilter, stageFilter)}
                      <button onClick={() => setStageFilter('all')} className="chip-clear">×</button>
                    </span>
                  )}
                  {hasActiveFilters && (
                    <button className="filter-chip clear-all" onClick={clearFilters}>
                      Clear all
                      <span className="chip-clear">×</span>
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                    {clientComms.length} communication{clientComms.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Communications Table */}
              <div className="section-card-content">
                <div className="table-container">
                  <table className="comms-table">
                    <thead>
                      <tr>
                        <th style={{ minWidth: '200px' }}>Subject</th>
                        <th style={{ width: '140px' }}>Type</th>
                        <th style={{ width: '80px' }}>Channel</th>
                        <th style={{ width: '120px' }}>Stage</th>
                        <th style={{ width: '100px' }}>Date</th>
                        <th style={{ width: '40px' }}></th>
                        <th style={{ width: '48px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientComms.map((comm) => (
                        <tr
                          key={comm.id}
                          className="clickable-row"
                          onClick={() => router.push(`/comms-hub/communication/${comm.id}`)}
                        >
                          {/* Subject */}
                          <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            {comm.subject || '—'}
                          </td>

                          {/* Type */}
                          <td className="td-type">
                            {COMMTYPES[comm.commtype].name}
                          </td>

                          {/* Channel */}
                          <td>
                            {comm.channels.map((ch) => (
                              <span key={ch} className="channel-icon" title={CHANNELS[ch].label}>
                                <span className="material-icons-outlined" style={{ fontSize: '16px' }}>{CHANNELS[ch].icon}</span>
                              </span>
                            ))}
                          </td>

                          {/* Stage */}
                          <td>
                            <span className={`badge ${getStageBadgeClass(comm)}`}>
                              {getStageLabel(comm.commtype, comm.stage)}
                            </span>
                          </td>

                          {/* Date */}
                          <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            {formatDate(comm.createdAt)}
                          </td>

                          {/* Health Dot */}
                          <td className="td-health">
                            {!['complete', 'closed', 'expired', 'unsubscribed'].includes(comm.stage) && (
                              <span className={`health-dot health-${comm.health}`} title={comm.health === 'on-track' ? 'On Track' : comm.health === 'at-risk' ? 'At Risk' : 'Overdue'}></span>
                            )}
                          </td>

                          {/* Chevron */}
                          <td className="td-action">
                            <button className="btn-icon-md" title="View details">
                              <span className="material-icons-outlined">chevron_right</span>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {clientComms.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                            <span className="material-icons" style={{ fontSize: 'var(--font-size-4xl)', display: 'block', marginBottom: 'var(--spacing-sm)', opacity: 0.5 }}>
                              mail_outline
                            </span>
                            No communications found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
