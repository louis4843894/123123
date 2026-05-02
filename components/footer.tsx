import Link from 'next/link'

interface FooterProps {
  phone?: string
}

export function Footer({ phone = '0800-123-456' }: FooterProps) {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-2xl font-semibold tracking-widest mb-3">靜途</p>
            <p className="text-sm opacity-75 leading-relaxed max-w-xs">
              以溫柔相伴，陪您走過人生最後一段旅程。<br />
              24小時諮詢專線，讓您不孤單。
            </p>
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 mt-4 text-sm opacity-90 hover:opacity-100"
            >
              <span>免付費專線</span>
              <span className="font-semibold">{phone}</span>
            </a>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">服務</p>
            <ul className="flex flex-col gap-2 text-sm opacity-75">
              {[
                ['情境引導', '/guide'],
                ['方案規劃', '/plan'],
                ['業者比較', '/vendors'],
                ['家庭共決', '/family'],
                ['案件追蹤', '/cases'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:opacity-100 transition-opacity">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest opacity-50 mb-3">平台</p>
            <ul className="flex flex-col gap-2 text-sm opacity-75">
              {[
                ['殯葬知識庫', '/knowledge'],
                ['業者入駐', '/vendor/register'],
                ['業者後台', '/vendor'],
                ['管理後台', '/admin'],
                ['關於靜途', '/about'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:opacity-100 transition-opacity">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-50">
          <p>© {new Date().getFullYear()} 靜途科技股份有限公司. 保留所有權利。</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:opacity-100">隱私政策</Link>
            <Link href="/terms" className="hover:opacity-100">服務條款</Link>
            <Link href="/legal" className="hover:opacity-100">法律聲明</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
