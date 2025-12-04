'use client'
import { useState, useEffect, ChangeEvent } from 'react'
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
  Trash2,
  Image as ImageIcon,
  Download,
  X,
  Upload,
  Save,
  Wrench,
  Eye
} from 'lucide-react'
import { useAuth } from '../../../../utils/authContext'
import { useReports } from '../../../../utils/reportsContext'
import { formatDate, formatDateTime, getStatusColor, getPriorityColor } from '../../../../utils/helpers'
import { uploadImages } from '../../../../utils/imageUtils'
import type { ReportStatus, Comment, ProcessingInfo, CompletionInfo, Attachment } from '../../../../types'

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const { user, isAdmin } = useAuth()
  const { reports, updateReportStatus, updateReport, deleteReport, loading } = useReports()
  const router = useRouter()
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  
  // Modal states
  const [showProcessingModal, setShowProcessingModal] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Processing form state
  const [processingForm, setProcessingForm] = useState<ProcessingInfo>({
    assignedTo: '',
    estimatedTime: '',
    details: ''
  })
  
  // Completion form state
  const [completionForm, setCompletionForm] = useState<CompletionInfo>({
    assignedTo: '',
    completionDetails: '',
    evidenceImages: []
  })
  
  // Evidence images state
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])
  const [evidencePreviews, setEvidencePreviews] = useState<string[]>([])
  
  // Image viewer state
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [viewerImageUrl, setViewerImageUrl] = useState('')

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
      
      // โหลดข้อมูล Processing และ Completion ถ้ามี
      if (report.processingInfo) {
        setProcessingForm(report.processingInfo)
      }
      if (report.completionInfo) {
        setCompletionForm(report.completionInfo)
      }
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

  // Handle processing form input change
  const handleProcessingChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProcessingForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle completion form input change
  const handleCompletionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompletionForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle evidence file selection
  const handleEvidenceFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    const maxFiles = 5
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    // รวมไฟล์เก่ากับใหม่
    const allFiles = [...evidenceFiles, ...newFiles]
    
    if (allFiles.length > maxFiles) {
      alert(`สามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์`)
      return
    }
    
    const oversizedFiles = newFiles.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      alert('ไฟล์มีขนาดใหญ่เกิน 10MB')
      return
    }
    
    setEvidenceFiles(allFiles)
    
    // สร้าง preview สำหรับไฟล์ใหม่และรวมกับเก่า
    const newPreviews = newFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file)
      }
      return null
    }).filter(Boolean) as string[]
    
    setEvidencePreviews([...evidencePreviews, ...newPreviews])
    
    // Reset input เพื่อให้เลือกไฟล์เดิมได้อีก
    e.target.value = ''
  }

  // Remove evidence file
  const removeEvidenceFile = (index: number) => {
    const newFiles = evidenceFiles.filter((_, i) => i !== index)
    setEvidenceFiles(newFiles)
    
    const newPreviews = evidencePreviews.filter((_, i) => i !== index)
    setEvidencePreviews(newPreviews)
  }

  // Open image viewer
  const openImageViewer = (imageUrl: string) => {
    // ตรวจสอบว่า URL เป็น blob หรือไม่
    if (imageUrl.startsWith('blob:')) {
      alert('⚠️ รูปภาพนี้เป็นไฟล์ชั่วคราว ไม่สามารถเปิดดูได้\nกรุณาอัปโหลดรูปภาพใหม่ผ่านระบบ')
      return
    }
    setViewerImageUrl(imageUrl)
    setShowImageViewer(true)
  }

  // Open processing modal
  const openProcessingModal = (editMode: boolean = false) => {
    setIsEditMode(editMode)
    if (report?.processingInfo) {
      setProcessingForm(report.processingInfo)
    } else {
      setProcessingForm({
        assignedTo: '',
        estimatedTime: '',
        details: ''
      })
    }
    setShowProcessingModal(true)
  }

  // Open completion modal
  const openCompletionModal = (editMode: boolean = false) => {
    setIsEditMode(editMode)
    if (report?.completionInfo) {
      setCompletionForm(report.completionInfo)
    } else {
      // ดึงข้อมูลจาก processing info มาใส่
      setCompletionForm({
        assignedTo: report?.processingInfo?.assignedTo || '',
        completionDetails: '',
        evidenceImages: []
      })
    }
    setEvidenceFiles([])
    setEvidencePreviews([])
    setShowCompletionModal(true)
  }

  // Submit processing info
  const handleSubmitProcessing = async () => {
    if (!processingForm.assignedTo.trim()) {
      alert('กรุณากรอกชื่อผู้รับผิดชอบ')
      return
    }
    if (!processingForm.estimatedTime.trim()) {
      alert('กรุณากรอกเวลาดำเนินการโดยประมาณ')
      return
    }
    if (!processingForm.details.trim()) {
      alert('กรุณากรอกรายละเอียด')
      return
    }

    try {
      const updatedProcessingInfo: ProcessingInfo = {
        ...processingForm,
        startedAt: report?.processingInfo?.startedAt || new Date().toISOString()
      }
      
      await updateReport(reportId, { 
        processingInfo: updatedProcessingInfo,
        status: 'กำลังดำเนินการ'
      })
      
      setShowProcessingModal(false)
      alert(isEditMode ? '✅ บันทึกข้อมูลเรียบร้อย' : '⚙️ เริ่มดำเนินการแก้ไขแล้ว')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  // Submit completion info
  const handleSubmitCompletion = async () => {
    if (!completionForm.completionDetails.trim()) {
      alert('กรุณากรอกรายละเอียดการแก้ไข')
      return
    }

    try {
      // อัปโหลดรูปภาพหลักฐานไปยัง Server
      let evidenceAttachments: Attachment[] = []
      if (evidenceFiles.length > 0) {
        try {
          evidenceAttachments = await uploadImages(evidenceFiles)
        } catch (uploadError) {
          console.error('Upload error:', uploadError)
          alert('❌ เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ')
          return
        }
      }

      const updatedCompletionInfo: CompletionInfo = {
        ...completionForm,
        completedAt: report?.completionInfo?.completedAt || new Date().toISOString(),
        evidenceImages: [...(completionForm.evidenceImages || []), ...evidenceAttachments]
      }
      
      await updateReport(reportId, { 
        completionInfo: updatedCompletionInfo,
        status: 'แก้ไขเสร็จ'
      })
      
      setShowCompletionModal(false)
      setEvidenceFiles([])
      setEvidencePreviews([])
      alert(isEditMode ? '✅ บันทึกข้อมูลเรียบร้อย' : '✨ ดำเนินการเสร็จสมบูรณ์!')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
  }

  const handleStatusChange = async (newStatus: ReportStatus) => {
    if (!isAdmin) {
      alert('❌ เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเปลี่ยนสถานะได้')
      return
    }

    // ถ้าเปลี่ยนเป็น "กำลังดำเนินการ" ต้องกรอกข้อมูล (ถ้ายังไม่มี)
    if (newStatus === 'กำลังดำเนินการ') {
      openProcessingModal(false)
      return
    }

    // ถ้าเปลี่ยนเป็น "แก้ไขเสร็จ" ต้องกรอกข้อมูล (ถ้ายังไม่มี)
    if (newStatus === 'แก้ไขเสร็จ') {
      openCompletionModal(false)
      return
    }

    try {
      await updateReportStatus(reportId, newStatus)
      
      // แสดง success message
      const successMessages: Record<string, string> = {
        'รอรับเรื่อง': '✅ เปลี่ยนสถานะเป็น "รอรับเรื่อง" เรียบร้อย',
        'กำลังดำเนินการ': '⚙️ เริ่มดำเนินการแก้ไขแล้ว',
        'แก้ไขเสร็จ': '✨ ดำเนินการเสร็จสมบูรณ์!',
        'รอตรวจสอบ': '🔍 ส่งให้ตรวจสอบเรียบร้อย'
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

        {/* Image Viewer Modal */}
        {showImageViewer && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageViewer(false)}
          >
            <button
              onClick={() => setShowImageViewer(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-black/50 rounded-full"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={viewerImageUrl} 
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        
        {/* Processing Modal */}
        {showProcessingModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {isEditMode ? 'แก้ไขข้อมูลการดำเนินการ' : 'กำลังดำเนินการ'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowProcessingModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    มอบหมายให้ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={processingForm.assignedTo}
                    onChange={handleProcessingChange}
                    placeholder="ชื่อผู้รับผิดชอบ"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เวลาดำเนินการโดยประมาณ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="estimatedTime"
                    value={processingForm.estimatedTime}
                    onChange={handleProcessingChange}
                    placeholder="เช่น 2-3 วัน, 1 สัปดาห์"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รายละเอียด (ต้องแก้ไขอะไรบ้าง) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="details"
                    value={processingForm.details}
                    onChange={handleProcessingChange}
                    rows={4}
                    placeholder="อธิบายว่าจะดำเนินการแก้ไขอะไรบ้าง..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowProcessingModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSubmitProcessing}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? 'บันทึก' : 'เริ่มดำเนินการ'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completion Modal */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {isEditMode ? 'แก้ไขข้อมูลการแก้ไขเสร็จ' : 'แก้ไขเสร็จ'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ผู้ดำเนินการ
                  </label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={completionForm.assignedTo}
                    onChange={handleCompletionChange}
                    placeholder="ชื่อผู้ดำเนินการ"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
                    readOnly={!!report?.processingInfo?.assignedTo}
                  />
                  {report?.processingInfo?.assignedTo && (
                    <p className="text-xs text-gray-500 mt-1">* ดึงข้อมูลจากการมอบหมายงาน</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รายละเอียดการแก้ไข <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="completionDetails"
                    value={completionForm.completionDetails}
                    onChange={handleCompletionChange}
                    rows={4}
                    placeholder="อธิบายว่าได้ดำเนินการแก้ไขอะไรไปบ้าง..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รูปภาพหลักฐาน (ถ้ามี)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/30">
                    {/* Empty state - show large upload area */}
                    {evidenceFiles.length === 0 ? (
                      <div className="py-8">
                        <input
                          type="file"
                          id="evidenceImages"
                          multiple
                          onChange={handleEvidenceFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <label htmlFor="evidenceImages" className="cursor-pointer block text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-700 mb-2">คลิกเพื่อเลือกไฟล์</p>
                          <p className="text-gray-500 mb-2">หรือลากไฟล์มาวางที่นี่</p>
                          <p className="text-sm text-gray-400">รองรับไฟล์: รูปภาพ (สูงสุด 10MB, 5 ไฟล์)</p>
                        </label>
                      </div>
                    ) : (
                      /* Has files - show grid with images and add button */
                      <>
                        <div className="flex flex-wrap gap-3">
                          {/* Preview evidence files */}
                          {evidencePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 bg-white shadow-sm">
                                <img 
                                  src={preview} 
                                  alt={`Evidence ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEvidenceFile(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="mt-1 text-center">
                                <p className="text-xs text-gray-600 truncate w-32">{evidenceFiles[index]?.name}</p>
                                <p className="text-xs text-gray-400">{(evidenceFiles[index]?.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            </div>
                          ))}
                          
                          {/* Add file button */}
                          {evidenceFiles.length < 5 && (
                            <div className="w-32 h-32">
                              <input
                                type="file"
                                id="evidenceImagesAdd"
                                multiple
                                onChange={handleEvidenceFileChange}
                                className="hidden"
                                accept="image/*"
                              />
                              <label 
                                htmlFor="evidenceImagesAdd" 
                                className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors bg-white"
                              >
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">เพิ่มไฟล์</span>
                              </label>
                            </div>
                          )}
                        </div>
                        
                        {/* File count info */}
                        <div className="text-center mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-500">
                            อัปโหลดแล้ว {evidenceFiles.length}/5 ไฟล์
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Show existing evidence images */}
                  {completionForm.evidenceImages && completionForm.evidenceImages.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">รูปภาพที่บันทึกไว้แล้ว:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {completionForm.evidenceImages.map((img, index) => (
                          <img 
                            key={index}
                            src={img.url} 
                            alt={img.name}
                            className="w-full h-20 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSubmitCompletion}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? 'บันทึก' : 'แก้ไขเสร็จ'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

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
                {report.attachments && report.attachments.length > 0 ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ไฟล์แนบ ({report.attachments.length} ไฟล์)
                    </label>
                    <div className="space-y-3">
                      {report.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                          {attachment.type.startsWith('image/') ? (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openImageViewer(attachment.url)}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          {attachment.type.startsWith('image/') ? (
                            <button
                              onClick={() => openImageViewer(attachment.url)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="ดูรูปภาพ"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => window.open(attachment.url, '_blank')}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="ดาวน์โหลดไฟล์"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ไฟล์แนบ</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">ไม่มีไฟล์แนบ</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Processing Info - แสดงเมื่อมีข้อมูลการดำเนินการ */}
            {report.processingInfo && (
              <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">ข้อมูลการดำเนินการ</h2>
                    {report.processingInfo.startedAt && (
                      <p className="text-xs text-gray-500">เริ่มดำเนินการ: {formatDate(report.processingInfo.startedAt)}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">มอบหมายให้</p>
                      <p className="text-gray-800 font-semibold">{report.processingInfo.assignedTo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">เวลาดำเนินการโดยประมาณ</p>
                      <p className="text-gray-800 font-semibold">{report.processingInfo.estimatedTime}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">รายละเอียด</p>
                    <div className="bg-blue-50 rounded-lg p-4 text-gray-800 leading-relaxed">
                      {report.processingInfo.details}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Completion Info - แสดงเมื่อมีข้อมูลการแก้ไขเสร็จ */}
            {report.completionInfo && (
              <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">ข้อมูลการแก้ไขเสร็จ</h2>
                    {report.completionInfo.completedAt && (
                      <p className="text-xs text-gray-500">แก้ไขเสร็จเมื่อ: {formatDate(report.completionInfo.completedAt)}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">ผู้ดำเนินการ</p>
                      <p className="text-gray-800 font-semibold">{report.completionInfo.assignedTo}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">รายละเอียดการแก้ไข</p>
                    <div className="bg-green-50 rounded-lg p-4 text-gray-800 leading-relaxed">
                      {report.completionInfo.completionDetails}
                    </div>
                  </div>
                  
                  {/* Evidence Images */}
                  {report.completionInfo.evidenceImages && report.completionInfo.evidenceImages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        รูปภาพหลักฐาน ({report.completionInfo.evidenceImages.length} รูป)
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {report.completionInfo.evidenceImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={img.url} 
                              alt={img.name}
                              className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => openImageViewer(img.url)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center pointer-events-none">
                              <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={`mailto:${report.contactEmail}`} className="font-medium text-green-600 hover:text-green-800 block truncate">
                        {report.contactEmail}
                      </a>
                      <p className="text-sm text-gray-500">อีเมล</p>
                    </div>
                  </div>
                )}
                
                {report.contactPhone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={`tel:${report.contactPhone}`} className="font-medium text-blue-600 hover:text-blue-800 block truncate">
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
            {isAdmin && (
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
                    onClick={() => {
                      if (report.status === 'กำลังดำเนินการ' && report.processingInfo) {
                        openProcessingModal(true)
                      } else {
                        handleStatusChange('กำลังดำเนินการ')
                      }
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      report.status === 'กำลังดำเนินการ' 
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-200' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>กำลังดำเนินการ</span>
                    </div>
                    {report.status === 'กำลังดำเนินการ' && (
                      <div className="text-xs text-blue-600 mt-1">สถานะปัจจุบัน • คลิกเพื่อแก้ไขข้อมูล</div>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (report.status === 'แก้ไขเสร็จ' && report.completionInfo) {
                        openCompletionModal(true)
                      } else {
                        handleStatusChange('แก้ไขเสร็จ')
                      }
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      report.status === 'แก้ไขเสร็จ' 
                        ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200' 
                        : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>แก้ไขเสร็จ</span>
                    </div>
                    {report.status === 'แก้ไขเสร็จ' && (
                      <div className="text-xs text-green-600 mt-1">สถานะปัจจุบัน • คลิกเพื่อแก้ไขข้อมูล</div>
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
            )}

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
                {report.processingInfo && (
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5 ring-4 ring-blue-100"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">เริ่มดำเนินการ</p>
                      <p className="text-xs text-gray-500">
                        {report.processingInfo.startedAt ? formatDate(report.processingInfo.startedAt) : 'วันนี้'}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        มอบหมาย: {report.processingInfo.assignedTo}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* แก้ไขเสร็จ */}
                {report.completionInfo && (
                  <div className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full mt-1.5 ring-4 ring-green-100"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">แก้ไขเสร็จสิ้น</p>
                      <p className="text-xs text-gray-500">
                        {report.completionInfo.completedAt ? formatDate(report.completionInfo.completedAt) : 'วันนี้'}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        โดย: {report.completionInfo.assignedTo}
                      </p>
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