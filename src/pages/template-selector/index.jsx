import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const TemplateSelector = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dashboard templates with updated structure and naming to match reference layout
  const dashboardTemplates = [
    {
      id: 'main-dashboard',
      name: 'Main Dashboard',
      category: 'dashboard',
      route: '/supervisor-dashboard',
      description: 'Primary control dashboard with comprehensive overview and key metrics',
      features: [
        'Real-time overview cards',
        'Key performance indicators',
        'Quick action buttons',
        'Activity feed and notifications',
        'System status monitoring',
        'Recent activity timeline',
        'Critical alerts summary'
      ],
      preview: {
        layout: 'Clean card-based dashboard with sidebar navigation and overview widgets',
        components: ['Navigation sidebar', 'Overview cards', 'KPI widgets', 'Activity timeline', 'Quick actions', 'System status'],
        colors: 'Professional blue and gray theme with accent colors'
      },
      icon: 'Layout',
      status: 'active',
      compatibility: ['Web', 'Tablet', 'Mobile'],
      lastUpdated: '2024-01-25'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      category: 'analytics',
      route: '/driver-health-analytics',
      description: 'Comprehensive data analytics and reporting interface with charts and insights',
      features: [
        'Interactive data visualizations',
        'Custom date range filtering',
        'Export reports functionality',
        'Trend analysis charts',
        'Statistical summaries',
        'Performance metrics',
        'Data drill-down capabilities'
      ],
      preview: {
        layout: 'Analytics-focused layout with charts, tables, and filter controls',
        components: ['Data charts', 'Filter panels', 'Statistics cards', 'Export tools', 'Trend visualizations'],
        colors: 'Data-focused with blue, green, and orange chart colors'
      },
      icon: 'BarChart3',
      status: 'active',
      compatibility: ['Web', 'Tablet'],
      lastUpdated: '2024-01-25'
    },
    {
      id: 'monitoring',
      name: 'Monitoring',
      category: 'monitoring',
      route: '/fleet-command-dashboard',
      description: 'Real-time monitoring dashboard with live data and system oversight',
      features: [
        'Live data streaming',
        'Real-time status updates',
        'System health indicators',
        'Performance monitoring',
        'Alert management',
        'Auto-refresh capabilities',
        'Status timeline views'
      ],
      preview: {
        layout: 'Grid-based monitoring layout with status cards and live feeds',
        components: ['Status grid', 'Live feeds', 'Health indicators', 'Alert panels', 'Timeline views'],
        colors: 'Monitoring theme with green, yellow, and red status colors'
      },
      icon: 'Monitor',
      status: 'active',
      compatibility: ['Web', 'Tablet'],
      lastUpdated: '2024-01-25'
    },
    {
      id: 'management',
      name: 'Management',
      category: 'management',
      route: '/drivers-management-dashboard',
      description: 'Administrative management interface for data, users, and system configuration',
      features: [
        'User management forms',
        'Data entry interfaces',
        'Bulk operations',
        'Configuration settings',
        'Permission controls',
        'Audit trails',
        'System administration'
      ],
      preview: {
        layout: 'Form-based management interface with tables and configuration panels',
        components: ['Management forms', 'Data tables', 'Configuration panels', 'User controls', 'Settings pages'],
        colors: 'Professional gray and blue administrative theme'
      },
      icon: 'Settings',
      status: 'active',
      compatibility: ['Web', 'Tablet'],
      lastUpdated: '2024-01-25'
    },
    {
      id: 'alerts',
      name: 'Alerts & Notifications',
      category: 'alerts',
      route: '/alert-management-center',
      description: 'Centralized alert system with notification management and escalation controls',
      features: [
        'Alert notification center',
        'Priority level management',
        'Notification history',
        'Escalation workflows',
        'Alert filtering and search',
        'Sound notification controls',
        'Mobile push notifications'
      ],
      preview: {
        layout: 'Notification-centric with alert feeds and management controls',
        components: ['Alert center', 'Notification feeds', 'Priority filters', 'History panels', 'Sound controls'],
        colors: 'Alert-themed with red, orange, and yellow priority indicators'
      },
      icon: 'Bell',
      status: 'active',
      compatibility: ['Web', 'Tablet', 'Mobile'],
      lastUpdated: '2024-01-25'
    },
    {
      id: 'tracking',
      name: 'Location Tracking',
      category: 'tracking',
      route: '/driver-tracking-control-center',
      description: 'GPS tracking and location monitoring with interactive map interface',
      features: [
        'Interactive map integration',
        'Real-time GPS tracking',
        'Location history',
        'Route visualization',
        'Geofencing controls',
        'Location-based alerts',
        'Journey timeline'
      ],
      preview: {
        layout: 'Map-centered interface with location controls and tracking panels',
        components: ['Interactive maps', 'Location cards', 'Tracking controls', 'Route displays', 'Timeline views'],
        colors: 'Map-focused with blue, green, and navigation-themed colors'
      },
      icon: 'MapPin',
      status: 'active',
      compatibility: ['Web', 'Tablet'],
      lastUpdated: '2024-01-25'
    },
    {
      id: 'reports',
      name: 'Reports',
      category: 'reports',
      route: '/driver-health-analytics',
      description: 'Comprehensive reporting system with customizable reports and data export',
      features: [
        'Custom report builder',
        'Scheduled report generation',
        'Multiple export formats',
        'Report templates',
        'Data visualization options',
        'Automated report delivery',
        'Historical data analysis'
      ],
      preview: {
        layout: 'Report-focused with builder tools and preview panels',
        components: ['Report builder', 'Template selector', 'Export options', 'Preview panels', 'Delivery settings'],
        colors: 'Document-themed with clean white and blue accents'
      },
      icon: 'FileText',
      status: 'active',
      compatibility: ['Web', 'Tablet'],
      lastUpdated: '2024-01-25'
    },
    {
      id: 'mobile-view',
      name: 'Mobile Interface',
      category: 'mobile',
      route: '/smartwatch-view',
      description: 'Optimized mobile and smartwatch interface for on-the-go access',
      features: [
        'Touch-optimized interface',
        'Quick action buttons',
        'Essential information display',
        'Offline functionality',
        'Emergency access',
        'Simplified navigation',
        'Voice command support'
      ],
      preview: {
        layout: 'Mobile-first design with large touch targets and simplified navigation',
        components: ['Touch interface', 'Quick actions', 'Essential displays', 'Emergency controls', 'Simple navigation'],
        colors: 'Mobile-optimized with high contrast and accessibility features'
      },
      icon: 'Smartphone',
      status: 'active',
      compatibility: ['Mobile', 'Smartwatch', 'Tablet'],
      lastUpdated: '2024-01-25'
    }
  ];

  // Updated categories to match standard dashboard structure
  const categories = [
    { id: 'all', name: 'All Templates', icon: 'Grid3x3' },
    { id: 'dashboard', name: 'Dashboard', icon: 'Layout' },
    { id: 'analytics', name: 'Analytics', icon: 'BarChart3' },
    { id: 'monitoring', name: 'Monitoring', icon: 'Monitor' },
    { id: 'management', name: 'Management', icon: 'Settings' },
    { id: 'alerts', name: 'Alerts', icon: 'Bell' },
    { id: 'tracking', name: 'Tracking', icon: 'MapPin' },
    { id: 'reports', name: 'Reports', icon: 'FileText' },
    { id: 'mobile', name: 'Mobile', icon: 'Smartphone' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? dashboardTemplates 
    : dashboardTemplates?.filter(template => template?.category === selectedCategory);

  const handleTemplateSelect = (template) => {
    // Check user permissions based on template type
    if (template?.category === 'mobile' && user?.role !== 'driver') {
      alert('Mobile interface is primarily designed for driver accounts. Please log in with a driver account for full mobile features.');
      return;
    }
    
    if (template?.category !== 'mobile' && template?.category !== 'dashboard' && user?.role === 'driver') {
      alert('This template requires supervisor or admin privileges. Please log in with appropriate permissions.');
      return;
    }

    navigate(template?.route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Icon name="Layout" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Dashboard Templates</h1>
                  <p className="text-sm text-gray-500">Professional Interface Layouts</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role} • Template Selector</p>
              </div>
              
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-50 hover:bg-gray-100 text-gray-600 p-2 rounded-lg transition-colors"
                title="Go Back"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-2xl shadow-lg">
              <Icon name="Layout" size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard Templates</h1>
              <p className="text-gray-600 text-lg">Professional layouts organized by function and purpose</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Info" size={20} className="text-blue-600" />
              <div>
                <p className="text-blue-800 font-medium">📊 Updated Navigation Structure</p>
                <p className="text-blue-600 text-sm">Templates now organized by standard dashboard sections: Dashboard, Analytics, Monitoring, Management</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3">
              {categories?.map((category) => (
                <button
                  key={category?.id}
                  onClick={() => setSelectedCategory(category?.id)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                    selectedCategory === category?.id
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-100 text-gray-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                    selectedCategory === category?.id 
                      ? 'bg-white/20' :'bg-white shadow-sm'
                  }`}>
                    <Icon 
                      name={category?.icon} 
                      size={18} 
                      className={selectedCategory === category?.id ? 'text-white' : 'text-indigo-600'} 
                    />
                  </div>
                  <span className="text-xs font-medium text-center">{category?.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {filteredTemplates?.map((template, index) => (
            <motion.div
              key={template?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`backdrop-blur-sm rounded-3xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 ${
                template?.id === 'smart-bus-guardian-pro' ?'bg-gradient-to-br from-green-50 to-blue-50 border-green-200 ring-2 ring-green-300' :'bg-white/80 border-gray-200'
              }`}
            >
              {/* Template Header */}
              <div className={`p-6 ${
                template?.id === 'smart-bus-guardian-pro' ?'bg-gradient-to-r from-green-500 via-blue-600 to-indigo-600' :'bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Icon name={template?.icon} size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{template?.name}</h3>
                      <p className="text-blue-100 text-sm">Last updated: {template?.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template?.status === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                      template?.status === 'active' ?'bg-green-100 text-green-800' :'bg-yellow-100 text-yellow-800'
                    }`}>
                      {template?.status === 'premium' ? '⭐ PREMIUM' : template?.status}
                    </span>
                  </div>
                </div>
                <p className="text-blue-100">{template?.description}</p>
              </div>

              {/* Template Content */}
              <div className="p-6">
                {/* Preview Layout */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Icon name="Eye" size={16} className="mr-2" />
                    Layout Preview
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 mb-2"><strong>Layout:</strong> {template?.preview?.layout}</p>
                    <p className="text-sm text-gray-700 mb-2"><strong>Color Scheme:</strong> {template?.preview?.colors}</p>
                    <div className="text-sm text-gray-700">
                      <strong>Components:</strong>
                      <ul className="mt-1 ml-4 space-y-1">
                        {template?.preview?.components?.map((component, idx) => (
                          <li key={idx} className="text-xs">• {component}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Special Features for Smart Bus Guardian Pro */}
                {template?.id === 'smart-bus-guardian-pro' && (
                  <>
                    {/* Emergency Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Icon name="Ambulance" size={16} className="mr-2 text-red-600" />
                        Emergency Integration
                      </h4>
                      <div className="bg-red-50 rounded-xl p-3">
                        {template?.emergencyFeatures?.slice(0, 3)?.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2 mb-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-xs text-red-800">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Icon name="Brain" size={16} className="mr-2 text-purple-600" />
                        AI Capabilities
                      </h4>
                      <div className="bg-purple-50 rounded-xl p-3">
                        {template?.aiFeatures?.slice(0, 3)?.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2 mb-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-xs text-purple-800">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Icon name="Star" size={16} className="mr-2" />
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {template?.features?.slice(0, 4)?.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {template?.features?.length > 4 && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">+{template?.features?.length - 4} more features</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compatibility */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Icon name="Monitor" size={16} className="mr-2" />
                    Compatibility
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {template?.compatibility?.map((device) => (
                      <span
                        key={device}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                      >
                        {device}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                      template?.id === 'smart-bus-guardian-pro' ?'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white' :'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                    }`}
                  >
                    <Icon name="Eye" size={18} />
                    <span>
                      {template?.id === 'smart-bus-guardian-pro' ? 'Launch Guardian Pro' : 'View Template'}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const features = template?.features?.join('\n• ');
                      const components = template?.preview?.components?.join('\n• ');
                      const emergency = template?.emergencyFeatures ? `\n\nEmergency Features:\n• ${template?.emergencyFeatures?.join('\n• ')}` : '';
                      const ai = template?.aiFeatures ? `\n\nAI Features:\n• ${template?.aiFeatures?.join('\n• ')}` : '';
                      alert(`${template?.name} Details:\n\n${template?.description}\n\nFeatures:\n• ${features}\n\nComponents:\n• ${components}${emergency}${ai}\n\nCompatibility: ${template?.compatibility?.join(', ')}`);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <Icon name="Info" size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredTemplates?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Icon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try selecting a different category to see more templates.</p>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Icon name="ShieldCheck" size={16} className="text-green-500" />
                <span>Smart Guardian Pro available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Globe" size={16} className="text-blue-500" />
                <span>Arabic/Indian names supported</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Thermometer" size={16} className="text-green-500" />
                <span>Celsius temperature units</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Icon name="Shield" size={16} />
              <span>© 2024 AI Guardian Templates</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TemplateSelector;