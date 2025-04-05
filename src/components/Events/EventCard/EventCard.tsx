"use client"

import { Event } from "@/lib/firebase/events"
import { Button } from "@heroui/react"
import Link from "next/link"

interface EventCardProps {
  event: Event
  onEdit?: (event: Event) => void
  onDelete?: (eventId: string) => void
  showEdit?: boolean
  showDelete?: boolean
}

export const EventCard = ({
  event,
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = false,
}: EventCardProps) => {
  return (
    <div className="border rounded p-4">
      <div className="flex justify-between items-start">
        <div>
          <Link href={`/events/${event.id}`}>
            <h3 className="font-semibold hover:text-blue-600">{event.title}</h3>
          </Link>
          <p className="text-sm text-gray-600">
            {new Date(event.date)
.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">{event.location}</p>
          {event.description && (
            <p className="text-sm text-gray-500 mt-2">{event.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          {showEdit && onEdit && (
            <Button variant="light" onPress={() => onEdit(event)}>
              Edit
            </Button>
          )}

          {showDelete && onDelete && (
            <Button
              variant="light"
              color="danger"
              onPress={() => onDelete(event.id!)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
