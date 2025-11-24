# ND Report System

ระบบแจ้งเรื่องออนไลน์ที่ทันสมัยและใช้งานง่าย

## การติดตั้ง

```bash
# ติดตั้ง dependencies
npm install

# รันเซิร์ฟเวอร์พัฒนา
npm run dev

# สร้างสำหรับ production
npm run build
```

## โครงสร้างโปรเจค

```
src/
├── app/
│   ├── dashboard/     # หน้า Dashboard และ layout
│   ├── login/         # หน้า Login  
│   ├── register/      # หน้า Register
│   ├── globals.css    # CSS หลัก
│   ├── layout.js      # Layout หลัก
│   └── page.js        # หน้าแรก
├── components/        # Components ที่ใช้ร่วมกัน
└── utils/            # Functions ที่ใช้ร่วมกัน
```

## เทคโนโลยี

- **Next.js 14** - React Framework
- **Tailwind CSS** - สำหรับ styling
- **Lucide React** - ไอคอน

## URL

- หน้าแรก: `http://localhost:3001`
- Login: `http://localhost:3001/login`  
- Register: `http://localhost:3001/register`
- Dashboard: `http://localhost:3001/dashboard`
