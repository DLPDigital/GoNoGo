import { useState, useCallback, useEffect } from "react"
import {
  getUserEvents,
  Event,
  deleteEvent as deleteEventService,
} from "@/lib/firebase/events"
import { useAuth } from "@/contexts/AuthContext"
import { getEventDateTime } from "@/lib/utils/getEventDateTime"

export const useEvents = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [upcomingPendingEvents, setUpcomingPendingEvents] = useState<Event[]>(
    []
  )
  const [upcomingConfirmedEvents, setUpcomingConfirmedEvents] = useState<
    Event[]
  >([])
  const [upcomingDeclinedEvents, setUpcomingDeclinedEvents] = useState<Event[]>(
    []
  )
  const [upcomingHaveToGoEvents, setUpcomingHaveToGoEvents] = useState<Event[]>(
    []
  )
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
        const eventDateTime = getEventDateTime(event.date, event.time)
        if (eventDateTime >= now) {
          upcoming.push(event)
        } else {
          past.push(event)
        }
      })

      // First identify "have to go" events - where you declined but others haven't
      const haveToGo = upcoming.filter(event => {
        // Find current user in participants
        const currentUserParticipant = event.participants.find(
          p => p.uid === user.uid
        )

        // User has declined this event
        const userHasDeclined = currentUserParticipant?.status === "declined"

        // At least one other participant hasn't declined
        const someoneElseHasNotDeclined = event.participants.some(
          p => p.uid !== user.uid && p.status !== "declined"
        )

        return userHasDeclined && someoneElseHasNotDeclined
      })

      // Get IDs of "have to go" events to exclude from other categories
      const haveToGoIds = haveToGo.map(event => event.id)

      // Further categorize upcoming events by status, excluding "have to go" events
      const pending = upcoming.filter(
        event => event.status === "pending" && !haveToGoIds.includes(event.id)
      )
      
      const confirmed = upcoming.filter(
        event => event.status === "confirmed" && !haveToGoIds.includes(event.id)
      )
      
      const declined = upcoming.filter(
        event => event.status === "cancelled" && !haveToGoIds.includes(event.id)
      )

      setUpcomingPendingEvents(pending)
      setUpcomingConfirmedEvents(confirmed)
      setUpcomingDeclinedEvents(declined)
      setUpcomingHaveToGoEvents(haveToGo)
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

  return {
    loading,
    upcomingPendingEvents,
    upcomingConfirmedEvents,
    upcomingDeclinedEvents,
    upcomingHaveToGoEvents,
    pastEvents,
    fetchEvents,
    deleteEvent,
  }
}