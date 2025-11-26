'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase/config'
import Link from 'next/link'
import { CheckCircle, AlertCircle, UserPlus, Shield } from 'lucide-react'

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [error, setError] = useState('')
  const [adminData, setAdminData] = useState({
    email: '',
    password: '',
    name: ''
  })

  // สร้าง Admin User
  const createAdmin = async () => {
    if (!adminData.email || !adminData.password || !adminData.name) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง')
      return
    }

    if (adminData.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    setLoading(true)
    setError('')

    try {
      // สร้าง Admin User
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        adminData.email, 
        adminData.password
      )
      
      const user = userCredential.user

      // บันทึกข้อมูล Admin ใน Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: adminData.email,
        name: adminData.name,
        isAdmin: true,
        createdAt: new Date()
      })

      setCreated(true)
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('อีเมลนี้ถูกใช้งานแล้ว')
      } else if (err.code === 'auth/invalid-email') {
        setError('รูปแบบอีเมลไม่ถูกต้อง')
      } else if (err.code === 'auth/weak-password') {
        setError('รหัสผ่านไม่ปลอดภัยเพียงพอ')
      } else {
        setError(`เกิดข้อผิดพลาด: ${err.message}`)
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          
          {!created ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  สร้างผู้ดูแลระบบ
                </h1>
                <p className="text-gray-600 text-sm">
                  สร้างบัญชี Admin สำหรับจัดการระบบแจ้งปัญหา
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อผู้ดูแล
                  </label>
                  <input
                    type="text"
                    value={adminData.name}
                    onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="เช่น ผู้ดูแลระบบ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={adminData.email}
                    onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสผ่าน
                  </label>
                  <input
                    type="password"
                    value={adminData.password}
                    onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <button
                  onClick={createAdmin}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>กำลังสร้าง...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>สร้างบัญชี Admin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center text-sm text-gray-500">
                มีบัญชีอยู่แล้ว?{' '}
                <Link href="/login" className="text-indigo-600 hover:underline">
                  เข้าสู่ระบบ
                </Link>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  สร้าง Admin สำเร็จ!
                </h2>
                <p className="text-gray-600 mb-6">
                  บัญชีผู้ดูแลระบบพร้อมใช้งานแล้ว
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-left">
                <p className="text-gray-600">
                  <strong>ข้อมูลการเข้าสู่ระบบ:</strong><br />
                  <span className="text-gray-500">ชื่อ:</span> {adminData.name}<br />
                  <span className="text-gray-500">อีเมล:</span> {adminData.email}
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all text-center"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/"
                  className="block w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all text-center"
                >
                  กลับหน้าแรก
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}