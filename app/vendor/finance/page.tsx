'use client'

import { TrendingUp, ArrowDownLeft, Clock } from 'lucide-react'
import { VENDOR_CASES, MONTHLY_DATA } from '@/lib/data'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const chartData = MONTHLY_DATA.slice(-4).map(d => ({
  month: d.month,
  amount: Math.round(d.revenue * 0.04 / 10000), // vendor share ~4%, in 萬
}))

export default function VendorFinancePage() {
  const totalReceived = VENDOR_CASES.reduce((s, c) => s + c.paidAmount, 0)
  const totalPending = VENDOR_CASES.reduce((s, c) => s + (c.totalAmount - c.paidAmount), 0)
  const platformFee = Math.round(totalReceived * 0.05)
  const netRevenue = totalReceived - platformFee

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">帳務報表</h1>
        <p className="text-muted-foreground text-sm">追蹤訂金入帳、尾款狀態及平台手續費</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: '已收款總額', value: `NT$${totalReceived.toLocaleString()}`, icon: ArrowDownLeft, color: 'text-accent' },
          { label: '待收款', value: `NT$${totalPending.toLocaleString()}`, icon: Clock, color: 'text-amber-600' },
          { label: '平台手續費 (5%)', value: `NT$${platformFee.toLocaleString()}`, icon: TrendingUp, color: 'text-muted-foreground' },
          { label: '淨收入', value: `NT$${netRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <p className="text-xl font-semibold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <p className="text-sm font-semibold mb-4">近期月收入趨勢（萬元）</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.870 0.015 248)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => [`NT$${v}萬`, '收入']} />
            <Bar dataKey="amount" fill="oklch(0.475 0.090 230)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Case payment status */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">各案件付款狀態</h2>
        </div>
        <div className="divide-y divide-border">
          {VENDOR_CASES.map(c => {
            const ratio = Math.round((c.paidAmount / c.totalAmount) * 100)
            return (
              <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{c.familyName}</p>
                    <span className="text-xs text-muted-foreground">{c.caseNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-32">
                      <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${ratio}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{ratio}%</span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">NT${c.paidAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">/ NT${c.totalAmount.toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                  ratio === 100 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {ratio === 100 ? '已結清' : '待尾款'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
