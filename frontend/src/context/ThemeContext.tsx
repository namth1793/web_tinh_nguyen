'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserStats } from '@/types';
import { mockUser, mockStats, EMPTY_STATS } from '@/data/mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5030/api';

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  stats: UserStats;
  setStats: (s: UserStats) => void;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

async function fetchRealStats(token: string): Promise<UserStats> {
  try {
    const res = await fetch(`${API_BASE}/results/stats/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return EMPTY_STATS;
    const data = await res.json();
    return {
      total_quizzes:  data.total_quizzes  ?? 0,
      avg_score:      data.avg_score      ?? 0,
      passed_count:   data.passed_count   ?? 0,
      total_correct:  data.total_correct  ?? 0,
      total_questions: data.total_questions ?? 0,
      xp:             data.xp             ?? 0,
      study_days:     data.study_days     ?? 0,
      rank:           data.rank           ?? 0,
      totalUsers:     data.totalUsers     ?? 0,
      rankPercentage: data.rankPercentage ?? 100,
    };
  } catch {
    return EMPTY_STATS;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user,             setUser]             = useState<User | null>(null);
  const [token,            setToken]            = useState<string | null>(null);
  const [stats,            setStats]            = useState<UserStats>(mockStats);
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedCollapsed = localStorage.getItem('phatphap_sidebar_collapsed');
    if (savedCollapsed === 'true') setSidebarCollapsed(true);

    const savedToken = localStorage.getItem('phatphap_token');
    const savedUser  = localStorage.getItem('phatphap_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Fetch real stats từ API (người mới sẽ có tất cả = 0)
        fetchRealStats(savedToken).then(setStats);
      } catch {
        localStorage.removeItem('phatphap_token');
        localStorage.removeItem('phatphap_user');
        setUser(mockUser);
        setStats(mockStats);
      }
    } else {
      // Chưa đăng nhập → dùng mockUser & mockStats để dashboard có data demo
      setUser(mockUser);
      setStats(mockStats);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('phatphap_token', newToken);
    localStorage.setItem('phatphap_user', JSON.stringify(newUser));
    // Fetch stats thật — người mới sẽ nhận về EMPTY_STATS (0 bài thi, 0 XP...)
    fetchRealStats(newToken).then(setStats);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('phatphap_token');
    localStorage.removeItem('phatphap_user');
    setUser(mockUser);
    setStats(mockStats); // quay về demo
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
      stats,
      setStats,
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
