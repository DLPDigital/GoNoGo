"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="h-[calc(100vh-6.5rem)] bg-gray-50">
      <main className="max-w-4xl mx-auto px-6 lg:px-8" id="main-bit">
        {children}
      </main>
    </div>
  )
}
