import { reportService } from './reportService'
import type { Report, ReportPriority } from '../../types'

// ข้อมูลรายงานเริ่มต้นสำหรับ Demo
const initialReports: Omit<Report, 'id' | 'date'>[] = [
  {
    title: 'ห้องข้างเสียงดังมาก',
    description: 'ห้อง B205 เสียงดังมากตั้งแต่เที่ยงคืนถึงเช้า เข้าปาร์ตี้ดัง รบกวนการพักผ่อนของลูกบ้าน',
    category: 'เรื่องร้องเรียน',
    status: 'รอรับเรื่อง',
    priority: 'สูง' as ReportPriority,
    createdBy: 'นายเสมา อยู่สุข',
    contactEmail: 'sama@email.com',
    contactPhone: '081-234-5678',
    location: 'ห้อง B205 ชั้น 12',
    additionalInfo: 'เสียงดังตั้งแต่หลัง 22.00 น. รบกวนการนอน'
  },
  {
    title: 'ส้วมตัน น้ำท้วม',
    description: 'ส้วมชั้น 15 ตันมาก น้ำท้วมขึ้นมา กลิ่นเหม็น โทรแล้วแต่ยังไม่มีคนมาซ่อม',
    category: 'การบำรุงรักษา',
    status: 'กำลังดำเนินการ',
    priority: 'เร่งด่วน' as ReportPriority,
    createdBy: 'คุณหนิง ผู้อยู่อาศัย',
    contactEmail: 'ning@email.com',
    contactPhone: '089-876-5432',
    location: 'อาคาร A ชั้น 15',
    additionalInfo: 'ติดต่อนิติบุคคลแล้ว ขอช่างมาด่วน'
  },
  {
    title: 'แอร์ไม่เย็น ร้อนมาก',
    description: 'ห้อง A302 แอร์เปิดไม่เย็น อากาศร้อนมาก ด้านในมีเสียงผิดปกติ ไม่สามารถปรับอุณหภูมิได้',
    category: 'ปัญหาไฟฟ้า',
    status: 'แก้ไขเสร็จ',
    priority: 'ปานกลาง' as ReportPriority,
    createdBy: 'ปิ่นเกล้า ช่างดี',
    contactEmail: 'pinkao@email.com',
    contactPhone: '092-345-6789',
    location: 'ห้อง A302 ชั้น 3',
    additionalInfo: 'ต้องการใช้แอร์ทุกวัน เพราะการทำงานที่บ้าน'
  },
  {
    title: 'น้ำรั่วจากท่อ น้ำท่วมลิฟท์',
    description: 'มีน้ำรั่วจากท่อน้ำรั่วขึ้นมาถึงชั้น 8 เริ่มรั่วเมื่อเช้า ตอนนี้ราว 12.00 น. น้ำท่วมลิฟท์',
    category: 'การบำรุงรักษา',
    status: 'แก้ไขเสร็จ',
    priority: 'สูง' as ReportPriority,
    createdBy: 'ลุงป้า สนิท',
    contactEmail: 'lung@email.com',
    contactPhone: '081-567-8901',
    location: 'อาคาร B ชั้น 8',
    additionalInfo: 'ได้โทรแจ้งช่างแล้ว จะมาตรวจสอบวันนี้'
  },
  {
    title: 'ลิฟท์ติดค้าง ไม่ขึ้นลง',
    description: 'ลิฟท์อาคาร B ติดค้างที่ชั้น 7 แล้ว 5 นาที ประตูเปิดปิดไม่สนิท เด็กเล็กต้องเดินบันไดขึ้น',
    category: 'ลิฟท์และบันได',
    status: 'รอรับเรื่อง',
    priority: 'เร่งด่วน' as ReportPriority,
    createdBy: 'นายเขียว ดีใจ',
    contactEmail: 'khiao@email.com',
    contactPhone: '086-123-4567',
    location: 'อาคาร B ลิฟท์หลัก',
    additionalInfo: 'มีผู้สูงอายุติดค้างอยู่ข้างใน ขอช่างด่วน'
  },
  {
    title: 'พื้นบริเวณส่วนกลางแตก',
    description: 'พื้นหินที่ลานเล่นของอาคาร A แตกหัก เป็นอันตรายต่อผู้สัญจร โดยเฉพาะเด็กเล็ก',
    category: 'ความปลอดภัย',
    status: 'กำลังดำเนินการ',
    priority: 'สูง' as ReportPriority,
    createdBy: 'นางสาว จิตตดี',
    contactEmail: 'jit@email.com',
    contactPhone: '088-765-4321',
    location: 'ลานเล่น อาคาร A',
    additionalInfo: 'มีการติดกล้องวงจร ขอเพิ่ม security เฝ้าดูพื้นที่'
  },
  {
    title: 'ความดันน้ำไม่พอ น้ำไหลช้า',
    description: 'แรงดันน้ำในหลายชั้นไม่เพียงพอ น้ำยังขุ่นอยู่ อาจเป็นปัญหาจากปั๊มน้ำ มีกลิ่นไม่ดี',
    category: 'ปัญหาน้ำประปา',
    status: 'แก้ไขเสร็จ',
    priority: 'ปานกลาง' as ReportPriority,
    createdBy: 'น้องไผ่ เขียวขัน',
    contactEmail: 'nongpai@email.com',
    contactPhone: '085-987-6543',
    location: 'อาคาร C',
    additionalInfo: 'ได้ติดต่อช่างแล้ว จะมาเช็ครระบบปั๊มน้ำ'
  },
  {
    title: 'WiFi ส่วนกลางช้า เชื่อมต่อไม่ได้',
    description: 'อินเตอร์เน็ต WiFi ในส่วนกลาง ชั้น 8 ช้ามาก ไม่สามารถใช้งานได้ เป็นปัญหาการ Work from Home',
    category: 'สิ่งแวดล้อม',
    status: 'รอรับเรื่อง',
    priority: 'ต่ำ' as ReportPriority,
    createdBy: 'สมพงษ์ ทำงานดี',
    contactEmail: 'sompong@email.com',
    contactPhone: '089-234-5678',
    location: 'ส่วนกลาง ชั้น 8',
    additionalInfo: 'ต้องใช้อินเตอร์เน็ตสำหรับการทำงาน โทรแจ้งนิติบุคคลแล้ว'
  },
  {
    title: 'ไฟที่ลานจอดรถมืด',
    description: 'ไฟฟ้าที่ลานจอดรถดับหลายดวง เมื่อเย็นมืดมาก ไม่ปลอดภัยสำหรับผู้สัญจร',
    category: 'ปัญหาไฟฟ้า',
    status: 'กำลังดำเนินการ',
    priority: 'ปานกลาง' as ReportPriority,
    createdBy: 'วิชัย รักรถ',
    contactEmail: 'wichai@email.com',
    contactPhone: '087-456-7890',
    location: 'ลานจอดรถยนต์',
    additionalInfo: 'มีผู้ใช้บริการร้องเรียน ขอให้เร่งแก้ไข'
  },
  {
    title: 'ระบบ CCTV ทำงานผิดปกติ',
    description: 'กล้องวงจรปิดหน้าอาคารเสีย ไม่สามารถบันทึกภาพได้ มีปัญหาความปลอดภัย',
    category: 'ความปลอดภัย',
    status: 'รอรับเรื่อง',
    priority: 'สูง' as ReportPriority,
    createdBy: 'นายศักดิ์ เฝ้าระวัง',
    contactEmail: 'sak@email.com',
    contactPhone: '084-321-0987',
    location: 'หน้าอาคาร A',
    additionalInfo: 'จำเป็นต้องแก้ไขด่วนเพื่อความปลอดภัย'
  }
]

// ฟังก์ชันสำหรับ seed ข้อมูลเริ่มต้น
export async function seedInitialData(): Promise<boolean> {
  try {
    console.log('Starting to seed initial data...')
    
    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const existingReports = await reportService.getAllReports()
    
    if (existingReports.length > 0) {
      console.log('Data already exists, skipping seed')
      return true
    }
    
    // เพิ่มข้อมูลทีละตัว
    for (let i = 0; i < initialReports.length; i++) {
      const reportData = initialReports[i]
      console.log(`Creating report ${i + 1}/${initialReports.length}: ${reportData.title}`)
      
      try {
        await reportService.createReport(reportData)
        console.log(`✅ Created: ${reportData.title}`)
      } catch (error) {
        console.error(`❌ Failed to create: ${reportData.title}`, error)
      }
      
      // รอหน่อยระหว่างการสร้าง เพื่อไม่ให้ Firebase เกิด rate limit
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log('✅ Initial data seeding completed!')
    return true
    
  } catch (error) {
    console.error('Error seeding initial data:', error)
    return false
  }
}