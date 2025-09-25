import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const DriversTable = ({ drivers, onDriverDetails, refreshKey }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 8;

  // Sort drivers
  const sortedDrivers = [...drivers]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedDrivers?.length / driversPerPage);
  const startIndex = (currentPage - 1) * driversPerPage;
  const endIndex = startIndex + driversPerPage;
  const currentDrivers = sortedDrivers?.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
      case 'good': return 'text-emerald-600 bg-emerald-50';
      case 'warning': return 'text-amber-600 bg-amber-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-4 text-left cursor-pointer hover:bg-gray-50 transition-colors duration-150"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <span>{children}</span>
        <div className="flex flex-col">
          <Icon 
            name="ChevronUp" 
            size={12} 
            className={`${sortField === field && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-300'}`}
          />
          <Icon 
            name="ChevronDown" 
            size={12} 
            className={`${sortField === field && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-300'} -mt-1`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Drivers Directory</h3>
            <p className="text-sm text-gray-600">Comprehensive driver information and status</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, sortedDrivers?.length)} of {sortedDrivers?.length} drivers
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Real-time</span>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <SortableHeader field="name">Name</SortableHeader>
              <SortableHeader field="employeeId">ID</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="healthStatus">Health</SortableHeader>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <SortableHeader field="nationality">Nationality</SortableHeader>
              <SortableHeader field="busNumber">Bus</SortableHeader>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {currentDrivers?.map((driver, index) => (
              <motion.tr
                key={driver?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-blue-50/50 transition-colors duration-150"
              >
                {/* Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <Icon name="User" size={18} className="text-white" />
                      </div>
                      {/* Connection indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        driver?.isConnected ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{driver?.name}</div>
                      <div className="text-xs text-gray-500">
                        {driver?.name === 'Samir Al-Rashid' ? 'Real Data' : 'Simulated'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Employee ID */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900">{driver?.employeeId}</div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(driver?.status)}`}>
                    <div className="flex items-center space-x-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        driver?.status === 'active' ? 'bg-green-500' :
                        driver?.status === 'on-break' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="capitalize">{driver?.status?.replace('-', ' ')}</span>
                    </div>
                  </span>
                </td>

                {/* Health Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(driver?.healthStatus)}`}>
                    <Icon name={getHealthStatusIcon(driver?.healthStatus)} size={12} className="mr-1" />
                    <span className="capitalize">{driver?.healthStatus}</span>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono">{driver?.contactNumber}</div>
                </td>

                {/* Nationality */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{driver?.nationality}</div>
                </td>

                {/* Bus Number */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Icon name="Truck" size={14} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">{driver?.busNumber}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onDriverDetails?.(driver)}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors duration-200 space-x-1"
                  >
                    <Icon name="Eye" size={12} />
                    <span>View Details</span>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Icon name="ChevronLeft" size={16} />
              </button>
              
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)]?.map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === currentPage;
                  const showPage = pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1;
                  
                  if (!showPage && pageNum !== currentPage - 2 && pageNum !== currentPage + 2) {
                    return null;
                  }
                  
                  if (!showPage) {
                    return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isCurrentPage
                          ? 'bg-blue-500 text-white' :'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversTable;