import { useCallback, useEffect, useMemo, useReducer } from "react"
import {
  getUserEvents,
  Event,
  deleteEvent as deleteEventService,
} from "@/lib/firebase/events"
import { useAuth } from "@/contexts/AuthContext"
import { eventsReducer, initialState } from "@/lib/utils/eventsReducer"
import { categorizeEvents } from "@/lib/utils/eventFilter"

export const useEvents = () => {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(eventsReducer, initialState)

  const fetchEvents = useCallback(async () => {
    if (!user) return

    dispatch({ type: "FETCH_START" })
    try {
      const events = await getUserEvents(user.uid)

      // Use the extracted utility function to categorize events
      const categorizedEvents = categorizeEvents(events, user.uid)

      // Dispatch success with categorized events
      dispatch({
        type: "FETCH_SUCCESS",
        payload: categorizedEvents,
      })
    } catch (error) {
      console.error("Error fetching events:", error)
      dispatch({ type: "FETCH_ERROR" })
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

  const eventData = useMemo(() => ({
    loading: state.loading,
    upcomingPendingEvents: state.pending,
    upcomingConfirmedEvents: state.confirmed,
    upcomingDeclinedEvents: state.declined,
    upcomingHaveToGoEvents: state.haveToGo,
    pastEvents: state.past,
    fetchEvents,
    deleteEvent,
  }), [
    state.loading, 
    state.pending, 
    state.confirmed, 
    state.declined, 
    state.haveToGo, 
    state.past, 
    fetchEvents, 
    deleteEvent
  ]);

  return eventData;
}
