import { db } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore"
import { getUserProfile } from "./users"

export interface Event {
  id?: string
  title: string
  date: string
  description: string
  location: string
  userId: string
  attendeeIds: string[]
  attendees: { id: string; name: string }[]
  createdAt: Date
}

export const createEvent = async (
  event: Omit<Event, "id" | "createdAt" | "attendees">
) => {
  try {
    const thisUser = await getUserProfile(event.userId)
    const docRef = await addDoc(collection(db, "events"), {
      ...event,
      attendeeIds: [event.userId],
      attendees: [{ id: event.userId, name: thisUser?.username || "" }],
      createdAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

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

export const updateEvent = async (
  eventId: string,
  eventData: Partial<Event>
) => {
  try {
    const eventRef = doc(db, "events", eventId)
    await updateDoc(eventRef, eventData)
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

export const deleteEvent = async (eventId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    await deleteDoc(eventRef)
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}

export const getEventById = async (eventId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    const eventDoc = await getDoc(eventRef)

    if (!eventDoc.exists()) {
      return null
    }

    return {
      id: eventDoc.id,
      ...eventDoc.data(),
    } as Event
  } catch (error) {
    console.error("Error fetching event:", error)
    throw error
  }
}

export const addUserToEvent = async (
  eventId: string,
  userId: string
): Promise<void> => {
  try {
    const eventRef = doc(db, "events", eventId)
    const eventDoc = await getDoc(eventRef)

    if (!eventDoc.exists()) {
      throw new Error("Event not found")
    }

    const eventData = eventDoc.data() as Event

    // Initialize arrays if they don't exist (important!)
    const attendees = eventData.attendees || []
    const attendeeIds = eventData.attendeeIds || []

    // Check if the user is already an attendee
    if (attendeeIds.includes(userId)) {
      console.log("User is already an attendee of this event")
      return
    }

    const userProfile = await getUserProfile(userId)
    if (!userProfile) {
      throw new Error("User profile not found")
    }

    // Add the user to the attendees arrays
    attendees.push({ id: userId, name: userProfile.username })
    attendeeIds.push(userId)

    // Update the event document with the new attendees arrays
    await updateDoc(eventRef, {
      attendees: attendees,
      attendeeIds: attendeeIds,
    })
  } catch (error) {
    console.error("Error adding user to event:", error)
    throw error
  }
}
