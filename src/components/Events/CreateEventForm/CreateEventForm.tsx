"use client"

import { useState } from "react"
import { Button, Input } from "@heroui/react"
import { useAuth } from "@/contexts/AuthContext"
import { createEvent } from "@/lib/firebase/events"

interface CreateEventFormProps {
  onClose: () => void
  onSuccess: () => void
}

export const CreateEventForm = ({
  onClose,
  onSuccess,
}: CreateEventFormProps) => {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      await createEvent({
        title,
        date,
        description,
        location,
        attendeeIds: [user.uid],
        userId: user.uid,
      })
      onClose()
      onSuccess()
      console.log("Creating event:", {
        title,
        date,
        location,
        description,
      })
    } catch (error) {
      console.error("Failed to create event:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          label={title ? title : "Enter title"}
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="datetime-local"
          label=""
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="text"
          label={location ? location : "Enter location"}
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="text"
          label={description ? description : "Enter description"}
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full"
        />
      </div>
      <Button
        type="submit"
        color="primary"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Event"}
      </Button>
    </form>
  )
}
