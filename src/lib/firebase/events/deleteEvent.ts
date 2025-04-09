import { db } from "../config"
import { doc, deleteDoc } from "firebase/firestore"

export const deleteEvent = async (eventId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    await deleteDoc(eventRef)
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}