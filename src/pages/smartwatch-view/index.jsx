import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import useHealthKit from '../../hooks/useHealthKit';

const SmartwatchView = () => {
  const { user, logout } = useAuth();
  const { healthData, isAuthorized, getHealthStatus } = useHealthKit(user?.name === 'Samir Al-Rashid');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [emergencyCountdown, setEmergencyCountdown] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // Convert Fahrenheit to Celsius
  const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5 / 9;
  };

  // Update current time
  useEffect(() => {
    let interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Emergency countdown effect
  useEffect(() => {
    let interval;
    if (emergencyCountdown > 0) {
      interval = setInterval(() => {
        setEmergencyCountdown((prev) => prev - 1);
      }, 1000);
    } else if (emergencyCountdown === 0 && isEmergencyMode) {
      setIsEmergencyMode(false);
    }
    return () => clearInterval(interval);
  }, [emergencyCountdown, isEmergencyMode]);

  const handleEmergencyPress = () => {
    if (!isEmergencyMode) {
      setIsEmergencyMode(true);
      setEmergencyCountdown(3);
    } else {
      setIsEmergencyMode(false);
      setEmergencyCountdown(0);
    }
  };

  const confirmEmergency = () => {
    // Trigger proper notification system
    if (window.Notification && Notification.permission === "granted") {
      new Notification("🚨 EMERGENCY ALERT SENT!", {
        body: `Driver: ${user?.name}\nLocation: Al Ain - Hili Technology School\nEmergency services notified.`,
        icon: '/favicon.ico',
        tag: 'emergency-alert'
      });
    }

    // Also show alert for demo
    alert('🚨 EMERGENCY ALERT SENT!\n\nLocation: Al Ain - Hili Technology School\nDriver: Samir Al-Rashid\nEmergency services have been notified.');
    setIsEmergencyMode(false);
    setEmergencyCountdown(0);
  };

  // Request notification permissions on mount
  useEffect(() => {
    if (window.Notification && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const getHealthStatusStyle = () => {
    const status = getHealthStatus;
    switch (status) {
      case 'critical':
        return { status: 'critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      case 'warning':
        return { status: 'warning', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      default:
        return { status: 'good', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    }
  };

  const healthStatus = getHealthStatusStyle();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 overflow-hidden flex items-center justify-center p-4">
      {/* Emergency Overlay */}
      <AnimatePresence>
        {isEmergencyMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-600/95 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center p-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl font-bold text-white mb-4">
                ⚠️
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-4">EMERGENCY ALERT</h2>
              
              {emergencyCountdown > 0 ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-5xl font-bold text-white mb-4">
                    {emergencyCountdown}
                  </motion.div>
                  <p className="text-lg text-white mb-6">Auto-sending in {emergencyCountdown}s</p>
                  <Button
                    onClick={() => setIsEmergencyMode(false)}
                    className="bg-white text-red-600 hover:bg-gray-100 px-6 py-2 text-base font-semibold rounded-full">
                    CANCEL
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-white mb-6">Send emergency alert now?</p>
                  <div className="space-y-3">
                    <Button
                      onClick={confirmEmergency}
                      className="w-full bg-white text-red-600 hover:bg-gray-100 px-6 py-3 text-lg font-bold rounded-full">
                      SEND ALERT
                    </Button>
                    <Button
                      onClick={() => setIsEmergencyMode(false)}
                      className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 px-6 py-3 text-lg rounded-full">
                      CANCEL
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Apple Watch Interface - Light Theme */}
      <div className="w-80 h-96 bg-white rounded-3xl border-8 border-slate-200 relative overflow-hidden shadow-2xl">
        {/* Digital Crown */}
        <div className="absolute right-0 top-16 w-4 h-12 bg-slate-300 rounded-l-lg border-l-2 border-slate-200">
          <button
            onClick={logout}
            className="w-full h-full bg-gradient-to-b from-slate-200 to-slate-300 hover:from-slate-100 hover:to-slate-200 rounded-l-lg transition-colors flex items-center justify-center"
            title="Logout">
            <Icon name="Power" size={12} className="text-slate-600" />
          </button>
        </div>

        {/* Watch Face Content - Scrollable */}
        <div className="absolute inset-4 rounded-2xl bg-white overflow-auto scrollbar-hide">
          <div className="p-4 space-y-4">
            
            {/* Digital Time Display - Light Theme */}
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-slate-800 tracking-wider">
                {currentTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {currentTime?.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>

            {/* System Alert Banner - Light Theme */}
            {healthStatus?.status !== 'good' && (
              <motion.div
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-amber-100 border border-amber-300 rounded-lg p-2">
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-amber-600" />
                  <span className="text-sm text-amber-700 font-medium">System Alert</span>
                </div>
              </motion.div>
            )}

            {/* Driver Identification Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  Driver: {user?.name || "Unknown"}
                </div>
                <div className="text-sm text-slate-500">{user?.vehicleId || "BUS-001"}</div>
              </div>
            </div>

            {/* Connection Status - Light Theme */}
            <div className="flex items-center justify-center space-x-6 py-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-slate-600">Connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">GPS</span>
              </div>
            </div>

            {/* Health Monitor Section - Light Theme */}
            <div className="space-y-3">
              <h3 className="text-center text-base font-semibold text-slate-800">Health Monitor</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Heart Rate - Light card with emerald accent */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="Heart" size={20} className="text-emerald-500" />
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {Math.round(healthData?.heartRate)} BPM
                  </div>
                </div>

                {/* Blood Pressure - Light card with red accent */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="Activity" size={20} className="text-red-500" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    142/91 BP
                  </div>
                </div>

                {/* Blood Oxygen - Light card with blue accent */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="RotateCcw" size={20} className="text-blue-500" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {Math.round(healthData?.bloodOxygen)} mg/dL
                  </div>
                </div>

                {/* Temperature in Celsius - Light card with orange accent */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
                  <div className="flex items-center justify-center mb-2">
                    <Icon name="Thermometer" size={20} className="text-orange-500" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {fahrenheitToCelsius(healthData?.temperature)?.toFixed(1)}°C
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Alert Active Section - Light Theme */}
            {healthStatus?.status === 'critical' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                <div className="text-center text-sm text-red-700 font-semibold">
                  Emergency Alert Active
                </div>
              </div>
            )}

            {/* Large Circular Emergency Button - Light Theme */}
            <div className="flex flex-col items-center space-y-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleEmergencyPress}
                className="w-20 h-20 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold rounded-full flex items-center justify-center transition-colors shadow-lg border-4 border-red-400">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={24} className="text-red-500" />
                </div>
              </motion.button>
              
              <div className="text-center">
                <div className="text-lg font-bold text-slate-800">EMERGENCY</div>
                <div className="text-xs text-slate-500">Double-press for emergency alert</div>
              </div>
            </div>

            {/* Sync Button at Bottom - Light Theme */}
            <div className="text-center pt-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition-colors shadow-sm">
                <Icon name="RefreshCw" size={16} className="inline mr-2" />
                Sync
              </button>
            </div>

            {/* Spacing for scrolling */}
            <div className="h-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartwatchView;