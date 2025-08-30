import type React from 'react';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import NavBarWrapper from '@/components/nav-bar-wrapper';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  title: 'AI Skill Hub - Trung tâm Kỹ năng AI',
  description:
    'Nền tảng học tập toàn diện giúp bạn phát triển 4 kỹ năng cốt lõi: Đặt câu hỏi hiệu quả, Tư duy phản biện, Sáng tạo và Đạo đức AI.',
  generator: 'v0.app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='vi' className={`${inter.variable} ${spaceGrotesk.variable} antialiased h-full`}>
      <body className='font-sans h-full overflow-hidden'>
        {' '}
        <AuthProvider>
          <NavBarWrapper>{children}</NavBarWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
