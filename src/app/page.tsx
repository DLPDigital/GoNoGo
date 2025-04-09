"use client"

import { useEffect } from "react"
import { auth, db } from "@/lib/firebase/config"
import { AuthForms } from "@/components/Auth/AuthForms"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { IntroText } from "@/components/IntroText"

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Test Firebase initialization
    console.log("Firebase Auth initialized:", auth)
    console.log("Firebase Firestore initialized:", db)

    if (user) {
      console.log("User is logged in, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <IntroText />
      <AuthForms />
    </div>
  )
}
