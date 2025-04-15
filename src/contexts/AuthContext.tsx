import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import {  isTokenValid } from '../utils/tokenStorage';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initializeAuth = async () => {
      if (isTokenValid()) {
        try {
          const user = await authService.getCurrentUser();
          setUser(user);
        } catch (error) {
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);
  
  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setUser(user);
    return user;
  };
  
  const register = async (userData) => {
    return await authService.register(userData);
  };
  
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};