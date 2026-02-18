'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { NotesButton } from '@/components/GlobalNotes';
import { MOCK_INTERACTIONS, MOCK_CLIENTS, getUnreadAdviserNotificationCount } from '../mock-data';
import {
  Interaction,
  InteractionType,
  INTERACTION_TYPES,
  Client,
} from '@/types/communications';
import '../comms-hub.css';

// =============================================================================
// TYPES
// =============================================================================

type SortField = 'date' | 'type' | 'client';
type SortDirection = 'asc' | 'desc';

// =============================================================================
// COMPONENT
// =============================================================================

export default function InteractionsPage() {
  const unreadNotifCount = useMemo(() => getUnreadAdviserNotificationCount(), []);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | 'all'>('all');
  const [selectedType, setSelectedType] = useState<InteractionType | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);

  // Sort state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Detail panel state
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);

  // Get client lookup map
  const clientMap = useMemo(() => {
    const map: Record<string, Client> = {};
    MOCK_CLIENTS.forEach(c => {
      map[c.id] = c;
    });
    return map;
  }, []);

  // Get unique interaction types in the data
  const usedTypes = useMemo(() => {
    const types = new Set(MOCK_INTERACTIONS.map(i => i.type));
    return Array.from(types) as InteractionType[];
  }, []);

  // Summary stats
  const stats = useMemo(() => {
    const byType: Record<string, number> = {};
    MOCK_INTERACTIONS.forEach(i => {
      byType[i.type] = (byType[i.type] || 0) + 1;
    });

    const uniqueClients = new Set(MOCK_INTERACTIONS.map(i => i.clientId)).size;
    const withDocs = MOCK_INTERACTIONS.filter(i => i.documentsAttached > 0).length;
    const thisWeek = MOCK_INTERACTIONS.filter(i => {
      const daysDiff = Math.floor((Date.now() - i.interactionDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).length;

    return {
      total: MOCK_INTERACTIONS.length,
      uniqueClients,
      withDocs,
      thisWeek,
      byType,
    };
  }, []);

  // Filter interactions
  const filteredInteractions = useMemo(() => {
    let filtered = [...MOCK_INTERACTIONS];

    // Exclude deleted unless checkbox is checked
    if (!includeDeleted) {
      filtered = filtered.filter(i => !i.isDeleted);
    }

    // Client filter
    if (selectedClientId !== 'all') {
      filtered = filtered.filter(i => i.clientId === selectedClientId);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(i => i.type === selectedType);
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(i => i.interactionDate >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(i => i.interactionDate <= toDate);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i => {
        const client = clientMap[i.clientId];
        const clientName = client ? `${client.firstName} ${client.lastName}`.toLowerCase() : '';
        return (
          clientName.includes(query) ||
          i.description.toLowerCase().includes(query) ||
          i.details?.toLowerCase().includes(query) ||
          INTERACTION_TYPES[i.type].label.toLowerCase().includes(query)
        );
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = a.interactionDate.getTime() - b.interactionDate.getTime();
          break;
        case 'type':
          comparison = INTERACTION_TYPES[a.type].label.localeCompare(INTERACTION_TYPES[b.type].label);
          break;
        case 'client':
          const clientA = clientMap[a.clientId];
          const clientB = clientMap[b.clientId];
          const nameA = clientA ? `${clientA.firstName} ${clientA.lastName}` : '';
          const nameB = clientB ? `${clientB.firstName} ${clientB.lastName}` : '';
          comparison = nameA.localeCompare(nameB);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, selectedClientId, selectedType, dateFrom, dateTo, includeDeleted, sortField, sortDirection, clientMap]);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setSelectedClientId('all');
    setSelectedType('all');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    setIncludeDeleted(false);
  };

  const hasActiveFilters = selectedClientId !== 'all' || selectedType !== 'all' || dateFrom || dateTo || searchQuery;

  // Format date helper
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="material-icons sort-icon">unfold_more</span>;
    }
    return (
      <span className="material-icons sort-icon active">
        {sortDirection === 'asc' ? 'expand_less' : 'expand_more'}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="comms-dashboard">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Communications Hub</h1>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <NotesButton />
            <button className="btn btn-primary" onClick={() => alert('Add interaction form coming soon')}>
              <span className="material-icons">add</span>
              Add Interaction
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="tabs">
          <Link href="/comms-hub" className="tab">
            Communications
          </Link>
          <Link href="/comms-hub/notifications" className="tab">
            Notifications
            {unreadNotifCount > 0 && <span className="tab-badge">{unreadNotifCount}</span>}
          </Link>
          <Link href="/comms-hub/demo-flows" className="tab">
            Demo Flows
          </Link>
          <Link href="/comms-hub/relationships" className="tab">
            Relationships
          </Link>
          <Link href="/comms-hub/interactions" className="tab active">
            Interactions
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

        {/* Section Header */}
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, margin: 0 }}>Interaction History</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            View and manage all client interactions. This is the existing communications log from the current system.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-card-value">{stats.total}</span>
            <span className="summary-card-label">Total Interactions</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-value">{stats.uniqueClients}</span>
            <span className="summary-card-label">Clients</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-value">{stats.thisWeek}</span>
            <span className="summary-card-label">This Week</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-value">{stats.withDocs}</span>
            <span className="summary-card-label">With Documents</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar-container" style={{ flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
          <span className="filter-label">Filter:</span>

          {/* Client Dropdown */}
          <div className="filter-dropdown-group">
            <button
              className={`filter-dropdown ${selectedClientId !== 'all' ? 'has-value' : ''}`}
            >
              {selectedClientId !== 'all' && <span className="filter-indicator type" />}
              Client
              <span className="material-icons">expand_more</span>
            </button>
            <div className="filter-dropdown-menu">
              <button className={selectedClientId === 'all' ? 'active' : ''} onClick={() => setSelectedClientId('all')}>
                All Clients
              </button>
              {MOCK_CLIENTS.slice(0, 10).map(client => (
                <button
                  key={client.id}
                  className={selectedClientId === client.id ? 'active' : ''}
                  onClick={() => setSelectedClientId(client.id)}
                >
                  {client.firstName} {client.lastName}
                </button>
              ))}
            </div>
          </div>

          {/* Type Dropdown */}
          <div className="filter-dropdown-group">
            <button
              className={`filter-dropdown ${selectedType !== 'all' ? 'has-value' : ''}`}
            >
              {selectedType !== 'all' && <span className="filter-indicator type" />}
              Type
              <span className="material-icons">expand_more</span>
            </button>
            <div className="filter-dropdown-menu" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <button className={selectedType === 'all' ? 'active' : ''} onClick={() => setSelectedType('all')}>
                All Types
              </button>
              {usedTypes.map(type => (
                <button
                  key={type}
                  className={selectedType === type ? 'active' : ''}
                  onClick={() => setSelectedType(type)}
                >
                  <span className="material-icons" style={{ fontSize: '16px', marginRight: '6px' }}>
                    {INTERACTION_TYPES[type].icon}
                  </span>
                  {INTERACTION_TYPES[type].label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="filter-date-input"
              style={{
                padding: '6px 10px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
              }}
            />
            <span style={{ color: 'var(--color-text-muted)' }}>to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="filter-date-input"
              style={{
                padding: '6px 10px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
              }}
            />
          </div>

          {/* Include Deleted Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(e) => setIncludeDeleted(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            Include deleted
          </label>

          <div className="filter-spacer" />

          {/* Actions */}
          <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => alert('Report feature coming soon')}>
            <span className="material-icons" style={{ fontSize: '18px' }}>summarize</span>
            Report
          </button>
          <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => window.location.reload()}>
            <span className="material-icons" style={{ fontSize: '18px' }}>refresh</span>
          </button>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="active-filters-row">
            {selectedClientId !== 'all' && (
              <span className="filter-chip type">
                {clientMap[selectedClientId] ? `${clientMap[selectedClientId].firstName} ${clientMap[selectedClientId].lastName}` : selectedClientId}
                <button onClick={() => setSelectedClientId('all')} className="chip-clear">×</button>
              </span>
            )}
            {selectedType !== 'all' && (
              <span className="filter-chip type">
                {INTERACTION_TYPES[selectedType].label}
                <button onClick={() => setSelectedType('all')} className="chip-clear">×</button>
              </span>
            )}
            {dateFrom && (
              <span className="filter-chip stage">
                From: {dateFrom}
                <button onClick={() => setDateFrom('')} className="chip-clear">×</button>
              </span>
            )}
            {dateTo && (
              <span className="filter-chip stage">
                To: {dateTo}
                <button onClick={() => setDateTo('')} className="chip-clear">×</button>
              </span>
            )}
            <button className="clear-all-link" onClick={clearFilters}>Clear all</button>
          </div>
        )}

        {/* Main Content */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          {/* Table */}
          <div className="card" style={{ flex: selectedInteraction ? '1 1 60%' : '1 1 100%' }}>
            <div className="table-toolbar">
              <div className="search-container">
                <span className="material-icons search-icon">search</span>
                <input
                  type="text"
                  placeholder="Search interactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => setSearchQuery('')} title="Clear search">
                    <span className="material-icons">close</span>
                  </button>
                )}
              </div>
            </div>

            <div className="table-container">
              <table className="comms-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSort('client')} style={{ width: '180px' }}>
                      Entity <SortIcon field="client" />
                    </th>
                    <th className="sortable" onClick={() => handleSort('type')} style={{ width: '160px' }}>
                      Interaction Type <SortIcon field="type" />
                    </th>
                    <th>Description</th>
                    <th style={{ width: '60px', textAlign: 'center' }}>Docs</th>
                    <th className="sortable" onClick={() => handleSort('date')} style={{ width: '110px' }}>
                      Date <SortIcon field="date" />
                    </th>
                    <th style={{ width: '120px' }}>Created By</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInteractions.map((interaction) => {
                    const client = clientMap[interaction.clientId];
                    return (
                      <tr
                        key={interaction.id}
                        className={`clickable-row ${selectedInteraction?.id === interaction.id ? 'selected' : ''}`}
                        onClick={() => setSelectedInteraction(interaction)}
                        style={selectedInteraction?.id === interaction.id ? { backgroundColor: 'var(--color-primary-50)' } : undefined}
                      >
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              {client ? `${client.firstName[0]}${client.lastName[0]}` : '?'}
                            </div>
                            <span style={{ fontWeight: 500 }}>
                              {client ? `${client.firstName} ${client.lastName}` : 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                            <span className="material-icons" style={{ fontSize: '16px', color: 'var(--color-text-muted)' }}>
                              {INTERACTION_TYPES[interaction.type].icon}
                            </span>
                            {INTERACTION_TYPES[interaction.type].label}
                          </span>
                        </td>
                        <td style={{ color: 'var(--color-text-secondary)' }}>
                          {interaction.description}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {interaction.documentsAttached > 0 ? (
                            <span className="badge badge-primary">{interaction.documentsAttached}</span>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                          )}
                        </td>
                        <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          {formatDate(interaction.interactionDate)}
                        </td>
                        <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          {interaction.createdBy}
                        </td>
                        <td>
                          <span className="material-icons" style={{ color: 'var(--color-text-muted)', fontSize: '20px' }}>
                            chevron_right
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredInteractions.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                        <span className="material-icons" style={{ fontSize: '40px', display: 'block', marginBottom: 'var(--spacing-sm)', opacity: 0.5 }}>
                          history
                        </span>
                        No interactions found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Results count */}
            <div style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-muted)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderTop: '1px solid var(--color-border)',
            }}>
              Showing {filteredInteractions.length} of {MOCK_INTERACTIONS.length} interactions
            </div>
          </div>

          {/* Detail Panel */}
          {selectedInteraction && (
            <div className="card" style={{ flex: '0 0 380px', alignSelf: 'flex-start' }}>
              <div className="card-header" style={{
                padding: 'var(--spacing-md)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, margin: 0 }}>
                  Interaction Detail
                </h3>
                <button
                  onClick={() => setSelectedInteraction(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div style={{ padding: 'var(--spacing-md)' }}>
                {/* Client */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                    Client
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      {clientMap[selectedInteraction.clientId] ?
                        `${clientMap[selectedInteraction.clientId].firstName[0]}${clientMap[selectedInteraction.clientId].lastName[0]}` : '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {clientMap[selectedInteraction.clientId] ?
                          `${clientMap[selectedInteraction.clientId].firstName} ${clientMap[selectedInteraction.clientId].lastName}` : 'Unknown'}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        {clientMap[selectedInteraction.clientId]?.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Type */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                    Interaction Type
                  </label>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <span className="material-icons" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>
                      {INTERACTION_TYPES[selectedInteraction.type].icon}
                    </span>
                    <span style={{ fontWeight: 500 }}>{INTERACTION_TYPES[selectedInteraction.type].label}</span>
                  </span>
                </div>

                {/* Date */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                    Interaction Date
                  </label>
                  <span>{formatDate(selectedInteraction.interactionDate)}</span>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                    Description
                  </label>
                  <span style={{ fontWeight: 500 }}>{selectedInteraction.description}</span>
                </div>

                {/* Details */}
                {selectedInteraction.details && (
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                      Details
                    </label>
                    <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      {selectedInteraction.details}
                    </p>
                  </div>
                )}

                {/* Documents */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                    Documents Attached
                  </label>
                  {selectedInteraction.documentsAttached > 0 ? (
                    <span className="badge badge-primary">{selectedInteraction.documentsAttached} document{selectedInteraction.documentsAttached > 1 ? 's' : ''}</span>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>No documents</span>
                  )}
                </div>

                {/* Audit Info */}
                <div style={{
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: 'var(--spacing-md)',
                  marginTop: 'var(--spacing-md)',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block' }}>Created By</label>
                      <span>{selectedInteraction.createdBy}</span>
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block' }}>Date Loaded</label>
                      <span>{formatDate(selectedInteraction.dateLoaded)}</span>
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block' }}>Last Modified By</label>
                      <span>{selectedInteraction.lastModifiedBy}</span>
                    </div>
                    <div>
                      <label style={{ color: 'var(--color-text-muted)', display: 'block' }}>Last Modified</label>
                      <span>{formatDate(selectedInteraction.lastModifiedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => alert('Edit interaction coming soon')}>
                    <span className="material-icons" style={{ fontSize: '18px' }}>edit</span>
                    Edit
                  </button>
                  <button className="btn btn-secondary" onClick={() => alert('View audit trail coming soon')}>
                    <span className="material-icons" style={{ fontSize: '18px' }}>history</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
