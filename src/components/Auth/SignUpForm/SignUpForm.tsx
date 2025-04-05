"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button, Input } from "@heroui/react"
import { authStyles } from "@/styles/auth"
import { FirebaseError } from "firebase/app"

export const SignUpForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
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
      await signUp(email, password)
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
    <form onSubmit={handleSubmit} className={authStyles.form.container}>
      <div className={authStyles.form.inputContainer}>
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={authStyles.form.input}
          disabled={loading}
        />
      </div>
      <div className={authStyles.form.inputContainer}>
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={authStyles.form.input}
          disabled={loading}
        />
      </div>
      <div className={authStyles.form.inputContainer}>
        <Input
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className={authStyles.form.input}
          disabled={loading}
        />
      </div>
      {error && <p className={authStyles.form.error}>{error}</p>}
      <Button
        type="submit"
        variant="solid"
        className={authStyles.form.submitButton}
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  )
}
