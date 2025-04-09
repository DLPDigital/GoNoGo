import { useState, useCallback, useEffect } from "react"
import {
  getUserEvents,
  Event,
  deleteEvent as deleteEventService,
} from "@/lib/firebase/events"
import { useAuth } from "@/contexts/AuthContext"

export const useEvents = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [upcomingPendingEvents, setUpcomingPendingEvents] = useState<Event[]>([])
  const [upcomingConfirmedEvents, setUpcomingConfirmedEvents] = useState<Event[]>([])
  const [upcomingDeclinedEvents, setUpcomingDeclinedEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])

  const fetchEvents = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const events = await getUserEvents(user.uid)
      const now = new Date()
      
      // Categorize events
      const upcoming: Event[] = []
      const past: Event[] = []
      
      events.forEach(event => {
        const eventDate = new Date(event.date)
        if (eventDate >= now) {
          upcoming.push(event)
        } else {
          past.push(event)
        }
      })
      
      // Further categorize upcoming events by status
      const pending = upcoming.filter(event => event.status === "pending")
      const confirmed = upcoming.filter(event => event.status === "confirmed")
      const declined = upcoming.filter(event => event.status === "cancelled")
      
      setUpcomingPendingEvents(pending)
      setUpcomingConfirmedEvents(confirmed)
      setUpcomingDeclinedEvents(declined)
      setPastEvents(past)
    } catch (error) {
      console.error("Error fetching events:", error)
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

  // const upcomingEvents = events.filter(
  //   event => new Date(event.date) > new Date()
  // )
  // const pastEvents = events.filter(event => new Date(event.date) <= new Date())

  return {
    loading,
    upcomingPendingEvents,
    upcomingConfirmedEvents,
    upcomingDeclinedEvents,
    pastEvents,
    fetchEvents,
    deleteEvent,
  }
}
