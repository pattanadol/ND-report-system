'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Plus, 
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../../utils/authContext'
import { useReports } from '../../utils/reportsContext'
import { formatDate, getStatusColor, getPriorityColor } from '../../utils/helpers'

export default function DashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const { reports, getStats, loading } = useReports()
  const router = useRouter()

  // ตรวจสอบการ login และ redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user && user.role === 'user') {
      // Redirect users to their dashboard only once
      router.replace('/dashboard/user')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>
      </div>
    )
  }

  // Redirect users to their dashboard
  if (user && user.role === 'user') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังนำทางไปยังหน้าของคุณ...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Admin dashboard only
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">ไม่มีสิทธิ์เข้าถึงหน้านี้</p>
        </div>
      </div>
    )
  }

  const stats = getStats()
  const recentReports = reports.slice(0, 3) // แสดง 3 รายการล่าสุด

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                คุณมีเรื่องแจ้งทั้งหมด <span className="font-semibold text-indigo-600">{stats.total} เรื่อง</span> ที่จัดการในระบบ
              </p>
            </div>
            <div className="text-right bg-white rounded-lg p-4 shadow-sm border border-slate-200">
              <div className="text-sm font-medium text-slate-600">วันที่</div>
              <div className="text-lg font-bold text-slate-800">{formatDate(new Date())}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">เรื่องแจ้งทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                <div className="flex items-center mt-2 text-indigo-600 text-xs font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  รายงานล่าสุด
                </div>
              </div>
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">รอรับเรื่อง</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
                <div className="flex items-center mt-2 text-amber-600 text-xs font-medium">
                  <Clock className="w-4 h-4 mr-1" />
                  ต้องสนใจ
                </div>
              </div>
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">แก้ไขเสร็จ</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
                <div className="flex items-center mt-2 text-emerald-600 text-xs font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  สำเร็จ 100%
                </div>
              </div>
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">เร่งด่วน</p>
                <p className="text-3xl font-bold text-gray-800">{stats.urgent}</p>
                <div className="flex items-center mt-2 text-red-600 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  เร่งด่วน
                </div>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 max-w-6xl mx-auto">
          <Link href="/dashboard/create" className="group bg-white border border-gray-200 rounded-xl p-12 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-200">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">แจ้งปัญหาใหม่</h3>
                <p className="text-gray-600 text-lg">แจ้งปัญหาในหมู่บ้านหรือคอนโด</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/reports" className="group bg-white border border-slate-200 rounded-xl p-12 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-200">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">จัดการเรื่องแจ้ง</h3>
                <p className="text-slate-600 text-lg">ดูและจัดการเรื่องแจ้งทั้งหมด (Admin)</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Reports */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">เรื่องแจ้งล่าสุด</h2>
                <p className="text-gray-600 mt-1">เรื่องแจ้งที่อัปเดตล่าสุด</p>
              </div>
              <Link href="/dashboard/reports" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl">
                ดูทั้งหมด
              </Link>
            </div>
          </div>
          
          {recentReports.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentReports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {report.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <span>หมวดหมู่: {report.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-4 h-4" />
                          <span>ระดับ: {report.priority}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(report.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* สถานะ - Badge กลม */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border-2 flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                        <span>{report.status}</span>
                      </span>
                      
                      {/* ความสำคัญ - Tag สี่เหลี่ยม */}
                      <span className={`px-3 py-1.5 rounded text-xs font-semibold text-white shadow-sm ${
                        report.priority === 'เร่งด่วน' ? 'bg-red-600' :
                        report.priority === 'สูง' ? 'bg-orange-600' :
                        report.priority === 'ปานกลาง' ? 'bg-yellow-600' :
                        report.priority === 'ต่ำ' ? 'bg-green-600' :
                        'bg-gray-600'
                      }`}>
                        {report.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">ยังไม่มีเรื่องแจ้ง</h3>
              <p className="text-gray-600 mb-6">เริ่มแจ้งปัญหาครั้งแรกของคุณเลย</p>
              <Link href="/dashboard/create" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg">
                แจ้งปัญหาใหม่
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}