import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`)
}

function readJSON<T>(name: string, fallback: T): T {
  const fp = filePath(name)
  if (!fs.existsSync(fp)) return fallback
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function writeJSON<T>(name: string, data: T): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf-8')
}

// ---- Types ----

export interface DBVendor {
  id: string
  name: string
  description: string
  region: string[]
  religion: string[]
  rating: number
  reviewCount: number
  priceRange: [number, number]
  services: string[]
  phone: string
  verified: boolean
  yearsInBusiness: number
  image: string
  responseTime: string
  status: 'approved' | 'suspended'
}

export interface DBPendingVendor {
  id: string
  name: string
  region: string
  appliedAt: string
  licenseNumber: string
  contactName: string
  phone: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface SiteSettings {
  phone: string
  platformFeeRate: number
  stats: {
    totalCases: number
    activeCases: number
    avgCaseValue: number
    topRegion: string
    conversionRate: number
    monthlyRevenue: number
  }
  heroTitle: string
  heroSubtitle: string
  updatedAt: string
}

// ---- Vendors ----

export function getVendors(): DBVendor[] {
  return readJSON<DBVendor[]>('vendors', [])
}

export function getApprovedVendors(): DBVendor[] {
  return getVendors().filter(v => v.status === 'approved')
}

export function updateVendorStatus(id: string, status: 'approved' | 'suspended'): void {
  const vendors = getVendors()
  const idx = vendors.findIndex(v => v.id === id)
  if (idx !== -1) {
    vendors[idx].status = status
    writeJSON('vendors', vendors)
  }
}

// ---- Pending Vendors ----

export function getPendingVendors(): DBPendingVendor[] {
  return readJSON<DBPendingVendor[]>('pending_vendors', []).filter(v => v.status === 'pending')
}

export function getAllPendingVendors(): DBPendingVendor[] {
  return readJSON<DBPendingVendor[]>('pending_vendors', [])
}

export function approvePendingVendor(id: string): DBVendor | null {
  const pending = readJSON<DBPendingVendor[]>('pending_vendors', [])
  const idx = pending.findIndex(p => p.id === id)
  if (idx === -1) return null

  const p = pending[idx]
  pending[idx].status = 'approved'
  writeJSON('pending_vendors', pending)

  // Add as full vendor
  const vendors = getVendors()
  const newVendor: DBVendor = {
    id: `v${Date.now()}`,
    name: p.name,
    description: `${p.region}業者`,
    region: [p.region],
    religion: [],
    rating: 0,
    reviewCount: 0,
    priceRange: [50000, 200000],
    services: [],
    phone: p.phone,
    verified: true,
    yearsInBusiness: 0,
    image: '',
    responseTime: '1小時內',
    status: 'approved',
  }
  vendors.push(newVendor)
  writeJSON('vendors', vendors)
  return newVendor
}

export function rejectPendingVendor(id: string): void {
  const pending = readJSON<DBPendingVendor[]>('pending_vendors', [])
  const idx = pending.findIndex(p => p.id === id)
  if (idx !== -1) {
    pending[idx].status = 'rejected'
    writeJSON('pending_vendors', pending)
  }
}

// ---- Settings ----

export function getSettings(): SiteSettings {
  return readJSON<SiteSettings>('settings', {
    phone: '0800-123-456',
    platformFeeRate: 0.05,
    stats: {
      totalCases: 0,
      activeCases: 0,
      avgCaseValue: 0,
      topRegion: '台北市',
      conversionRate: 0,
      monthlyRevenue: 0,
    },
    heroTitle: '讓告別，充滿尊嚴與溫度',
    heroSubtitle: '台灣首個數位化殯葬服務整合平台',
    updatedAt: new Date().toISOString().slice(0, 10),
  })
}

export function updateSettings(patch: Partial<SiteSettings>): SiteSettings {
  const current = getSettings()
  const updated: SiteSettings = {
    ...current,
    ...patch,
    stats: { ...current.stats, ...(patch.stats ?? {}) },
    updatedAt: new Date().toISOString().slice(0, 10),
  }
  writeJSON('settings', updated)
  return updated
}
