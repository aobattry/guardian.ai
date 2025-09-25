import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const DriverDetailsModal = ({ driver, isOpen, onClose }) => {
  if (!isOpen || !driver) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'on-break': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'off-duty': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Check if this is Samir (real data)
  const isRealData = driver?.name === 'Samir Al-Rashid';

  const realDataMessage = isRealData ? (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <div className="flex items-center space-x-2">
        <Icon name="Info" size={16} className="text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Real Driver Data</span>
      </div>
      <p className="text-sm text-blue-700 mt-1">
        This driver's information includes real health data and authentic employment records.
      </p>
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      {/* Modal */}
      <div className="relative min-h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Icon name="User" size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{driver?.name}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-sm text-gray-600">Employee ID: {driver?.employeeId}</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(driver?.status)}`}>
                      <span className="capitalize">{driver?.status?.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/80 rounded-lg transition-colors"
              >
                <Icon name="X" size={24} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
            {realDataMessage}
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Health Status Card */}
              <div className={`p-6 rounded-xl border ${getHealthStatusColor(driver?.healthStatus)}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Health Status</h3>
                  <Icon name="Heart" size={24} />
                </div>
                <div className="text-2xl font-bold capitalize mb-2">{driver?.healthStatus}</div>
                <div className="space-y-1 text-sm">
                  <div>Heart Rate: {driver?.heartRate} bpm</div>
                  <div>SpO2: {driver?.spO2}%</div>
                  <div>Temperature: {driver?.temperature}°F</div>
                </div>
              </div>

              {/* Performance Card */}
              <div className={`p-6 rounded-xl border ${getPerformanceColor(driver?.performance)}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Performance</h3>
                  <Icon name="TrendingUp" size={24} />
                </div>
                <div className="text-2xl font-bold mb-2">{driver?.performance}%</div>
                <div className="text-sm">
                  <div>Rating: {driver?.performance >= 90 ? 'Excellent' : driver?.performance >= 80 ? 'Good' : 'Needs Improvement'}</div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          driver?.performance >= 90 ? 'bg-green-500' : 
                          driver?.performance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${driver?.performance}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection Status Card */}
              <div className={`p-6 rounded-xl border ${driver?.isConnected ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Connection</h3>
                  <Icon name="Wifi" size={24} />
                </div>
                <div className="text-2xl font-bold mb-2">
                  {driver?.isConnected ? 'Online' : 'Offline'}
                </div>
                <div className="text-sm">
                  <div>Last Update: {driver?.lastUpdate?.toLocaleTimeString()}</div>
                  <div>Status: {driver?.isConnected ? 'Real-time data' : 'Reconnecting...'}</div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                      <div className="mt-1 text-sm text-gray-900">{driver?.name}</div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nationality</label>
                      <div className="mt-1 text-sm text-gray-900">{driver?.nationality}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience</label>
                      <div className="mt-1 text-sm text-gray-900">{driver?.experience}</div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Join Date</label>
                      <div className="mt-1 text-sm text-gray-900">
                        {new Date(driver?.joinDate)?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                    <div className="mt-1 text-sm text-gray-900">{driver?.address}</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="Phone" size={18} className="text-gray-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Primary Contact</div>
                          <div className="text-sm text-gray-600">{driver?.contactNumber}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Icon name="Phone" size={18} className="text-gray-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Emergency Contact</div>
                        <div className="text-sm text-gray-600">{driver?.emergencyContact}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                  Work Information
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bus Number</label>
                      <div className="mt-1 flex items-center space-x-2">
                        <Icon name="Truck" size={16} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{driver?.busNumber}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Shift</label>
                      <div className="mt-1 text-sm text-gray-900">{driver?.shift}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Route</label>
                    <div className="mt-1 text-sm text-gray-900">{driver?.route}</div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Certifications & Licenses</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="CreditCard" size={18} className="text-gray-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Driving License</div>
                          <div className="text-xs text-gray-600">
                            Expires: {new Date(driver?.licenseExpiry)?.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        new Date(driver?.licenseExpiry) > new Date(Date.now() + 30*24*60*60*1000)
                          ? 'text-green-600 bg-green-100' :'text-yellow-600 bg-yellow-100'
                      }`}>
                        {new Date(driver?.licenseExpiry) > new Date(Date.now() + 30*24*60*60*1000) ? 'Valid' : 'Expiring Soon'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="FileText" size={18} className="text-gray-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Medical Certificate</div>
                          <div className="text-xs text-gray-600">
                            Expires: {new Date(driver?.medicalCertExpiry)?.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        new Date(driver?.medicalCertExpiry) > new Date(Date.now() + 30*24*60*60*1000)
                          ? 'text-green-600 bg-green-100' :'text-yellow-600 bg-yellow-100'
                      }`}>
                        {new Date(driver?.medicalCertExpiry) > new Date(Date.now() + 30*24*60*60*1000) ? 'Valid' : 'Expiring Soon'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Health Metrics - Enhanced for Samir */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Current Health Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon name="Heart" size={32} className="text-red-500" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-600">{driver?.heartRate}</div>
                      <div className="text-sm text-red-600">bpm</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-red-700">Heart Rate</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {isRealData ? 'HealthKit Data' : 'Simulated Data'}
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon name="Activity" size={32} className="text-blue-500" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">{driver?.spO2}</div>
                      <div className="text-sm text-blue-600">%</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-700">Blood Oxygen</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {isRealData ? 'HealthKit Data' : 'Simulated Data'}
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon name="Thermometer" size={32} className="text-orange-500" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-orange-600">{driver?.temperature}</div>
                      <div className="text-sm text-orange-600">°F</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-orange-700">Body Temperature</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {isRealData ? 'HealthKit Data' : 'Simulated Data'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Last updated: {new Date()?.toLocaleTimeString()} • 
              Data source: {isRealData ? 'Real HealthKit Integration' : 'Simulated for Demo'}
            </div>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DriverDetailsModal;