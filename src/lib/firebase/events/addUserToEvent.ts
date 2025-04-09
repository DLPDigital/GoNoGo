import { db } from "../config"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getUserProfile } from "../users"
import { AttendanceStatus, Event } from "./types"

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
