"use client"

import { Event } from "@/lib/firebase/events"
import { EventCardLite } from "../EventCardLite/EventCardLite"

interface PastEventsProps {
  events: Event[]
  loading: boolean
  onDelete: (eventId: string) => void
}

export const PastEvents = ({ events, loading, onDelete }: PastEventsProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Past Events</h2>
      {loading ? (
        <p>Loading...</p>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events.map(event => (
            <EventCardLite
              key={event.id}
              event={event}
              onDelete={onDelete}
              showEdit={false}
              showDelete={true}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No past events</p>
      )}
    </div>
  )
}
