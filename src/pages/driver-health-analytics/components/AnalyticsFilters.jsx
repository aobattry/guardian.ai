import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const AnalyticsFilters = ({ 
  onFiltersChange,
  className = ""
}) => {
  const [filters, setFilters] = useState({
    drivers: ['all'],
    metrics: ['heartRate'],
    dateRange: '7d',
    comparisonMode: false,
    shiftPattern: 'all',
    routeType: 'all',
    environmentalConditions: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Driver options
  const driverOptions = [
    { value: 'all', label: 'All Drivers', description: 'Include all active drivers' },
    { value: 'DRV-2024-001', label: 'Michael Rodriguez', description: 'Senior Driver - Route A' },
    { value: 'DRV-2024-002', label: 'Sarah Johnson', description: 'Lead Driver - Route B' },
    { value: 'DRV-2024-003', label: 'David Chen', description: 'Driver - Route C' },
    { value: 'DRV-2024-004', label: 'Emily Davis', description: 'Driver - Route D' },
    { value: 'DRV-2024-005', label: 'James Wilson', description: 'Night Shift Driver' }
  ];

  // Metric options
  const metricOptions = [
    { value: 'heartRate', label: 'Heart Rate', description: 'Beats per minute monitoring' },
    { value: 'spO2', label: 'SpO₂', description: 'Blood oxygen saturation levels' },
    { value: 'temperature', label: 'Body Temperature', description: 'Core body temperature tracking' }
  ];

  // Date range options
  const dateRangeOptions = [
    { value: '24h', label: 'Last 24 Hours', description: 'Hourly data points' },
    { value: '7d', label: 'Last 7 Days', description: 'Daily aggregated data' },
    { value: '30d', label: 'Last 30 Days', description: 'Weekly aggregated data' },
    { value: 'custom', label: 'Custom Range', description: 'Select specific date range' }
  ];

  // Shift pattern options
  const shiftPatternOptions = [
    { value: 'all', label: 'All Shifts', description: 'Include all shift patterns' },
    { value: 'morning', label: 'Morning Shift', description: '06:00 - 14:00' },
    { value: 'afternoon', label: 'Afternoon Shift', description: '14:00 - 22:00' },
    { value: 'night', label: 'Night Shift', description: '22:00 - 06:00' },
    { value: 'split', label: 'Split Shift', description: 'Multiple shift periods' }
  ];

  // Route type options
  const routeTypeOptions = [
    { value: 'all', label: 'All Routes', description: 'Include all route types' },
    { value: 'urban', label: 'Urban Routes', description: 'City and suburban areas' },
    { value: 'highway', label: 'Highway Routes', description: 'Long-distance highway driving' },
    { value: 'mixed', label: 'Mixed Routes', description: 'Combination of urban and highway' },
    { value: 'delivery', label: 'Delivery Routes', description: 'Stop-and-go delivery patterns' }
  ];

  // Environmental conditions options
  const environmentalOptions = [
    { value: 'all', label: 'All Conditions', description: 'Include all weather conditions' },
    { value: 'normal', label: 'Normal Weather', description: 'Clear, mild conditions' },
    { value: 'hot', label: 'Hot Weather', description: 'Temperature above 85°F' },
    { value: 'cold', label: 'Cold Weather', description: 'Temperature below 40°F' },
    { value: 'rain', label: 'Rainy Conditions', description: 'Wet weather driving' },
    { value: 'snow', label: 'Snow/Ice', description: 'Winter weather conditions' }
  ];

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  // Handle multiple driver selection
  const handleDriverChange = (value) => {
    let newDrivers;
    if (value === 'all') {
      newDrivers = ['all'];
    } else {
      newDrivers = filters?.drivers?.includes('all') 
        ? [value] 
        : filters?.drivers?.includes(value)
          ? filters?.drivers?.filter(d => d !== value)
          : [...filters?.drivers, value];
      
      if (newDrivers?.length === 0) {
        newDrivers = ['all'];
      }
    }
    
    handleFilterChange('drivers', newDrivers);
  };

  // Handle multiple metric selection
  const handleMetricChange = (value) => {
    const newMetrics = filters?.metrics?.includes(value)
      ? filters?.metrics?.filter(m => m !== value)
      : [...filters?.metrics, value];
    
    if (newMetrics?.length === 0) {
      return; // Don't allow empty selection
    }
    
    handleFilterChange('metrics', newMetrics);
  };

  // Reset filters
  const handleReset = () => {
    const defaultFilters = {
      drivers: ['all'],
      metrics: ['heartRate'],
      dateRange: '7d',
      comparisonMode: false,
      shiftPattern: 'all',
      routeType: 'all',
      environmentalConditions: 'all'
    };
    
    setFilters(defaultFilters);
    if (onFiltersChange) {
      onFiltersChange(defaultFilters);
    }
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.drivers?.length > 1 || !filters?.drivers?.includes('all')) count++;
    if (filters?.metrics?.length > 1) count++;
    if (filters?.dateRange !== '7d') count++;
    if (filters?.comparisonMode) count++;
    if (filters?.shiftPattern !== 'all') count++;
    if (filters?.routeType !== 'all') count++;
    if (filters?.environmentalConditions !== 'all') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Filter Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Analytics Filters</h3>
            </div>
            
            {activeFilterCount > 0 && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                <Icon name="CheckCircle" size={12} />
                <span>{activeFilterCount} active</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              onClick={handleReset}
              disabled={activeFilterCount === 0}
            >
              Reset
            </Button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <span>{isExpanded ? 'Less' : 'More'}</span>
              <Icon 
                name="ChevronDown" 
                size={14} 
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>
      {/* Primary Filters */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Driver Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Drivers
          </label>
          <div className="space-y-2">
            {driverOptions?.slice(0, 4)?.map(option => (
              <label key={option?.value} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters?.drivers?.includes(option?.value)}
                  onChange={() => handleDriverChange(option?.value)}
                  className="rounded border-border"
                />
                <span className="text-foreground">{option?.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Metric Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Health Metrics
          </label>
          <div className="space-y-2">
            {metricOptions?.map(option => (
              <label key={option?.value} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters?.metrics?.includes(option?.value)}
                  onChange={() => handleMetricChange(option?.value)}
                  className="rounded border-border"
                />
                <span className="text-foreground">{option?.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <Select
            label="Time Period"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
        </div>

        {/* Comparison Mode */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Analysis Mode
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters?.comparisonMode}
                onChange={(e) => handleFilterChange('comparisonMode', e?.target?.checked)}
                className="rounded border-border"
              />
              <span className="text-foreground">Individual Driver Comparison</span>
            </label>
          </div>
        </div>
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Shift Pattern"
              description="Filter by work shift timing"
              options={shiftPatternOptions}
              value={filters?.shiftPattern}
              onChange={(value) => handleFilterChange('shiftPattern', value)}
            />
            
            <Select
              label="Route Type"
              description="Filter by driving route characteristics"
              options={routeTypeOptions}
              value={filters?.routeType}
              onChange={(value) => handleFilterChange('routeType', value)}
            />
            
            <Select
              label="Environmental Conditions"
              description="Filter by weather and driving conditions"
              options={environmentalOptions}
              value={filters?.environmentalConditions}
              onChange={(value) => handleFilterChange('environmentalConditions', value)}
            />
          </div>
        </div>
      )}
      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="p-4 border-t border-border bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Info" size={14} className="text-primary" />
              <span className="text-foreground font-medium">Active Filters:</span>
              <div className="flex items-center space-x-2">
                {filters?.drivers?.length > 1 || !filters?.drivers?.includes('all') ? (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                    {filters?.drivers?.length === 1 ? 'Specific Driver' : `${filters?.drivers?.length} Drivers`}
                  </span>
                ) : null}
                
                {filters?.metrics?.length > 1 && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                    {filters?.metrics?.length} Metrics
                  </span>
                )}
                
                {filters?.comparisonMode && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                    Comparison Mode
                  </span>
                )}
              </div>
            </div>
            
            <span className="text-xs text-muted-foreground">
              Filters will update charts and data in real-time
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;