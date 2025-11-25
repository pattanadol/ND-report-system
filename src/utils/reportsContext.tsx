'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Report, ReportsContextType, ReportStatus, ReportPriority, ReportStats } from '../types'
import { reportService } from '../lib/services'
import { seedInitialData } from '../lib/services/seedData'

const ReportsContext = createContext<ReportsContextType | undefined>(undefined)

interface ReportsProviderProps {
  children: ReactNode
}

export function ReportsProvider({ children }: ReportsProviderProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // โหลดข้อมูลรายงานจาก Firebase และ subscribe to real-time updates
  useEffect(() => {
    console.log('Setting up Firebase real-time listener...')
    
    // Subscribe to real-time updates
    const unsubscribe = reportService.subscribeToReports(async (updatedReports) => {
      console.log('Received real-time update:', updatedReports.length, 'reports')
      
      // ตั้ง loading เป็น false ทันที
      setLoading(false)
      
      // ลบ temp reports และใช้ข้อมูลจริงจาก Firebase
      setReports(prev => {
        console.log('Updating reports - Before:', prev.length)
        console.log('Received from Firebase:', updatedReports.length)
        
        // กรองเอา temp reports ออก
        const nonTempReports = prev.filter(report => !report.id.startsWith('temp-'))
        console.log('Non-temp reports:', nonTempReports.length)
        
        // รวม temp reports กับข้อมูลจริงจาก Firebase
        const finalReports = [...updatedReports, ...nonTempReports.filter(tempReport => 
          !updatedReports.find(realReport => 
            realReport.title === tempReport.title && 
            realReport.createdBy === tempReport.createdBy
          )
        )]
        
        console.log('Final reports:', finalReports.length)
        return finalReports
      })
      
      // ถ้าไม่มีข้อมูล ให้ seed ข้อมูลเริ่มต้นใน background
      if (updatedReports.length === 0) {
        console.log('No reports found, seeding initial data in background...')
        seedInitialData().then((seedSuccess) => {
          if (seedSuccess) {
            console.log('Initial data seeded successfully')
          }
        }).catch(error => {
          console.error('Seed data failed:', error)
        })
      }
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
        id: reportId,
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
  const updateReport = async (id: string, updates: Partial<Report>): Promise<void> => {
    // Optimistic update: อัปเดต UI ทันที
    const previousReports = reports
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, ...updates } : report
    ))
    
    try {
      await reportService.updateReport(id, updates)
      // real-time listener จะอัปเดตข้อมูลจริงภายหลัง
    } catch (error: any) {
      // ถ้า error ให้ rollback กลับสู่สถานะเดิม
      setReports(previousReports)
      console.error('Error updating report:', error)
      throw new Error(error.message || 'ไม่สามารถอัปเดตรายงานได้')
    }
  }

  // ฟังก์ชันอัปเดตสถานะรายงานด้วย Firebase
  const updateReportStatus = async (id: string, status: ReportStatus): Promise<void> => {
    // Optimistic update: อัปเดตสถานะใน UI ทันที
    const previousReports = reports
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, status } : report
    ))
    
    try {
      await reportService.updateReportStatus(id, status)
      // real-time listener จะอัปเดตข้อมูลจริงภายหลัง
    } catch (error: any) {
      // ถ้า error ให้ rollback กลับสู่สถานะเดิม
      setReports(previousReports)
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
      
      // Optimistic update: เพิ่มรายงานใหม่ใน state ทันที
      const tempReport: Report = {
        id: 'temp-' + Date.now(), // ID ชั่วคราว
        ...newReportData,
        status: 'รอรับเรื่อง',
        date: new Date().toISOString().split('T')[0]
      }
      
      // เพิ่มใน state ทันทีเพื่อ UI ตอบสนอง
      setReports(prev => [tempReport, ...prev])
      
      // ส่งไป Firebase
      await reportService.createReport(newReportData)
      
      // real-time listener จะอัปเดตข้อมูลจริงจาก Firebase ภายหลัง
      
    } catch (error: any) {
      // ถ้าเกิด error ให้ลบ temp report ออก
      setReports(prev => prev.filter(report => !report.id.startsWith('temp-')))
      
      console.error('Error creating report:', error)
      throw new Error(error.message || 'ไม่สามารถสร้างรายงานได้')
    }
  }

  // ฟังก์ชันลบรายงานด้วย Firebase
  const deleteReport = async (id: string): Promise<void> => {
    // เก็บข้อมูลเดิมไว้สำหรับ rollback
    const reportToDelete = reports.find(r => r.id === id)
    const previousReports = reports
    
    // Optimistic update: ลบออกจาก UI ทันที
    setReports(prev => prev.filter(report => report.id !== id))
    
    try {
      await reportService.deleteReport(id)
      // real-time listener จะยืนยันการลบภายหลัง
    } catch (error: any) {
      // ถ้า error ให้เพิ่มรายงานกลับคืน
      setReports(previousReports)
      console.error('Error deleting report:', error)
      throw new Error(error.message || 'ไม่สามารถลบรายงานได้')
    }
  }

  // ฟังก์ชันดึงรายงานตาม ID
  const getReportById = (id: string): Report | undefined => {
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