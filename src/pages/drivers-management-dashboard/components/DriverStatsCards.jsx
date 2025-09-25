import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const DriverStatsCards = ({ stats }) => {
  const cardData = [
    {
      title: 'Total Drivers',
      value: stats?.total,
      icon: 'Users',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+2 this month'
    },
    {
      title: 'Active Drivers',
      value: stats?.active,
      icon: 'UserCheck',
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: `${Math.round((stats?.active / stats?.total) * 100)}% active`
    },
    {
      title: 'On Break',
      value: stats?.onBreak,
      icon: 'Clock',
      gradient: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      change: 'Break rotation'
    },
    {
      title: 'Connected Devices',
      value: stats?.connected,
      icon: 'Wifi',
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: `${Math.round((stats?.connected / stats?.total) * 100)}% connected`
    }
  ];

  const healthData = [
    {
      title: 'Good Health',
      value: stats?.healthGood,
      icon: 'CheckCircle',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Warnings',
      value: stats?.healthWarning,
      icon: 'AlertTriangle',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Critical',
      value: stats?.healthCritical,
      icon: 'AlertCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData?.map((card, index) => (
          <motion.div
            key={card?.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200"
          >
            <div className={`h-2 bg-gradient-to-r ${card?.gradient}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${card?.bgColor} rounded-xl`}>
                  <Icon name={card?.icon} size={24} className={card?.textColor} />
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{card?.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{card?.change}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700">{card?.title}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Health Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Health Status Overview</h3>
            <p className="text-sm text-gray-600">Real-time driver health monitoring</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">Live Data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {healthData?.map((health, index) => (
            <motion.div
              key={health?.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`${health?.bgColor} ${health?.borderColor} border rounded-xl p-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon name={health?.icon} size={20} className={health?.color} />
                <div className={`text-2xl font-bold ${health?.color}`}>
                  {health?.value}
                </div>
              </div>
              
              <div className={`text-sm font-medium ${health?.color}`}>
                {health?.title}
              </div>
              
              <div className="text-xs text-gray-600 mt-1">
                {Math.round((health?.value / stats?.total) * 100)}% of drivers
              </div>
            </motion.div>
          ))}
        </div>

        {/* Health Progress Bar */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Health Distribution</span>
            <span>{stats?.total} Total Drivers</span>
          </div>
          
          <div className="flex rounded-lg overflow-hidden h-3 bg-gray-200">
            <div 
              className="bg-green-500 transition-all duration-300"
              style={{ width: `${(stats?.healthGood / stats?.total) * 100}%` }}
            ></div>
            <div 
              className="bg-yellow-500 transition-all duration-300"
              style={{ width: `${(stats?.healthWarning / stats?.total) * 100}%` }}
            ></div>
            <div 
              className="bg-red-500 transition-all duration-300"
              style={{ width: `${(stats?.healthCritical / stats?.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DriverStatsCards;