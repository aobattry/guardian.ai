import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import TimeRangeSelector from '../../../components/ui/TimeRangeSelector';

const AlertFilters = ({ 
  filters = {
    alertType: 'all',
    severity: 'all',
    assignmentStatus: 'all',
    timeRange: '24h'
  },
  onFiltersChange,
  alertCounts = {
    total: 47,
    health: 23,
    location: 15,
    device: 9
  }
}) => {
  const [activeFilters, setActiveFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Alert type options with counts
  const alertTypeOptions = [
    { value: 'all', label: `All Alerts (${alertCounts?.total})` },
    { value: 'health', label: `Health (${alertCounts?.health})` },
    { value: 'location', label: `Location (${alertCounts?.location})` },
    { value: 'device', label: `Device (${alertCounts?.device})` }
  ];

  // Severity options
  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  // Assignment status options
  const assignmentOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'escalated', label: 'Escalated' }
  ];

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    const defaultFilters = {
      alertType: 'all',
      severity: 'all',
      assignmentStatus: 'all',
      timeRange: '24h'
    };
    setActiveFilters(defaultFilters);
    
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  // Count active filters
  const getActiveFilterCount = () => {
    return Object.values(activeFilters)?.filter(value => value !== 'all' && value !== '24h')?.length;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Alert Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-1 hover:bg-muted rounded-md transition-colors"
          >
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>
      {/* Filter Controls */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${isExpanded ? 'block' : 'hidden lg:grid'}`}>
        {/* Alert Type Filter */}
        <div>
          <Select
            label="Alert Type"
            options={alertTypeOptions}
            value={activeFilters?.alertType}
            onChange={(value) => handleFilterChange('alertType', value)}
            className="w-full"
          />
        </div>

        {/* Severity Filter */}
        <div>
          <Select
            label="Severity Level"
            options={severityOptions}
            value={activeFilters?.severity}
            onChange={(value) => handleFilterChange('severity', value)}
            className="w-full"
          />
        </div>

        {/* Assignment Status Filter */}
        <div>
          <Select
            label="Assignment Status"
            options={assignmentOptions}
            value={activeFilters?.assignmentStatus}
            onChange={(value) => handleFilterChange('assignmentStatus', value)}
            className="w-full"
          />
        </div>

        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Time Range
          </label>
          <TimeRangeSelector
            value={activeFilters?.timeRange}
            onChange={(value) => handleFilterChange('timeRange', value)}
            presets={[
              { value: '1h', label: '1 Hour', description: 'Last hour' },
              { value: '4h', label: '4 Hours', description: 'Last 4 hours' },
              { value: '12h', label: '12 Hours', description: 'Last 12 hours' },
              { value: '24h', label: '24 Hours', description: 'Last 24 hours' },
              { value: '7d', label: '7 Days', description: 'Last 7 days' },
              { value: '30d', label: '30 Days', description: 'Last 30 days' },
              { value: 'custom', label: 'Custom Range', description: 'Select custom date range' }
            ]}
            className="w-full"
          />
        </div>
      </div>
      {/* Quick Filter Buttons */}
      <div className={`flex flex-wrap gap-2 mt-4 pt-4 border-t border-border ${isExpanded ? 'block' : 'hidden lg:flex'}`}>
        <button
          onClick={() => handleFilterChange('severity', 'critical')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeFilters?.severity === 'critical' ?'bg-error text-error-foreground' :'bg-error/10 text-error hover:bg-error/20'
          }`}
        >
          Critical Only
        </button>
        
        <button
          onClick={() => handleFilterChange('assignmentStatus', 'unassigned')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeFilters?.assignmentStatus === 'unassigned' ?'bg-warning text-warning-foreground' :'bg-warning/10 text-warning hover:bg-warning/20'
          }`}
        >
          Unassigned
        </button>
        
        <button
          onClick={() => handleFilterChange('alertType', 'health')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeFilters?.alertType === 'health' ?'bg-primary text-primary-foreground' :'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
        >
          Health Alerts
        </button>
        
        <button
          onClick={() => handleFilterChange('timeRange', '1h')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeFilters?.timeRange === '1h' ?'bg-secondary text-secondary-foreground' :'bg-secondary/10 text-secondary hover:bg-secondary/20'
          }`}
        >
          Last Hour
        </button>
      </div>
    </div>
  );
};

export default AlertFilters;