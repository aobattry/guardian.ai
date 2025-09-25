import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import TimeRangeSelector from '../../components/ui/TimeRangeSelector';
import AlertStatusIndicator from '../../components/ui/AlertStatusIndicator';
import ConnectionStatusMonitor from '../../components/ui/ConnectionStatusMonitor';
import HealthMetricsKPI from './components/HealthMetricsKPI';
import HealthTrendsChart from './components/HealthTrendsChart';
import StatisticalSummaryPanel from './components/StatisticalSummaryPanel';
import HealthDataTable from './components/HealthDataTable';
import AnalyticsFilters from './components/AnalyticsFilters';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DriverHealthAnalytics = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    drivers: ['all'],
    metrics: ['heartRate'],
    dateRange: '7d',
    comparisonMode: false,
    shiftPattern: 'all',
    routeType: 'all',
    environmentalConditions: 'all'
  });
  
  const [alertCounts, setAlertCounts] = useState({
    critical: 2,
    warning: 5,
    info: 3
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLastUpdateTime(new Date());
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [filters]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setLastUpdateTime(new Date());
      // Simulate alert count changes
      setAlertCounts(prev => ({
        critical: Math.max(0, prev?.critical + (Math.random() > 0.7 ? 1 : -1)),
        warning: Math.max(0, prev?.warning + (Math.random() > 0.6 ? 1 : -1)),
        info: Math.max(0, prev?.info + (Math.random() > 0.5 ? 1 : -1))
      }));
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle time range changes
  const handleTimeRangeChange = (range) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  // Handle alert click
  const handleAlertClick = (level, counts) => {
    navigate('/alert-management-center');
  };

  // Handle data export
  const handleDataExport = (data) => {
    // Convert data to CSV format
    const headers = [
      'Timestamp', 'Driver ID', 'Driver Name', 'Heart Rate', 'SpO2', 
      'Temperature (°C)', 'Battery Level', 'Data Quality', 'Sync Status', 'Location'
    ];
    
    const csvContent = [
      headers?.join(','),
      ...data?.map(row => [
        row?.timestamp,
        row?.driverId,
        row?.driverName,
        row?.heartRate?.toFixed(1),
        row?.spO2?.toFixed(1),
        row?.temperature?.toFixed(1),
        row?.batteryLevel?.toFixed(0),
        row?.dataQuality,
        row?.syncStatus,
        row?.location?.address
      ]?.join(','))
    ]?.join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-guardian-health-analytics-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    window.URL?.revokeObjectURL(url);
  };

  // Get selected driver names for display
  const getSelectedDriversText = () => {
    if (filters?.drivers?.includes('all')) return 'All Arab Drivers';
    if (filters?.drivers?.length === 1) return 'Selected Driver';
    return `${filters?.drivers?.length} Drivers`;
  };

  // Get selected metrics text for display
  const getSelectedMetricsText = () => {
    const metricLabels = {
      heartRate: 'Heart Rate',
      spO2: 'SpO₂',
      temperature: 'Temperature (°C)'
    };
    
    return filters?.metrics?.map(m => metricLabels?.[m])?.join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="pt-16">
        {/* Modern Page Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon name="Activity" size={28} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">AI Guardian Health Analytics</h1>
                    <p className="text-gray-600">
                      AI-powered biometric monitoring for Al Ain fleet drivers
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2 bg-blue-50 rounded-full px-3 py-1">
                    <Icon name="Users" size={14} className="text-blue-600" />
                    <span className="font-medium">{getSelectedDriversText()}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-50 rounded-full px-3 py-1">
                    <Icon name="Activity" size={14} className="text-green-600" />
                    <span className="font-medium">{getSelectedMetricsText()}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-purple-50 rounded-full px-3 py-1">
                    <Icon name="Clock" size={14} className="text-purple-600" />
                    <span className="font-medium">Updated: {lastUpdateTime?.toLocaleTimeString()}</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-4"
              >
                <AlertStatusIndicator 
                  alertCounts={alertCounts}
                  onAlertClick={handleAlertClick}
                />
                
                <ConnectionStatusMonitor 
                  showDetails 
                  onStatusChange={() => {}} 
                />
                
                <TimeRangeSelector
                  value={filters?.dateRange}
                  onChange={handleTimeRangeChange}
                />
                
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  size="sm"
                  iconName={autoRefresh ? "Pause" : "Play"}
                  iconPosition="left"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className="rounded-xl"
                >
                  {autoRefresh ? 'Live' : 'Paused'}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-64"
            >
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gradient-to-r from-emerald-500 to-cyan-600"></div>
                <span className="text-xl text-gray-700 font-medium">Loading AI Guardian analytics...</span>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Modern Icon-based Navigation Sections */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-6 mb-8"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                  {[
                    { icon: 'Filter', label: 'Filters', action: () => {} },
                    { icon: 'BarChart3', label: 'Metrics', action: () => {} },
                    { icon: 'TrendingUp', label: 'Trends', action: () => {} },
                    { icon: 'Users', label: 'Drivers', action: () => {} },
                    { icon: 'Heart', label: 'Health', action: () => {} },
                    { icon: 'Download', label: 'Export', action: handleDataExport },
                    { icon: 'Settings', label: 'Settings', action: () => {} },
                    { icon: 'Bell', label: 'Alerts', action: () => navigate('/alert-management-center') }
                  ]?.map((item, index) => (
                    <motion.button
                      key={item?.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={item?.action}
                      className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-100 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                        <Icon name={item?.icon} size={20} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">{item?.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
              
              {/* Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <AnalyticsFilters onFiltersChange={handleFiltersChange} />
              </motion.div>
              
              {/* KPI Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <HealthMetricsKPI />
              </motion.div>
              
              {/* Main Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Chart Area */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="lg:col-span-3"
                >
                  <HealthTrendsChart
                    selectedDrivers={filters?.drivers}
                    selectedMetrics={filters?.metrics}
                    dateRange={filters?.dateRange}
                    comparisonMode={filters?.comparisonMode}
                  />
                </motion.div>
                
                {/* Statistical Summary Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="lg:col-span-1"
                >
                  <StatisticalSummaryPanel
                    selectedMetrics={filters?.metrics}
                    selectedDrivers={filters?.drivers}
                    dateRange={filters?.dateRange}
                  />
                </motion.div>
              </div>
              
              {/* Data Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <HealthDataTable
                  selectedDrivers={filters?.drivers}
                  selectedMetrics={filters?.metrics}
                  dateRange={filters?.dateRange}
                  onExport={handleDataExport}
                />
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DriverHealthAnalytics;