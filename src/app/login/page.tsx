'use client'
import Link from 'next/link'
import { useState, FormEvent, ChangeEvent } from 'react'
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../../utils/authContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Attempting login:', formData.email)
    const result = await login(formData.email, formData.password)
    console.log('Login result:', result)
    
    if (!result.success) {
      setError(result.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      setLoading(false)
    }
    // ถ้าสำเร็จจะ redirect ไปที่ dashboard อัตโนมัติ
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            เข้าสู่ระบบ
          </h1>
          <p className="text-gray-600">
            กรอกข้อมูลเพื่อเข้าใช้งาน
          </p>
        </div>

        {/* Demo Info */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-indigo-700 mb-3">ข้อมูลทดสอบ:</h3>
          <p className="text-sm text-indigo-600 font-medium">Email: admin@test.com</p>
          <p className="text-sm text-indigo-600 font-medium">Password: 123456</p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                อีเมล
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 bg-white"
                  placeholder="กรุณากรอกอีเมลของคุณ"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 bg-white"
                  placeholder="กรุณากรอกรหัสผ่าน"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" /> :
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                  }
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 font-medium">
                จดจำฉันไว้
              </label>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              ยังไม่มีบัญชี?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                สมัครสมาชิกเลย
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800 font-medium">
            ← กลับสู่หน้าแรก
          </Link>
        </div>
      </div>
    </div>
  )
}