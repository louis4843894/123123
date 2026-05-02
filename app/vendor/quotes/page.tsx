'use client'

import { useState } from 'react'
import { Send, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SERVICE_ITEMS } from '@/lib/data'

interface QuoteRequest {
  id: string
  family: string
  caseNumber: string
  requestDate: string
  budget: string
  services: string[]
  status: 'pending' | 'sent' | 'accepted' | 'rejected'
  message: string
}

const MOCK_REQUESTS: QuoteRequest[] = [
  {
    id: 'q1',
    family: '王家',
    caseNumber: 'INQ-2024-0034',
    requestDate: '2024-12-01',
    budget: '60–120萬',
    services: ['遺體接運', '告別式', '火化'],
    status: 'pending',
    message: '家父昨天剛剛往生，希望盡快安排接運，告別式希望以佛教儀式進行。',
  },
  {
    id: 'q2',
    family: '趙家',
    caseNumber: 'INQ-2024-0033',
    requestDate: '2024-11-30',
    budget: '120萬以上',
    services: ['遺體接運', '美容整容', '告別式', '火化', '塔位'],
    status: 'pending',
    message: '希望提供最完善的服務，預算充足，品質第一。',
  },
  {
    id: 'q3',
    family: '蔡家',
    caseNumber: 'INQ-2024-0030',
    requestDate: '2024-11-28',
    budget: '60萬以下',
    services: ['遺體接運', '告別式'],
    status: 'sent',
    message: '需要基本服務，家庭成員較少。',
  },
]

const STATUS_MAP = {
  pending: { label: '待回覆', color: 'bg-amber-50 text-amber-700', icon: Clock },
  sent: { label: '已發送報價', color: 'bg-blue-50 text-blue-700', icon: Send },
  accepted: { label: '已接受', color: 'bg-green-50 text-green-700', icon: CheckCircle2 },
  rejected: { label: '已拒絕', color: 'bg-red-50 text-red-700', icon: XCircle },
}

export default function VendorQuotesPage() {
  const [requests, setRequests] = useState(MOCK_REQUESTS)
  const [selected, setSelected] = useState<QuoteRequest | null>(null)
  const [quoteNote, setQuoteNote] = useState('')
  const [quoteTotal, setQuoteTotal] = useState('')

  const sendQuote = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'sent' } : r))
    setSelected(null)
    setQuoteNote('')
    setQuoteTotal('')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">報價單管理</h1>
        <p className="text-muted-foreground text-sm">接收家屬詢價，發送正式電子報價單</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request list */}
        <div className="flex flex-col gap-3">
          {requests.map(req => {
            const st = STATUS_MAP[req.status]
            return (
              <button
                key={req.id}
                onClick={() => setSelected(selected?.id === req.id ? null : req)}
                className={`text-left bg-card border rounded-xl p-4 transition-all hover:shadow-sm ${
                  selected?.id === req.id ? 'border-accent ring-1 ring-accent/30' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{req.family}</p>
                    <p className="text-xs text-muted-foreground">{req.caseNumber} · {req.requestDate}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.color}`}>
                    {st.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {req.services.map(s => (
                    <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{req.message}</p>
              </button>
            )
          })}
        </div>

        {/* Quote builder */}
        {selected ? (
          <div className="bg-card border border-border rounded-xl p-5 sticky top-6">
            <h3 className="font-semibold mb-4">為 {selected.family} 建立報價單</h3>

            <div className="bg-muted/40 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium mb-1">家屬留言</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{selected.message}</p>
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1">家屬預算</p>
              <p className="font-semibold text-sm">{selected.budget}</p>
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">需求服務項目</p>
              <div className="flex flex-col gap-1">
                {selected.services.map(svc => {
                  const item = SERVICE_ITEMS.find(s => s.name.includes(svc) || svc.includes(s.name))
                  return (
                    <div key={svc} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span>{svc}</span>
                      <span className="text-muted-foreground">{item ? `NT$${item.price.toLocaleString()}` : '—'}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-muted-foreground block mb-1">報價總金額 (NT$)</label>
              <input
                type="number"
                value={quoteTotal}
                onChange={e => setQuoteTotal(e.target.value)}
                placeholder="請輸入報價金額"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs text-muted-foreground block mb-1">備注說明（選填）</label>
              <textarea
                value={quoteNote}
                onChange={e => setQuoteNote(e.target.value)}
                rows={3}
                placeholder="向家屬說明報價內容或注意事項…"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <div className="flex gap-2">
              {selected.status === 'pending' && (
                <Button
                  onClick={() => sendQuote(selected.id)}
                  disabled={!quoteTotal}
                  className="flex-1 bg-primary text-primary-foreground gap-1.5 text-sm"
                >
                  <Send size={14} />
                  發送報價單
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelected(null)} className="text-sm">
                關閉
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-muted/40 border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
            點選左側詢價單以建立報價
          </div>
        )}
      </div>
    </div>
  )
}
