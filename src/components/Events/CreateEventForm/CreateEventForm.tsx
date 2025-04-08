"use client"

import { useState } from "react"
import { Button, Form as HeroForm, Input, Textarea } from "@heroui/react"
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
        userId: user.uid,
        attendeeIds: [user.uid],
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
    <HeroForm className="w-full" onSubmit={handleSubmit}>
      <Input
        id="this"
        isRequired
        value={title}
        label="Event Title"
        labelPlacement="outside-left"
        name="title"
        placeholder={title ? title : "Event title"}
        onChange={e => setTitle(e.target.value)}
        type="text"
        className="mb-2 mt-4 flex-col items-start w-full"
        classNames={{
          label: "mb-2",
          input: "py-1",
          mainWrapper: "w-full",
        }}
      />
      <Input
        isRequired
        type="datetime-local"
        label="Date"
        labelPlacement="outside-left"
        name="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="mb-2 flex-col items-start"
        classNames={{
          label: "mb-2",
          input: "py-1",
          mainWrapper: "w-full",
        }}
      />

      <Input
        isRequired
        type="text"
        label="Location"
        labelPlacement="outside-left"
        name="location"
        value={location}
        onChange={e => setLocation(e.target.value)}
        className="mb-2 flex-col items-start"
        classNames={{
          label: "mb-2",
          input: "py-1",
          mainWrapper: "w-full",
        }}
      />

      <Textarea
        label={"Enter description"}
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        className="w-full"
        minRows={3} // This sets the minimum number of rows
        maxRows={6} // This sets the maximum number of rows before scrolling
      />
      <div className="flex justify-end gap-2 pt-8">
        <Button
          type="submit"
          color="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </HeroForm>
  )
}
