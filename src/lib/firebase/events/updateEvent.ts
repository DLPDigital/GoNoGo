import { db } from "../config"
import { doc, updateDoc } from "firebase/firestore"
import { Event } from "./types"

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