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
import type { CreateReportForm } from '../../../types'

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
      // แจ้งเรื่อง
      const reportData = {
        ...formData,
        attachments: Array.from(formData.attachments).map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file) // ในการใช้งานจริงควรอัปโหลดไปยัง server
        }))
      }
      
      await createReport(reportData)
      
      // แสดงข้อความสำเร็จและ redirect ตาม role
      alert('แจ้งเรื่องสำเร็จ!')
      if (user.role === 'admin') {
        router.push('/dashboard')
      } else {
        router.push('/dashboard/user')
      }
      
    } catch (error) {
      console.error('Error creating report:', error)
      alert('เกิดข้อผิดพลาดในการแจ้งเรื่อง')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 group"
          >
            <X className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            กลับ
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">แจ้งเรื่องใหม่</h1>
              <p className="text-gray-600 mt-1">แจ้งปัญหาในหมู่บ้าน/คอนโดต่อนิติบุคคล</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600" />
              รายละเอียดเรื่อง
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="เช่น ห้องข้างเสียงดัง, แอร์เสีย, น้ำรั่ว, ส้วมตัน"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                    errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="เช่น ห้อง 201, อาคาร A, ชั้น 3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ข้อมูลการติดต่อ */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.contactName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.contactEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.contactPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-3 text-blue-600" />
              ไฟล์แนบ (ถ้ามี)
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <label htmlFor="attachments" className="cursor-pointer block">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">คลิกเพื่อเลือกไฟล์</p>
                  <p className="text-sm text-gray-500">หรือลากไฟล์มาวางที่นี่</p>
                  <p className="text-xs text-gray-400 mt-2">รองรับไฟล์: รูปภาพ, PDF, Word, Excel (สูงสุด 10MB, 5 ไฟล์)</p>
                </label>
              </div>
              
              {errors.attachments && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.attachments}
                </p>
              )}
              
              {/* แสดงไฟล์ที่เลือก */}
              {formData.attachments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from(formData.attachments).map((file, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {attachmentPreviews[index] ? (
                        <img 
                          src={attachmentPreviews[index]} 
                          alt="Preview" 
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              ยกเลิก
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>กำลังแจ้ง...</span>
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