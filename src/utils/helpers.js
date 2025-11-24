// Helper functions สำหรับ formatting และ utilities

export const formatDate = (date) => {
  if (!date) return '-'
  
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (date) => {
  if (!date) return '-'
  
  return new Date(date).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getStatusColor = (status) => {
  const statusColors = {
    'รอรับเรื่อง': 'bg-orange-100 text-orange-700 border border-orange-200',
    'กำลังดำเนินการ': 'bg-blue-100 text-blue-700 border border-blue-200',
    'แก้ไขเสร็จ': 'bg-green-100 text-green-700 border border-green-200'
  }
  
  return statusColors[status] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

export const getPriorityColor = (priority) => {
  const priorityColors = {
    'ต่ำ': 'bg-slate-100 text-slate-700 border border-slate-200',
    'ปานกลาง': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'สูง': 'bg-orange-100 text-orange-700 border border-orange-200',
    'เร่งด่วน': 'bg-red-100 text-red-700 border border-red-200'
  }
  
  return priorityColors[priority] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ''))
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}