'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { login, encodeSession } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string ?? '').trim()
  const password = (formData.get('password') as string ?? '').trim()

  if (!email || !password) {
    return { error: '請填寫帳號與密碼' }
  }

  const result = await login(email, password)
  if (!result.success || !result.session) {
    return { error: result.error ?? '登入失敗，請再試一次' }
  }

  const cookieStore = await cookies()
  cookieStore.set('session', encodeSession(result.session), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const role = result.session.role
  if (role === 'admin') redirect('/admin')
  if (role === 'vendor') redirect('/vendor')
  redirect('/cases')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/')
}
