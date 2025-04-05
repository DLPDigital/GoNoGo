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

export interface Event {
  id?: string
  title: string
  date: string
  description: string
  location: string
  userId: string
  createdAt: Date
}

export const createEvent = async (event: Omit<Event, "id" | "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...event,
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
    const eventsQuery = query(
      collection(db, "events"),
      where("userId", "==", userId),
      orderBy("date", "asc")
    )
    const querySnapshot = await getDocs(eventsQuery)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Event[]
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

export const addEventToUser = async (event: Event, userId: string): Promise<void> => {
  const newEvent = {
    ...event,
    userId,
    createdAt: new Date(),
  }
  await addDoc(collection(db, "events"), newEvent)
}
