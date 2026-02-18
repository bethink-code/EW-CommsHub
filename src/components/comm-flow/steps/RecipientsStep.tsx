'use client';

import { useState, useMemo } from 'react';
import { StepProps } from '@/lib/comm-flow/types';
import { Client, getClientDisplayName } from '@/types/communications';
import { MOCK_CLIENTS } from '@/app/comms-hub/mock-data';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// TYPES
// =============================================================================

type MainTab = 'choose' | 'list';
type ChooseSubTab = 'choosing' | 'chosen';

interface PredefinedList {
  id: string;
  name: string;
  description: string;
  icon: string;
  clients: Client[];
}

// =============================================================================
// DEMO DATA: Predefined Lists
// =============================================================================

const PREDEFINED_LISTS: PredefinedList[] = [
  {
    id: 'all-clients',
    name: 'All Clients',
    description: 'Send to all clients in your book',
    icon: 'groups',
    clients: MOCK_CLIENTS,
  },
  {
    id: 'high-net-worth',
    name: 'High Net Worth',
    description: 'Clients with assets over R5M',
    icon: 'diamond',
    clients: MOCK_CLIENTS.slice(0, 3),
  },
  {
    id: 'new-this-year',
    name: 'New This Year',
    description: 'Clients onboarded in 2026',
    icon: 'person_add',
    clients: MOCK_CLIENTS.slice(2, 5),
  },
];

// =============================================================================
// CHOOSE PEOPLE - CHOOSING SUB-TAB (filter + table)
// =============================================================================

interface ChoosingViewProps {
  recipients: Client[];
  onToggle: (client: Client) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

function ChoosingView({ recipients, onToggle, onSelectAll, onClearAll }: ChoosingViewProps) {
  const [filterQuery, setFilterQuery] = useState('');

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    if (!filterQuery.trim()) return MOCK_CLIENTS;
    const query = filterQuery.toLowerCase();
    return MOCK_CLIENTS.filter(client => {
      const name = getClientDisplayName(client).toLowerCase();
      const email = client.email?.toLowerCase() || '';
      return name.includes(query) || email.includes(query);
    });
  }, [filterQuery]);

  return (
    <div className="choosing-view">
      {/* Toolbar */}
      <div className="choosing-toolbar">
        <div className="choosing-filter">
          <span className="material-icons-outlined">filter_list</span>
          <input
            type="text"
            placeholder="Filter clients..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="choosing-filter-input"
          />
          {filterQuery && (
            <button
              type="button"
              className="choosing-filter-clear"
              onClick={() => setFilterQuery('')}
            >
              <span className="material-icons-outlined">close</span>
            </button>
          )}
        </div>
        <div className="choosing-actions">
          <button
            type="button"
            className="btn btn-text btn-sm"
            onClick={onSelectAll}
          >
            Select All
          </button>
          <button
            type="button"
            className="btn btn-text btn-sm"
            onClick={onClearAll}
            disabled={recipients.length === 0}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="choosing-results-info">
        <span>{filteredClients.length} clients</span>
        {recipients.length > 0 && (
          <span className="choosing-selected-badge">
            {recipients.length} selected
          </span>
        )}
      </div>

      {/* Client table */}
      <div className="choosing-table-container">
        <table className="choosing-table">
          <tbody>
            {filteredClients.map(client => {
              const isSelected = recipients.some(r => r.id === client.id);
              return (
                <tr
                  key={client.id}
                  className={isSelected ? 'selected' : ''}
                  onClick={() => onToggle(client)}
                >
                  <td className="td-checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(client)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="td-name">
                    <div className="table-client-avatar">
                      {client.firstName[0]}{client.lastName[0]}
                    </div>
                    <span className="table-client-name">{getClientDisplayName(client)}</span>
                  </td>
                  <td className="td-email">{client.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// CHOOSE PEOPLE - CHOSEN SUB-TAB (selected list)
// =============================================================================

interface ChosenViewProps {
  recipients: Client[];
  onRemove: (client: Client) => void;
  onClearAll: () => void;
}

function ChosenView({ recipients, onRemove, onClearAll }: ChosenViewProps) {
  if (recipients.length === 0) {
    return (
      <div className="chosen-empty">
        <span className="material-icons-outlined">person_add</span>
        <p>No recipients selected yet.</p>
        <p className="chosen-empty-hint">
          Switch to the Choosing tab to search and select clients.
        </p>
      </div>
    );
  }

  return (
    <div className="chosen-view">
      {/* Header */}
      <div className="chosen-header">
        <span className="chosen-count">{recipients.length} recipient{recipients.length !== 1 ? 's' : ''}</span>
        <button
          type="button"
          className="btn btn-text btn-sm"
          onClick={onClearAll}
        >
          Remove All
        </button>
      </div>

      {/* Selected recipients list */}
      <div className="chosen-list">
        {recipients.map(client => (
          <div key={client.id} className="chosen-item">
            <div className="chosen-item-avatar">
              {client.firstName[0]}{client.lastName[0]}
            </div>
            <div className="chosen-item-info">
              <span className="chosen-item-name">{getClientDisplayName(client)}</span>
              <span className="chosen-item-email">{client.email}</span>
            </div>
            <button
              type="button"
              className="chosen-item-remove"
              onClick={() => onRemove(client)}
              aria-label={`Remove ${getClientDisplayName(client)}`}
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// LIST MODE (Predefined Groups)
// =============================================================================

interface ListModeProps {
  recipients: Client[];
  onSelectList: (list: PredefinedList) => void;
}

function ListMode({ recipients, onSelectList }: ListModeProps) {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Check if current recipients match a predefined list
  const matchingList = PREDEFINED_LISTS.find(list =>
    list.clients.length === recipients.length &&
    list.clients.every(c => recipients.some(r => r.id === c.id))
  );

  const handleListSelect = (list: PredefinedList) => {
    setSelectedListId(list.id);
    onSelectList(list);
  };

  return (
    <div className="list-mode">
      <p className="list-mode-hint">
        Select a predefined list to quickly add recipients. Lists are managed in Campaigns.
      </p>

      <div className="list-mode-options">
        {PREDEFINED_LISTS.map(list => {
          const isSelected = selectedListId === list.id || matchingList?.id === list.id;
          return (
            <button
              key={list.id}
              type="button"
              className={`list-mode-option ${isSelected ? 'selected' : ''}`}
              onClick={() => handleListSelect(list)}
            >
              <div className="list-option-icon">
                <span className="material-icons-outlined">{list.icon}</span>
              </div>
              <div className="list-option-content">
                <div className="list-option-header">
                  <span className="list-option-name">{list.name}</span>
                  <span className="list-option-count">{list.clients.length} clients</span>
                </div>
                <p className="list-option-desc">{list.description}</p>
              </div>
              {isSelected && (
                <span className="list-option-check">
                  <span className="material-icons-outlined">check_circle</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Preview of selected list */}
      {recipients.length > 0 && (
        <div className="list-mode-preview">
          <span className="list-preview-label">Preview:</span>
          <span className="list-preview-names">
            {recipients.slice(0, 4).map(c => getClientDisplayName(c)).join(', ')}
            {recipients.length > 4 && ` + ${recipients.length - 4} more`}
          </span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function RecipientsStep({
  data,
  onDataChange,
}: StepProps) {
  const [mainTab, setMainTab] = useState<MainTab>('choose');
  const [chooseSubTab, setChooseSubTab] = useState<ChooseSubTab>('choosing');

  // Toggle a single client
  const toggleRecipient = (client: Client) => {
    const isSelected = data.recipients.some(r => r.id === client.id);
    onDataChange({
      recipients: isSelected
        ? data.recipients.filter(r => r.id !== client.id)
        : [...data.recipients, client],
    });
  };

  // Remove a client
  const removeRecipient = (client: Client) => {
    onDataChange({
      recipients: data.recipients.filter(r => r.id !== client.id),
    });
  };

  // Select all clients
  const selectAll = () => {
    onDataChange({ recipients: [...MOCK_CLIENTS] });
  };

  // Clear all selections
  const clearAll = () => {
    onDataChange({ recipients: [] });
  };

  // Select from predefined list
  const selectFromList = (list: PredefinedList) => {
    onDataChange({ recipients: [...list.clients] });
  };

  return (
    <div className="recipients-step">
      {/* Main tabs */}
      <div className="recipients-mode-tabs">
        <button
          type="button"
          className={`mode-tab ${mainTab === 'choose' ? 'active' : ''}`}
          onClick={() => setMainTab('choose')}
        >
          <span className="material-icons-outlined">people</span>
          <span>Choose People</span>
          {data.recipients.length > 0 && (
            <span className="mode-tab-badge">{data.recipients.length}</span>
          )}
        </button>
        <button
          type="button"
          className={`mode-tab ${mainTab === 'list' ? 'active' : ''}`}
          onClick={() => setMainTab('list')}
        >
          <span className="material-icons-outlined">folder_shared</span>
          <span>From List</span>
        </button>
      </div>

      {/* Mode-specific content */}
      <div className="recipients-mode-content">
        {mainTab === 'choose' && (
          <div className="choose-people-view">
            {/* Sub-tabs: Choosing / Chosen */}
            <div className="choose-sub-tabs">
              <button
                type="button"
                className={`sub-tab ${chooseSubTab === 'choosing' ? 'active' : ''}`}
                onClick={() => setChooseSubTab('choosing')}
              >
                Choosing
              </button>
              <button
                type="button"
                className={`sub-tab ${chooseSubTab === 'chosen' ? 'active' : ''}`}
                onClick={() => setChooseSubTab('chosen')}
              >
                Chosen
                {data.recipients.length > 0 && (
                  <span className="sub-tab-count">{data.recipients.length}</span>
                )}
              </button>
            </div>

            {/* Sub-tab content */}
            {chooseSubTab === 'choosing' && (
              <ChoosingView
                recipients={data.recipients}
                onToggle={toggleRecipient}
                onSelectAll={selectAll}
                onClearAll={clearAll}
              />
            )}
            {chooseSubTab === 'chosen' && (
              <ChosenView
                recipients={data.recipients}
                onRemove={removeRecipient}
                onClearAll={clearAll}
              />
            )}
          </div>
        )}

        {mainTab === 'list' && (
          <ListMode
            recipients={data.recipients}
            onSelectList={selectFromList}
          />
        )}
      </div>
    </div>
  );
}

// Register this step
registerStep('recipients', RecipientsStep);

export default RecipientsStep;
