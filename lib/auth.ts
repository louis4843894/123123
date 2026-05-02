import 'server-only'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

export type UserRole = 'admin' | 'vendor' | 'family'

export interface User {
  id: string
  email: string
  passwordHash: string
  name: string
  role: UserRole
  vendorId?: string
  createdAt: string
}

export interface Session {
  userId: string
  email: string
  name: string
  role: UserRole
  vendorId?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readUsers(): User[] {
  ensureDataDir()
  if (!fs.existsSync(USERS_FILE)) {
    // Seed default admin account
    const defaultUsers: User[] = [
      {
        id: 'u1',
        email: 'admin@jingtv.com',
        // password: admin123
        passwordHash: '$2b$10$placeholder_admin',
        name: '平台管理員',
        role: 'admin',
        createdAt: '2024-01-01',
      },
    ]
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), 'utf-8')
    return defaultUsers
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
}

/** Simple hash check — in production use bcrypt. Here we store a known hash or plaintext comparison for demo. */
function verifyPassword(plain: string, stored: string): boolean {
  // For demo: stored starts with '$2b$' means hashed — compare known defaults
  // Otherwise compare plain text (for user-added accounts)
  if (stored === plain) return true
  // Default admin password check
  if (stored === '$2b$10$placeholder_admin' && plain === 'admin123') return true
  if (stored === '$2b$10$placeholder_vendor' && plain === 'vendor123') return true
  if (stored === '$2b$10$placeholder_family' && plain === 'family123') return true
  return false
}

export function hashPassword(plain: string): string {
  // For demo without bcrypt: just store plaintext with prefix
  return plain
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; session?: Session }> {
  const users = readUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return { success: false, error: '帳號或密碼錯誤' }
  if (!verifyPassword(password, user.passwordHash)) return { success: false, error: '帳號或密碼錯誤' }

  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    vendorId: user.vendorId,
  }
  return { success: true, session }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get('session')?.value
  if (!raw) return null
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as Session
  } catch {
    return null
  }
}

export function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session)).toString('base64')
}

export function getUsers(): User[] {
  return readUsers()
}

export function addUser(user: User): void {
  const users = readUsers()
  users.push(user)
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}
