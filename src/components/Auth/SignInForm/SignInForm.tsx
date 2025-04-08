"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button, Form as HeroForm, Input } from "@heroui/react"
import { useRouter } from "next/navigation"

type SignInFormProps = {
  invited?: boolean;
}

export const SignInForm = ({ invited }: SignInFormProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await signIn(email, password)
      if (!invited) {
        router.push("/dashboard")
      }
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
        <Button
          type="submit"
          color="primary"
        >
          Sign In
        </Button>
      </HeroForm>
    </div>
  )
}
