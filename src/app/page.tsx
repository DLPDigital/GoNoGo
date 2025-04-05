"use client"

import { useEffect } from "react"
import { auth, db } from "@/lib/firebase/config"
import { AuthForms } from "@/components/Auth/AuthForms"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Test Firebase initialization
    console.log("Firebase Auth initialized:", auth)
    console.log("Firebase Firestore initialized:", db)

    if (user) {
      console.log('User is logged in, redirecting to dashboard')
      router.push('/dashboard')
    }
  }, [user, router])

  return <AuthForms />
}