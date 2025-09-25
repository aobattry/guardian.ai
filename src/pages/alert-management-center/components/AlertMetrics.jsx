import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AlertMetrics = ({ 
  metrics = {
    totalActive: 47,
    averageResponseTime: 8.5,
    escalatedIncidents: 12,
    resolutionRate: 87.3,
    trends: {
      totalActive: 12,
      averageResponseTime: -15,
      escalatedIncidents: 8,
      resolutionRate: 5.2
    }
  },
  className = ""
}) => {
  const [animatedMetrics, setAnimatedMetrics] = useState(metrics);

  // Animate metric changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedMetrics(metrics);
    }, 100);
    return () => clearTimeout(timer);
  }, [metrics]);

  // Metric card configuration
  const metricCards = [
    {
      id: 'totalActive',
      title: 'Active Alerts',
      value: animatedMetrics?.totalActive,
      unit: '',
      trend: metrics?.trends?.totalActive,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      description: 'Currently unresolved alerts requiring attention'
    },
    {
      id: 'averageResponseTime',
      title: 'Avg Response Time',
      value: animatedMetrics?.averageResponseTime,
      unit: 'min',
      trend: metrics?.trends?.averageResponseTime,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Average time from alert creation to first response'
    },
    {
      id: 'escalatedIncidents',
      title: 'Escalated',
      value: animatedMetrics?.escalatedIncidents,
      unit: '',
      trend: metrics?.trends?.escalatedIncidents,
      icon: 'TrendingUp',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Alerts escalated to higher priority or management'
    },
    {
      id: 'resolutionRate',
      title: 'Resolution Rate',
      value: animatedMetrics?.resolutionRate,
      unit: '%',
      trend: metrics?.trends?.resolutionRate,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Percentage of alerts resolved within SLA timeframe'
    }
  ];

  // Get trend styling
  const getTrendStyling = (trend) => {
    if (trend > 0) {
      return {
        color: 'text-success',
        bgColor: 'bg-success/10',
        icon: 'TrendingUp',
        prefix: '+'
      };
    } else if (trend < 0) {
      return {
        color: 'text-error',
        bgColor: 'bg-error/10',
        icon: 'TrendingDown',
        prefix: ''
      };
    } else {
      return {
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
        icon: 'Minus',
        prefix: ''
      };
    }
  };

  // Format metric value
  const formatMetricValue = (value, unit) => {
    if (unit === '%') {
      return value?.toFixed(1);
    }
    if (unit === 'min') {
      return value?.toFixed(1);
    }
    return value?.toString();
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ${className}`}>
      {metricCards?.map((card) => {
        const trendStyling = getTrendStyling(card?.trend);
        
        return (
          <div
            key={card?.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-soft-md transition-all duration-250"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card?.bgColor}`}>
                <Icon name={card?.icon} size={20} className={card?.color} />
              </div>
              
              {/* Trend Indicator */}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${trendStyling?.bgColor} ${trendStyling?.color}`}>
                <Icon name={trendStyling?.icon} size={12} />
                <span>
                  {trendStyling?.prefix}{Math.abs(card?.trend)}{card?.unit}
                </span>
              </div>
            </div>
            {/* Metric Value */}
            <div className="mb-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-foreground">
                  {formatMetricValue(card?.value, card?.unit)}
                </span>
                {card?.unit && (
                  <span className="text-sm text-muted-foreground font-medium">
                    {card?.unit}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {card?.title}
              </h3>
            </div>
            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {card?.description}
            </p>
            {/* Progress Bar for Resolution Rate */}
            {card?.id === 'resolutionRate' && (
              <div className="mt-3">
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-success h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(card?.value, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            {/* Alert Level Indicator for Active Alerts */}
            {card?.id === 'totalActive' && (
              <div className="mt-3 flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                  <span className="text-xs text-error font-medium">
                    {Math.floor(card?.value * 0.3)} Critical
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-xs text-warning font-medium">
                    {Math.floor(card?.value * 0.7)} Others
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AlertMetrics;