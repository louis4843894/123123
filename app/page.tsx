import Link from 'next/link'
import { ArrowRight, Shield, Clock, Users, Star, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getSettings } from '@/lib/db'
import { getApprovedVendors } from '@/lib/db'

const FEATURES = [
  {
    icon: Clock,
    title: '24小時緊急響應',
    description: '無論何時何地，我們的服務團隊與業者網絡隨時待命，在最需要的時刻第一時間提供協助。',
  },
  {
    icon: Users,
    title: '家庭共決空間',
    description: '邀請散居各地的家屬，透過線上投票與即時討論，共同做出每一個重要決定。',
  },
  {
    icon: Shield,
    title: '透明價格保障',
    description: '所有費用明細清晰呈現，分段付款機制確保服務品質，告別傳統殯葬業的不透明亂象。',
  },
  {
    icon: Star,
    title: '嚴格業者認證',
    description: '所有進駐業者均通過執照審查與服務評核，真實評論來自已服務家庭，品質有保障。',
  },
]

const STEPS = [
  { step: '01', title: '告訴我們您的情況', desc: '三種情境引導，系統自動推薦最適合的流程路徑。' },
  { step: '02', title: '建構您的方案', desc: '勾選需要的服務項目，即時看到費用，沒有隱藏收費。' },
  { step: '03', title: '比較業者，做出選擇', desc: '評價、價格、地區、宗教特性一目了然，放心選擇。' },
  { step: '04', title: '家人共同決定', desc: '邀請家屬加入，線上討論後共同確認方案。' },
]

export default async function HomePage() {
  const settings = getSettings()
  const vendors = getApprovedVendors()
  const stats = settings.stats

  const STATS = [
    { value: `${stats.totalCases}+`, label: '服務案件' },
    { value: String(vendors.length), label: '認證業者' },
    { value: '4.8', label: '平均評分' },
    { value: '24H', label: '全天候服務' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.88_0.04_145/0.12),_transparent_60%)]" />
          <div className="max-w-6xl mx-auto relative">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">
                靜途 · 陪伴您走完最後一程
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-balance text-foreground mb-6">
                讓告別，
                <br />
                充滿<span className="text-accent">尊嚴</span>與溫度
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 text-pretty max-w-lg">
                {settings.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-primary text-primary-foreground gap-2 text-base px-8">
                  <Link href="/guide">
                    立即開始引導
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-8">
                  <Link href="/vendors">瀏覽業者</Link>
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Shield size={14} className="text-accent" />
                <span>免費使用 · 無仲介費 · 24小時緊急服務</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary text-primary-foreground py-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-semibold mb-1">{s.value}</p>
                <p className="text-sm opacity-70">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Situation Guide CTA */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-widest text-muted-foreground uppercase mb-3 text-center">情境引導</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 text-balance">
              您現在的情況是？
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              我們根據不同情境，為您規劃最適合的下一步
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  type: 'emergency',
                  emoji: '🕯',
                  title: '緊急情況',
                  subtitle: '親人剛剛離世',
                  desc: '立即需要遺體接運、安置等緊急服務，24小時快速響應。',
                  color: 'border-stone-dark/30 bg-muted/50',
                  href: '/guide?type=emergency',
                },
                {
                  type: 'preplanning',
                  emoji: '📋',
                  title: '預立規劃',
                  subtitle: '為未來預做準備',
                  desc: '提前規劃身後事，讓家人未來少一份負擔，更多一份安心。',
                  color: 'border-accent/30 bg-accent/5',
                  href: '/guide?type=preplanning',
                },
                {
                  type: 'hasDirection',
                  emoji: '🗺',
                  title: '已有方向',
                  subtitle: '尋找特定業者或服務',
                  desc: '您已知道需要什麼，協助您快速比較、確認並完成委托。',
                  color: 'border-border bg-card',
                  href: '/guide?type=hasDirection',
                },
              ].map((item) => (
                <Link
                  key={item.type}
                  href={item.href}
                  className={`group rounded-xl border-2 p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${item.color}`}
                >
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{item.subtitle}</p>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex items-center gap-1 text-sm text-primary font-medium">
                    <span>開始引導</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4 bg-muted/40">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-widest text-muted-foreground uppercase mb-3 text-center">流程說明</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-balance">
              四個步驟，安心告別
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {STEPS.map((s, i) => (
                <div key={s.step} className="relative">
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-px bg-border z-0" />
                  )}
                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {s.step}
                    </div>
                    <h3 className="font-semibold text-base">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-widest text-muted-foreground uppercase mb-3 text-center">平台特色</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-balance">
              為什麼選擇靜途？
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-4 p-6 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <f.icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1.5">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial / Quote */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-6 opacity-30 font-serif">&ldquo;</div>
            <blockquote className="text-xl md:text-2xl leading-relaxed font-light mb-6 text-balance">
              那天凌晨三點，我不知道該怎麼辦。靜途的系統一步一步帶我找到方向，感覺背後有人支持著我。
            </blockquote>
            <cite className="text-sm opacity-70 not-italic">
              — 林先生，已服務家屬，2024年10月
            </cite>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-balance">
              準備好了嗎？我們陪著您
            </h2>
            <p className="text-muted-foreground mb-8">
              無論您現在身在哪裡，靜途24小時與您同在。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground gap-2 px-8">
                <Link href="/guide">
                  開始情境引導
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link href="/vendors">瀏覽業者列表</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
