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
      <head>
        {/* CSS Murni Inline: Dieksekusi langsung oleh browser dalam 0ms sebelum file JS diunduh */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #spa-initial-loader {
                position: fixed;
                inset: 0;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #091e3a 0%, #0d2847 50%, #0a192f 100%);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              }
              #spa-initial-loader.fade-out {
                opacity: 0;
                pointer-events: none;
                visibility: hidden;
              }
              .spa-spinner-box {
                position: relative;
                width: 72px;
                height: 72px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .spa-spinner-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 3px solid transparent;
                border-top-color: #1677ff;
                border-right-color: #4096ff;
                animation: spaSpin 1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
              }
              .spa-spinner-ring-inner {
                position: absolute;
                width: 70%;
                height: 70%;
                border-radius: 50%;
                border: 2px solid transparent;
                border-bottom-color: #69b1ff;
                border-left-color: #91caff;
                animation: spaSpinReverse 1.4s linear infinite;
              }
              .spa-spinner-core {
                width: 14px;
                height: 14px;
                background-color: #1677ff;
                border-radius: 50%;
                box-shadow: 0 0 16px #4096ff, 0 0 32px #1677ff;
                animation: spaPulse 1.8s ease-in-out infinite;
              }
              .spa-loader-title {
                margin-top: 24px;
                font-size: 20px;
                font-weight: 700;
                letter-spacing: 0.5px;
                color: #ffffff;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
              }
              .spa-loader-subtitle {
                margin-top: 6px;
                font-size: 13px;
                color: rgba(255, 255, 255, 0.6);
                letter-spacing: 0.3px;
              }
              @keyframes spaSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes spaSpinReverse {
                0% { transform: rotate(360deg); }
                100% { transform: rotate(0deg); }
              }
              @keyframes spaPulse {
                0%, 100% { transform: scale(0.85); opacity: 0.7; }
                50% { transform: scale(1.2); opacity: 1; }
              }
            `,
          }}
        />
      </head>
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
