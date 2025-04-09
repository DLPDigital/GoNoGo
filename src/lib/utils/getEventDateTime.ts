import { Timestamp } from "firebase/firestore"

export const getEventDateTime = (eventDate: any, eventTime: string): Date => {
  let dateObj: Date

  if (eventDate instanceof Timestamp) {
    // Handle Firebase Timestamp object
    dateObj = eventDate.toDate()
  } else if (
    eventDate &&
    typeof eventDate === "object" &&
    "seconds" in eventDate
  ) {
    dateObj = new Date(eventDate.seconds * 1000)
  } else {
    dateObj = new Date(eventDate)
  }

  if (eventTime) {
    const [hours, minutes] = eventTime.split(":").map(Number)
    dateObj.setHours(hours || 0)
    dateObj.setMinutes(minutes || 0)
  }

  return dateObj
}
