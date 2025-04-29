import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User, LoginData, RegisterData } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        api.setToken(token);
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await api.login(data);
      api.setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Invalid email or password'
      );
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.register(data);
      api.setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
