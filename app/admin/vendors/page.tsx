import { Shield, ShieldAlert } from 'lucide-react'
import { getPendingVendors, getVendors } from '@/lib/db'
import { VendorTabs } from './vendor-tabs'

export default function AdminVendorsPage() {
  const pending = getPendingVendors()
  const all = getVendors()
  const approved = all.filter(v => v.status === 'approved')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">業者審核管理</h1>
        <p className="text-muted-foreground text-sm">審核業者資格，確保平台服務品質</p>
      </div>
      <VendorTabs pending={pending} approved={approved} />
    </div>
  )
}
