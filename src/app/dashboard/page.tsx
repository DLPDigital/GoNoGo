"use client"

import React, { useState } from "react"
import { Authenticated } from "@/layouts/Authenticated"
import { Button } from "@heroui/react"
import { Event } from "@/lib/firebase/events"
import { useEvents } from "@/hooks/useEvents"
import { CreateEventModal } from "@/components/Events/CreateEventModal"
import { EditEventModal } from "@/components/Events/EditEventModal"
import { UpcomingEvents } from "@/components/Events/UpcomingEvents"
import { PastEvents } from "@/components/Events/PastEvents"

const DashboardPage: React.FC = () => {
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const {
    loading,
    upcomingEvents,
    pastEvents,
    fetchEvents,
    deleteEvent,
  } = useEvents()

  const handleEventUpdated = () => {
    fetchEvents()
  }

  return (
    <Authenticated>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button variant="solid" onPress={() => setShowCreateEvent(true)}>
            Create New Event
          </Button>
        </div>

        <CreateEventModal
          isOpen={showCreateEvent}
          onClose={() => setShowCreateEvent(false)}
          onSuccess={handleEventUpdated}
        />

        <EditEventModal
          event={editingEvent}
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          onSuccess={handleEventUpdated}
        />

        {!showCreateEvent && !editingEvent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UpcomingEvents
              events={upcomingEvents}
              loading={loading}
              onEdit={setEditingEvent}
              onDelete={deleteEvent}
            />
            <PastEvents
              events={pastEvents}
              loading={loading}
              onDelete={deleteEvent}
            />
          </div>
        )}
      </div>
    </Authenticated>
  )
}

export default DashboardPage
