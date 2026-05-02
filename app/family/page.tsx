import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getSettings } from '@/lib/db'
import { FamilyContent } from './family-content'

export default async function FamilyPage() {
  const settings = getSettings()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <FamilyContent />
      <Footer phone={settings.phone} />
    </div>
  )
}
