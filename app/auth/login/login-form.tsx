'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { loginAction } from '@/app/auth/actions'

export function LoginForm() {
  const [showPw, setShowPw] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
    // On success, server action redirects — no need to handle
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="text-xs text-muted-foreground block mb-1.5">
          電子郵件
        </label>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="text-xs text-muted-foreground block mb-1.5">
          密碼
        </label>
        <div className="relative">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="password"
            name="password"
            type={showPw ? 'text' : 'password'}
            required
            placeholder="••••••••"
            className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-label={showPw ? '隱藏密碼' : '顯示密碼'}
          >
            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      <div className="bg-muted/60 rounded-lg px-4 py-3 text-xs text-muted-foreground mt-1">
        <p className="font-medium text-foreground mb-1">測試帳號</p>
        <p>管理員：admin@jingtv.com / admin123</p>
        <p>業者：vendor@jingtv.com / vendor123</p>
        <p>家屬：family@jingtv.com / family123</p>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-primary-foreground mt-1"
      >
        {pending ? '登入中…' : '登入'}
      </Button>
    </form>
  )
}
