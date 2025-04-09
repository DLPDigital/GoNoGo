"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button, Form as HeroForm, Input } from "@heroui/react"
import { useRouter, useParams } from "next/navigation"
import { addUserToEvent } from "@/lib/firebase/events"

type SignInFormProps = {
  invited?: boolean
}

export const SignInForm = ({ invited }: SignInFormProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signIn, user } = useAuth()
  const router = useRouter()
  const params = useParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  
    try {
      // Sign in the user - don't try to use the return value if it's void
      await signIn(email, password)
      
      // After sign in, the user context should be updated
      // We need to wait a moment for the auth state to propagate
      setTimeout(() => {
        if (invited) {
          const id = params?.id as string
          
          if (id && user) {
            try {
              addUserToEvent(id, user.uid, user.email!)
                .then(() => {
                  router.push(`/events/${id}`)
                })
                .catch(error => {
                  console.error("Error joining event:", error)
                  setError("Failed to join event")
                })
            } catch (error) {
              console.error("Error joining event:", error)
              setError("Failed to join event")
            }
          }
        } else {
          router.push("/dashboard")
        }
      }, 1000) // Give auth state a moment to update
    } catch (err) {
      setError("Failed to sign in")
      console.error(err)
    }
  }

  return (
    <div className="max-w-[400px] w-full p-8 bg-white rounded-lg shadow-lg space-y-6 mx-auto">
      <HeroForm className="w-full" onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email"
          labelPlacement="outside-left"
          onChange={e => setEmail(e.target.value)}
          isRequired
          className="mb-2 mt-4 flex-col items-start w-full"
          classNames={{
            label: "mb-2",
            input: "py-1",
            mainWrapper: "w-full",
          }}
        />
        <Input
          type="password"
          label="Password"
          labelPlacement="outside-left"
          onChange={e => setPassword(e.target.value)}
          isRequired
          className="mb-2 mt-4 flex-col items-start w-full"
          classNames={{
            label: "mb-2",
            input: "py-1",
            mainWrapper: "w-full",
          }}
        />
        {error && <p>{error}</p>}
        <Button type="submit" className="bg-sky-300">
          Sign In
        </Button>
      </HeroForm>
    </div>
  )
}
