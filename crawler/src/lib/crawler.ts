import { chromium } from 'playwright'

export interface CrawlerOptions {
  url: string
  selector?: string
  waitFor?: string
  timeout?: number
  evaluate?: string // 自定义的JavaScript代码
}

export class Crawler {
  async crawl(options: CrawlerOptions) {
    const browser = await chromium.launch()
    try {
      const page = await browser.newPage()

      // 设置超时
      page.setDefaultTimeout(options.timeout || 30000)

      // 访问页面
      await page.goto(options.url)

      // 等待指定元素
      if (options.waitFor) {
        await page.waitForSelector(options.waitFor)
      }

      let result: any

      // 如果提供了自定义的evaluate代码
      if (options.evaluate) {
        result = await page.evaluate(options.evaluate)
      }
      // 如果提供了选择器
      else if (options.selector) {
        const elements = await page.$$(options.selector)
        result = await Promise.all(elements.map(element => element.textContent()))
      }
      // 否则返回整个页面内容
      else {
        result = await page.content()
      }

      return { success: true, data: result }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    } finally {
      await browser.close()
    }
  }
}
