import React from 'react';
import Icon from '../../../components/AppIcon';

const HealthMetricsKPI = ({ 
  healthScore = 85.2,
  anomalyCount = 12,
  trendDirection = 'up',
  riskLevel = 'low',
  previousPeriodData = {
    healthScore: 82.1,
    anomalyCount: 15,
    riskLevel: 'medium'
  },
  className = ""
}) => {
  // Calculate percentage changes
  const healthScoreChange = ((healthScore - previousPeriodData?.healthScore) / previousPeriodData?.healthScore * 100)?.toFixed(1);
  const anomalyChange = ((anomalyCount - previousPeriodData?.anomalyCount) / previousPeriodData?.anomalyCount * 100)?.toFixed(1);

  // Get trend styling
  const getTrendStyling = (direction) => {
    switch (direction) {
      case 'up':
        return { color: 'text-success', icon: 'TrendingUp', bgColor: 'bg-success/10' };
      case 'down':
        return { color: 'text-error', icon: 'TrendingDown', bgColor: 'bg-error/10' };
      default:
        return { color: 'text-muted-foreground', icon: 'Minus', bgColor: 'bg-muted' };
    }
  };

  // Get risk level styling
  const getRiskStyling = (level) => {
    switch (level) {
      case 'low':
        return { color: 'text-success', bgColor: 'bg-success/10', label: 'Low Risk' };
      case 'medium':
        return { color: 'text-warning', bgColor: 'bg-warning/10', label: 'Medium Risk' };
      case 'high':
        return { color: 'text-error', bgColor: 'bg-error/10', label: 'High Risk' };
      default:
        return { color: 'text-muted-foreground', bgColor: 'bg-muted', label: 'Unknown' };
    }
  };

  const trendStyling = getTrendStyling(trendDirection);
  const riskStyling = getRiskStyling(riskLevel);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Health Score Average */}
      <div className="bg-card border border-border rounded-lg p-6 hover:shadow-soft-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={20} className="text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Health Score</h3>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
            parseFloat(healthScoreChange) >= 0 ? 'text-success bg-success/10' : 'text-error bg-error/10'
          }`}>
            <Icon 
              name={parseFloat(healthScoreChange) >= 0 ? 'ArrowUp' : 'ArrowDown'} 
              size={12} 
            />
            <span>{Math.abs(parseFloat(healthScoreChange))}%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">{healthScore}</div>
          <div className="text-sm text-muted-foreground">
            Average across all drivers
          </div>
          <div className="text-xs text-muted-foreground">
            Previous: {previousPeriodData?.healthScore} • Confidence: 94.2%
          </div>
        </div>
      </div>
      {/* Anomaly Detection */}
      <div className="bg-card border border-border rounded-lg p-6 hover:shadow-soft-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Anomalies</h3>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
            parseFloat(anomalyChange) <= 0 ? 'text-success bg-success/10' : 'text-error bg-error/10'
          }`}>
            <Icon 
              name={parseFloat(anomalyChange) <= 0 ? 'ArrowDown' : 'ArrowUp'} 
              size={12} 
            />
            <span>{Math.abs(parseFloat(anomalyChange))}%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">{anomalyCount}</div>
          <div className="text-sm text-muted-foreground">
            Detected this period
          </div>
          <div className="text-xs text-muted-foreground">
            Previous: {previousPeriodData?.anomalyCount} • 7-day trend
          </div>
        </div>
      </div>
      {/* Trend Direction */}
      <div className="bg-card border border-border rounded-lg p-6 hover:shadow-soft-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${trendStyling?.bgColor}`}>
              <Icon name={trendStyling?.icon} size={20} className={trendStyling?.color} />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Trend</h3>
          </div>
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${trendStyling?.bgColor} ${trendStyling?.color}`}>
            {trendDirection?.toUpperCase()}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className={`text-3xl font-bold ${trendStyling?.color}`}>
            {trendDirection === 'up' ? '↗' : trendDirection === 'down' ? '↘' : '→'}
          </div>
          <div className="text-sm text-muted-foreground">
            Overall health direction
          </div>
          <div className="text-xs text-muted-foreground">
            Based on 30-day moving average
          </div>
        </div>
      </div>
      {/* Risk Assessment */}
      <div className="bg-card border border-border rounded-lg p-6 hover:shadow-soft-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${riskStyling?.bgColor}`}>
              <Icon name="Shield" size={20} className={riskStyling?.color} />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Risk Level</h3>
          </div>
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${riskStyling?.bgColor} ${riskStyling?.color}`}>
            {riskStyling?.label?.toUpperCase()}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className={`text-3xl font-bold ${riskStyling?.color}`}>
            {riskLevel === 'low' ? 'L' : riskLevel === 'medium' ? 'M' : 'H'}
          </div>
          <div className="text-sm text-muted-foreground">
            Predictive assessment
          </div>
          <div className="text-xs text-muted-foreground">
            Previous: {previousPeriodData?.riskLevel} • ML confidence: 87.3%
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMetricsKPI;