import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('sehatsaathi_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('sehatsaathi_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Load and verify current profile on mount if token exists
  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('sehatsaathi_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out');
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      const userData = res.data;
      const userToken = res.data.token;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('sehatsaathi_token', userToken);
      localStorage.setItem('sehatsaathi_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      const newUser = res.data;
      const userToken = res.data.token;
      setUser(newUser);
      setToken(userToken);
      localStorage.setItem('sehatsaathi_token', userToken);
      localStorage.setItem('sehatsaathi_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sehatsaathi_token');
    localStorage.removeItem('sehatsaathi_user');
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      localStorage.setItem('sehatsaathi_user', JSON.stringify(merged));
      return merged;
    });
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
    role: user?.role || null,
    isPatient: user?.role === 'patient',
    isDoctor: user?.role === 'doctor',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
