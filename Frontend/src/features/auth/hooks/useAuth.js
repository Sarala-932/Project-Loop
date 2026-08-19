import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isCheckingAuth, 
    setAuth, 
    clearAuth, 
    setCheckingAuth 
  } = useAuthStore();

  const login = useCallback(async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setAuth(data.user || { email });
      return data;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  }, [setAuth]);

  const register = useCallback(async (companyName, name, email, password) => {
    setCheckingAuth(true);
    try {
      // 1. Register the user
      await authService.register(companyName, name, email, password);
      
      // 2. The backend doesn't set cookies on register, so we must explicitly login
      const loginData = await authService.login(email, password);
      
      // 3. Set the authenticated user state
      setAuth(loginData.user || { email });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    } finally {
      setCheckingAuth(false);
    }
  }, [setAuth, setCheckingAuth]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const checkAuth = useCallback(async () => {
    // If we already have user data persisted in localStorage, we can trust it.
    // The Axios interceptor will handle token refreshing automatically in the background
    // whenever an actual API request is made. No need to aggressively refresh on every page load.
    if (useAuthStore.getState().isAuthenticated) {
      return;
    }

    setCheckingAuth(true);
    try {
      const data = await authService.checkAuth();
      setAuth(data.user || { name: 'User' });
    } catch (error) {
      clearAuth();
    } finally {
      setCheckingAuth(false);
    }
  }, [setCheckingAuth, setAuth, clearAuth]);

  const forgotPassword = useCallback(async (email) => {
    try {
      await authService.forgotPassword(email);
      return true;
    } catch (error) {
      console.error("Forgot Password Error:", error);
      throw error;
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isCheckingAuth,
    login,
    register,
    logout,
    checkAuth,
    forgotPassword
  };
};
