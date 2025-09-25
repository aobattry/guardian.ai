import React from 'react';
import Icon from '../../../components/AppIcon';

const DriverCard = ({ driver, onCall, onDetails }) => {
  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthStatusIcon = (status) => {
    switch (status) {
      case 'good': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'critical': return 'AlertCircle';
      default: return 'Help';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
      {/* Driver Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Icon name="User" size={18} className="text-white" />
            </div>
            {/* Connection Status */}
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              driver?.isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{driver?.name}</h3>
            <p className="text-xs text-gray-500">ID: {driver?.id}</p>
          </div>
        </div>

        {/* Health Status Badge */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getHealthStatusColor(driver?.healthStatus)}`}>
          <div className="flex items-center space-x-1">
            <Icon name={getHealthStatusIcon(driver?.healthStatus)} size={12} />
            <span className="capitalize">{driver?.healthStatus}</span>
          </div>
        </div>
      </div>

      {/* Bus Number */}
      <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded-lg">
        <Icon name="Truck" size={14} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Bus: {driver?.busNumber}</span>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <Icon name="Heart" size={14} className="text-red-500 mx-auto mb-1" />
          <div className="text-xs font-medium text-red-700">{driver?.heartRate}</div>
          <div className="text-xs text-red-600">bpm</div>
        </div>
        
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <Icon name="Activity" size={14} className="text-blue-500 mx-auto mb-1" />
          <div className="text-xs font-medium text-blue-700">{driver?.spO2}</div>
          <div className="text-xs text-blue-600">%</div>
        </div>
        
        <div className="text-center p-2 bg-orange-50 rounded-lg">
          <Icon name="Thermometer" size={14} className="text-orange-500 mx-auto mb-1" />
          <div className="text-xs font-medium text-orange-700">{driver?.temperature}</div>
          <div className="text-xs text-orange-600">°F</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onCall?.(driver)}
          className="w-12 h-12 bg-green-50 hover:bg-green-100 text-green-600 font-medium rounded-full transition-colors duration-200 flex items-center justify-center border border-green-200 hover:border-green-300"
        >
          <Icon name="Phone" size={16} />
        </button>
        
        <button
          onClick={() => onDetails?.(driver)}
          className="w-12 h-12 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-full transition-colors duration-200 flex items-center justify-center border border-blue-200 hover:border-blue-300"
        >
          <Icon name="Eye" size={16} />
        </button>
      </div>
    </div>
  );
};

export default DriverCard;