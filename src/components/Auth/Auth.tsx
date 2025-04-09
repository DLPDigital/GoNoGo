"use client"

import { useState } from "react"
import { SignInForm } from "@/components/Auth/SignInForm"
import { SignUpForm } from "@/components/Auth/SignUpForm"
import { Button } from "@heroui/react"

type Props = {
  invited?: boolean
}

export const Auth = ({ invited }: Props) => {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="max-w-[600px] w-full p-8 bg-white rounded-lg shadow-lg space-y-6 mx-auto">
      <div>
        <div className="flex justify-center items-center space-x-4 mb-4">
          <Button
            className={isSignIn ? "bg-sky-300" : "bg-amber-300"}
            onPress={() => setIsSignIn(true)}
          >
            Sign In
          </Button>
          <Button
            className={!isSignIn ? "bg-sky-300" : "bg-amber-300"}
            onPress={() => setIsSignIn(false)}
          >
            Sign Up
          </Button>
        </div>
      </div>
      <h2 className="font-poppins">
        {isSignIn ? "Sign In" : "Create Account"}
      </h2>
      {isSignIn ? (
        <SignInForm invited={invited} />
      ) : (
        <SignUpForm invited={invited} />
      )}
    </div>
  )
}
