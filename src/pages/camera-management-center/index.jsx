import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';

const CameraManagementCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCameras, setSelectedCameras] = useState([]);

  // Mock camera data for unpaired devices
  const [cameras, setCameras] = useState([
    {
      id: 'CAM-001',
      deviceId: 'DEV-4A5B6C',
      status: 'unpaired',
      driverName: 'Samir Al-Rashid',
      driverId: 'DRV-001',
      connectionStatus: 'available',
      health: 'good',
      lastSeen: new Date()
    },
    {
      id: 'CAM-002', 
      deviceId: 'DEV-7D8E9F',
      status: 'unpaired',
      driverName: 'Ahmed Al-Zahra',
      driverId: 'DRV-002',
      connectionStatus: 'available',
      health: 'good',
      lastSeen: new Date()
    },
    {
      id: 'CAM-003',
      deviceId: 'DEV-1G2H3I',
      status: 'unpaired',
      driverName: 'Priya Sharma',
      driverId: 'DRV-003',
      connectionStatus: 'weak',
      health: 'warning',
      lastSeen: new Date()
    },
    {
      id: 'CAM-004',
      deviceId: 'DEV-4J5K6L',
      status: 'unpaired',
      driverName: 'Omar Al-Mahmoud',
      driverId: 'DRV-004',
      connectionStatus: 'offline',
      health: 'critical',
      lastSeen: new Date(Date.now() - 300000)
    },
    {
      id: 'CAM-005',
      deviceId: 'DEV-7M8N9O',
      status: 'unpaired',
      driverName: 'Rajesh Kumar',
      driverId: 'DRV-005',
      connectionStatus: 'available',
      health: 'good',
      lastSeen: new Date()
    },
    {
      id: 'CAM-006',
      deviceId: 'DEV-1P2Q3R',
      status: 'unpaired',
      driverName: 'Fatima Al-Qasimi',
      driverId: 'DRV-006',
      connectionStatus: 'available',
      health: 'good',
      lastSeen: new Date()
    }
  ]);

  // System metrics for sidebar
  const systemMetrics = {
    activeBuses: 12,
    activeDrivers: 12,
    activeAlerts: 3
  };

  const handlePairDevice = (cameraId, driverId) => {
    setCameras(prev => prev?.map(cam => 
      cam?.id === cameraId 
        ? { ...cam, status: 'paired', pairedAt: new Date() }
        : cam
    ));
  };

  const handleBulkPair = () => {
    if (selectedCameras?.length > 0) {
      setCameras(prev => prev?.map(cam => 
        selectedCameras?.includes(cam?.id)
          ? { ...cam, status: 'paired', pairedAt: new Date() }
          : cam
      ));
      setSelectedCameras([]);
    }
  };

  const getConnectionColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'weak': return 'text-yellow-500';
      case 'offline': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const filteredCameras = cameras?.filter(camera => {
    const matchesSearch = camera?.deviceId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                          camera?.driverName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                          camera?.driverId?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || camera?.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

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
              <h1 className="text-2xl font-bold text-gray-900">Camera Management</h1>
              <p className="text-sm text-gray-600">Monitor and manage surveillance devices</p>
            </div>
            <div className="flex items-center space-x-2">
              {selectedCameras?.length > 0 && (
                <button
                  onClick={handleBulkPair}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <Icon name="Link" size={16} />
                  <span>Pair Selected ({selectedCameras?.length})</span>
                </button>
              )}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2">
                <Icon name="Settings" size={16} />
                <span>Device Config</span>
              </button>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search devices, drivers, or IDs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Devices</option>
              <option value="unpaired">Unpaired</option>
              <option value="paired">Paired</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{cameras?.length}</div>
              <div className="text-sm text-gray-600">Total Devices</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{cameras?.filter(c => c?.status === 'unpaired')?.length}</div>
              <div className="text-sm text-gray-600">Unpaired</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{cameras?.filter(c => c?.connectionStatus === 'available')?.length}</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{cameras?.filter(c => c?.connectionStatus === 'offline')?.length}</div>
              <div className="text-sm text-gray-600">Offline</div>
            </div>
          </div>
        </header>

        {/* Camera Grid - Grey Circular-sided Squares Design */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCameras?.map((camera, index) => (
              <motion.div
                key={camera?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Camera Card with Circular-sided Squares Design */}
                <div className="bg-gray-400 rounded-3xl aspect-square p-6 hover:bg-gray-500 transition-all duration-200 cursor-pointer group relative overflow-hidden">
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedCameras?.includes(camera?.id)}
                      onChange={(e) => {
                        if (e?.target?.checked) {
                          setSelectedCameras(prev => [...prev, camera?.id]);
                        } else {
                          setSelectedCameras(prev => prev?.filter(id => id !== camera?.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </div>

                  {/* Connection Status Indicator */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-3 h-3 rounded-full ${
                      camera?.connectionStatus === 'available' ? 'bg-green-400' :
                      camera?.connectionStatus === 'weak'? 'bg-yellow-400' : 'bg-red-400'
                    } ${camera?.connectionStatus === 'available' ? 'animate-pulse' : ''}`}></div>
                  </div>

                  {/* Camera Icon */}
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Icon name="Camera" size={40} className="text-white mb-3 mx-auto group-hover:scale-110 transition-transform duration-200" />
                      <div className="text-white text-sm font-medium">{camera?.deviceId}</div>
                      <div className={`text-xs mt-1 ${getConnectionColor(camera?.connectionStatus)}`}>
                        {camera?.connectionStatus}
                      </div>
                    </div>
                  </div>

                  {/* Pairing Status Overlay */}
                  {camera?.status === 'unpaired' && (
                    <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handlePairDevice(camera?.id, camera?.driverId)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                      >
                        <Icon name="Link" size={16} />
                        <span>Pair Device</span>
                      </button>
                    </div>
                  )}

                  {/* Paired Status Indicator */}
                  {camera?.status === 'paired' && (
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        ✓ Paired
                      </div>
                    </div>
                  )}
                </div>

                {/* Driver Info Below Camera */}
                <div className="mt-4 text-center">
                  <div className="text-sm font-medium text-gray-900">{camera?.driverName}</div>
                  <div className="text-xs text-gray-500">{camera?.driverId}</div>
                  
                  {/* Available for Assignment Status */}
                  {camera?.status === 'unpaired' && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Available for Assignment
                      </span>
                    </div>
                  )}

                  {/* Pair Device Button */}
                  {camera?.status === 'unpaired' && (
                    <div className="mt-2">
                      <button
                        onClick={() => handlePairDevice(camera?.id, camera?.driverId)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors duration-200"
                      >
                        Pair Device
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCameras?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Camera" size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cameras found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or device filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CameraManagementCenter;