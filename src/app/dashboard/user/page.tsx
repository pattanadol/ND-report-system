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
  Trash2,
  Paperclip,
  MoreVertical,
  Eye
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
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)

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
    if (user && reports) {
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
  }, [user, reports])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActionMenu && event.target && !(event.target as Element).closest('.action-menu-container')) {
        setShowActionMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showActionMenu])

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                สวัสดี {user.name}
              </h1>
              <p className="text-gray-600 text-sm sm:text-lg">
                คุณมีเรื่องแจ้ง <span className="font-semibold text-indigo-600">{stats.total} เรื่อง</span> ทั้งหมด
              </p>
            </div>
            <div className="card-compact bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 text-center sm:text-right">
              <div className="text-xs sm:text-sm font-medium text-slate-600 mb-1">วันที่</div>
              <div className="text-sm sm:text-lg font-bold text-slate-800">{formatDate(new Date())}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="card-compact">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">เรื่องแจ้งทั้งหมด</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">{stats.total}</p>
                <div className="flex items-center text-indigo-600 text-xs font-medium">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  รายงานของคุณ
                </div>
              </div>
              <div className="w-8 h-8 sm:w-14 sm:h-14 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center mt-2 sm:mt-0 self-end sm:self-auto">
                <FileText className="w-4 h-4 sm:w-7 sm:h-7 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">รอรับเรื่อง</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">{stats.pending}</p>
                <div className="flex items-center text-orange-600 text-xs font-medium">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  รอดำเนินการ
                </div>
              </div>
              <div className="w-8 h-8 sm:w-14 sm:h-14 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mt-2 sm:mt-0 self-end sm:self-auto">
                <Clock className="w-4 h-4 sm:w-7 sm:h-7 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">กำลังดำเนินการ</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">{stats.inProgress}</p>
                <div className="flex items-center text-blue-600 text-xs font-medium">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  กำลังแก้ไข
                </div>
              </div>
              <div className="w-8 h-8 sm:w-14 sm:h-14 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mt-2 sm:mt-0 self-end sm:self-auto">
                <AlertTriangle className="w-4 h-4 sm:w-7 sm:h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1">แก้ไขเสร็จ</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">{stats.completed}</p>
                <div className="flex items-center text-green-600 text-xs font-medium">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  เสร็จสิ้น
                </div>
              </div>
              <div className="w-8 h-8 sm:w-14 sm:h-14 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mt-2 sm:mt-0 self-end sm:self-auto">
                <CheckCircle className="w-4 h-4 sm:w-7 sm:h-7 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* My Reports */}
        <div className="card-compact">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">เรื่องแจ้งของฉัน</h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  รายการเรื่องที่คุณแจ้งทั้งหมด • คลิก <span className="text-red-600 font-medium">🗑️</span> เพื่อลบรายงานที่ไม่ต้องการ
                </p>
              </div>
              <Link href="/dashboard/create" className="btn-primary text-xs sm:text-sm w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                <span>แจ้งปัญหาใหม่</span>
              </Link>
            </div>
          </div>
          
          {userReports.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {userReports.slice(0, 5).map((report) => (
                <div key={report.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(report.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/dashboard/reports/${report.id}`}>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2">
                              {report.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mb-3 text-sm sm:text-base line-clamp-2">
                            {report.description.length > 100 ? report.description.substring(0, 100) + '...' : report.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                              <span>หมวดหมู่: {report.category}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>ระดับ: {report.priority}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{formatDate(report.date)}</span>
                            </div>
                            {report.attachments && report.attachments.length > 0 && (
                              <div className="flex items-center space-x-1 text-blue-600">
                                <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs">{report.attachments.length} ไฟล์</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border-2 flex items-center space-x-1 w-fit ${getStatusColor(report.status)}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                              <span>{report.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Menu */}
                    <div className="flex-shrink-0 relative action-menu-container">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === report.id ? null : report.id)}
                        className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {showActionMenu === report.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-40">
                          <Link
                            href={`/dashboard/reports/${report.id}`}
                            className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowActionMenu(null)}
                          >
                            <Eye className="w-4 h-4" />
                            <span>ดูรายละเอียด</span>
                          </Link>
                          
                          <div className="border-t border-gray-100 my-1"></div>
                          
                          <button
                            onClick={() => {
                              setShowActionMenu(null)
                              handleDeleteReport(report.id, report.title)
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>ลบเรื่องแจ้ง</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 sm:p-12 text-center">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">ยังไม่มีเรื่องแจ้ง</h3>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">เริ่มต้นแจ้งปัญหาหรือข้อร้องเรียนของคุณ</p>
              <Link href="/dashboard/create" className="btn-primary">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>แจ้งปัญหาใหม่</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}