"use client"

import { Button } from "@heroui/react"
import { CreateEventForm } from "../CreateEventForm"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CreateEventModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateEventModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Event</h2>
          <Button color="primary" onPress={onClose}>
            Cancel
          </Button>
        </div>
        <CreateEventForm onClose={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  )
}
