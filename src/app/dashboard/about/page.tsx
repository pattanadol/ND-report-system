'use client'

import { User, Mail, Phone, MapPin, Target, Eye, Heart, Users, Building, Calendar, Globe } from 'lucide-react'

interface TeamMember {
  id: number
  name: string
  role: string
  email: string
  phone: string
  avatar: string
  bio: string
  skills: string[]
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'ภูมิภูมินทร์ ธนภคินธยาน์',
    role: 'Project Manager & System Architect',
    email: 'phumiphumin@nd-report.com',
    phone: '081-234-5678',
    avatar: 'PM',
    bio: 'ผู้จัดการโครงการที่มีประสบการณ์กว่า 8 ปีในการพัฒนาระบบสารสนเทศและการจัดการทีม มีความเชี่ยวชาญในการวางแผนโครงการและการออกแบบสถาปัตยกรรมระบบ',
    skills: ['Project Management', 'System Architecture', 'Agile/Scrum', 'Team Leadership']
  },
  {
    id: 2,
    name: 'พัฒนดล นิโครธานนท์',
    role: 'Senior Full-Stack Developer',
    email: 'pattanadol@nd-report.com',
    phone: '082-345-6789',
    avatar: 'DEV',
    bio: 'นักพัฒนาซอฟต์แวร์ที่มีความเชี่ยวชาญด้าน TypeScript, React, Next.js และ Node.js มีประสบการณ์ในการพัฒนาเว็บแอปพลิเคชันที่มีประสิทธิภาพสูงและใช้งานง่าย',
    skills: ['TypeScript', 'React/Next.js', 'Node.js', 'Database Design', 'API Development']
  },
  {
    id: 3,
    name: 'ภัทรวดี นวลตา',
    role: 'Lead UI/UX Designer',
    email: 'pattarawadee@nd-report.com',
    phone: '083-456-7890',
    avatar: 'UX',
    bio: 'นักออกแบบที่มีความเชี่ยวชาญในการสร้างประสบการณ์ผู้ใช้ที่ยอดเยี่ยม เน้นการออกแบบที่เข้าใจง่าย สวยงาม และตอบสนองความต้องการของผู้ใช้อย่างแท้จริง',
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems']
  }
]

const companyInfo = {
  name: 'ND Development Team',
  fullName: 'NextGen Digital Development Team',
  founded: '2024',
  location: 'กรุงเทพมหานคร, ประเทศไทย',
  email: 'info@nd-report.com',
  phone: '02-123-4567',
  website: 'https://nd-report.com',
  address: '123/45 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110'
}

const mission = "พัฒนาระบบสารสนเทศที่ใช้งานง่าย มีประสิทธิภาพสูง และตอบสนองต่อความต้องการของผู้ใช้งานอย่างแท้จริง เพื่อช่วยเพิ่มประสิทธิภาพการทำงานและคุณภาพชีวิตของผู้คนในชุมชน"

const vision = "เป็นทีมพัฒนาซอฟต์แวร์ชั้นนำในประเทศไทยที่สร้างสรรค์นวัตกรรมทางเทคโนโลยีเพื่อแก้ไขปัญหาในชุมชนและสังคม พร้อมก้าวสู่การเป็นผู้นำด้านเทคโนโลยีในภูมิภาคเอเชียตะวันออกเฉียงใต้"

const values = [
  {
    title: "คุณภาพเป็นเลิศ",
    description: "มุ่งมั่นในการส่งมอบผลงานที่มีคุณภาพสูงสุด ทำงานด้วยความพิถีพิถันและใส่ใจในทุกรายละเอียด"
  },
  {
    title: "นวัตกรรมและความคิดสร้างสรรค์",
    description: "ใช้เทคโนโลยีล่าสุดและแนวคิดใหม่ๆ เพื่อแก้ไขปัญหาและสร้างสรรค์โซลูชันที่ดีที่สุด"
  },
  {
    title: "ความรับผิดชอบต่อสังคม",
    description: "รับผิดชอบต่อผลงานและผลกระทบต่อสังคม มุ่งหวังให้เทคโนโลยีที่เราสร้างเป็นประโยชน์ต่อทุกคน"
  },
  {
    title: "การทำงานเป็นทีม",
    description: "ร่วมมือกัน แบ่งปันความรู้ และสนับสนุนซึ่งกันและกันเพื่อบรรลุเป้าหมายร่วม"
  },
  {
    title: "การเรียนรู้ตลอดชีวิต",
    description: "พัฒนาตนเองอย่างต่อเนื่อง ติดตามเทคโนโลยีใหม่ๆ และแบ่งปันความรู้ให้กับชุมชน"
  }
]

const achievements = [
  { year: '2024', title: 'ก่อตั้งทีม ND Development', description: 'เริ่มต้นการพัฒนาระบบแจ้งเรื่องออนไลน์' },
  { year: '2024', title: 'เปิดตัว ND Report System', description: 'ระบบแจ้งเรื่องแรกของเรา พร้อมฟีเจอร์ครบครัน' },
  { year: '2024', title: 'รับเสียงตอบรับเชิงบวก', description: 'ได้รับการยอมรับจากผู้ใช้งานในชุมชนต่างๆ' }
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
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            ทีมพัฒนาระบบสารสนเทศที่มุ่งมั่นสร้างสรรค์เทคโนโลยีเพื่อชุมชนและสังคม
            <br className="hidden sm:inline" />
            ด้วยความเชี่ยวชาญและประสบการณ์ เราพร้อมนำเสนอโซลูชันที่ดีที่สุด
          </p>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Mission */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
              <div className="bg-indigo-100 p-3 rounded-xl mb-3 sm:mb-0 sm:mr-4 w-fit">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">พันธกิจ</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg">
              {mission}
            </p>
          </div>

          {/* Vision */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mb-3 sm:mb-0 sm:mr-4 w-fit">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">วิสัยทัศน์</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg">
              {vision}
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-xl mr-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">คุณค่าองค์กร</h2>
            </div>
            <p className="text-slate-600 text-lg">หลักการและความเชื่อที่เป็นรากฐานในการทำงานของเรา</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
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
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">ทีมงานของเรา</h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg px-4">บุคลากรมากความสามารถที่มุ่งมั่นพัฒนาเทคโนโลยีเพื่อสังคม</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="card-compact text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-semibold mb-4 text-xs sm:text-sm">{member.role}</p>
                <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                  {member.bio}
                </p>
                
                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-2 text-xs text-slate-500 border-t pt-4">
                  <div className="flex items-center justify-center">
                    <Mail className="w-3 h-3 mr-2" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Phone className="w-3 h-3 mr-2" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Timeline */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl mb-3 sm:mb-0 sm:mr-4">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">ความสำเร็จของเรา</h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg px-4">เส้นทางการพัฒนาและความก้าวหน้าของทีม</p>
          </div>
          
          <div className="relative">
            <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
            
            <div className="space-y-6 sm:space-y-8">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex flex-col sm:flex-row sm:items-center ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'}`}>
                    <div className="card-compact">
                      <div className={`flex flex-col sm:flex-row items-start sm:items-center mb-2 ${index % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}>
                        <div className={`bg-indigo-100 px-3 py-1 rounded-full mb-2 sm:mb-0 ${index % 2 !== 0 ? 'sm:ml-3' : 'sm:mr-3'} w-fit`}>
                          <span className="text-indigo-600 font-bold text-sm">{achievement.year}</span>
                        </div>
                        <h3 className={`text-base sm:text-lg font-bold text-slate-800 ${index % 2 !== 0 ? 'sm:order-1' : ''}`}>
                          {achievement.title}
                        </h3>
                      </div>
                      <p className="text-slate-600 text-sm sm:text-base">{achievement.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 w-4 h-4 bg-white border-4 border-indigo-500 rounded-full mx-auto my-4 sm:my-0 hidden sm:block"></div>
                  <div className="flex-1 hidden sm:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                <div className="bg-white bg-opacity-20 p-3 rounded-xl mb-3 sm:mb-0 sm:mr-4 w-fit">
                  <Building className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">{companyInfo.name}</h2>
                  <p className="text-slate-300 text-base sm:text-lg">{companyInfo.fullName}</p>
                </div>
              </div>
              
              <div className="space-y-4 text-slate-200">
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-3 mt-1 text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">สำนักงาน</p>
                    <p className="text-xs sm:text-sm">{companyInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-indigo-400" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">ก่อตั้งปี {companyInfo.founded}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-indigo-400" />
                  <div>
                    <p className="font-medium text-xs sm:text-sm break-all">{companyInfo.website}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-6">ติดต่อเรา</h3>
              <div className="space-y-4 text-slate-200 mb-6">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-indigo-400" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">{companyInfo.email}</p>
                    <p className="text-xs sm:text-sm text-slate-300">สำหรับการติดต่อทั่วไป</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-3 text-indigo-400" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">{companyInfo.phone}</p>
                    <p className="text-xs sm:text-sm text-slate-300">วันจันทร์-ศุกร์ 9:00-18:00 น.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h4 className="font-bold text-base sm:text-lg mb-3">เวลาทำการ</h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>จันทร์ - ศุกร์</span>
                    <span>09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>เสาร์</span>
                    <span>09:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>อาทิตย์</span>
                    <span>ปิดทำการ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white border-opacity-20 text-center">
            <p className="text-slate-300 text-sm sm:text-base px-4">
              <strong>พร้อมที่จะเริ่มต้นโครงการใหม่กับเราหรือไม่?</strong> ติดต่อเราได้ทุกเวลา เราพร้อมให้คำปรึกษาและแก้ไขปัญหาของคุณ
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}