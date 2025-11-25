'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { User, AuthContextType, LoginForm, RegisterForm } from '../types'
import { authService, type UserProfile } from '../lib/services'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ตรวจสอบการ login เมื่อเริ่มต้นด้วย Firebase
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((userProfile: UserProfile | null) => {
      if (userProfile) {
        console.log('🔐 Auth: User profile received:', {
          uid: userProfile.uid,
          email: userProfile.email,
          name: userProfile.name,
          isAdmin: userProfile.isAdmin
        })
        
        // แปลง UserProfile เป็น User format เดิม
        const userData: User = {
          id: parseInt(userProfile.uid.slice(-6)), // ใช้ 6 ตัวท้ายของ uid เป็น id
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.isAdmin ? 'admin' : 'user'
        }
        
        console.log('👤 Auth: User data set:', userData)
        setUser(userData)
      } else {
        console.log('🚪 Auth: User logged out')
        setUser(null)
      }
      setLoading(false)
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  // ฟังก์ชัน login ด้วย Firebase
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Starting login...', email)
      const userProfile = await authService.login({ email, password })
      console.log('Login successful:', userProfile)
      
      // แปลง UserProfile เป็น User format เดิม
      const userData: User = {
        id: parseInt(userProfile.uid.slice(-6)),
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.isAdmin ? 'admin' : 'user'
      }
      
      setUser(userData)
      
      // Redirect ทันทีตาม role
      if (userData.role === 'admin') {
        router.replace('/dashboard')  // Admin ไปหน้า dashboard หลัก
      } else {
        router.replace('/dashboard/user')  // User ไปหน้า user dashboard
      }
      
      return { success: true }
      
    } catch (error: any) {
      console.error('Login error:', error)
      // ส่ง error message ที่ชัดเจนกว่า
      const errorMessage = error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData: { name: string; email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Starting registration...', userData.email)
      const userProfile = await authService.register(userData)
      console.log('Registration successful:', userProfile)
      
      // แปลง UserProfile เป็น User format เดิม
      const newUser: User = {
        id: parseInt(userProfile.uid.slice(-6)),
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.isAdmin ? 'admin' : 'user'
      }
      
      setUser(newUser)
      
      // Redirect ตาม role
      if (newUser.role === 'admin') {
        router.push('/dashboard')  // Admin ไปหน้า dashboard หลัก
      } else {
        router.push('/dashboard/user')  // User ไปหน้า user dashboard
      }
      
      return { success: true }
      
    } catch (error: any) {
      console.error('Register error:', error)
      // ส่ง error message ที่ชัดเจนกว่า
      const errorMessage = error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
      return { success: false, error: errorMessage }
    }
  }

  // ฟังก์ชัน logout ด้วย Firebase
  const logout = async (): Promise<void> => {
    try {
      await authService.signOut()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      // ถึงแม้จะ error ก็ให้ logout ใน UI
      setUser(null)
      router.push('/')
    }
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