'use client'

import { useState } from 'react'
import { Search, Upload, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VENDOR_CASES, CASE_STATUS_STEPS, type CaseStatus } from '@/lib/data'

const STATUS_OPTIONS = ['全部', ...CASE_STATUS_STEPS.map(s => s.label)]

function StatusBadge({ status }: { status: CaseStatus }) {
  const step = CASE_STATUS_STEPS.find(s => s.key === status)
  const colorMap: Record<string, string> = {
    pending: 'bg-muted text-muted-foreground',
    confirmed: 'bg-blue-50 text-blue-700',
    pickup: 'bg-amber-50 text-amber-700',
    cremation: 'bg-orange-50 text-orange-700',
    ceremony: 'bg-purple-50 text-purple-700',
    completed: 'bg-green-50 text-green-700',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colorMap[status] || 'bg-muted text-muted-foreground'}`}>
      {step?.label || status}
    </span>
  )
}

export default function VendorCasesPage() {
  const [cases, setCases] = useState(VENDOR_CASES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('全部')
  const [selectedCase, setSelectedCase] = useState<string | null>(null)

  const filtered = cases.filter(c => {
    const matchSearch = c.familyName.includes(search) || c.caseNumber.includes(search)
    const matchStatus = statusFilter === '全部' || CASE_STATUS_STEPS.find(s => s.key === c.status)?.label === statusFilter
    return matchSearch && matchStatus
  })

  const advanceStatus = (caseId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c
      const steps = CASE_STATUS_STEPS.map(s => s.key)
      const idx = steps.indexOf(c.status)
      if (idx < steps.length - 1) {
        return { ...c, status: steps[idx + 1] }
      }
      return c
    }))
  }

  const selectedCaseData = cases.find(c => c.id === selectedCase)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">案件處理</h1>
        <p className="text-muted-foreground text-sm">管理所有進行中及歷史案件</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜尋家庭或案件編號…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
        >
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case list */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCase(selectedCase === c.id ? null : c.id)}
              className={`w-full text-left bg-card border rounded-xl p-4 transition-all hover:shadow-sm ${
                selectedCase === c.id ? 'border-accent ring-1 ring-accent/30' : 'border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{c.familyName}</p>
                    <span className="text-xs text-muted-foreground">{c.caseNumber}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    負責人：{c.assignedTo} · 截止日：{c.deadline}
                  </p>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={c.status} />
                    <span className="text-xs text-muted-foreground">
                      NT${c.totalAmount.toLocaleString()} · 已收 {Math.round((c.paidAmount / c.totalAmount) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              沒有符合條件的案件
            </div>
          )}
        </div>

        {/* Case detail panel */}
        <div className="lg:col-span-1">
          {selectedCaseData ? (
            <div className="bg-card border border-border rounded-xl p-5 sticky top-6">
              <h3 className="font-semibold mb-4">{selectedCaseData.familyName} — 詳情</h3>

              <div className="flex flex-col gap-3 mb-5 text-sm">
                {[
                  ['案件編號', selectedCaseData.caseNumber],
                  ['負責人', selectedCaseData.assignedTo],
                  ['截止日', selectedCaseData.deadline],
                  ['總金額', `NT$${selectedCaseData.totalAmount.toLocaleString()}`],
                  ['已收款', `NT$${selectedCaseData.paidAmount.toLocaleString()}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-xs text-muted-foreground mb-2">目前狀態</p>
                <StatusBadge status={selectedCaseData.status} />
              </div>

              <div className="flex flex-col gap-2">
                {selectedCaseData.status !== 'completed' && (
                  <Button
                    onClick={() => advanceStatus(selectedCaseData.id)}
                    className="w-full text-sm bg-primary text-primary-foreground gap-2"
                  >
                    <CheckCircle2 size={14} />
                    更新至下一步驟
                  </Button>
                )}
                <Button variant="outline" size="sm" className="w-full text-xs gap-2">
                  <Upload size={12} />
                  上傳收據或合約
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted/40 border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
              點選左側案件查看詳情
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
