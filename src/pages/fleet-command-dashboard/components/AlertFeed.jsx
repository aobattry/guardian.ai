import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertFeed = ({ 
  alerts = [], 
  onAlertAcknowledge, 
  onAlertClick,
  maxHeight = '600px' 
}) => {
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  // Filter and sort alerts
  const filteredAlerts = alerts?.filter(alert => filterSeverity === 'all' || alert?.severity === filterSeverity)?.sort((a, b) => {
      switch (sortBy) {
        case 'severity':
          const severityOrder = { critical: 3, warning: 2, info: 1 };
          return severityOrder?.[b?.severity] - severityOrder?.[a?.severity];
        case 'timestamp':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

  // Get severity styling
  const getSeverityStyling = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'AlertTriangle'
        };
      case 'warning':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'AlertCircle'
        };
      case 'info':
        return {
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          icon: 'Info'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: 'Bell'
        };
    }
  };

  // Handle alert selection
  const handleAlertSelection = (alertId) => {
    setSelectedAlerts(prev => 
      prev?.includes(alertId) 
        ? prev?.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  // Handle bulk acknowledge
  const handleBulkAcknowledge = () => {
    if (onAlertAcknowledge && selectedAlerts?.length > 0) {
      selectedAlerts?.forEach(alertId => {
        onAlertAcknowledge(alertId);
      });
      setSelectedAlerts([]);
    }
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - alertTime) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Alert Feed Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Priority Alerts</h3>
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {filteredAlerts?.length}
            </span>
          </div>
          
          {selectedAlerts?.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkAcknowledge}
              iconName="Check"
              iconPosition="left"
            >
              Acknowledge ({selectedAlerts?.length})
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">Filter:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e?.target?.value)}
              className="text-xs border border-border rounded px-2 py-1 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-xs border border-border rounded px-2 py-1 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="timestamp">Latest First</option>
              <option value="severity">By Severity</option>
            </select>
          </div>
        </div>
      </div>
      {/* Alert List */}
      <div 
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {filteredAlerts?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
            <h4 className="text-lg font-medium text-foreground mb-2">All Clear!</h4>
            <p className="text-muted-foreground">No alerts match your current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAlerts?.map((alert) => {
              const styling = getSeverityStyling(alert?.severity);
              const isSelected = selectedAlerts?.includes(alert?.id);
              
              return (
                <div
                  key={alert?.id}
                  className={`
                    p-4 hover:bg-muted/50 transition-colors cursor-pointer
                    ${isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''}
                  `}
                  onClick={() => onAlertClick && onAlertClick(alert)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Selection Checkbox */}
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleAlertSelection(alert?.id);
                      }}
                      className="mt-1 w-4 h-4 border border-border rounded flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      {isSelected && (
                        <Icon name="Check" size={12} className="text-primary" />
                      )}
                    </button>

                    {/* Alert Icon */}
                    <div className={`p-2 rounded-lg ${styling?.bgColor} mt-0.5`}>
                      <Icon name={styling?.icon} size={16} className={styling?.color} />
                    </div>

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {alert?.title}
                        </h4>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${styling?.bgColor} ${styling?.color}`}>
                            {alert?.severity?.toUpperCase()}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimeAgo(alert?.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {alert?.description}
                      </p>
                      
                      {/* Alert Metadata */}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {alert?.driverName && (
                          <div className="flex items-center space-x-1">
                            <Icon name="User" size={12} />
                            <span>{alert?.driverName}</span>
                          </div>
                        )}
                        {alert?.vehicleId && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Truck" size={12} />
                            <span>{alert?.vehicleId}</span>
                          </div>
                        )}
                        {alert?.location && (
                          <div className="flex items-center space-x-1">
                            <Icon name="MapPin" size={12} />
                            <span>{alert?.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      {!alert?.acknowledged && (
                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={(e) => {
                              e?.stopPropagation();
                              onAlertAcknowledge && onAlertAcknowledge(alert?.id);
                            }}
                            iconName="Check"
                            iconPosition="left"
                          >
                            Acknowledge
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={(e) => {
                              e?.stopPropagation();
                              // Handle escalate action
                            }}
                            iconName="ArrowUp"
                            iconPosition="left"
                          >
                            Escalate
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Alert Feed Footer */}
      {filteredAlerts?.length > 0 && (
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {filteredAlerts?.length} alerts</span>
            <button className="hover:text-foreground transition-colors">
              View All Alerts →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertFeed;