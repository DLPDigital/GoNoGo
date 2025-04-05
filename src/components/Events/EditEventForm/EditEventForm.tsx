"use client"

import { useState } from "react"
import { Button, Input } from "@heroui/react"
import { Event, updateEvent } from "@/lib/firebase/events"

interface EditEventFormProps {
  event: Event
  onClose: () => void
  onSuccess: () => void
}

export const EditEventForm = ({
  event,
  onClose,
  onSuccess,
}: EditEventFormProps) => {
  const [title, setTitle] = useState(event.title)
  const [date, setDate] = useState(event.date)
  const [description, setDescription] = useState(event.description || "")
  const [location, setLocation] = useState(event.location)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event.id) return

    setLoading(true)
    try {
      await updateEvent(event.id, {
        title,
        date,
        description,
        location,
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Failed to update event:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          label="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="datetime-local"
          label="Event Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="text"
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="text"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex space-x-2">
        <Button
          type="submit"
          variant="solid"
          className="flex-1"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="light"
          onPress={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
