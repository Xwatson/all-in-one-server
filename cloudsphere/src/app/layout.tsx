"use client";

import React from 'react';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout, Menu, Avatar, Dropdown, Button, message } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, ApartmentOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './globals.css';
import { ItemType } from 'antd/es/menu/interface';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Providers } from '@/components/providers';

const { Header, Sider, Content } = Layout;

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const userMenuItems: ItemType[] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      disabled: isLoading
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      disabled: isLoading
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: isLoading ? '退出中...' : '退出登录',
      disabled: isLoading
    },
  ];

  const handleMenuClick = async ({ key }: { key: string }) => {
    switch (key) {
      case 'logout':
        try {
          setIsLoading(true);
          message.loading('正在退出...', 0);

          await signOut({
            redirect: true,
            callbackUrl: '/auth/signin'
          });

          message.destroy(); // 清除之前的 loading 消息
          message.success('退出成功');
        } catch (error) {
          console.error('Logout error:', error);
          message.destroy();
          message.error('退出失败，请重试');
        } finally {
          setIsLoading(false);
        }
        break;
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
    }
  };

  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AntdRegistry>
          {/* 登陆和注册页面不需要布局 */}
          {pathname === '/auth/signin' || pathname === '/auth/signup' ? children : (
            <Providers>
              <Layout style={{ minHeight: '100vh' }}>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                  <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                  <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname || '/']}
                    items={[
                      {
                        key: '/',
                        icon: <HomeOutlined />,
                        label: '首页',
                      },
                      {
                        key: '/workflow',
                        icon: <ApartmentOutlined />,
                        label: '工作流',
                      },
                    ]}
                    onSelect={({ key }) => {
                      router.push(key)
                    }}
                  />
                </Sider>
                <Layout>
                  <Header style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      type="text"
                      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                      onClick={() => setCollapsed(!collapsed)}
                      style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    <div style={{ marginRight: 24 }}>
                      <Dropdown
                        menu={{
                          items: userMenuItems,
                          onClick: handleMenuClick
                        }}
                        placement="bottomRight"
                        arrow
                      >
                        <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
                      </Dropdown>
                    </div>
                  </Header>
                  <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff' }}>
                    {children}
                  </Content>
                </Layout>
              </Layout>
            </Providers>
          )}
        </AntdRegistry>
      </body>
    </html>
  );
}
