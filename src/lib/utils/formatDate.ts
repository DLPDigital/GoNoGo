import { Timestamp } from "firebase/firestore"

export const formatDate = (date: Date): string => {
  const dateToParse = new Date(date)
  const parsedDay = dateToParse.getDate()
  return `${parsedDay} ${dateToParse.toLocaleString("en-US", {
    month: "short",
  })} ${dateToParse.getFullYear()}`
}

// Convert Firestore timestamp to JS Date
export const timestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  } else if (timestamp && timestamp.seconds) {
    // Handle plain object with seconds and nanoseconds
    return new Date(timestamp.seconds * 1000)
  }
  // Handle string or already a Date
  return new Date(timestamp)
}

// Format date for display
export const formatDisplayDate = (date: Date | string | any): string => {
  const dateObj = new Date(timestampToDate(date))
  return dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
