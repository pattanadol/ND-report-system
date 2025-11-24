'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  FileText, 
  Plus, 
  Settings, 
  User, 
  LogOut,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Bell,
  Shield
} from 'lucide-react'
import { useAuth } from '../../utils/authContext'

export default function DashboardLayout({ children }) {
  const { user, logout, loading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // ตรวจสอบการ login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // แสดง loading ขณะตรวจสอบ authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  // ถ้ายังไม่ได้ login
  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-800">ND Report</span>
                  <div className="text-xs text-indigo-600 font-medium">ระบบแจ้งเรื่อง</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  {user.role === 'admin' ? (
                    <Shield className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <User className="w-6 h-6 text-indigo-600" />
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-600">
                    {user.email} • {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
          <nav className="p-6 space-y-2">
            <div className="mb-8">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                {user.role === 'admin' ? 'เมนูผู้ดูแล' : 'เมนูผู้ใช้'}
              </h2>
            </div>
            
            {user.role === 'admin' ? (
              // Admin Menu
              <>
                <Link href="/dashboard" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === '/dashboard' 
                    ? 'text-white bg-indigo-600 shadow-md' 
                    : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                }`}>
                  <Home className="w-5 h-5" />
                  <span className="font-semibold">Admin Dashboard</span>
                </Link>
                
                <Link href="/dashboard/reports" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === '/dashboard/reports' 
                    ? 'text-white bg-indigo-600 shadow-md' 
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}>
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">จัดการเรื่องแจ้ง</span>
                </Link>
                
                <Link href="/dashboard/create" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === '/dashboard/create' 
                    ? 'text-white bg-indigo-600 shadow-md' 
                    : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                }`}>
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">แจ้งปัญหาใหม่</span>
                </Link>
              </>
            ) : (
              // User Menu
              <>
                <Link href="/dashboard/user" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === '/dashboard/user' 
                    ? 'text-white bg-indigo-600 shadow-md' 
                    : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                }`}>
                  <Home className="w-5 h-5" />
                  <span className="font-semibold">หน้าหลัก</span>
                </Link>
                
                <Link href="/dashboard/create" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === '/dashboard/create' 
                    ? 'text-white bg-indigo-600 shadow-md' 
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}>
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">แจ้งปัญหาใหม่</span>
                </Link>
              </>
            )}
            
            <div className="border-t border-slate-200 pt-6 mt-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">ตั้งค่า</h3>
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-slate-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}