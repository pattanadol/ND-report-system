// Shared types for the ND Report System

// User types
export interface User {
  id: string  // Firebase UID
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface LoginUser extends User {
  password?: never // Password shouldn't be in the user object after login
}

// Report types
export type ReportStatus = 'รอรับเรื่อง' | 'กำลังดำเนินการ' | 'แก้ไขเสร็จ' | 'รอตรวจสอบ'
export type ReportPriority = 'ต่ำ' | 'ปานกลาง' | 'สูง' | 'เร่งด่วน'

export interface Attachment {
  name: string
  size: number
  type: string
  url: string
}

// ข้อมูลการดำเนินการ (สำหรับสถานะ "กำลังดำเนินการ")
export interface ProcessingInfo {
  assignedTo: string           // มอบหมายให้ใคร
  estimatedTime: string        // เวลาดำเนินการโดยประมาณ
  details: string              // รายละเอียด (ต้องแก้ไขอะไรบ้าง)
  startedAt?: string           // วันที่เริ่มดำเนินการ
}

// ข้อมูลเมื่อแก้ไขเสร็จ (สำหรับสถานะ "แก้ไขเสร็จ")
export interface CompletionInfo {
  assignedTo: string           // ผู้ที่ดำเนินการ (ดึงจาก ProcessingInfo)
  completionDetails: string    // รายละเอียดการแก้ไข
  completedAt?: string         // วันที่เสร็จสิ้น
  evidenceImages?: Attachment[] // รูปภาพหลักฐาน
}

export interface Report {
  id: string
  title: string
  description: string
  category: string
  status: ReportStatus
  priority: ReportPriority
  date: string
  createdBy: string
  contactEmail: string
  contactPhone: string
  location: string
  additionalInfo?: string
  attachments?: Attachment[]
  processingInfo?: ProcessingInfo    // ข้อมูลการดำเนินการ
  completionInfo?: CompletionInfo    // ข้อมูลเมื่อเสร็จสิ้น
}

export interface Comment {
  id: number
  author: string
  message: string
  timestamp: string
  isAdmin: boolean
}

export interface ReportStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  urgent: number
}

// Auth Context types
export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  isAdmin: boolean
  isUser: () => boolean
}

// Reports Context types
export interface ReportsContextType {
  reports: Report[]
  addReport: (report: Omit<Report, 'id' | 'date'>) => Promise<Report>
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>
  updateReportStatus: (id: string, status: ReportStatus) => Promise<void>
  deleteReport: (id: string) => Promise<void>
  createReport: (reportData: any) => Promise<void>
  getReportById: (id: string) => Report | undefined
  getStats: () => ReportStats
  loading: boolean
}

// Form types
export interface CreateReportForm {
  title: string
  description: string
  category: string
  priority: string
  contactName: string
  contactEmail: string
  contactPhone: string
  location: string
  attachments: File[]
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}