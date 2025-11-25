'use client'
import { useEffect, ReactNode, useState } from 'react'
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
  Shield,
  Info,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../../utils/authContext'
import { useReports } from '../../utils/reportsContext'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, loading, isAdmin } = useAuth()
  const { reports: allReports } = useReports()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ตรวจสอบการ login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // แสดง loading ขณะตรวจสอบ authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
          <div className="mt-2 text-xs text-gray-400">
            กรุณารอสักครู่...
          </div>
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
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-bold text-gray-800">ND Report</span>
                  <div className="text-xs text-indigo-600 font-medium hidden sm:block">ระบบแจ้งเรื่อง</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  {user.role === 'admin' ? (
                    <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600" />
                  ) : (
                    <User className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600" />
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-600">
                    {user.email} • {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                  </div>
                </div>
                <div className="md:hidden">
                  <div className="text-sm font-semibold text-slate-800 truncate max-w-24">
                    {user.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 min-h-screen">
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
                  <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {allReports.length}
                  </span>
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
                  <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {allReports.filter(report => report.createdBy === user.name).length}
                  </span>
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
              <Link href="/dashboard/about" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-6 ${
                pathname === '/dashboard/about' 
                  ? 'text-white bg-indigo-600 shadow-md' 
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
              }`}>
                <Info className="w-5 h-5" />
                <span className="font-medium">เกี่ยวกับเรา</span>
              </Link>
              
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

        {/* Mobile Sidebar */}
        <aside className={`fixed top-0 left-0 z-50 w-64 h-full bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-800">ND Report</span>
                  <div className="text-xs text-indigo-600 font-medium">ระบบแจ้งเรื่อง</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile User Info */}
            <div className="mb-8 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  {user.role === 'admin' ? (
                    <Shield className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <User className="w-6 h-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-600 truncate">
                    {user.email}
                  </div>
                  <div className="text-xs text-indigo-600 font-medium">
                    {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                  </div>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              <div className="mb-6">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {user.role === 'admin' ? 'เมนูผู้ดูแล' : 'เมนูผู้ใช้'}
                </h2>
              </div>
              
              {user.role === 'admin' ? (
                // Admin Mobile Menu
                <>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === '/dashboard' 
                        ? 'text-white bg-indigo-600 shadow-md' 
                        : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Admin Dashboard</span>
                  </Link>
                  
                  <Link 
                    href="/dashboard/reports" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === '/dashboard/reports' 
                        ? 'text-white bg-indigo-600 shadow-md' 
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">จัดการเรื่องแจ้ง</span>
                    <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {allReports.length}
                    </span>
                  </Link>
                  
                  <Link 
                    href="/dashboard/create" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === '/dashboard/create' 
                        ? 'text-white bg-indigo-600 shadow-md' 
                        : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">แจ้งปัญหาใหม่</span>
                  </Link>
                </>
              ) : (
                // User Mobile Menu
                <>
                  <Link 
                    href="/dashboard/user" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === '/dashboard/user' 
                        ? 'text-white bg-indigo-600 shadow-md' 
                        : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">หน้าหลัก</span>
                    <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {allReports.filter(report => report.createdBy === user.name).length}
                    </span>
                  </Link>
                  
                  <Link 
                    href="/dashboard/create" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === '/dashboard/create' 
                        ? 'text-white bg-indigo-600 shadow-md' 
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">แจ้งปัญหาใหม่</span>
                  </Link>
                </>
              )}
              
              <div className="border-t border-slate-200 pt-6 mt-6">
                <Link 
                  href="/dashboard/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-6 ${
                    pathname === '/dashboard/about' 
                      ? 'text-white bg-indigo-600 shadow-md' 
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <Info className="w-5 h-5" />
                  <span className="font-medium">เกี่ยวกับเรา</span>
                </Link>
                
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
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-slate-50 min-h-screen">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}