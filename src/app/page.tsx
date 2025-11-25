import Link from 'next/link'
import { FileText, Clock, Shield, Zap, Upload, BarChart } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-indigo-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ND Report</h1>
                <p className="text-xs text-indigo-600">ระบบแจ้งเรื่อง</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link href="/login" className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all font-medium shadow-sm">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl">
                สมัครใหม่
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            ระบบแจ้งปัญหา
            <span className="text-indigo-600"> หมู่บ้าน</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            แจ้งปัญหาในหมู่บ้านหรือคอนโดได้ง่ายๆ พร้อมติดตามสถานะการแก้ไข
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login" className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              เริ่มใช้งาน
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-indigo-600 rounded-lg flex items-center justify-center mb-6">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">แจ้งปัญหาง่าย</h3>
            <p className="text-gray-600 leading-relaxed">แจ้งปัญหาห้องเสียงดัง น้ำรั่ว แอร์พัง หรือปัญหาอื่นๆ พร้อมแนบรูปภาพ</p>
          </div>
          
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <BarChart className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">ติดตามสถานะ</h3>
            <p className="text-gray-600 leading-relaxed">ติดตามความคืบหน้าการแก้ไข รอรับเรื่อง กำลังแก้ แก้เสร็จ</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">ทีมงานของเรา</h2>
            <p className="text-gray-600 text-lg">ทีมผู้เชี่ยวชาญที่พร้อมให้บริการ</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                A
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">ภูมิภูมินทร์ ธนภคินธยาน์</h3>
              <p className="text-indigo-600 font-semibold mb-3">ผู้จัดการโครงการ</p>
              <p className="text-gray-600 leading-relaxed">ดูแลการประสานงานทั้งระบบ ควบคุมคุณภาพการทำงาน และติดตามความคืบหน้าของโครงการ มีประสบการณ์ด้านการจัดการโครงการมากว่า 5 ปี</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                ส
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">พัฒนดล นิโครธานนท์</h3>
              <p className="text-emerald-600 font-semibold mb-3">นักพัฒนาระบบ</p>
              <p className="text-gray-600 leading-relaxed">พัฒนาและดูแลระบบ รับผิดชอบด้านเทคนิค และแก้ไขปัญหาการใช้งาน เชี่ยวชาญด้าน Full-Stack Development</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg text-center hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                น
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">ภัทรวดี นวลตา</h3>
              <p className="text-amber-600 font-semibold mb-3">นักออกแบบ UI/UX</p>
              <p className="text-gray-600 leading-relaxed">ออกแบบส่วนติดต่อผู้ใช้ให้ใช้งานง่าย สวยงาม และตอบสนองความต้องการผู้ใช้ เชี่ยวชาญด้าน User Experience Design</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl p-10 border border-gray-200 shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">ทำไมต้องเลือกเรา</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">รวดเร็ว</div>
              <div className="text-gray-600 font-medium">ตอบกลับภายใน 24 ชม.</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-emerald-600 mb-2">ง่าย</div>
              <div className="text-gray-600 font-medium">ใช้งานได้ทุกคน</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">เชื่อถือได้</div>
              <div className="text-gray-600 font-medium">ระบบมั่นคง</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-300 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ND Report</span>
          </div>
          <p className="text-gray-300 font-medium">&copy; 2024 ระบบแจ้งเรื่องออนไลน์ สงวนลิขสิทธิ์</p>
        </div>
      </footer>
    </div>
  )
}
