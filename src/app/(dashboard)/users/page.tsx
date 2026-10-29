'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
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
} from 'antd';
import {
  UserAddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  status: 'aktif' | 'nonaktif';
  avatar: string;
  createdAt: string;
}

const initialUsers: UserItem[] = [
  {
    id: 'usr_1',
    name: 'Ahmad Habib',
    email: 'admin@example.com',
    role: 'admin',
    status: 'aktif',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    createdAt: '10 Jan 2025',
  },
  {
    id: 'usr_2',
    name: 'Siti Nurhaliza',
    email: 'staff@example.com',
    role: 'staff',
    status: 'aktif',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    createdAt: '15 Feb 2025',
  },
  {
    id: 'usr_3',
    name: 'Dimas Anggara',
    email: 'dimas@example.com',
    role: 'user',
    status: 'aktif',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dimas',
    createdAt: '01 Mar 2025',
  },
  {
    id: 'usr_4',
    name: 'Rina Kusuma',
    email: 'rina@example.com',
    role: 'user',
    status: 'nonaktif',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
    createdAt: '12 Apr 2025',
  },
  {
    id: 'usr_5',
    name: 'Bayu Prakoso',
    email: 'bayu@example.com',
    role: 'staff',
    status: 'aktif',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bayu',
    createdAt: '22 Mei 2025',
  },
];

export default function UsersPage() {
  const { message } = App.useApp();
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  const [form] = Form.useForm();

  const handleOpenAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserItem) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id: string) => {
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
        const newUser: UserItem = {
          id: `usr_${Date.now()}`,
          name: values.name,
          email: values.email,
          role: values.role,
          status: values.status || 'aktif',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(values.name)}`,
          createdAt: 'Hari ini',
        };
        setUsers((prev) => [newUser, ...prev]);
        message.success('Pengguna baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
    } catch {
      // form validation failed
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns: ColumnsType<UserItem> = [
    {
      title: 'Pengguna',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space size={12}>
          <Avatar src={record.avatar} size="large" />
          <div>
            <Text strong style={{ display: 'block' }}>
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Peran (Role)',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserItem['role']) => {
        const colorMap = {
          admin: 'blue',
          staff: 'cyan',
          user: 'default',
        };
        return <Tag color={colorMap[role]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserItem['status']) => (
        <Tag color={status === 'aktif' ? 'success' : 'error'}>
          {status === 'aktif' ? 'Aktif' : 'Nonaktif'}
        </Tag>
      ),
    },
    {
      title: 'Bergabung Pada',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text type="secondary">{date}</Text>,
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
            description={`Apakah yakin ingin menghapus ${record.name}?`}
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
            Manajemen Pengguna
          </Title>
          <Text type="secondary">
            Kelola akses, peran, dan daftar pengguna yang terdaftar di dalam platform.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          style={{ borderRadius: 8 }}
          onClick={handleOpenAddModal}
        >
          Tambah Pengguna
        </Button>
      </div>

      {/* Filter and Table Card */}
      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Cari nama atau email..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">Semua Peran (Role)</Option>
              <Option value="admin">Administrator</Option>
              <Option value="staff">Staff</Option>
              <Option value="user">User Biasa</Option>
            </Select>
          </Col>
        </Row>

        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
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
        okText={editingUser ? 'Simpan Perubahan' : 'Tambah'}
        cancelText="Batal"
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          name="userModalForm"
          initialValues={{ role: 'user', status: 'aktif' }}
        >
          <Form.Item
            name="name"
            label="Nama Lengkap"
            rules={[{ required: true, message: 'Harap masukkan nama!' }]}
          >
            <Input placeholder="Contoh: Ahmad Habib" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Harap masukkan email!' },
              { type: 'email', message: 'Format email tidak valid!' },
            ]}
          >
            <Input placeholder="Contoh: habib@example.com" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Peran (Role)"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="admin">Administrator</Option>
                  <Option value="staff">Staff</Option>
                  <Option value="user">User</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="aktif">Aktif</Option>
                  <Option value="nonaktif">Nonaktif</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

