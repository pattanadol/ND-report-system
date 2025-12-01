'use client'

import { User, Mail, Phone, MapPin, Target, Eye, Heart, Users, Building, Calendar, Globe, BookOpen } from 'lucide-react'

interface TeamMember {
  id: number
  name: string
  role: string
  studentId: string
  email: string
  image: string
  fallback: string
  responsibility: string
  skills: string[]
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'ภูมิภูมินทร์ ธนภคินธยาน์',
    role: 'หัวหน้าโปรเจค',
    studentId: '1650706672',
    email: 'bhumbhumin.than@bumail.net',
    image: '/images/team/member1.jpg',
    fallback: 'ซิล',
    responsibility: 'รับผิดชอบวางแผนโครงการ จัดสรรงาน ประสานงานในทีม และดูแลภาพรวมการพัฒนาทั้งหมด',
    skills: ['Project Planning', 'Documentation', 'Team Coordination']
  },
  {
    id: 2,
    name: 'พัฒนดล นิโครธานนท์',
    role: 'พัฒนาระบบ',
    studentId: '1650708074',
    email: 'pattanadol.niko@bumail.net',
    image: '/images/team/member2.jpg',
    fallback: 'โด่ง',
    responsibility: 'รับผิดชอบพัฒนาเว็บแอปพลิเคชัน ออกแบบฐานข้อมูล และเชื่อมต่อระบบต่างๆ เข้าด้วยกัน',
    skills: ['Next.js', 'TypeScript', 'Firebase']
  },
  {
    id: 3,
    name: 'ภัทรวดี นวลตา',
    role: 'ออกแบบ UI/UX',
    studentId: '1650707803',
    email: 'pattarawadee.nuan@bumail.net',
    image: '/images/team/member3.jpg',
    fallback: 'มด',
    responsibility: 'รับผิดชอบออกแบบหน้าตาเว็บไซต์ ทำ Wireframe และดูแลให้ระบบใช้งานง่าย',
    skills: ['UI Design', 'Figma', 'Wireframing']
  }
]

const projectInfo = {
  name: 'ND Report System',
  fullName: 'ระบบแจ้งปัญหาและติดตามสถานะ',
  semester: 'ภาคเรียนที่ 1/2568',
  course: 'CS319/427E Internet Programming 1',
  advisor: 'อ.ชยันต์พล วุฒิวระธรรม',
  institution: 'คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยกรุงเทพ'
}

const objective = "พัฒนาระบบเว็บแอปพลิเคชันสำหรับรับแจ้งปัญหาต่างๆ ในชุมชน โดยผู้ใช้สามารถแจ้งเรื่อง แนบรูปภาพ และติดตามสถานะได้ ซึ่งจะช่วยให้การจัดการปัญหาในพื้นที่เป็นไปอย่างมีระบบและรวดเร็วขึ้น"

const scope = "ระบบนี้ครอบคลุมการลงทะเบียนผู้ใช้ การเข้าสู่ระบบ การแจ้งปัญหาพร้อมแนบรูป การติดตามสถานะ และการจัดการข้อมูลโดยผู้ดูแลระบบ โดยใช้ Next.js ร่วมกับ Firebase เป็นฐานข้อมูลและระบบ Authentication"

const learnings = [
  {
    title: "การวางแผนโครงการ",
    description: "ได้เรียนรู้การวางแผนงาน แบ่งหน้าที่ และกำหนดระยะเวลาให้เหมาะสมกับทีม"
  },
  {
    title: "การพัฒนาเว็บแอปพลิเคชัน",
    description: "ได้ลงมือพัฒนาจริงด้วย Next.js และ TypeScript ซึ่งเป็นเทคโนโลยีที่ใช้กันแพร่หลาย"
  },
  {
    title: "การออกแบบ UI/UX",
    description: "ได้ออกแบบหน้าจอให้ใช้งานง่ายและเหมาะกับกลุ่มผู้ใช้หลากหลายวัย"
  },
  {
    title: "การทำงานเป็นทีม",
    description: "ได้ฝึกการสื่อสาร ประสานงาน และแก้ปัญหาร่วมกันในทีม"
  },
  {
    title: "การใช้ Firebase",
    description: "ได้เรียนรู้การใช้ Firebase ทั้งระบบ Authentication และ Firestore Database"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
            เกี่ยวกับเรา
          </h1>
        </div>

        {/* Objective & Scope Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Objective */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
              <div className="bg-indigo-100 p-3 rounded-xl mb-3 sm:mb-0 sm:mr-4 w-fit">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">วัตถุประสงค์</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg">
              {objective}
            </p>
          </div>

          {/* Scope */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mb-3 sm:mb-0 sm:mr-4 w-fit">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">ขอบเขตของโปรเจค</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg">
              {scope}
            </p>
          </div>
        </div>

        {/* Learnings Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-amber-100 p-3 rounded-xl mr-4">
                <BookOpen className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">สิ่งที่ได้เรียนรู้</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learnings.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-xl mb-3 sm:mb-0 sm:mr-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">สมาชิกในกลุ่ม</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="card-compact text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-4 overflow-hidden shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = 'none'
                      const fallbackEl = target.parentElement?.querySelector('.fallback-text')
                      if (fallbackEl) fallbackEl.classList.remove('hidden')
                    }}
                  />
                  <span className="fallback-text hidden">{member.fallback}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-semibold mb-1 text-xs sm:text-sm">{member.role}</p>
                <p className="text-slate-400 text-xs mb-4">รหัสนักศึกษา: {member.studentId}</p>
                <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                  {member.responsibility}
                </p>
                
                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {member.skills.map((skill, index) => (
                      <span key={index} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="text-xs text-slate-500 border-t pt-4">
                  <div className="flex items-center justify-center">
                    <Mail className="w-3 h-3 mr-2" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Information */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                <div className="bg-white bg-opacity-20 p-3 rounded-xl mb-3 sm:mb-0 sm:mr-4 w-fit">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">{projectInfo.name}</h2>
                  <p className="text-slate-300 text-base sm:text-lg">{projectInfo.fullName}</p>
                </div>
              </div>
              
              <div className="space-y-4 text-slate-200">
                <div className="flex items-start">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-3 mt-1 text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">ภาคเรียน</p>
                    <p className="text-xs sm:text-sm">{projectInfo.semester}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-3 mt-1 text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">รายวิชา</p>
                    <p className="text-xs sm:text-sm">{projectInfo.course}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-3 mt-1 text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">อาจารย์ที่ปรึกษา</p>
                    <p className="text-xs sm:text-sm">{projectInfo.advisor}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-6">สถาบันการศึกษา</h3>
              <div className="space-y-4 text-slate-200 mb-6">
                <div className="flex items-start">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-3 mt-1 text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">{projectInfo.institution}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h4 className="font-bold text-base sm:text-lg mb-3">เทคโนโลยีที่ใช้</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs sm:text-sm">Next.js 14</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs sm:text-sm">TypeScript</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs sm:text-sm">Firebase</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs sm:text-sm">Tailwind CSS</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white border-opacity-20 text-center">
            <p className="text-slate-300 text-sm sm:text-base px-4">
              โปรเจคนี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น ไม่ได้มีวัตถุประสงค์เชิงพาณิชย์
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}