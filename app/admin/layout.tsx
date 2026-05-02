import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminSidebar } from './admin-sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect('/auth/login')

  return (
    <div className="min-h-screen flex bg-muted/30">
      <AdminSidebar adminName={session.name} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
