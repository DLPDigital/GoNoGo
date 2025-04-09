import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@/styles/globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { NavBar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Event Buddy",
  description: "Event Buddy is a platform for creating and managing events",
}

const mainBackgroundColor = "bg-neutral-100"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${mainBackgroundColor}`}
      >
        <AuthProvider>
          <NavBar />
          <div className="max-w-4xl w-full mx-auto h-[calc(100vh-6.5rem)]">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
