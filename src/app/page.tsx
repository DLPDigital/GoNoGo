"use client"

import { useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { TestButton } from "@/components/TestButton"

export default function Home() {
  useEffect(() => {
    // Test Firebase initialization
    console.log("Firebase Auth initialized:", auth)
    console.log("Firebase Firestore initialized:", db)
  }, [])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Event Buddy</h1>
        <p>Check the console for Firebase initialization status</p>
        <TestButton />
      </main>
    </div>
  )
}
