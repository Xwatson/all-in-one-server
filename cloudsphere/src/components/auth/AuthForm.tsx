"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, Form, Input, Button, Typography } from 'antd'
import { message } from 'antd'
import Link from 'next/link'

const { Title, Text } = Typography

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()

  async function onSubmit(values: { email: string; password: string }) {
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })

        if (!res.ok) {
          throw new Error(await res.text())
        }

        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        })

        if (result?.error) {
          message.error(result.error)
          return
        }

        router.replace('/')
      } else {
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        })

        if (result?.error) {
          message.error(result.error)
          return
        }

        router.replace('/')
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card style={{ width: 350 }} hoverable>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={4}>{mode === 'signin' ? '登录' : '注册'}</Title>
        <Text type="secondary">
          {mode === 'signin'
            ? '输入你的邮箱以登录到你的帐户'
            : '输入你的邮箱以创建你的帐户'}
        </Text>
      </div>
      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '请输入有效的邮箱!' }
          ]}
        >
          <Input placeholder="m@example.com" type='email' />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
          >
            {mode === 'signin' ? '登录' : '注册'}
          </Button>
        </Form.Item>
        <Form.Item>
          {
            mode === 'signin'
              ? <Text>没有帐户？<Link href="/auth/signup">现在注册</Link></Text>
              : <Text>已有帐户？<Link href="/auth/signin">立即登录</Link></Text>
          }
        </Form.Item>
      </Form>
    </Card>
  )
}
