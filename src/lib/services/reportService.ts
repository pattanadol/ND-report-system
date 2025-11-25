import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Report, ReportStatus, ReportPriority, Attachment } from '../../types'

const REPORTS_COLLECTION = 'reports'

// Interface สำหรับข้อมูลที่จะส่งไป Firestore
interface FirestoreReportData {
  title: string
  description: string
  category: string
  status: ReportStatus
  priority: ReportPriority
  createdBy: string
  contactEmail: string
  contactPhone: string
  location: string
  additionalInfo?: string
  attachments?: Attachment[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Interface สำหรับข้อมูลที่ได้จาก Firestore
interface FirestoreReport extends FirestoreReportData {
  id: string
}

class ReportService {
  // ดึงรายงานทั้งหมด
  async getAllReports(): Promise<Report[]> {
    try {
      const q = query(
        collection(db, REPORTS_COLLECTION),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      const reports: Report[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreReportData
        reports.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          category: data.category,
          status: data.status,
          priority: data.priority,
          date: data.createdAt.toDate().toISOString().split('T')[0],
          createdBy: data.createdBy,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          location: data.location,
          additionalInfo: data.additionalInfo || '',
          attachments: data.attachments || []
        })
      })
      
      return reports
    } catch (error) {
      console.error('Error getting reports:', error)
      throw new Error('ไม่สามารถดึงข้อมูลรายงานได้')
    }
  }

  // ดึงรายงานตาม ID
  async getReportById(id: string): Promise<Report | null> {
    try {
      const docRef = doc(db, REPORTS_COLLECTION, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data() as FirestoreReportData
        return {
          id: docSnap.id,
          title: data.title,
          description: data.description,
          category: data.category,
          status: data.status,
          priority: data.priority,
          date: data.createdAt.toDate().toISOString().split('T')[0],
          createdBy: data.createdBy,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          location: data.location,
          additionalInfo: data.additionalInfo || '',
          attachments: data.attachments || []
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting report:', error)
      throw new Error('ไม่สามารถดึงข้อมูลรายงานได้')
    }
  }

  // สร้างรายงานใหม่
  async createReport(reportData: Omit<Report, 'id' | 'date' | 'status'>): Promise<string> {
    try {
      const now = Timestamp.now()
      const firestoreData: FirestoreReportData = {
        title: reportData.title,
        description: reportData.description,
        category: reportData.category,
        status: 'รอรับเรื่อง' as ReportStatus,
        priority: reportData.priority,
        createdBy: reportData.createdBy,
        contactEmail: reportData.contactEmail,
        contactPhone: reportData.contactPhone,
        location: reportData.location,
        additionalInfo: reportData.additionalInfo,
        attachments: reportData.attachments || [],
        createdAt: now,
        updatedAt: now
      }
      
      const docRef = await addDoc(collection(db, REPORTS_COLLECTION), firestoreData)
      return docRef.id
    } catch (error) {
      console.error('Error creating report:', error)
      throw new Error('ไม่สามารถสร้างรายงานได้')
    }
  }

  // อัปเดตสถานะรายงาน
  async updateReportStatus(id: string, status: ReportStatus): Promise<void> {
    try {
      const docRef = doc(db, REPORTS_COLLECTION, id)
      await updateDoc(docRef, {
        status: status,
        updatedAt: Timestamp.now()
      })
    } catch (error) {
      console.error('Error updating report status:', error)
      throw new Error('ไม่สามารถอัปเดตสถานะรายงานได้')
    }
  }

  // อัปเดตรายงาน
  async updateReport(id: string, updates: Partial<Report>): Promise<void> {
    try {
      const docRef = doc(db, REPORTS_COLLECTION, id)
      const updateData: any = {
        updatedAt: Timestamp.now()
      }
      
      // อัปเดตเฉพาะฟิลด์ที่ส่งมา
      if (updates.title) updateData.title = updates.title
      if (updates.description) updateData.description = updates.description
      if (updates.category) updateData.category = updates.category
      if (updates.priority) updateData.priority = updates.priority
      if (updates.location) updateData.location = updates.location
      if (updates.contactEmail) updateData.contactEmail = updates.contactEmail
      if (updates.contactPhone) updateData.contactPhone = updates.contactPhone
      if (updates.additionalInfo !== undefined) updateData.additionalInfo = updates.additionalInfo
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error updating report:', error)
      throw new Error('ไม่สามารถอัปเดตรายงานได้')
    }
  }

  // ลบรายงาน
  async deleteReport(id: string): Promise<void> {
    try {
      const docRef = doc(db, REPORTS_COLLECTION, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting report:', error)
      throw new Error('ไม่สามารถลบรายงานได้')
    }
  }

  // ฟัง real-time updates
  subscribeToReports(callback: (reports: Report[]) => void): () => void {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      orderBy('createdAt', 'desc')
    )
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reports: Report[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreReportData
        reports.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          category: data.category,
          status: data.status,
          priority: data.priority,
          date: data.createdAt.toDate().toISOString().split('T')[0],
          createdBy: data.createdBy,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          location: data.location,
          additionalInfo: data.additionalInfo || '',
          attachments: data.attachments || []
        })
      })
      callback(reports)
    }, (error) => {
      console.error('Error listening to reports:', error)
    })
    
    return unsubscribe
  }
}

export const reportService = new ReportService()
export default reportService