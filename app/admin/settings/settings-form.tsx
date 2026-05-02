'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/lib/db'
import { updateSettingsAction } from './actions'

interface Props {
  settings: SiteSettings
}

export function SettingsForm({ settings }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaved(false)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateSettingsAction(formData)
      setSaved(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      {saved && (
        <div className="text-sm text-primary bg-primary/8 border border-primary/20 rounded-lg px-4 py-2.5">
          設定已儲存成功
        </div>
      )}

      {/* Contact */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold mb-4">聯絡資訊</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5" htmlFor="phone">
              免費服務專線
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={settings.phone}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5" htmlFor="platformFeeRate">
              平台手續費率（小數，例：0.05 = 5%）
            </label>
            <input
              id="platformFeeRate"
              name="platformFeeRate"
              type="number"
              step="0.01"
              min="0"
              max="1"
              defaultValue={settings.platformFeeRate}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold mb-4">首頁標題文字</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5" htmlFor="heroTitle">
              主標題
            </label>
            <input
              id="heroTitle"
              name="heroTitle"
              defaultValue={settings.heroTitle}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5" htmlFor="heroSubtitle">
              副說明文字
            </label>
            <textarea
              id="heroSubtitle"
              name="heroSubtitle"
              rows={3}
              defaultValue={settings.heroSubtitle}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold mb-4">首頁統計數字</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'totalCases', label: '累計案件數', value: settings.stats.totalCases, type: 'number' },
            { id: 'activeCases', label: '活躍案件數', value: settings.stats.activeCases, type: 'number' },
            { id: 'avgCaseValue', label: '平均案件金額（元）', value: settings.stats.avgCaseValue, type: 'number' },
            { id: 'topRegion', label: '最熱門地區', value: settings.stats.topRegion, type: 'text' },
            { id: 'conversionRate', label: '轉換率（小數，例：0.38 = 38%）', value: settings.stats.conversionRate, type: 'number', step: '0.01' },
            { id: 'monthlyRevenue', label: '本月總收入（元）', value: settings.stats.monthlyRevenue, type: 'number' },
          ].map(f => (
            <div key={f.id}>
              <label className="text-xs text-muted-foreground block mb-1.5" htmlFor={f.id}>
                {f.label}
              </label>
              <input
                id={f.id}
                name={f.id}
                type={f.type}
                step={(f as { step?: string }).step}
                defaultValue={f.value}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="self-start bg-primary text-primary-foreground"
      >
        {isPending ? '儲存中…' : '儲存設定'}
      </Button>
    </form>
  )
}
