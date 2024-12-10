export const locales = {
  en: {
    title: 'Crawler API Documentation',
    auth: {
      title: 'Authentication',
      description: 'All API requests require an API key to be sent in the header:',
    },
    endpoints: {
      title: 'Endpoints',
      crawl: {
        title: 'POST /api/crawl',
        description: 'Crawl a webpage and extract content.',
        examples: {
          basic: {
            title: '1. Basic Usage - Extract by CSS Selector',
            description: 'Extract content using a CSS selector:',
          },
          wait: {
            title: '2. Wait for Element',
            description: 'Wait for a specific element to appear before extracting content:',
          },
          evaluate: {
            title: '3. Custom JavaScript Evaluation',
            description: 'Execute custom JavaScript code on the page:',
          },
        },
        params: {
          title: 'Request Parameters:',
          url: 'Required: Target URL to crawl',
          selector: 'Optional: CSS selector to extract content',
          waitFor: 'Optional: CSS selector to wait for',
          timeout: 'Optional: Timeout in ms (default: 30000)',
          evaluate: 'Optional: Custom JavaScript code to evaluate',
        },
        response: {
          title: 'Response Format:',
          data: 'Extracted content or evaluation result',
        },
      },
    },
  },
  zh: {
    title: '爬虫 API 文档',
    auth: {
      title: '认证',
      description: '所有 API 请求都需要在请求头中包含 API 密钥：',
    },
    endpoints: {
      title: '接口列表',
      crawl: {
        title: 'POST /api/crawl',
        description: '爬取网页并提取内容。',
        examples: {
          basic: {
            title: '1. 基本用法 - 使用 CSS 选择器提取',
            description: '使用 CSS 选择器提取内容：',
          },
          wait: {
            title: '2. 等待元素',
            description: '等待特定元素出现后再提取内容：',
          },
          evaluate: {
            title: '3. 自定义 JavaScript 执行',
            description: '在页面上执行自定义 JavaScript 代码：',
          },
        },
        params: {
          title: '请求参数：',
          url: '必填：目标爬取 URL',
          selector: '可选：CSS 选择器',
          waitFor: '可选：等待出现的元素选择器',
          timeout: '可选：超时时间（毫秒，默认 30000）',
          evaluate: '可选：自定义 JavaScript 代码',
        },
        response: {
          title: '响应格式：',
          data: '提取的内容或执行结果',
        },
      },
    },
  },
}
