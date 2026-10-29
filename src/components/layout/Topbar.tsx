'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Button, Avatar, Dropdown, Space, Tag, Typography, Badge, App } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '@/store/useAuthStore';

const { Header } = Layout;
const { Text } = Typography;

export default function AppTopbar() {
  const { modal, message } = App.useApp();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isSidebarCollapsed = useAuthStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useAuthStore((state) => state.toggleSidebar);
  const logoutClient = useAuthStore((state) => state.logoutClient);

  const handleLogout = () => {
    modal.confirm({
      title: 'Konfirmasi Keluar',
      icon: <ExclamationCircleFilled />,
      content: 'Apakah Anda yakin ingin keluar dari sistem?',
      okText: 'Ya, Keluar',
      cancelText: 'Batal',
      okType: 'danger',
      onOk: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          logoutClient();
          message.success('Anda telah berhasil keluar');
          router.push('/login');
          router.refresh();
        } catch (error) {
          console.error('Logout error:', error);
          message.error('Gagal keluar, silakan coba lagi');
        }
      },
    });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile-header',
      label: (
        <div style={{ padding: '4px 0' }}>
          <Text strong style={{ display: 'block' }}>{user?.name || 'Administrator'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{user?.email || 'admin@example.com'}</Text>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Pengaturan Akun',
      onClick: () => router.push('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Keluar (Logout)',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
        height: 64,
      }}
    >
      {/* Left: Sidebar Toggle Button */}
      <Space size={16}>
        <Button
          type="text"
          icon={isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{
            fontSize: '18px',
            width: 40,
            height: 40,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong style={{ fontSize: 15 }}>
            Sistem Manajemen & Dashboard
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Next.js App Router • Ant Design • Zustand
          </Text>
        </div>
      </Space>

      {/* Right: Notifications & User Profile */}
      <Space size={20}>
        <Badge count={3} offset={[-2, 4]} size="small">
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined style={{ fontSize: 18 }} />}
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>
            <Avatar
              src={user?.avatar}
              icon={!user?.avatar ? <UserOutlined /> : undefined}
              style={{ backgroundColor: '#1677ff' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <Text strong style={{ fontSize: 14 }}>
                {user?.name || 'User'}
              </Text>
              <div style={{ marginTop: 2 }}>
                <Tag color={user?.role === 'admin' ? 'blue' : 'cyan'} style={{ margin: 0, fontSize: 10, padding: '0 4px' }}>
                  {user?.role ? user.role.toUpperCase() : 'USER'}
                </Tag>
              </div>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}

