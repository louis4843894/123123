'use client'

import { useState, useTransition } from 'react'
import { Shield, ShieldAlert, Search, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DBVendor, DBPendingVendor } from '@/lib/db'
import {
  approveVendorAction,
  rejectVendorAction,
  suspendVendorAction,
  reinstateVendorAction,
} from './actions'

interface Props {
  pending: DBPendingVendor[]
  approved: DBVendor[]
}

export function VendorTabs({ pending: initialPending, approved: initialApproved }: Props) {
  const [tab, setTab] = useState<'pending' | 'approved'>('pending')
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()

  const filteredApproved = initialApproved.filter(
    v => v.name.includes(search) || v.region.some(r => r.includes(search))
  )

  function handleApprove(id: string) {
    startTransition(() => approveVendorAction(id))
  }

  function handleReject(id: string) {
    startTransition(() => rejectVendorAction(id))
  }

  function handleSuspend(id: string) {
    startTransition(() => suspendVendorAction(id))
  }

  function handleReinstate(id: string) {
    startTransition(() => reinstateVendorAction(id))
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          ['pending', '待審核', initialPending.length],
          ['approved', '已通過', initialApproved.length],
        ] as const).map(([t, label, count]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              tab === t
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border hover:bg-muted/40'
            }`}
          >
            {label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab === t ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted'
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {tab === 'pending' ? (
        <div className="flex flex-col gap-4">
          {initialPending.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">目前沒有待審核業者</p>
            </div>
          ) : (
            initialPending.map(v => (
              <div key={v.id} className="bg-card border border-amber-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldAlert size={15} className="text-amber-600" />
                      <p className="font-semibold">{v.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground mt-2">
                      <span>地區：{v.region}</span>
                      <span>申請日：{v.appliedAt}</span>
                      <span>執照號碼：{v.licenseNumber}</span>
                      <span>聯絡人：{v.contactName}</span>
                      <span>電話：{v.phone}</span>
                      <span>信箱：{v.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleApprove(v.id)}
                      className="text-xs bg-primary text-primary-foreground gap-1"
                    >
                      <Check size={12} />
                      核准
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => handleReject(v.id)}
                      className="text-xs text-destructive border-destructive/30 gap-1"
                    >
                      <X size={12} />
                      拒絕
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜尋業者名稱或地區…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/40 text-xs text-muted-foreground font-medium border-b border-border">
              <div className="col-span-3">業者名稱</div>
              <div className="col-span-3">服務地區</div>
              <div className="col-span-2">評分</div>
              <div className="col-span-2">在業年資</div>
              <div className="col-span-2">操作</div>
            </div>
            {filteredApproved.map(v => (
              <div
                key={v.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border last:border-0 items-center text-sm"
              >
                <div className="col-span-3">
                  <div className="flex items-center gap-1.5">
                    <Shield size={12} className="text-accent" />
                    <span className="font-medium">{v.name}</span>
                  </div>
                </div>
                <div className="col-span-3 text-muted-foreground text-xs">
                  {v.region.slice(0, 2).join('、')}
                </div>
                <div className="col-span-2 text-muted-foreground">
                  {v.rating > 0 ? `★ ${v.rating} (${v.reviewCount})` : '尚無評分'}
                </div>
                <div className="col-span-2 text-muted-foreground">
                  {v.yearsInBusiness > 0 ? `${v.yearsInBusiness} 年` : '新進業者'}
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleSuspend(v.id)}
                    className="text-xs text-destructive hover:text-destructive"
                  >
                    暫停
                  </Button>
                </div>
              </div>
            ))}
            {filteredApproved.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">沒有符合的業者</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
