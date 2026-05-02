'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SERVICE_ITEMS, type ServiceItem } from '@/lib/data'

interface VendorService extends Partial<ServiceItem> {
  active: boolean
}

const INITIAL: VendorService[] = SERVICE_ITEMS.slice(0, 8).map(s => ({
  ...s,
  active: true,
}))

export default function VendorServicesPage() {
  const [services, setServices] = useState<VendorService[]>(INITIAL)
  const [editing, setEditing] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<VendorService>>({})
  const [showAdd, setShowAdd] = useState(false)
  const [newService, setNewService] = useState({ name: '', description: '', price: '', category: '' })

  const startEdit = (s: VendorService) => {
    setEditing(s.id!)
    setEditData(s)
  }

  const saveEdit = () => {
    setServices(prev => prev.map(s => s.id === editing ? { ...s, ...editData } : s))
    setEditing(null)
  }

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id))
  }

  const toggleActive = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  const addService = () => {
    if (!newService.name || !newService.price) return
    const item: VendorService = {
      id: `custom-${Date.now()}`,
      name: newService.name,
      description: newService.description,
      price: Number(newService.price),
      category: newService.category || '其他',
      required: false,
      active: true,
    }
    setServices(prev => [...prev, item])
    setNewService({ name: '', description: '', price: '', category: '' })
    setShowAdd(false)
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">服務項目管理</h1>
          <p className="text-muted-foreground text-sm">管理您在平台上展示的服務方案與定價</p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-primary text-primary-foreground gap-1.5 text-sm"
        >
          <Plus size={14} />
          新增項目
        </Button>
      </div>

      {/* Add new */}
      {showAdd && (
        <div className="bg-accent/5 border border-accent/30 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-sm mb-4">新增服務項目</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">服務名稱 *</label>
              <input
                value={newService.name}
                onChange={e => setNewService(p => ({ ...p, name: e.target.value }))}
                placeholder="例：特殊遺體整容"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">類別</label>
              <input
                value={newService.category}
                onChange={e => setNewService(p => ({ ...p, category: e.target.value }))}
                placeholder="例：基礎服務"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">價格 (NT$) *</label>
              <input
                type="number"
                value={newService.price}
                onChange={e => setNewService(p => ({ ...p, price: e.target.value }))}
                placeholder="例：8000"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">說明</label>
              <input
                value={newService.description}
                onChange={e => setNewService(p => ({ ...p, description: e.target.value }))}
                placeholder="服務說明…"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addService} className="text-xs bg-primary text-primary-foreground gap-1.5">
              <Save size={12} /> 儲存
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowAdd(false)}>
              <X size={12} /> 取消
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/40 text-xs text-muted-foreground font-medium border-b border-border">
          <div className="col-span-3">服務名稱</div>
          <div className="col-span-2">類別</div>
          <div className="col-span-3 hidden md:block">說明</div>
          <div className="col-span-2">定價</div>
          <div className="col-span-2">操作</div>
        </div>
        {services.map(s => (
          <div key={s.id} className={`grid grid-cols-12 gap-4 px-5 py-4 border-b border-border last:border-0 items-start text-sm transition-colors ${!s.active ? 'opacity-40' : ''}`}>
            {editing === s.id ? (
              <>
                <div className="col-span-3">
                  <input
                    value={editData.name || ''}
                    onChange={e => setEditData(p => ({ ...p, name: e.target.value }))}
                    className="w-full text-sm border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    value={editData.category || ''}
                    onChange={e => setEditData(p => ({ ...p, category: e.target.value }))}
                    className="w-full text-sm border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="col-span-3 hidden md:block">
                  <input
                    value={editData.description || ''}
                    onChange={e => setEditData(p => ({ ...p, description: e.target.value }))}
                    className="w-full text-sm border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={editData.price || ''}
                    onChange={e => setEditData(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full text-sm border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="col-span-2 flex gap-1">
                  <button onClick={saveEdit} className="p-1.5 rounded bg-accent/10 hover:bg-accent/20 text-accent">
                    <Save size={12} />
                  </button>
                  <button onClick={() => setEditing(null)} className="p-1.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground">
                    <X size={12} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-3 font-medium">{s.name}</div>
                <div className="col-span-2 text-muted-foreground text-xs">{s.category}</div>
                <div className="col-span-3 hidden md:block text-muted-foreground text-xs line-clamp-2">{s.description}</div>
                <div className="col-span-2">
                  <span className="font-semibold">NT${s.price?.toLocaleString()}</span>
                </div>
                <div className="col-span-2 flex gap-1 flex-wrap">
                  <button
                    onClick={() => toggleActive(s.id!)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                      s.active ? 'border-accent/40 text-accent bg-accent/5' : 'border-border text-muted-foreground'
                    }`}
                  >
                    {s.active ? '上架' : '下架'}
                  </button>
                  <button onClick={() => startEdit(s)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => deleteService(s.id!)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-destructive">
                    <Trash2 size={12} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
