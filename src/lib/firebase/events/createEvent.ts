import { db } from "../config"
import { collection, addDoc } from "firebase/firestore"
import { getUserProfile } from "../users"
import { AttendanceStatus, Event, Participant } from "./types"

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

    const eventDate = event.date ? new Date(event.date) : new Date();

    const docRef = await addDoc(collection(db, "events"), {
      ...event,
      date: eventDate,
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