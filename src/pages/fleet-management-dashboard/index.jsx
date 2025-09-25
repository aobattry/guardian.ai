import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';

const FleetManagementDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);

  // Fleet data matching the uploaded design exactly
  const fleetMetrics = {
    activeBuses: 8,
    maintenance: 3,
    totalFleet: 11
  };

  const busesData = [
    {
      id: 'B001',
      number: 'Bus B001',
      status: 'active',
      plateNumber: 'AUH-12345',
      school: 'مدرسة النور الدولية',
      route: 'الطريق الشمالي',
      capacity: 40,
      driver: 'Not assigned',
      equipment: 'working'
    },
    {
      id: 'B002', 
      number: 'Bus B002',
      status: 'active',
      plateNumber: 'DXB-67890',
      school: 'مدرسة النور الدولية',
      route: 'الطريق الجنوبي',
      capacity: 35,
      driver: 'Not assigned',
      equipment: 'working'
    },
    {
      id: 'B003',
      number: 'Bus B003', 
      status: 'maintenance',
      plateNumber: 'SHJ-13579',
      school: 'مدرسة الأمل',
      route: 'الطريق الرئيسي',
      capacity: 45,
      driver: 'Not assigned',
      equipment: 'issue'
    },
    {
      id: 'BUS103',
      number: 'BUS103',
      status: 'active',
      plateNumber: 'RAK-24680',
      school: 'مدرسة التميز',
      route: 'طريق الجامعة',
      capacity: 38,
      driver: 'Not assigned',
      equipment: 'working'
    },
    {
      id: 'BUS101',
      number: 'BUS101',
      status: 'active',
      plateNumber: 'FUJ-13579',
      school: 'مدرسة المستقبل',
      route: 'الطريق الشرقي',
      capacity: 42,
      driver: 'Not assigned',
      equipment: 'working'
    },
    {
      id: 'BUS102',
      number: 'BUS102',
      status: 'active',
      plateNumber: 'UAQ-97531',
      school: 'مدرسة الإبداع',
      route: 'طريق المركز',
      capacity: 36,
      driver: 'Not assigned', 
      equipment: 'working'
    }
  ];

  // System metrics for sidebar
  const systemMetrics = {
    activeBuses: 12,
    activeDrivers: 12,
    activeAlerts: 3
  };

  const filteredBuses = busesData?.filter(bus => 
    bus?.number?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    bus?.school?.includes(searchTerm) ||
    bus?.route?.includes(searchTerm)
  );

  const handleViewDetails = (bus) => {
    setSelectedBus(bus);
    console.log('View details for bus:', bus?.number);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'maintenance': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEquipmentStatus = (equipment) => {
    return equipment === 'working' ? 
      { text: 'Equipment working', color: 'text-green-600' } :
      { text: 'Equipment issue', color: 'text-red-600' };
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar systemMetrics={systemMetrics} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header matching uploaded design exactly */}
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
          
          {/* Search bar */}
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

          {/* Metrics Cards matching uploaded design exactly */}
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

        {/* Main Content - Bus Grid matching uploaded design exactly */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuses?.map((bus) => (
              <motion.div
                key={bus?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
              >
                {/* Bus Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="Truck" size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{bus?.number}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(bus?.status)}`}>
                        {bus?.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{bus?.plateNumber}</div>
                </div>

                {/* School and Route */}
                <div className="mb-4 space-y-2">
                  <div className="text-sm font-medium text-gray-900">{bus?.school}</div>
                  <div className="text-sm text-gray-600">Route {bus?.route}</div>
                </div>

                {/* Bus Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity</span>
                    <span className="text-gray-900 font-medium">{bus?.capacity} students</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Driver</span>
                    <span className="text-gray-900">{bus?.driver}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Equipment</span>
                    <span className={`font-medium ${getEquipmentStatus(bus?.equipment)?.color}`}>
                      {getEquipmentStatus(bus?.equipment)?.text}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewDetails(bus)}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredBuses?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Truck" size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FleetManagementDashboard;