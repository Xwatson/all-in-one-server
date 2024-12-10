'use client'

import { useState } from 'react'
import { locales } from '@/i18n/locales'

type Locale = 'en' | 'zh'

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en')
  const t = locales[locale]

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <button
          onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          {locale === 'en' ? '中文' : 'English'}
        </button>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t.auth.title}</h2>
        <p className="mb-4">{t.auth.description}</p>
        <pre className="bg-gray-100 p-4 rounded">X-API-Key: your_api_key</pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t.endpoints.title}</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{t.endpoints.crawl.title}</h3>
          <p className="mb-4">{t.endpoints.crawl.description}</p>

          <div className="space-y-8">
            <div>
              <h4 className="font-semibold mb-2">{t.endpoints.crawl.examples.basic.title}</h4>
              <p className="mb-2 text-gray-600">{t.endpoints.crawl.examples.basic.description}</p>
              <pre className="bg-gray-100 p-4 rounded mb-4">
                {`curl -X POST http://localhost:3001/api/crawl \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{
    "url": "https://example.com",
    "selector": "p"
  }'`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">{t.endpoints.crawl.examples.wait.title}</h4>
              <p className="mb-2 text-gray-600">{t.endpoints.crawl.examples.wait.description}</p>
              <pre className="bg-gray-100 p-4 rounded mb-4">
                {`curl -X POST http://localhost:3001/api/crawl \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{
    "url": "https://example.com",
    "waitFor": "p",
    "selector": "p"
  }'`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">{t.endpoints.crawl.examples.evaluate.title}</h4>
              <p className="mb-2 text-gray-600">{t.endpoints.crawl.examples.evaluate.description}</p>
              <pre className="bg-gray-100 p-4 rounded mb-4">
                {`curl -X POST http://localhost:3001/api/crawl \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{
    "url": "https://example.com",
    "evaluate": "() => document.title"
  }'`}
              </pre>
            </div>
          </div>

          <h4 className="font-semibold mt-6 mb-2">{t.endpoints.crawl.params.title}</h4>
          <pre className="bg-gray-100 p-4 rounded mb-4">
            {`{
  "url": "string",          // ${t.endpoints.crawl.params.url}
  "selector": "string",     // ${t.endpoints.crawl.params.selector}
  "waitFor": "string",      // ${t.endpoints.crawl.params.waitFor}
  "timeout": number,        // ${t.endpoints.crawl.params.timeout}
  "evaluate": "string"      // ${t.endpoints.crawl.params.evaluate}
}`}
          </pre>

          <h4 className="font-semibold mb-2">{t.endpoints.crawl.response.title}</h4>
          <pre className="bg-gray-100 p-4 rounded">
            {`{
  "success": true,
  "data": [...]            // ${t.endpoints.crawl.response.data}
}`}
          </pre>
        </div>
      </section>
    </main>
  )
}
