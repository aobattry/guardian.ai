import React from 'react';
import Icon from '../../../components/AppIcon';

const DriverFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  healthFilter,
  onHealthFilterChange,
  nationalityFilter,
  onNationalityFilterChange,
  totalDrivers 
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Search & Filters</h3>
          <p className="text-sm text-gray-600">Find and filter drivers by various criteria</p>
        </div>
        
        <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
          <Icon name="Users" size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-700">{totalDrivers} drivers</span>
        </div>
      </div>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e?.target?.value)}
            placeholder="Search by name, ID, contact, or bus number..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
          />
          
          {searchTerm && (
            <button
              onClick={() => onSearchChange?.('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <Icon name="X" size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange?.(e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-break">On Break</option>
              <option value="off-duty">Off Duty</option>
            </select>
          </div>

          {/* Health Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Health Status</label>
            <select
              value={healthFilter}
              onChange={(e) => onHealthFilterChange?.(e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
            >
              <option value="all">All Health</option>
              <option value="good">Good</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Nationality Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Nationality</label>
            <select
              value={nationalityFilter}
              onChange={(e) => onNationalityFilterChange?.(e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
            >
              <option value="all">All Nationalities</option>
              <option value="UAE">UAE</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Quick Actions</label>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  onSearchChange?.('');
                  onStatusFilterChange?.('all');
                  onHealthFilterChange?.('all');
                  onNationalityFilterChange?.('all');
                }}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <Icon name="RotateCcw" size={14} />
                <span>Clear</span>
              </button>
              
              <button
                onClick={() => onHealthFilterChange?.('critical')}
                className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <Icon name="AlertCircle" size={14} />
                <span>Critical</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Active Filters Display */}
      {(searchTerm || statusFilter !== 'all' || healthFilter !== 'all' || nationalityFilter !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Active Filters:</span>
            <button
              onClick={() => {
                onSearchChange?.('');
                onStatusFilterChange?.('all');
                onHealthFilterChange?.('all');
                onNationalityFilterChange?.('all');
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: "{searchTerm}"
                <button
                  onClick={() => onSearchChange?.('')}
                  className="ml-1 hover:text-blue-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Status: {statusFilter}
                <button
                  onClick={() => onStatusFilterChange?.('all')}
                  className="ml-1 hover:text-green-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {healthFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Health: {healthFilter}
                <button
                  onClick={() => onHealthFilterChange?.('all')}
                  className="ml-1 hover:text-yellow-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {nationalityFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Nationality: {nationalityFilter}
                <button
                  onClick={() => onNationalityFilterChange?.('all')}
                  className="ml-1 hover:text-purple-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverFilters;