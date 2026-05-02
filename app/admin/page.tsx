import Link from 'next/link'
import { Users, TrendingUp, ShieldAlert, BarChart3, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSettings, getPendingVendors, getApprovedVendors } from '@/lib/db'
import { AdminCharts } from './admin-charts'

export default function AdminDashboardPage() {
  const settings = getSettings()
  const pendingVendors = getPendingVendors()
  const approvedVendors = getApprovedVendors()
  const stats = settings.stats

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">總覽儀表板</h1>
        <p className="text-muted-foreground text-sm">靜途平台 · {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: '累計案件數',
            value: stats.totalCases.toLocaleString(),
            sub: `活躍案件 ${stats.activeCases}`,
            icon: Users,
            color: 'text-primary',
          },
          {
            label: '本月平台收入',
            value: `NT$${((stats.monthlyRevenue * stats.platformFeeRate) / 10000).toFixed(0)}萬`,
            sub: `平均單價 ${(stats.avgCaseValue / 10000).toFixed(0)}萬`,
            icon: TrendingUp,
            color: 'text-accent',
          },
          {
            label: '待審核業者',
            value: pendingVendors.length,
            sub: '需要 24H 內處理',
            icon: ShieldAlert,
            color: 'text-amber-600',
          },
          {
            label: '轉換率',
            value: `${(stats.conversionRate * 100).toFixed(0)}%`,
            sub: `最熱門地區 ${stats.topRegion}`,
            icon: BarChart3,
            color: 'text-green-600',
          },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <p className="text-2xl font-semibold mb-0.5">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <AdminCharts />

      {/* Pending vendor approvals */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">待審核業者</h2>
            {pendingVendors.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {pendingVendors.length} 待處理
              </span>
            )}
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
            <Link href="/admin/vendors">
              全部業者 <ArrowRight size={12} />
            </Link>
          </Button>
        </div>
        {pendingVendors.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">目前沒有待審核業者</div>
        ) : pendingVendors.map(v => (
          <div key={v.id} className="px-5 py-4 border-b border-border last:border-0 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{v.name}</p>
              <p className="text-xs text-muted-foreground">{v.region} · 申請日：{v.appliedAt} · 執照：{v.licenseNumber}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
                <Link href="/admin/vendors">審核</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
