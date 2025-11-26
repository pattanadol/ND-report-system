// Helper functions สำหรับ formatting และ utilities
import type { ReportStatus, ReportPriority } from '../types'

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  
  return new Date(date).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getStatusColor = (status: ReportStatus): string => {
  const statusColors: Record<ReportStatus, string> = {
    'รอรับเรื่อง': 'bg-orange-100 text-orange-700 border border-orange-200',
    'กำลังดำเนินการ': 'bg-blue-100 text-blue-700 border border-blue-200',
    'แก้ไขเสร็จ': 'bg-green-100 text-green-700 border border-green-200',
    'รอตรวจสอบ': 'bg-gray-100 text-gray-700 border border-gray-200'
  }
  
  return statusColors[status] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

export const getPriorityColor = (priority: ReportPriority): string => {
  const priorityColors: Record<ReportPriority, string> = {
    'ต่ำ': 'bg-slate-100 text-slate-700 border border-slate-200',
    'ปานกลาง': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'สูง': 'bg-orange-100 text-orange-700 border border-orange-200',
    'เร่งด่วน': 'bg-red-100 text-red-700 border border-red-200'
  }
  
  return priorityColors[priority] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

export const truncateText = (text: string | null | undefined, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text || ''
  return text.substring(0, maxLength) + '...'
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ''))
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout | undefined
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}