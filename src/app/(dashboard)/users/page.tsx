'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Tag,
  Space,
  Modal,
  Form,
  Avatar,
  Typography,
  Popconfirm,
  Row,
  Col,
  App,
  Alert,
} from 'antd';
import {
  UserAddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { usersApi, DummyUserItem } from '@/services/api/users/usersApi';
import axios from 'axios';

const { Title, Text } = Typography;

export default function UsersPage() {
  const { message } = App.useApp();
  const [users, setUsers] = useState<DummyUserItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DummyUserItem | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = async (query = '') => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // Hit endpoint dummyjson.com/users menggunakan usersApi (Axios)
      const data = query.trim()
        ? await usersApi.searchUsers(query)
        : await usersApi.getUsers(8, 0);

      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.log('🛑 Request usersApi dibatalkan karena ganti page');
        return;
      }
      console.error('Error fetching users:', err);
      setErrorMsg('Gagal memuat pengguna dari DummyJSON.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchText);
  }, []);

  const handleSearch = () => {
    fetchUsers(searchText);
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: DummyUserItem) => {
    setEditingUser(user);
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    message.success('Pengguna berhasil dihapus');
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u))
        );
        message.success('Data pengguna berhasil diperbarui');
      } else {
        const newUser: DummyUserItem = {
          id: Date.now(),
          firstName: values.firstName,
          lastName: values.lastName,
          username: `${values.firstName.toLowerCase()}_${Date.now().toString().slice(-4)}`,
          email: values.email,
          phone: values.phone || '-',
          gender: 'other',
          age: 28,
          role: 'admin',
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(values.firstName)}`,
          company: {
            name: 'DummyJSON Corp',
            title: 'Developer',
            department: 'Engineering',
          },
        };
        setUsers((prev) => [newUser, ...prev]);
        message.success('Pengguna baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
    } catch {
      // form validation failed
    }
  };

  const columns: ColumnsType<DummyUserItem> = [
    {
      title: 'Pengguna DummyJSON',
      dataIndex: 'firstName',
      key: 'name',
      render: (_, record) => (
        <Space size={12}>
          <Avatar src={record.image} size="large" />
          <div>
            <Text strong style={{ display: 'block' }}>
              {record.firstName} {record.lastName}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              @{record.username}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Kontak',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MailOutlined style={{ color: '#1677ff', fontSize: 12 }} />
            <Text style={{ fontSize: 13 }}>{record.email}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <PhoneOutlined style={{ color: '#52c41a', fontSize: 12 }} />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.phone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Perusahaan & Posisi',
      key: 'company',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: 13, display: 'block' }}>{record.company?.name || 'DummyJSON Org'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.company?.title || record.role || 'Member'}</Text>
        </div>
      ),
    },
    {
      title: 'Peran',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color="blue">{(role || 'USER').toUpperCase()}</Tag>,
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#1677ff' }} />}
            onClick={() => handleOpenEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Hapus Pengguna"
            description={`Apakah yakin ingin menghapus ${record.firstName}?`}
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Ya, Hapus"
            cancelText="Batal"
            okType="danger"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Manajemen Pengguna (DummyJSON API)
          </Title>
          <Text type="secondary">
            Daftar pengguna live yang diambil menggunakan konfigurasi khusus <code>usersApi.ts</code> via Axios.
          </Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchUsers(searchText)}
            loading={loading}
          >
            Segarkan
          </Button>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            style={{ borderRadius: 8 }}
            onClick={handleOpenAddModal}
          >
            Tambah Pengguna
          </Button>
        </Space>
      </div>

      {errorMsg && <Alert message={errorMsg} type="error" showIcon closable />}

      {/* Filter and Table Card */}
      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={16} md={10}>
            <Input.Search
              placeholder="Cari pengguna di DummyJSON..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              enterButton="Cari"
              allowClear
              loading={loading}
            />
          </Col>
        </Row>

        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 700 }}
        />
      </Card>

      {/* Modal Tambah / Edit Pengguna */}
      <Modal
        title={editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
        open={isModalOpen}
        onOk={handleFormSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={editingUser ? 'Simpan' : 'Tambah'}
        cancelText="Batal"
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          name="userModalForm"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="Nama Depan"
                rules={[{ required: true, message: 'Harap masukkan nama depan!' }]}
              >
                <Input placeholder="Contoh: Emily" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Nama Belakang"
                rules={[{ required: true, message: 'Harap masukkan nama belakang!' }]}
              >
                <Input placeholder="Contoh: Johnson" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Harap masukkan email!' },
              { type: 'email', message: 'Format email tidak valid!' },
            ]}
          >
            <Input placeholder="Contoh: emily@dummyjson.com" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Nomor Telepon"
          >
            <Input placeholder="Contoh: +1 812-421-1234" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
