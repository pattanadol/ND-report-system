# ND Report System - ระบบแจ้งปัญหาหมู่บ้าน/คอนโด

ระบบแจ้งเรื่องออนไลน์ที่ทันสมัยและใช้งานง่าย สำหรับการแจ้งปัญหาในหมู่บ้านและคอนโดมิเนียม

## 🎯 ความสามารถของระบบ

### สำหรับผู้ใช้ (User)

- แจ้งปัญหาใหม่ (น้ำรั่ว, เสียงดัง, แอร์พัง, ฯลฯ)
- ดูเรื่องแจ้งของตนเอง
- ติดตามสถานะการแก้ไข
- ลบรายงานที่ไม่ต้องการ

### สำหรับผู้ดูแลระบบ (Admin)

- ดูและจัดการเรื่องแจ้งทั้งหมด
- เปลี่ยนสถานะการแก้ไข (รอรับเรื่อง → กำลังดำเนินการ → แก้ไขเสร็จ)
- ลบรายงาน
- ดูสถิติภาพรวม

## 👤 บัญชีทดสอบ

```text
Admin (ผู้ดูแลระบบ):
- Email: admin@test.com
- Password: 123456

User (ผู้ใช้ทั่วไป):  
- Email: user@test.com
- Password: 123456
```

## 🚀 การติดตั้งและรันโปรเจค

```bash
# เข้าไปในโฟลเดอร์ frontend
cd frontend

# ติดตั้ง dependencies
npm install

# รันเซิร์ฟเวอร์พัฒนา
npm run dev

# เปิดเว็บไซต์ที่ http://localhost:3000
```

## 📁 โครงสร้างไฟล์และโฟลเดอร์

### 📂 โฟลเดอร์หลัก

```text
frontend/
├── src/                    # โค้ดหลักของโปรเจค
├── public/                 # ไฟล์รูปภาพและ assets
├── package.json            # ข้อมูลโปรเจคและ dependencies
└── README.md              # คู่มือการใช้งาน (ไฟล์นี้)
```

### 📂 src/ - โค้ดหลัก

```text
src/
├── app/                    # หน้าเว็บไซต์ทั้งหมด (Next.js App Router)
├── components/             # ส่วนประกอบที่ใช้ร่วมกัน  
└── utils/                 # ฟังก์ชันและข้อมูลที่ใช้ร่วมกัน
```

### 📂 app/ - หน้าเว็บไซต์

```text
app/
├── page.js                 # หน้าแรก (Landing Page)
├── layout.js               # Template หลักของเว็บไซต์
├── globals.css             # CSS หลักของทั้งเว็บไซต์
├── login/                  # หน้า Login
│   └── page.js
├── register/               # หน้า Register  
│   └── page.js
└── dashboard/              # หน้าต่างๆ ของระบบหลัก
    ├── layout.js           # Template ของ Dashboard
    ├── page.js             # หน้าหลัก Admin
    ├── user/               # หน้าสำหรับ User
    │   └── page.js
    ├── create/             # หน้าแจ้งปัญหาใหม่
    │   └── page.js
    └── reports/            # หน้าจัดการรายงาน (Admin เท่านั้น)
        ├── page.js         # รายการรายงานทั้งหมด
        └── [id]/           # ดูรายละเอียดรายงาน
            └── page.js
```

### 📂 utils/ - ข้อมูลและฟังก์ชัน

```text
utils/
├── authContext.js          # จัดการการ Login/Logout และสิทธิ์ผู้ใช้
├── reportsContext.js       # จัดการข้อมูลรายงานทั้งหมด
└── helpers.js              # ฟังก์ชันช่วยต่างๆ (จัดรูปแบบวันที่, สี, ฯลฯ)
```

## 🎨 การปรับแต่งสีและรูปลักษณ์

### 🎨 สีหลักของระบบ

ไฟล์: `src/app/globals.css` และในส่วนต่างๆ ของโค้ด

```css
/* สีหลัก */
- น้ำเงิน (Primary): indigo-600, indigo-700
- เทา (Background): slate-50, slate-100  
- ขาว (Cards): white
- แดง (Delete): red-600, red-700
- เขียว (Success): green-600, emerald-600
- ส้ม (Warning): orange-600, amber-600
```

### 🔧 การเปลี่ยนสีปุ่ม

#### ปุ่มหลัก (เช่น "แจ้งปัญหาใหม่")

ไฟล์: `src/app/dashboard/user/page.js` หรือ `src/app/dashboard/page.js`

```javascript
// หาบรรทัดที่มี className เหล่านี้
className="bg-indigo-600 hover:bg-indigo-700"

// เปลี่ยนเป็นสีอื่น เช่น:
className="bg-green-600 hover:bg-green-700"    // สีเขียว
className="bg-purple-600 hover:bg-purple-700"  // สีม่วง  
className="bg-red-600 hover:bg-red-700"        // สีแดง
```

#### ปุ่มลบ

ไฟล์: `src/app/dashboard/user/page.js`

```javascript
// หาบรรทัดที่มี
className="text-red-600 hover:text-red-800"

// เปลี่ยนเป็น:
className="text-purple-600 hover:text-purple-800" // สีม่วง
```

### 🎨 การเปลี่ยนสีพื้นหลัง

#### พื้นหลังหลัก

ไฟล์: `src/app/dashboard/user/page.js`, `src/app/dashboard/page.js`

```javascript
// หาบรรทัด
className="min-h-screen bg-slate-50"

// เปลี่ยนเป็น:
className="min-h-screen bg-blue-50"     // สีฟ้าอ่อน
className="min-h-screen bg-gray-50"     // สีเทาอ่อน
```

#### การ์ด/กล่อง

```javascript
// หาบรรทัด
className="bg-white border border-gray-200"

// เปลี่ยนเป็น:
className="bg-blue-50 border border-blue-200"   // กล่องสีฟ้า
```

### 📊 การเปลี่ยนสีสถิติ

ไฟล์: `src/app/dashboard/user/page.js`

```javascript
// การ์ดสถิติ - หาส่วนที่มี bg-indigo-100, bg-orange-100, ฯลฯ
bg-indigo-100    // พื้นหลังไอคอน
text-indigo-600  // สีข้อความ

// เปลี่ยนเป็นสีอื่น:
bg-purple-100 และ text-purple-600  // สีม่วง
bg-green-100 และ text-green-600    // สีเขียว
```

## 💾 ข้อมูลตัวอย่าง

ข้อมูลรายงานตัวอย่างอยู่ในไฟล์: `src/utils/reportsContext.js`

### การเพิ่มรายงานตัวอย่าง

เปิดไฟล์ `src/utils/reportsContext.js` และเพิ่มใน `initialReports`:

```javascript
{
  id: 99,
  title: 'ปัญหาใหม่',
  description: 'รายละเอียดปัญหา...',
  category: 'เรื่องร้องเรียน',
  status: 'รอรับเรื่อง',
  priority: 'ปานกลาง',
  date: '2024-11-25',
  createdBy: 'ชื่อผู้แจ้ง',
  contactEmail: 'email@test.com',
  contactPhone: '081-234-5678',
  location: 'ห้อง A101',
  additionalInfo: 'ข้อมูลเพิ่มเติม'
}
```

## 🌐 URL และหน้าต่างๆ

```text
หน้าแรก:           http://localhost:3000
เข้าสู่ระบบ:        http://localhost:3000/login
สมัครสมาชิก:       http://localhost:3000/register
Dashboard Admin:    http://localhost:3000/dashboard
Dashboard User:     http://localhost:3000/dashboard/user  
แจ้งปัญหาใหม่:       http://localhost:3000/dashboard/create
จัดการรายงาน:      http://localhost:3000/dashboard/reports
```

## 🛠 เทคโนโลยีที่ใช้

- **Next.js 14** - React Framework สำหรับสร้างเว็บไซต์
- **React 18** - JavaScript Library สำหรับสร้าง User Interface
- **Tailwind CSS** - CSS Framework สำหรับจัดแต่งหน้าตา
- **Lucide React** - ไลบรารี่ไอคอนสวยๆ
- **Context API** - จัดการข้อมูลและสถานะของแอป

## 📝 หมายเหตุสำหรับการพัฒนา

1. **ข้อมูลจะหายหลัง refresh** - เพราะเก็บในหน่วยความจำชั่วคราว
2. **ในการใช้งานจริง** ควรเชื่อมต่อกับฐานข้อมูล
3. **การอัปโหลดรูปภาพ** ยังไม่ได้ทำจริง เป็นเพียง mock-up
4. **การแจ้งเตือน** ใช้ browser alert ซึ่งในการใช้จริงควรใช้ toast notification

## 🎓 สำหรับการนำเสนอ

ระบบนี้เหมาะสำหรับการสาธิตการทำงานของ:

- 🔐 ระบบ Authentication (Login/Role-based access)
- 📱 Responsive Design (ปรับตามขนาดหน้าจอ)
- 🎨 Modern UI/UX Design
- ⚡ Single Page Application (SPA)
- 📊 Dashboard และการจัดการข้อมูล
