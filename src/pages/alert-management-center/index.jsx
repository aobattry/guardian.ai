import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AlertFilters from './components/AlertFilters';
import AlertMetrics from './components/AlertMetrics';
import AlertTable from './components/AlertTable';
import AlertTimeline from './components/AlertTimeline';
import AlertMap from './components/AlertMap';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AlertManagementCenter = () => {
  const navigate = useNavigate();
  
  // State management
  const [filters, setFilters] = useState({
    alertType: 'all',
    severity: 'all',
    assignmentStatus: 'all',
    timeRange: '24h'
  });
  
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [refreshInterval, setRefreshInterval] = useState(10); // seconds
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // table, timeline, map

  // Add missing alerts state with Arabic names
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Critical Heart Rate Alert - Samir Al-Rashid',
      severity: 'critical',
      acknowledged: false,
      acknowledgedAt: null,
      driverName: 'Samir Al-Rashid',
      location: 'Al Ain - Hili Technology School - Main Gate',
      temperature: 37.2 // Celsius
    },
    {
      id: 2,
      title: 'Device Connection Lost - Ahmed Al-Zahra',
      severity: 'warning',
      acknowledged: true,
      acknowledgedAt: new Date(),
      driverName: 'Ahmed Al-Zahra',
      location: 'Al Ain - Hili Technology School - Parking Area',
      temperature: 37.3 // Celsius
    },
    {
      id: 3,
      title: 'Temperature Alert - Priya Sharma',
      severity: 'warning',
      acknowledged: false,
      acknowledgedAt: null,
      driverName: 'Priya Sharma',
      location: 'Al Ain - Hili Technology School - Building B',
      temperature: 38.1 // Celsius
    },
    {
      id: 4,
      title: 'Emergency Button Pressed - Khalid Al-Nahyan',
      severity: 'critical',
      acknowledged: false,
      acknowledgedAt: null,
      driverName: 'Khalid Al-Nahyan',
      location: 'Al Ain - Hili Technology School - Emergency Exit',
      temperature: 38.9 // Celsius
    }
  ]);
  
  // Mock data states
  const [alertCounts, setAlertCounts] = useState({
    total: 47,
    health: 23,
    location: 15,
    device: 9,
    critical: 12,
    warning: 23,
    info: 12
  });
  
  const [metrics, setMetrics] = useState({
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
  });

  // Enhanced notification system
  useEffect(() => {
    // Request notification permissions on mount
    if (window.Notification && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Set up real-time alert monitoring
    const interval = setInterval(() => {
      // Check for critical alerts and trigger notifications
      const criticalAlerts = alerts?.filter(alert => 
        alert?.severity === 'critical' && !alert?.acknowledged
      );
      
      if (criticalAlerts?.length > 0 && window.Notification && Notification.permission === "granted") {
        criticalAlerts?.forEach(alert => {
          new Notification(`🚨 CRITICAL ALERT - AI Guardian`, {
            body: alert?.title,
            icon: '/favicon.ico',
            tag: `alert-${alert?.id}`,
            requireInteraction: true,
            actions: [
              { action: 'acknowledge', title: 'Acknowledge' },
              { action: 'view', title: 'View Details' }
            ]
          });
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [alerts]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  // Handle alert selection
  const handleAlertSelect = (alertId, checked) => {
    if (checked) {
      setSelectedAlerts(prev => [...prev, alertId]);
    } else {
      setSelectedAlerts(prev => prev?.filter(id => id !== alertId));
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action, alertIds) => {
    console.log(`Bulk action: ${action}`, alertIds);
    
    switch (action) {
      case 'assign':
        break;
      case 'acknowledge':
        setSelectedAlerts([]);
        break;
      case 'escalate':
        break;
      default:
        if (Array.isArray(action)) {
          setSelectedAlerts(action);
        }
    }
  };

  // Handle status updates
  const handleStatusUpdate = (alertId, newStatus) => {
    console.log(`Status update for ${alertId}:`, newStatus);
  };

  // Handle alert assignment
  const handleAssignAlert = (alertId) => {
    console.log(`Assigning alert ${alertId}`);
  };

  // Handle alert click from status indicator
  const handleAlertClick = (level, counts) => {
    const newFilters = { ...filters };
    if (level === 'critical') {
      newFilters.severity = 'critical';
    } else if (level === 'warning') {
      newFilters.severity = 'high';
    }
    setFilters(newFilters);
  };

  // Handle export functionality
  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format`);
  };

  // Handle refresh
  const handleRefresh = () => {
    setLastRefresh(new Date());
    setMetrics(prev => ({
      ...prev,
      totalActive: prev?.totalActive + Math.floor(Math.random() * 5) - 2,
      averageResponseTime: Math.max(1, prev?.averageResponseTime + (Math.random() * 2 - 1))
    }));
  };

  // Get time since last refresh
  const getTimeSinceRefresh = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastRefresh) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  // Enhanced alert handling with notifications
  const handleAlertAcknowledge = (alertId) => {
    setAlerts(prev => 
      prev?.map(alert => 
        alert?.id === alertId 
          ? { ...alert, acknowledged: true, acknowledgedAt: new Date() }
          : alert
      )
    );
    
    if (window.Notification && Notification.permission === "granted") {
      new Notification("Alert Acknowledged - AI Guardian", {
        body: "Alert has been successfully acknowledged",
        icon: '/favicon.ico',
        tag: 'alert-acknowledged'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Modern Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-600 rounded-2xl shadow-lg">
                <Icon name="AlertTriangle" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">AI Guardian Alert Center</h1>
                <p className="text-gray-600 text-lg">Real-time emergency monitoring with intelligent notifications</p>
              </div>
            </div>
          </motion.div>

          {/* Modern Icon-based Navigation Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200 p-6 mb-8"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                { icon: 'Filter', label: 'Filters', action: () => {} },
                { icon: 'BarChart3', label: 'Metrics', action: () => {} },
                { icon: 'Clock', label: 'Timeline', action: () => setViewMode('timeline') },
                { icon: 'Map', label: 'Map View', action: () => setViewMode('map') },
                { icon: 'Bell', label: 'Alerts', action: () => setViewMode('table') },
                { icon: 'Download', label: 'Export', action: () => handleExport('csv') },
                { icon: 'Settings', label: 'Settings', action: () => {} },
                { icon: 'Users', label: 'Team', action: () => {} }
              ]?.map((item, index) => (
                <motion.button
                  key={item?.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={item?.action}
                  className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-red-50 hover:to-orange-100 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Icon name={item?.icon} size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">{item?.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Enhanced notification system with simplified alert list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 mb-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Bell" size={24} className="animate-pulse" />
                <div>
                  <h3 className="font-semibold flex items-center space-x-2">
                    <span>Real-time Alert Notifications</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                      {alerts?.filter(a => !a?.acknowledged)?.length} Active
                    </span>
                  </h3>
                  <p className="text-sm text-blue-100">
                    {window.Notification?.permission === "granted" ?"✅ Push notifications enabled - Emergency alerts will notify immediately" :"❌ Click to enable emergency push notifications"}
                  </p>
                </div>
              </div>
              {window.Notification?.permission !== "granted" && (
                <button
                  onClick={() => {
                    Notification.requestPermission()?.then((permission) => {
                      if (permission === "granted") {
                        new Notification("AI Guardian Emergency Alerts", {
                          body: "You will now receive instant notifications for critical emergencies and drowsiness detection",
                          icon: '/favicon.ico',
                          requireInteraction: true
                        });
                      }
                    });
                  }}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Enable Notifications
                </button>
              )}
            </div>
            
            {/* Simplified Alert List - Emergency Status and Time Only */}
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-blue-100">Recent Emergency Alerts:</h4>
              {alerts?.slice(0, 3)?.map((alert) => (
                <div key={alert?.id} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert?.severity === 'critical' ? 'bg-red-400 animate-pulse' : 'bg-yellow-400'
                    }`}></div>
                    <div>
                      <div className="font-medium text-sm">
                        {alert?.title?.includes('Emergency') ? '🚨 Emergency Button Pressed' :
                         alert?.title?.includes('Drowsiness') ? '😴 Drowsiness Detected' :
                         alert?.title?.includes('Heart Rate') ? '❤️ Critical Heart Rate' :
                         alert?.title?.includes('Temperature') ? '🌡️ High Temperature' :
                         '⚠️ Driver Alert'}
                      </div>
                      <div className="text-xs text-blue-200">
                        {alert?.driverName} • {new Date(alert?.timestamp)?.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAlertAcknowledge(alert?.id)}
                    className={`text-xs px-3 py-1 rounded ${
                      alert?.acknowledged 
                        ? 'bg-green-200 text-green-800' :'bg-red-200 text-red-800 hover:bg-red-300 animate-pulse'
                    }`}
                  >
                    {alert?.acknowledged ? '✓ Handled' : 'Acknowledge'}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alert Filters */}
          <AlertFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            alertCounts={alertCounts}
          />

          {/* Alert Metrics */}
          <AlertMetrics metrics={metrics} />

          {/* View Mode Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg">
                {[
                  { key: 'table', label: 'Table View', icon: 'Table' },
                  { key: 'timeline', label: 'Timeline', icon: 'BarChart3' },
                  { key: 'map', label: 'Map View', icon: 'Map' }
                ]?.map((mode) => (
                  <button
                    key={mode?.key}
                    onClick={() => setViewMode(mode?.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      viewMode === mode?.key
                        ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <Icon name={mode?.icon} size={16} />
                    <span>{mode?.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Action Controls */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/60 rounded-xl px-3 py-2">
                  <Icon 
                    name={isAutoRefresh ? "RefreshCw" : "Pause"} 
                    size={14} 
                    className={isAutoRefresh ? "animate-spin" : ""} 
                  />
                  <span>Last updated: {getTimeSinceRefresh()}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName={isAutoRefresh ? "Pause" : "Play"}
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className="rounded-xl"
                >
                  {isAutoRefresh ? 'Pause' : 'Resume'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  onClick={() => handleExport('csv')}
                  className="rounded-xl"
                >
                  Export
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  onClick={handleRefresh}
                  className="rounded-xl"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Primary Content */}
            <div className="xl:col-span-8">
              {viewMode === 'table' && (
                <AlertTable
                  onAlertSelect={handleAlertSelect}
                  onBulkAction={handleBulkAction}
                  onStatusUpdate={handleStatusUpdate}
                  onAssignAlert={handleAssignAlert}
                  selectedAlerts={selectedAlerts}
                />
              )}
              
              {viewMode === 'timeline' && (
                <AlertTimeline timeRange={filters?.timeRange} />
              )}
              
              {viewMode === 'map' && (
                <AlertMap onAlertSelect={(alert) => console.log('Alert selected:', alert)} />
              )}
            </div>

            {/* Enhanced Side Panel */}
            <div className="xl:col-span-4 space-y-6">
              {/* Timeline Chart (always visible in sidebar when not main view) */}
              {viewMode !== 'timeline' && (
                <AlertTimeline 
                  timeRange={filters?.timeRange}
                  className="h-80"
                />
              )}
              
              {/* Quick Actions Panel */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon name="Zap" size={20} className="mr-2 text-orange-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Plus"
                    onClick={() => {}}
                    className="rounded-xl"
                  >
                    Create Manual Alert
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Settings"
                    onClick={() => {}}
                    className="rounded-xl"
                  >
                    Configure Alert Rules
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Users"
                    onClick={() => {}}
                    className="rounded-xl"
                  >
                    Manage Response Team
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="FileText"
                    onClick={() => {}}
                    className="rounded-xl"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>

              {/* System Status Panel */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon name="Activity" size={20} className="mr-2 text-green-500" />
                  System Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Alert Processing</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Operational</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Device Connectivity</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">98% Online</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Team</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600 font-medium">3 Available</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Temperature Units</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-blue-600 font-medium">Celsius (°C)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Sync</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} className="text-green-500" />
                  <span>System Status: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Wifi" size={16} className="text-blue-500" />
                  <span>Connection: Live WebSocket</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Thermometer" size={16} className="text-purple-500" />
                  <span>Temperature: Celsius</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Icon name="Shield" size={16} />
                <span>© 2024 AI Guardian</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AlertManagementCenter;