'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone, LogOut, LayoutDashboard, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Session } from '@/lib/auth'
import { logoutAction } from '@/app/auth/actions'

const NAV_LINKS = [
  ['情境引導', '/guide'],
  ['方案規劃', '/plan'],
  ['業者比較', '/vendors'],
  ['家庭共決', '/family'],
  ['案件追蹤', '/cases'],
  ['知識庫', '/knowledge'],
] as const

// Pages that require login
const AUTH_REQUIRED = ['/plan', '/family', '/cases']

interface Props {
  session: Session | null
  phone: string
}

export function NavbarClient({ session, phone }: Props) {
  const [open, setOpen] = useState(false)

  function NavLink({ href, label }: { href: string; label: string }) {
    const requiresAuth = AUTH_REQUIRED.some(r => href.startsWith(r))
    if (requiresAuth && !session) {
      return (
        <Link
          href={`/auth/login?redirect=${href}`}
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          title="需要登入"
          onClick={() => setOpen(false)}
        >
          {label}
          <span className="text-xs text-muted-foreground/60">(登入)</span>
        </Link>
      )
    }
    return (
      <Link
        href={href}
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setOpen(false)}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-widest text-primary">靜途</span>
          <span className="text-xs text-muted-foreground hidden sm:inline-block mt-1">JÌNG TÚ</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map(([label, href]) => (
            <NavLink key={href} href={href} label={label} />
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone size={14} />
            <span>{phone}</span>
          </a>

          {session ? (
            <div className="flex items-center gap-2">
              {session.role === 'admin' && (
                <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
                  <Link href="/admin">
                    <LayoutDashboard size={13} />
                    後台
                  </Link>
                </Button>
              )}
              {session.role === 'vendor' && (
                <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
                  <Link href="/vendor">
                    <LayoutDashboard size={13} />
                    業者後台
                  </Link>
                </Button>
              )}
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                  {session.name[0]}
                </div>
                <span className="text-sm text-foreground hidden lg:inline">{session.name}</span>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  title="登出"
                >
                  <LogOut size={14} />
                </button>
              </form>
            </div>
          ) : (
            <>
              <Button asChild size="sm" variant="outline" className="text-xs">
                <Link href="/auth/login">登入</Link>
              </Button>
              <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
                <Link href="/vendor/register">業者入駐</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setOpen(!open)}
          aria-label="開啟選單"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 flex flex-col gap-3 text-sm">
          {NAV_LINKS.map(([label, href]) => (
            <NavLink key={href} href={href} label={label} />
          ))}
          <div className="flex gap-2 pt-2 border-t border-border">
            {session ? (
              <>
                <div className="flex-1 flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                    {session.name[0]}
                  </div>
                  <span>{session.name}</span>
                </div>
                <form action={logoutAction}>
                  <Button size="sm" variant="outline" type="submit" className="text-xs gap-1">
                    <LogOut size={12} />
                    登出
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
                  <Link href="/auth/login" onClick={() => setOpen(false)}>登入</Link>
                </Button>
                <Button asChild size="sm" className="flex-1 text-xs bg-primary text-primary-foreground">
                  <Link href="/vendor/register" onClick={() => setOpen(false)}>業者入駐</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
