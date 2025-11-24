'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ตรวจสอบการ login เมื่อเริ่มต้น
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
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
  const login = async (email, password) => {
    try {
      // จำลองการ login (ในระบบจริงจะเรียก API)
      if (email === 'admin@test.com' && password === '123456') {
        const userData = {
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
        const userData = {
          id: 2,
          email: email,
          name: 'ผู้ใช้ทั่วไป',
          role: 'user'
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        router.push('/dashboard')
        return { success: true }
      } else {
        return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
      }
    } catch (error) {
      return { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }
    }
  }

  // ฟังก์ชัน register
  const register = async (userData) => {
    try {
      // จำลองการ register
      const newUser = {
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
      return { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }
    }
  }

  // ฟังก์ชัน logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/')
  }

  // เพิ่มฟังก์ชันตรวจสอบสิทธิ์
  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isUser = () => {
    return user?.role === 'user'
  }

  const hasPermission = (permission) => {
    if (!user) return false
    
    const permissions = {
      'admin': ['view_all_reports', 'manage_status', 'delete_reports', 'view_dashboard', 'create_reports'],
      'user': ['view_own_reports', 'create_reports']
    }
    
    return permissions[user.role]?.includes(permission) || false
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isAdmin,
      isUser,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}