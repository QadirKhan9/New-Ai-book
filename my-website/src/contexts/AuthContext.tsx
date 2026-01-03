import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  checkAuthStatus: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [tokenCheckInterval, setTokenCheckInterval] = useState<number | null>(null);

  // Check if token exists and is valid on component mount
  useEffect(() => {
    // Initialize state based on token in storage
    const token = localStorage.getItem('token');
    if (token) {
      const isValid = validateToken(token);
      setIsLoggedIn(isValid);
    }

    // Set up interval to check token expiration every minute
    const interval = window.setInterval(() => {
      checkAuthStatus();
    }, 60000); // Check every minute

    setTokenCheckInterval(interval);

    // Add event listener to handle storage changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      // Only respond to changes in 'token' or 'user' keys
      if (e.key === 'token' || e.key === 'user') {
        checkAuthStatus();
      }
    };

    // Add event listener for custom authChange events
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
      if (tokenCheckInterval) {
        window.clearInterval(tokenCheckInterval);
      }
    };
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const isValid = validateToken(token);
      setIsLoggedIn(isValid);

      // If token is invalid, ensure logout happens
      if (!isValid) {
        logout();
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  const validateToken = (token: string): boolean => {
    try {
      // Decode the token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token is expired
      if (payload.exp < currentTime) {
        // Token is expired, remove it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Force a state update to trigger re-render
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      checkAuthStatus,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};