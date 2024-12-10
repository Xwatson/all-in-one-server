import { NextRequest } from 'next/server'
import { Crawler } from '@/lib/crawler'
import { z } from 'zod'

// 请求体验证schema
const crawlSchema = z.object({
  url: z.string().url(),
  selector: z.string().optional(),
  waitFor: z.string().optional(),
  timeout: z.number().min(1000).max(60000).optional(),
  evaluate: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求体
    const validatedData = crawlSchema.parse(body)

    // 创建爬虫实例并执行爬取
    const crawler = new Crawler()
    const result = await crawler.crawl(validatedData)

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 400 })
    }

    return Response.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 })
    }
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
