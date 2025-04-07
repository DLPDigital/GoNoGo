"use client"

import { Event } from "@/lib/firebase/events"
import { Button } from "@heroui/react"
import Link from "next/link"

interface EventCardLiteProps {
  event: Event
  onEdit?: (event: Event) => void
  onDelete?: (eventId: string) => void
  showEdit?: boolean
  showDelete?: boolean
}

export const EventCardLite = ({
  event,
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = false,
}: EventCardLiteProps) => {
  return (
    <div className="border rounded p-4">
      <div className="flex justify-between items-start">
        <div>
          <Link href={`/events/${event.id}`} title={event.title}>
            <h3 className="font-semibold hover:text-blue-600">{event.title}</h3>
            <p className="text-sm text-gray-600">
              {new Date(event.date).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">{event.location}</p>
            {event.description && (
              <p className="text-sm text-gray-500 mt-2">{event.description}</p>
            )}
          </Link>
        </div>
      </div>
      <div className="flex space-x-2">
        {showEdit && onEdit && (
          <Button color="primary" onPress={() => onEdit(event)}>
            Edit
          </Button>
        )}

        {showDelete && onDelete && (
          <Button color="danger" onPress={() => onDelete(event.id!)}>
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
