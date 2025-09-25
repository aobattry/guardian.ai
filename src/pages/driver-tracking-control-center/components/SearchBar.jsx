import React from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ searchTerm, onSearchChange, totalDrivers, connectedDrivers }) => {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Driver Search</h2>
        <p className="text-sm text-gray-600">Search by name, ID, or bus number</p>
      </div>
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="Search" size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e?.target?.value)}
          placeholder="Search drivers..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
        />
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{totalDrivers}</div>
          <div className="text-xs text-blue-700 font-medium">Total Drivers</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-600">{connectedDrivers}</div>
          <div className="text-xs text-green-700 font-medium">Connected</div>
        </div>
      </div>
      {/* Connection Status Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Real-time Updates</span>
          </div>
          <div className="text-gray-500">Every 15s</div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;