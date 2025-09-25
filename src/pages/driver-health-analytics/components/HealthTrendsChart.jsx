import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const HealthTrendsChart = ({ 
  selectedDrivers = ['all'],
  selectedMetrics = ['heartRate'],
  dateRange = '7d',
  comparisonMode = false,
  className = ""
}) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [showThresholds, setShowThresholds] = useState(true);
  const [zoomDomain, setZoomDomain] = useState(null);

  // Mock health data generation
  useEffect(() => {
    const generateHealthData = () => {
      const now = new Date();
      const dataPoints = [];
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '24h' ? 1 : 7;
      const intervals = dateRange === '24h' ? 24 : days * 4; // 4 readings per day or hourly for 24h

      for (let i = intervals; i >= 0; i--) {
        const timestamp = new Date(now);
        if (dateRange === '24h') {
          timestamp?.setHours(timestamp?.getHours() - i);
        } else {
          timestamp?.setHours(timestamp?.getHours() - (i * 6)); // Every 6 hours
        }

        const dataPoint = {
          timestamp: timestamp?.toISOString(),
          time: dateRange === '24h' 
            ? timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : timestamp?.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          heartRate: 65 + Math.sin(i * 0.1) * 15 + Math.random() * 10,
          spO2: 96 + Math.sin(i * 0.05) * 3 + Math.random() * 2,
          temperature: 98.2 + Math.sin(i * 0.08) * 1.5 + Math.random() * 0.8,
          heartRateMA: 70 + Math.sin(i * 0.1) * 10, // Moving average
          spO2MA: 97 + Math.sin(i * 0.05) * 2,
          temperatureMA: 98.6 + Math.sin(i * 0.08) * 1,
          // Individual driver data for comparison
          driver1_heartRate: 68 + Math.sin(i * 0.12) * 12 + Math.random() * 8,
          driver2_heartRate: 72 + Math.sin(i * 0.09) * 18 + Math.random() * 12,
          driver3_heartRate: 63 + Math.sin(i * 0.11) * 14 + Math.random() * 9,
        };

        dataPoints?.push(dataPoint);
      }

      return dataPoints;
    };

    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setChartData(generateHealthData());
      setIsLoading(false);
    }, 500);
  }, [selectedDrivers, dateRange]);

  // Metric configuration
  const metricConfig = {
    heartRate: {
      label: 'Heart Rate (BPM)',
      color: '#DC2626',
      threshold: { min: 60, max: 100 },
      unit: 'BPM'
    },
    spO2: {
      label: 'SpO₂ (%)',
      color: '#2563EB',
      threshold: { min: 95, max: 100 },
      unit: '%'
    },
    temperature: {
      label: 'Temperature (°F)',
      color: '#D97706',
      threshold: { min: 97.0, max: 99.5 },
      unit: '°F'
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-soft-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry?.color }}
                ></div>
                <span className="text-muted-foreground">{entry?.name}</span>
              </div>
              <span className="font-mono text-foreground">
                {typeof entry?.value === 'number' ? entry?.value?.toFixed(1) : entry?.value}
                {entry?.name?.includes('Heart') ? ' BPM' : 
                 entry?.name?.includes('SpO') ? '%' : 
                 entry?.name?.includes('Temp') ? '°F' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle brush change for zoom
  const handleBrushChange = (brushData) => {
    if (brushData && brushData?.startIndex !== undefined && brushData?.endIndex !== undefined) {
      setZoomDomain([brushData?.startIndex, brushData?.endIndex]);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading health trends...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Chart Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Health Trends Analysis</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time biometric monitoring with predictive analytics
            </p>
          </div>
          
          {/* Chart Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMovingAverage(!showMovingAverage)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                showMovingAverage 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name="TrendingUp" size={14} />
              <span>Moving Avg</span>
            </button>
            
            <button
              onClick={() => setShowThresholds(!showThresholds)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                showThresholds 
                  ? 'bg-warning text-warning-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name="AlertTriangle" size={14} />
              <span>Thresholds</span>
            </button>
            
            <button
              onClick={() => setZoomDomain(null)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <Icon name="ZoomOut" size={14} />
              <span>Reset Zoom</span>
            </button>
          </div>
        </div>
      </div>
      {/* Main Chart */}
      <div className="p-6">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />

              {/* Threshold Lines */}
              {showThresholds && selectedMetrics?.map(metric => {
                const config = metricConfig?.[metric];
                return (
                  <React.Fragment key={`threshold-${metric}`}>
                    <ReferenceLine 
                      y={config?.threshold?.min} 
                      stroke={config?.color} 
                      strokeDasharray="5 5" 
                      strokeOpacity={0.5}
                      label={{ value: `Min ${config?.threshold?.min}`, position: 'topRight', fontSize: 10 }}
                    />
                    <ReferenceLine 
                      y={config?.threshold?.max} 
                      stroke={config?.color} 
                      strokeDasharray="5 5" 
                      strokeOpacity={0.5}
                      label={{ value: `Max ${config?.threshold?.max}`, position: 'topRight', fontSize: 10 }}
                    />
                  </React.Fragment>
                );
              })}

              {/* Main Data Lines */}
              {selectedMetrics?.map(metric => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={metricConfig?.[metric]?.color}
                  strokeWidth={2}
                  dot={false}
                  name={metricConfig?.[metric]?.label}
                  connectNulls={false}
                />
              ))}

              {/* Moving Average Lines */}
              {showMovingAverage && selectedMetrics?.map(metric => (
                <Line
                  key={`${metric}MA`}
                  type="monotone"
                  dataKey={`${metric}MA`}
                  stroke={metricConfig?.[metric]?.color}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  name={`${metricConfig?.[metric]?.label} (MA)`}
                  strokeOpacity={0.7}
                />
              ))}

              {/* Comparison Mode - Individual Drivers */}
              {comparisonMode && selectedMetrics?.includes('heartRate') && (
                <>
                  <Line
                    type="monotone"
                    dataKey="driver1_heartRate"
                    stroke="#10B981"
                    strokeWidth={1.5}
                    dot={false}
                    name="Driver A"
                    strokeOpacity={0.8}
                  />
                  <Line
                    type="monotone"
                    dataKey="driver2_heartRate"
                    stroke="#F59E0B"
                    strokeWidth={1.5}
                    dot={false}
                    name="Driver B"
                    strokeOpacity={0.8}
                  />
                  <Line
                    type="monotone"
                    dataKey="driver3_heartRate"
                    stroke="#8B5CF6"
                    strokeWidth={1.5}
                    dot={false}
                    name="Driver C"
                    strokeOpacity={0.8}
                  />
                </>
              )}

              {/* Brush for Zoom */}
              <Brush 
                dataKey="time" 
                height={30} 
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.1}
                onChange={handleBrushChange}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
          {selectedMetrics?.map(metric => {
            const config = metricConfig?.[metric];
            const values = chartData?.map(d => d?.[metric])?.filter(v => v != null);
            const avg = values?.reduce((a, b) => a + b, 0) / values?.length;
            const min = Math.min(...values);
            const max = Math.max(...values);
            
            return (
              <div key={metric} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{config?.label}</div>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Avg:</span>
                    <span className="font-mono text-foreground ml-1">{avg?.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min:</span>
                    <span className="font-mono text-foreground ml-1">{min?.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max:</span>
                    <span className="font-mono text-foreground ml-1">{max?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HealthTrendsChart;