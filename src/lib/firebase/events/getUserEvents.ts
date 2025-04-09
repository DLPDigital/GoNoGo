import { db } from "../config"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { Event } from "./types"

export const getUserEvents = async (userId: string) => {
  try {
    // Query for events where the user is the creator
    const createdEventsQuery = query(
      collection(db, "events"),
      where("userId", "==", userId),
      orderBy("date", "asc")
    )
    const createdEventsSnapshot = await getDocs(createdEventsQuery)
    const createdEvents = createdEventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[]

    console.log("userId we're going to query is", userId)
    // Query for events where the user is an attendee
    const attendedEventsQuery = query(
      collection(db, "events"),
      where("attendeeIds", "array-contains", userId),
      orderBy("date", "asc")
    )
    const attendedEventsSnapshot = await getDocs(attendedEventsQuery)

    const attendedEvents = attendedEventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[]

    // Combine the two arrays and remove duplicates
    const allEvents = [...createdEvents, ...attendedEvents]
    const uniqueEvents = allEvents.filter(
      (event, index, self) => index === self.findIndex(e => e.id === event.id)
    )

    return uniqueEvents
  } catch (error) {
    console.error("Error fetching events:", error)
    throw error
  }
}