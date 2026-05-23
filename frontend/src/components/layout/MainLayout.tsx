'use client';

import { motion } from 'framer-motion';
import { Sidebar, MobileSidebar } from './Sidebar';
import Header from './Header';
import RightSidebar from './RightSidebar';
import { useApp } from '@/context/ThemeContext';

interface MainLayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

export default function MainLayout({ children, showRightSidebar = true }: MainLayoutProps) {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-[#1A1208]">
      <Sidebar />
      <MobileSidebar />

      {/* Offset main area — animates in sync with sidebar width */}
      <motion.div
        animate={{ paddingLeft: sidebarCollapsed ? 64 : 224 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:block"
        style={{ paddingLeft: sidebarCollapsed ? 64 : 224 }}
      >
        <Header />
        <div className="flex min-h-[calc(100vh-3.5rem)]">
          <main className="flex-1 min-w-0 p-6">
            {children}
          </main>
          {showRightSidebar && (
            <div className="xl:w-72 flex-shrink-0 pt-4">
              <RightSidebar />
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile layout (no sidebar offset) */}
      <div className="lg:hidden">
        <Header />
        <div className="flex min-h-[calc(100vh-3.5rem)]">
          <main className="flex-1 min-w-0 p-4">
            {children}
          </main>
          {showRightSidebar && (
            <div className="xl:w-72 flex-shrink-0 pt-4">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
