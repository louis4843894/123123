import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getApprovedVendors, getSettings } from '@/lib/db'
import { VendorsList } from './vendors-list'

export default async function VendorsPage() {
  const vendors = getApprovedVendors()
  const settings = getSettings()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <VendorsList vendors={vendors} />
      <Footer phone={settings.phone} />
    </div>
  )
}
