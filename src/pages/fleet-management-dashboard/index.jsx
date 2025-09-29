import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';

const FleetManagementDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Fleet metrics
  const fleetMetrics = {
    activeBuses: 8,
    maintenance: 3,
    totalFleet: 11
  };

  // System metrics for sidebar
  const systemMetrics = {
    activeBuses: 12,
    activeDrivers: 12,
    activeAlerts: 3
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar systemMetrics={systemMetrics} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
              <p className="text-sm text-gray-600">Monitor and manage school bus fleet</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2">
              <Icon name="Plus" size={16} />
              <span>Add New Bus</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search buses, schools, or routes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{fleetMetrics?.activeBuses}</div>
              <div className="text-sm text-gray-600">Active Buses</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{fleetMetrics?.maintenance}</div>
              <div className="text-sm text-gray-600">Maintenance</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{fleetMetrics?.totalFleet}</div>
              <div className="text-sm text-gray-600">Total Fleet</div>
            </div>
          </div>
        </header>

        {/* Main Content - Base44 iframe */}
        <main className="flex-1 overflow-y-auto p-6">
          <div style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
            <iframe
              src="https://ai-guardian-school-bus-safety-62696e71.base44.app"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              allowFullScreen
            ></iframe>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FleetManagementDashboard;
