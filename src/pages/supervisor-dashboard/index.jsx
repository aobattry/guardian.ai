import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Sidebar from '../../components/ui/Sidebar';

const SupervisorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for active navigation
  const [activeNav, setActiveNav] = useState('dashboard');
  const [alertSoundEnabled, setAlertSoundEnabled] = useState(true);

  // Mock data for dashboard metrics
  const systemMetrics = {
    activeBuses: 12,
    activeDrivers: 12,
    activeAlerts: 3,
    activeDriversMain: 11,
    activeBusesMain: 8,
    criticalAlerts: 0,
    healthWarnings: 5
  };

  // Heart rate trend data for chart
  const heartRateData = [
    { time: '09:00', rate: 75 },
    { time: '10:00', rate: 78 },
    { time: '11:00', rate: 82 },
    { time: '12:00', rate: 80 },
    { time: '13:00', rate: 77 },
    { time: '14:00', rate: 79 },
    { time: '15:00', rate: 83 }
  ];

  // Navigation items
  const controlCenterItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', route: '/supervisor-dashboard' },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: 'Activity', route: '/fleet-command-dashboard' },
    { id: 'driver-tracking', label: 'Driver Tracking', icon: 'MapPin', route: '/driver-tracking-control-center' },
    { id: 'drivers', label: 'Drivers', icon: 'Users', route: '/drivers-management-dashboard' },
    { id: 'fleet', label: 'Fleet', icon: 'Truck', route: '/fleet-command-dashboard' },
    { id: 'alerts', label: 'Alerts', icon: 'Bell', badge: systemMetrics?.activeAlerts, route: '/alert-management-center' }
  ];

  const handleNavigation = (item) => {
    if (item?.id === 'dashboard') {
      setActiveNav(item?.id);
    } else {
      navigate(item?.route);
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
              <h1 className="text-2xl font-bold text-gray-900">Control Dashboard</h1>
              <p className="text-sm text-gray-600">Real-time monitoring and control</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Active Drivers Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Drivers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{systemMetrics?.activeDriversMain}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">SUCCESS</span>
              </div>
            </motion.div>

            {/* Active Buses Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Buses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{systemMetrics?.activeBusesMain}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Truck" size={24} className="text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-blue-600 font-medium">OPERATIONAL</span>
              </div>
            </motion.div>

            {/* Critical Alerts Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{systemMetrics?.criticalAlerts}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">ALL CLEAR</span>
              </div>
            </motion.div>

            {/* Health Warnings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Health Warnings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{systemMetrics?.healthWarnings}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Icon name="Heart" size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-yellow-600 font-medium">MONITORING</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Alerts Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
              <div className="text-center py-12">
                <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
                <p className="text-xl font-semibold text-green-600">All Clear!</p>
                <p className="text-sm text-gray-500 mt-1">No active alerts at this time</p>
              </div>
            </motion.div>

            {/* Driver Heart Rate Trends */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Heart Rate Trends</h3>
              <div className="h-48 relative">
                {/* Simple line chart visualization */}
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="heartRateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4]?.map((i) => (
                    <line
                      key={i}
                      x1="40"
                      y1={40 + i * 30}
                      x2="360"
                      y2={40 + i * 30}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Heart rate line */}
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    points={heartRateData?.map((point, index) => {
                        const x = 40 + (index * 50);
                        const y = 160 - ((point?.rate - 70) * 3);
                        return `${x},${y}`;
                      })?.join(' ')}
                  />
                  
                  {/* Fill area under the line */}
                  <polygon
                    fill="url(#heartRateGradient)"
                    points={
                      heartRateData?.map((point, index) => {
                          const x = 40 + (index * 50);
                          const y = 160 - ((point?.rate - 70) * 3);
                          return `${x},${y}`;
                        })?.join(' ') + ' 340,160 40,160'
                    }
                  />
                  
                  {/* Data points */}
                  {heartRateData?.map((point, index) => (
                    <circle
                      key={index}
                      cx={40 + (index * 50)}
                      cy={160 - ((point?.rate - 70) * 3)}
                      r="3"
                      fill="#3B82F6"
                    />
                  ))}
                </svg>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-8">
                  <span>90</span>
                  <span>85</span>
                  <span>80</span>
                  <span>75</span>
                  <span>70</span>
                </div>
              </div>
              
              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-8">
                {heartRateData?.map((point) => (
                  <span key={point?.time}>{point?.time}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Safety Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Status</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">SAFE</p>
                  <p className="text-sm text-gray-500">All systems operational</p>
                </div>
              </div>
            </motion.div>

            {/* Health Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Score</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="Activity" size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">92%</p>
                  <p className="text-sm text-gray-500">Fleet health average</p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SupervisorDashboard;