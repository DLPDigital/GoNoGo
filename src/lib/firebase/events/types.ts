export type AttendanceStatus = "pending" | "confirmed" | "declined"

export interface Participant {
  uid: string
  name: string
  email: string
  status: AttendanceStatus
}

export interface Event {
  id?: string
  title: string
  date: string
  description: string
  location: string
  userId: string
  attendeeIds: string[]
  attendees: { id: string; name: string }[]
  createdAt: Date
  participants: Participant[]
  status: "pending" | "confirmed" | "cancelled"
}
