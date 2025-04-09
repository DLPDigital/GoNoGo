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

export type AttendanceStatus = "pending" | "confirmed" | "declined"

export interface Participant {
  uid: string
  name: string
  email: string
  status: AttendanceStatus
}

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
  participants: Participant[]
  status: "pending" | "confirmed" | "cancelled"
}

export async function updateParticipantStatus(
  eventId: string,
  userId: string,
  status: AttendanceStatus
): Promise<void> {
  const eventRef = doc(db, "events", eventId)

  // Get current event
  const eventSnap = await getDoc(eventRef)
  if (!eventSnap.exists()) {
    throw new Error("Event not found")
  }

  const eventData = eventSnap.data() as Event

  // Update participant status
  const updatedParticipants = eventData.participants.map(participant =>
    participant.uid === userId ? { ...participant, status } : participant
  )

  // Determine event status
  let eventStatus = eventData.status

  // If a participant confirms attendance, mark as confirmed
  if (status === "confirmed" && eventStatus === "pending") {
    eventStatus = "confirmed"
  }

  // If all participants have declined, mark as cancelled
  const allDeclined = updatedParticipants.every(p => p.status === "declined")
  if (allDeclined && updatedParticipants.length > 0) {
    eventStatus = "cancelled"
  }

  // Update the event
  await updateDoc(eventRef, {
    participants: updatedParticipants,
    status: eventStatus,
  })
}

export const createEvent = async (
  event: Omit<
    Event,
    "id" | "createdAt" | "attendees" | "participants" | "status"
  > & {
    participantEmails?: string[]
  }
) => {
  try {
    const thisUser = await getUserProfile(event.userId)

    console.log('event', event)
    console.log('thisUser', thisUser)

    // Initialize creator as confirmed participant
    const creatorParticipant: Participant = {
      uid: event.userId,
      name: thisUser?.username || "",
      email: thisUser?.email || "",
      status: "confirmed" as AttendanceStatus,
    }

    // Initialize invited participants with pending status
    const participants: Participant[] = [creatorParticipant]

    // Add invited participants if any
    if (event.participantEmails && event.participantEmails.length > 0) {
      const pendingParticipants = event.participantEmails.map(email => ({
        uid: "", // Will be filled when user accepts invitation
        name: "",
        email,
        status: "pending" as AttendanceStatus,
      }))

      participants.push(...pendingParticipants)
    }

    const docRef = await addDoc(collection(db, "events"), {
      ...event,
      attendeeIds: [event.userId],
      attendees: [{ id: event.userId, name: thisUser?.username || "" }],
      participants: participants,
      status: "pending", // Initial status is pending until participants confirm
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
  userId: string,
  userEmail?: string
): Promise<void> => {
  try {
    const eventRef = doc(db, "events", eventId)
    const eventDoc = await getDoc(eventRef)

    if (!eventDoc.exists()) {
      throw new Error("Event not found")
    }

    const eventData = eventDoc.data() as Event
    const userProfile = await getUserProfile(userId)

    const userName = userProfile?.username || "Unknown User"
    const userEmailToUse = userProfile?.email || userEmail || ""

    // Initialize arrays if they don't exist
    const attendees = eventData.attendees || []
    const attendeeIds = eventData.attendeeIds || []
    let participants = eventData.participants || []

    // Check if the user is already an attendee
    if (attendeeIds.includes(userId)) {
      console.log("User is already an attendee of this event")
      return
    }

    // Add the user to the attendees arrays
    attendees.push({ id: userId, name: userName })
    attendeeIds.push(userId)

    // If user was a pending participant (matched by email), update their info
    if (userEmailToUse) {
      const participantIndex = participants.findIndex(
        p =>
          (p.email === userEmailToUse && p.uid === "") || // Match by email for pending participants
          p.uid === userId // Match by uid for existing participants
      )

      if (participantIndex >= 0) {
        // Update the pending participant with the user's info
        participants[participantIndex] = {
          ...participants[participantIndex],
          uid: userId,
          name: userName,
          status: "confirmed" as AttendanceStatus,
        }
      } else {
        // Add as a new confirmed participant if not found
        participants.push({
          uid: userId,
          name: userName,
          email: userEmailToUse,
          status: "confirmed" as AttendanceStatus,
        })
      }
    }

    // Determine if event status should change
    let eventStatus = eventData.status
    if (eventStatus === "pending") {
      eventStatus = "confirmed"
    }

    // Update the event document
    await updateDoc(eventRef, {
      attendees,
      attendeeIds,
      participants,
      status: eventStatus,
    })
  } catch (error) {
    console.error("Error adding user to event:", error)
    throw error
  }
}
