'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShieldCheck, DollarSign, BookOpen,
  Users, BarChart3, Settings, LogOut, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: '總覽儀表板' },
  { href: '/admin/vendors', icon: ShieldCheck, label: '業者審核' },
  { href: '/admin/finance', icon: DollarSign, label: '平台帳務' },
  { href: '/admin/content', icon: BookOpen, label: '內容管理' },
  { href: '/admin/users', icon: Users, label: '帳號權限 (RBAC)' },
  { href: '/admin/analytics', icon: BarChart3, label: '數據分析' },
  { href: '/admin/settings', icon: Settings, label: '系統設定' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-foreground text-background flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="px-5 h-16 flex items-center justify-between border-b border-white/10 shrink-0">
          <div>
            <p className="text-lg font-semibold tracking-widest">靜途</p>
            <p className="text-xs opacity-50">Super Admin</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden opacity-70">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-white/15 text-white font-medium'
                    : 'opacity-60 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm opacity-60 hover:opacity-100 hover:bg-white/10 transition-colors"
          >
            <LogOut size={16} />
            回到首頁
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-background border-b border-border flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
              管
            </div>
            <span className="text-sm font-medium hidden sm:inline">平台管理員</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
