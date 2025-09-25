import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const AlertStatusIndicator = ({ 
  alertCounts = { critical: 0, warning: 0, info: 0 },
  onAlertClick,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Calculate total alerts
  const totalAlerts = alertCounts?.critical + alertCounts?.warning + alertCounts?.info;

  // Trigger animation when alert counts change
  useEffect(() => {
    if (totalAlerts > 0) {
      setIsAnimating(true);
      setLastUpdateTime(new Date());
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [alertCounts?.critical, alertCounts?.warning, alertCounts?.info, totalAlerts]);

  // Get priority alert level and styling
  const getPriorityAlert = () => {
    if (alertCounts?.critical > 0) {
      return {
        level: 'critical',
        count: alertCounts?.critical,
        color: 'text-error',
        bgColor: 'bg-error/10',
        borderColor: 'border-error/20',
        icon: 'AlertTriangle'
      };
    }
    if (alertCounts?.warning > 0) {
      return {
        level: 'warning',
        count: alertCounts?.warning,
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        icon: 'AlertCircle'
      };
    }
    if (alertCounts?.info > 0) {
      return {
        level: 'info',
        count: alertCounts?.info,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/20',
        icon: 'Info'
      };
    }
    return {
      level: 'none',
      count: 0,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      icon: 'CheckCircle'
    };
  };

  const priorityAlert = getPriorityAlert();

  // Handle click
  const handleClick = () => {
    if (onAlertClick) {
      onAlertClick(priorityAlert?.level, alertCounts);
    }
  };

  // Format time since last update
  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastUpdateTime) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Main Alert Indicator */}
      <button
        onClick={handleClick}
        className={`
          relative flex items-center space-x-2 px-3 py-2 rounded-lg border
          transition-all duration-300 ease-out-smooth
          ${priorityAlert?.bgColor} ${priorityAlert?.borderColor}
          hover:shadow-soft-md hover:scale-105
          ${isAnimating ? 'animate-pulse' : ''}
        `}
        title={`${totalAlerts} total alerts - Click to view details`}
      >
        <Icon 
          name={priorityAlert?.icon} 
          size={16} 
          className={`${priorityAlert?.color} ${isAnimating ? 'animate-pulse' : ''}`}
        />
        
        {totalAlerts > 0 ? (
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-medium ${priorityAlert?.color}`}>
              {totalAlerts > 99 ? '99+' : totalAlerts}
            </span>
            <span className="text-xs text-muted-foreground">
              {priorityAlert?.level}
            </span>
          </div>
        ) : (
          <span className={`text-sm font-medium ${priorityAlert?.color}`}>
            All Clear
          </span>
        )}

        {/* Pulse animation for critical alerts */}
        {alertCounts?.critical > 0 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-pulse">
            <div className="absolute inset-0 w-3 h-3 bg-error rounded-full animate-ping opacity-75"></div>
          </div>
        )}
      </button>
      {/* Detailed Breakdown (when expanded) */}
      {totalAlerts > 0 && (
        <div className="hidden lg:flex items-center space-x-3 text-xs">
          {alertCounts?.critical > 0 && (
            <div className="flex items-center space-x-1 text-error">
              <Icon name="AlertTriangle" size={12} />
              <span className="font-medium">{alertCounts?.critical}</span>
            </div>
          )}
          {alertCounts?.warning > 0 && (
            <div className="flex items-center space-x-1 text-warning">
              <Icon name="AlertCircle" size={12} />
              <span className="font-medium">{alertCounts?.warning}</span>
            </div>
          )}
          {alertCounts?.info > 0 && (
            <div className="flex items-center space-x-1 text-primary">
              <Icon name="Info" size={12} />
              <span className="font-medium">{alertCounts?.info}</span>
            </div>
          )}
          <div className="text-muted-foreground">
            • {getTimeSinceUpdate()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertStatusIndicator;