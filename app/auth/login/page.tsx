'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'family' | 'vendor' | 'admin'>('family')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    if (role === 'vendor') router.push('/vendor')
    else if (role === 'admin') router.push('/admin')
    else router.push('/cases')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <Link href="/" className="text-2xl font-semibold tracking-widest text-primary mb-8">靜途</Link>

      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8">
        <h1 className="text-xl font-semibold mb-1">歡迎回來</h1>
        <p className="text-sm text-muted-foreground mb-6">請選擇您的身份並登入</p>

        {/* Role selector */}
        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl mb-6">
          {([['family', '家屬'], ['vendor', '業者'], ['admin', '管理員']] as const).map(([r, label]) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-all ${
                role === r ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">電子郵件</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">密碼</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground mt-2"
          >
            {loading ? '登入中…' : '登入'}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-4">
          還沒有帳號？{' '}
          <Link href="/auth/signup" className="text-accent hover:underline">
            立即註冊
          </Link>
        </p>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        業者入駐申請請至{' '}
        <Link href="/vendor/register" className="hover:underline">業者入駐</Link>
      </p>
    </div>
  )
}
