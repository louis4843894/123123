import Link from 'next/link'
import { Users, TrendingUp, ShieldAlert, BarChart3, ArrowRight } from 'lucide-react'
import { ADMIN_STATS, MONTHLY_DATA, REGION_DATA, PENDING_VENDORS } from '@/lib/data'
import { Button } from '@/components/ui/button'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['oklch(0.62 0.06 145)', 'oklch(0.55 0.05 200)', 'oklch(0.65 0.08 55)', 'oklch(0.50 0.04 90)', 'oklch(0.70 0.06 30)', 'oklch(0.75 0.04 75)']

export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">總覽儀表板</h1>
        <p className="text-muted-foreground text-sm">靜途平台 · 2024年12月</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: '累計案件數', value: ADMIN_STATS.totalCases.toLocaleString(), sub: `活躍案件 ${ADMIN_STATS.activeCases}`, icon: Users, color: 'text-blue-600' },
          { label: '本月平台收入', value: `NT$${(ADMIN_STATS.monthlyRevenue * ADMIN_STATS.platformFeeRate / 10000).toFixed(0)}萬`, sub: `平均單價 ${(ADMIN_STATS.avgCaseValue / 10000).toFixed(0)}萬`, icon: TrendingUp, color: 'text-accent' },
          { label: '待審核業者', value: ADMIN_STATS.pendingVendorApprovals, sub: '需要 24H 內處理', icon: ShieldAlert, color: 'text-amber-600' },
          { label: '轉換率', value: `${(ADMIN_STATS.conversionRate * 100).toFixed(0)}%`, sub: `最熱門地區 ${ADMIN_STATS.topRegion}`, icon: BarChart3, color: 'text-green-600' },
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-semibold mb-4">月案件量與收入趨勢</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.62 0.06 145)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="oklch(0.62 0.06 145)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 75)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v: number, name: string) =>
                  name === 'revenue' ? [`NT$${(v / 10000).toFixed(0)}萬`, '收入'] : [v, '案件']
                }
              />
              <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="oklch(0.62 0.06 145)" fill="url(#colorRevenue)" strokeWidth={2} />
              <Area yAxisId="left" type="monotone" dataKey="cases" stroke="oklch(0.50 0.04 90)" fill="none" strokeWidth={2} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-semibold mb-4">地區分佈</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={REGION_DATA} dataKey="percentage" nameKey="region" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                {REGION_DATA.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '佔比']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-2">
            {REGION_DATA.slice(0, 4).map((r, i) => (
              <div key={r.region} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{r.region}</span>
                </div>
                <span>{r.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending vendor approvals */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">待審核業者</h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {PENDING_VENDORS.length} 待處理
            </span>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
            <Link href="/admin/vendors">
              全部業者 <ArrowRight size={12} />
            </Link>
          </Button>
        </div>
        {PENDING_VENDORS.map(v => (
          <div key={v.id} className="px-5 py-4 border-b border-border last:border-0 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{v.name}</p>
              <p className="text-xs text-muted-foreground">{v.region} · 申請日：{v.appliedAt} · 執照：{v.licenseNumber}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="text-xs bg-accent text-accent-foreground">核准</Button>
              <Button size="sm" variant="outline" className="text-xs text-destructive border-destructive/30">拒絕</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
