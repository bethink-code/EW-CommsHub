'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { StepProps } from '@/lib/comm-flow/types';
import { Client, getClientDisplayName } from '@/types/communications';
import { MOCK_CLIENTS } from '@/app/comms-hub/mock-data';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// CONSTANTS
// =============================================================================

const PAGE_SIZE = 25;

interface PredefinedList {
  id: string;
  name: string;
  count: number;
  clients: Client[];
}

const PREDEFINED_LISTS: PredefinedList[] = [
  { id: 'all-clients', name: 'All Clients', count: MOCK_CLIENTS.length, clients: MOCK_CLIENTS },
  { id: 'high-net-worth', name: 'High Net Worth', count: 3, clients: MOCK_CLIENTS.slice(0, 3) },
  { id: 'new-this-year', name: 'New This Year', count: 3, clients: MOCK_CLIENTS.slice(2, 5) },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function RecipientsStep({ data, onDataChange }: StepProps) {
  const [listsExpanded, setListsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // Add Client form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const canAddClient = newFirstName.trim() !== '' && newLastName.trim() !== '';

  const handleAddClient = useCallback(() => {
    if (!canAddClient) return;
    const newClient: Client = {
      id: `new-${Date.now()}`,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      email: newEmail.trim() || undefined,
      phone: newPhone.trim() || undefined,
    };
    onDataChange({ recipients: [...data.recipients, newClient] });
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPhone('');
    setShowAddForm(false);
  }, [canAddClient, newFirstName, newLastName, newEmail, newPhone, data.recipients, onDataChange]);

  const handleCancelAdd = useCallback(() => {
    setShowAddForm(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPhone('');
  }, []);

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_CLIENTS;
    const q = searchQuery.toLowerCase();
    return MOCK_CLIENTS.filter(client => {
      const name = getClientDisplayName(client).toLowerCase();
      const email = client.email?.toLowerCase() || '';
      const phone = client.phone?.toLowerCase() || '';
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filteredClients.length);
  const pageClients = filteredClients.slice(pageStart, pageEnd);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Header checkbox state (page-level 3-state)
  const pageSelectedCount = pageClients.filter(c =>
    data.recipients.some(r => r.id === c.id)
  ).length;
  const allPageSelected = pageClients.length > 0 && pageSelectedCount === pageClients.length;
  const somePageSelected = pageSelectedCount > 0 && !allPageSelected;

  // Set indeterminate on header checkbox
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = somePageSelected;
    }
  }, [somePageSelected]);

  // Toggle a single client
  const toggleRecipient = useCallback((client: Client) => {
    const isSelected = data.recipients.some(r => r.id === client.id);
    onDataChange({
      recipients: isSelected
        ? data.recipients.filter(r => r.id !== client.id)
        : [...data.recipients, client],
    });
  }, [data.recipients, onDataChange]);

  // Toggle all on current page
  const togglePageAll = useCallback(() => {
    if (allPageSelected) {
      // Deselect page clients
      const pageIds = new Set(pageClients.map(c => c.id));
      onDataChange({
        recipients: data.recipients.filter(r => !pageIds.has(r.id)),
      });
    } else {
      // Select all page clients (merge with existing)
      const existing = new Set(data.recipients.map(r => r.id));
      const toAdd = pageClients.filter(c => !existing.has(c.id));
      onDataChange({
        recipients: [...data.recipients, ...toAdd],
      });
    }
  }, [allPageSelected, pageClients, data.recipients, onDataChange]);

  // Toolbar Select All = all filtered clients globally
  const selectAllGlobal = useCallback(() => {
    const existing = new Set(data.recipients.map(r => r.id));
    const toAdd = filteredClients.filter(c => !existing.has(c.id));
    onDataChange({
      recipients: [...data.recipients, ...toAdd],
    });
  }, [filteredClients, data.recipients, onDataChange]);

  // Toolbar Deselect All = deselect all filtered clients globally
  const deselectAllGlobal = useCallback(() => {
    const filteredIds = new Set(filteredClients.map(c => c.id));
    onDataChange({
      recipients: data.recipients.filter(r => !filteredIds.has(r.id)),
    });
  }, [filteredClients, data.recipients, onDataChange]);

  // Select from predefined list
  const selectFromList = useCallback((list: PredefinedList) => {
    onDataChange({ recipients: [...list.clients] });
    setListsExpanded(false);
  }, [onDataChange]);

  // Are all filtered clients selected?
  const allFilteredSelected = filteredClients.length > 0 &&
    filteredClients.every(c => data.recipients.some(r => r.id === c.id));

  return (
    <div className="recipients-step-v2">
      {/* 1. Selection row: predefined list dropdown OR search */}
      <div className="recipients-selection-row">
        <div className="recipients-lists-bar">
          <button
            type="button"
            className={`recipients-lists-toggle ${listsExpanded ? 'open' : ''}`}
            onClick={() => setListsExpanded(!listsExpanded)}
          >
            Use a predefined list
            <span
              className="material-icons-outlined recipients-lists-chevron"
              style={{ fontSize: '18px' }}
            >
              {listsExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          {listsExpanded && (
            <div className="recipients-lists-dropdown">
              {PREDEFINED_LISTS.map(list => (
                <button
                  key={list.id}
                  type="button"
                  className="recipients-list-item"
                  onClick={() => selectFromList(list)}
                >
                  <span className="recipients-list-name">{list.name}</span>
                  <span className="recipients-list-count">{list.count}</span>
                </button>
              ))}
              <div className="recipients-lists-footer">
                <span className="material-icons-outlined" style={{ fontSize: '14px' }}>settings</span>
                Manage Lists
              </div>
            </div>
          )}
        </div>

        <span className="recipients-selection-or">or</span>

        <div className="search-container" style={{ flex: 1 }}>
          <span className="material-icons-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search clients..."
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
      </div>

      {/* 3. Toolbar */}
      <div className="recipients-toolbar">
        <div className="recipients-toolbar-left">
          {data.recipients.length > 0 && (
            <span className="recipients-toolbar-badge">
              {data.recipients.length} selected
            </span>
          )}
        </div>
        <div className="recipients-toolbar-right">
          <button
            type="button"
            className="btn btn-secondary recipients-add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <span className="material-icons-outlined" style={{ fontSize: '16px' }}>person_add</span>
            Add Client
          </button>
        </div>
      </div>

      {/* 4a. Inline Add Client form */}
      {showAddForm && (
        <div className="recipients-add-form">
          <div className="recipients-add-fields">
            <div className="recipients-add-field">
              <label className="recipients-add-label">First Name *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Johan"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="recipients-add-field">
              <label className="recipients-add-label">Last Name *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Pretorius"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </div>
            <div className="recipients-add-field">
              <label className="recipients-add-label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="e.g. johan@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="recipients-add-field">
              <label className="recipients-add-label">Phone</label>
              <input
                type="tel"
                className="input"
                placeholder="e.g. +27 82 123 4567"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="recipients-add-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancelAdd}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddClient}
              disabled={!canAddClient}
            >
              <span className="material-icons-outlined" style={{ fontSize: '16px' }}>person_add</span>
              Add to Recipients
            </button>
          </div>
        </div>
      )}

      {/* 4b. Data table */}
      {filteredClients.length > 0 ? (
        <div className="recipients-table-container">
          <table className="recipients-table">
            <thead>
              <tr>
                <th className="th-checkbox">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={togglePageAll}
                  />
                </th>
                <th className="th-name">Name</th>
                <th className="th-email">Email</th>
                <th className="th-phone">Phone</th>
              </tr>
            </thead>
            <tbody>
              {pageClients.map(client => {
                const isSelected = data.recipients.some(r => r.id === client.id);
                return (
                  <tr
                    key={client.id}
                    className={isSelected ? 'selected' : ''}
                    onClick={() => toggleRecipient(client)}
                  >
                    <td className="td-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRecipient(client)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="td-name">
                      <span className="recipients-client-name">{getClientDisplayName(client)}</span>
                    </td>
                    <td className="td-email">{client.email || '\u2014'}</td>
                    <td className="td-phone">{client.phone || '\u2014'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="recipients-empty-state">
          <span className="material-icons-outlined recipients-empty-icon">person_search</span>
          <p className="recipients-empty-text">No clients match your search</p>
          {!showAddForm && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <span className="material-icons-outlined" style={{ fontSize: '16px' }}>person_add</span>
              Add New Client
            </button>
          )}
        </div>
      )}

      {/* 5. Pagination */}
      {filteredClients.length > PAGE_SIZE && (
        <div className="recipients-pagination">
          <span className="recipients-pagination-info">
            {pageStart + 1}\u2013{pageEnd} of {filteredClients.length}
          </span>
          <div className="recipients-pagination-buttons">
            <button
              type="button"
              className="recipients-pagination-btn"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              <span className="material-icons-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
            </button>
            <button
              type="button"
              className="recipients-pagination-btn"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="material-icons-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Register this step
registerStep('recipients', RecipientsStep);

export default RecipientsStep;
