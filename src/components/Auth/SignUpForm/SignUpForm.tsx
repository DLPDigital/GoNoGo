"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button, Form as HeroForm, Input } from "@heroui/react"
import { FirebaseError } from "firebase/app"

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
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      await signUp(email, password, username, invited)
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err instanceof FirebaseError) {
          if (err.code === "auth/email-already-in-use") {
            setError("Email already in use")
          } else if (err.code === "auth/weak-password") {
            setError("Password should be at least 6 characters")
          } else {
            setError("Failed to create account")
          }
          console.error(err)
        }
      }
    } finally {
      setLoading(false)
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
