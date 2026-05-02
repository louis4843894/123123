'use client'

import { useState, useMemo } from 'react'
import { Star, MapPin, Phone, Shield, Clock, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { VENDORS, type Vendor } from '@/lib/data'
import Link from 'next/link'

const ALL_REGIONS = [...new Set(VENDORS.flatMap(v => v.region))].sort()
const ALL_RELIGIONS = [...new Set(VENDORS.flatMap(v => v.religion))].sort()

function formatPrice(n: number) {
  if (n >= 10000) return `${Math.round(n / 10000)}萬`
  return `NT$${n.toLocaleString()}`
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={12}
          className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-border'}
        />
      ))}
    </div>
  )
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="h-36 bg-muted/60 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl font-semibold text-muted-foreground">
            {vendor.name[0]}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{vendor.name}</h3>
              {vendor.verified && (
                <Shield size={13} className="text-accent" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <StarRating rating={vendor.rating} />
              <span>{vendor.rating}</span>
              <span>({vendor.reviewCount} 評價)</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {vendor.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={11} />
            <span>{vendor.region.slice(0, 2).join('、')}{vendor.region.length > 2 ? '…' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={11} />
            <span>回應時間 {vendor.responseTime}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {vendor.religion.slice(0, 3).map(r => (
            <span key={r} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              {r}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">價格區間</p>
            <p className="text-sm font-semibold">
              {formatPrice(vendor.priceRange[0])} – {formatPrice(vendor.priceRange[1])}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${vendor.phone}`}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted/40 transition-colors"
              aria-label="撥打電話"
            >
              <Phone size={14} className="text-muted-foreground" />
            </a>
            <Button asChild size="sm" className="text-xs bg-primary text-primary-foreground">
              <Link href={`/vendors/${vendor.id}`}>詳細資料</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VendorsPage() {
  const [regionFilter, setRegionFilter] = useState<string[]>([])
  const [religionFilter, setReligionFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'response'>('rating')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = [...VENDORS]
    if (regionFilter.length > 0) {
      result = result.filter(v => v.region.some(r => regionFilter.includes(r)))
    }
    if (religionFilter.length > 0) {
      result = result.filter(v => v.religion.some(r => religionFilter.includes(r)))
    }
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price') return a.priceRange[0] - b.priceRange[0]
      return a.responseTime.localeCompare(b.responseTime)
    })
    return result
  }, [regionFilter, religionFilter, sortBy])

  const clearFilters = () => {
    setRegionFilter([])
    setReligionFilter([])
  }

  const hasFilters = regionFilter.length > 0 || religionFilter.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">業者比較中心</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold mb-1">尋找適合您的業者</h1>
                <p className="text-muted-foreground text-sm">所有業者均通過靜途嚴格審核認證</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground"
                >
                  <option value="rating">評分最高</option>
                  <option value="price">價格由低</option>
                  <option value="response">回應最快</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={13} />
                  篩選
                  {hasFilters && (
                    <span className="bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {regionFilter.length + religionFilter.length}
                    </span>
                  )}
                </Button>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X size={12} /> 清除
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-card border border-border rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold mb-3">服務地區</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_REGIONS.map(r => (
                    <button
                      key={r}
                      onClick={() => setRegionFilter(prev =>
                        prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
                      )}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        regionFilter.includes(r)
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'border-border hover:bg-muted/40'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-3">宗教特性</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_RELIGIONS.map(r => (
                    <button
                      key={r}
                      onClick={() => setReligionFilter(prev =>
                        prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
                      )}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        religionFilter.includes(r)
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'border-border hover:bg-muted/40'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <p className="text-sm text-muted-foreground mb-4">共 {filtered.length} 家業者</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(v => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">沒有符合篩選條件的業者，請調整篩選設定。</p>
              <button onClick={clearFilters} className="mt-3 text-sm text-accent hover:underline">
                清除所有篩選
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
