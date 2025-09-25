import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertMap = ({ 
  alerts = [],
  onAlertSelect,
  className = ""
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showClusters, setShowClusters] = useState(true);
  const [mapView, setMapView] = useState('satellite'); // satellite, roadmap, terrain

  // Mock alert locations for demonstration
  const mockAlertLocations = [
    {
      id: 'ALT-2024-001',
      lat: 37.7849,
      lng: -122.4094,
      severity: 'critical',
      type: 'health',
      title: 'Abnormal Heart Rate',
      driverName: 'John Smith',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 'ALT-2024-002',
      lat: 37.7649,
      lng: -122.4294,
      severity: 'high',
      type: 'location',
      title: 'Geofence Violation',
      driverName: 'Maria Garcia',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 'ALT-2024-003',
      lat: 37.7749,
      lng: -122.4394,
      severity: 'medium',
      type: 'device',
      title: 'Low Battery Warning',
      driverName: 'Robert Johnson',
      timestamp: new Date(Date.now() - 900000)
    },
    {
      id: 'ALT-2024-004',
      lat: 37.7949,
      lng: -122.4194,
      severity: 'high',
      type: 'health',
      title: 'Low SpO2 Reading',
      driverName: 'Lisa Anderson',
      timestamp: new Date(Date.now() - 1200000)
    },
    {
      id: 'ALT-2024-005',
      lat: 37.7549,
      lng: -122.4494,
      severity: 'low',
      type: 'location',
      title: 'Extended Stop Duration',
      driverName: 'David Brown',
      timestamp: new Date(Date.now() - 1800000)
    }
  ];

  const displayAlerts = alerts?.length > 0 ? alerts : mockAlertLocations;

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#DC2626'; // red-600
      case 'high':
        return '#D97706'; // amber-600
      case 'medium':
        return '#1E40AF'; // blue-800
      case 'low':
        return '#6B7280'; // gray-500
      default:
        return '#6B7280';
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

  // Handle alert marker click
  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    if (onAlertSelect) {
      onAlertSelect(alert);
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

  // Generate Google Maps embed URL
  const generateMapUrl = () => {
    const baseUrl = 'https://www.google.com/maps/embed/v1/view';
    const apiKey = 'demo'; // In real implementation, use actual API key
    const center = `${mapCenter?.lat},${mapCenter?.lng}`;
    const zoom = 12;
    const maptype = mapView;
    
    return `https://www.google.com/maps?q=${center}&z=${zoom}&output=embed&maptype=${maptype}`;
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-foreground">Alert Geographic Distribution</h3>
            <p className="text-sm text-muted-foreground">
              Real-time alert locations with severity clustering
            </p>
          </div>
          
          {/* Map Controls */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              {[
                { key: 'roadmap', label: 'Road', icon: 'Map' },
                { key: 'satellite', label: 'Satellite', icon: 'Satellite' },
                { key: 'terrain', label: 'Terrain', icon: 'Mountain' }
              ]?.map((view) => (
                <button
                  key={view?.key}
                  onClick={() => setMapView(view?.key)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    mapView === view?.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background'
                  }`}
                  title={view?.label}
                >
                  <Icon name={view?.icon} size={12} />
                  <span className="hidden sm:inline">{view?.label}</span>
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              iconName={showClusters ? 'Grid3X3' : 'Maximize2'}
              onClick={() => setShowClusters(!showClusters)}
            >
              {showClusters ? 'Clusters' : 'Individual'}
            </Button>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { severity: 'critical', count: displayAlerts?.filter(a => a?.severity === 'critical')?.length, color: 'text-error' },
            { severity: 'high', count: displayAlerts?.filter(a => a?.severity === 'high')?.length, color: 'text-warning' },
            { severity: 'medium', count: displayAlerts?.filter(a => a?.severity === 'medium')?.length, color: 'text-primary' },
            { severity: 'low', count: displayAlerts?.filter(a => a?.severity === 'low')?.length, color: 'text-muted-foreground' }
          ]?.map((item) => (
            <div key={item?.severity} className="text-center">
              <div className={`text-lg font-bold ${item?.color}`}>{item?.count}</div>
              <div className="text-xs text-muted-foreground capitalize">{item?.severity}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Map Container */}
      <div className="relative">
        {/* Google Maps Embed */}
        <div className="h-96 bg-muted relative overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Alert Distribution Map"
            referrerPolicy="no-referrer-when-downgrade"
            src={generateMapUrl()}
            className="border-0"
          />
          
          {/* Alert Markers Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {displayAlerts?.map((alert, index) => {
              // Calculate position based on lat/lng (simplified positioning)
              const xPos = 20 + (index * 15) % 80;
              const yPos = 20 + (index * 20) % 60;
              
              return (
                <div
                  key={alert?.id}
                  className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${xPos}%`, 
                    top: `${yPos}%` 
                  }}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div 
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-soft-lg flex items-center justify-center hover:scale-110 transition-transform ${
                      alert?.severity === 'critical' ? 'bg-error animate-pulse' :
                      alert?.severity === 'high' ? 'bg-warning' :
                      alert?.severity === 'medium' ? 'bg-primary' : 'bg-muted-foreground'
                    }`}
                  >
                    <Icon 
                      name={getAlertTypeIcon(alert?.type)} 
                      size={12} 
                      color="white" 
                    />
                  </div>
                  {/* Pulse animation for critical alerts */}
                  {alert?.severity === 'critical' && (
                    <div className="absolute inset-0 w-6 h-6 bg-error rounded-full animate-ping opacity-75"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Alert Details */}
        {selectedAlert && (
          <div className="absolute top-4 right-4 w-80 bg-popover border border-border rounded-lg shadow-soft-lg p-4 animate-fadeIn">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div 
                  className={`p-2 rounded-lg ${
                    selectedAlert?.severity === 'critical' ? 'bg-error/10' :
                    selectedAlert?.severity === 'high' ? 'bg-warning/10' :
                    selectedAlert?.severity === 'medium' ? 'bg-primary/10' : 'bg-muted'
                  }`}
                >
                  <Icon 
                    name={getAlertTypeIcon(selectedAlert?.type)} 
                    size={16} 
                    className={
                      selectedAlert?.severity === 'critical' ? 'text-error' :
                      selectedAlert?.severity === 'high' ? 'text-warning' :
                      selectedAlert?.severity === 'medium' ? 'text-primary' : 'text-muted-foreground'
                    }
                  />
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">{selectedAlert?.title}</h4>
                  <p className="text-xs text-muted-foreground">{selectedAlert?.id}</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Driver:</span>
                <span className="font-medium text-foreground">{selectedAlert?.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Severity:</span>
                <span className={`font-medium capitalize ${
                  selectedAlert?.severity === 'critical' ? 'text-error' :
                  selectedAlert?.severity === 'high' ? 'text-warning' :
                  selectedAlert?.severity === 'medium' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {selectedAlert?.severity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium text-foreground">{formatTimestamp(selectedAlert?.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-mono text-foreground text-xs">
                  {selectedAlert?.lat?.toFixed(4)}, {selectedAlert?.lng?.toFixed(4)}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                iconName="Phone"
                onClick={() => {/* Handle call driver */}}
              >
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Navigation"
                onClick={() => {/* Handle navigate */}}
              >
                Navigate
              </Button>
              <Button
                variant="primary"
                size="sm"
                iconName="Eye"
                onClick={() => {/* Handle view details */}}
              >
                Details
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Map Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              {displayAlerts?.length} alerts on map
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Live tracking</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RotateCcw"
              onClick={() => {/* Handle refresh */}}
            >
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Maximize2"
              onClick={() => {/* Handle fullscreen */}}
            >
              Fullscreen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertMap;