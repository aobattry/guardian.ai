import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HealthDataTable = ({ 
  selectedDrivers = ['all'],
  selectedMetrics = ['heartRate'],
  dateRange = '7d',
  onExport,
  className = ""
}) => {
  const [tableData, setTableData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Generate mock health readings data
  useEffect(() => {
    const generateHealthReadings = () => {
      const readings = [];
      const drivers = [
        { id: 'DRV-2024-001', name: 'Michael Rodriguez', deviceId: 'DEV-001' },
        { id: 'DRV-2024-002', name: 'Sarah Johnson', deviceId: 'DEV-002' },
        { id: 'DRV-2024-003', name: 'David Chen', deviceId: 'DEV-003' },
        { id: 'DRV-2024-004', name: 'Emily Davis', deviceId: 'DEV-004' },
        { id: 'DRV-2024-005', name: 'James Wilson', deviceId: 'DEV-005' }
      ];

      const now = new Date();
      const hoursBack = dateRange === '24h' ? 24 : dateRange === '7d' ? 168 : 720; // 24h, 7d, 30d

      for (let i = 0; i < 200; i++) {
        const timestamp = new Date(now.getTime() - (Math.random() * hoursBack * 60 * 60 * 1000));
        const driver = drivers?.[Math.floor(Math.random() * drivers?.length)];
        
        // Generate realistic health metrics with some variation
        const baseHeartRate = 65 + Math.random() * 25;
        const baseSpO2 = 95 + Math.random() * 5;
        const baseTemp = 98.0 + Math.random() * 2;
        
        // Add some anomalies occasionally
        const isAnomaly = Math.random() < 0.05;
        
        readings?.push({
          id: `READ-${String(i + 1)?.padStart(4, '0')}`,
          timestamp: timestamp?.toISOString(),
          driverId: driver?.id,
          driverName: driver?.name,
          deviceId: driver?.deviceId,
          heartRate: isAnomaly ? baseHeartRate + 30 : baseHeartRate,
          spO2: isAnomaly ? Math.max(85, baseSpO2 - 10) : baseSpO2,
          temperature: isAnomaly ? baseTemp + 2 : baseTemp,
          batteryLevel: 75 + Math.random() * 25,
          signalStrength: 60 + Math.random() * 40,
          location: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.1,
            lng: -74.0060 + (Math.random() - 0.5) * 0.1,
            address: `Route ${Math.floor(Math.random() * 50) + 1}`
          },
          isAnomaly,
          dataQuality: Math.random() > 0.1 ? 'good' : 'poor',
          syncStatus: Math.random() > 0.05 ? 'synced' : 'pending'
        });
      }

      return readings?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    setIsLoading(true);
    setTimeout(() => {
      setTableData(generateHealthReadings());
      setIsLoading(false);
    }, 500);
  }, [selectedDrivers, dateRange]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig?.key) return tableData;

    return [...tableData]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [tableData, sortConfig]);

  // Filter data
  const filteredData = React.useMemo(() => {
    if (!filterText) return sortedData;

    return sortedData?.filter(row =>
      row?.driverName?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
      row?.driverId?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
      row?.deviceId?.toLowerCase()?.includes(filterText?.toLowerCase()) ||
      row?.location?.address?.toLowerCase()?.includes(filterText?.toLowerCase())
    );
  }, [sortedData, filterText]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData?.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handle row selection
  const handleRowSelect = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected?.has(id)) {
      newSelected?.delete(id);
    } else {
      newSelected?.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows?.size === paginatedData?.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  };

  // Export selected data
  const handleExport = () => {
    const dataToExport = selectedRows?.size > 0 
      ? filteredData?.filter(row => selectedRows?.has(row?.id))
      : filteredData;
    
    if (onExport) {
      onExport(dataToExport);
    }
  };

  // Get status styling
  const getStatusStyling = (status, value) => {
    switch (status) {
      case 'good':
        return 'text-success bg-success/10';
      case 'poor':
        return 'text-error bg-error/10';
      case 'synced':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date?.toLocaleDateString(),
      time: date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (isLoading) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading health data...</span>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredData?.length / pageSize);

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Health Data Records</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Individual biometric readings with device and location data
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              onClick={handleExport}
              disabled={filteredData?.length === 0}
            >
              Export ({selectedRows?.size > 0 ? selectedRows?.size : filteredData?.length})
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search drivers, devices, or locations..."
              value={filterText}
              onChange={(e) => setFilterText(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e?.target?.value))}
            className="px-3 py-2 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedRows?.size === paginatedData?.length && paginatedData?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              
              {[
                { key: 'timestamp', label: 'Timestamp' },
                { key: 'driverName', label: 'Driver' },
                { key: 'heartRate', label: 'Heart Rate' },
                { key: 'spO2', label: 'SpO₂' },
                { key: 'temperature', label: 'Temperature' },
                { key: 'batteryLevel', label: 'Battery' },
                { key: 'dataQuality', label: 'Quality' },
                { key: 'syncStatus', label: 'Sync' }
              ]?.map(column => (
                <th
                  key={column?.key}
                  className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    {sortConfig?.key === column?.key && (
                      <Icon 
                        name={sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                        size={14} 
                      />
                    )}
                  </div>
                </th>
              ))}
              
              <th className="w-20 p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {paginatedData?.map((row, index) => {
              const formatted = formatTimestamp(row?.timestamp);
              return (
                <tr 
                  key={row?.id}
                  className={`border-t border-border hover:bg-muted/30 transition-colors ${
                    row?.isAnomaly ? 'bg-error/5' : ''
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows?.has(row?.id)}
                      onChange={() => handleRowSelect(row?.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">{formatted?.date}</div>
                      <div className="text-muted-foreground font-mono">{formatted?.time}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">{row?.driverName}</div>
                      <div className="text-muted-foreground font-mono">{row?.driverId}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`text-sm font-mono ${
                      row?.heartRate > 100 ? 'text-error' : 
                      row?.heartRate < 60 ? 'text-warning' : 'text-foreground'
                    }`}>
                      {row?.heartRate?.toFixed(0)} BPM
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`text-sm font-mono ${
                      row?.spO2 < 95 ? 'text-error' : 'text-foreground'
                    }`}>
                      {row?.spO2?.toFixed(1)}%
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`text-sm font-mono ${
                      row?.temperature > 99.5 ? 'text-error' : 
                      row?.temperature < 97.0 ? 'text-warning' : 'text-foreground'
                    }`}>
                      {row?.temperature?.toFixed(1)}°F
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        row?.batteryLevel > 50 ? 'bg-success' : 
                        row?.batteryLevel > 20 ? 'bg-warning' : 'bg-error'
                      }`}></div>
                      <span className="text-sm font-mono text-foreground">
                        {row?.batteryLevel?.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyling(row?.dataQuality)}`}>
                      {row?.dataQuality}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyling(row?.syncStatus)}`}>
                      {row?.syncStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="View details"
                    >
                      <Icon name="Eye" size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData?.length)} of {filteredData?.length} records
          {selectedRows?.size > 0 && ` (${selectedRows?.size} selected)`}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          />
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default HealthDataTable;