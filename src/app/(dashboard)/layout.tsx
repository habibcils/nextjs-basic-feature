'use client';

import React, { useEffect } from 'react';
import { Layout } from 'antd';
import AppSidebar from '@/components/layout/Sidebar';
import AppTopbar from '@/components/layout/Topbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useCancelPendingRequestsOnRouteChange } from '@/hooks/useCancelPendingRequests';
import axios from 'axios';

const { Content, Footer } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  // Pasang auto-cancel Axios saat user berpindah menu/page di dalam dashboard
  useCancelPendingRequestsOnRouteChange();

  // Validasi sesi token di cookies & update store jika perlu saat hard reload
  useEffect(() => {
    // Tetap panggil verifikasi /api/auth/me untuk memastikan cookie token di browser masih valid
    axios
      .get('/api/auth/me')
      .then((res) => {
        if (res.data?.success && res.data?.user) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.warn('Sesi cookie kedaluwarsa atau tidak valid:', err?.response?.data || err?.message);
      });
  }, [setUser]);

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
          Learn Next.js Admin • Ant Design • Zustand Persist • Axios Multi-Endpoint & Auto-Cancel
        </Footer>
      </Layout>
    </Layout>
  );
}
