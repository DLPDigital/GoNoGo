"use client"

import { NavbarContent, NavbarItem, Link, Button, Navbar } from "@heroui/react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export const NavBar: React.FC = () => {
  const { user, userProfile, logout } = useAuth()
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
    <Navbar position="sticky" className="px-4 py-8 bg-rose-400 top-0 z-50">
      <div
        className="max-w-4xl w-full mx-auto flex justify-between items-center"
        id="nav-container"
      >
        <NavbarContent className="gap-4" justify="center" id="this-one">
          <NavbarItem id="nav-item">
            <Link color="foreground" href="/dashboard">
              <p className="font-poppins text-xl md:text-5xl text-center font-bold text-white">
                GoNoGo
              </p>
            </Link>
          </NavbarItem>
        </NavbarContent>
        {user && (
          <NavbarContent justify="end">
            <NavbarItem>
              <p onClick={handleLogout} className="text-white">
                Sign out {userProfile ? userProfile.username : ""}
              </p>
            </NavbarItem>
          </NavbarContent>
        )}
      </div>
    </Navbar>
  )
}
