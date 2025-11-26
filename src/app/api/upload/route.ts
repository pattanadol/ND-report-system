import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// ตั้งค่าโฟลเดอร์สำหรับเก็บไฟล์
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์ที่อัปโหลด' },
        { status: 400 }
      )
    }

    // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    const uploadedFiles: { name: string; url: string; size: number; type: string }[] = []

    for (const file of files) {
      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        continue // ข้ามไฟล์ที่ไม่ใช่รูปภาพ
      }

      // ตรวจสอบขนาดไฟล์ (สูงสุด 10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        continue // ข้ามไฟล์ที่ใหญ่เกินไป
      }

      // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const ext = path.extname(file.name) || '.jpg'
      const safeFileName = `${timestamp}-${randomStr}${ext}`
      
      // แปลงไฟล์เป็น Buffer และบันทึก
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const filePath = path.join(UPLOAD_DIR, safeFileName)
      await writeFile(filePath, buffer)
      
      // เก็บข้อมูลไฟล์ที่อัปโหลดสำเร็จ
      uploadedFiles.push({
        name: file.name,
        url: `/uploads/${safeFileName}`, // URL สำหรับเข้าถึงไฟล์
        size: file.size,
        type: file.type
      })
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: 'ไม่สามารถอัปโหลดไฟล์ได้ (ตรวจสอบประเภทและขนาดไฟล์)' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `อัปโหลดสำเร็จ ${uploadedFiles.length} ไฟล์`
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปโหลด' },
      { status: 500 }
    )
  }
}

// Route segment config สำหรับ Next.js App Router
export const dynamic = 'force-dynamic'
