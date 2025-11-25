// Shared types for the ND Report System

// User types
export interface User {
  id: number
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

export interface Report {
  id: number
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
  addReport: (report: Omit<Report, 'id' | 'date'>) => void
  updateReport: (id: number, updates: Partial<Report>) => void
  updateReportStatus: (id: number, status: ReportStatus) => void
  deleteReport: (id: number) => void
  createReport: (reportData: any) => Promise<void>
  getReportById: (id: number) => Report | undefined
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