"use client"

import { Event } from "@/lib/firebase/events"
import { Button } from "@heroui/react"
import { EditEventForm } from "../EditEventForm"

interface EditEventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const EditEventModal = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}: EditEventModalProps) => {
  if (!isOpen || !event) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Event</h2>
        </div>
        <EditEventForm event={event} onClose={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  )
}
