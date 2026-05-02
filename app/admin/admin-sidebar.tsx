'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShieldCheck, DollarSign, BookOpen,
  Users, BarChart3, Settings, LogOut, Menu, X, Home
} from 'lucide-react'
import { useState } from 'react'
import { logoutAction } from '@/app/auth/actions'

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: '總覽儀表板' },
  { href: '/admin/vendors', icon: ShieldCheck, label: '業者審核' },
  { href: '/admin/finance', icon: DollarSign, label: '平台帳務' },
  { href: '/admin/content', icon: BookOpen, label: '內容管理' },
  { href: '/admin/users', icon: Users, label: '帳號權限' },
  { href: '/admin/analytics', icon: BarChart3, label: '數據分析' },
  { href: '/admin/settings', icon: Settings, label: '系統設定' },
]

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-200
          bg-primary text-primary-foreground
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}
      >
        <div className="px-5 h-16 flex items-center justify-between border-b border-primary-foreground/15 shrink-0">
          <div>
            <p className="text-lg font-semibold tracking-widest">靜途</p>
            <p className="text-xs opacity-50">Super Admin</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden opacity-70" aria-label="關閉選單">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-primary-foreground/15 text-primary-foreground font-medium'
                    : 'opacity-60 hover:opacity-100 hover:bg-primary-foreground/10'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-primary-foreground/15 flex flex-col gap-1">
          {/* Admin user */}
          <div className="flex items-center gap-3 px-3 py-2.5 text-sm opacity-80">
            <div className="w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-semibold">
              {adminName[0]}
            </div>
            <span className="truncate">{adminName}</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm opacity-60 hover:opacity-100 hover:bg-primary-foreground/10 transition-colors"
          >
            <Home size={16} />
            回到首頁
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm opacity-60 hover:opacity-100 hover:bg-primary-foreground/10 transition-colors text-left"
            >
              <LogOut size={16} />
              登出
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-30 h-14 bg-primary text-primary-foreground flex items-center px-4 gap-4 lg:hidden">
        <button onClick={() => setSidebarOpen(true)} aria-label="開啟選單">
          <Menu size={20} />
        </button>
        <span className="font-semibold tracking-widest">靜途 後台</span>
      </div>
      {/* Spacer for mobile */}
      <div className="h-14 lg:hidden" />
    </>
  )
}
