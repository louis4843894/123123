'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [open, setOpen] = useState(false)

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
          <Link href="/guide" className="text-muted-foreground hover:text-foreground transition-colors">情境引導</Link>
          <Link href="/plan" className="text-muted-foreground hover:text-foreground transition-colors">方案規劃</Link>
          <Link href="/vendors" className="text-muted-foreground hover:text-foreground transition-colors">業者比較</Link>
          <Link href="/family" className="text-muted-foreground hover:text-foreground transition-colors">家庭共決</Link>
          <Link href="/cases" className="text-muted-foreground hover:text-foreground transition-colors">案件追蹤</Link>
          <Link href="/knowledge" className="text-muted-foreground hover:text-foreground transition-colors">知識庫</Link>
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:0800-123-456" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Phone size={14} />
            <span>0800-123-456</span>
          </a>
          <Button asChild size="sm" variant="outline" className="text-xs">
            <Link href="/auth/login">登入</Link>
          </Button>
          <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
            <Link href="/vendor">業者後台</Link>
          </Button>
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
          {[
            ['情境引導', '/guide'],
            ['方案規劃', '/plan'],
            ['業者比較', '/vendors'],
            ['家庭共決', '/family'],
            ['案件追蹤', '/cases'],
            ['知識庫', '/knowledge'],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="py-2 border-b border-border last:border-0 text-muted-foreground hover:text-foreground"
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
              <Link href="/auth/login">登入</Link>
            </Button>
            <Button asChild size="sm" className="flex-1 text-xs">
              <Link href="/vendor">業者後台</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
