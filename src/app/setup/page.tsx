'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase/config'
import Link from 'next/link'
import { CheckCircle, AlertCircle, User, Database } from 'lucide-react'

export default function SetupPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string[]>([])
  const [adminData, setAdminData] = useState({
    email: '',
    password: '',
    name: ''
  })

  // ทดสอบการเชื่อมต่อ Firebase
  const testFirebaseConnection = async () => {
    setLoading(true)
    setErrors([])
    setSuccess([])

    try {
      // ทดสอบ Auth
      if (!auth) throw new Error('Firebase Auth ไม่พร้อมใช้งาน')
      setSuccess(prev => [...prev, '✅ Firebase Authentication เชื่อมต่อสำเร็จ'])

      // ทดสอบ Firestore
      if (!db) throw new Error('Firebase Firestore ไม่พร้อมใช้งาน')
      setSuccess(prev => [...prev, '✅ Firebase Firestore เชื่อมต่อสำเร็จ'])

      setSuccess(prev => [...prev, '🎉 Firebase พร้อมใช้งาน!'])
      setStep(2)
    } catch (error: any) {
      setErrors([`❌ เกิดข้อผิดพลาด: ${error.message}`])
    }

    setLoading(false)
  }

  // สร้าง Admin User และข้อมูลทดสอบ
  const createAdminAndTestData = async () => {
    setLoading(true)
    setErrors([])
    setSuccess([])

    try {
      // สร้าง Admin User
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        adminData.email, 
        adminData.password
      )
      
      const user = userCredential.user
      setSuccess(prev => [...prev, '✅ สร้าง Admin User สำเร็จ'])

      // บันทึกข้อมูล Admin ใน Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: adminData.email,
        name: adminData.name,
        isAdmin: true,
        createdAt: new Date()
      })
      setSuccess(prev => [...prev, '✅ บันทึกข้อมูล Admin ใน Database สำเร็จ'])

      // สร้างข้อมูลรายงานทดสอบ
      const testReport = {
        title: 'รายงานทดสอบระบบ',
        description: 'นี่คือรายงานทดสอบการทำงานของระบบ Firebase',
        category: 'ทดสอบระบบ',
        status: 'รอรับเรื่อง',
        priority: 'ปานกลาง',
        location: 'ห้องทดสอบ',
        contactPhone: '081-234-5678',
        contactEmail: adminData.email,
        additionalInfo: 'สร้างโดยระบบ Setup',
        createdBy: user.uid,
        createdAt: new Date()
      }

      await addDoc(collection(db, 'reports'), testReport)
      setSuccess(prev => [...prev, '✅ สร้างรายงานทดสอบสำเร็จ'])

      setSuccess(prev => [...prev, '🎉 ตั้งค่าเริ่มต้นเสร็จสิ้น!'])
      setStep(3)

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors(['⚠️ อีเมล Admin นี้ถูกใช้งานแล้ว - ระบบพร้อมใช้งาน'])
        setStep(3)
      } else {
        setErrors([`❌ เกิดข้อผิดพลาด: ${error.message}`])
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ตั้งค่าเริ่มต้นระบบ
            </h1>
            <p className="text-gray-600">
              ทดสอบการเชื่อมต่อ Firebase และสร้างข้อมูลเริ่มต้น
            </p>
          </div>

          {/* Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <div className={`w-12 h-1 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step 1: Test Firebase Connection */}
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Database className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ทดสอบการเชื่อมต่อ Firebase
                </h2>
                <p className="text-gray-600 mb-6">
                  ตรวจสอบว่า Firebase Authentication และ Firestore พร้อมใช้งาน
                </p>
                <button
                  onClick={testFirebaseConnection}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'กำลังทดสอบ...' : 'เริ่มทดสอบ'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Create Admin */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  สร้าง Admin User
                </h2>
                <p className="text-gray-600 mb-6">
                  สร้างผู้ดูแลระบบคนแรกและข้อมูลทดสอบ
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อีเมล Admin
                  </label>
                  <input
                    type="email"
                    value={adminData.email}
                    onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="กรุณากรอกอีเมล Admin เช่น admin@company.com"
                    required
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="สร้างรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อผู้ดูแล
                  </label>
                  <input
                    type="text"
                    value={adminData.name}
                    onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="กรุณากรอกชื่อผู้ดูแลระบบ"
                    required
                  />
                </div>
                <button
                  onClick={createAdminAndTestData}
                  disabled={loading || !adminData.email || !adminData.password || !adminData.name || adminData.password.length < 6}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'กำลังสร้าง...' : 'สร้าง Admin และข้อมูลทดสอบ'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ตั้งค่าเสร็จสิ้น!
                </h2>
                <p className="text-gray-600 mb-6">
                  ระบบพร้อมใช้งาน สามารถเริ่มใช้งานได้เลย
                </p>
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all mr-4"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/"
                    className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
                  >
                    กลับหน้าแรก
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p className="text-gray-600">
                  <strong>ข้อมูลการเข้าสู่ระบบ Admin:</strong><br />
                  อีเมล: {adminData.email}<br />
                  รหัสผ่าน: {adminData.password}
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          {success.length > 0 && (
            <div className="mt-8 space-y-2">
              {success.map((msg, index) => (
                <div key={index} className="flex items-center space-x-2 text-green-700 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{msg}</span>
                </div>
              ))}
            </div>
          )}

          {errors.length > 0 && (
            <div className="mt-8 space-y-2">
              {errors.map((error, index) => (
                <div key={index} className="flex items-center space-x-2 text-red-700 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}