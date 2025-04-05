import { useState, useCallback, useEffect } from "react"
import {
  getUserEvents,
  Event,
  deleteEvent as deleteEventService,
} from "@/lib/firebase/events"
import { useAuth } from "@/contexts/AuthContext"

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchEvents = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    try {
      const userEvents = await getUserEvents(user.uid)
      setEvents(userEvents)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  const deleteEvent = useCallback(
    async (eventId: string) => {
      if (!eventId) return

      try {
        await deleteEventService(eventId)
        fetchEvents() // Refresh the events list
      } catch (error) {
        console.error("Failed to delete event:", error)
      }
    },
    [fetchEvents]
  )

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) > new Date()
  )
  const pastEvents = events.filter(
    (event) => new Date(event.date) <= new Date()
  )

  return {
    events,
    loading,
    upcomingEvents,
    pastEvents,
    fetchEvents,
    deleteEvent,
  }
}
