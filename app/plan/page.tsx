import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getSettings } from '@/lib/db'
import { PlanContent } from './plan-content'

export default async function PlanPage() {
  const settings = getSettings()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PlanContent platformFeeRate={settings.platformFeeRate} />
      <Footer phone={settings.phone} />
    </div>
  )
}
