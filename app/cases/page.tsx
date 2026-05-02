'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Bell, FileText, Upload, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { MOCK_CASES, MOCK_MESSAGES, CASE_STATUS_STEPS, type CaseStatus } from '@/lib/data'
import Link from 'next/link'

function formatPrice(n: number) {
  return `NT$${n.toLocaleString('zh-TW')}`
}

function StatusBadge({ status }: { status: CaseStatus }) {
  const step = CASE_STATUS_STEPS.find(s => s.key === status)
  const colors: Record<CaseStatus, string> = {
    pending: 'bg-muted text-muted-foreground',
    confirmed: 'bg-blue-50 text-blue-700',
    pickup: 'bg-amber-50 text-amber-700',
    refrigeration: 'bg-sky-50 text-sky-700',
    cremation: 'bg-orange-50 text-orange-700',
    ceremony: 'bg-purple-50 text-purple-700',
    interment: 'bg-green-50 text-green-700',
    completed: 'bg-accent/10 text-accent',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[status]}`}>
      {step?.label || status}
    </span>
  )
}

export default function CasesPage() {
  const [activeCase] = useState(MOCK_CASES[0])
  const [todos, setTodos] = useState(activeCase.todos)

  const currentStepIndex = CASE_STATUS_STEPS.findIndex(s => s.key === activeCase.status)
  const paidRatio = Math.round((activeCase.paidAmount / activeCase.totalAmount) * 100)

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">案件追蹤儀表板</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold mb-1">我的案件</h1>
                <p className="text-muted-foreground text-sm">{activeCase.caseNumber} · 業者：{activeCase.vendorName}</p>
              </div>
              <StatusBadge status={activeCase.status} />
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: '案件編號', value: activeCase.caseNumber, small: true },
              { label: '逝者姓名', value: activeCase.deceasedName, small: false },
              { label: '方案總金額', value: formatPrice(activeCase.totalAmount), small: false },
              { label: '已付金額', value: formatPrice(activeCase.paidAmount), small: false },
            ].map(item => (
              <div key={item.label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className={`font-semibold ${item.small ? 'text-xs' : 'text-base'}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Progress Stepper */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <p className="text-sm font-semibold mb-6">服務進度</p>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-accent transition-all duration-700"
                style={{ width: `${(currentStepIndex / (CASE_STATUS_STEPS.length - 1)) * (100 - (100 / CASE_STATUS_STEPS.length))}%` }}
              />

              <div className="relative flex justify-between overflow-x-auto gap-2 pb-2">
                {CASE_STATUS_STEPS.map((step, index) => {
                  const isCompleted = index < currentStepIndex
                  const isCurrent = index === currentStepIndex
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2 min-w-[60px]">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 relative bg-background transition-all ${
                        isCompleted ? 'border-accent bg-accent' :
                        isCurrent ? 'border-accent' : 'border-border'
                      }`}>
                        {isCompleted
                          ? <CheckCircle2 size={18} className="text-accent-foreground" />
                          : isCurrent
                          ? <div className="w-3 h-3 rounded-full bg-accent" />
                          : <Circle size={14} className="text-border" />
                        }
                      </div>
                      <p className={`text-xs text-center leading-tight ${isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Current step description */}
            <div className="mt-4 bg-accent/5 border border-accent/20 rounded-lg px-4 py-3">
              <p className="text-sm font-medium text-accent mb-0.5">目前狀態：{CASE_STATUS_STEPS[currentStepIndex].label}</p>
              <p className="text-xs text-muted-foreground">{CASE_STATUS_STEPS[currentStepIndex].description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment progress */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm font-semibold mb-4">付款狀況</p>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>已付 {formatPrice(activeCase.paidAmount)}</span>
                  <span>未付 {formatPrice(activeCase.totalAmount - activeCase.paidAmount)}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${paidRatio}%` }}
                  />
                </div>
                <p className="text-xs text-right text-muted-foreground mt-1">{paidRatio}% 已支付</p>
              </div>
              <Button size="sm" className="w-full mt-2 bg-primary text-primary-foreground text-xs">
                繳納尾款 {formatPrice(activeCase.totalAmount - activeCase.paidAmount)}
              </Button>
            </div>

            {/* Notifications */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={14} />
                <p className="text-sm font-semibold">通知中心</p>
                <span className="ml-auto text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                  {MOCK_MESSAGES.filter(m => m.role !== 'family').length} 則
                </span>
              </div>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {MOCK_MESSAGES.filter(m => m.role !== 'family').map(msg => (
                  <div key={msg.id} className="flex gap-3 py-2 border-b border-border last:border-0">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      msg.role === 'vendor' ? 'bg-accent' : 'bg-amber-400'
                    }`} />
                    <div>
                      <p className="text-xs font-medium">{msg.author}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild size="sm" variant="outline" className="w-full mt-3 text-xs">
                <Link href="/family">前往留言板</Link>
              </Button>
            </div>

            {/* Checklist */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm font-semibold mb-4">待辦清單</p>
              <div className="flex flex-col gap-2">
                {todos.map(todo => (
                  <button
                    key={todo.id}
                    onClick={() => toggleTodo(todo.id)}
                    className="flex items-start gap-3 text-left py-1.5"
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      todo.done ? 'bg-accent border-accent' : 'border-border hover:border-accent/50'
                    }`}>
                      {todo.done && <CheckCircle2 size={12} className="text-accent-foreground" />}
                    </div>
                    <span className={`text-sm leading-relaxed ${todo.done ? 'line-through text-muted-foreground' : ''}`}>
                      {todo.text}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {todos.filter(t => t.done).length} / {todos.length} 項已完成
              </p>
            </div>

            {/* Documents */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm font-semibold mb-4">文件管理</p>
              <div className="flex flex-col gap-2 mb-4">
                {[
                  { name: '死亡證明書.pdf', status: 'uploaded', size: '324 KB' },
                  { name: '服務合約草稿.pdf', status: 'pending', size: '1.2 MB' },
                  { name: '訂金收據.pdf', status: 'uploaded', size: '156 KB' },
                ].map(doc => (
                  <div key={doc.name} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <FileText size={14} className="text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      doc.status === 'uploaded' ? 'bg-accent/10 text-accent' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {doc.status === 'uploaded' ? '已上傳' : '待簽署'}
                    </span>
                    {doc.status === 'pending' && (
                      <Button size="sm" variant="outline" className="text-xs ml-1 shrink-0">
                        簽署
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                <Upload size={13} />
                上傳文件
              </Button>
            </div>
          </div>

          {/* Updates */}
          <div className="mt-6 bg-card border border-border rounded-xl p-5">
            <p className="text-sm font-semibold mb-4">業者更新記錄</p>
            <div className="relative">
              <div className="absolute left-3.5 top-1 bottom-1 w-px bg-border" />
              <div className="flex flex-col gap-4 ml-8">
                {activeCase.notes.map((note, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[26px] top-1 w-2 h-2 rounded-full bg-accent border-2 border-background" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
