'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { NotesButton } from '@/components/GlobalNotes';
import { useCommFlows } from '@/contexts/CommFlowsContext';
import { useCommunications } from '@/contexts/CommunicationsContext';
import {
  Communication,
  CommtypeId,
  Health,
  COMMTYPES,
  CHANNELS,
  HEALTH_CONFIG,
  getStageLabel,
  getClientDisplayName,
} from '@/types/communications';
import {
  getHealthCounts,
  getStageCounts,
  getWorkQueueStats,
  getUnreadAdviserNotificationCount,
  getNotificationsForComm,
} from './mock-data';
import './comms-hub.css';

// =============================================================================
// TYPES
// =============================================================================

type HealthFilter = 'all' | Health;
type WorkQueueFilter = 'all' | 'newActivity' | 'needsReview' | 'awaitingClient' | 'overdue';
type SortField = 'client' | 'type' | 'stage' | 'days' | 'date';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'compact' | 'cards';

// =============================================================================
// COMPONENT
// =============================================================================

export default function MessageCentre() {
  const router = useRouter();
  const { startFlow } = useCommFlows();
  const { communications: allCommunications, recentlyAdded } = useCommunications();

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('compact');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [commtypeFilter, setCommtypeFilter] = useState<CommtypeId | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<HealthFilter>('all');
  const [workQueueFilter, setWorkQueueFilter] = useState<WorkQueueFilter>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // Sort state
  const [sortField, setSortField] = useState<SortField>('days');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // =============================================================================
  // COMPUTED DATA
  // =============================================================================

  // Communications (optionally include completed)
  const activeComms = useMemo(() => {
    if (showCompleted) {
      return allCommunications;
    }
    return allCommunications.filter(c => {
      const terminalStages = ['complete', 'closed', 'expired', 'unsubscribed'];
      return !terminalStages.includes(c.stage);
    });
  }, [showCompleted, allCommunications]);

  // Health stats
  const healthStats = useMemo(() => {
    const counts = getHealthCounts(activeComms);
    return {
      total: activeComms.length,
      'on-track': counts['on-track'] || 0,
      'at-risk': counts['at-risk'] || 0,
      'overdue': counts['overdue'] || 0,
    };
  }, [activeComms]);

  // Work queue stats
  const workQueueStats = useMemo(() => {
    return getWorkQueueStats(activeComms);
  }, [activeComms]);

  // Commtype stats
  const commtypeStats = useMemo(() => {
    const stats: Record<CommtypeId, { total: number; overdue: number; atRisk: number }> = {} as Record<CommtypeId, { total: number; overdue: number; atRisk: number }>;
    const commtypeIds = Object.keys(COMMTYPES) as CommtypeId[];

    commtypeIds.forEach(id => {
      const typeComms = activeComms.filter(c => c.commtype === id);
      stats[id] = {
        total: typeComms.length,
        overdue: typeComms.filter(c => c.health === 'overdue').length,
        atRisk: typeComms.filter(c => c.health === 'at-risk').length,
      };
    });

    return stats;
  }, [activeComms]);

  // Stage counts for selected commtype
  const stageCounts = useMemo(() => {
    if (commtypeFilter === 'all') return {};
    return getStageCounts(activeComms, commtypeFilter);
  }, [activeComms, commtypeFilter]);

  // Filtered communications
  const filteredComms = useMemo(() => {
    return activeComms.filter(comm => {
      // Search filter
      if (searchQuery) {
        const clientName = getClientDisplayName(comm.client).toLowerCase();
        const commtypeName = COMMTYPES[comm.commtype].name.toLowerCase();
        const query = searchQuery.toLowerCase();
        if (!clientName.includes(query) && !commtypeName.includes(query)) {
          return false;
        }
      }

      // Commtype filter
      if (commtypeFilter !== 'all' && comm.commtype !== commtypeFilter) {
        return false;
      }

      // Stage filter
      if (stageFilter !== 'all' && comm.stage !== stageFilter) {
        return false;
      }

      // Health filter
      if (healthFilter !== 'all' && comm.health !== healthFilter) {
        return false;
      }

      // Work queue filter
      if (workQueueFilter !== 'all') {
        const recentStages = ['uploaded', 'responded', 'activated'];
        const reviewStages = ['uploaded', 'responded', 'review'];
        const waitingStages = ['sent', 'delivered', 'opened', 'reminded', 'started', 'in-progress'];

        switch (workQueueFilter) {
          case 'newActivity':
            if (!(recentStages.includes(comm.stage) && comm.daysInCurrentStage <= 1)) {
              return false;
            }
            break;
          case 'needsReview':
            if (!reviewStages.includes(comm.stage)) {
              return false;
            }
            break;
          case 'awaitingClient':
            if (!waitingStages.includes(comm.stage)) {
              return false;
            }
            break;
          case 'overdue':
            if (comm.health !== 'overdue') {
              return false;
            }
            break;
        }
      }

      return true;
    });
  }, [activeComms, searchQuery, commtypeFilter, stageFilter, healthFilter, workQueueFilter]);

  // Sorted communications
  const sortedComms = useMemo(() => {
    return [...filteredComms].sort((a, b) => {
      // Always sort by health priority first (overdue > at-risk > on-track)
      const healthDiff = HEALTH_CONFIG[a.health].priority - HEALTH_CONFIG[b.health].priority;
      if (healthDiff !== 0) return healthDiff;

      // Then by selected field
      let comparison = 0;
      switch (sortField) {
        case 'client':
          comparison = getClientDisplayName(a.client).localeCompare(getClientDisplayName(b.client));
          break;
        case 'type':
          comparison = COMMTYPES[a.commtype].name.localeCompare(COMMTYPES[b.commtype].name);
          break;
        case 'stage':
          comparison = a.stage.localeCompare(b.stage);
          break;
        case 'days':
          comparison = a.daysInCurrentStage - b.daysInCurrentStage;
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredComms, sortField, sortDirection]);

  // Paginated communications
  const paginatedComms = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedComms.slice(startIndex, endIndex);
  }, [sortedComms, currentPage, rowsPerPage]);

  // Pagination info
  const totalPages = Math.ceil(sortedComms.length / rowsPerPage);
  const startItem = sortedComms.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, sortedComms.length);

  // Items needing attention count
  const needsAttentionCount = healthStats.overdue + healthStats['at-risk'];

  // Unread notification count (for badge)
  const unreadNotifCount = useMemo(() => getUnreadAdviserNotificationCount(), []);

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleCommtypeFilter = (id: CommtypeId | 'all') => {
    if (commtypeFilter === id) {
      setCommtypeFilter('all');
      setStageFilter('all');
    } else {
      setCommtypeFilter(id);
      setStageFilter('all');
    }
    setCurrentPage(1);
  };

  const handleStageFilter = (stage: string) => {
    setStageFilter(stageFilter === stage ? 'all' : stage);
    setCurrentPage(1);
  };

  const handleHealthFilter = (health: HealthFilter) => {
    setHealthFilter(healthFilter === health ? 'all' : health);
    setCurrentPage(1);
  };

  const handleWorkQueueFilter = (filter: WorkQueueFilter) => {
    setWorkQueueFilter(workQueueFilter === filter ? 'all' : filter);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setCommtypeFilter('all');
    setStageFilter('all');
    setHealthFilter('all');
    setWorkQueueFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // =============================================================================
  // RENDER HELPERS
  // =============================================================================

  const getStageBadgeClass = (comm: Communication) => {
    if (comm.health === 'overdue') return 'badge-error';
    if (comm.health === 'at-risk') return 'badge-warning';
    const successStages = ['complete', 'closed', 'uploaded', 'activated', 'responded'];
    if (successStages.includes(comm.stage)) return 'badge-success';
    return 'badge-primary';
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="material-icons-outlined sort-icon">unfold_more</span>;
    }
    return (
      <span className="material-icons-outlined sort-icon active">
        {sortDirection === 'asc' ? 'expand_less' : 'expand_more'}
      </span>
    );
  };

  const hasActiveFilters = commtypeFilter !== 'all' || stageFilter !== 'all' || healthFilter !== 'all' || workQueueFilter !== 'all';

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <AppLayout>
      <div className="comms-dashboard">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Message Centre</h1>
            <div className="page-header-stats">
              <span className="header-stat">
                <span className="header-stat-value">{healthStats.total}</span> active
              </span>
              {needsAttentionCount > 0 && (
                <span className="header-stat attention">
                  <span className="header-stat-value">{needsAttentionCount}</span> need attention
                </span>
              )}
            </div>
          </div>
          <div className="page-header-right">
            {/* View Mode Toggle - hidden for now */}
            <NotesButton />
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="tabs">
          <Link href="/comms-hub" className="tab active">
            Communications
          </Link>
          <Link href="/comms-hub/notifications" className="tab">
            Alerts
            {unreadNotifCount > 0 && <span className="tab-badge">{unreadNotifCount}</span>}
          </Link>
          <Link href="/comms-hub/demo-flows" className="tab">
            Demo Flows
          </Link>
          <Link href="/comms-hub/relationships" className="tab">
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

        {/* Main Section Card */}
        <div className="section-card">
          {/* Section Header */}
          <div className="section-card-header">
            <h2 className="section-card-title">Your Communications</h2>
            <div className="section-card-actions">
              <button className="btn btn-primary" onClick={() => startFlow({})}>
                <span className="material-icons-outlined">add</span>
                New Message
              </button>
              <button className="btn-icon" title="Refresh">
                <span className="material-icons-outlined">refresh</span>
              </button>
            </div>
          </div>

          {/* Summary Cards Row - Clickable filters */}
          <div className="section-card-summary">
            <div className="summary-cards-grid cols-4">
              <button
                className={`summary-card-ref clickable ${workQueueFilter === 'newActivity' ? 'active' : ''}`}
                onClick={() => handleWorkQueueFilter('newActivity')}
              >
                <span className="summary-card-ref-label">New Activity</span>
                <span className="summary-card-ref-value">{workQueueStats.newActivity}</span>
              </button>
              <button
                className={`summary-card-ref clickable ${workQueueFilter === 'needsReview' ? 'active' : ''}`}
                onClick={() => handleWorkQueueFilter('needsReview')}
              >
                <span className="summary-card-ref-label">Needs Review</span>
                <span className="summary-card-ref-value">{workQueueStats.needsReview}</span>
              </button>
              <button
                className={`summary-card-ref clickable ${workQueueFilter === 'awaitingClient' ? 'active' : ''}`}
                onClick={() => handleWorkQueueFilter('awaitingClient')}
              >
                <span className="summary-card-ref-label">Awaiting Client</span>
                <span className="summary-card-ref-value">{workQueueStats.awaitingClient}</span>
              </button>
              <button
                className={`summary-card-ref clickable warning ${workQueueFilter === 'overdue' ? 'active' : ''} ${workQueueStats.overdue > 0 ? 'has-items' : ''}`}
                onClick={() => handleWorkQueueFilter('overdue')}
              >
                <span className="summary-card-ref-label">Overdue</span>
                <span className="summary-card-ref-value">{workQueueStats.overdue}</span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="section-card-content">
            {/* Table Toolbar - Filters + Search */}
            <div className="section-card-toolbar">
              <div className="filter-bar-inline">
                <span className="filter-label">Filter:</span>

                {/* Status Filter Dropdown */}
                <div className="filter-dropdown-group">
                  <button
                    className={`filter-dropdown ${healthFilter !== 'all' ? 'has-value' : ''}`}
                    onClick={() => handleHealthFilter(healthFilter === 'all' ? 'on-track' : 'all')}
                  >
                    {healthFilter !== 'all' && <span className={`filter-indicator ${healthFilter}`} />}
                    Status
                    <span className="material-icons-outlined">expand_more</span>
                  </button>
                  <div className="filter-dropdown-menu">
                    <button className={healthFilter === 'all' ? 'active' : ''} onClick={() => setHealthFilter('all')}>All ({healthStats.total})</button>
                    <button className={healthFilter === 'on-track' ? 'active' : ''} onClick={() => handleHealthFilter('on-track')}>
                      <span className="status-dot on-track" /> On Track ({healthStats['on-track']})
                    </button>
                    <button className={healthFilter === 'at-risk' ? 'active' : ''} onClick={() => handleHealthFilter('at-risk')}>
                      <span className="status-dot at-risk" /> At Risk ({healthStats['at-risk']})
                    </button>
                    <button className={healthFilter === 'overdue' ? 'active' : ''} onClick={() => handleHealthFilter('overdue')}>
                      <span className="status-dot overdue" /> Overdue ({healthStats['overdue']})
                    </button>
                  </div>
                </div>

                {/* Type Filter Dropdown */}
                <div className="filter-dropdown-group">
                  <button
                    className={`filter-dropdown ${commtypeFilter !== 'all' ? 'has-value' : ''}`}
                    onClick={() => handleCommtypeFilter(commtypeFilter === 'all' ? 'document-request' : 'all')}
                  >
                    {commtypeFilter !== 'all' && <span className="filter-indicator type" />}
                    Type
                    <span className="material-icons-outlined">expand_more</span>
                  </button>
                  <div className="filter-dropdown-menu">
                    <button className={commtypeFilter === 'all' ? 'active' : ''} onClick={() => { setCommtypeFilter('all'); setStageFilter('all'); }}>All Types</button>
                    {(Object.keys(COMMTYPES) as CommtypeId[]).map(id => (
                      <button key={id} className={commtypeFilter === id ? 'active' : ''} onClick={() => handleCommtypeFilter(id)}>
                        {COMMTYPES[id].name} ({commtypeStats[id]?.total || 0})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stage Filter Dropdown - only when Type is selected */}
                {commtypeFilter !== 'all' && (
                  <div className="filter-dropdown-group">
                    <button
                      className={`filter-dropdown ${stageFilter !== 'all' ? 'has-value' : ''}`}
                      onClick={() => handleStageFilter(stageFilter === 'all' ? COMMTYPES[commtypeFilter].stages[0].id : 'all')}
                    >
                      {stageFilter !== 'all' && <span className="filter-indicator stage" />}
                      Stage
                      <span className="material-icons-outlined">expand_more</span>
                    </button>
                    <div className="filter-dropdown-menu">
                      <button className={stageFilter === 'all' ? 'active' : ''} onClick={() => setStageFilter('all')}>All Stages</button>
                      {COMMTYPES[commtypeFilter].stages.map(stageDef => {
                        const count = stageCounts[stageDef.id] || 0;
                        return (
                          <button key={stageDef.id} className={stageFilter === stageDef.id ? 'active' : ''} onClick={() => handleStageFilter(stageDef.id)}>
                            {stageDef.label} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Active Filter Chips - inline */}
                {healthFilter !== 'all' && (
                  <span className={`filter-chip ${healthFilter}`}>
                    {healthFilter === 'on-track' ? 'On Track' : healthFilter === 'at-risk' ? 'At Risk' : 'Overdue'}
                    <button onClick={() => setHealthFilter('all')} className="chip-clear">×</button>
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
                {workQueueFilter !== 'all' && (
                  <span className="filter-chip type">
                    {workQueueFilter === 'newActivity' ? 'New Activity' :
                     workQueueFilter === 'needsReview' ? 'Needs Review' :
                     workQueueFilter === 'awaitingClient' ? 'Awaiting Client' : 'Overdue'}
                    <button onClick={() => setWorkQueueFilter('all')} className="chip-clear">×</button>
                  </span>
                )}
                {hasActiveFilters && (
                  <button className="filter-chip clear-all" onClick={clearFilters}>
                    Clear all
                    <span className="chip-clear">×</span>
                  </button>
                )}
              </div>

              <div className="search-container">
                <span className="material-icons-outlined search-icon">search</span>
                <input
                  type="text"
                  placeholder="Search by client name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => setSearchQuery('')} title="Clear search">
                    <span className="material-icons-outlined">close</span>
                  </button>
                )}
              </div>

              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="toggle-checkbox"
                />
                <span className="toggle-text">Show Completed</span>
              </label>
            </div>

            {/* Compact View - Table */}
            {viewMode === 'compact' && (
              <div className="table-container">
                <table className="comms-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th className="sortable" onClick={() => handleSort('client')} style={{ width: '160px' }}>
                        Client <SortIcon field="client" />
                      </th>
                      <th style={{ minWidth: '180px' }}>Subject</th>
                      <th className="sortable" onClick={() => handleSort('type')} style={{ width: '140px' }}>
                        Type <SortIcon field="type" />
                      </th>
                      <th style={{ width: '80px' }}>Channel</th>
                      <th className="sortable" onClick={() => handleSort('stage')} style={{ width: '120px' }}>
                        Stage <SortIcon field="stage" />
                      </th>
                      <th className="sortable th-days" onClick={() => handleSort('days')} style={{ width: '60px' }}>
                        Days <SortIcon field="days" />
                      </th>
                      <th className="th-action"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedComms.map(comm => (
                      <tr
                        key={comm.id}
                        className={`clickable-row${recentlyAdded.has(comm.id) ? ' recently-added' : ''}`}
                        onClick={() => router.push(`/comms-hub/communication/${comm.id}`)}
                      >
                        <td className="td-health">
                          <span className={`health-dot health-${comm.health}`} title={comm.health === 'on-track' ? 'On Track' : comm.health === 'at-risk' ? 'At Risk' : 'Overdue'}></span>
                        </td>
                        <td className="td-client">{getClientDisplayName(comm.client)}</td>
                        <td className="td-subject" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          {comm.subject || '—'}
                        </td>
                        <td className="td-type">{COMMTYPES[comm.commtype].name}</td>
                        <td className="td-channel">
                          {comm.channels.map((ch) => (
                            <span key={ch} className="channel-icon" title={CHANNELS[ch].label}>
                              <span className="material-icons-outlined" style={{ fontSize: '16px' }}>{CHANNELS[ch].icon}</span>
                            </span>
                          ))}
                        </td>
                        <td className="td-stage">
                          <span className={`badge ${getStageBadgeClass(comm)}`}>
                            {getStageLabel(comm.commtype, comm.stage)}
                          </span>
                        </td>
                        <td className="td-days">
                          {comm.daysInCurrentStage > 0 && (
                            <span className="days-badge">{comm.daysInCurrentStage}d</span>
                          )}
                        </td>
                        <td className="td-action">
                          <button className="btn-icon-md" title="View details">
                            <span className="material-icons-outlined">chevron_right</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {sortedComms.length === 0 && (
                      <tr>
                        <td colSpan={8} className="empty-state">
                          No communications match your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="inbox-cards-container">
                {paginatedComms.map(comm => {
                  const commNotifs = getNotificationsForComm(comm.id).filter(n => n.audience === 'adviser' && !n.read);
                  return (
                  <div
                    key={comm.id}
                    className={`inbox-card ${comm.health}${recentlyAdded.has(comm.id) ? ' recently-added' : ''}`}
                    onClick={() => router.push(`/comms-hub/communication/${comm.id}`)}
                  >
                    {/* Card Header */}
                    <div className="inbox-card-header">
                      <div className={`inbox-card-health health-${comm.health}`}>
                        <span className={`health-dot health-${comm.health}`}></span>
                        <span className="health-label">
                          {comm.health === 'overdue' ? 'OVERDUE' : comm.health === 'at-risk' ? 'AT RISK' : 'ON TRACK'}
                        </span>
                      </div>
                      <div className="inbox-card-header-right">
                        {commNotifs.length > 0 && (
                          <span className="inbox-card-notif-badge" title={`${commNotifs.length} unread notification${commNotifs.length !== 1 ? 's' : ''}`}>
                            <span className="material-icons-outlined">notifications</span>
                            {commNotifs.length}
                          </span>
                        )}
                        <span className="inbox-card-time">{formatRelativeTime(comm.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="inbox-card-body">
                      <div className="inbox-card-client">
                        <div className="inbox-card-avatar">
                          {comm.client.firstName.charAt(0)}{comm.client.lastName.charAt(0)}
                        </div>
                        <div className="inbox-card-client-info">
                          <span className="inbox-card-client-name">{getClientDisplayName(comm.client)}</span>
                          <span className="inbox-card-type">{COMMTYPES[comm.commtype].name}</span>
                        </div>
                      </div>

                      <div className="inbox-card-subject">
                        {comm.subject || `${COMMTYPES[comm.commtype].name} communication`}
                      </div>

                      {/* Card Footer */}
                      <div className="inbox-card-footer">
                        <div className="inbox-card-meta">
                          <span className={`badge ${getStageBadgeClass(comm)}`}>
                            {getStageLabel(comm.commtype, comm.stage)}
                          </span>
                          {comm.daysInCurrentStage > 0 && (
                            <span className="days-badge">{comm.daysInCurrentStage} days</span>
                          )}
                        </div>
                        <div className="inbox-card-channels">
                          {comm.channels.map((ch) => (
                            <span key={ch} className="channel-icon" title={CHANNELS[ch].label}>
                              <span className="material-icons-outlined">{CHANNELS[ch].icon}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Chevron */}
                    <div className="inbox-card-chevron">
                      <span className="material-icons-outlined">chevron_right</span>
                    </div>
                  </div>
                  );
                })}

                {sortedComms.length === 0 && (
                  <div className="empty-state-card">
                    <span className="material-icons-outlined">inbox</span>
                    <p>No communications match your filters</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {sortedComms.length > 0 && (
              <div className="table-pagination">
                <div className="table-pagination-info">
                  Showing {startItem}-{endItem} of {sortedComms.length}
                </div>
                <div className="table-pagination-controls">
                  <label>Rows per page:</label>
                  <select
                    className="table-pagination-select"
                    value={rowsPerPage}
                    onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <div className="table-pagination-nav">
                    <button
                      className="btn-icon-sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      title="Previous page"
                    >
                      <span className="material-icons-outlined">chevron_left</span>
                    </button>
                    <button
                      className="btn-icon-sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      title="Next page"
                    >
                      <span className="material-icons-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* End section-card-content */}
        </div>
        {/* End section-card */}
      </div>
    </AppLayout>
  );
}
