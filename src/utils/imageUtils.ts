import type { Attachment } from '../types'

/**
 * อัปโหลดไฟล์รูปภาพไปยัง Server
 * @param files รายการไฟล์ที่จะอัปโหลด
 * @returns รายการ Attachment ที่อัปโหลดสำเร็จ
 */
export async function uploadImages(files: File[]): Promise<Attachment[]> {
  if (!files || files.length === 0) {
    return []
  }

  try {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'อัปโหลดไฟล์ไม่สำเร็จ')
    }

    const result = await response.json()
    return result.files as Attachment[]

  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

/**
 * ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
 * @param file ไฟล์ที่จะตรวจสอบ
 * @returns true ถ้าเป็นรูปภาพ
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * ตรวจสอบขนาดไฟล์
 * @param file ไฟล์ที่จะตรวจสอบ
 * @param maxSizeMB ขนาดสูงสุด (MB)
 * @returns true ถ้าขนาดไม่เกิน
 */
export function isFileSizeValid(file: File, maxSizeMB: number = 10): boolean {
  const maxSize = maxSizeMB * 1024 * 1024
  return file.size <= maxSize
}

/**
 * แปลงขนาดไฟล์เป็นข้อความ
 * @param bytes ขนาดไฟล์ในหน่วย bytes
 * @returns ข้อความขนาดไฟล์
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * สร้าง preview URL จากไฟล์ (สำหรับแสดงก่อนอัปโหลด)
 * @param file ไฟล์รูปภาพ
 * @returns Promise<string> URL สำหรับ preview
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * ลบ preview URL ที่สร้างไว้ (เพื่อ free memory)
 * @param url URL ที่จะลบ
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url)
}
