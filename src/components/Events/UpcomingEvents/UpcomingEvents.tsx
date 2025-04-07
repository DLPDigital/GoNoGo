"use client"

import { Event } from "@/lib/firebase/events"
import { EventCardLite } from "../EventCardLite/EventCardLite"

interface UpcomingEventsProps {
  events: Event[]
  loading: boolean
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
}

export const UpcomingEvents = ({
  events,
  loading,
  onEdit,
  onDelete,
}: UpcomingEventsProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
      {loading ? (
        <p>Loading...</p>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events.map(event => (
            <EventCardLite
              key={event.id}
              event={event}
              onEdit={onEdit}
              onDelete={onDelete}
              showEdit={true}
              showDelete={true}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No upcoming events</p>
      )}
    </div>
  )
}
