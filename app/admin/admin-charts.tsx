'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { MONTHLY_DATA, REGION_DATA } from '@/lib/data'

const COLORS = [
  'oklch(0.475 0.090 230)',
  'oklch(0.345 0.075 244)',
  'oklch(0.60 0.07 210)',
  'oklch(0.70 0.05 248)',
  'oklch(0.55 0.08 260)',
  'oklch(0.40 0.06 244)',
]

export function AdminCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
        <p className="text-sm font-semibold mb-4">月案件量與收入趨勢</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MONTHLY_DATA}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.475 0.090 230)" stopOpacity={0.20} />
                <stop offset="95%" stopColor="oklch(0.475 0.090 230)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.870 0.015 248)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v: number, name: string) =>
                name === 'revenue' ? [`NT$${(v / 10000).toFixed(0)}萬`, '收入'] : [v, '案件']
              }
            />
            <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="oklch(0.475 0.090 230)" fill="url(#colorRevenue)" strokeWidth={2} />
            <Area yAxisId="left" type="monotone" dataKey="cases" stroke="oklch(0.345 0.075 244)" fill="none" strokeWidth={2} strokeDasharray="4 2" />
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
  )
}
