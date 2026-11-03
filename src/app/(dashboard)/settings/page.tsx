'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Typography,
  Space,
  Avatar,
  Row,
  Col,
  Select,
  Divider,
  App,
  List,
  Tag,
  Alert,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SettingOutlined,
  SaveOutlined,
  SafetyCertificateOutlined,
  BellOutlined,
  HistoryOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/useAuthStore';
import { settingsApi, DummyPost } from '@/services/api/settings/settingsApi';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function SettingsPage() {
  const { message } = App.useApp();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Data aktivitas sistem dari DummyJSON /posts via settingsApi
  const [activityLogs, setActivityLogs] = useState<DummyPost[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchActivityLogs = async () => {
    setLoadingLogs(true);
    try {
      // Hit endpoint dummyjson.com/posts via settingsApi (Axios)
      const data = await settingsApi.getSystemActivityLogs(4);
      setActivityLogs(data.posts);
    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.log('🛑 Request settingsApi dibatalkan karena ganti page');
        return;
      }
      console.error('Error fetching logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const handleSaveProfile = async (values: { name: string; email: string }) => {
    setSavingProfile(true);
    try {
      // Simulasi update profil via DummyJSON PUT
      if (user?.id) {
        await settingsApi.updateUserProfile(user.id, {
          email: values.email,
        });
      }

      // Update data di Zustand store (dan otomatis tersimpan di LocalStorage persist)
      if (user) {
        setUser({
          ...user,
          name: values.name,
          email: values.email,
        });
      }
      message.success('Profil berhasil diperbarui dan tersimpan di Zustand Persist!');
    } catch (err: any) {
      if (!axios.isCancel(err)) {
        message.warning('Profil diperbarui di state lokal');
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSecurity = async () => {
    setSavingSecurity(true);
    setTimeout(() => {
      securityForm.resetFields();
      setSavingSecurity(false);
      message.success('Kata sandi berhasil diperbarui!');
    }, 600);
  };

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined /> Profil Akun
        </span>
      ),
      children: (
        <Card variant="borderless" style={{ boxShadow: 'none' }}>
          <Row gutter={[32, 24]}>
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <Avatar
                size={100}
                src={user?.avatar}
                icon={!user?.avatar ? <UserOutlined /> : undefined}
                style={{ backgroundColor: '#1677ff', marginBottom: 16 }}
              />
              <Title level={5} style={{ margin: 0 }}>
                {user?.name || 'Emily Johnson'}
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                @{user?.username || 'emilys'} • {user?.role?.toUpperCase() || 'ADMIN'}
              </Text>
            </Col>

            <Col xs={24} md={18}>
              <Form
                form={profileForm}
                layout="vertical"
                initialValues={{
                  name: user?.name || 'Emily Johnson',
                  email: user?.email || 'emilys@dummyjson.com',
                  bio: 'Product Manager & Administrator on DummyJSON system.',
                }}
                onFinish={handleSaveProfile}
              >
                <Form.Item
                  name="name"
                  label={<Text strong>Nama Lengkap</Text>}
                  rules={[{ required: true, message: 'Nama tidak boleh kosong!' }]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<Text strong>Alamat Email</Text>}
                  rules={[
                    { required: true, message: 'Email tidak boleh kosong!' },
                    { type: 'email', message: 'Format email tidak valid!' },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item name="bio" label={<Text strong>Bio Singkat</Text>}>
                  <TextArea rows={3} placeholder="Tulis sedikit tentang peran Anda..." />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    size="large"
                    loading={savingProfile}
                    style={{ borderRadius: 8 }}
                  >
                    Simpan Perubahan Profil
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: 'logs',
      label: (
        <span>
          <HistoryOutlined /> Log Aktivitas Sistem (DummyJSON API)
        </span>
      ),
      children: (
        <Card variant="borderless" style={{ maxWidth: 800 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text type="secondary">Data live dari endpoint <code>settingsApi.ts</code> (/posts) via Axios:</Text>
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchActivityLogs} loading={loadingLogs}>
              Segarkan Log
            </Button>
          </div>
          <List
            loading={loadingLogs}
            itemLayout="vertical"
            dataSource={activityLogs}
            renderItem={(item) => (
              <List.Item key={item.id} style={{ padding: '16px 0' }}>
                <List.Item.Meta
                  title={<Text strong>{item.title}</Text>}
                  description={
                    <Space size={6} style={{ marginTop: 4 }}>
                      {item.tags.map((tag) => (
                        <Tag key={tag} color="geekblue">#{tag}</Tag>
                      ))}
                      <Tag color="green">👁️ {item.views} views</Tag>
                    </Space>
                  }
                />
                <Paragraph style={{ color: '#595959', margin: '8px 0 0' }}>
                  {item.body.slice(0, 140)}...
                </Paragraph>
              </List.Item>
            )}
          />
        </Card>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined /> Keamanan & Password
        </span>
      ),
      children: (
        <Card variant="borderless" style={{ maxWidth: 640 }}>
          <Title level={5} style={{ marginBottom: 4 }}>
            Ubah Kata Sandi
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 24 }}>
            Pastikan kata sandi baru Anda minimal 8 karakter dan mengandung kombinasi huruf serta angka.
          </Paragraph>

          <Form
            form={securityForm}
            layout="vertical"
            onFinish={handleSaveSecurity}
          >
            <Form.Item
              name="currentPassword"
              label="Kata Sandi Saat Ini"
              rules={[{ required: true, message: 'Harap masukkan kata sandi saat ini!' }]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Kata Sandi Baru"
              rules={[
                { required: true, message: 'Harap masukkan kata sandi baru!' },
                { min: 6, message: 'Minimal 6 karakter!' },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <Space>
                  <SafetyCertificateOutlined style={{ color: '#1677ff', fontSize: 18 }} />
                  <Text strong>Autentikasi Dua Faktor (2FA)</Text>
                </Space>
                <div style={{ color: '#8c8c8c', fontSize: 13, marginTop: 4 }}>
                  Tambahkan lapisan keamanan ekstra pada akun Anda dengan token OTP.
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
                loading={savingSecurity}
                style={{ borderRadius: 8 }}
              >
                Perbarui Kata Sandi
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'preferences',
      label: (
        <span>
          <SettingOutlined /> Preferensi Sistem
        </span>
      ),
      children: (
        <Card variant="borderless" style={{ maxWidth: 640 }}>
          <Space orientation="vertical" size={24} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Space>
                  <BellOutlined style={{ color: '#1677ff', fontSize: 18 }} />
                  <Text strong>Notifikasi Email Transaksi</Text>
                </Space>
                <div style={{ color: '#8c8c8c', fontSize: 13, marginTop: 4 }}>
                  Kirim ringkasan otomatis setiap ada transaksi atau aktivitas baru.
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Divider style={{ margin: 0 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>Status Penyimpanan Data</Text>
                <div style={{ color: '#8c8c8c', fontSize: 13, marginTop: 4 }}>
                  JWT Token tersimpan di <code>HttpOnly Cookies</code>, Profil tersimpan di <code>Zustand Persist</code>.
                </div>
              </div>
              <Button type="dashed" onClick={() => message.info('Data store tetap bertahan saat hard reload!')}>
                Cek Status
              </Button>
            </div>
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={4} style={{ margin: 0 }}>
          Pengaturan Akun & Sistem
        </Title>
        <Text type="secondary">
          Kelola profil pengguna DummyJSON, log aktivitas via Axios, dan preferensi aplikasi.
        </Text>
      </div>

      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Tabs defaultActiveKey="profile" items={tabItems} />
      </Card>
    </div>
  );
}
