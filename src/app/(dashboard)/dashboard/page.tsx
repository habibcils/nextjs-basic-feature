'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Button, Space, Progress, Badge, Avatar } from 'antd';
import {
  DollarCircleOutlined,
  UsergroupAddOutlined,
  ShoppingOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

const { Title, Text } = Typography;

interface RecentTransaction {
  key: string;
  id: string;
  customer: string;
  avatar: string;
  amount: string;
  status: 'sukses' | 'diproses' | 'tertunda';
  date: string;
}

const transactionData: RecentTransaction[] = [
  {
    key: '1',
    id: 'TRX-9821',
    customer: 'Budi Santoso',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    amount: 'Rp 1.250.000',
    status: 'sukses',
    date: 'Hari ini, 10:45',
  },
  {
    key: '2',
    id: 'TRX-9820',
    customer: 'Dewi Lestari',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
    amount: 'Rp 750.000',
    status: 'diproses',
    date: 'Hari ini, 09:30',
  },
  {
    key: '3',
    id: 'TRX-9819',
    customer: 'Rian Pratama',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rian',
    amount: 'Rp 2.800.000',
    status: 'sukses',
    date: 'Kemarin, 16:20',
  },
  {
    key: '4',
    id: 'TRX-9818',
    customer: 'Maya Anggraini',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    amount: 'Rp 450.000',
    status: 'tertunda',
    date: 'Kemarin, 14:10',
  },
  {
    key: '5',
    id: 'TRX-9817',
    customer: 'Fajar Nugraha',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fajar',
    amount: 'Rp 3.100.000',
    status: 'sukses',
    date: 'Kemarin, 11:05',
  },
];

const columns: ColumnsType<RecentTransaction> = [
  {
    title: 'ID Transaksi',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <Text strong>{text}</Text>,
  },
  {
    title: 'Pelanggan',
    dataIndex: 'customer',
    key: 'customer',
    render: (_, record) => (
      <Space>
        <Avatar src={record.avatar} size="small" />
        <Text>{record.customer}</Text>
      </Space>
    ),
  },
  {
    title: 'Jumlah',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount) => <Text style={{ color: '#1677ff', fontWeight: 600 }}>{amount}</Text>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: RecentTransaction['status']) => {
      const colorMap = {
        sukses: 'success',
        diproses: 'processing',
        tertunda: 'warning',
      };
      const textMap = {
        sukses: 'Sukses',
        diproses: 'Diproses',
        tertunda: 'Tertunda',
      };
      return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
    },
  },
  {
    title: 'Waktu',
    dataIndex: 'date',
    key: 'date',
    render: (date) => <Text type="secondary">{date}</Text>,
  },
];

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

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
              Selamat Datang Kembali, {user?.name || 'Administrator'}! 👋
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 14, marginTop: 8, display: 'block' }}>
              Berikut adalah ringkasan kinerja sistem hari ini. Semua layanan berjalan optimal dan terkoneksi aman.
            </Text>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Link href="/users">
                <Button icon={<PlusOutlined />} style={{ borderRadius: 6 }}>
                  Tambah Pengguna
                </Button>
              </Link>
              <Button type="primary" icon={<DownloadOutlined />} ghost style={{ borderRadius: 6 }}>
                Unduh Rekap
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title={<Text type="secondary">Total Pendapatan</Text>}
              value="Rp 128.5 Jt"
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
              title={<Text type="secondary">Pengguna Aktif</Text>}
              value={2420}
              prefix={<UsergroupAddOutlined style={{ color: '#1677ff' }} />}
              styles={{ content: { fontWeight: 700, fontSize: 24 } }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="processing" icon={<ArrowUpOutlined />}>
                +8.2%
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                pengguna baru minggu ini
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title={<Text type="secondary">Transaksi Selesai</Text>}
              value={1845}
              prefix={<ShoppingOutlined style={{ color: '#fa8c16' }} />}
              styles={{ content: { fontWeight: 700, fontSize: 24 } }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="warning" icon={<ArrowUpOutlined />}>
                +24.5%
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                konversi meningkat
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Statistic
              title={<Text type="secondary">Tingkat Kepuasan</Text>}
              value={98.6}
              precision={1}
              suffix="%"
              prefix={<RiseOutlined style={{ color: '#722ed1' }} />}
              styles={{ content: { fontWeight: 700, fontSize: 24 } }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="purple">Target 95%</Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                kinerja sangat baik
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content: Table & Right Column */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={<Title level={5} style={{ margin: 0 }}>Aktivitas Transaksi Terbaru</Title>}
            extra={
              <Button type="text" icon={<ReloadOutlined />} size="small">
                Segarkan
              </Button>
            }
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <Table
              dataSource={transactionData}
              columns={columns}
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
                <Progress type="dashboard" percent={78} strokeColor="#1677ff" size={160} />
                <div style={{ marginTop: 12 }}>
                  <Text strong style={{ fontSize: 15, display: 'block' }}>
                    Rp 780.000.000 / Rp 1.000.000.000
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Tersisa 42 hari menuju akhir kuartal
                  </Text>
                </div>
              </div>
            </Card>

            {/* Status Sistem */}
            <Card
              title={<Title level={5} style={{ margin: 0 }}>Status Infrastruktur</Title>}
              variant="borderless"
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <Space orientation="vertical" style={{ width: '100%' }} size={12}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Server App (Next.js)</Text>
                  <Badge status="processing" text="Online (99.98%)" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Cookie Auth & Middleware</Text>
                  <Badge status="success" text="Aman & Terenkripsi" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Zustand State Store</Text>
                  <Badge status="success" text="Tersinkronisasi" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Ant Design Component UI</Text>
                  <Badge status="processing" text="Aktif" />
                </div>
              </Space>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

