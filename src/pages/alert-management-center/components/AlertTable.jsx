import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AlertTable = ({ 
  alerts = [],
  onAlertSelect,
  onBulkAction,
  onStatusUpdate,
  onAssignAlert,
  selectedAlerts = [],
  className = ""
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Mock alert data
  const mockAlerts = [
    {
      id: 'ALT-2024-001',
      type: 'health',
      severity: 'critical',
      title: 'Abnormal Heart Rate Detected',
      description: 'Driver John Smith showing heart rate of 145 BPM for 5+ minutes',
      driverName: 'John Smith',
      driverId: 'DRV-001',
      vehicleId: 'VEH-101',
      timestamp: new Date(Date.now() - 300000),
      status: 'unassigned',
      assignedTo: null,
      location: 'Highway 101, Mile 45',
      deviceId: 'DEV-001',
      priority: 1,
      escalated: false,
      responseTime: null,
      healthMetrics: {
        heartRate: 145,
        spO2: 94,
        temperature: 99.2
      }
    },
    {
      id: 'ALT-2024-002',
      type: 'location',
      severity: 'high',
      title: 'Geofence Violation',
      description: 'Vehicle departed from authorized route without approval',
      driverName: 'Maria Garcia',
      driverId: 'DRV-002',
      vehicleId: 'VEH-102',
      timestamp: new Date(Date.now() - 600000),
      status: 'assigned',
      assignedTo: 'Sarah Chen',
      location: 'Downtown District',
      deviceId: 'DEV-002',
      priority: 2,
      escalated: false,
      responseTime: 3.5,
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
      id: 'ALT-2024-003',
      type: 'device',
      severity: 'medium',
      title: 'Low Battery Warning',
      description: 'Wearable device battery below 15% threshold',
      driverName: 'Robert Johnson',
      driverId: 'DRV-003',
      vehicleId: 'VEH-103',
      timestamp: new Date(Date.now() - 900000),
      status: 'in_progress',
      assignedTo: 'Mike Wilson',
      location: 'Service Station A',
      deviceId: 'DEV-003',
      priority: 3,
      escalated: false,
      responseTime: 2.1,
      batteryLevel: 12
    },
    {
      id: 'ALT-2024-004',
      type: 'health',
      severity: 'high',
      title: 'Low SpO2 Reading',
      description: 'Oxygen saturation dropped to 89% during route',
      driverName: 'Lisa Anderson',
      driverId: 'DRV-004',
      vehicleId: 'VEH-104',
      timestamp: new Date(Date.now() - 1200000),
      status: 'escalated',
      assignedTo: 'Sarah Chen',
      location: 'Mountain Pass Route',
      deviceId: 'DEV-004',
      priority: 2,
      escalated: true,
      responseTime: 1.8,
      healthMetrics: {
        heartRate: 88,
        spO2: 89,
        temperature: 98.6
      }
    },
    {
      id: 'ALT-2024-005',
      type: 'location',
      severity: 'low',
      title: 'Extended Stop Duration',
      description: 'Vehicle stationary for 45+ minutes without scheduled break',
      driverName: 'David Brown',
      driverId: 'DRV-005',
      vehicleId: 'VEH-105',
      timestamp: new Date(Date.now() - 1800000),
      status: 'resolved',
      assignedTo: 'Mike Wilson',
      location: 'Rest Area B',
      deviceId: 'DEV-005',
      priority: 4,
      escalated: false,
      responseTime: 12.3,
      stopDuration: 47
    }
  ];

  const displayAlerts = alerts?.length > 0 ? alerts : mockAlerts;

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort alerts
  const sortedAlerts = [...displayAlerts]?.sort((a, b) => {
    if (sortConfig?.key === 'timestamp') {
      return sortConfig?.direction === 'asc' 
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp);
    }
    
    if (sortConfig?.key === 'severity') {
      const severityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
      return sortConfig?.direction === 'asc'
        ? severityOrder?.[a?.severity] - severityOrder?.[b?.severity]
        : severityOrder?.[b?.severity] - severityOrder?.[a?.severity];
    }
    
    if (sortConfig?.key === 'priority') {
      return sortConfig?.direction === 'asc'
        ? a?.priority - b?.priority
        : b?.priority - a?.priority;
    }
    
    const aValue = a?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    const bValue = b?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
    
    return sortConfig?.direction === 'asc'
      ? aValue?.localeCompare(bValue)
      : bValue?.localeCompare(aValue);
  });

  // Handle row expansion
  const toggleRowExpansion = (alertId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(alertId)) {
      newExpanded?.delete(alertId);
    } else {
      newExpanded?.add(alertId);
    }
    setExpandedRows(newExpanded);
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (onBulkAction) {
      onBulkAction(checked ? sortedAlerts?.map(alert => alert?.id) : []);
    }
  };

  // Handle individual selection
  const handleAlertSelection = (alertId, checked) => {
    if (onAlertSelect) {
      onAlertSelect(alertId, checked);
    }
  };

  // Get severity styling
  const getSeverityStyling = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error/10 border-error/20';
      case 'high':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'medium':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'low':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  // Get status styling
  const getStatusStyling = (status) => {
    switch (status) {
      case 'unassigned':
        return 'text-error bg-error/10';
      case 'assigned':
        return 'text-warning bg-warning/10';
      case 'in_progress':
        return 'text-primary bg-primary/10';
      case 'resolved':
        return 'text-success bg-success/10';
      case 'escalated':
        return 'text-error bg-error/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  // Get alert type icon
  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'health':
        return 'Heart';
      case 'location':
        return 'MapPin';
      case 'device':
        return 'Smartphone';
      default:
        return 'AlertTriangle';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(timestamp)) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return new Date(timestamp)?.toLocaleDateString();
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={selectAll}
              onChange={(e) => handleSelectAll(e?.target?.checked)}
              label={`Select all (${sortedAlerts?.length})`}
            />
            {selectedAlerts?.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="UserPlus"
                  onClick={() => onBulkAction && onBulkAction('assign', selectedAlerts)}
                >
                  Assign
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="CheckCircle"
                  onClick={() => onBulkAction && onBulkAction('acknowledge', selectedAlerts)}
                >
                  Acknowledge
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="TrendingUp"
                  onClick={() => onBulkAction && onBulkAction('escalate', selectedAlerts)}
                >
                  Escalate
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="RefreshCw" size={16} className="animate-spin" />
            <span>Auto-refresh: 10s</span>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-3"></th>
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('severity')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Alert</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('driverName')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Driver</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Time</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-3">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-3">Assignment</th>
              <th className="w-16 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAlerts?.map((alert) => (
              <React.Fragment key={alert?.id}>
                <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedAlerts?.includes(alert?.id)}
                      onChange={(e) => handleAlertSelection(alert?.id, e?.target?.checked)}
                    />
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getSeverityStyling(alert?.severity)?.split(' ')?.[1]}`}>
                        <Icon 
                          name={getAlertTypeIcon(alert?.type)} 
                          size={16} 
                          className={getSeverityStyling(alert?.severity)?.split(' ')?.[0]}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground text-sm truncate">
                            {alert?.title}
                          </h4>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getSeverityStyling(alert?.severity)}`}>
                            {alert?.severity}
                          </span>
                          {alert?.escalated && (
                            <Icon name="TrendingUp" size={14} className="text-error" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {alert?.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground font-mono">
                            {alert?.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            • {alert?.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="User" size={14} color="white" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          {alert?.driverName}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {alert?.driverId} • {alert?.vehicleId}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="text-sm text-foreground">
                      {formatTimestamp(alert?.timestamp)}
                    </div>
                    {alert?.responseTime && (
                      <div className="text-xs text-muted-foreground">
                        Response: {alert?.responseTime}min
                      </div>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyling(alert?.status)}`}>
                      {alert?.status?.replace('_', ' ')}
                    </span>
                  </td>
                  
                  <td className="p-3">
                    {alert?.assignedTo ? (
                      <div className="text-sm text-foreground">
                        {alert?.assignedTo}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="UserPlus"
                        onClick={() => onAssignAlert && onAssignAlert(alert?.id)}
                      >
                        Assign
                      </Button>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <button
                      onClick={() => toggleRowExpansion(alert?.id)}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon 
                        name="ChevronDown" 
                        size={16} 
                        className={`transition-transform duration-200 ${
                          expandedRows?.has(alert?.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedRows?.has(alert?.id) && (
                  <tr className="bg-muted/20">
                    <td colSpan="7" className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Health Metrics */}
                        {alert?.healthMetrics && (
                          <div className="space-y-2">
                            <h5 className="font-medium text-foreground text-sm">Health Metrics</h5>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Heart Rate:</span>
                                <span className="font-mono text-foreground">{alert?.healthMetrics?.heartRate} BPM</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">SpO₂:</span>
                                <span className="font-mono text-foreground">{alert?.healthMetrics?.spO2}%</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Temperature:</span>
                                <span className="font-mono text-foreground">{alert?.healthMetrics?.temperature}°F</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Device Information */}
                        <div className="space-y-2">
                          <h5 className="font-medium text-foreground text-sm">Device Info</h5>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Device ID:</span>
                              <span className="font-mono text-foreground">{alert?.deviceId}</span>
                            </div>
                            {alert?.batteryLevel && (
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Battery:</span>
                                <span className="font-mono text-foreground">{alert?.batteryLevel}%</span>
                              </div>
                            )}
                            {alert?.coordinates && (
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Coordinates:</span>
                                <span className="font-mono text-foreground">
                                  {alert?.coordinates?.lat?.toFixed(4)}, {alert?.coordinates?.lng?.toFixed(4)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="space-y-2">
                          <h5 className="font-medium text-foreground text-sm">Quick Actions</h5>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="Phone"
                              onClick={() => {/* Handle call driver */}}
                            >
                              Call Driver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="MapPin"
                              onClick={() => {/* Handle view location */}}
                            >
                              View Location
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="FileText"
                              onClick={() => {/* Handle view details */}}
                            >
                              Full Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {sortedAlerts?.length} alerts</span>
          <div className="flex items-center space-x-2">
            <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertTable;