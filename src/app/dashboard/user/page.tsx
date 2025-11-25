'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  User,
  BarChart3,
  Trash2
} from 'lucide-react'
import { useAuth } from '../../../utils/authContext'
import { useReports } from '../../../utils/reportsContext'
import { formatDate, getStatusColor } from '../../../utils/helpers'
import type { Report, ReportStats, ReportStatus } from '../../../types'

export default function UserDashboardPage() {
  const { user, loading: authLoading, isUser } = useAuth()
  const { reports, deleteReport, loading } = useReports()
  const router = useRouter()

  const [userReports, setUserReports] = useState<Report[]>([])
  const [stats, setStats] = useState<ReportStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    urgent: 0
  })

  // ตรวจสอบการ login และสิทธิ์
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
    if (!authLoading && user && !isUser()) {
      router.push('/dashboard') // Admin ไปหน้า dashboard หลัก
    }
  }, [user, authLoading, isUser, router])

  // กรองรายงานของ user เฉพาะคนนี้
  useEffect(() => {
    if (user) {
      // ตั้งค่าเริ่มต้นเพื่อไม่ให้ loading นาน
      setUserReports([])
      setStats({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        urgent: 0
      })
      
      if (reports && reports.length > 0) {
        const filteredReports = reports.filter(report => 
          report.createdBy === user.name || report.contactEmail === user.email
        )
        setUserReports(filteredReports)

        // คำนวณสถิติ
        const newStats = {
          total: filteredReports.length,
          pending: filteredReports.filter(r => r.status === 'รอรับเรื่อง').length,
          inProgress: filteredReports.filter(r => r.status === 'กำลังดำเนินการ').length,
          completed: filteredReports.filter(r => r.status === 'แก้ไขเสร็จ').length,
          urgent: filteredReports.filter(r => r.priority === 'เร่งด่วน').length
        }
        setStats(newStats)
      }
    }
  }, [user, reports])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>
      </div>
    )
  }

  if (!user || !isUser()) return null

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'รอรับเรื่อง':
        return <Clock className="w-5 h-5 text-orange-600" />
      case 'กำลังดำเนินการ':
        return <AlertTriangle className="w-5 h-5 text-blue-600" />
      case 'แก้ไขเสร็จ':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'รอตรวจสอบ':
        return <Clock className="w-5 h-5 text-gray-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  // ฟังก์ชันลบรายงาน
  const handleDeleteReport = async (reportId: string, reportTitle: string) => {
    const confirmMessage = `⚠️ ยืนยันการลบรายงาน\n\n` +
      `หัวข้อ: "${reportTitle}"\n\n` +
      `หากลบแล้ว จะไม่สามารถกู้คืนได้\n` +
      `คุณต้องการดำเนินการต่อหรือไม่?`
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteReport(reportId)
        
        // optimistic update จะจัดการให้แล้ว ไม่ต้อง manual update
        setTimeout(() => {
          alert('✅ ลบรายงานสำเร็จแล้ว!')
        }, 300)
        
      } catch (error) {
        console.error('Error deleting report:', error)
        alert('❌ เกิดข้อผิดพลาดในการลบรายงาน\nกรุณาลองใหม่อีกครั้ง')
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                สวัสดี {user.name}
              </h1>
              <p className="text-gray-600 text-lg">
                คุณมีเรื่องแจ้ง <span className="font-semibold text-indigo-600">{stats.total} เรื่อง</span> ทั้งหมด
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
                  <BarChart3 className="w-4 h-4 mr-1" />
                  รายงานของคุณ
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
                <div className="flex items-center mt-2 text-orange-600 text-xs font-medium">
                  <Clock className="w-4 h-4 mr-1" />
                  รอดำเนินการ
                </div>
              </div>
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">กำลังดำเนินการ</p>
                <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
                <div className="flex items-center mt-2 text-blue-600 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  กำลังแก้ไข
                </div>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">แก้ไขเสร็จ</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
                <div className="flex items-center mt-2 text-green-600 text-xs font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  เสร็จสิ้น
                </div>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="mb-8 max-w-4xl mx-auto">
          <Link href="/dashboard/create" className="group bg-white border border-gray-200 rounded-xl p-12 shadow-sm hover:shadow-lg transition-all duration-300 block">
            <div className="flex items-center justify-center space-x-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">แจ้งปัญหาใหม่</h3>
                <p className="text-gray-600 text-lg">แจ้งปัญหาหรือข้อร้องเรียนใหม่ในหมู่บ้าน/คอนโด</p>
              </div>
            </div>
          </Link>
        </div>

        {/* My Reports */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">เรื่องแจ้งของฉัน</h2>
                <p className="text-gray-600 mt-1">รายการเรื่องที่คุณแจ้งทั้งหมด • คลิก <span className="text-red-600 font-medium">🗑️</span> เพื่อลบรายงานที่ไม่ต้องการ</p>
              </div>
              <Link href="/dashboard/create" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>แจ้งปัญหาใหม่</span>
              </Link>
            </div>
          </div>
          
          {userReports.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {userReports.slice(0, 5).map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(report.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/dashboard/reports/${report.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 cursor-pointer transition-colors">
                              {report.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {report.description.length > 100 ? report.description.substring(0, 100) + '...' : report.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                          
                          <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border-2 flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                              <span>{report.status}</span>
                            </span>
                            
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                handleDeleteReport(report.id, report.title)
                              }}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                              title="ลบรายงาน"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">ยังไม่มีเรื่องแจ้ง</h3>
              <p className="text-gray-500 mb-6">เริ่มต้นแจ้งปัญหาหรือข้อร้องเรียนของคุณ</p>
              <Link href="/dashboard/create" className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                <Plus className="w-5 h-5" />
                <span>แจ้งปัญหาใหม่</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}