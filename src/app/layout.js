import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../utils/authContext'
import { ReportsProvider } from '../utils/reportsContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ND Report System - ระบบแจ้งเรื่องออนไลน์',
  description: 'ระบบสำหรับแจ้งเรื่อง แจ้งปัญหา และจัดการงานขององค์กร',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <AuthProvider>
          <ReportsProvider>
            {children}
          </ReportsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
