'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '@/store/useAuthStore';
import { topProgress } from '@/components/common/TopProgressBar';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/users',
    icon: <TeamOutlined />,
    label: 'Pengguna',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Pengaturan',
  },
];

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isSidebarCollapsed = useAuthStore((state) => state.isSidebarCollapsed);
  const setSidebarCollapsed = useAuthStore((state) => state.setSidebarCollapsed);

  // Cari key menu yang aktif berdasarkan pathname
  const activeKey = menuItems.find((item) => pathname.startsWith(item?.key as string))?.key as string || '/dashboard';

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (pathname !== e.key) {
      topProgress.start();
      router.push(e.key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={isSidebarCollapsed}
      onCollapse={(value) => setSidebarCollapsed(value)}
      trigger={null} // Trigger ada di topbar hamburger
      width={240}
      collapsedWidth={80}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 100,
        backgroundColor: '#001529',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Logo Header */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
          padding: isSidebarCollapsed ? '0' : '0 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.2s',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: '#1677ff',
            color: '#fff',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          <ThunderboltFilled />
        </div>
        {!isSidebarCollapsed && (
          <div style={{ marginLeft: 12, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: '1.2' }}>
              Learn Next.js
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }}>
              AntD + Zustand Admin
            </div>
          </div>
        )}
      </div>

      {/* Navigasi Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          borderRight: 0,
          marginTop: 12,
        }}
      />
    </Sider>
  );
}

