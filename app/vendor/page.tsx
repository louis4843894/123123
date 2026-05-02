import Link from 'next/link'
import { TrendingUp, Users, FileText, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react'
import { VENDOR_CASES, CASE_STATUS_STEPS } from '@/lib/data'
import { Button } from '@/components/ui/button'

function StatusBadge({ status }: { status: string }) {
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

export default function VendorDashboardPage() {
  const activeCount = VENDOR_CASES.filter(c => c.status !== 'completed').length
  const totalRevenue = VENDOR_CASES.reduce((s, c) => s + c.paidAmount, 0)
  const pendingPayment = VENDOR_CASES.reduce((s, c) => s + (c.totalAmount - c.paidAmount), 0)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">儀表板</h1>
        <p className="text-muted-foreground text-sm">2024年12月 · 慈恩禮儀</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: '進行中案件', value: activeCount, icon: Users, color: 'text-blue-600' },
          { label: '本月已收款', value: `NT$${(totalRevenue / 10000).toFixed(0)}萬`, icon: TrendingUp, color: 'text-accent' },
          { label: '待收款', value: `NT$${(pendingPayment / 10000).toFixed(0)}萬`, icon: FileText, color: 'text-amber-600' },
          { label: '本月完成案件', value: VENDOR_CASES.filter(c => c.status === 'completed').length, icon: CheckCircle2, color: 'text-green-600' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <p className="text-2xl font-semibold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 mb-6">
        <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">有 2 份報價單等待回覆</p>
          <p className="text-xs text-amber-700">家屬已提交需求，請在 24 小時內發送正式報價。</p>
        </div>
        <Button asChild size="sm" className="ml-auto shrink-0 text-xs bg-amber-600 text-white hover:bg-amber-700">
          <Link href="/vendor/quotes">立即處理</Link>
        </Button>
      </div>

      {/* Active cases */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">最近案件</h2>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
            <Link href="/vendor/cases">
              全部案件 <ArrowRight size={12} />
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {VENDOR_CASES.map(c => (
            <div key={c.id} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-sm">{c.familyName}</p>
                  <p className="text-xs text-muted-foreground">{c.caseNumber}</p>
                </div>
                <p className="text-xs text-muted-foreground">負責人：{c.assignedTo} · 截止：{c.deadline}</p>
              </div>
              <StatusBadge status={c.status} />
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">NT${c.totalAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">已收 {Math.round((c.paidAmount / c.totalAmount) * 100)}%</p>
              </div>
              <Button asChild size="sm" variant="outline" className="text-xs">
                <Link href={`/vendor/cases/${c.id}`}>詳情</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
