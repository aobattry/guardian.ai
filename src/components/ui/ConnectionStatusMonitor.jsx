import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ConnectionStatusMonitor = ({ 
  className = "",
  showDetails = false,
  onStatusChange 
}) => {
  const [connectionStatus, setConnectionStatus] = useState({
    overall: 'connected', // connected, degraded, disconnected
    devices: {
      connected: 45,
      total: 50
    },
    latency: 23,
    lastUpdate: new Date(),
    dataFreshness: 'live'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate real-time connection monitoring
  useEffect(() => {
    const checkConnection = () => {
      // Simulate connection status changes
      const statuses = ['connected', 'degraded', 'disconnected'];
      const weights = [0.7, 0.25, 0.05]; // Probability weights
      
      let randomValue = Math.random();
      let selectedStatus = statuses?.[0];
      
      for (let i = 0; i < weights?.length; i++) {
        if (randomValue < weights?.[i]) {
          selectedStatus = statuses?.[i];
          break;
        }
        randomValue -= weights?.[i];
      }

      // Simulate device connectivity
      const totalDevices = 50;
      let connectedDevices;
      
      switch (selectedStatus) {
        case 'connected':
          connectedDevices = Math.floor(totalDevices * (0.9 + Math.random() * 0.1));
          break;
        case 'degraded':
          connectedDevices = Math.floor(totalDevices * (0.7 + Math.random() * 0.2));
          break;
        case 'disconnected':
          connectedDevices = Math.floor(totalDevices * (0.3 + Math.random() * 0.4));
          break;
        default:
          connectedDevices = totalDevices;
      }

      const newStatus = {
        overall: selectedStatus,
        devices: {
          connected: connectedDevices,
          total: totalDevices
        },
        latency: selectedStatus === 'connected' ? 
          Math.floor(15 + Math.random() * 20) : 
          Math.floor(50 + Math.random() * 200),
        lastUpdate: new Date(),
        dataFreshness: selectedStatus === 'connected' ? 'live' : 'delayed'
      };

      setConnectionStatus(newStatus);
      
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    };

    // Initial check
    checkConnection();
    
    // Set up interval for periodic checks
    const interval = setInterval(checkConnection, 15000); // Check every 15 seconds
    
    return () => clearInterval(interval);
  }, [onStatusChange]);

  // Get status styling
  const getStatusStyling = () => {
    switch (connectionStatus?.overall) {
      case 'connected':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          icon: 'Wifi',
          label: 'Connected'
        };
      case 'degraded':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'WifiOff',
          label: 'Degraded'
        };
      case 'disconnected':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'WifiOff',
          label: 'Disconnected'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: 'Wifi',
          label: 'Unknown'
        };
    }
  };

  const styling = getStatusStyling();

  // Calculate connection percentage
  const connectionPercentage = Math.round(
    (connectionStatus?.devices?.connected / connectionStatus?.devices?.total) * 100
  );

  // Format last update time
  const getLastUpdateText = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - connectionStatus?.lastUpdate) / 1000);
    
    if (diffInSeconds < 30) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Status Indicator */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg border
          transition-all duration-250 ease-out-smooth
          ${styling?.bgColor} ${styling?.borderColor}
          hover:shadow-soft-md hover:scale-105
        `}
        title={`System ${styling?.label} - ${connectionPercentage}% devices online`}
      >
        <Icon 
          name={styling?.icon} 
          size={16} 
          className={styling?.color}
        />
        
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${styling?.color}`}>
            {styling?.label}
          </span>
          
          {showDetails && (
            <span className="text-xs text-muted-foreground font-mono">
              {connectionPercentage}%
            </span>
          )}
        </div>

        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`text-muted-foreground transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-soft-lg z-50 animate-fadeIn">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Connection Status</h3>
              <div className={`flex items-center space-x-1 text-xs ${styling?.color}`}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                <span>{connectionStatus?.dataFreshness}</span>
              </div>
            </div>

            {/* Device Connectivity */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Device Connectivity</span>
                  <span className="font-medium text-foreground">
                    {connectionStatus?.devices?.connected}/{connectionStatus?.devices?.total}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      connectionPercentage >= 90 ? 'bg-success' :
                      connectionPercentage >= 70 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${connectionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Network Latency */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network Latency</span>
                <span className={`text-sm font-mono ${
                  connectionStatus?.latency < 50 ? 'text-success' :
                  connectionStatus?.latency < 100 ? 'text-warning' : 'text-error'
                }`}>
                  {connectionStatus?.latency}ms
                </span>
              </div>

              {/* Last Update */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Update</span>
                <span className="text-sm font-mono text-foreground">
                  {getLastUpdateText()}
                </span>
              </div>

              {/* Status Details */}
              <div className="pt-3 border-t border-border">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={12} className="text-success" />
                    <span className="text-muted-foreground">Online: {connectionStatus?.devices?.connected}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="XCircle" size={12} className="text-error" />
                    <span className="text-muted-foreground">
                      Offline: {connectionStatus?.devices?.total - connectionStatus?.devices?.connected}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusMonitor;