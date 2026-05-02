import { Suspense } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GuideContent } from './guide-content'

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted-foreground">載入中…</div>}>
          <GuideContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
