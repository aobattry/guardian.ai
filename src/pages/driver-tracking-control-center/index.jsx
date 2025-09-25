import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import DriverCard from './components/DriverCard';
import MapView from './components/MapView';
import SearchBar from './components/SearchBar';
import DriverDetailsModal from './components/DriverDetailsModal';
import Sidebar from '../../components/ui/Sidebar';

const DriverTrackingControlCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock driver data for Alain city with Arabic/Indian names
  const driversData = [
    {
      id: 'DRV-001',
      name: 'Samir Al-Rashid',
      healthStatus: 'good',
      busNumber: 'AL-001',
      location: { lat: 24.2082, lng: 55.7658, name: 'Al Ain Hili Technology School - Main Gate' },
      heartRate: 75,
      spO2: 98,
      temperature: 98.6,
      contactNumber: '+971-50-123-4567',
      isConnected: true,
      lastUpdate: new Date(),
      nationality: 'UAE',
      employeeId: 'EMP-001',
      experience: '8 years',
      route: 'Route A - City Center to Hili',
      shift: 'Morning',
      emergencyContact: '+971-50-765-4321'
    },
    {
      id: 'DRV-002',
      name: 'Ahmed Al-Zahra',
      healthStatus: 'warning',
      busNumber: 'AL-002',
      location: { lat: 24.2095, lng: 55.7645, name: 'Al Ain Hili Technology School - Parking Area' },
      heartRate: 95,
      spO2: 96,
      temperature: 99.2,
      contactNumber: '+971-55-234-5678',
      isConnected: true,
      lastUpdate: new Date(Date.now() - 300000),
      nationality: 'UAE',
      employeeId: 'EMP-002',
      experience: '5 years',
      route: 'Route B - Hili to Jahili',
      shift: 'Morning',
      emergencyContact: '+971-50-876-5432'
    },
    {
      id: 'DRV-003',
      name: 'Priya Sharma',
      healthStatus: 'good',
      busNumber: 'AL-003',
      location: { lat: 24.2070, lng: 55.7670, name: 'Al Ain Hili Technology School - Building B' },
      heartRate: 72,
      spO2: 99,
      temperature: 98.4,
      contactNumber: '+971-56-345-6789',
      isConnected: true,
      lastUpdate: new Date(Date.now() - 150000),
      nationality: 'India',
      employeeId: 'EMP-003',
      experience: '3 years',
      route: 'Route C - Hili to Tawam',
      shift: 'Afternoon',
      emergencyContact: '+971-50-987-6543'
    },
    {
      id: 'DRV-004',
      name: 'Omar Al-Mahmoud',
      healthStatus: 'warning',
      busNumber: 'AL-004',
      location: { lat: 24.2088, lng: 55.7655, name: 'Al Ain Hili Technology School - Laboratory Block' },
      heartRate: 78,
      spO2: 97,
      temperature: 98.8,
      contactNumber: '+971-52-456-7890',
      isConnected: false,
      lastUpdate: new Date(Date.now() - 900000),
      nationality: 'UAE',
      employeeId: 'EMP-004',
      experience: '6 years',
      route: 'Route D - Hili to Mercato',
      shift: 'Morning',
      emergencyContact: '+971-50-098-7654'
    },
    {
      id: 'DRV-005',
      name: 'Rajesh Kumar',
      healthStatus: 'good',
      busNumber: 'AL-005',
      location: { lat: 24.2075, lng: 55.7680, name: 'Al Ain Hili Technology School - Sports Complex' },
      heartRate: 74,
      spO2: 98,
      temperature: 98.3,
      contactNumber: '+971-54-567-8901',
      isConnected: true,
      lastUpdate: new Date(Date.now() - 45000),
      nationality: 'India',
      employeeId: 'EMP-005',
      experience: '4 years',
      route: 'Route E - Hili to Bawadi',
      shift: 'Afternoon',
      emergencyContact: '+971-50-109-8765'
    },
    {
      id: 'DRV-006',
      name: 'Fatima Al-Qasimi',
      healthStatus: 'good',
      busNumber: 'AL-006',
      location: { lat: 24.2090, lng: 55.7665, name: 'Al Ain Hili Technology School - Admin Building' },
      heartRate: 70,
      spO2: 98,
      temperature: 98.1,
      contactNumber: '+971-58-678-9012',
      isConnected: true,
      lastUpdate: new Date(Date.now() - 120000),
      nationality: 'UAE',
      employeeId: 'EMP-006',
      experience: '7 years',
      route: 'Route F - Hili to Al Jimi',
      shift: 'Morning',
      emergencyContact: '+971-50-210-9876'
    }
  ];

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter drivers based on search term
  const filteredDrivers = driversData?.filter(driver => 
    driver?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    driver?.busNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    driver?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleDriverCall = (driver) => {
    // Simulate call functionality
    alert(`Calling ${driver?.name} at ${driver?.contactNumber}\n\n(This is a simulated call)`);
  };

  const handleDriverDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDriverDetails(true);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // System metrics for sidebar
  const systemMetrics = {
    activeBuses: 12,
    activeDrivers: filteredDrivers?.filter(d => d?.isConnected)?.length || 6,
    activeAlerts: 3
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
              <h1 className="text-2xl font-bold text-gray-900">Driver Tracking Control Center</h1>
              <p className="text-sm text-gray-600">Al Ain - Hili Technology School Fleet</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live Tracking</span>
              </div>
              
              <button
                onClick={handleRefresh}
                className="p-2 bg-white/80 hover:bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
                title="Refresh Data"
              >
                <Icon name="RefreshCw" size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Section - Driver List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Search Bar */}
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                totalDrivers={driversData?.length}
                connectedDrivers={driversData?.filter(d => d?.isConnected)?.length}
              />
              
              {/* Drivers List */}
              <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Active Drivers</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{filteredDrivers?.length} drivers</span>
                    </div>
                  </div>
                </div>
                
                <div className="max-h-[600px] overflow-y-auto">
                  <div className="space-y-3 p-4">
                    {filteredDrivers?.map((driver, index) => (
                      <motion.div
                        key={driver?.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <DriverCard
                          driver={driver}
                          onCall={handleDriverCall}
                          onDetails={handleDriverDetails}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Section - Map View */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <MapView
                drivers={filteredDrivers}
                onDriverSelect={handleDriverDetails}
                refreshKey={refreshKey}
              />
            </motion.div>
          </div>
        </main>
      </div>
      {/* Driver Details Modal */}
      {showDriverDetails && selectedDriver && (
        <DriverDetailsModal
          driver={selectedDriver}
          isOpen={showDriverDetails}
          onClose={() => setShowDriverDetails(false)}
          onCall={handleDriverCall}
        />
      )}
    </div>
  );
};

export default DriverTrackingControlCenter;