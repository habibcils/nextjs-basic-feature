'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, Card, Typography, Alert, Space, Divider, Spin, App, Tag } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, SafetyCertificateOutlined, CheckCircleFilled, ApiOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginPayload } from '@/types/auth';
import { DUMMYJSON_DEMO_ACCOUNTS } from '@/lib/auth';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

function LoginForm() {
  const { message } = App.useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [form] = Form.useForm<LoginPayload>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);

  const onFinish = async (values: LoginPayload) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // Hit endpoint internal Next.js menggunakan Axios
      const response = await axios.post('/api/auth/login', values);
      const data = response.data;

      if (!data.success) {
        setErrorMessage(data.message || 'Login gagal, periksa username dan password.');
        return;
      }

      // Simpan data normal ke Zustand store (yang otomatis dipersist ke LocalStorage)
      setUser(data.user);

      message.success(`Selamat datang, ${data.user.name}!`);
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      console.error('Error saat login:', err);
      const errMsg = err?.response?.data?.message || 'Username atau kata sandi tidak valid.';
      setErrorMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (username: string, pass: string) => {
    form.setFieldsValue({
      username,
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
        background: 'linear-gradient(135deg, #091e3a 0%, #1e40af 50%, #0369a1 100%)',
        padding: '24px 16px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 460,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          borderRadius: 16,
          border: 'none',
        }}
        styles={{ body: { padding: '36px 32px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              fontSize: 26,
              marginBottom: 12,
            }}
          >
            <ApiOutlined />
          </div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            DummyJSON Auth Portal
          </Title>
          <div style={{ marginTop: 4 }}>
            <Tag color="cyan">Axios HTTP Client</Tag>
            <Tag color="blue">Secure HttpOnly Cookie</Tag>
            <Tag color="purple">Zustand Persist</Tag>
          </div>
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
            name="username"
            label={<Text strong>Username DummyJSON</Text>}
            rules={[{ required: true, message: 'Harap masukkan username!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Contoh: emilys"
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
              placeholder="Contoh: emilyspass"
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
              Masuk ke Sistem
            </Button>
          </Form.Item>
        </Form>

        <Divider plain style={{ fontSize: 12, color: '#8c8c8c', margin: '20px 0 16px' }}>
          Akun Demo DummyJSON (Klik untuk Mengisi)
        </Divider>

        <Space orientation="vertical" style={{ width: '100%' }} size={10}>
          {DUMMYJSON_DEMO_ACCOUNTS.map((acc) => (
            <Button
              key={acc.username}
              block
              size="middle"
              onClick={() => handleFillDemo(acc.username, acc.password)}
              style={{ textAlign: 'left', height: 'auto', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ fontSize: 13, display: 'block' }}>
                    {acc.name} ({acc.role})
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    User: <code>{acc.username}</code> • Pass: <code>{acc.password}</code>
                  </Text>
                </div>
                <CheckCircleFilled style={{ color: '#10b981' }} />
              </div>
            </Button>
          ))}
        </Space>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
            🔒 Token JWT rahasia disimpan di <strong>HttpOnly Cookie</strong>.
            <br />
            💾 Profil normal dipersist di <strong>Zustand Store</strong> (tahan hard reload).
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
