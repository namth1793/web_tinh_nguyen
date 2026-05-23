'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockUser } from '@/data/mockData';

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  sidebarOpen: boolean;        // mobile drawer
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;   // desktop collapsed
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedCollapsed = localStorage.getItem('phatphap_sidebar_collapsed');
    if (savedCollapsed === 'true') setSidebarCollapsed(true);

    const savedToken = localStorage.getItem('phatphap_token');
    const savedUser  = localStorage.getItem('phatphap_user');

    if (savedToken && savedUser) {
      // Đã đăng nhập thật → restore session
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('phatphap_token');
        localStorage.removeItem('phatphap_user');
        setUser(mockUser); // fallback demo
      }
    } else {
      // Chưa đăng nhập → dùng mockUser để dashboard có data demo
      setUser(mockUser);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('phatphap_token', newToken);
    localStorage.setItem('phatphap_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('phatphap_token');
    localStorage.removeItem('phatphap_user');
    setUser(mockUser);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('phatphap_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      token,
      isLoggedIn: !!token,
      login,
      logout,
      sidebarOpen,
      setSidebarOpen,
      sidebarCollapsed,
      toggleSidebar,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
