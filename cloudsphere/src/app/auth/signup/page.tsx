import { AuthForm } from '@/components/auth/AuthForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function SignUpPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/workflow')
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <AuthForm mode="signup" />
    </div>
  )
}
