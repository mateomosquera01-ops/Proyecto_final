import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { AuthUserDTO } from '../types/user';

interface AuthContextValue {
  user: AuthUserDTO | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('textech_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    authService
      .getProfile()
      .then((profile) => setUser(profile))
      .catch(() => {
        localStorage.removeItem('textech_token');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    localStorage.setItem('textech_token', response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('textech_token');
    setUser(null);
  };

  const isAdmin = Boolean(user?.roles.includes('ADMIN'));

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }
  return ctx;
}
