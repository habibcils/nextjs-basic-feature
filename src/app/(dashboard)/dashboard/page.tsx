'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Button, Space, Progress, Badge, Avatar, Spin, Alert } from 'antd';
import {
  DollarCircleOutlined,
  UsergroupAddOutlined,
  ShoppingOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuthStore } from '@/store/useAuthStore';
import { dashboardApi, ProductItem } from '@/services/api/dashboard/dashboardApi';
import Link from 'next/link';
import axios from 'axios';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // Hit endpoint dummyjson.com/products melalui dashboardApi (Axios)
      const data = await dashboardApi.getProductsSummary(6);
      setProducts(data.products);
      setTotalProducts(data.total);
    } catch (err: any) {
      // Abaikan jika error berasal dari axios cancel
      if (axios.isCancel(err)) {
        console.log('🛑 Request getProductsSummary dibatalkan karena ganti page');
        return;
      }
      console.error('Gagal mengambil data produk:', err);
      setErrorMsg('Gagal memuat data dari DummyJSON API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const columns: ColumnsType<ProductItem> = [
    {
      title: 'Produk',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <Space size={12}>
          <Avatar src={record.thumbnail} shape="square" size="large" />
          <div>
            <Text strong style={{ display: 'block' }}>{record.title}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>Kategori: {record.category}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Text style={{ color: '#1677ff', fontWeight: 600 }}>${price}</Text>,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Tag color={rating >= 4.5 ? 'success' : 'processing'}>⭐ {rating}</Tag>
      ),
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <Tag color={stock < 20 ? 'warning' : 'default'}>{stock} unit</Tag>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Banner Selamat Datang */}
      <Card
        style={{
          borderRadius: 12,
          background: 'linear-gradient(100deg, #1677ff 0%, #0958d9 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(22, 119, 255, 0.2)',
          border: 'none',
        }}
        styles={{ body: { padding: '24px 32px' } }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
              Selamat Datang, {user?.name || 'Administrator'}! 👋
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 14, marginTop: 8, display: 'block' }}>
              Data sesi Anda aman dengan HttpOnly Cookie dan data profil dipersist di Zustand. Data di bawah ini diambil langsung via Axios dari DummyJSON API.
            </Text>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Link href="/users">
                <Button icon={<PlusOutlined />} style={{ borderRadius: 6 }}>
                  Kelola Pengguna
                </Button>
              </Link>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                ghost
                style={{ borderRadius: 6 }}
                onClick={fetchDashboardData}
                loading={loading}
              >
                Refresh Data
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {errorMsg && <Alert message={errorMsg} type="error" showIcon closable />}

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title={<Text type="secondary">Total Produk DummyJSON</Text>}
              value={totalProducts || 194}
              prefix={<ShoppingOutlined style={{ color: '#1677ff' }} />}
              styles={{ content: { fontWeight: 700, fontSize: 24 } }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="processing" icon={<ArrowUpOutlined />}>
                Live API
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                /products endpoint
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title={<Text type="secondary">Total Pendapatan</Text>}
              value="$45,820"
              prefix={<DollarCircleOutlined style={{ color: '#52c41a' }} />}
              styles={{ content: { fontWeight: 700, fontSize: 24 } }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="success" icon={<ArrowUpOutlined />}>
                +15.8%
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                vs bulan lalu
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title={<Text type="secondary">User Aktif Terdaftar</Text>}
              value={208}
              prefix={<UsergroupAddOutlined style={{ color: '#fa8c16' }} />}
              styles={{ content: { fontWeight: 700, fontSize: 24 } }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="warning" icon={<ArrowUpOutlined />}>
                DummyJSON Users
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title={<Text type="secondary">Status Axios API</Text>}
              value="Aktif"
              prefix={<ThunderboltOutlined style={{ color: '#722ed1' }} />}
              styles={{ content: { fontWeight: 700, fontSize: 24, color: '#52c41a' } }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="purple">Auto-Cancel On Route Change</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content: Table & Right Column */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Daftar Produk Unggulan (DummyJSON via Axios)</Title>}
            extra={
              <Button type="text" icon={<ReloadOutlined />} size="small" onClick={fetchDashboardData} loading={loading}>
                Segarkan
              </Button>
            }
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Table
              dataSource={products}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={false}
              scroll={{ x: 600 }}
              size="middle"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Target Kuartal */}
            <Card
              title={<Title level={5} style={{ margin: 0 }}>Pencapaian Kuartal Q4</Title>}
              variant="borderless"
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <Progress type="dashboard" percent={82} strokeColor="#1677ff" size={160} />
                <div style={{ marginTop: 12 }}>
                  <Text strong style={{ fontSize: 15, display: 'block' }}>
                    $82,000 / $100,000
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Tersisa 42 hari menuju akhir kuartal
                  </Text>
                </div>
              </div>
            </Card>

            {/* Status Sistem */}
            <Card
              title={<Title level={5} style={{ margin: 0 }}>Infrastruktur & Penyimpanan</Title>}
              variant="borderless"
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <Space orientation="vertical" style={{ width: '100%' }} size={12}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>HttpOnly Cookies</Text>
                  <Badge status="success" text="Rahasia (JWT Token)" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Zustand Persist Storage</Text>
                  <Badge status="processing" text="Tahan Hard Reload" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Axios Abort Controller</Text>
                  <Badge status="success" text="Auto-Cancel Siap" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Target API</Text>
                  <Badge status="processing" text="https://dummyjson.com" />
                </div>
              </Space>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
