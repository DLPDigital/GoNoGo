"use client"

import { useState } from "react"
import { Button, Form as HeroForm, Input, Textarea } from "@heroui/react"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event.id) return

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
        <Button type="submit" className="bg-sky-300">
          Submit
        </Button>
        <Button onPress={onClose} className="bg-amber-300">
          Cancel
        </Button>
      </div>
    </HeroForm>
  )
}
