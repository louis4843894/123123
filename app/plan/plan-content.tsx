'use client'

import { useState, useMemo } from 'react'
import { Check, ChevronDown, ChevronUp, ShoppingCart, ArrowRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SERVICE_ITEMS } from '@/lib/data'
import Link from 'next/link'

const CATEGORIES = [...new Set(SERVICE_ITEMS.map(i => i.category))]

function formatPrice(n: number) {
  return `NT$${n.toLocaleString('zh-TW')}`
}

interface Props {
  platformFeeRate: number
}

export function PlanContent({ platformFeeRate }: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(SERVICE_ITEMS.filter(i => i.required).map(i => i.id))
  )
  const [expanded, setExpanded] = useState<Set<string>>(new Set(CATEGORIES.slice(0, 2)))
  const [familyCount, setFamilyCount] = useState(3)
  const [showSplit, setShowSplit] = useState(false)

  const toggle = (id: string, required: boolean) => {
    if (required) return
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleCategory = (cat: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  const selectedItems = useMemo(() => SERVICE_ITEMS.filter(i => selected.has(i.id)), [selected])
  const total = useMemo(() => selectedItems.reduce((sum, i) => sum + i.price, 0), [selectedItems])
  const fee = Math.round(total * platformFeeRate)
  const deposit = Math.round(total * 0.3)
  const balance = total - deposit
  const perPerson = familyCount > 0 ? Math.ceil(total / familyCount) : total

  return (
    <main className="flex-1 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">動態方案建構器</p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">自訂您的服務方案</h1>
          <p className="text-muted-foreground text-sm">勾選需要的服務項目，費用即時連動計算。標示 ✦ 的為必選項目。</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Service items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {CATEGORIES.map(cat => {
              const items = SERVICE_ITEMS.filter(i => i.category === cat)
              const isOpen = expanded.has(cat)
              const selectedCount = items.filter(i => selected.has(i.id)).length
              return (
                <div key={cat} className="bg-card border border-border rounded-xl overflow-hidden">
                  <button onClick={() => toggleCategory(cat)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">{cat}</span>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{selectedCount}/{items.length} 已選</span>
                    </div>
                    {isOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </button>
                  {isOpen && (
                    <div className="divide-y divide-border">
                      {items.map(item => {
                        const isSelected = selected.has(item.id)
                        return (
                          <button key={item.id} onClick={() => toggle(item.id, item.required)}
                            className={`w-full flex items-start gap-4 px-5 py-4 text-left transition-colors ${item.required ? 'cursor-default' : 'hover:bg-muted/20'} ${isSelected ? 'bg-accent/5' : ''}`}>
                            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-accent border-accent' : 'border-border'}`}>
                              {isSelected && <Check size={11} className="text-accent-foreground" strokeWidth={3} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-medium text-sm">{item.name}</span>
                                {item.required && <span className="text-xs text-muted-foreground">✦ 必選</span>}
                              </div>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                            <span className="text-sm font-semibold text-right shrink-0">{formatPrice(item.price)}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right: Price summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 flex flex-col gap-4">
              <div className="bg-primary text-primary-foreground rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart size={16} className="opacity-70" />
                  <span className="text-sm font-medium opacity-70">目前方案合計</span>
                </div>
                <p className="text-3xl font-semibold mb-1">{formatPrice(total)}</p>
                <p className="text-xs opacity-60">{selectedItems.length} 項服務</p>
                {platformFeeRate > 0 && (
                  <p className="text-xs opacity-60 mt-1">平台服務費 ({Math.round(platformFeeRate * 100)}%)：{formatPrice(fee)}</p>
                )}
                <div className="mt-4 pt-4 border-t border-primary-foreground/20 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="opacity-60 text-xs mb-1">訂金 (30%)</p>
                    <p className="font-semibold">{formatPrice(deposit)}</p>
                  </div>
                  <div>
                    <p className="opacity-60 text-xs mb-1">尾款 (70%)</p>
                    <p className="font-semibold">{formatPrice(balance)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <button onClick={() => setShowSplit(!showSplit)} className="w-full flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">費用均分計算機</span>
                  {showSplit ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {showSplit && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">分攤人數</label>
                    <div className="flex items-center gap-2 mb-3">
                      <button onClick={() => setFamilyCount(c => Math.max(1, c - 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted/40 text-sm">-</button>
                      <span className="text-lg font-semibold w-8 text-center">{familyCount}</span>
                      <button onClick={() => setFamilyCount(c => c + 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted/40 text-sm">+</button>
                      <span className="text-sm text-muted-foreground">人</span>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-0.5">每人應付</p>
                      <p className="text-xl font-semibold text-accent">{formatPrice(perPerson)}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-xl p-5 max-h-60 overflow-y-auto">
                <p className="text-sm font-semibold mb-3">已選項目</p>
                {selectedItems.length === 0 ? (
                  <p className="text-xs text-muted-foreground">尚未選擇任何項目</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {selectedItems.map(item => (
                      <li key={item.id} className="flex justify-between text-xs">
                        <span className="text-muted-foreground truncate mr-2">{item.name}</span>
                        <span className="shrink-0 font-medium">{formatPrice(item.price)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button asChild size="lg" className="bg-primary text-primary-foreground gap-2 w-full">
                  <Link href="/vendors">選擇業者 <ArrowRight size={16} /></Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  <Info size={11} />方案會自動傳送至業者詢價
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
