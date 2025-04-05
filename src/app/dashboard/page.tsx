"use client"

import React, { useState } from "react"
import { Authenticated } from "@/layouts/Authenticated"
import { Button } from "@heroui/react"
import { CreateEventForm } from "@/components/Events/CreateEventForm"
import { Event } from "@/lib/firebase/events"
import { EditEventForm } from "@/components/Events/EditEventForm"
import { useEvents } from "@/hooks/useEvents"

const DashboardPage: React.FC = () => {
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const { loading, upcomingEvents, pastEvents, fetchEvents, deleteEvent } =
    useEvents()
  // const [events, setEvents] = useState<Event[]>([])
  // const [loading, setLoading] = useState(true)
  // const { user } = useAuth()

  const handleEventUpdated = () => {
    fetchEvents()
  }
  // const upcomingEvents = events.filter(
  //   (event) => new Date(event.date) > new Date()
  // )
  // const pastEvents = events.filter(
  //   (event) => new Date(event.date) <= new Date()
  // )

  // console.log('events', events)

  // useEffect(() => {
  //   fetchEvents()
  // }, [fetchEvents])

  return (
    <Authenticated>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button variant="solid" onPress={() => setShowCreateEvent(true)}>
            Create New Event
          </Button>
        </div>

        {showCreateEvent && !editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create New Event</h2>
                <Button
                  variant="light"
                  onPress={() => setShowCreateEvent(false)}
                >
                  Close
                </Button>
              </div>
              <CreateEventForm
                onClose={() => setShowCreateEvent(false)}
                onSuccess={handleEventUpdated}
              />
            </div>
          </div>
        )}

        {editingEvent && !showCreateEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Event</h2>
                <Button variant="light" onPress={() => setEditingEvent(null)}>
                  Close
                </Button>
              </div>
              <EditEventForm
                event={editingEvent}
                onClose={() => setEditingEvent(null)}
                onSuccess={handleEventUpdated}
              />
            </div>
          </div>
        )}

        {!showCreateEvent && !editingEvent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
              {loading ? (
                <p>Loading...</p>
              ) : upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {event.location}
                          </p>
                          {event.description && (
                            <p className="text-sm text-gray-500 mt-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="light"
                          onPress={() => setEditingEvent(event)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="light"
                          color="danger"
                          onPress={() => deleteEvent(event.id!)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming events</p>
              )}
            </div>

            {/* Past Events */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Past Events</h2>
              {loading ? (
                <p>Loading...</p>
              ) : pastEvents.length > 0 ? (
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <div key={event.id} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {event.location}
                          </p>
                          {event.description && (
                            <p className="text-sm text-gray-500 mt-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="light"
                            color="danger"
                            onPress={() => deleteEvent(event.id!)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No past events</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Authenticated>
  )
}

export default DashboardPage
