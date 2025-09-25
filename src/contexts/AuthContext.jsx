import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data
const MOCK_USERS = {
  'dSamir@guardian.ae': {
    id: 'DRV-001',
    email: 'dSamir@guardian.ae',
    name: 'Samir Al-Rashid',
    role: 'driver',
    password: '123456789',
    location: 'Al Ain - Hili Technology School',
    vehicleId: 'TRK-001',
    healthKitEnabled: true
  },
  'sAmna@guardian.ae': {
    id: 'SUP-001',
    email: 'sAmna@guardian.ae',
    name: 'Amna Al-Zahra',
    role: 'supervisor',
    password: '123456789',
    location: 'Al Ain Operations Center',
    department: 'Fleet Management'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('fleetwatch_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('fleetwatch_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = MOCK_USERS?.[email];
      
      if (!userData || userData?.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password from user data before storing
      const { password: _, ...userWithoutPassword } = userData;
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('fleetwatch_user', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fleetwatch_user');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;