import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ScatterChart, Scatter, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const StatisticalSummaryPanel = ({ 
  selectedMetrics = ['heartRate'],
  selectedDrivers = ['all'],
  dateRange = '7d',
  className = ""
}) => {
  const [summaryData, setSummaryData] = useState({
    distributions: [],
    outliers: [],
    correlations: [],
    riskScores: []
  });
  const [activeTab, setActiveTab] = useState('distribution');
  const [isLoading, setIsLoading] = useState(true);

  // Generate statistical data
  useEffect(() => {
    const generateStatisticalData = () => {
      // Distribution data
      const distributions = selectedMetrics?.map(metric => {
        const bins = [];
        const metricConfig = {
          heartRate: { min: 50, max: 120, unit: 'BPM' },
          spO2: { min: 90, max: 100, unit: '%' },
          temperature: { min: 96, max: 101, unit: '°F' }
        };
        
        const config = metricConfig?.[metric];
        const binSize = (config?.max - config?.min) / 10;
        
        for (let i = 0; i < 10; i++) {
          const binStart = config?.min + (i * binSize);
          const binEnd = binStart + binSize;
          bins?.push({
            range: `${binStart?.toFixed(1)}-${binEnd?.toFixed(1)}`,
            count: Math.floor(Math.random() * 50) + 5,
            percentage: Math.floor(Math.random() * 25) + 2
          });
        }
        
        return { metric, bins, unit: config?.unit };
      });

      // Outlier detection
      const outliers = [
        {
          id: 'OUT-001',
          driverId: 'DRV-2024-045',
          driverName: 'Michael Rodriguez',
          metric: 'heartRate',
          value: 135,
          threshold: 100,
          timestamp: new Date(Date.now() - 3600000)?.toISOString(),
          severity: 'high',
          status: 'investigating'
        },
        {
          id: 'OUT-002',
          driverId: 'DRV-2024-023',
          driverName: 'Sarah Johnson',
          metric: 'spO2',
          value: 89,
          threshold: 95,
          timestamp: new Date(Date.now() - 7200000)?.toISOString(),
          severity: 'critical',
          status: 'resolved'
        },
        {
          id: 'OUT-003',
          driverId: 'DRV-2024-067',
          driverName: 'David Chen',
          metric: 'temperature',
          value: 101.8,
          threshold: 99.5,
          timestamp: new Date(Date.now() - 1800000)?.toISOString(),
          severity: 'medium',
          status: 'monitoring'
        }
      ];

      // Correlation data
      const correlations = [
        {
          metrics: ['heartRate', 'spO2'],
          coefficient: -0.72,
          strength: 'strong',
          significance: 0.001,
          dataPoints: Array.from({ length: 50 }, (_, i) => ({
            x: 60 + Math.random() * 40,
            y: 100 - (Math.random() * 8),
            driver: `Driver ${String.fromCharCode(65 + (i % 10))}`
          }))
        },
        {
          metrics: ['heartRate', 'temperature'],
          coefficient: 0.45,
          strength: 'moderate',
          significance: 0.023,
          dataPoints: Array.from({ length: 50 }, (_, i) => ({
            x: 60 + Math.random() * 40,
            y: 97 + Math.random() * 3,
            driver: `Driver ${String.fromCharCode(65 + (i % 10))}`
          }))
        }
      ];

      // Risk scores
      const riskScores = [
        {
          driverId: 'DRV-2024-045',
          driverName: 'Michael Rodriguez',
          overallScore: 78,
          factors: {
            cardiovascular: 85,
            respiratory: 72,
            thermal: 76
          },
          trend: 'improving',
          lastUpdate: new Date(Date.now() - 900000)?.toISOString()
        },
        {
          driverId: 'DRV-2024-023',
          driverName: 'Sarah Johnson',
          overallScore: 92,
          factors: {
            cardiovascular: 94,
            respiratory: 88,
            thermal: 95
          },
          trend: 'stable',
          lastUpdate: new Date(Date.now() - 1200000)?.toISOString()
        },
        {
          driverId: 'DRV-2024-067',
          driverName: 'David Chen',
          overallScore: 65,
          factors: {
            cardiovascular: 70,
            respiratory: 68,
            thermal: 58
          },
          trend: 'declining',
          lastUpdate: new Date(Date.now() - 600000)?.toISOString()
        }
      ];

      return {
        distributions,
        outliers,
        correlations,
        riskScores
      };
    };

    setIsLoading(true);
    setTimeout(() => {
      setSummaryData(generateStatisticalData());
      setIsLoading(false);
    }, 300);
  }, [selectedMetrics, selectedDrivers, dateRange]);

  // Tab configuration
  const tabs = [
    { id: 'distribution', label: 'Distribution', icon: 'BarChart3' },
    { id: 'outliers', label: 'Outliers', icon: 'AlertCircle' },
    { id: 'correlation', label: 'Correlation', icon: 'GitBranch' },
    { id: 'risk', label: 'Risk Scores', icon: 'Shield' }
  ];

  // Get severity styling
  const getSeverityStyling = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error/10';
      case 'high':
        return 'text-warning bg-warning/10';
      case 'medium':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  // Get trend styling
  const getTrendStyling = (trend) => {
    switch (trend) {
      case 'improving':
        return { color: 'text-success', icon: 'TrendingUp' };
      case 'declining':
        return { color: 'text-error', icon: 'TrendingDown' };
      default:
        return { color: 'text-muted-foreground', icon: 'Minus' };
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Panel Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Statistical Analysis</h3>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                activeTab === tab?.id
                  ? 'bg-card text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Panel Content */}
      <div className="p-4">
        {/* Distribution Tab */}
        {activeTab === 'distribution' && (
          <div className="space-y-4">
            {summaryData?.distributions?.map((dist, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium text-foreground mb-3 capitalize">
                  {dist?.metric} Distribution
                </h4>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dist?.bins}>
                      <XAxis 
                        dataKey="range" 
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis hide />
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, 'Percentage']}
                        labelFormatter={(label) => `Range: ${label} ${dist?.unit}`}
                      />
                      <Bar 
                        dataKey="percentage" 
                        fill="var(--color-primary)" 
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Outliers Tab */}
        {activeTab === 'outliers' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Recent Outliers</h4>
              <span className="text-xs text-muted-foreground">
                {summaryData?.outliers?.length} detected
              </span>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {summaryData?.outliers?.map(outlier => (
                <div key={outlier?.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-foreground">
                      {outlier?.driverName}
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityStyling(outlier?.severity)}`}>
                      {outlier?.severity}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Metric:</span>
                      <span className="capitalize">{outlier?.metric}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Value:</span>
                      <span className="font-mono">{outlier?.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Threshold:</span>
                      <span className="font-mono">{outlier?.threshold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">{outlier?.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Correlation Tab */}
        {activeTab === 'correlation' && (
          <div className="space-y-4">
            {summaryData?.correlations?.map((corr, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-foreground">
                    {corr?.metrics?.join(' vs ')}
                  </h4>
                  <div className="text-xs text-muted-foreground">
                    r = {corr?.coefficient} ({corr?.strength})
                  </div>
                </div>
                
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={corr?.dataPoints}>
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        domain={['dataMin', 'dataMax']}
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        domain={['dataMin', 'dataMax']}
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        formatter={(value, name) => [value?.toFixed(1), name]}
                        labelFormatter={() => ''}
                      />
                      <Scatter 
                        dataKey="y" 
                        fill="var(--color-primary)" 
                        fillOpacity={0.6}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Risk Scores Tab */}
        {activeTab === 'risk' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Predictive Risk Assessment</h4>
              <span className="text-xs text-muted-foreground">ML-powered</span>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {summaryData?.riskScores?.map(score => {
                const trendStyling = getTrendStyling(score?.trend);
                return (
                  <div key={score?.driverId} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-foreground">
                        {score?.driverName}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name={trendStyling?.icon} size={12} className={trendStyling?.color} />
                        <span className="text-lg font-bold text-foreground">
                          {score?.overallScore}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(score?.factors)?.map(([factor, value]) => (
                        <div key={factor} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground capitalize">{factor}:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-muted rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  value >= 80 ? 'bg-success' : 
                                  value >= 60 ? 'bg-warning' : 'bg-error'
                                }`}
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                            <span className="font-mono text-foreground w-8">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticalSummaryPanel;