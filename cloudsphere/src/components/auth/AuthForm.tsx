"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, Form, Input, Button, Typography } from 'antd'
import { message } from 'antd'

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
    <Card style={{ width: 350 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={4}>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</Title>
        <Text type="secondary">
          {mode === 'signin'
            ? 'Enter your email below to sign in to your account'
            : 'Enter your email below to create your account'}
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
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="m@example.com" type='email' />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
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
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
