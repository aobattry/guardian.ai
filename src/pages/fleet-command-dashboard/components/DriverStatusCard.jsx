import React from 'react';
import Icon from '../../../components/AppIcon';

const DriverStatusCard = ({ 
  driver,
  onClick 
}) => {
  // Get health status styling
  const getHealthStatusStyling = (status) => {
    switch (status) {
      case 'critical':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          label: 'Critical'
        };
      case 'warning':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          label: 'Warning'
        };
      case 'good':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          label: 'Good'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          label: 'Unknown'
        };
    }
  };

  // Get connection status styling
  const getConnectionStyling = (isConnected) => {
    return isConnected ? {
      color: 'text-success',
      bgColor: 'bg-success',
      label: 'Connected'
    } : {
      color: 'text-error',
      bgColor: 'bg-error',
      label: 'Disconnected'
    };
  };

  // Get battery level styling
  const getBatteryLevelStyling = (level) => {
    if (level > 50) return 'text-success';
    if (level > 20) return 'text-warning';
    return 'text-error';
  };

  // Get battery icon based on level
  const getBatteryIcon = (level) => {
    if (level > 75) return 'Battery';
    if (level > 50) return 'Battery';
    if (level > 25) return 'Battery';
    return 'BatteryLow';
  };

  const healthStyling = getHealthStatusStyling(driver?.healthStatus);
  const connectionStyling = getConnectionStyling(driver?.isConnected);

  return (
    <div 
      className={`
        bg-card border rounded-lg p-4 transition-all duration-250 ease-out-smooth
        hover:shadow-soft-md hover:scale-105 cursor-pointer
        ${healthStyling?.borderColor}
      `}
      onClick={() => onClick && onClick(driver)}
    >
      {/* Driver Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              {driver?.avatar ? (
                <img 
                  src={driver?.avatar} 
                  alt={driver?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <Icon name="User" size={20} color="white" />
              )}
            </div>
            {/* Connection Status Indicator */}
            <div className={`
              absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card
              ${connectionStyling?.bgColor}
            `}></div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-foreground">{driver?.name}</h4>
            <p className="text-xs text-muted-foreground">ID: {driver?.id}</p>
          </div>
        </div>

        {/* Health Status Badge */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${healthStyling?.bgColor} ${healthStyling?.color}`}>
          {healthStyling?.label}
        </div>
      </div>
      {/* Biometric Data */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Heart" size={14} className="text-error mr-1" />
          </div>
          <div className="text-sm font-medium text-foreground">{driver?.heartRate}</div>
          <div className="text-xs text-muted-foreground">bpm</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Activity" size={14} className="text-primary mr-1" />
          </div>
          <div className="text-sm font-medium text-foreground">{driver?.spO2}</div>
          <div className="text-xs text-muted-foreground">%</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Thermometer" size={14} className="text-warning mr-1" />
          </div>
          <div className="text-sm font-medium text-foreground">{driver?.temperature}</div>
          <div className="text-xs text-muted-foreground">°C</div>
        </div>
      </div>
      {/* Location and Vehicle Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2 text-xs">
          <Icon name="MapPin" size={12} className="text-muted-foreground" />
          <span className="text-muted-foreground truncate">{driver?.location}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs">
          <Icon name="Truck" size={12} className="text-muted-foreground" />
          <span className="text-muted-foreground">{driver?.vehicleId}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{driver?.speed} mph</span>
        </div>
      </div>
      {/* Device Status */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon 
            name={getBatteryIcon(driver?.batteryLevel)} 
            size={14} 
            className={getBatteryLevelStyling(driver?.batteryLevel)} 
          />
          <span className={`text-xs font-medium ${getBatteryLevelStyling(driver?.batteryLevel)}`}>
            {driver?.batteryLevel}%
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${connectionStyling?.bgColor}`}></div>
          <span className={`text-xs ${connectionStyling?.color}`}>
            {connectionStyling?.label}
          </span>
        </div>
      </div>
      {/* Alert Indicators */}
      {driver?.activeAlerts && driver?.activeAlerts?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={12} className="text-warning" />
            <span className="text-xs text-warning font-medium">
              {driver?.activeAlerts?.length} Active Alert{driver?.activeAlerts?.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverStatusCard;