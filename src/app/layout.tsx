import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import AntdProvider from '@/components/providers/AntdProvider';
import InitialLoaderRemover from '@/components/common/InitialLoaderRemover';
import TopProgressBar from '@/components/common/TopProgressBar';

export const metadata: Metadata = {
  title: 'Learn Next.js - Modern Admin Dashboard',
  description: 'Project Next.js dengan Ant Design, Zustand, dan Secure Cookie Auth',
};

// Ubah nama project di sini jika ingin mengganti teks loading
const APP_TITLE = 'learn-nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* SPA Loading Template (Muncul instan layaknya spa-loading-template.html di Nuxt) */}
        <div id="spa-initial-loader">
          <div className="spa-spinner-box">
            <div className="spa-spinner-ring"></div>
            <div className="spa-spinner-ring-inner"></div>
            <div className="spa-spinner-core"></div>
          </div>
          {/* Teks nama project di bawah animasi */}
          <div className="spa-loader-title">{APP_TITLE}</div>
          <div className="spa-loader-subtitle">Memuat aplikasi...</div>
        </div>

        {/* Komponen yang otomatis menghapus loader ketika React selesai hydrate */}
        <InitialLoaderRemover />

        {/* Loading bar garis di bagian paling atas saat berpindah halaman */}
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>

        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
