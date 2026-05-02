import Link from 'next/link'
import { Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { loginAction } from '@/app/auth/actions'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <Link href="/" className="text-2xl font-semibold tracking-widest text-primary mb-8">
        靜途
      </Link>

      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-sm">
        <h1 className="text-xl font-semibold mb-1">歡迎回來</h1>
        <p className="text-sm text-muted-foreground mb-6">請使用您的帳號登入</p>
        <LoginForm />
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        業者入駐申請請至{' '}
        <Link href="/vendor/register" className="hover:underline text-primary">
          業者入駐
        </Link>
      </p>
    </div>
  )
}
