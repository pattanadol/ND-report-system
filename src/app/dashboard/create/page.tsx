'use client'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  X, 
  FileText, 
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import { useAuth } from '../../../utils/authContext'
import { useReports } from '../../../utils/reportsContext'
import { uploadImages } from '../../../utils/imageUtils'
import type { CreateReportForm, Attachment } from '../../../types'

interface FormErrors {
  [key: string]: string
}

const categories = [
  'เรื่องร้องเรียน',
  'การบำรุงรักษา',
  'ปัญหาไฟฟ้า',
  'ปัญหาน้ำประปา',
  'ลิฟท์และบันได',
  'ความปลอดภัย',
  'สิ่งแวดล้อม',
  'อื่นๆ'
]

const priorities = [
  { value: 'ต่ำ', color: 'text-green-600' },
  { value: 'ปานกลาง', color: 'text-yellow-600' },
  { value: 'สูง', color: 'text-orange-600' },
  { value: 'เร่งด่วน', color: 'text-red-600' }
]

export default function CreateReportPage() {
  const { user, loading: authLoading } = useAuth()
  const { createReport } = useReports()
  const router = useRouter()
  
  const [formData, setFormData] = useState<CreateReportForm>({
    title: '',
    description: '',
    category: '',
    priority: 'ปานกลาง',
    contactName: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: '',
    location: '',
    attachments: []
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([])

  // ตรวจสอบการ login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // อัปเดตข้อมูลติดต่อเมื่อมี user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactName: user.name || '',
        contactEmail: user.email || ''
      }))
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // ล้าง error เมื่อผู้ใช้แก้ไข
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxFiles = 5
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    // ตรวจสอบจำนวนไฟล์
    if (files.length > maxFiles) {
      setErrors(prev => ({
        ...prev,
        attachments: `สามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์`
      }))
      return
    }
    
    // ตรวจสอบขนาดไฟล์
    const oversizedFiles = files.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        attachments: 'ไฟล์มีขนาดใหญ่เกิน 10MB'
      }))
      return
    }
    
    // อัปเดต form data
    setFormData(prev => ({
      ...prev,
      attachments: files
    }))
    
    // สร้าง preview สำหรับไฟล์รูปภาพ
    const previews = files.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file)
      }
      return null
    }).filter(Boolean) as string[]
    setAttachmentPreviews(previews)
    
    // ล้าง error
    if (errors.attachments) {
      setErrors(prev => ({
        ...prev,
        attachments: ''
      }))
    }
  }

  const removeAttachment = (index: number) => {
    const newAttachments = Array.from(formData.attachments).filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      attachments: newAttachments
    }))
    
    const newPreviews = attachmentPreviews.filter((_, i) => i !== index)
    setAttachmentPreviews(newPreviews)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'กรุณากรอกหัวข้อเรื่อง'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'กรุณากรอกรายละเอียด'
    }
    
    if (!formData.category) {
      newErrors.category = 'กรุณาเลือกหมวดหมู่'
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'กรุณากรอกชื่อผู้แจ้ง'
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'กรุณากรอกอีเมล'
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'รูปแบบอีเมลไม่ถูกต้อง'
    }
    
    if (formData.contactPhone && !/^\d{10}$/.test(formData.contactPhone.replace(/[-\s]/g, ''))) {
      newErrors.contactPhone = 'หมายเลขโทรศัพท์ไม่ถูกต้อง (10 หลัก)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // อัปโหลดไฟล์แนบไปยัง server (ถ้ามี)
      let uploadedAttachments: Attachment[] = []
      if (formData.attachments.length > 0) {
        try {
          uploadedAttachments = await uploadImages(Array.from(formData.attachments))
        } catch (uploadError) {
          console.error('Upload error:', uploadError)
          setErrors(prev => ({
            ...prev,
            attachments: 'ไม่สามารถอัปโหลดไฟล์ได้ กรุณาลองใหม่'
          }))
          setIsSubmitting(false)
          return
        }
      }

      // แจ้งเรื่อง
      const reportData = {
        ...formData,
        attachments: uploadedAttachments
      }
      
      await createReport(reportData)
      
      // แสดง success state
      setIsSuccess(true)
      
      // รีเซ็ตฟอร์ม
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'ปานกลาง',
        contactName: user?.name || '',
        contactEmail: user?.email || '',
        contactPhone: '',
        location: '',
        attachments: []
      })
      setAttachmentPreviews([])
      
      // redirect หลังจาก 3 วินาที
      setTimeout(() => {
        if (user.role === 'admin') {
          router.push('/dashboard/reports')
        } else {
          router.push('/dashboard/user')
        }
      }, 3000)
      
    } catch (error) {
      console.error('Error creating report:', error)
      alert('❌ เกิดข้อผิดพลาดในการแจ้งเรื่อง กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Message */}
        {isSuccess && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">แจ้งเรื่องสำเร็จ!</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">เรื่องแจ้งของคุณได้ถูกส่งเรียบร้อยแล้ว</p>
              <div className="text-sm text-gray-500">กำลังนำทางไปยังหน้ารายการ...</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Header - Mobile optimized */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 group"
            disabled={isSubmitting || isSuccess}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm sm:text-base">กลับ</span>
          </button>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">แจ้งเรื่องใหม่</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">แจ้งปัญหาในหมู่บ้าน/คอนโดต่อนิติบุคคล</p>
            </div>
          </div>
        </div>

        {/* Form - Mobile optimized */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-600" />
              รายละเอียดเรื่อง
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* หัวข้อเรื่อง */}
              <div className="lg:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  หัวข้อเรื่อง *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`${errors.title ? 'form-input-error' : 'form-input'}`}
                  placeholder="เช่น ห้องข้างเสียงดัง, แอร์เสีย, น้ำรั่ว, ส้วมตัน"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* หมวดหมู่ */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่ *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`${errors.category ? 'form-input-error' : 'form-input'}`}
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* ระดับความสำคัญ */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  ระดับความสำคัญ
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.value}
                    </option>
                  ))}
                </select>
              </div>

              {/* รายละเอียด */}
              <div className="lg:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  รายละเอียด *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`${errors.description ? 'form-input-error' : 'form-input'} resize-none min-h-[120px]`}
                  placeholder="กรุณาอธิบายปัญหาที่เกิดขึ้นอย่างละเอียด เช่น เวลาที่เกิด ลักษณะปัญหา..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* สถานที่ */}
              <div className="lg:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  สถานที่ (ถ้ามี)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    placeholder="เช่น ห้อง 201, อาคาร A, ชั้น 3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ข้อมูลการติดต่อ */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-blue-600" />
              ข้อมูลการติดต่อ
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ชื่อผู้แจ้ง */}
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้แจ้ง *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className={`${errors.contactName ? 'form-input-error' : 'form-input'} pl-10`}
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>
                {errors.contactName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.contactName}
                  </p>
                )}
              </div>

              {/* อีเมล */}
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  อีเมล *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className={`${errors.contactEmail ? 'form-input-error' : 'form-input'} pl-10`}
                    placeholder="example@email.com"
                  />
                </div>
                {errors.contactEmail && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div className="lg:col-span-2">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทรศัพท์ (ถ้ามี)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className={`${errors.contactPhone ? 'form-input-error' : 'form-input'} pl-10`}
                    placeholder="0812345678"
                  />
                </div>
                {errors.contactPhone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.contactPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ไฟล์แนบ */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-3 text-blue-600" />
              ไฟล์แนบ (ถ้ามี)
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                
                {/* แสดงไฟล์ที่เลือกภายใน dropzone */}
                {formData.attachments.length > 0 ? (
                  <div className="space-y-4">
                    {/* Grid แสดงรูปภาพ */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {Array.from(formData.attachments).map((file, index) => (
                        <div key={index} className="relative group">
                          {attachmentPreviews[index] ? (
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <img 
                                src={attachmentPreviews[index]} 
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-square rounded-lg bg-gray-100 flex flex-col items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500 text-center px-2 truncate w-full">{file.name.split('.').pop()?.toUpperCase()}</span>
                            </div>
                          )}
                          
                          {/* ปุ่มลบ */}
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          
                          {/* ชื่อไฟล์และขนาด */}
                          <div className="mt-1.5 text-center">
                            <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                      ))}
                      
                      {/* ปุ่มเพิ่มไฟล์ (ถ้ายังไม่ถึง 5 ไฟล์) */}
                      {formData.attachments.length < 5 && (
                        <label htmlFor="attachments" className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">เพิ่มไฟล์</span>
                        </label>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-400 text-center">
                      อัปโหลดแล้ว {formData.attachments.length}/5 ไฟล์
                    </p>
                  </div>
                ) : (
                  <label htmlFor="attachments" className="cursor-pointer block text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">คลิกเพื่อเลือกไฟล์</p>
                    <p className="text-sm text-gray-500">หรือลากไฟล์มาวางที่นี่</p>
                    <p className="text-xs text-gray-400 mt-2">รองรับไฟล์: รูปภาพ, PDF, Word, Excel (สูงสุด 10MB, 5 ไฟล์)</p>
                  </label>
                )}
              </div>
              
              {errors.attachments && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.attachments}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end sm:items-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting || isSuccess}
              className="btn-secondary w-full sm:w-auto"
            >
              ยกเลิก
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="btn-primary w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>กำลังส่งข้อมูล...</span>
                </>
              ) : isSuccess ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>ส่งสำเร็จ!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>แจ้งเรื่อง</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}