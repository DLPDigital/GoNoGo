import { db } from "../config"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { AttendanceStatus, Event } from "./types"

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
