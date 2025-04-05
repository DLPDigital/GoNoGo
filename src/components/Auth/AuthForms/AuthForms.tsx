"use client"

import { useState } from "react"
import { SignInForm } from "@/components/Auth/SignInForm"
import { SignUpForm } from "@/components/Auth/SignUpForm"
import { Button } from "@heroui/react"
import { authStyles } from "@/styles/auth"

export const AuthForms = () => {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className={authStyles.card.container}>
      <div className={authStyles.card.wrapper}>
        <h2 className={authStyles.card.header}>
          {isSignIn ? "Sign In" : "Create Account"}
        </h2>
        <div className={authStyles.card.toggleContainer}>
          <div className={authStyles.card.toggleButtons}>
            <Button
              variant={isSignIn ? "solid" : "light"}
              onPress={() => setIsSignIn(true)}
              className={authStyles.card.toggleButton}
            >
              Sign In
            </Button>
            <Button
              variant={!isSignIn ? "solid" : "light"}
              onPress={() => setIsSignIn(false)}
              className={authStyles.card.toggleButton}
            >
              Sign Up
            </Button>
          </div>
        </div>
        {isSignIn ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  )
}
