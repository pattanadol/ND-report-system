import { authService } from '../lib/services'

// สคริปต์สำหรับสร้าง admin user แรก
export async function createInitialAdmin() {
  try {
    await authService.createAdminUser(
      'admin@ndreport.com', // email
      'admin123456',        // password  
      'ผู้ดูแลระบบ'           // name
    )
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@ndreport.com')
    console.log('🔑 Password: admin123456')
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  }
}

// สำหรับสร้าง user ทดสอบ
export async function createTestUsers() {
  try {
    // สร้าง user ทั่วไป
    await authService.register({
      email: 'user@test.com',
      password: 'user123456',
      name: 'ผู้ใช้ทดสอบ'
    })
    console.log('✅ Test user created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating test users:', error)
  }
}

// Export สำหรับใช้ใน component
export { createInitialAdmin as default }