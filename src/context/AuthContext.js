"use client";
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkUserLoggedIn = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            const body = await authService.getMe();
            const fetchedUser = body?.data?.user || body?.user || body?.data?.data?.user || null;
            if (fetchedUser) setUser(fetchedUser);
          }
        }
      } catch (error) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (userData) => {
    setLoading(true);
    try {
  const body = await authService.login(userData);
  const loggedUser = body?.data?.user || body?.user || body?.data?.data?.user || null;
  if (loggedUser) setUser(loggedUser);
  return body;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
  const body = await authService.register(userData);
  const regUser = body?.data?.user || body?.user || body?.data?.data?.user || null;
  if (regUser) setUser(regUser);
  return body;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = useCallback(async () => {
    if (!user) return;
    try {
  const body = await authService.getMe();
  const refreshed = body?.data?.user || body?.user || body?.data?.data?.user || null;
  if (refreshed) setUser(refreshed);
    } catch (e) {
      console.error('Failed to refresh user', e);
    }
  }, [user]);

  const updateUserInContext = (partial) => {
    setUser(prev => prev ? { ...prev, ...partial } : prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
  refreshUser,
  updateUserInContext,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);