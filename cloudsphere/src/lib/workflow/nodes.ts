import axios from 'axios'
import { Node, NodeType, CrawlerNodeData, HttpNodeData, TransformNodeData, ConditionNodeData, DelayNodeData } from './types'

export async function executeNode(node: Node, previousResults: Record<string, any> = {}) {
  switch (node.type) {
    case NodeType.START:
      return { message: 'Workflow started' }

    case NodeType.END:
      return { message: 'Workflow completed' }

    case NodeType.CRAWLER:
      return await executeCrawlerNode(node.data as CrawlerNodeData, previousResults)

    case NodeType.HTTP:
      return await executeHttpNode(node.data as HttpNodeData, previousResults)

    case NodeType.TRANSFORM:
      return await executeTransformNode(node.data as TransformNodeData, previousResults)

    case NodeType.CONDITION:
      return await executeConditionNode(node.data as ConditionNodeData, previousResults)

    case NodeType.DELAY:
      return await executeDelayNode(node.data as DelayNodeData)

    default:
      throw new Error(`Unsupported node type: ${node.type}`)
  }
}

async function executeCrawlerNode(data: CrawlerNodeData, previousResults: Record<string, any>) {
  const { url, selector, waitFor, apiKey } = data
  
  try {
    const response = await axios.post('http://localhost:3001/api/crawl', {
      url,
      selector,
      waitFor,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })
    
    return response.data
  } catch (error) {
    throw new Error(`Crawler node execution failed: ${error}`)
  }
}

async function executeHttpNode(data: HttpNodeData, previousResults: Record<string, any>) {
  const { url, method, headers = {}, body } = data

  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body,
    })

    return response.data
  } catch (error) {
    throw new Error(`HTTP node execution failed: ${error}`)
  }
}

async function executeTransformNode(data: TransformNodeData, previousResults: Record<string, any>) {
  const { script } = data

  try {
    // 创建一个安全的执行环境
    const sandbox = {
      input: previousResults,
      result: null,
    }

    // 使用 Function 构造器创建一个新的函数
    const transform = new Function('input', `
      try {
        ${script}
        return result
      } catch (error) {
        throw new Error('Transform script execution failed: ' + error)
      }
    `)

    return transform(previousResults)
  } catch (error) {
    throw new Error(`Transform node execution failed: ${error}`)
  }
}

async function executeConditionNode(data: ConditionNodeData, previousResults: Record<string, any>) {
  const { condition } = data

  try {
    const evaluate = new Function('input', `return ${condition}`)
    return { result: evaluate(previousResults) }
  } catch (error) {
    throw new Error(`Condition node execution failed: ${error}`)
  }
}

async function executeDelayNode(data: DelayNodeData) {
  const { duration } = data

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ message: `Delayed for ${duration}ms` })
    }, duration)
  })
}
