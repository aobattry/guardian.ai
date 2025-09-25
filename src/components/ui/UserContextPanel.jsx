import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const UserContextPanel = ({ 
  user = {
    name: 'Sarah Chen',
    role: 'Fleet Supervisor',
    id: 'FS-2024-001',
    avatar: null,
    permissions: ['view_fleet', 'manage_alerts', 'view_analytics'],
    shiftInfo: {
      start: '06:00',
      end: '14:00',
      status: 'active'
    }
  },
  onUserChange,
  onLogout,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shiftStatus, setShiftStatus] = useState('active');

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate shift status based on current time
  useEffect(() => {
    const now = new Date();
    const currentHour = now?.getHours();
    const currentMinute = now?.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const [startHour, startMinute] = user?.shiftInfo?.start?.split(':')?.map(Number);
    const [endHour, endMinute] = user?.shiftInfo?.end?.split(':')?.map(Number);
    
    const shiftStartInMinutes = startHour * 60 + startMinute;
    const shiftEndInMinutes = endHour * 60 + endMinute;
    
    if (currentTimeInMinutes >= shiftStartInMinutes && currentTimeInMinutes <= shiftEndInMinutes) {
      setShiftStatus('active');
    } else if (currentTimeInMinutes < shiftStartInMinutes) {
      setShiftStatus('upcoming');
    } else {
      setShiftStatus('ended');
    }
  }, [currentTime, user?.shiftInfo]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && !event?.target?.closest('.user-context-panel')) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Get shift status styling
  const getShiftStatusStyling = () => {
    switch (shiftStatus) {
      case 'active':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'On Duty',
          icon: 'Clock'
        };
      case 'upcoming':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Off Duty',
          icon: 'Clock'
        };
      case 'ended':
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Shift Ended',
          icon: 'Clock'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Unknown',
          icon: 'Clock'
        };
    }
  };

  const shiftStyling = getShiftStatusStyling();

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Handle role/user switching
  const handleUserSwitch = (newUser) => {
    if (onUserChange) {
      onUserChange(newUser);
    }
    setIsExpanded(false);
  };

  // Get time remaining in shift
  const getShiftTimeRemaining = () => {
    if (shiftStatus !== 'active') return null;
    
    const now = new Date();
    const [endHour, endMinute] = user?.shiftInfo?.end?.split(':')?.map(Number);
    const shiftEnd = new Date();
    shiftEnd?.setHours(endHour, endMinute, 0, 0);
    
    const diffInMinutes = Math.floor((shiftEnd - now) / (1000 * 60));
    
    if (diffInMinutes <= 0) return 'Shift ending';
    if (diffInMinutes < 60) return `${diffInMinutes}m remaining`;
    
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className={`relative user-context-panel ${className}`}>
      {/* Main User Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-all duration-200 hover:shadow-soft"
      >
        {/* User Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user?.avatar} 
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <Icon name="User" size={20} color="white" />
            )}
          </div>
          {/* Shift Status Indicator */}
          <div className={`
            absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card
            ${shiftStyling?.bgColor}
          `}>
            <div className={`w-2 h-2 rounded-full ${shiftStyling?.color?.replace('text-', 'bg-')} m-0.5`}></div>
          </div>
        </div>

        {/* User Info */}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-foreground">{user?.name}</div>
          <div className="text-xs text-muted-foreground">{user?.role}</div>
        </div>

        {/* Expand Icon */}
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-muted-foreground transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      {/* Expanded User Panel */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-soft-lg z-50 animate-fadeIn">
          {/* User Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user?.avatar} 
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={24} color="white" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{user?.name}</div>
                <div className="text-sm text-muted-foreground">{user?.role}</div>
                <div className="text-xs text-muted-foreground font-mono">ID: {user?.id}</div>
              </div>
            </div>
          </div>

          {/* Shift Information */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Shift Status</h4>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${shiftStyling?.bgColor} ${shiftStyling?.color}`}>
                <Icon name={shiftStyling?.icon} size={12} />
                <span>{shiftStyling?.label}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shift Hours</span>
                <span className="font-mono text-foreground">
                  {user?.shiftInfo?.start} - {user?.shiftInfo?.end}
                </span>
              </div>
              
              {shiftStatus === 'active' && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Remaining</span>
                  <span className="font-mono text-foreground">
                    {getShiftTimeRemaining()}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Time</span>
                <span className="font-mono text-foreground">
                  {currentTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Access Permissions</h4>
            <div className="grid grid-cols-1 gap-2">
              {user?.permissions?.map((permission) => (
                <div key={permission} className="flex items-center space-x-2 text-xs">
                  <Icon name="CheckCircle" size={12} className="text-success" />
                  <span className="text-muted-foreground capitalize">
                    {permission?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button 
              onClick={() => {/* Handle settings */}}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <Icon name="Settings" size={16} />
              <span>Account Settings</span>
            </button>
            
            <button 
              onClick={() => {/* Handle preferences */}}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <Icon name="Sliders" size={16} />
              <span>Preferences</span>
            </button>
            
            <button 
              onClick={() => {/* Handle help */}}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <Icon name="HelpCircle" size={16} />
              <span>Help & Support</span>
            </button>
            
            <div className="border-t border-border my-2"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors"
            >
              <Icon name="LogOut" size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContextPanel;