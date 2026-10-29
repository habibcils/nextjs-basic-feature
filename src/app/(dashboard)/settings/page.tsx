'use client';

import React, { useState } from 'react';
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
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SettingOutlined,
  SaveOutlined,
  SafetyCertificateOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/useAuthStore';

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

  const handleSaveProfile = async (values: { name: string; email: string; bio?: string }) => {
    setSavingProfile(true);
    setTimeout(() => {
      if (user) {
        setUser({
          ...user,
          name: values.name,
          email: values.email,
        });
      }
      setSavingProfile(false);
      message.success('Profil berhasil diperbarui!');
    }, 600);
  };

  const handleSaveSecurity = async () => {
    setSavingSecurity(true);
    setTimeout(() => {
      securityForm.resetFields();
      setSavingSecurity(false);
      message.success('Kata sandi berhasil diubah!');
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
                {user?.name || 'Administrator'}
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Role: {user?.role?.toUpperCase() || 'ADMIN'}
              </Text>
            </Col>

            <Col xs={24} md={18}>
              <Form
                form={profileForm}
                layout="vertical"
                initialValues={{
                  name: user?.name || 'Ahmad Habib',
                  email: user?.email || 'admin@example.com',
                  bio: 'Software engineer and system administrator.',
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

            <Form.Item
              name="confirmPassword"
              label="Konfirmasi Kata Sandi Baru"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Harap konfirmasi kata sandi baru!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Kata sandi konfirmasi tidak cocok!'));
                  },
                }),
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
                <Text strong>Bahasa Antarmuka (Interface Language)</Text>
                <div style={{ color: '#8c8c8c', fontSize: 13, marginTop: 4 }}>
                  Pilih bahasa tampilan default aplikasi.
                </div>
              </div>
              <Select defaultValue="id" style={{ width: 160 }}>
                <Option value="id">Bahasa Indonesia</Option>
                <Option value="en">English (US)</Option>
              </Select>
            </div>

            <Divider style={{ margin: 0 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>Penyimpanan Sesi (Session Security)</Text>
                <div style={{ color: '#8c8c8c', fontSize: 13, marginTop: 4 }}>
                  Sesi menggunakan <code>httpOnly</code> cookie dengan atribut <code>SameSite=Lax</code>.
                </div>
              </div>
              <Button type="dashed" onClick={() => message.info('Cookie session berstatus aktif dan terenkripsi!')}>
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
          Kelola profil pengguna, preferensi keamanan, dan konfigurasi aplikasi.
        </Text>
      </div>

      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Tabs defaultActiveKey="profile" items={tabItems} />
      </Card>
    </div>
  );
}

