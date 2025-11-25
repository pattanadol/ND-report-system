# ND Report System 📋

## นี่คืออะไร?

เว็บไซต์สำหรับแจ้งปัญหาต่างๆ ในองค์กร เหมือนกับการส่งใบแจ้งซ่อม แต่ทำผ่านเว็บให้สะดวกและติดตามได้

## ใช้เทคโนโลยีอะไร?

- **Next.js** - เฟรมเวิร์คสำหรับสร้างเว็บไซต์
- **TypeScript** - JavaScript แต่ปลอดภัยกว่า
- **React** - สร้าง UI ที่ใช้งานง่าย
- **Tailwind CSS** - จัดหน้าตาให้สวย

## ระบบมีอะไรบ้าง?

### สำหรับผู้ดูแล (Admin)

- ดูเรื่องแจ้งทั้งหมด
- เปลี่ยนสถานะ (รอรับเรื่อง → กำลังทำ → เสร็จแล้ว)
- ลบเรื่องที่ไม่เหมาะสม
- ดูสถิติภาพรวม

### สำหรับผู้ใช้งาน (User)

- แจ้งปัญหาใหม่
- ดูเรื่องแจ้งของตัวเอง
- ติดตามว่าแก้ไขแล้วหรือยัง

## วิธีใช้งาน

1. เข้าเว็บไซต์
2. สมัครสมาชิก หรือ ล็อกอิน
3. แจ้งปัญหาผ่านฟอร์ม
4. รอการแก้ไขจากทีมงาน

## ทดลองใช้

### บัญชี Admin

- Email: `admin@test.com`
- Password: `123456`

### บัญชี User

- Email: `user@test.com`
- Password: `123456`

## การติดตั้ง

```bash
# ติดตั้งโปรแกรมที่จำเป็น
npm install

# เปิดใช้งาน
npm run dev

# เข้าดูที่ http://localhost:3000
```

## โครงสร้างไฟล์หลักๆ

```text
src/
├── app/
│   ├── login/           # หน้าล็อกอิน
│   ├── register/        # หน้าสมัครสมาชิก
│   └── dashboard/       # หน้าหลักหลังล็อกอิน
│       ├── create/      # แจ้งเรื่องใหม่
│       ├── reports/     # จัดการเรื่องแจ้ง (Admin)
│       └── user/        # หน้าสำหรับ User
├── utils/
│   ├── authContext.tsx  # จัดการการล็อกอิน
│   └── reportsContext.tsx # จัดการข้อมูลเรื่องแจ้ง
└── types/               # กำหนดโครงสร้างข้อมูล
```

## รายละเอียดโค้ดสำคัญ

### 1. ระบบ Authentication (authContext.tsx)

```typescript
// สร้าง Context สำหรับจัดการผู้ใช้
interface AuthContextType {
  user: User | null          // ข้อมูลผู้ใช้ปัจจุบัน
  login: (email: string, password: string) => boolean
  logout: () => void
  register: (userData: RegisterData) => boolean
}

// ฟังก์ชันล็อกอิน - ตรวจสอบอีเมลและรหัสผ่าน
const login = (email: string, password: string): boolean => {
  const foundUser = users.find(u => 
    u.email === email && u.password === password
  )
  if (foundUser) {
    setUser(foundUser)  // เก็บข้อมูลผู้ใช้
    localStorage.setItem('user', JSON.stringify(foundUser))
    return true
  }
  return false
}
```

### 2. ระบบจัดการเรื่องแจ้ง (reportsContext.tsx)

```typescript
// สร้าง Context สำหรับจัดการเรื่องแจ้ง
interface ReportsContextType {
  reports: Report[]          // รายการเรื่องแจ้งทั้งหมด
  addReport: (data: ReportData) => Report
  updateReportStatus: (id: number, status: string) => void
  deleteReport: (id: number) => void
}

// ฟังก์ชันเพิ่มเรื่องแจ้งใหม่
const addReport = (reportData: ReportData): Report => {
  const newReport = {
    ...reportData,
    id: Date.now(),  // สร้าง ID ใหม่
    date: new Date().toISOString().split('T')[0],
    status: 'รอรับเรื่อง'  // สถานะเริ่มต้น
  }
  setReports(prev => [newReport, ...prev])  // เพิ่มในรายการ
  localStorage.setItem('reports', JSON.stringify([newReport, ...reports]))
  return newReport
}
```

### 3. หน้าล็อกอิน (login/page.tsx)

```typescript
const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  // จัดการการส่งฟอร์ม
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // ตรวจสอบข้อมูล
    if (!email || !password) {
      setError('กรุณากรอกข้อมูลให้ครบ')
      return
    }

    // ลองล็อกอิน
    const success = login(email, password)
    if (success) {
      router.push('/dashboard')  // ไปหน้า Dashboard
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
  }
}
```

### 4. Dashboard Layout (dashboard/layout.tsx)

```typescript
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // ตรวจสอบสิทธิ์ผู้ใช้
  if (!user) {
    return <div>กรุณาล็อกอินก่อน</div>
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar เมนู */}
      <aside className="w-64 bg-slate-800 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">ND Report System</h2>
          <p className="text-slate-300">สวัสดี {user.name}</p>
        </div>
        
        {/* เมนูต่างกันตาม Role */}
        <nav className="mt-8">
          {user.role === 'admin' ? (
            // เมนู Admin
            <>
              <MenuItem href="/dashboard" icon={Home}>หน้าหลัก</MenuItem>
              <MenuItem href="/dashboard/reports" icon={FileText}>จัดการเรื่องแจ้ง</MenuItem>
              <MenuItem href="/dashboard/create" icon={Plus}>แจ้งเรื่องใหม่</MenuItem>
            </>
          ) : (
            // เมนู User
            <>
              <MenuItem href="/dashboard/user" icon={User}>หน้าหลัก</MenuItem>
              <MenuItem href="/dashboard/create" icon={Plus}>แจ้งเรื่องใหม่</MenuItem>
            </>
          )}
        </nav>
      </aside>
      
      {/* เนื้อหาหลัก */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

### 5. ฟอร์มแจ้งเรื่อง (create/page.tsx)

```typescript
const CreateReportPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'ปกติ',
    contactEmail: '',
    contactPhone: '',
    location: ''
  })
  const { addReport } = useReports()
  const { user } = useAuth()
  const router = useRouter()

  // อัพเดตข้อมูลฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // ส่งฟอร์ม
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // ตรวจสอบข้อมูล
    if (!formData.title || !formData.description) {
      alert('กรุณากรอกหัวข้อและรายละเอียด')
      return
    }

    // สร้างเรื่องแจ้งใหม่
    const newReport = addReport({
      ...formData,
      createdBy: user?.name || 'ไม่ระบุ'
    })
    
    alert('แจ้งเรื่องเรียบร้อยแล้ว')
    router.push(user?.role === 'admin' ? '/dashboard' : '/dashboard/user')
  }
}
```

### 6. หน้าจัดการเรื่องแจ้ง (reports/page.tsx)

```typescript
const ReportsPage = () => {
  const { reports, updateReportStatus, deleteReport } = useReports()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // กรองและค้นหา
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || 
      report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // เปลี่ยนสถานะ
  const handleStatusChange = (reportId: number, newStatus: string) => {
    updateReportStatus(reportId, newStatus)
    // อัพเดตใน localStorage
    const updatedReports = reports.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    )
    localStorage.setItem('reports', JSON.stringify(updatedReports))
  }
}
```

## การทำงานของระบบ (Flow)

### 1. User Registration & Login Flow

```text
เริ่มต้น → หน้า Register → กรอกข้อมูล → บันทึกใน localStorage → 
→ หน้า Login → ตรวจสอบข้อมูล → เข้า Dashboard (ตาม Role)
```

### 2. Report Creation Flow  

```text
Dashboard → กดแจ้งเรื่องใหม่ → กรอกฟอร์ม → Validate ข้อมูล →
→ บันทึกใน Context & localStorage → แสดงใน Dashboard
```

### 3. Admin Management Flow

```text
Admin Dashboard → ดูรายการเรื่องแจ้งทั้งหมด → เลือกเรื่อง →
→ เปลี่ยนสถานะ → อัพเดต localStorage → รีเฟรช UI
```

## TypeScript Types ที่สำคัญ

```typescript
// ข้อมูลผู้ใช้
interface User {
  id: number
  name: string  
  email: string
  password: string
  role: 'admin' | 'user'
}

// ข้อมูลเรื่องแจ้ง
interface Report {
  id: number
  title: string
  description: string
  category: 'ทั่วไป' | 'IT' | 'ซ่อมบำรุง' | 'อื่นๆ'
  status: 'รอรับเรื่อง' | 'กำลังดำเนินการ' | 'แก้ไขเสร็จ'
  priority: 'ปกติ' | 'ด่วน' | 'ด่วนมาก'
  date: string
  createdBy: string
  contactEmail: string
  contactPhone: string
  location: string
}
```

## State Management Strategy

### Context API แทน Redux

```typescript
// ใช้ useContext แทน Redux เพราะ:
// 1. โปรเจ็คขนาดเล็ก ไม่ซับซ้อน
// 2. ไม่มี async operations มาก  
// 3. เรียนรู้ง่าย maintain ง่าย

const AppProviders = ({ children }) => (
  <AuthProvider>
    <ReportsProvider>
      {children}
    </ReportsProvider>
  </AuthProvider>
)
```

### localStorage เป็น "Database"

```typescript
// เก็บข้อมูลใน localStorage แทน Database เพราะ:
// 1. ไม่ต้องตั้ง Backend/Database ซับซ้อน
// 2. ทำให้ Demo ได้ทันที
// 3. ข้อมูลจะหายเมื่อ clear browser

// ตัวอย่างการเก็บข้อมูล
localStorage.setItem('user', JSON.stringify(user))
localStorage.setItem('reports', JSON.stringify(reports))
```

## การจัดการ UI/UX

### Tailwind CSS Design System

```typescript
// ใช้ Tailwind CSS เพราะ:
// 1. เขียน CSS ได้เร็ว
// 2. Responsive โดยอัตโนมัติ  
// 3. Consistent Design
// 4. File size เล็ก

const buttonStyles = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg",
  danger: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
}
```

### Responsive Design

```typescript
// ออกแบบให้รองรับทุกขนาดหน้าจอ
<div className="
  flex flex-col md:flex-row        // Mobile: แนวตั้ง, Desktop: แนวนอน
  w-full md:w-64                   // Mobile: 100%, Desktop: 64 units
  p-4 md:p-6                       // Mobile: padding 4, Desktop: 6
">
```

## Security & Best Practices

### Frontend Security

```typescript
// 1. Input Validation
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 2. XSS Prevention  
const sanitizeInput = (input: string) => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

// 3. Type Safety
interface LoginForm {
  email: string
  password: string
}
```

### Code Quality

```typescript
// 1. Consistent Naming Convention
// - Components: PascalCase (UserProfile)
// - Functions: camelCase (handleSubmit)
// - Constants: UPPER_CASE (API_URL)

// 2. Error Handling
try {
  const result = await someOperation()
} catch (error) {
  console.error('Operation failed:', error)
  setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
}
```

## Performance Optimizations

### Next.js Features ที่ใช้

```typescript
// 1. App Router (Next.js 13+)
// - File-based routing
// - Automatic code splitting
// - Server components

// 2. Static Generation
// - Pre-build pages ที่ไม่เปลี่ยนแปลง
// - Faster loading times

// 3. Image Optimization
import Image from 'next/image'
<Image src="/logo.png" alt="Logo" width={200} height={100} />
```

## Testing Strategy (ถ้าจะเพิ่ม)

```typescript
// Unit Tests สำหรับ Utility Functions
describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate('2024-01-15')).toBe('15/1/2567')
  })
})

// Integration Tests สำหรับ Components  
describe('LoginForm', () => {
  it('should login successfully with valid credentials', () => {
    // Test login flow
  })
})
```

## ทำไมถึงสร้างโปรเจ็คนี้?

### เป้าหมายการเรียนรู้

1. **เรียนรู้ Modern React** - Hooks, Context API, TypeScript
2. **เข้าใจ Next.js** - App Router, File-based routing  
3. **ฝึก State Management** - จัดการข้อมูลระหว่าง Components
4. **พัฒนา UI/UX Skills** - Tailwind CSS, Responsive Design
5. **เตรียมพร้อมการทำงาน** - Real-world project structure

### ทักษะที่ได้รับ

- ✅ React Hooks (useState, useContext, useEffect)
- ✅ TypeScript Interface และ Type Safety
- ✅ Next.js App Router และ Routing
- ✅ Tailwind CSS และ Responsive Design
- ✅ State Management patterns
- ✅ Form Validation และ Error Handling
- ✅ localStorage จัดการข้อมูล
- ✅ Component composition และ Props

---
