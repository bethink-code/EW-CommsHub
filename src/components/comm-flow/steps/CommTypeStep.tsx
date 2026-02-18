'use client';

import { useState, useMemo } from 'react';
import { StepProps } from '@/lib/comm-flow/types';
import {
  COMM_TYPE_CONFIGS,
  COMM_TYPE_GROUPS,
  COMM_TYPE_GROUP_ORDER,
  CHANNELS,
  Channel,
  CommTypeConfig,
  CommTypeGroup,
} from '@/types/communications';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// TYPES
// =============================================================================

interface GroupedTypes {
  id: CommTypeGroup;
  label: string;
  icon: string;
  types: CommTypeConfig[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CommTypeStep({
  data,
  onDataChange,
}: StepProps) {
  const [filterQuery, setFilterQuery] = useState('');

  // Group and filter comm types
  const groups = useMemo((): GroupedTypes[] => {
    const query = filterQuery.toLowerCase().trim();
    const allTypes = Object.values(COMM_TYPE_CONFIGS);

    return COMM_TYPE_GROUP_ORDER.map(groupId => {
      const groupConfig = COMM_TYPE_GROUPS[groupId];
      const types = allTypes.filter(config => {
        if (config.group !== groupId) return false;
        if (!query) return true;
        return (
          config.name.toLowerCase().includes(query) ||
          (config.description?.toLowerCase().includes(query) ?? false)
        );
      });
      return { id: groupId, label: groupConfig.label, icon: groupConfig.icon, types };
    }).filter(g => g.types.length > 0);
  }, [filterQuery]);

  // Select a comm type — pre-select ALL its channels
  const selectCommType = (typeId: string) => {
    const config = COMM_TYPE_CONFIGS[typeId];
    if (!config) return;
    onDataChange({ commType: typeId, channels: [...config.channels] });
  };

  // Toggle a channel on/off (must keep at least one)
  const toggleChannel = (channel: Channel) => {
    const current = data.channels;
    if (current.includes(channel)) {
      // Don't allow deselecting the last channel
      if (current.length <= 1) return;
      onDataChange({ channels: current.filter(c => c !== channel) });
    } else {
      onDataChange({ channels: [...current, channel] });
    }
  };

  return (
    <div className="commtype-step">
      <div className="step-header">
        <h2 className="step-title">Communication Type</h2>
        <p className="step-subtitle">What would you like to send?</p>
      </div>

      {/* Search filter */}
      <div className="commtype-filter">
        <span className="material-icons-outlined">search</span>
        <input
          type="text"
          placeholder="Search types..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="commtype-filter-input"
        />
        {filterQuery && (
          <button
            type="button"
            className="commtype-filter-clear"
            onClick={() => setFilterQuery('')}
          >
            <span className="material-icons-outlined">close</span>
          </button>
        )}
      </div>

      {/* Grouped list */}
      <div className="commtype-groups">
        {groups.map(group => (
          <div key={group.id} className="commtype-group">
            <div className="commtype-group-label">{group.label}</div>
            <div className="commtype-group-items">
              {group.types.map(config => {
                const isSelected = data.commType === config.id;
                const hasMultipleChannels = config.channels.length > 1;

                return (
                  <button
                    key={config.id}
                    type="button"
                    className={`commtype-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => selectCommType(config.id)}
                  >
                    <div className="commtype-option-icon">
                      <span className="material-icons-outlined">{config.icon}</span>
                    </div>
                    <div className="commtype-option-content">
                      <span className="commtype-option-name">{config.name}</span>
                      {config.description && (
                        <span className="commtype-option-desc">{config.description}</span>
                      )}
                      {/* Inline channel selector (multi-select) */}
                      {isSelected && hasMultipleChannels && (
                        <div className="commtype-channel-row">
                          <span className="commtype-channel-label">Send via:</span>
                          {config.channels.map(channelId => (
                            <button
                              key={channelId}
                              type="button"
                              className={`flow-channel-tab ${data.channels.includes(channelId) ? 'selected' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleChannel(channelId);
                              }}
                            >
                              <span className="material-icons-outlined">{CHANNELS[channelId].icon}</span>
                              <span>{CHANNELS[channelId].label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <span className="commtype-option-check">
                        <span className="material-icons-outlined">check_circle</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {groups.length === 0 && (
          <div className="commtype-empty">
            <span className="material-icons-outlined">search_off</span>
            <p>No types match "{filterQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Register this step
registerStep('commtype', CommTypeStep);

export default CommTypeStep;
