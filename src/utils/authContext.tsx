'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { User, AuthContextType, LoginForm, RegisterForm } from '../types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ตรวจสอบการ login เมื่อเริ่มต้น
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData: User = JSON.parse(savedUser)
      // อัปเดตชื่อใหม่ถ้าเป็น admin
      if (userData.email === 'admin@test.com') {
        userData.name = 'พัฒนดล นิโครธานนท์'
        localStorage.setItem('user', JSON.stringify(userData))
      }
      setUser(userData)
    }
    setLoading(false)
  }, [])

  // ฟังก์ชัน login
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // จำลองการ login (ในระบบจริงจะเรียก API)
      if (email === 'admin@test.com' && password === '123456') {
        const userData: User = {
          id: 1,
          email: email,
          name: 'พัฒนดล นิโครธานนท์',
          role: 'admin'
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        router.push('/dashboard')
        return { success: true }
      } else if (email === 'user@test.com' && password === '123456') {
        const userData: User = {
          id: 2,
          email: email,
          name: 'ผู้ใช้ทั่วไป',
          role: 'user'
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        router.push('/dashboard')
        return { success: true }
      } else if (email === 'testuser@test.com' && password === '123456') {
        const userData: User = {
          id: 3,
          email: email,
          name: 'ผู้ใช้ทดสอบ',
          role: 'user'
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        router.push('/dashboard')
        return { success: true }
      }
      return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' }
    }
  }

  const register = async (userData: { name: string; email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const newUser: User = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: 'user'
      }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      router.push('/dashboard')
      return { success: true }
    } catch (error) {
      return { success: false, error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' }
    }
  }

  // ฟังก์ชัน logout
  const logout = (): void => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/')
  }

  // เพิ่มฟังก์ชันตรวจสอบสิทธิ์
  const isAdmin: boolean = user?.role === 'admin' || false

  const isUser = (): boolean => {
    return user?.role === 'user' || false
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isAdmin,
      isUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}