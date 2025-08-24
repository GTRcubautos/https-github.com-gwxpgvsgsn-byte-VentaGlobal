import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authenticated = localStorage.getItem('admin_authenticated');
    const sessionTime = localStorage.getItem('admin_session');
    
    if (authenticated === 'true' && sessionTime) {
      const sessionAge = Date.now() - parseInt(sessionTime);
      const maxAge = 4 * 60 * 60 * 1000; // 4 horas de sesión
      
      if (sessionAge < maxAge) {
        setIsAuthenticated(true);
      } else {
        // Sesión expirada
        logout();
      }
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
  };

  const login = () => {
    localStorage.setItem('admin_authenticated', 'true');
    localStorage.setItem('admin_session', Date.now().toString());
    setIsAuthenticated(true);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  };
}