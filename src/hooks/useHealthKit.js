import { useState, useEffect, useCallback } from 'react';

// Enhanced HealthKit API for AI Guardian with Celsius support
const useHealthKit = (isEnabled = false) => {
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    bloodOxygen: 98,
    temperature: 36.9, // Changed to Celsius
    stepCount: 0,
    activeCalories: 0,
    isAuthorized: false,
    lastUpdate: new Date()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Request HealthKit authorization (mocked)
  const requestAuthorization = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate authorization request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHealthData(prev => ({
        ...prev,
        isAuthorized: true
      }));
      
      return { success: true, authorized: true };
    } catch (err) {
      setError('HealthKit authorization failed');
      return { success: false, error: err?.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced real-time health monitoring with Celsius temperatures
  const startMonitoring = useCallback(() => {
    if (!isEnabled || !healthData?.isAuthorized) {
      return;
    }

    const interval = setInterval(() => {
      setHealthData(prev => {
        // Generate realistic health data variations
        const newHeartRate = Math.max(60, Math.min(120, 
          prev?.heartRate + (Math.random() - 0.5) * 4
        ));
        
        const newBloodOxygen = Math.max(95, Math.min(100, 
          prev?.bloodOxygen + (Math.random() - 0.5) * 1
        ));
        
        // Temperature in Celsius (36.0°C - 38.0°C)
        const newTemperature = Math.max(36.0, Math.min(38.0, 
          prev?.temperature + (Math.random() - 0.5) * 0.2
        ));

        return {
          ...prev,
          heartRate: newHeartRate,
          bloodOxygen: newBloodOxygen,
          temperature: newTemperature,
          stepCount: prev?.stepCount + Math.floor(Math.random() * 3),
          activeCalories: prev?.activeCalories + Math.floor(Math.random() * 2),
          lastUpdate: new Date()
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isEnabled, healthData?.isAuthorized]);

  // Auto-start monitoring when enabled and authorized
  useEffect(() => {
    let cleanup;
    
    if (isEnabled && healthData?.isAuthorized) {
      cleanup = startMonitoring();
    }
    
    return cleanup;
  }, [isEnabled, healthData?.isAuthorized, startMonitoring]);

  // Auto-request authorization on mount if enabled
  useEffect(() => {
    if (isEnabled && !healthData?.isAuthorized && !isLoading) {
      requestAuthorization();
    }
  }, [isEnabled, healthData?.isAuthorized, isLoading, requestAuthorization]);

  // Enhanced health data query with Celsius support
  const queryHealthData = useCallback(async (dataType, options = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock historical data
      const now = new Date();
      const data = [];
      
      for (let i = 0; i < (options?.limit || 10); i++) {
        const timestamp = new Date(now.getTime() - i * 60 * 1000);
        
        switch (dataType) {
          case 'heartRate':
            data?.push({
              value: 70 + Math.random() * 20,
              timestamp,
              unit: 'bpm'
            });
            break;
          case 'bloodOxygen':
            data?.push({
              value: 96 + Math.random() * 3,
              timestamp,
              unit: '%'
            });
            break;
          case 'temperature':
            // Return Celsius temperatures
            data?.push({
              value: 36.5 + Math.random() * 1.2,
              timestamp,
              unit: '°C'
            });
            break;
          default:
            data?.push({
              value: Math.random() * 100,
              timestamp,
              unit: 'unknown'
            });
        }
      }
      
      return data?.reverse();
    } catch (err) {
      setError(`Failed to query ${dataType} data`);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if HealthKit is available (always true in our mock)
  const isAvailable = true;

  // Enhanced health status calculation for Celsius
  const getHealthStatus = useCallback(() => {
    const { heartRate, bloodOxygen, temperature } = healthData;
    
    // Temperature thresholds in Celsius
    if (heartRate > 110 || bloodOxygen < 94 || temperature > 38.0) {
      return 'critical';
    } else if (heartRate > 100 || bloodOxygen < 96 || temperature > 37.5) {
      return 'warning';
    }
    return 'good';
  }, [healthData]);

  return {
    healthData,
    isLoading,
    error,
    isAvailable,
    isAuthorized: healthData?.isAuthorized,
    requestAuthorization,
    startMonitoring,
    queryHealthData,
    getHealthStatus: getHealthStatus()
  };
};

export default useHealthKit;