'use client';

import { useState, useMemo } from 'react';
import { StepProps } from '@/lib/comm-flow/types';
import {
  COMM_TYPE_CONFIGS,
  CHANNELS,
  Channel,
  CommTypeConfig,
} from '@/types/communications';
import { registerStep } from '@/lib/comm-flow/stepRegistry';

// =============================================================================
// COMPONENT
// =============================================================================

export function CommTypeStep({
  data,
  onDataChange,
  hideStepHeader,
}: StepProps) {
  const [filterQuery, setFilterQuery] = useState('');

  // Flat list of all comm types, filtered by search
  const filteredTypes = useMemo((): CommTypeConfig[] => {
    const query = filterQuery.toLowerCase().trim();
    const allTypes = Object.values(COMM_TYPE_CONFIGS);
    if (!query) return allTypes;
    return allTypes.filter(config =>
      config.name.toLowerCase().includes(query) ||
      (config.description?.toLowerCase().includes(query) ?? false)
    );
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
      if (current.length <= 1) return;
      onDataChange({ channels: current.filter(c => c !== channel) });
    } else {
      onDataChange({ channels: [...current, channel] });
    }
  };

  return (
    <div className="commtype-step">
      {!hideStepHeader && (
        <div className="step-header">
          <h2 className="step-title">Communication Type</h2>
          <p className="step-subtitle">What would you like to send?</p>
        </div>
      )}

      {/* Search filter — uses global .search-container pattern */}
      <div className="search-container">
        <span className="material-icons-outlined search-icon">search</span>
        <input
          type="text"
          placeholder="Search types..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="search-input"
        />
        {filterQuery && (
          <button className="search-clear" onClick={() => setFilterQuery('')} title="Clear search">
            <span className="material-icons-outlined">close</span>
          </button>
        )}
      </div>

      {/* Flat radio-select list */}
      <div className="commtype-radio-list">
        {filteredTypes.map(config => {
          const isSelected = data.commType === config.id;
          const hasMultipleChannels = config.channels.length > 1;

          return (
            <div key={config.id} className="commtype-radio-wrapper">
              <button
                type="button"
                className={`commtype-radio-item ${isSelected ? 'selected' : ''}`}
                onClick={() => selectCommType(config.id)}
              >
                <span className={`commtype-radio-button ${isSelected ? 'checked' : ''}`}>
                  {isSelected && <span className="commtype-radio-dot" />}
                </span>
                <div className="commtype-radio-content">
                  <span className="commtype-radio-name">{config.name}</span>
                  {config.description && (
                    <span className="commtype-radio-desc">{config.description}</span>
                  )}
                </div>
              </button>

              {/* Inline channel selector — shown when type is selected */}
              {isSelected && hasMultipleChannels && (
                <div className="commtype-deliver-via">
                  <span className="commtype-deliver-label">Deliver via:</span>
                  <div className="commtype-channel-toggles">
                    {config.channels.map(channelId => {
                      const isActive = data.channels.includes(channelId);
                      const isLastActive = isActive && data.channels.length === 1;
                      return (
                        <button
                          key={channelId}
                          type="button"
                          className={`commtype-channel-toggle ${isActive ? 'active' : ''} ${isLastActive ? 'disabled' : ''}`}
                          onClick={() => toggleChannel(channelId)}
                          disabled={isLastActive}
                        >
                          <span className="material-icons-outlined" style={{ fontSize: '16px' }}>
                            {CHANNELS[channelId].icon}
                          </span>
                          {CHANNELS[channelId].label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {filteredTypes.length === 0 && (
          <div className="commtype-empty">
            <span className="material-icons-outlined">search_off</span>
            <p>No types match &ldquo;{filterQuery}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Register this step
registerStep('commtype', CommTypeStep);

export default CommTypeStep;
