import { getSettings } from '@/lib/db'
import { SettingsForm } from './settings-form'

export default function AdminSettingsPage() {
  const settings = getSettings()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">系統設定</h1>
        <p className="text-muted-foreground text-sm">管理網站顯示數據、聯絡資訊與平台設定</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}
