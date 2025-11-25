'use client'
import { useState, useEffect } from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'

interface LoadingTimeoutProps {
  loading: boolean
  timeout?: number // milliseconds
  onTimeout?: () => void
  children: React.ReactNode
  fallbackMessage?: string
}

export default function LoadingTimeout({ 
  loading, 
  timeout = 10000, // 10 seconds default
  onTimeout,
  children,
  fallbackMessage = "การโหลดใช้เวลานานกว่าปกติ คุณสามารถรีเฟรชหน้าเพจได้"
}: LoadingTimeoutProps) {
  const [showTimeout, setShowTimeout] = useState(false)

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowTimeout(true)
        onTimeout?.()
      }, timeout)

      return () => {
        clearTimeout(timer)
        setShowTimeout(false)
      }
    } else {
      setShowTimeout(false)
    }
  }, [loading, timeout, onTimeout])

  if (!loading) {
    return <>{children}</>
  }

  if (showTimeout) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            กำลังโหลดข้อมูล...
          </h2>
          <p className="text-gray-600 mb-6">
            {fallbackMessage}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>รีเฟรชหน้าเพจ</span>
            </button>
            <div className="text-sm text-gray-500">
              หรือรอสักครู่ ระบบกำลังโหลดข้อมูลจาก Firebase...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600">กำลังโหลดข้อมูล...</p>
        <div className="text-xs text-gray-400 mt-2">
          กำลังเชื่อมต่อกับ Firebase Database
        </div>
      </div>
    </div>
  )
}