"use client"

import { Event } from "@/lib/firebase/events"
import { Button, Card, CardFooter, CardHeader, CardBody } from "@heroui/react"
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
    <Card className="py-4 max-w-[600px] mx-auto">
      <Link href={`/events/${event.id}`} title={event.title}>
        <CardHeader>
          <h3 className="font-semibold hover:text-blue-600">{event.title}</h3>
        </CardHeader>
        <CardBody className="pb-0 pt-2 px-4 flex-col items-start">
          <p>{event.description}</p>
          <p>
            Location: <strong>{event.location}</strong>
          </p>
          <p>
            Date: <strong>{event.date}</strong>
          </p>
        </CardBody>
      </Link>
      <CardFooter className="gap-8">
        {showEdit && onEdit && (
          <Button className="bg-sky-300" onPress={() => onEdit(event)}>
            Edit
          </Button>
        )}

        {showDelete && onDelete && (
          <Button className="bg-amber-300" onPress={() => onDelete(event.id!)}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
