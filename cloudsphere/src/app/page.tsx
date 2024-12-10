import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1>CloudSphere</h1>
      <ul>
        <li><Link href="/workflow">Workflow</Link></li>
      </ul>
    </div>
  )
}
