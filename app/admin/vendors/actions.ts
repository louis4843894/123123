'use server'

import { revalidatePath } from 'next/cache'
import { approvePendingVendor, rejectPendingVendor, updateVendorStatus } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'admin') throw new Error('未授權')
}

export async function approveVendorAction(id: string) {
  await requireAdmin()
  approvePendingVendor(id)
  revalidatePath('/admin/vendors')
  revalidatePath('/admin')
}

export async function rejectVendorAction(id: string) {
  await requireAdmin()
  rejectPendingVendor(id)
  revalidatePath('/admin/vendors')
  revalidatePath('/admin')
}

export async function suspendVendorAction(id: string) {
  await requireAdmin()
  updateVendorStatus(id, 'suspended')
  revalidatePath('/admin/vendors')
}

export async function reinstateVendorAction(id: string) {
  await requireAdmin()
  updateVendorStatus(id, 'approved')
  revalidatePath('/admin/vendors')
}
