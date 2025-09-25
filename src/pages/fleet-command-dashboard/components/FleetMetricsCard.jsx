import React from 'react';
import Icon from '../../../components/AppIcon';

const FleetMetricsCard = ({ 
  title, 
  value, 
  unit = '', 
  trend = null, 
  status = 'normal',
  icon,
  sparklineData = [],
  onClick 
}) => {
  // Get status styling
  const getStatusStyling = () => {
    switch (status) {
      case 'critical':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20'
        };
      case 'warning':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20'
        };
      case 'good':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20'
        };
      default:
        return {
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20'
        };
    }
  };

  const styling = getStatusStyling();

  // Generate sparkline path
  const generateSparklinePath = () => {
    if (!sparklineData || sparklineData?.length === 0) return '';
    
    const width = 60;
    const height = 20;
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    
    const points = sparklineData?.map((value, index) => {
      const x = (index / (sparklineData?.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points?.join(' L ')}`;
  };

  return (
    <div 
      className={`
        bg-card border rounded-lg p-4 transition-all duration-250 ease-out-smooth
        hover:shadow-soft-md hover:scale-105 cursor-pointer
        ${styling?.borderColor}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${styling?.bgColor}`}>
          <Icon name={icon} size={20} className={styling?.color} />
        </div>
        
        {sparklineData?.length > 0 && (
          <div className="w-16 h-6">
            <svg width="60" height="20" className="overflow-visible">
              <path
                d={generateSparklinePath()}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={styling?.color}
              />
            </svg>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        
        {trend && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={trend?.direction === 'up' ? 'TrendingUp' : trend?.direction === 'down' ? 'TrendingDown' : 'Minus'} 
              size={12} 
              className={
                trend?.direction === 'up' ? 'text-success' : 
                trend?.direction === 'down'? 'text-error' : 'text-muted-foreground'
              }
            />
            <span className={`text-xs font-medium ${
              trend?.direction === 'up' ? 'text-success' : 
              trend?.direction === 'down'? 'text-error' : 'text-muted-foreground'
            }`}>
              {trend?.value}% {trend?.period}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetMetricsCard;