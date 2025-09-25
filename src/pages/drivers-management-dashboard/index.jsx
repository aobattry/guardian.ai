import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import DriversTable from './components/DriversTable';
import DriverFilters from './components/DriverFilters';
import DriverStatsCards from './components/DriverStatsCards';
import DriverDetailsModal from './components/DriverDetailsModal';
import Sidebar from '../../components/ui/Sidebar';

const DriversManagementDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');
  const [nationalityFilter, setNationalityFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock comprehensive driver data for Al Ain - Hili Technology School
  const driversData = [
    {
      id: 'DRV-001',
      name: 'Samir Al-Rashid',
      employeeId: 'EMP-001',
      status: 'active',
      healthStatus: 'good',
      contactNumber: '+971-50-123-4567',
      nationality: 'UAE',
      busNumber: 'AL-001',
      route: 'Route A - City Center to Hili',
      heartRate: 75,
      spO2: 98,
      temperature: 98.6,
      experience: '8 years',
      shift: 'Morning',
      emergencyContact: '+971-50-765-4321',
      licenseExpiry: '2025-12-31',
      medicalCertExpiry: '2024-08-15',
      performance: 95,
      isConnected: true,
      lastUpdate: new Date(),
      address: 'Al Ain, Hili District',
      joinDate: '2016-03-15'
    },
    {
      id: 'DRV-002',
      name: 'Ahmed Al-Zahra',
      employeeId: 'EMP-002',
      status: 'active',
      healthStatus: 'warning',
      contactNumber: '+971-55-234-5678',
      nationality: 'UAE',
      busNumber: 'AL-002',
      route: 'Route B - Hili to Jahili',
      heartRate: 95,
      spO2: 96,
      temperature: 99.2,
      experience: '5 years',
      shift: 'Morning',
      emergencyContact: '+971-50-876-5432',
      licenseExpiry: '2026-04-20',
      medicalCertExpiry: '2024-09-10',
      performance: 88,
      isConnected: true,
      lastUpdate: new Date(Date.now() - 300000),
      address: 'Al Ain, Al Jimi',
      joinDate: '2019-07-20'
    },
    {
      id: 'DRV-003',
      name: 'Priya Sharma',
      employeeId: 'EMP-003',
      status: 'active',
      healthStatus: 'good',
      contactNumber: '+971-56-345-6789',
      nationality: 'India',
      busNumber: 'AL-003',
      route: 'Route C - Hili to Tawam',
      heartRate: 72,
      spO2: 99,
      temperature: 98.4,
      experience: '3 years',
      shift: 'Afternoon',
      emergencyContact: '+971-50-987-6543',
      licenseExpiry: '2025-11-15',
      medicalCertExpiry: '2024-07-25',
      performance: 92,
      isConnected: true,
      lastUpdate: new Date(Date.now() - 150000),
      address: 'Al Ain, Hili District',
      joinDate: '2021-02-10'
    },
    {
      id: 'DRV-004',
      name: 'Omar Al-Mahmoud',
      employeeId: 'EMP-004',
      status: 'on-break',
      healthStatus: 'good',
      contactNumber: '+971-52-456-7890',
      nationality: 'UAE',
      busNumber: 'AL-004',
      route: 'Route D - Hili to Mercato',
      heartRate: 78,
      spO2: 97,
      temperature: 98.8,
      experience: '6 years',
      shift: 'Morning',
      emergencyContact: '+971-50-098-7654',
      licenseExpiry: '2024-08-30',
      medicalCertExpiry: '2024-10-05',
      performance: 90,
      isConnected: false,
      lastUpdate: new Date(Date.now() - 900000),
      address: 'Al Ain, Al Muwaiji',
      joinDate: '2018-05-12'
    },
    {
      id: 'DRV-005',
      name: 'Rajesh Kumar',
      employeeId: 'EMP-005',
      status: 'active',
      healthStatus: 'good',
      contactNumber: '+971-54-567-8901',
      nationality: 'India',
      busNumber: 'AL-005',
      route: 'Route E - Hili to Bawadi',
      heartRate: 74,
      spO2: 98,
      temperature: 98.3,
      experience: '4 years',
      shift: 'Afternoon',
      emergencyContact: '+971-50-109-8765',
      licenseExpiry: '2025-06-18',
      medicalCertExpiry: '2024-11-20',
      performance: 87,
      isConnected: true,
      lastUpdate: new Date(Date.now() - 45000),
      address: 'Al Ain, Hili District',
      joinDate: '2020-09-08'
    },
    {
      id: 'DRV-006',
      name: 'Fatima Al-Qasimi',
      employeeId: 'EMP-006',
      status: 'active',
      healthStatus: 'good',
      contactNumber: '+971-58-678-9012',
      nationality: 'UAE',
      busNumber: 'AL-006',
      route: 'Route F - Hili to Al Jimi',
      heartRate: 70,
      spO2: 98,
      temperature: 98.1,
      experience: '7 years',
      shift: 'Morning',
      emergencyContact: '+971-50-210-9876',
      licenseExpiry: '2026-01-12',
      medicalCertExpiry: '2024-12-08',
      performance: 96,
      isConnected: true,
      lastUpdate: new Date(Date.now() - 120000),
      address: 'Al Ain, Al Jimi',
      joinDate: '2017-11-25'
    },
    {
      id: 'DRV-007',
      name: 'Suresh Patel',
      employeeId: 'EMP-007',
      status: 'active',
      healthStatus: 'good',
      contactNumber: '+971-59-789-0123',
      nationality: 'India',
      busNumber: 'AL-007',
      route: 'Route G - Hili to Al Saad',
      heartRate: 76,
      spO2: 99,
      temperature: 98.5,
      experience: '2 years',
      shift: 'Evening',
      emergencyContact: '+971-50-321-0987',
      licenseExpiry: '2025-09-22',
      medicalCertExpiry: '2024-06-14',
      performance: 85,
      isConnected: true,
      lastUpdate: new Date(Date.now() - 200000),
      address: 'Al Ain, Hili District',
      joinDate: '2022-03-18'
    },
    {
      id: 'DRV-008',
      name: 'Khalid Al-Nahyan',
      employeeId: 'EMP-008',
      status: 'off-duty',
      healthStatus: 'critical',
      contactNumber: '+971-57-890-1234',
      nationality: 'UAE',
      busNumber: 'AL-008',
      route: 'Route H - Hili to Al Towayya',
      heartRate: 115,
      spO2: 93,
      temperature: 100.1,
      experience: '10 years',
      shift: 'Morning',
      emergencyContact: '+971-50-432-1098',
      licenseExpiry: '2024-12-05',
      medicalCertExpiry: '2025-01-30',
      performance: 82,
      isConnected: true,
      lastUpdate: new Date(Date.now() - 600000),
      address: 'Al Ain, Al Muwaiji',
      joinDate: '2014-08-10'
    },
    {
      id: 'DRV-009',
      name: 'Mohammad Rizwan',
      employeeId: 'EMP-009',
      status: 'active',
      healthStatus: 'good',
      contactNumber: '+971-53-901-2345',
      nationality: 'Pakistan',
      busNumber: 'AL-009',
      route: 'Route I - Hili to Zakher',
      heartRate: 73,
      spO2: 98,
      temperature: 98.2,
      experience: '5 years',
      shift: 'Afternoon',
      emergencyContact: '+971-50-543-2109',
      licenseExpiry: '2025-07-14',
      medicalCertExpiry: '2024-09-28',
      performance: 91,
      isConnected: true,
      lastUpdate: new Date(Date.now() - 80000),
      address: 'Al Ain, Hili District',
      joinDate: '2019-12-05'
    },
    {
      id: 'DRV-010',
      name: 'Aisha Al-Mazrouei',
      employeeId: 'EMP-010',
      status: 'active',
      healthStatus: 'good',
      contactNumber: '+971-51-012-3456',
      nationality: 'UAE',
      busNumber: 'AL-010',
      route: 'Route J - Hili to Al Khabisi',
      heartRate: 69,
      spO2: 99,
      temperature: 97.9,
      experience: '4 years',
      shift: 'Morning',
      emergencyContact: '+971-50-654-3210',
      licenseExpiry: '2026-03-08',
      medicalCertExpiry: '2024-11-12',
      performance: 94,
      isConnected: true,
      lastUpdate: new Date(Date.now() - 60000),
      address: 'Al Ain, Al Jimi',
      joinDate: '2020-01-22'
    }
  ];

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter drivers based on search and filters
  const filteredDrivers = driversData?.filter(driver => {
    const matchesSearch = searchTerm === '' || 
      driver?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      driver?.employeeId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      driver?.contactNumber?.includes(searchTerm) ||
      driver?.busNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || driver?.status === statusFilter;
    const matchesHealth = healthFilter === 'all' || driver?.healthStatus === healthFilter;
    const matchesNationality = nationalityFilter === 'all' || driver?.nationality === nationalityFilter;
    
    return matchesSearch && matchesStatus && matchesHealth && matchesNationality;
  });

  // Calculate statistics
  const stats = {
    total: driversData?.length,
    active: driversData?.filter(d => d?.status === 'active')?.length,
    onBreak: driversData?.filter(d => d?.status === 'on-break')?.length,
    offDuty: driversData?.filter(d => d?.status === 'off-duty')?.length,
    healthGood: driversData?.filter(d => d?.healthStatus === 'good')?.length,
    healthWarning: driversData?.filter(d => d?.healthStatus === 'warning')?.length,
    healthCritical: driversData?.filter(d => d?.healthStatus === 'critical')?.length,
    connected: driversData?.filter(d => d?.isConnected)?.length
  };

  // System metrics for sidebar
  const systemMetrics = {
    activeBuses: 10,
    activeDrivers: stats?.active || 8,
    activeAlerts: stats?.healthCritical + stats?.healthWarning || 3
  };

  const handleDriverDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDriverDetails(true);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleExportData = () => {
    // Simulate CSV export
    const csvData = filteredDrivers?.map(driver => ({
      Name: driver?.name,
      ID: driver?.employeeId,
      Status: driver?.status,
      Health: driver?.healthStatus,
      Contact: driver?.contactNumber,
      Bus: driver?.busNumber,
      Nationality: driver?.nationality
    }));
    
    console.log('Exporting driver data:', csvData);
    alert('Driver data exported successfully! (Simulated)');
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
              <h1 className="text-2xl font-bold text-gray-900">Drivers Management</h1>
              <p className="text-sm text-gray-600">Al Ain - Hili Technology School Fleet Personnel</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">System Active</span>
              </div>
              
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Icon name="Download" size={16} />
                <span>Export</span>
              </button>
              
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
          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <DriverStatsCards stats={stats} />
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <DriverFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              healthFilter={healthFilter}
              onHealthFilterChange={setHealthFilter}
              nationalityFilter={nationalityFilter}
              onNationalityFilterChange={setNationalityFilter}
              totalDrivers={filteredDrivers?.length}
            />
          </motion.div>

          {/* Drivers Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DriversTable
              drivers={filteredDrivers}
              onDriverDetails={handleDriverDetails}
              refreshKey={refreshKey}
            />
          </motion.div>
        </main>
      </div>
      {/* Driver Details Modal */}
      {showDriverDetails && selectedDriver && (
        <DriverDetailsModal
          driver={selectedDriver}
          isOpen={showDriverDetails}
          onClose={() => setShowDriverDetails(false)}
        />
      )}
    </div>
  );
};

export default DriversManagementDashboard;