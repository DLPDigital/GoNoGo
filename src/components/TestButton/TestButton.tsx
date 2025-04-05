"use client"

import { Button } from "@heroui/react"

export const TestButton = () => (
  <Button onPress={() => console.log("Button clicked!")} variant="solid">
    Test HeroUI Button
  </Button>
)
