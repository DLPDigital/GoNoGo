"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}