import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [alertCounts, setAlertCounts] = useState({
    critical: 2,
    warning: 5,
    total: 7
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Navigation items with alert counts
  const navigationItems = [
    {
      label: 'Command',
      path: '/fleet-command-dashboard',
      icon: 'Monitor',
      alertCount: alertCounts?.critical > 0 ? alertCounts?.critical : null,
      description: 'Real-time fleet monitoring and oversight'
    },
    {
      label: 'Alerts',
      path: '/alert-management-center',
      icon: 'AlertTriangle',
      alertCount: alertCounts?.total,
      description: 'Incident response and alert management'
    },
    {
      label: 'Analytics',
      path: '/driver-health-analytics',
      icon: 'BarChart3',
      alertCount: null,
      description: 'Driver health trends and insights'
    }
  ];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate connection status monitoring
  useEffect(() => {
    const checkConnection = () => {
      // Simulate connection monitoring
      const statuses = ['connected', 'degraded', 'disconnected'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setConnectionStatus(randomStatus);
    };

    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle user menu toggle
  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event?.target?.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Get connection status styling
  const getConnectionStatusStyle = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-success bg-success/10';
      case 'degraded':
        return 'text-warning bg-warning/10';
      case 'disconnected':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  // Get connection status icon
  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Wifi';
      case 'degraded':
        return 'WifiOff';
      case 'disconnected':
        return 'WifiOff';
      default:
        return 'Wifi';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="Truck" size={24} color="white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">FleetWatch Pro</h1>
              <span className="text-xs text-muted-foreground font-mono">
                {currentTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => {
              const isActive = location?.pathname === item?.path;
              return (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-250 ease-out-smooth
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-soft' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                  title={item?.description}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                  {item?.alertCount && (
                    <span className={`
                      absolute -top-1 -right-1 flex items-center justify-center
                      min-w-[18px] h-[18px] px-1 rounded-full text-xs font-medium
                      ${item?.alertCount > 9 ? 'bg-error text-error-foreground' : 'bg-warning text-warning-foreground'}
                      animate-pulse
                    `}>
                      {item?.alertCount > 99 ? '99+' : item?.alertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className={`
            hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium
            ${getConnectionStatusStyle()}
          `}>
            <Icon name={getConnectionStatusIcon()} size={14} />
            <span className="capitalize">{connectionStatus}</span>
          </div>

          {/* User Menu */}
          <div className="relative user-menu-container">
            <button
              onClick={handleUserMenuToggle}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-foreground">Sarah Chen</div>
                <div className="text-xs text-muted-foreground">Fleet Supervisor</div>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-muted-foreground transition-transform duration-200 ${
                  userMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-soft-lg z-50 animate-fadeIn">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Sarah Chen</div>
                      <div className="text-sm text-muted-foreground">Fleet Supervisor</div>
                      <div className="text-xs text-muted-foreground font-mono">ID: FS-2024-001</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                    <Icon name="Shield" size={16} />
                    <span>Security</span>
                  </button>
                  <div className="border-t border-border my-2"></div>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors">
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => {/* Handle mobile menu */}}
          >
            <Icon name="Menu" size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-card">
        <nav className="flex items-center justify-around py-2">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  relative flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium
                  transition-all duration-250 ease-out-smooth
                  ${isActive 
                    ? 'text-primary' :'text-muted-foreground'
                  }
                `}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
                {item?.alertCount && (
                  <span className={`
                    absolute -top-1 -right-1 flex items-center justify-center
                    min-w-[16px] h-[16px] px-1 rounded-full text-xs font-medium
                    ${item?.alertCount > 9 ? 'bg-error text-error-foreground' : 'bg-warning text-warning-foreground'}
                  `}>
                    {item?.alertCount > 9 ? '9+' : item?.alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;