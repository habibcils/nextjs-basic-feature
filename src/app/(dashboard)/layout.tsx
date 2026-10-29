'use client';

import React, { useEffect } from 'react';
import { Layout } from 'antd';
import AppSidebar from '@/components/layout/Sidebar';
import AppTopbar from '@/components/layout/Topbar';
import { useAuthStore } from '@/store/useAuthStore';

const { Content, Footer } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  // Hydrate user session dari cookie jika reload page
  useEffect(() => {
    if (!user) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
          }
        })
        .catch((err) => console.error('Gagal mengambil sesi:', err));
    }
  }, [user, setUser]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <AppSidebar />
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <AppTopbar />
        <Content
          style={{
            margin: '24px',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            color: '#8c8c8c',
            fontSize: 13,
            padding: '16px 24px',
            background: 'transparent',
          }}
        >
          Learn Next.js Admin • Ant Design v5/v6 • Zustand • Secure HttpOnly Cookies
        </Footer>
      </Layout>
    </Layout>
  );
}

