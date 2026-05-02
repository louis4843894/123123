import Link from 'next/link'
import { BookOpen, ChevronRight, Clock } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const ARTICLES = [
  {
    id: 'a1',
    category: '流程指引',
    title: '台灣殯葬流程完整說明：從往生到安葬',
    excerpt: '詳細說明台灣現行殯葬法規下的完整流程，包含死亡證明申請、除籍、火化許可等步驟。',
    readTime: '8 分鐘',
    updatedAt: '2024-11-01',
  },
  {
    id: 'a2',
    category: '法規知識',
    title: '死亡證明書：如何申請？需要什麼文件？',
    excerpt: '詳解醫院死亡、居家死亡、意外死亡三種情況下取得死亡證明書的方式與注意事項。',
    readTime: '5 分鐘',
    updatedAt: '2024-10-15',
  },
  {
    id: 'a3',
    category: '環保葬',
    title: '樹葬、海葬、花葬：環保葬的選擇與申請',
    excerpt: '越來越多家庭選擇環保葬，本文說明各種環保葬的方式、費用、申請程序及適合對象。',
    readTime: '6 分鐘',
    updatedAt: '2024-09-20',
  },
  {
    id: 'a4',
    category: '殯葬費用',
    title: '台灣殯葬費用完整解析：各項目收費標準',
    excerpt: '從遺體接運到安葬，各服務項目的合理費用範圍，教您避免被漫天開價。',
    readTime: '7 分鐘',
    updatedAt: '2024-11-10',
  },
  {
    id: 'a5',
    category: '宗教儀式',
    title: '佛教告別式流程與注意事項',
    excerpt: '介紹佛教告別式的完整儀式流程、家屬應注意的禁忌與準備事項。',
    readTime: '5 分鐘',
    updatedAt: '2024-08-30',
  },
  {
    id: 'a6',
    category: '宗教儀式',
    title: '基督教安息禮拜：流程與習俗',
    excerpt: '說明基督教（含天主教）安息禮拜的儀式流程、詩歌選擇及與傳統告別式的差異。',
    readTime: '4 分鐘',
    updatedAt: '2024-09-05',
  },
  {
    id: 'a7',
    category: '遺產規劃',
    title: '預立遺囑：台灣法律下的注意事項',
    excerpt: '自書遺囑、公證遺囑、密封遺囑的差異，以及何種情況下遺囑可能無效。',
    readTime: '9 分鐘',
    updatedAt: '2024-10-01',
  },
  {
    id: 'a8',
    category: '心理支持',
    title: '家屬如何走過悲傷？心理師的建議',
    excerpt: '喪親後的悲傷歷程是正常的，心理師提供實用建議，協助家屬在哀悼中找到療癒之路。',
    readTime: '6 分鐘',
    updatedAt: '2024-11-15',
  },
]

const CATEGORIES = [...new Set(ARTICLES.map(a => a.category))]

const FAQ = [
  {
    q: '遺體在醫院可以存放多久？',
    a: '一般醫院的遺體冷藏費用每日收費不等，通常建議在往生後 24–48 小時內安排後事，以減少家屬負擔。',
  },
  {
    q: '殯葬費用可以分期付款嗎？',
    a: '靜途平台推行「分段付款機制」，訂金通常為總價的 30%，其餘依服務進度分批撥款，保障家屬權益。',
  },
  {
    q: '靈骨塔塔位價格差異很大，正常嗎？',
    a: '正常。塔位價格受地點、樓層（以為最貴）、方位等因素影響，建議多比較並確認是否有管理費。',
  },
  {
    q: '喪葬補助金如何申請？',
    a: '勞保死亡給付、農保喪葬津貼、低收入戶補助等，各需不同文件。建議向戶籍所在地的區公所社會福利課洽詢。',
  },
]

export default function KnowledgePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">知識庫</p>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">殯葬知識庫</h1>
            <p className="text-muted-foreground text-sm">由殯葬專業人員與法律顧問共同維護，定期更新台灣最新法規資訊。</p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full">全部</span>
            {CATEGORIES.map(cat => (
              <span key={cat} className="text-xs bg-muted text-muted-foreground hover:bg-muted/80 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
                {cat}
              </span>
            ))}
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {ARTICLES.map(article => (
              <Link
                key={article.id}
                href={`/knowledge/${article.id}`}
                className="group bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                    {article.category}
                  </span>
                </div>
                <h2 className="font-semibold text-base mb-2 group-hover:text-accent transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <span>閱讀全文</span>
                    <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* FAQ */}
          <div className="bg-muted/40 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={16} className="text-accent" />
              <h2 className="text-lg font-semibold">常見問題 FAQ</h2>
            </div>
            <div className="flex flex-col gap-4">
              {FAQ.map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4">
                  <p className="font-semibold text-sm mb-2">Q: {item.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">A: {item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
