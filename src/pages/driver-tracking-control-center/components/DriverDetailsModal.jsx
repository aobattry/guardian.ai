import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const DriverDetailsModal = ({ driver, isOpen, onClose, onCall }) => {
  if (!isOpen || !driver) return null;

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Real data for Samir
  const isRealData = driver?.name === 'Samir Al-Rashid';

  const realDataMessage = isRealData ? (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <div className="flex items-center space-x-2">
        <Icon name="Info" size={16} className="text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Real Health Data</span>
      </div>
      <p className="text-sm text-blue-700 mt-1">
        This driver's health data is being collected from real HealthKit sensors.
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
          className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{driver?.name}</h2>
                  <p className="text-sm text-gray-600">Driver Details - {driver?.id}</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/80 rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {realDataMessage}
            
            {/* Status Overview */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Health Status</label>
                  <div className={`mt-1 px-3 py-2 rounded-lg border font-medium text-sm ${getHealthStatusColor(driver?.healthStatus)}`}>
                    <div className="flex items-center space-x-2">
                      <Icon name="Heart" size={16} />
                      <span className="capitalize">{driver?.healthStatus}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Connection Status</label>
                  <div className={`mt-1 px-3 py-2 rounded-lg border font-medium text-sm ${
                    driver?.isConnected 
                      ? 'text-green-600 bg-green-50 border-green-200' :'text-red-600 bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${driver?.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>{driver?.isConnected ? 'Connected' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Bus Number</label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="Truck" size={16} className="text-gray-600" />
                      <span className="font-medium text-gray-900">{driver?.busNumber}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employee ID</label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-900">{driver?.employeeId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <Icon name="Heart" size={24} className="text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">{driver?.heartRate}</div>
                  <div className="text-xs text-red-600 font-medium">Heart Rate (bpm)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isRealData ? 'HealthKit Data' : 'Simulated'}
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <Icon name="Activity" size={24} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{driver?.spO2}</div>
                  <div className="text-xs text-blue-600 font-medium">Blood Oxygen (%)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isRealData ? 'HealthKit Data' : 'Simulated'}
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                  <Icon name="Thermometer" size={24} className="text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{driver?.temperature}</div>
                  <div className="text-xs text-orange-600 font-medium">Temperature (°F)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isRealData ? 'HealthKit Data' : 'Simulated'}
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nationality</label>
                  <div className="mt-1 text-sm text-gray-900">{driver?.nationality}</div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience</label>
                  <div className="mt-1 text-sm text-gray-900">{driver?.experience}</div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Shift</label>
                  <div className="mt-1 text-sm text-gray-900">{driver?.shift}</div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Route</label>
                  <div className="mt-1 text-sm text-gray-900">{driver?.route}</div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Phone" size={18} className="text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Primary Contact</div>
                      <div className="text-sm text-gray-600">{driver?.contactNumber}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onCall?.(driver)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Call
                  </button>
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

            {/* Current Location */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Location</h3>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="MapPin" size={18} className="text-blue-600 mt-1" />
                  <div>
                    <div className="font-medium text-blue-900">{driver?.location?.name}</div>
                    <div className="text-sm text-blue-700 mt-1">
                      Coordinates: {driver?.location?.lat}, {driver?.location?.lng}
                    </div>
                    <div className="text-xs text-blue-600 mt-2">
                      Last updated: {driver?.lastUpdate?.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Last updated: {new Date()?.toLocaleTimeString()}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onCall?.(driver)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-2"
              >
                <Icon name="Phone" size={16} />
                <span>Call Driver</span>
              </button>
              
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DriverDetailsModal;