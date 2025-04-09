"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button, Form as HeroForm, Input } from "@heroui/react"
import { addUserToEvent } from "@/lib/firebase/events"
import { useRouter, useParams } from "next/navigation"

type SignUpFormProps = {
  invited?: boolean
}

export const SignUpForm = ({ invited }: SignUpFormProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const { signUp, user } = useAuth()
  const router = useRouter()
  const params = useParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      // Sign up the user
      await signUp(email, password, username)

      // Wait for auth state to update
      setTimeout(() => {
        if (invited) {
          const id = params?.id as string

          const currentUser = user

          if (id && currentUser) {
            try {
              // Add the new user to the event
              addUserToEvent(id, currentUser.uid, currentUser.email!)
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
          } else {
            router.push(`/events/${id}`)
          }
        } else {
          router.push("/dashboard")
        }
      }, 1000) // Give auth state a moment to update
    } catch (err) {
      // Error handling
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
          type="username"
          label="Username"
          labelPlacement="outside-left"
          onChange={e => setUsername(e.target.value)}
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
        <Input
          type="password"
          label="Confirm Password"
          labelPlacement="outside-left"
          onChange={e => setConfirmPassword(e.target.value)}
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
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </HeroForm>
    </div>
  )
}
