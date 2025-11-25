'use client'
import { useState } from 'react'
import { createInitialAdmin, createTestUsers } from '../utils/initializeApp'
import { Shield, User, Check, AlertCircle } from 'lucide-react'

export default function FirebaseSetup() {
  const [adminCreated, setAdminCreated] = useState(false)
  const [testUsersCreated, setTestUsersCreated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateAdmin = async () => {
    setLoading(true)
    setError(null)
    try {
      await createInitialAdmin()
      setAdminCreated(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTestUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      await createTestUsers()
      setTestUsersCreated(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ตั้งค่าระบบครั้งแรก</h1>
          <p className="text-gray-600">สร้างผู้ใช้สำหรับระบบ ND Report</p>
        </div>

        <div className="space-y-4">
          {/* Create Admin Button */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">ผู้ดูแลระบบ</span>
              </div>
              {adminCreated && <Check className="w-5 h-5 text-green-500" />}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Email: admin@ndreport.com<br />
              Password: admin123456
            </p>
            <button
              onClick={handleCreateAdmin}
              disabled={loading || adminCreated}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                adminCreated 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
              }`}
            >
              {loading ? 'กำลังสร้าง...' : adminCreated ? 'สร้างแล้ว' : 'สร้างผู้ดูแลระบบ'}
            </button>
          </div>

          {/* Create Test Users Button */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium">ผู้ใช้ทดสอบ</span>
              </div>
              {testUsersCreated && <Check className="w-5 h-5 text-green-500" />}
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Email: user@test.com<br />
              Password: user123456
            </p>
            <button
              onClick={handleCreateTestUsers}
              disabled={loading || testUsersCreated}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                testUsersCreated 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
              }`}
            >
              {loading ? 'กำลังสร้าง...' : testUsersCreated ? 'สร้างแล้ว' : 'สร้างผู้ใช้ทดสอบ'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {adminCreated && testUsersCreated && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-green-800 mb-1">ตั้งค่าเสร็จสมบูรณ์!</h3>
              <p className="text-sm text-green-700">
                สามารถใช้งานระบบได้แล้ว
              </p>
              <a 
                href="/login" 
                className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ไปหน้าเข้าสู่ระบบ
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>หลังจากตั้งค่าเสร็จแล้ว ให้ลบหน้านี้ออก</p>
        </div>
      </div>
    </div>
  )
}