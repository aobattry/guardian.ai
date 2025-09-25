import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import TimeRangeSelector from '../../../components/ui/TimeRangeSelector';
import ConnectionStatusMonitor from '../../../components/ui/ConnectionStatusMonitor';

const FleetControlPanel = ({ 
  selectedFleet,
  onFleetChange,
  timeRange,
  onTimeRangeChange,
  isLiveMode,
  onLiveModeToggle,
  autoRefresh,
  onAutoRefreshToggle,
  onExportData,
  onRefreshData
}) => {
  const [isExporting, setIsExporting] = useState(false);

  // Fleet options
  const fleetOptions = [
    { value: 'all', label: 'All Fleets', description: 'Monitor all fleet vehicles' },
    { value: 'fleet-a', label: 'Fleet Alpha', description: 'Long-haul delivery vehicles' },
    { value: 'fleet-b', label: 'Fleet Beta', description: 'Local distribution trucks' },
    { value: 'fleet-c', label: 'Fleet Gamma', description: 'Emergency response vehicles' },
    { value: 'fleet-d', label: 'Fleet Delta', description: 'Maintenance and service vehicles' }
  ];

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (onExportData) {
        await onExportData();
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Get live mode styling
  const getLiveModeStyling = () => {
    return isLiveMode ? {
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    } : {
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      borderColor: 'border-border'
    };
  };

  const liveModeStyling = getLiveModeStyling();

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Fleet Selection and Time Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Fleet Selector */}
          <div className="flex items-center space-x-2">
            <Icon name="Truck" size={18} className="text-primary" />
            <Select
              options={fleetOptions}
              value={selectedFleet}
              onChange={onFleetChange}
              placeholder="Select fleet"
              className="min-w-[160px]"
            />
          </div>

          {/* Time Range Selector */}
          <TimeRangeSelector
            value={timeRange}
            onChange={onTimeRangeChange}
            className="min-w-[200px]"
          />
        </div>

        {/* Right Section - Status and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Connection Status */}
          <ConnectionStatusMonitor 
            showDetails={false} 
            onStatusChange={() => {}} 
          />

          {/* Live Mode Toggle */}
          <button
            onClick={onLiveModeToggle}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium
              transition-all duration-200 hover:scale-105
              ${liveModeStyling?.bgColor} ${liveModeStyling?.borderColor} ${liveModeStyling?.color}
            `}
            title={isLiveMode ? 'Switch to historical data mode' : 'Switch to live data mode'}
          >
            <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`}></div>
            <span>{isLiveMode ? 'LIVE' : 'DEMO'}</span>
            <Icon name={isLiveMode ? 'Radio' : 'Database'} size={14} />
          </button>

          {/* Auto Refresh Toggle */}
          <button
            onClick={onAutoRefreshToggle}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium
              transition-all duration-200 hover:scale-105
              ${autoRefresh 
                ? 'bg-primary/10 border-primary/20 text-primary' :'bg-muted border-border text-muted-foreground'
              }
            `}
            title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
          >
            <Icon name={autoRefresh ? 'RotateCcw' : 'Pause'} size={14} className={autoRefresh ? 'animate-spin' : ''} />
            <span>Auto</span>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshData}
              iconName="RefreshCw"
              iconPosition="left"
              title="Refresh data manually"
            >
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              loading={isExporting}
              iconName="Download"
              iconPosition="left"
              title="Export current data to CSV"
            >
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Status Bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>Fleet: {fleetOptions?.find(f => f?.value === selectedFleet)?.label || 'All Fleets'}</span>
          <span>•</span>
          <span>Range: {timeRange}</span>
          <span>•</span>
          <span>Mode: {isLiveMode ? 'Live Data' : 'Demo Data'}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={12} />
          <span>Last Updated: {new Date()?.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default FleetControlPanel;