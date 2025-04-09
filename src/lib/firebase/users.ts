import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "./config"

export interface UserProfile {
  uid: string
  username: string
  email: string
  createdAt: Date
}

export const createUserProfile = async (
  userId: string,
  email: string,
  username: string
): Promise<UserProfile> => {
  try {
    const userRef = doc(db, "users", userId)
    const userProfile = {uid: userId,
      email,
      username,
      createdAt: new Date(),}
    await setDoc(userRef, userProfile)
    return userProfile
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, data)
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return null
    }

    return userDoc.data() as UserProfile
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}
