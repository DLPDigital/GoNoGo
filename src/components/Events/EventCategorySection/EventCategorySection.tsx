import React from "react"
import { Event } from "@/lib/firebase/events"
import { EventCardLite } from "@/components/Events/EventCardLite"

type EventCategorySectionProps = {
  title: string
  events: Event[]
  loading: boolean
  onEdit?: (event: Event) => void
  onDelete?: (eventId: string) => void
  emptyMessage?: string
  badgeColor?: string
}

export const EventCategorySection: React.FC<EventCategorySectionProps> = ({
  title,
  events,
  loading,
  onEdit,
  onDelete,
  emptyMessage = "No events found",
  badgeColor,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-medium">{title}</h2>
        {badgeColor && (
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${badgeColor}`}>
            {events.length}
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events.map(event => (
            <EventCardLite
              key={event.id}
              event={event}
              onEdit={onEdit ? () => onEdit(event) : undefined}
              onDelete={onDelete ? () => onDelete(event.id!) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">{emptyMessage}</div>
      )}
    </div>
  )
}