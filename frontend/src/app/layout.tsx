import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { AppProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Phật Pháp Test - Học Phật · Hiểu Pháp · Ứng Dụng · An Lạc',
  description: 'Nền tảng học và thi kiến thức Phật giáo trực tuyến - từ cơ bản đến nâng cao',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AppProvider>
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
