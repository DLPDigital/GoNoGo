"use client"

import { NavbarContent, NavbarItem, Link, Button, Navbar } from "@heroui/react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export const NavBar: React.FC = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }
  return (
    <Navbar position="sticky" className="px-4 py-8 bg-red-900 top-0">
      <div
        className="max-w-4xl w-full mx-auto flex justify-between items-center"
        id="nav-container"
      >
        <NavbarContent className="gap-4" justify="center" id="this-one">
          <NavbarItem id="nav-item">
            <Link color="foreground" href="/dashboard">
              <p className="font-rock3d text-3xl md:text-5xl text-center font-bold text-white">
                Event Buddy
              </p>
            </Link>
          </NavbarItem>
        </NavbarContent>
        {user && (
          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                color="primary"
                onPress={handleLogout}
                className="text-white"
              >
                Sign Out
              </Button>
            </NavbarItem>
          </NavbarContent>
        )}
      </div>
    </Navbar>
  )
}
