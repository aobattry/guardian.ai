import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const MapView = ({ drivers, onDriverSelect, refreshKey }) => {
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredDriver, setHoveredDriver] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1.8);
  const [imageError, setImageError] = useState(false);

  // Simulate map loading with better feedback
  useEffect(() => {
    setMapLoaded(false);
    const timer = setTimeout(() => setMapLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDriverMarkerClick = (driver) => {
    setSelectedDriverId(driver?.id);
    onDriverSelect?.(driver);
  };

  const getMarkerColor = (status) => {
    switch (status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.3, 3.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.3, 0.8));
  };

  const resetZoom = () => {
    setZoomLevel(1.8);
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden h-[700px]">
      {/* Enhanced Map Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Map" size={20} className="text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Al Ain Fleet Live Map</h2>
              <p className="text-sm text-gray-600">Real-world zoomable UAE map - Focus on Al Ain region</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {mapLoaded && !imageError && (
              <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                ✅ UAE Map Active
              </button>
            )}
            {imageError && (
              <button className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                ⚠️ Map Loading...
              </button>
            )}
            <span className="text-sm text-gray-500">{drivers?.length} buses in Al Ain</span>
          </div>
        </div>
      </div>
      {/* Enhanced Map Container - Real World UAE Map */}
      <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
        {/* Loading indicator with better feedback */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 z-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-700 font-medium">Loading UAE Real World Map...</p>
              <p className="text-sm text-gray-500">Al Ain region with global zoom capability</p>
            </div>
          </div>
        )}
        
        {/* Real World UAE Map Implementation */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/assets/images/uae-map-flat-with-high-details-united-arab-emirates-political-map-with-labeling-uae-administrative-map-7-emirates-and-capital-cities-also-vector-1758803678051.jpg"
            alt="UAE Real World Map - Zoomable from Global View to Al Ain Local Streets"
            className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            style={{ 
              transform: `scale(${zoomLevel}) translate(-5%, -20%)`,
              transformOrigin: 'center',
              filter: mapLoaded ? 'none' : 'blur(2px)'
            }}
            onError={(e) => {
              console.warn('UAE Map image failed to load, using fallback');
              setImageError(true);
              // Fallback to a simple map representation
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJtYXBHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzMzM2ZmO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzZmYzMztzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0idXJsKCNtYXBHcmFkKSIgb3BhY2l0eT0iMC4xIi8+PHJlY3QgeD0iMjAwIiB5PSIxNTAiIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiByeD0iMTUiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzMzNzNkYyIgc3Ryb2tlLXdpZHRoPSIzIiBvcGFjaXR5PSIwLjkiLz48dGV4dCB4PSI0MDAiIHk9IjI2MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzMzNzNkYyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VUFFIE1hcDwvdGV4dD48dGV4dCB4PSI0MDAiIHk9IjI5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BbCBBaW4gUmVnaW9uPC90ZXh0Pjx0ZXh0IHg9IjQwMCIgeT0iMzE1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZsZWV0IFRyYWNraW5nIEFjdGl2ZTwvdGV4dD48L3N2Zz4=';
            }}
            onLoad={() => {
              setMapLoaded(true);
              setImageError(false);
            }}
          />
          
          {/* Interactive Zoom Controls - Enhanced */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-3 border border-gray-200">
            <div className="text-xs font-semibold text-gray-700 mb-3 text-center">Map Controls</div>
            <div className="space-y-2">
              <button
                className="w-10 h-10 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 flex items-center justify-center text-gray-700 font-bold transition-all shadow-sm"
                onClick={handleZoomIn}
                title="Zoom In - Closer Al Ain View"
              >
                <Icon name="Plus" size={16} />
              </button>
              <button
                className="w-10 h-10 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 flex items-center justify-center text-gray-700 font-bold transition-all shadow-sm"
                onClick={handleZoomOut}
                title="Zoom Out - UAE/Global View"
              >
                <Icon name="Minus" size={16} />
              </button>
              <button
                className="w-10 h-10 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 flex items-center justify-center transition-all shadow-sm"
                onClick={resetZoom}
                title="Reset to Al Ain Default View"
              >
                <Icon name="Home" size={16} className="text-gray-700" />
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-600 text-center">
              Zoom: {(zoomLevel * 100)?.toFixed(0)}%
            </div>
          </div>

          {/* Enhanced Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-gray-200">
            <div className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Icon name="MapPin" size={16} className="mr-2 text-blue-600" />
              Al Ain Fleet Legend
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                <span className="text-gray-700">Healthy Driver</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                <span className="text-gray-700">Warning Status</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                <span className="text-gray-700">Critical Alert</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-3">
                <div className="text-gray-600 font-medium">📍 Al Ain City</div>
                <div className="text-gray-500">Eastern UAE Region</div>
              </div>
            </div>
          </div>

          {/* Driver Bus Markers on Real UAE Map */}
          {drivers?.map((driver, index) => {
            // Enhanced positioning for Al Ain region on the real UAE map
            const alAinPositions = [
              { x: '55%', y: '70%' }, // Al Ain central downtown
              { x: '53%', y: '68%' }, // Al Ain north suburbs  
              { x: '57%', y: '72%' }, // Al Ain south industrial
              { x: '54%', y: '69%' }, // Al Ain western districts
              { x: '56%', y: '71%' }, // Al Ain eastern areas
              { x: '55%', y: '69%' }, // Al Ain city center
              { x: '56%', y: '70%' }, // Al Ain business district
              { x: '54%', y: '71%' }, // Al Ain residential zones
              { x: '57%', y: '69%' }, // Al Ain university area
              { x: '53%', y: '70%' }, // Al Ain hospital district
            ];
            
            const position = alAinPositions?.[index % alAinPositions?.length];
            const xOffset = (Math.random() - 0.5) * 20; // Slight variation within Al Ain
            const yOffset = (Math.random() - 0.5) * 20;
            
            return (
              <motion.div
                key={driver?.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ 
                  left: `calc(${position?.x} + ${xOffset}px)`,
                  top: `calc(${position?.y} + ${yOffset}px)`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5, type: "spring", bounce: 0.3 }}
              >
                <div className="relative">
                  {/* Enhanced marker shadow */}
                  <div 
                    className="absolute w-6 h-6 rounded-full bg-black/20 blur-sm"
                    style={{ top: '3px', left: '3px' }}
                  />
                  
                  {/* Main bus marker */}
                  <button
                    className="relative w-7 h-7 rounded-full border-3 border-white shadow-lg transition-all duration-200 hover:scale-125 hover:shadow-xl flex items-center justify-center"
                    style={{ backgroundColor: getMarkerColor(driver?.healthStatus) }}
                    onClick={() => handleDriverMarkerClick(driver)}
                    onMouseEnter={() => setHoveredDriver(driver?.id)}
                    onMouseLeave={() => setHoveredDriver(null)}
                  >
                    <Icon name="Truck" size={14} className="text-white" />
                    
                    {/* Connection pulse indicator */}
                    <div 
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
                        driver?.isConnected ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    >
                      {driver?.isConnected && (
                        <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                      )}
                    </div>
                  </button>
                  
                  {/* Bus number with better visibility */}
                  <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-900 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-md border border-gray-200">
                    🚌 {driver?.busNumber}
                  </div>
                  
                  {/* Enhanced hover tooltip */}
                  {(hoveredDriver === driver?.id || selectedDriverId === driver?.id) && (
                    <motion.div
                      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white/98 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-gray-200 min-w-[220px] z-30"
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <div className="text-center">
                        <h4 className="font-bold text-gray-900 text-sm mb-2">👨‍✈️ {driver?.name}</h4>
                        <p className="text-xs text-gray-600 mb-3">Bus: {driver?.busNumber} • Al Ain Route</p>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                          <div className="bg-red-50 p-2 rounded-lg">
                            <div className="text-red-700 font-semibold">❤️ {driver?.heartRate} bpm</div>
                          </div>
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <div className="text-blue-700 font-semibold">🫁 {driver?.spO2}%</div>
                          </div>
                        </div>
                        
                        <div 
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            driver?.healthStatus === 'good' ? 'bg-green-100 text-green-800 border border-green-200' :
                            driver?.healthStatus === 'warning'? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {driver?.healthStatus === 'good' ? '✅ HEALTHY' : 
                           driver?.healthStatus === 'warning' ? '⚠️ WARNING' : '🚨 CRITICAL'}
                        </div>
                      </div>
                      
                      {/* Enhanced tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white/98"></div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Map Status Indicators */}
          <div className="absolute top-4 left-4 space-y-2">
            <div className="bg-emerald-500/95 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>🌍 Live UAE Map</span>
              </div>
            </div>
            <div className="bg-blue-500/95 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={14} />
                <span>📍 Al Ain Focus</span>
              </div>
            </div>
          </div>

          {/* Real-time tracking status */}
          <div className="absolute bottom-4 right-1/2 transform translate-x-1/2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>🚌 {drivers?.length} Al Ain Buses Tracked</span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;