import React from 'react'
import { Form, Input, Select } from 'antd'
import { NodeType } from '@/lib/workflow/types'

interface NodeConfigProps {
  type: NodeType
}

export const NodeConfig: React.FC<NodeConfigProps> = ({ type }) => {
  const renderConfig = () => {
    switch (type) {
      case NodeType.CRAWLER:
        return (
          <>
            <Form.Item
              name={['config', 'url']}
              label="URL"
              rules={[{ required: true, type: 'url' }]}
            >
              <Input placeholder="请输入要爬取的URL" />
            </Form.Item>
            <Form.Item name={['config', 'selector']} label="选择器" rules={[{ required: true }]}>
              <Input placeholder="请输入CSS选择器" />
            </Form.Item>
            <Form.Item name={['config', 'waitFor']} label="等待元素">
              <Input placeholder="请输入等待出现的元素选择器" />
            </Form.Item>
            <Form.Item name={['config', 'apiKey']} label="API密钥" rules={[{ required: true }]}>
              <Input.Password placeholder="请输入API密钥" />
            </Form.Item>
          </>
        )

      case NodeType.HTTP:
        return (
          <>
            <Form.Item
              name={['config', 'url']}
              label="URL"
              rules={[{ required: true, type: 'url' }]}
            >
              <Input placeholder="请输入请求URL" />
            </Form.Item>
            <Form.Item name={['config', 'method']} label="请求方法" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="GET">GET</Select.Option>
                <Select.Option value="POST">POST</Select.Option>
                <Select.Option value="PUT">PUT</Select.Option>
                <Select.Option value="DELETE">DELETE</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name={['config', 'headers']} label="请求头">
              <Input.TextArea placeholder="请输入请求头 (JSON格式)" />
            </Form.Item>
            <Form.Item name={['config', 'body']} label="请求体">
              <Input.TextArea placeholder="请输入请求体 (JSON格式)" />
            </Form.Item>
          </>
        )

      case NodeType.TRANSFORM:
        return (
          <Form.Item name={['config', 'script']} label="转换脚本" rules={[{ required: true }]}>
            <Input.TextArea
              placeholder="请输入JavaScript转换脚本"
              autoSize={{ minRows: 4, maxRows: 10 }}
            />
          </Form.Item>
        )

      case NodeType.CONDITION:
        return (
          <Form.Item name={['config', 'condition']} label="条件表达式" rules={[{ required: true }]}>
            <Input.TextArea
              placeholder="请输入JavaScript条件表达式"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        )

      case NodeType.DELAY:
        return (
          <Form.Item
            name={['config', 'duration']}
            label="延迟时间(毫秒)"
            rules={[{ required: true, type: 'number', min: 0 }]}
          >
            <Input type="number" placeholder="请输入延迟时间" />
          </Form.Item>
        )

      default:
        return null
    }
  }

  return renderConfig()
}
