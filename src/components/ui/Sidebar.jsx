import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const Sidebar = ({ systemMetrics = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Default system metrics
  const defaultMetrics = {
    activeBuses: 12,
    activeDrivers: 12,
    activeAlerts: 3,
    ...systemMetrics
  };

  // Navigation items
  const controlCenterItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', route: '/supervisor-dashboard' },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: 'Activity', route: '/fleet-command-dashboard' },
    { id: 'driver-tracking', label: 'Driver Tracking', icon: 'MapPin', route: '/driver-tracking-control-center' },
    { id: 'drivers', label: 'Drivers', icon: 'Users', route: '/drivers-management-dashboard' },
    { id: 'fleet', label: 'Fleet', icon: 'Truck', route: '/fleet-management-dashboard' },
    { id: 'alerts', label: 'Alerts', icon: 'Bell', badge: defaultMetrics?.activeAlerts, route: '/alert-management-center' },
    { id: 'camera', label: 'Camera', icon: 'Camera', route: '/camera-management-center' },
    { id: 'smartwatch', label: 'Smartwatch', icon: 'Watch', route: '/smartwatch-view' },
  ];

  const handleNavigation = (item) => {
    navigate(item?.route);
  };

  const getCurrentActiveItem = () => {
    const currentPath = location?.pathname;
    const activeItem = controlCenterItems?.find(item => item?.route === currentPath);
    return activeItem?.id || 'dashboard';
  };

  return (
    <div className="w-80 bg-white shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Guardian</h1>
            <p className="text-sm text-gray-500">School Bus Safety</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Real-time monitoring of school bus safety and driver health</p>
      </div>

      {/* System Status Indicator */}
      <div className="px-6 py-4 bg-green-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">System Online</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Control Center Section */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">CONTROL CENTER</h3>
          <nav className="space-y-1">
            {controlCenterItems?.map((item) => (
              <button
                key={item?.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  getCurrentActiveItem() === item?.id
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' :'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </div>
                {item?.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item?.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* System Status Section */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">SYSTEM STATUS</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Buses</span>
              <span className="text-sm font-semibold text-gray-900">{defaultMetrics?.activeBuses}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Drivers</span>
              <span className="text-sm font-semibold text-gray-900">{defaultMetrics?.activeDrivers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Alerts</span>
              <span className="text-sm font-semibold text-red-600">{defaultMetrics?.activeAlerts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Supervisor Safety Control Center</span>
          <button
            onClick={logout}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Logout"
          >
            <Icon name="LogOut" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;