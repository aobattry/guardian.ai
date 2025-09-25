import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

const AlertTimeline = ({ 
  timeRange = '24h',
  className = ""
}) => {
  const [timelineData, setTimelineData] = useState([]);
  const [viewMode, setViewMode] = useState('frequency'); // frequency, escalation, resolution
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock timeline data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockData = generateTimelineData(timeRange);
      setTimelineData(mockData);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [timeRange]);

  // Generate mock timeline data based on time range
  const generateTimelineData = (range) => {
    const now = new Date();
    const data = [];
    
    let intervals, intervalSize, formatKey;
    
    switch (range) {
      case '1h':
        intervals = 12;
        intervalSize = 5 * 60 * 1000; // 5 minutes
        formatKey = (date) => date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        break;
      case '4h':
        intervals = 16;
        intervalSize = 15 * 60 * 1000; // 15 minutes
        formatKey = (date) => date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        break;
      case '24h':
        intervals = 24;
        intervalSize = 60 * 60 * 1000; // 1 hour
        formatKey = (date) => date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        break;
      case '7d':
        intervals = 7;
        intervalSize = 24 * 60 * 60 * 1000; // 1 day
        formatKey = (date) => date?.toLocaleDateString([], { weekday: 'short' });
        break;
      default:
        intervals = 24;
        intervalSize = 60 * 60 * 1000;
        formatKey = (date) => date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    for (let i = intervals - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * intervalSize));
      const hour = timestamp?.getHours();
      
      // Simulate realistic alert patterns (more alerts during work hours)
      const baseAlerts = hour >= 6 && hour <= 18 ? 
        Math.floor(Math.random() * 8) + 2 : 
        Math.floor(Math.random() * 3) + 1;
      
      const critical = Math.floor(baseAlerts * 0.2);
      const high = Math.floor(baseAlerts * 0.3);
      const medium = Math.floor(baseAlerts * 0.3);
      const low = baseAlerts - critical - high - medium;
      
      data?.push({
        time: formatKey(timestamp),
        timestamp: timestamp?.getTime(),
        total: baseAlerts,
        critical,
        high,
        medium,
        low,
        escalated: Math.floor(baseAlerts * 0.15),
        resolved: Math.floor(baseAlerts * 0.8),
        avgResponseTime: Math.random() * 10 + 2,
        newAlerts: baseAlerts,
        activeAlerts: Math.floor(Math.random() * 15) + 5
      });
    }

    return data;
  };

  // Chart configurations for different view modes
  const getChartConfig = () => {
    switch (viewMode) {
      case 'frequency':
        return {
          title: 'Alert Frequency',
          description: 'Number of alerts over time by severity',
          yAxisLabel: 'Alert Count',
          chartType: 'bar'
        };
      case 'escalation':
        return {
          title: 'Escalation Trends',
          description: 'Alert escalation patterns and response times',
          yAxisLabel: 'Count / Minutes',
          chartType: 'line'
        };
      case 'resolution':
        return {
          title: 'Resolution Metrics',
          description: 'Alert resolution rates and active alert levels',
          yAxisLabel: 'Alert Count',
          chartType: 'area'
        };
      default:
        return {
          title: 'Alert Timeline',
          description: 'Alert activity over time',
          yAxisLabel: 'Count',
          chartType: 'bar'
        };
    }
  };

  const chartConfig = getChartConfig();

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-soft-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium text-foreground">{entry?.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render frequency chart
  const renderFrequencyChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="time" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="critical" stackId="a" fill="var(--color-error)" name="Critical" />
        <Bar dataKey="high" stackId="a" fill="var(--color-warning)" name="High" />
        <Bar dataKey="medium" stackId="a" fill="var(--color-primary)" name="Medium" />
        <Bar dataKey="low" stackId="a" fill="var(--color-muted-foreground)" name="Low" />
      </BarChart>
    </ResponsiveContainer>
  );

  // Render escalation chart
  const renderEscalationChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="time" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="escalated" 
          stroke="var(--color-error)" 
          strokeWidth={2}
          name="Escalated"
          dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="avgResponseTime" 
          stroke="var(--color-warning)" 
          strokeWidth={2}
          name="Avg Response (min)"
          dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Render resolution chart
  const renderResolutionChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="time" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="resolved" 
          stackId="1"
          stroke="var(--color-success)" 
          fill="var(--color-success)"
          fillOpacity={0.6}
          name="Resolved"
        />
        <Area 
          type="monotone" 
          dataKey="activeAlerts" 
          stackId="1"
          stroke="var(--color-primary)" 
          fill="var(--color-primary)"
          fillOpacity={0.6}
          name="Active"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  // Render appropriate chart based on view mode
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-[300px] flex items-center justify-center">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span>Loading timeline data...</span>
          </div>
        </div>
      );
    }

    switch (viewMode) {
      case 'frequency':
        return renderFrequencyChart();
      case 'escalation':
        return renderEscalationChart();
      case 'resolution':
        return renderResolutionChart();
      default:
        return renderFrequencyChart();
    }
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    if (timelineData?.length === 0) return null;

    const totalAlerts = timelineData?.reduce((sum, item) => sum + item?.total, 0);
    const totalCritical = timelineData?.reduce((sum, item) => sum + item?.critical, 0);
    const totalEscalated = timelineData?.reduce((sum, item) => sum + item?.escalated, 0);
    const avgResponseTime = timelineData?.reduce((sum, item) => sum + item?.avgResponseTime, 0) / timelineData?.length;

    return {
      totalAlerts,
      totalCritical,
      totalEscalated,
      avgResponseTime: avgResponseTime?.toFixed(1),
      criticalRate: ((totalCritical / totalAlerts) * 100)?.toFixed(1),
      escalationRate: ((totalEscalated / totalAlerts) * 100)?.toFixed(1)
    };
  };

  const summaryStats = getSummaryStats();

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-foreground">{chartConfig?.title}</h3>
            <p className="text-sm text-muted-foreground">{chartConfig?.description}</p>
          </div>
          
          {/* View Mode Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {[
              { key: 'frequency', label: 'Frequency', icon: 'BarChart3' },
              { key: 'escalation', label: 'Escalation', icon: 'TrendingUp' },
              { key: 'resolution', label: 'Resolution', icon: 'CheckCircle' }
            ]?.map((mode) => (
              <button
                key={mode?.key}
                onClick={() => setViewMode(mode?.key)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === mode?.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background'
                }`}
              >
                <Icon name={mode?.icon} size={14} />
                <span>{mode?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary Statistics */}
        {summaryStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{summaryStats?.totalAlerts}</div>
              <div className="text-xs text-muted-foreground">Total Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-error">{summaryStats?.totalCritical}</div>
              <div className="text-xs text-muted-foreground">Critical ({summaryStats?.criticalRate}%)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">{summaryStats?.totalEscalated}</div>
              <div className="text-xs text-muted-foreground">Escalated ({summaryStats?.escalationRate}%)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{summaryStats?.avgResponseTime}m</div>
              <div className="text-xs text-muted-foreground">Avg Response</div>
            </div>
          </div>
        )}
      </div>
      {/* Chart */}
      <div className="p-4">
        {renderChart()}
      </div>
      {/* Legend */}
      <div className="p-4 border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          {viewMode === 'frequency' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <span className="text-muted-foreground">Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-muted-foreground">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                <span className="text-muted-foreground">Low</span>
              </div>
            </>
          )}
          
          {viewMode === 'escalation' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <span className="text-muted-foreground">Escalated Alerts</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-muted-foreground">Response Time (min)</span>
              </div>
            </>
          )}
          
          {viewMode === 'resolution' && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-muted-foreground">Resolved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Active</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertTimeline;