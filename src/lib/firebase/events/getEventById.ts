import { db } from "../config"
import { doc, getDoc } from "firebase/firestore"
import { Event } from "./types"

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