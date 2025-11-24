'use client'
import { Mail, Phone, MapPin, Award, Calendar, Target } from 'lucide-react'

export default function AboutPage() {
  const teamMembers = [
    {
      id: 1,
      name: "ภูมิภูมินทร์ ธนภคินธยาน์",
      position: "ผู้จัดการโครงการ",
      avatar: "A",
      color: "from-indigo-500 to-purple-600",
      email: "anuchit@nd-report.com",
      phone: "02-123-4567",
      experience: "5 ปี",
      description: "ดูแลการประสานงานทั้งระบบ ควบคุมคุณภาพการทำงาน และติดตามความคืบหน้าของโครงการ มีประสบการณ์ด้านการจัดการโครงการมากว่า 5 ปี",
      skills: ["การจัดการโครงการ", "การประสานงาน", "การควบคุมคุณภาพ", "การวิเคราะห์ระบบ"]
    },
    {
      id: 2,
      name: "พัฒนดล นิโครธานนท์",
      position: "นักพัฒนาระบบ",
      avatar: "ส",
      color: "from-emerald-500 to-teal-600",
      email: "somchai@nd-report.com",
      phone: "02-234-5678",
      experience: "7 ปี",
      description: "พัฒนาและดูแลระบบ รับผิดชอบด้านเทคนิค และแก้ไขปัญหาการใช้งาน เชี่ยวชาญด้าน Full-Stack Development",
      skills: ["React.js", "Node.js", "Database Design", "System Architecture"]
    },
    {
      id: 3,
      name: "ภัทรวดี นวลตา",
      position: "นักออกแบบ UI/UX",
      avatar: "น",
      color: "from-amber-500 to-orange-600",
      email: "niran@nd-report.com",
      phone: "02-345-6789",
      experience: "4 ปี",
      description: "ออกแบบส่วนติดต่อผู้ใช้ให้ใช้งานง่าย สวยงาม และตอบสนองความต้องการผู้ใช้ เชี่ยวชาญด้าน User Experience Design",
      skills: ["UI Design", "UX Research", "Figma", "User Testing"]
    }
  ]

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">เกี่ยวกับเรา</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              ทีมงาน ND Report System ที่พร้อมให้บริการและพัฒนาระบบแจ้งเรื่องออนไลน์ 
              เพื่อความสะดวกสบายและประสิทธิภาพในการทำงานของทุกคน
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">วิสัยทัศน์</h2>
            <p className="text-gray-600 leading-relaxed">
              เป็นระบบแจ้งเรื่องออนไลน์ที่ใช้งานง่าย เข้าใจง่าย และตอบสนองความต้องการ
              ของผู้ใช้ได้อย่างมีประสิทธิภาพ เพื่อสร้างประสบการณ์การทำงานที่ดีที่สุด
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <Award className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">พันธกิจ</h2>
            <p className="text-gray-600 leading-relaxed">
              พัฒนาเทคโนโลยีและระบบที่ช่วยให้การแจ้งเรื่อง การติดตาม และการจัดการงาน
              เป็นไปอย่างราบรื่น โปร่งใส และมีประสิทธิภาพสูงสุด
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">ทีมงานของเรา</h2>
            <p className="text-gray-600 text-lg">ทีมผู้เชี่ยวชาญที่พร้อมให้บริการและสนับสนุนคุณ</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-slate-50 rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
                {/* Avatar */}
                <div className={`w-24 h-24 bg-gradient-to-br ${member.color} rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {member.avatar}
                </div>

                {/* Basic Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-lg font-semibold text-indigo-600 mb-4">{member.position}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>ประสบการณ์: {member.experience}</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">ความเชี่ยวชาญ</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">ติดต่อเรา</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">ที่อยู่สำนักงาน</h3>
                <p className="text-gray-600">123 ถนนเทคโนโลยี แขวงนวัตกรรม<br />เขตพัฒนา กรุงเทพฯ 10400</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">โทรศัพท์</h3>
                <p className="text-gray-600">02-123-4567<br />02-765-4321</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">อีเมล</h3>
                <p className="text-gray-600">contact@nd-report.com<br />support@nd-report.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}