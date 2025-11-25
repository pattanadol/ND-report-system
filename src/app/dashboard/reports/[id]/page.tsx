'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  FileText,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Image as ImageIcon,
  Download
} from 'lucide-react'
import { useAuth } from '../../../../utils/authContext'
import { useReports } from '../../../../utils/reportsContext'
import { formatDate, formatDateTime, getStatusColor, getPriorityColor } from '../../../../utils/helpers'
import type { ReportStatus } from '../../../../types'

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const { reports, updateReportStatus, deleteReport, loading } = useReports()
  const router = useRouter()
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])

  const reportId = params.id
  const report = reports.find(r => r.id === reportId)

  // ตรวจสอบการ login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // ถ้าโหลดเสร็จแล้วแต่ไม่พบรายงาน
  if (!loading && !report) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบเรื่องแจ้งนี้</h1>
            <p className="text-gray-600 mb-6">เรื่องแจ้งที่คุณต้องการดูอาจถูกลบหรือไม่มีอยู่ในระบบ</p>
            <Link 
              href="/dashboard/reports"
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>กลับไปรายการเรื่องแจ้ง</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // โหลดคอมเมนต์จำลอง
  useEffect(() => {
    if (report) {
      setComments([
        {
          id: 1,
          author: 'ผู้ดูแลระบบ',
          message: 'ได้รับการแจ้งแล้ว กำลังตรวจสอบ',
          timestamp: '2024-11-24 10:30',
          isAdmin: true
        },
        {
          id: 2,
          author: report.createdBy || 'ผู้แจ้ง',
          message: 'ขอบคุณครับ รอการแก้ไข',
          timestamp: '2024-11-24 11:00',
          isAdmin: false
        }
      ])
    }
  }, [report])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!user) return null
  if (!report) return notFound()

  const handleStatusChange = async (newStatus: ReportStatus) => {
    try {
      await updateReportStatus(reportId, newStatus)
      
      // แสดง success message
      const successMessages = {
        'รอรับเรื่อง': '✅ เปลี่ยนสถานะเป็น "รอรับเรื่อง" เรียบร้อย',
        'กำลังดำเนินการ': '⚙️ เริ่มดำเนินการแก้ไขแล้ว',
        'แก้ไขเสร็จ': '✨ ดำเนินการเสร็จสมบูรณ์!'
      }
      
      setTimeout(() => {
        alert(successMessages[newStatus] || '✅ อัปเดตสถานะเรียบร้อย')
      }, 300)
      
    } catch (error) {
      console.error('Error updating status:', error)
      alert('❌ เกิดข้อผิดพลาดในการอัปเดตสถานะ กรุณาลองใหม่')
    }
  }

  const handleDeleteReport = async () => {
    const confirmMessage = `⚠️ ยืนยันการลบรายงาน\n\n` +
      `หัวข้อ: "${report.title}"\n` +
      `ผู้แจ้ง: ${report.createdBy}\n\n` +
      `หากลบแล้ว จะไม่สามารถกู้คืนได้\n` +
      `คุณต้องการดำเนินการต่อหรือไม่?`
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteReport(reportId)
        
        // ร้อ redirect ให้ optimistic update ทำงานก่อน
        setTimeout(() => {
          alert('✅ ลบรายงานสำเร็จแล้ว!')
          router.push('/dashboard/reports')
        }, 500)
        
      } catch (error) {
        console.error('Error deleting report:', error)
        alert('❌ เกิดข้อผิดพลาดในการลบรายงาน กรุณาลองใหม่')
      }
    }
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: user?.name || '',
        message: newComment,
        timestamp: new Date().toLocaleString('th-TH'),
        isAdmin: user?.role === 'admin'
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

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

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/dashboard/reports"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>กลับไปรายการเรื่องแจ้ง</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.print()}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteReport}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                {getStatusIcon(report.status)}
                <h1 className="text-3xl font-bold text-gray-800">{report.title}</h1>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>รหัส: #{report.id}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(report.date)}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* สถานะ - แบบ Progress Bar */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">สถานะดำเนินการ</span>
                  {getStatusIcon(report.status)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className={`h-2 rounded-full transition-all duration-300 ${
                    report.status === 'รอรับเรื่อง' ? 'w-1/3 bg-orange-500' :
                    report.status === 'กำลังดำเนินการ' ? 'w-2/3 bg-blue-500' :
                    report.status === 'แก้ไขเสร็จ' ? 'w-full bg-green-500' :
                    'w-0 bg-gray-300'
                  }`}></div>
                </div>
                <span className={`text-sm font-semibold ${
                  report.status === 'รอรับเรื่อง' ? 'text-orange-700' :
                  report.status === 'กำลังดำเนินการ' ? 'text-blue-700' :
                  report.status === 'รอตรวจสอบ' ? 'text-gray-700' :
                  report.status === 'แก้ไขเสร็จ' ? 'text-green-700' :
                  'text-gray-500'
                }`}>{report.status}</span>
              </div>
              
              {/* ความสำคัญ - แบบ Alert Card */}
              <div className={`rounded-lg p-3 border-l-4 ${
                report.priority.includes('เร่งด่วน') ? 'bg-red-50 border-l-red-500' :
                report.priority.includes('สูง') ? 'bg-orange-50 border-l-orange-500' :
                report.priority.includes('ปานกลาง') ? 'bg-yellow-50 border-l-yellow-500' :
                report.priority.includes('ต่ำ') ? 'bg-green-50 border-l-green-500' :
                'bg-gray-50 border-l-gray-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">ระดับความสำคัญ</div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${
                        report.priority.includes('เร่งด่วน') ? 'text-red-700' :
                        report.priority.includes('สูง') ? 'text-orange-700' :
                        report.priority.includes('ปานกลาง') ? 'text-yellow-700' :
                        report.priority.includes('ต่ำ') ? 'text-green-700' :
                        'text-gray-700'
                      }`}>{report.priority}</span>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {report.priority.includes('เร่งด่วน') && '🚨'}
                    {report.priority.includes('สูง') && '⚠️'}
                    {report.priority.includes('ปานกลาง') && '⏰'}
                    {report.priority.includes('ต่ำ') && '✅'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">รายละเอียดรายงาน</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">หมวดหมู่</label>
                  <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                    report.category === 'ปลุกรักษ์' ? 'bg-red-100 text-red-700' :
                    report.category === 'แก้ไขระบบ' ? 'bg-blue-100 text-blue-700' :
                    report.category === 'สาธารณูปโภค' ? 'bg-green-100 text-green-700' :
                    report.category === 'ความปลอดภัย' ? 'bg-orange-100 text-orange-700' :
                    report.category === 'อื่นๆ' ? 'bg-purple-100 text-purple-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {report.category}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">รายละเอียดปัญหา</label>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-800 leading-relaxed">
                    {report.description}
                  </div>
                </div>

                {report.additionalInfo && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ข้อมูลเพิ่มเติม</label>
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-800 leading-relaxed">
                      {report.additionalInfo}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ไฟล์แนบ</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">ไม่มีไฟล์แนบ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">ข้อมูลผู้แจ้ง</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{report.createdBy}</p>
                    <p className="text-sm text-gray-500">ผู้แจ้งเรื่อง</p>
                  </div>
                </div>
                
                {report.contactEmail && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <a href={`mailto:${report.contactEmail}`} className="font-medium text-green-600 hover:text-green-800">
                        {report.contactEmail}
                      </a>
                      <p className="text-sm text-gray-500">อีเมล</p>
                    </div>
                  </div>
                )}
                
                {report.contactPhone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <a href={`tel:${report.contactPhone}`} className="font-medium text-blue-600 hover:text-blue-800">
                        {report.contactPhone}
                      </a>
                      <p className="text-sm text-gray-500">เบอร์โทรศัพท์</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Info */}
            {report.location && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">สถานที่เกิดเหตุ</h3>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{report.location}</p>
                    <p className="text-sm text-gray-500">ตำแหน่งที่เกิดปัญหา</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">เปลี่ยนสถานะ</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusChange('รอรับเรื่อง')}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    report.status === 'รอรับเรื่อง' 
                      ? 'bg-orange-100 text-orange-700 border-2 border-orange-300 cursor-not-allowed' 
                      : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                  }`}
                  disabled={report.status === 'รอรับเรื่อง'}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>รอรับเรื่อง</span>
                  </div>
                  {report.status === 'รอรับเรื่อง' && (
                    <div className="text-xs text-orange-600 mt-1">สถานะปัจจุบัน</div>
                  )}
                </button>

                <button
                  onClick={() => handleStatusChange('กำลังดำเนินการ')}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    report.status === 'กำลังดำเนินการ' 
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 cursor-not-allowed' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                  disabled={report.status === 'กำลังดำเนินการ'}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>กำลังดำเนินการ</span>
                  </div>
                  {report.status === 'กำลังดำเนินการ' && (
                    <div className="text-xs text-blue-600 mt-1">สถานะปัจจุบัน</div>
                  )}
                </button>

                <button
                  onClick={() => handleStatusChange('แก้ไขเสร็จ')}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    report.status === 'แก้ไขเสร็จ' 
                      ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed' 
                      : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  }`}
                  disabled={report.status === 'แก้ไขเสร็จ'}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>แก้ไขเสร็จ</span>
                  </div>
                  {report.status === 'แก้ไขเสร็จ' && (
                    <div className="text-xs text-green-600 mt-1">สถานะปัจจุบัน</div>
                  )}
                </button>
              </div>
              
              {/* สถานะปัจจุบัน */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">สถานะปัจจุบัน:</p>
                <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold ${getStatusColor(report.status)}`}>
                  {getStatusIcon(report.status)}
                  <span>{report.status}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ประวัติการดำเนินการ</h3>
              <div className="space-y-4">
                {/* สร้างรายงาน */}
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mt-1.5 ring-4 ring-indigo-100"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">สร้างเรื่องแจ้ง</p>
                    <p className="text-xs text-gray-500">{formatDate(report.date)}</p>
                  </div>
                </div>
                
                {/* กำลังดำเนินการ */}
                {(report.status === 'กำลังดำเนินการ' || report.status === 'แก้ไขเสร็จ') && (
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5 ring-4 ring-blue-100"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">เริ่มดำเนินการ</p>
                      <p className="text-xs text-gray-500">วันนี้</p>
                    </div>
                  </div>
                )}
                
                {/* แก้ไขเสร็จ */}
                {report.status === 'แก้ไขเสร็จ' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full mt-1.5 ring-4 ring-green-100"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">แก้ไขเสร็จสิ้น</p>
                      <p className="text-xs text-gray-500">วันนี้</p>
                    </div>
                  </div>
                )}
                
                {/* ถ้ายังไม่ได้เริ่มดำเนินการ */}
                {report.status === 'รอรับเรื่อง' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-orange-300 rounded-full mt-1.5 ring-4 ring-orange-100"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-600">รอรับเรื่อง</p>
                      <p className="text-xs text-gray-500">รอเจ้าหน้าที่รับเรื่อง</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}