'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, Card, Typography, Alert, Space, Divider, Spin, App } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, SafetyCertificateOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginCredentials } from '@/types/auth';

const { Title, Text, Paragraph } = Typography;

function LoginForm() {
  const { message } = App.useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [form] = Form.useForm<LoginCredentials>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'Login gagal, periksa email dan password.');
        return;
      }

      // Update state di Zustand
      setUser(data.user);

      message.success(`Selamat datang, ${data.user.name}!`);
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error('Error saat login:', err);
      setErrorMessage('Terjadi kesalahan jaringan atau server');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (email: string, pass: string) => {
    form.setFieldsValue({
      email,
      password: pass,
    });
    setErrorMessage(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #091e3a 0%, #2f80ed 50%, #2d9ee0 100%)',
        padding: '24px 16px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 440,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          borderRadius: 16,
          border: 'none',
        }}
        styles={{ body: { padding: '36px 32px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#e6f4ff',
              color: '#1677ff',
              fontSize: 28,
              marginBottom: 12,
            }}
          >
            <SafetyCertificateOutlined />
          </div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            Learn Next.js Admin
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Silakan login untuk masuk ke dashboard
          </Text>
        </div>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            closable
            onClose={() => setErrorMessage(null)}
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          form={form}
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label={<Text strong>Alamat Email</Text>}
            rules={[
              { required: true, message: 'Harap masukkan email Anda!' },
              { type: 'email', message: 'Format email tidak valid!' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="nama@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong>Kata Sandi</Text>}
            rules={[{ required: true, message: 'Harap masukkan kata sandi!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Masukkan kata sandi"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              icon={<LoginOutlined />}
              style={{
                height: 44,
                fontWeight: 600,
                borderRadius: 8,
              }}
            >
              Masuk ke Akun
            </Button>
          </Form.Item>
        </Form>

        <Divider plain style={{ fontSize: 12, color: '#8c8c8c', margin: '20px 0 16px' }}>
          Akun Demo Cepat (Klik untuk isi)
        </Divider>

        <Space orientation="vertical" style={{ width: '100%' }} size={10}>
          <Button
            block
            size="middle"
            onClick={() => handleFillDemo('admin@example.com', 'admin123')}
            style={{ textAlign: 'left', height: 'auto', padding: '10px 14px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ fontSize: 13, display: 'block' }}>
                  Akun Administrator
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  admin@example.com (Pass: admin123)
                </Text>
              </div>
              <CheckCircleFilled style={{ color: '#52c41a' }} />
            </div>
          </Button>

          <Button
            block
            size="middle"
            onClick={() => handleFillDemo('staff@example.com', 'staff123')}
            style={{ textAlign: 'left', height: 'auto', padding: '10px 14px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ fontSize: 13, display: 'block' }}>
                  Akun Staff
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  staff@example.com (Pass: staff123)
                </Text>
              </div>
              <CheckCircleFilled style={{ color: '#1677ff' }} />
            </div>
          </Button>
        </Space>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
            Dilindungi oleh <strong>Secure HttpOnly Cookies</strong> & Zustand State
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

