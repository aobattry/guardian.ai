import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import { useAuth } from "contexts/AuthContext";
import NotFound from "pages/NotFound";
import Login from "pages/login";
import SmartwatchView from "pages/smartwatch-view";
import SupervisorDashboard from "pages/supervisor-dashboard";
import DriverHealthAnalytics from './pages/driver-health-analytics';
import AlertManagementCenter from './pages/alert-management-center';
import FleetCommandDashboard from './pages/fleet-command-dashboard';
import FleetManagementDashboard from './pages/fleet-management-dashboard';
import CameraManagementCenter from './pages/camera-management-center';
import DriverTrackingControlCenter from './pages/driver-tracking-control-center';
import DriversManagementDashboard from './pages/drivers-management-dashboard';
import TemplateSelector from './pages/template-selector';

const AppRoutes = () => {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Template Selector Route - Accessible to all authenticated users */}
      <Route 
        path="/template-selector" 
        element={
          <ProtectedRoute>
            <TemplateSelector />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <RoleBasedRedirect />
          </ProtectedRoute>
        } 
      />
      
      {/* Driver Routes */}
      <Route 
        path="/smartwatch-view" 
        element={
          <ProtectedRoute allowedRoles={['driver']}>
            <SmartwatchView />
          </ProtectedRoute>
        } 
      />
      
      {/* Supervisor Routes */}
      <Route 
        path="/supervisor-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <SupervisorDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/driver-tracking-control-center" 
        element={
          <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
            <DriverTrackingControlCenter />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/drivers-management-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
            <DriversManagementDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/fleet-management-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
            <FleetManagementDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/camera-management-center" 
        element={
          <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
            <CameraManagementCenter />
          </ProtectedRoute>
        } 
      />
      
      {/* Legacy Routes - Keep for backward compatibility */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <RoleBasedRedirect />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/driver-health-analytics" 
        element={
          <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
            <DriverHealthAnalytics />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/alert-management-center" 
        element={
          <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
            <AlertManagementCenter />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/fleet-command-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
            <FleetCommandDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

// Component to redirect based on user role
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'driver') {
    return <Navigate to="/smartwatch-view" replace />;
  } else if (user?.role === 'supervisor') {
    return <Navigate to="/supervisor-dashboard" replace />;
  }
  
  // Default fallback
  return <Navigate to="/supervisor-dashboard" replace />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;