'use client';

import { Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Home() {
  return (
    <Header style={{ background: '#fff', padding: '0 24px' }}>
      <Title level={3}>Welcome to CloudSphere</Title>
    </Header>
  )
}
