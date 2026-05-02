import { getSession } from '@/lib/auth'
import { NavbarClient } from './navbar-client'
import { getSettings } from '@/lib/db'

export async function Navbar() {
  const session = await getSession()
  const settings = getSettings()
  return <NavbarClient session={session} phone={settings.phone} />
}
