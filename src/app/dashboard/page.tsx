"use client"

import React, { useState } from "react"
import { Authenticated } from "@/layouts/Authenticated"
import { Button } from "@heroui/react"
import { Event } from "@/lib/firebase/events"
import { useEvents } from "@/hooks/useEvents"
import { CreateEventModal } from "@/components/Events/CreateEventModal"
import { EditEventModal } from "@/components/Events/EditEventModal"
import { EventCategorySection } from "@/components/Events/EventCategorySection"
import { IntroText } from "@/components/IntroText"
import { HaveToGoEvents } from "@/components/Events/HaveToGoEvents"

const DashboardPage: React.FC = () => {
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const {
    loading,
    upcomingPendingEvents,
    upcomingConfirmedEvents,
    upcomingDeclinedEvents,
    upcomingHaveToGoEvents,
    pastEvents,
    fetchEvents,
    deleteEvent,
  } = useEvents()

  const handleEventUpdated = () => {
    fetchEvents()
  }

  return (
    <Authenticated>
      <div className="pt-8 pb-4">
        <IntroText />
        <div className="flex justify-center items-center mt-8">
          <Button
            className="bg-sky-300"
            onPress={() => setShowCreateEvent(true)}
          >
            Create New Event
          </Button>
        </div>
      </div>

      <div className="space-y-6 pt-12">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EventCategorySection
            title="Upcoming Pending Events"
            events={upcomingPendingEvents}
            loading={loading}
            onEdit={setEditingEvent}
            onDelete={deleteEvent}
            emptyMessage="No pending events"
            badgeColor="bg-yellow-100 text-yellow-800"
          />

          <EventCategorySection
            title="Upcoming Confirmed Events"
            events={upcomingConfirmedEvents}
            loading={loading}
            onEdit={setEditingEvent}
            onDelete={deleteEvent}
            emptyMessage="No confirmed events"
            badgeColor="bg-green-100 text-green-800"
          />

          {/* <HaveToGoEvents
            events={upcomingHaveToGoEvents}
            loading={loading}
            onEdit={setEditingEvent}
            onDelete={deleteEvent}
          /> */}

          <EventCategorySection
            title="Upcoming Events You Have to Go"
            events={upcomingHaveToGoEvents}
            loading={loading}
            onEdit={setEditingEvent}
            onDelete={deleteEvent}
            emptyMessage="No events"
            badgeColor="bg-red-100 text-red-800"
          />

          <EventCategorySection
            title="Upcoming Declined Events"
            events={upcomingDeclinedEvents}
            loading={loading}
            onEdit={setEditingEvent}
            onDelete={deleteEvent}
            emptyMessage="No declined events"
            badgeColor="bg-red-100 text-red-800"
            showDelete
          />

          <EventCategorySection
            title="Past Events"
            events={pastEvents}
            loading={loading}
            onDelete={deleteEvent}
            emptyMessage="No past events"
          />
        </div>
      </div>
    </Authenticated>
  )
}

export default DashboardPage
