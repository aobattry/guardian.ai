import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const BiometricChart = ({ 
  data = [], 
  selectedMetrics = ['heartRate', 'spO2', 'temperature'],
  timeRange = '1h',
  isLive = true,
  onMetricToggle 
}) => {
  const [chartData, setChartData] = useState(data);
  const [hoveredMetric, setHoveredMetric] = useState(null);

  // Update chart data when props change
  useEffect(() => {
    setChartData(data);
  }, [data]);

  // Metric configuration
  const metricConfig = {
    heartRate: {
      label: 'Heart Rate',
      unit: 'bpm',
      color: '#DC2626',
      normalRange: [60, 100],
      icon: 'Heart'
    },
    spO2: {
      label: 'SpO₂',
      unit: '%',
      color: '#2563EB',
      normalRange: [95, 100],
      icon: 'Activity'
    },
    temperature: {
      label: 'Temperature',
      unit: '°F',
      color: '#D97706',
      normalRange: [97, 99],
      icon: 'Thermometer'
    },
    stressLevel: {
      label: 'Stress Level',
      unit: '/10',
      color: '#7C3AED',
      normalRange: [1, 4],
      icon: 'Brain'
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-soft-lg p-3">
          <p className="text-sm font-medium text-foreground mb-2">
            {new Date(label)?.toLocaleTimeString()}
          </p>
          {payload?.map((entry) => {
            const config = metricConfig?.[entry?.dataKey];
            return (
              <div key={entry?.dataKey} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                ></div>
                <span className="text-muted-foreground">{config?.label}:</span>
                <span className="font-medium text-foreground">
                  {entry?.value} {config?.unit}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Handle metric toggle
  const handleMetricToggle = (metricKey) => {
    if (onMetricToggle) {
      onMetricToggle(metricKey);
    }
  };

  // Format Y-axis tick
  const formatYAxisTick = (value, metricKey) => {
    const config = metricConfig?.[metricKey];
    return `${value}${config?.unit || ''}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Real-time Biometric Trends
            </h3>
          </div>
          
          {isLive && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs font-medium">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          )}
        </div>

        {/* Metric Toggles */}
        <div className="flex items-center space-x-2">
          {Object.entries(metricConfig)?.map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleMetricToggle(key)}
              onMouseEnter={() => setHoveredMetric(key)}
              onMouseLeave={() => setHoveredMetric(null)}
              className={`
                flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium
                transition-all duration-200 hover:scale-105
                ${selectedMetrics?.includes(key) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
              title={`Toggle ${config?.label} (Normal: ${config?.normalRange?.[0]}-${config?.normalRange?.[1]} ${config?.unit})`}
            >
              <Icon name={config?.icon} size={12} />
              <span>{config?.label}</span>
              {selectedMetrics?.includes(key) && (
                <Icon name="Eye" size={10} />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Chart Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value)?.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {selectedMetrics?.map((metricKey) => {
              const config = metricConfig?.[metricKey];
              return (
                <Line
                  key={metricKey}
                  type="monotone"
                  dataKey={metricKey}
                  stroke={config?.color}
                  strokeWidth={hoveredMetric === metricKey ? 3 : 2}
                  dot={false}
                  activeDot={{ r: 4, fill: config?.color }}
                  name={config?.label}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>Time Range: {timeRange}</span>
          <span>•</span>
          <span>Data Points: {chartData?.length}</span>
          <span>•</span>
          <span>Last Update: {new Date()?.toLocaleTimeString()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Download" size={12} />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Maximize2" size={12} />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiometricChart;