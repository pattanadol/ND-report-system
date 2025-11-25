import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  Timestamp 
} from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const USERS_COLLECTION = 'users'

// Interface สำหรับข้อมูลผู้ใช้
export interface UserProfile {
  uid: string
  email: string
  name: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

// Interface สำหรับการสมัครสมาชิก
export interface RegisterData {
  email: string
  password: string
  name: string
}

// Interface สำหรับการล็อกอิน
export interface LoginData {
  email: string
  password: string
}

class AuthService {
  // สมัครสมาชิก
  async register(data: RegisterData): Promise<UserProfile> {
    try {
      console.log('Starting Firebase Auth registration...')
      
      // สร้าง user ใน Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      )
      
      const user = userCredential.user
      console.log('Firebase Auth success:', user.uid)
      
      // อัปเดต display name
      await updateProfile(user, {
        displayName: data.name
      })
      console.log('Updated display name')
      
      // สร้างโปรไฟล์ใน Firestore
      const userProfile: Omit<UserProfile, 'uid'> & { uid?: string } = {
        email: data.email,
        name: data.name,
        isAdmin: false, // ผู้ใช้ทั่วไปจะไม่ใช่ admin
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      console.log('Saving user profile to Firestore...', userProfile)
      
      // บันทึกลง Firestore
      await setDoc(doc(db, USERS_COLLECTION, user.uid), userProfile)
      console.log('Firestore save success')
      
      return {
        uid: user.uid,
        ...userProfile
      } as UserProfile
      
    } catch (error: any) {
      console.error('Registration error details:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // แปลง error messages เป็นภาษาไทย
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('อีเมลนี้ถูกใช้งานแล้ว')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('รูปแบบอีเมลไม่ถูกต้อง')
      } else if (error.code === 'permission-denied') {
        throw new Error('ไม่มีสิทธิ์เข้าถึงฐานข้อมูล กรุณาตรวจสอบ Firestore Rules')
      } else if (error.message && error.message.includes('Missing or insufficient permissions')) {
        throw new Error('ไม่มีสิทธิ์เข้าถึงฐานข้อมูล กรุณาตรวจสอบ Firestore Rules')
      }
      
      throw new Error(error.message || 'ไม่สามารถสมัครสมาชิกได้')
    }
  }

  // เข้าสู่ระบบ
  async login(data: LoginData): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      )
      
      const user = userCredential.user
      
      // ดึงโปรไฟล์จาก Firestore
      const userProfile = await this.getUserProfile(user.uid)
      
      if (!userProfile) {
        throw new Error('ไม่พบข้อมูลผู้ใช้')
      }
      
      return userProfile
      
    } catch (error: any) {
      console.error('Error logging in:', error)
      if (error.code === 'auth/user-not-found') {
        throw new Error('ไม่พบผู้ใช้นี้ในระบบ')
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('รหัสผ่านไม่ถูกต้อง')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('รูปแบบอีเมลไม่ถูกต้อง')
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณาลองใหม่ในภายหลัง')
      }
      throw new Error(error.message || 'ไม่สามารถเข้าสู่ระบบได้')
    }
  }

  // ออกจากระบบ
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw new Error('ไม่สามารถออกจากระบบได้')
    }
  }

  // ดึงโปรไฟล์ผู้ใช้
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, USERS_COLLECTION, uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          uid: uid,
          email: data.email,
          name: data.name,
          isAdmin: data.isAdmin || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  // สร้าง admin user (สำหรับการตั้งค่าเริ่มต้น)
  async createAdminUser(email: string, password: string, name: string): Promise<void> {
    try {
      // สร้าง user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // อัปเดต display name
      await updateProfile(user, {
        displayName: name
      })
      
      // สร้างโปรไฟล์ admin
      const adminProfile = {
        email: email,
        name: name,
        isAdmin: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      await setDoc(doc(db, USERS_COLLECTION, user.uid), adminProfile)
      
    } catch (error) {
      console.error('Error creating admin user:', error)
      throw new Error('ไม่สามารถสร้าง admin user ได้')
    }
  }

  // ตรวจสอบสถานะการล็อกอิน
  onAuthStateChange(callback: (user: UserProfile | null) => void): () => void {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // ผู้ใช้ล็อกอินอยู่
        const userProfile = await this.getUserProfile(user.uid)
        callback(userProfile)
      } else {
        // ผู้ใช้ไม่ได้ล็อกอิน
        callback(null)
      }
    })
    
    return unsubscribe
  }

  // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
  async isAdmin(uid: string): Promise<boolean> {
    try {
      const userProfile = await this.getUserProfile(uid)
      return userProfile?.isAdmin || false
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  // ดึงผู้ใช้ปัจจุบัน
  getCurrentUser(): User | null {
    return auth.currentUser
  }
}

export const authService = new AuthService()
export default authService