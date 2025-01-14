'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Space, Modal, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { listWorkflows, deleteWorkflow, executeWorkflow } from '@/services/workflow';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function WorkflowPage() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const data = await listWorkflows();
      setWorkflows(data);
    } catch (error) {
      message.error('获取工作流列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/workflow/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个工作流吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteWorkflow(id);
          message.success('删除成功');
          fetchWorkflows();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleExecute = async (id: string) => {
    try {
      await executeWorkflow(id);
      message.success('工作流开始执行');
    } catch (error) {
      message.error('执行失败');
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? '#52c41a' : '#999' }}>
          {isActive ? '已激活' : '未激活'}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<PlayCircleOutlined />}
            onClick={() => handleExecute(record.id)}
          >
            执行
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3}>工作流管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/workflow/create')}
        >
          创建工作流
        </Button>
      </Header>
      <Content style={{ margin: '24px', background: '#fff', padding: '24px' }}>
        <Table
          columns={columns}
          dataSource={workflows}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Content>
    </Layout>
  );
}
