'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Shield,
  Paperclip
} from 'lucide-react'
import { useAuth } from '../../../utils/authContext'
import { useReports } from '../../../utils/reportsContext'
import { formatDate, getStatusColor, getPriorityColor, truncateText } from '../../../utils/helpers'
import type { ReportStatus } from '../../../types'

const statusOptions = [
  { value: '', label: 'ทุกสถานะ' },
  { value: 'รอรับเรื่อง', label: 'รอรับเรื่อง' },
  { value: 'กำลังดำเนินการ', label: 'กำลังดำเนินการ' },
  { value: 'แก้ไขเสร็จ', label: 'แก้ไขเสร็จ' }
]

const priorityOptions = [
  { value: '', label: 'ทุกระดับ' },
  { value: 'ต่ำ', label: 'ต่ำ' },
  { value: 'ปานกลาง', label: 'ปานกลาง' },
  { value: 'สูง', label: 'สูง' },
  { value: 'เร่งด่วน', label: 'เร่งด่วน' }
]

export default function ReportsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const { reports, updateReportStatus, deleteReport, loading } = useReports()
  const router = useRouter()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  // ตรวจสอบการ login และสิทธิ์
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user && !isAdmin) {
      router.push('/dashboard/user')
    }
  }, [user, authLoading, router, isAdmin])

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

  // Protection against non-admin access
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

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">ไม่มีสิทธิ์เข้าถึง</h3>
          <p className="text-slate-600 mb-6">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
        </div>
      </div>
    )
  }

  // กรองรายงาน
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || report.status === statusFilter
    const matchesPriority = !priorityFilter || report.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    console.log('🔄 Reports Page: Status change requested:', { reportId, newStatus })
    console.log('👤 Current user:', { user, isAdmin })
    
    try {
      await updateReportStatus(reportId, newStatus)
      setShowActionMenu(null)
      
      console.log('✅ Reports Page: Status updated successfully')
      
      // แสดง toast notification (สั้นๆ แทน alert)
      const successMessages = {
        'รอรับเรื่อง': '✅ เปลี่ยนสถานะเป็น "รอรับเรื่อง" เรียบร้อย',
        'กำลังดำเนินการ': '⚙️ เริ่มดำเนินการแก้ไขแล้ว',
        'แก้ไขเสร็จ': '✨ ดำเนินการเสร็จสมบูรณ์!'
      }
      
      setTimeout(() => {
        alert(successMessages[newStatus] || '✅ อัปเดตสถานะสำเร็จ')
      }, 300) // รอให้ UI อัปเดตก่อน
      
    } catch (error) {
      console.error('❌ Reports Page: Error updating status:', error)
      alert(`❌ เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${error instanceof Error ? error.message : 'ข้อผิดพลาดไม่ทราบสาเหตุ'}`)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    const reportToDelete = filteredReports.find(r => r.id === reportId)
    const confirmMessage = `⚠️ ยืนยันการลบรายงาน\n\n` +
      `หัวข้อ: "${reportToDelete?.title || 'ไม่ทราบชื่อ'}"\n` +
      `ผู้แจ้ง: ${reportToDelete?.createdBy || 'ไม่ทราบชื่อ'}\n\n` +
      `หากลบแล้ว จะไม่สามารถกู้คืนได้\n` +
      `คุณต้องการดำเนินการต่อหรือไม่?`
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteReport(reportId)
        setShowActionMenu(null)
        
        setTimeout(() => {
          alert('✅ ลบรายงานสำเร็จแล้ว!')
        }, 300)
        
      } catch (error) {
        console.error('Error deleting report:', error)
        alert('❌ เกิดข้อผิดพลาดในการลบรายงาน กรุณาลองใหม่')
      }
    }
  }

  const getStatusBadgeColor = (status: ReportStatus) => {
    switch (status) {
      case 'รอรับเรื่อง':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'กำลังดำเนินการ':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'แก้ไขเสร็จ':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'รอตรวจสอบ':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'รอรับเรื่อง':
        return <Clock className="w-4 h-4" />
      case 'กำลังดำเนินการ':
        return <AlertTriangle className="w-4 h-4" />
      case 'แก้ไขเสร็จ':
        return <CheckCircle className="w-4 h-4" />
      case 'รอตรวจสอบ':
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">เรื่องแจ้งทั้งหมด</h1>
              <p className="text-gray-600 text-sm sm:text-lg">
                จัดการและติดตามเรื่องแจ้งของคุณ ({filteredReports.length} รายการ)
              </p>
            </div>
            <Link
              href="/dashboard/create"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">สร้างรายงานใหม่</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters - Mobile optimized */}}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหารายงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>ตัวกรอง</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ระดับความสำคัญ</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {priorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reports List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          {filteredReports.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredReports.map((report) => (
                <div key={report.id} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`p-2 rounded-full ${getStatusColor(report.status)}`}>
                            {getStatusIcon(report.status)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/dashboard/reports/${report.id}`}>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 cursor-pointer transition-colors line-clamp-2">
                              {report.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-3">
                            {truncateText(report.description, 120)}
                          </p>
                          
                          {/* Mobile-optimized info grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              <span className="truncate">หมวดหมู่: {report.category}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">ระดับ: {report.priority}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">ผู้แจ้ง: {report.createdBy}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{formatDate(report.date)}</span>
                            </div>
                          </div>
                          {report.attachments && report.attachments.length > 0 && (
                            <div className="flex items-center space-x-1 text-blue-600 mt-2">
                              <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="text-xs">{report.attachments.length} ไฟล์</span>
                            </div>
                          )}
                          
                          {/* Status and Priority - Mobile optimized */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
                            {/* สถานะ - Badge */}
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(report.status)}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></div>
                              <span>{report.status}</span>
                            </span>
                            
                            {/* ความสำคัญ - Tag */}
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-white shadow-sm ${
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
                    </div>
                    
                    {/* Actions - Mobile friendly */}
                    <div className="flex-shrink-0 relative action-menu-container">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === report.id ? null : report.id)}
                        className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {showActionMenu === report.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-48">
                          <Link
                            href={`/dashboard/reports/${report.id}`}
                            className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowActionMenu(null)}
                          >
                            <Eye className="w-4 h-4" />
                            <span>ดูรายละเอียด</span>
                          </Link>
                          
                          <div className="border-t border-gray-100 my-1"></div>
                          <div className="px-2 py-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">เปลี่ยนสถานะ</p>
                          </div>
                          
                          <button
                            onClick={() => handleStatusChange(report.id, 'รอรับเรื่อง')}
                            className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                              report.status === 'รอรับเรื่อง' 
                                ? 'text-orange-700 bg-orange-50 cursor-not-allowed' 
                                : 'text-orange-700 hover:bg-orange-50'
                            }`}
                            disabled={report.status === 'รอรับเรื่อง'}
                          >
                            <Clock className="w-4 h-4" />
                            <span>รอรับเรื่อง</span>
                          </button>
                          
                          <button
                            onClick={() => handleStatusChange(report.id, 'กำลังดำเนินการ')}
                            className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                              report.status === 'กำลังดำเนินการ' 
                                ? 'text-blue-700 bg-blue-50 cursor-not-allowed' 
                                : 'text-blue-700 hover:bg-blue-50'
                            }`}
                            disabled={report.status === 'กำลังดำเนินการ'}
                          >
                            <AlertTriangle className="w-4 h-4" />
                            <span>กำลังดำเนินการ</span>
                          </button>
                          
                          <button
                            onClick={() => handleStatusChange(report.id, 'แก้ไขเสร็จ')}
                            className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                              report.status === 'แก้ไขเสร็จ' 
                                ? 'text-green-700 bg-green-50 cursor-not-allowed' 
                                : 'text-green-700 hover:bg-green-50'
                            }`}
                            disabled={report.status === 'แก้ไขเสร็จ'}
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>แก้ไขเสร็จ</span>
                          </button>
                          
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
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
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                {searchTerm || statusFilter || priorityFilter 
                  ? 'ไม่พบรายงานที่ตรงกับเงื่อนไข' 
                  : 'ยังไม่มีรายงาน'
                }
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter || priorityFilter
                  ? 'ลองเปลี่ยนเงื่อนไขการค้นหาหรือตัวกรอง'
                  : 'เริ่มสร้างรายงานแรกของคุณเลย'
                }
              </p>
              {!searchTerm && !statusFilter && !priorityFilter && (
                <Link
                  href="/dashboard/create"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>สร้างรายงานใหม่</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}