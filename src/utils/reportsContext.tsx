'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Report, ReportsContextType, ReportStatus, ReportPriority, ReportStats } from '../types'
import { reportService } from '../lib/services'

const ReportsContext = createContext<ReportsContextType | undefined>(undefined)

interface ReportsProviderProps {
  children: ReactNode
}

// ข้อมูลรายงานเริ่มต้น
const initialReports: Report[] = [
  {
    id: 1,
    title: 'ห้องข้างเสียงดังมาก',
    description: 'ห้อง B205 เสียงดังมากตั้งแต่เที่ยงคืนถึงเช้า เข้าปาร์ตี้ดัง รบกวนการพักผ่อนของลูกบ้าน',
    category: 'เรื่องร้องเรียน',
    status: 'รอรับเรื่อง',
    priority: 'สูง',
    date: '2024-11-24',
    createdBy: 'นายเสมา อยู่สุข',
    contactEmail: 'sama@email.com',
    contactPhone: '081-234-5678',
    location: 'ห้อง B205 ชั้น 12',
    additionalInfo: 'เสียงดังตั้งแต่หลัง 22.00 น. รบกวนการนอน'
  },
  {
    id: 2,
    title: 'ส้วมตัน น้ำท้วม',
    description: 'ส้วมชั้น 15 ตันมาก น้ำท้วมขึ้นมา กลิ่นเหม็น โทรแล้วแต่ยังไม่มีคนมาซ่อม',
    category: 'การบำรุงรักษา',
    status: 'กำลังดำเนินการ',
    priority: 'เร่งด่วน',
    date: '2024-11-23',
    createdBy: 'คุณหนิง ผู้อยู่อาศัย',
    contactEmail: 'ning@email.com',
    contactPhone: '089-876-5432',
    location: 'อาคาร A ชั้น 15',
    additionalInfo: 'ติดต่อนิติบุคคลแล้ว ขอช่างมาด่วน'
  },
  {
    id: 3,
    title: 'แอร์ไม่เย็น ร้อนมาก',
    description: 'ห้อง A302 แอร์เปิดไม่เย็น อากาศร้อนมาก ด้านในมีเสียงผิดปกติ ไม่สามารถปรับอุณหภูมิได้',
    category: 'ปัญหาไฟฟ้า',
    status: 'แก้ไขเสร็จ',
    priority: 'ปานกลาง',
    date: '2024-11-22',
    createdBy: 'ปิ่นเกล้า ช่างดี',
    contactEmail: 'pinkao@email.com',
    contactPhone: '092-345-6789',
    location: 'ห้อง A302 ชั้น 3',
    additionalInfo: 'ต้องการใช้แอร์ทุกวัน เพราะการทำงานที่บ้าน'
  },
  {
    id: 4,
    title: 'น้ำรั่วจากท่อ น้ำท่วมลิฟท์',
    description: 'มีน้ำรั่วจากท่อน้ำรั่วขึ้นมาถึงชั้น 8 เริ่มรั่วเมื่อเช้า ตอนนี้ราว 12.00 น. น้ำท่วมลิฟท์',
    category: 'การบำรุงรักษา',
    status: 'แก้ไขเสร็จ',
    priority: 'สูง',
    date: '2024-11-21',
    createdBy: 'ลุงป้า สนิท',
    contactEmail: 'lung@email.com',
    contactPhone: '081-567-8901',
    location: 'อาคาร B ชั้น 8',
    additionalInfo: 'ได้โทรแจ้งช่างแล้ว จะมาตรวจสอบวันนี้'
  },
  {
    id: 5,
    title: 'ลิฟท์ติดค้าง ไม่ขึ้นลง',
    description: 'ลิฟท์อาคาร B ติดค้างที่ชั้น 7 แล้ว 5 นาที ประตูเปิดปิดไม่สนิท เด็กเล็กต้องเดินบันไดขึ้น',
    category: 'ลิฟท์และบันได',
    status: 'รอรับเรื่อง',
    priority: 'เร่งด่วน',
    date: '2024-11-25',
    createdBy: 'นายเขียว ดีใจ',
    contactEmail: 'khiao@email.com',
    contactPhone: '086-123-4567',
    location: 'อาคาร B ลิฟท์หลัก',
    additionalInfo: 'มีผู้สูงอายุติดค้างอยู่ข้างใน ขอช่างด่วน'
  },
  {
    id: 6,
    title: 'พื้นบริเวณส่วนกลางแตก',
    description: 'พื้นหินที่ลานเล่นของอาคาร A แตกหัก เป็นอันตรายต่อผู้สัญจร โดยเฉพาะเด็กเล็ก',
    category: 'ความปลอดภัย',
    status: 'กำลังดำเนินการ',
    priority: 'สูง',
    date: '2024-11-24',
    createdBy: 'นางสาว จิตตดี',
    contactEmail: 'jit@email.com',
    contactPhone: '088-765-4321',
    location: 'ลานเล่น อาคาร A',
    additionalInfo: 'มีการติดกล้องวงจร ขอเพิ่ม security เฝ้าดูพื้นที่'
  },
  {
    id: 7,
    title: 'ความดันน้ำไม่พอ น้ำไหลช้า',
    description: 'แรงดันน้ำในหลายชั้นไม่เพียงพอ น้ำยังขุ่นอยู่ อาจเป็นปัญหาจากปั๊มน้ำ มีกลิ่นไม่ดี',
    category: 'ปัญหาน้ำประปา',
    status: 'แก้ไขเสร็จ',
    priority: 'ปานกลาง',
    date: '2024-11-23',
    createdBy: 'น้องไผ่ เขียวขัน',
    contactEmail: 'nongpai@email.com',
    contactPhone: '085-987-6543',
    location: 'อาคาร C',
    additionalInfo: 'ได้ติดต่อช่างแล้ว จะมาเช็ครระบบปั๊มน้ำ'
  },
  {
    id: 8,
    title: 'WiFi ส่วนกลางช้า เชื่อมต่อไม่ได้',
    description: 'อินเตอร์เน็ต WiFi ในส่วนกลาง ชั้น 8 ช้ามาก ไม่สามารถใช้งานได้ เป็นปัญหาการ Work from Home',
    category: 'สิ่งแวดล้อม',
    status: 'รอรับเรื่อง',
    priority: 'ต่ำ',
    date: '2024-11-22',
    createdBy: 'สมพงษ์ ทำงานดี',
    contactEmail: 'sompong@email.com',
    contactPhone: '089-234-5678',
    location: 'ส่วนกลาง ชั้น 8',
    additionalInfo: 'ต้องใช้อินเตอร์เน็ตสำหรับการทำงาน โทรแจ้งนิติบุคคลแล้ว'
  },
  {
    id: 9,
    title: 'ไฟที่ลานจอดรถมืด',
    description: 'ไฟฟ้าที่ลานจอดรถดับหลายดวง เมื่อเย็นมืดมาก ไม่ปลอดภัยสำหรับผู้สัญจร',
    category: 'ปัญหาไฟฟ้า',
    status: 'กำลังดำเนินการ',
    priority: 'ปานกลาง',
    date: '2024-11-21',
    createdBy: 'วิชัย รักรถ',
    contactEmail: 'wichai@email.com',
    contactPhone: '087-456-7890',
    location: 'ลานจอดรถยนต์',
    additionalInfo: 'มีผู้ใช้บริการร้องเรียน ขอให้เร่งแก้ไข'
  },
  {
    id: 10,
    title: 'ระบบ CCTV ทำงานผิดปกติ',
    description: 'กล้องวงจรปิดหน้าอาคารเสีย ไม่สามารถบันทึกภาพได้ มีปัญหาความปลอดภัย',
    category: 'ความปลอดภัย',
    status: 'รอรับเรื่อง',
    priority: 'สูง',
    date: '2024-11-20',
    createdBy: 'นายศักดิ์ เฝ้าระวัง',
    contactEmail: 'sak@email.com',
    contactPhone: '084-321-0987',
    location: 'หน้าอาคาร A',
    additionalInfo: 'จำเป็นต้องแก้ไขด่วนเพื่อความปลอดภัย'
  }
]

export function ReportsProvider({ children }: ReportsProviderProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // โหลดข้อมูลรายงานจาก Firebase และ subscribe to real-time updates
  useEffect(() => {
    console.log('Setting up Firebase real-time listener...')
    
    // Subscribe to real-time updates
    const unsubscribe = reportService.subscribeToReports((updatedReports) => {
      console.log('Received real-time update:', updatedReports.length, 'reports')
      setReports(updatedReports)
      setLoading(false)
    })

    // Cleanup subscription
    return () => {
      console.log('Cleaning up Firebase listener...')
      unsubscribe()
    }
  }, [])

  // ฟังก์ชันสร้างรายงานใหม่ด้วย Firebase
  const addReport = async (reportData: Omit<Report, 'id' | 'date'>): Promise<Report> => {
    try {
      const reportId = await reportService.createReport(reportData)
      
      // สร้าง Report object ใหม่สำหรับ return
      const newReport: Report = {
        id: parseInt(reportId.slice(-6)), // ใช้ 6 ตัวท้ายเป็น id
        ...reportData,
        date: new Date().toISOString().split('T')[0],
        status: 'รอรับเรื่อง'
      }
      
      // ไม่ต้อง update state ที่นี่ เพราะ real-time listener จะจัดการ
      return newReport
    } catch (error: any) {
      console.error('Error adding report:', error)
      throw new Error(error.message || 'ไม่สามารถสร้างรายงานได้')
    }
  }

  // ฟังก์ชันอัปเดตรายงานด้วย Firebase
  const updateReport = async (id: number, updates: Partial<Report>): Promise<void> => {
    try {
      await reportService.updateReport(id.toString(), updates)
      // ไม่ต้อง update state ที่นี่ เพราะ real-time listener จะจัดการ
    } catch (error: any) {
      console.error('Error updating report:', error)
      throw new Error(error.message || 'ไม่สามารถอัปเดตรายงานได้')
    }
  }

  // ฟังก์ชันอัปเดตสถานะรายงานด้วย Firebase
  const updateReportStatus = async (id: number, status: ReportStatus): Promise<void> => {
    try {
      await reportService.updateReportStatus(id.toString(), status)
      // ไม่ต้อง update state ที่นี่ เพราะ real-time listener จะจัดการ
    } catch (error: any) {
      console.error('Error updating report status:', error)
      throw new Error(error.message || 'ไม่สามารถอัปเดตสถานะรายงานได้')
    }
  }

  // ฟังก์ชันสร้างรายงานใหม่ (สำหรับ create page) ด้วย Firebase
  const createReport = async (reportData: any): Promise<void> => {
    try {
      const newReportData: Omit<Report, 'id' | 'date' | 'status'> = {
        title: reportData.title,
        description: reportData.description,
        category: reportData.category,
        priority: reportData.priority as ReportPriority,
        createdBy: reportData.contactName,
        contactEmail: reportData.contactEmail,
        contactPhone: reportData.contactPhone,
        location: reportData.location,
        additionalInfo: reportData.additionalInfo || ''
      }
      
      await reportService.createReport(newReportData)
      // ไม่ต้อง update state ที่นี่ เพราะ real-time listener จะจัดการ
    } catch (error: any) {
      console.error('Error creating report:', error)
      throw new Error(error.message || 'ไม่สามารถสร้างรายงานได้')
    }
  }

  // ฟังก์ชันลบรายงานด้วย Firebase
  const deleteReport = async (id: number): Promise<void> => {
    try {
      await reportService.deleteReport(id.toString())
      // ไม่ต้อง update state ที่นี่ เพราะ real-time listener จะจัดการ
    } catch (error: any) {
      console.error('Error deleting report:', error)
      throw new Error(error.message || 'ไม่สามารถลบรายงานได้')
    }
  }

  // ฟังก์ชันดึงรายงานตาม ID
  const getReportById = (id: number): Report | undefined => {
    return reports.find(report => report.id === id)
  }

  // สถิติรายงาน
  const getStats = (): ReportStats => {
    return {
      total: reports.length,
      pending: reports.filter(r => r.status === 'รอรับเรื่อง').length,
      inProgress: reports.filter(r => r.status === 'กำลังดำเนินการ').length,
      completed: reports.filter(r => r.status === 'แก้ไขเสร็จ').length,
      urgent: reports.filter(r => r.priority === 'เร่งด่วน').length
    }
  }

  return (
    <ReportsContext.Provider value={{
      reports,
      addReport,
      updateReport,
      updateReportStatus,
      deleteReport,
      createReport,
      getReportById,
      getStats,
      loading
    }}>
      {children}
    </ReportsContext.Provider>
  )
}

export const useReports = (): ReportsContextType => {
  const context = useContext(ReportsContext)
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider')
  }
  return context
}