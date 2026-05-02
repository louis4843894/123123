import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getSettings } from '@/lib/db'
import { CasesContent } from './cases-content'

export default async function CasesPage() {
  const settings = getSettings()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CasesContent />
      <Footer phone={settings.phone} />
    </div>
  )
}
