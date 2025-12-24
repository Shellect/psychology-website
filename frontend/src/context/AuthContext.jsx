import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await authAPI.me();
      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch (err) {
      // Not authenticated - this is normal
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка входа';
      setError(message);
      return { success: false, message, errors: err.response?.data?.errors };
    }
  };

  const register = async (data) => {
    setError(null);
    try {
      const response = await authAPI.register(data);
      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка регистрации';
      setError(message);
      return { success: false, message, errors: err.response?.data?.errors };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Ошибка обновления профиля',
        errors: err.response?.data?.errors
      };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isClient: user?.role === 'client',
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
