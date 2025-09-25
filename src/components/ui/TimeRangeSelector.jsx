import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Select from './Select';

const TimeRangeSelector = ({ 
  value = '1h',
  onChange,
  className = "",
  showCustomRange = true,
  presets = [
    { value: '15m', label: '15 Minutes', description: 'Last 15 minutes' },
    { value: '1h', label: '1 Hour', description: 'Last hour' },
    { value: '4h', label: '4 Hours', description: 'Last 4 hours' },
    { value: '12h', label: '12 Hours', description: 'Last 12 hours' },
    { value: '24h', label: '24 Hours', description: 'Last 24 hours' },
    { value: '7d', label: '7 Days', description: 'Last 7 days' },
    { value: '30d', label: '30 Days', description: 'Last 30 days' },
    { value: 'custom', label: 'Custom Range', description: 'Select custom date range' }
  ]
}) => {
  const [selectedRange, setSelectedRange] = useState(value);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customRange, setCustomRange] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  });
  const [isLive, setIsLive] = useState(true);

  // Update selected range when value prop changes
  useEffect(() => {
    setSelectedRange(value);
  }, [value]);

  // Handle range selection
  const handleRangeChange = (newValue) => {
    setSelectedRange(newValue);
    
    if (newValue === 'custom') {
      setShowCustomPicker(true);
      setIsLive(false);
    } else {
      setShowCustomPicker(false);
      setIsLive(true);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  // Handle custom range submission
  const handleCustomRangeSubmit = () => {
    if (customRange?.startDate && customRange?.endDate) {
      const customValue = {
        type: 'custom',
        startDate: customRange?.startDate,
        endDate: customRange?.endDate,
        startTime: customRange?.startTime || '00:00',
        endTime: customRange?.endTime || '23:59'
      };
      
      if (onChange) {
        onChange(customValue);
      }
      setShowCustomPicker(false);
      setIsLive(false);
    }
  };

  // Handle live toggle
  const handleLiveToggle = () => {
    const newLiveState = !isLive;
    setIsLive(newLiveState);
    
    if (newLiveState && selectedRange !== 'custom') {
      if (onChange) {
        onChange(selectedRange);
      }
    }
  };

  // Get current range display text
  const getCurrentRangeText = () => {
    if (selectedRange === 'custom' && customRange?.startDate && customRange?.endDate) {
      return `${customRange?.startDate} - ${customRange?.endDate}`;
    }
    
    const preset = presets?.find(p => p?.value === selectedRange);
    return preset ? preset?.label : selectedRange;
  };

  // Get live indicator styling
  const getLiveIndicatorStyling = () => {
    return isLive ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted';
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        <Icon name="Clock" size={16} className="text-muted-foreground" />
        <Select
          options={presets}
          value={selectedRange}
          onChange={handleRangeChange}
          placeholder="Select time range"
          className="min-w-[140px]"
        />
      </div>
      {/* Live Indicator */}
      <button
        onClick={handleLiveToggle}
        className={`
          flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium
          transition-all duration-200 hover:scale-105
          ${getLiveIndicatorStyling()}
        `}
        title={isLive ? 'Live updates enabled' : 'Live updates paused'}
      >
        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`}></div>
        <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
      </button>
      {/* Custom Range Picker Modal */}
      {showCustomPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-popover border border-border rounded-lg shadow-soft-lg w-96 max-w-[90vw] animate-fadeIn">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Custom Time Range</h3>
                <button
                  onClick={() => setShowCustomPicker(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Start Date/Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customRange?.startDate}
                    onChange={(e) => setCustomRange(prev => ({ ...prev, startDate: e?.target?.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={customRange?.startTime}
                    onChange={(e) => setCustomRange(prev => ({ ...prev, startTime: e?.target?.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* End Date/Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customRange?.endDate}
                    onChange={(e) => setCustomRange(prev => ({ ...prev, endDate: e?.target?.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={customRange?.endTime}
                    onChange={(e) => setCustomRange(prev => ({ ...prev, endTime: e?.target?.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quick Presets
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Today', days: 0 },
                    { label: 'Yesterday', days: 1 },
                    { label: 'Last 7 days', days: 7 }
                  ]?.map((preset) => (
                    <button
                      key={preset?.label}
                      onClick={() => {
                        const endDate = new Date();
                        const startDate = new Date();
                        startDate?.setDate(endDate?.getDate() - preset?.days);
                        
                        setCustomRange({
                          startDate: startDate?.toISOString()?.split('T')?.[0],
                          endDate: endDate?.toISOString()?.split('T')?.[0],
                          startTime: '00:00',
                          endTime: '23:59'
                        });
                      }}
                      className="px-3 py-2 text-xs border border-border rounded-md hover:bg-muted transition-colors"
                    >
                      {preset?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowCustomPicker(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomRangeSubmit}
                disabled={!customRange?.startDate || !customRange?.endDate}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangeSelector;