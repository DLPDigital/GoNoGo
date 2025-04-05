"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button, Input } from "@heroui/react"
import { authStyles } from "@/styles/auth"
import { useRouter } from "next/navigation"

export const SignInForm = () => {
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
      router.push("/dashboard")
    } catch (err) {
      setError("Failed to sign in")
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={authStyles.form.container}>
      <div className={authStyles.form.inputContainer}>
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={authStyles.form.input}
        />
      </div>
      <div className={authStyles.form.inputContainer}>
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={authStyles.form.input}
        />
      </div>
      {error && <p className={authStyles.form.error}>{error}</p>}
      <Button
        type="submit"
        variant="solid"
        className={authStyles.form.submitButton}
      >
        Sign In
      </Button>
    </form>
  )
}
