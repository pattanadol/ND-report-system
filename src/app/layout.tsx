import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../utils/authContext'
import { ReportsProvider } from '../utils/reportsContext'
import { ReactNode } from 'react'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ND Report System - ระบบแจ้งเรื่องออนไลน์',
  description: 'ระบบสำหรับแจ้งเรื่อง แจ้งปัญหา และจัดการงานขององค์กร',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
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
