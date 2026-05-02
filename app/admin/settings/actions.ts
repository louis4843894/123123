'use server'

import { revalidatePath } from 'next/cache'
import { updateSettings } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function updateSettingsAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: '未授權' }

  const phone = (formData.get('phone') as string ?? '').trim()
  const platformFeeRate = parseFloat(formData.get('platformFeeRate') as string)
  const totalCases = parseInt(formData.get('totalCases') as string, 10)
  const activeCases = parseInt(formData.get('activeCases') as string, 10)
  const avgCaseValue = parseInt(formData.get('avgCaseValue') as string, 10)
  const topRegion = (formData.get('topRegion') as string ?? '').trim()
  const conversionRate = parseFloat(formData.get('conversionRate') as string)
  const monthlyRevenue = parseInt(formData.get('monthlyRevenue') as string, 10)
  const heroTitle = (formData.get('heroTitle') as string ?? '').trim()
  const heroSubtitle = (formData.get('heroSubtitle') as string ?? '').trim()

  updateSettings({
    phone,
    platformFeeRate,
    heroTitle,
    heroSubtitle,
    stats: {
      totalCases,
      activeCases,
      avgCaseValue,
      topRegion,
      conversionRate,
      monthlyRevenue,
    },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/settings')
  revalidatePath('/')

  return { success: true }
}
