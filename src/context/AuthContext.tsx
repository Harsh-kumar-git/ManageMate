import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    // Dummy authentication
    if (email === 'admin@managemate.com' && password === '123456') {
      setUser({
        email,
        name: 'Admin User',
      });
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return user ? <>{children}</> : null;
};
