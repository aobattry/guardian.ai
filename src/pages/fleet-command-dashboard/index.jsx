import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import FleetControlPanel from './components/FleetControlPanel';
import FleetMetricsCard from './components/FleetMetricsCard';
import BiometricChart from './components/BiometricChart';
import AlertFeed from './components/AlertFeed';
import DriverStatusCard from './components/DriverStatusCard';
import Icon from '../../components/AppIcon';

const FleetCommandDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [selectedFleet, setSelectedFleet] = useState('alain-hili');
  const [timeRange, setTimeRange] = useState('1h');
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState(['heartRate', 'spO2', 'temperature']);
  const [refreshKey, setRefreshKey] = useState(0);

  // Convert Fahrenheit to Celsius helper
  const fahrenheitToCelsius = (fahrenheit) => {
    return Math.round(((fahrenheit - 32) * 5) / 9 * 10) / 10;
  };

  // Mock data for fleet metrics with Arabic/Indian driver names and Celsius temperatures
  const fleetMetrics = [
    {
      title: 'Active Drivers',
      value: 8,
      unit: '',
      trend: { direction: 'up', value: 8, period: 'vs yesterday' },
      status: 'good',
      icon: 'Users',
      sparklineData: [6, 7, 8, 7, 8, 8, 8]
    },
    {
      title: 'Critical Alerts',
      value: 2,
      unit: '',
      trend: { direction: 'down', value: 25, period: 'vs last hour' },
      status: 'critical',
      icon: 'AlertTriangle',
      sparklineData: [5, 4, 3, 4, 3, 2, 2]
    },
    {
      title: 'Avg Heart Rate',
      value: 82,
      unit: 'bpm',
      trend: { direction: 'up', value: 5, period: 'vs baseline' },
      status: 'warning',
      icon: 'Heart',
      sparklineData: [76, 77, 79, 80, 81, 82, 82]
    },
    {
      title: 'Fleet Connectivity',
      value: 88,
      unit: '%',
      trend: { direction: 'down', value: 12, period: 'vs last check' },
      status: 'warning',
      icon: 'Wifi',
      sparklineData: [100, 100, 95, 90, 88, 88, 88]
    }
  ];

  // Mock biometric chart data
  const [biometricData, setBiometricData] = useState([]);

  // Generate mock biometric data with Celsius temperatures
  useEffect(() => {
    const generateBiometricData = () => {
      const now = new Date();
      const data = [];
      
      for (let i = 59; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60000);
        data?.push({
          timestamp: timestamp?.toISOString(),
          heartRate: 70 + Math.random() * 20 + Math.sin(i / 10) * 5,
          spO2: 96 + Math.random() * 3,
          temperature: 36.5 + Math.random() * 1.5, // Celsius range: 36.5-38°C
          stressLevel: 2 + Math.random() * 3
        });
      }
      
      return data;
    };

    setBiometricData(generateBiometricData());
  }, [timeRange, refreshKey]);

  // Mock alerts data with Arabic/Indian names and Celsius
  const alerts = [
    {
      id: 'alert-001',
      title: 'Critical Heart Rate Alert - Khalid Al-Nahyan',
      description: 'Driver showing elevated heart rate of 115 bpm and high temperature of 38.9°C. Immediate attention required.',
      severity: 'critical',
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      driverName: 'Khalid Al-Nahyan',
      vehicleId: 'BUS-008',
      location: 'Al Ain - Hili Technology School - Emergency Exit',
      acknowledged: false
    },
    {
      id: 'alert-002',
      title: 'Temperature Alert - Priya Sharma',
      description: 'Driver showing elevated body temperature of 38.1°C at Building B location.',
      severity: 'warning',
      timestamp: new Date(Date.now() - 900000)?.toISOString(),
      driverName: 'Priya Sharma',
      vehicleId: 'BUS-003',
      location: 'Al Ain - Hili Technology School - Building B',
      acknowledged: false
    },
    {
      id: 'alert-003',
      title: 'Device Battery Low - Omar Al-Mahmoud',
      description: 'Wearable device battery at 15% for driver at Laboratory Block.',
      severity: 'info',
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      driverName: 'Omar Al-Mahmoud',
      vehicleId: 'BUS-004',
      location: 'Al Ain - Hili Technology School - Laboratory Block',
      acknowledged: false
    },
    {
      id: 'alert-004',
      title: 'Heart Rate Elevated - Rajesh Kumar',
      description: 'Driver showing sustained high heart rate at Sports Complex area.',
      severity: 'warning',
      timestamp: new Date(Date.now() - 2700000)?.toISOString(),
      driverName: 'Rajesh Kumar',
      vehicleId: 'BUS-005',
      location: 'Al Ain - Hili Technology School - Sports Complex',
      acknowledged: true
    }
  ];

  // Mock driver status data with Arabic/Indian names and Celsius
  const drivers = [
    {
      id: 'DRV-001',
      name: 'Samir Al-Rashid',
      avatar: null,
      healthStatus: 'good',
      isConnected: true,
      heartRate: 75,
      spO2: 98,
      temperature: 37.0, // Celsius
      location: 'Al Ain - Hili Technology School - Main Gate',
      vehicleId: 'BUS-001',
      speed: 0,
      batteryLevel: 85,
      activeAlerts: []
    },
    {
      id: 'DRV-002',
      name: 'Ahmed Al-Zahra',
      avatar: null,
      healthStatus: 'warning',
      isConnected: true,
      heartRate: 95,
      spO2: 96,
      temperature: 37.3, // Celsius
      location: 'Al Ain - Hili Technology School - Parking Area',
      vehicleId: 'BUS-002',
      speed: 5,
      batteryLevel: 67,
      activeAlerts: ['temp-warning']
    },
    {
      id: 'DRV-003',
      name: 'Priya Sharma',
      avatar: null,
      healthStatus: 'warning',
      isConnected: true,
      heartRate: 85,
      spO2: 97,
      temperature: 38.1, // Celsius
      location: 'Al Ain - Hili Technology School - Building B',
      vehicleId: 'BUS-003',
      speed: 0,
      batteryLevel: 92,
      activeAlerts: ['alert-002']
    },
    {
      id: 'DRV-004',
      name: 'Omar Al-Mahmoud',
      avatar: null,
      healthStatus: 'good',
      isConnected: false,
      heartRate: 78,
      spO2: 97,
      temperature: 37.2, // Celsius
      location: 'Al Ain - Hili Technology School - Laboratory Block',
      vehicleId: 'BUS-004',
      speed: 0,
      batteryLevel: 15,
      activeAlerts: ['alert-003']
    },
    {
      id: 'DRV-005',
      name: 'Rajesh Kumar',
      avatar: null,
      healthStatus: 'warning',
      isConnected: true,
      heartRate: 88,
      spO2: 95,
      temperature: 37.4, // Celsius
      location: 'Al Ain - Hili Technology School - Sports Complex',
      vehicleId: 'BUS-005',
      speed: 15,
      batteryLevel: 76,
      activeAlerts: ['alert-004']
    },
    {
      id: 'DRV-006',
      name: 'Fatima Al-Qasimi',
      avatar: null,
      healthStatus: 'good',
      isConnected: true,
      heartRate: 70,
      spO2: 98,
      temperature: 36.8, // Celsius
      location: 'Al Ain - Hili Technology School - Admin Building',
      vehicleId: 'BUS-006',
      speed: 0,
      batteryLevel: 88,
      activeAlerts: []
    },
    {
      id: 'DRV-007',
      name: 'Suresh Patel',
      avatar: null,
      healthStatus: 'good',
      isConnected: true,
      heartRate: 74,
      spO2: 99,
      temperature: 36.9, // Celsius
      location: 'Al Ain - Hili Technology School - Workshop',
      vehicleId: 'BUS-007',
      speed: 0,
      batteryLevel: 95,
      activeAlerts: []
    },
    {
      id: 'DRV-008',
      name: 'Khalid Al-Nahyan',
      avatar: null,
      healthStatus: 'critical',
      isConnected: true,
      heartRate: 115,
      spO2: 93,
      temperature: 38.9, // Celsius
      location: 'Al Ain - Hili Technology School - Emergency Exit',
      vehicleId: 'BUS-008',
      speed: 25,
      batteryLevel: 34,
      activeAlerts: ['alert-001']
    }
  ];

  // System metrics for sidebar
  const systemMetrics = {
    activeBuses: drivers?.filter(d => d?.isConnected)?.length || 8,
    activeDrivers: drivers?.length || 8,
    activeAlerts: alerts?.filter(a => !a?.acknowledged)?.length || 2
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && isLiveMode) {
      const interval = setInterval(() => {
        setRefreshKey(prev => prev + 1);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isLiveMode]);

  // Event handlers
  const handleFleetChange = (fleet) => {
    setSelectedFleet(fleet);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleLiveModeToggle = () => {
    setIsLiveMode(!isLiveMode);
  };

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleExportData = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Exporting AI Guardian fleet data...');
  };

  const handleRefreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleMetricToggle = (metricKey) => {
    setSelectedMetrics(prev => 
      prev?.includes(metricKey)
        ? prev?.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const handleAlertAcknowledge = (alertId) => {
    console.log('Acknowledging alert:', alertId);
  };

  const handleAlertClick = (alert) => {
    navigate('/alert-management-center', { state: { selectedAlert: alert } });
  };

  const handleDriverClick = (driver) => {
    navigate('/driver-health-analytics', { state: { selectedDriver: driver } });
  };

  const handleMetricCardClick = (metricType) => {
    switch (metricType) {
      case 'alerts': navigate('/alert-management-center');
        break;
      case 'analytics': navigate('/driver-health-analytics');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar systemMetrics={systemMetrics} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Guardian Fleet Command</h1>
              <p className="text-sm text-gray-600">Real-time monitoring and health analytics for Al Ain fleet operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live Monitoring</span>
              </div>
              
              <button
                onClick={() => navigate('/template-selector')}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 flex items-center space-x-2 text-sm"
              >
                <Icon name="Layout" size={16} />
                <span>Templates</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Control Panel */}
          <FleetControlPanel
            selectedFleet={selectedFleet}
            onFleetChange={handleFleetChange}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
            isLiveMode={isLiveMode}
            onLiveModeToggle={handleLiveModeToggle}
            autoRefresh={autoRefresh}
            onAutoRefreshToggle={handleAutoRefreshToggle}
            onExportData={handleExportData}
            onRefreshData={handleRefreshData}
          />

          {/* Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {fleetMetrics?.map((metric, index) => (
              <FleetMetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                unit={metric?.unit}
                trend={metric?.trend}
                status={metric?.status}
                icon={metric?.icon}
                sparklineData={metric?.sparklineData}
                onClick={() => handleMetricCardClick(metric?.title?.toLowerCase()?.includes('alert') ? 'alerts' : 'analytics')}
              />
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Biometric Chart - Takes 2 columns on xl screens */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:col-span-2"
            >
              <BiometricChart
                data={biometricData}
                selectedMetrics={selectedMetrics}
                timeRange={timeRange}
                isLive={isLiveMode}
                onMetricToggle={handleMetricToggle}
              />
            </motion.div>

            {/* Alert Feed - Takes 1 column on xl screens */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-1"
            >
              <AlertFeed
                alerts={alerts}
                onAlertAcknowledge={handleAlertAcknowledge}
                onAlertClick={handleAlertClick}
                maxHeight="500px"
              />
            </motion.div>
          </div>

          {/* Driver Status Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Al Ain Fleet Status</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2 bg-green-50 rounded-full px-3 py-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Good ({drivers?.filter(d => d?.healthStatus === 'good')?.length})</span>
                </div>
                <div className="flex items-center space-x-2 bg-yellow-50 rounded-full px-3 py-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Warning ({drivers?.filter(d => d?.healthStatus === 'warning')?.length})</span>
                </div>
                <div className="flex items-center space-x-2 bg-red-50 rounded-full px-3 py-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical ({drivers?.filter(d => d?.healthStatus === 'critical')?.length})</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {drivers?.map((driver, index) => (
                <motion.div
                  key={driver?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <DriverStatusCard
                    driver={driver}
                    onClick={handleDriverClick}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Icon name="Activity" size={16} className="text-green-500" />
                  <span>Dashboard Status: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Wifi" size={16} className="text-blue-500" />
                  <span>Data Source: {isLiveMode ? 'Live WebSocket' : 'Demo Mode'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Thermometer" size={16} className="text-purple-500" />
                  <span>Temperature Unit: Celsius (°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} className="text-orange-500" />
                  <span>Auto-refresh: {autoRefresh ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Icon name="Shield" size={16} />
                <span>Secure Connection</span>
                <span>•</span>
                <span>© 2024 AI Guardian</span>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default FleetCommandDashboard;