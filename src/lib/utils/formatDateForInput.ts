import { Timestamp } from "firebase/firestore"

// Helper function to format date for input
export const formatDateForInput = (dateValue: any): string => {
  let date: Date

  if (dateValue instanceof Timestamp) {
    date = dateValue.toDate()
  } else if (
    dateValue &&
    typeof dateValue === "object" &&
    "seconds" in dateValue
  ) {
    date = new Date(dateValue.seconds * 1000)
  } else if (dateValue instanceof Date) {
    date = dateValue
  } else {
    // Handle string or fallback
    date = dateValue ? new Date(dateValue) : new Date()
  }

  // Format as YYYY-MM-DD for input element
  return date.toISOString().split("T")[0]
}

// Helper to extract time from date object or timestamp
export const formatTimeForInput = (
  dateValue: any,
  timeString?: string
): string => {
  // If we already have a time string, return it
  if (timeString) return timeString

  let date: Date

  if (dateValue instanceof Timestamp) {
    date = dateValue.toDate()
  } else if (
    dateValue &&
    typeof dateValue === "object" &&
    "seconds" in dateValue
  ) {
    date = new Date(dateValue.seconds * 1000)
  } else if (dateValue instanceof Date) {
    date = dateValue
  } else {
    // If we can't get a date, return empty time
    return ""
  }

  // Format hours and minutes with leading zeros
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}
