import { Event } from "@/lib/firebase/events"
import { getEventDateTime } from "@/lib/utils/getEventDateTime"

export const splitByDate = (events: Event[]) => {
  const now = new Date()
  const upcoming: Event[] = []
  const past: Event[] = []

  events.forEach(event => {
    const eventDateTime = getEventDateTime(event.date, event.time)
    if (eventDateTime >= now) {
      upcoming.push(event)
    } else {
      past.push(event)
    }
  })

  return { upcoming, past }
}

export const filterHaveToGoEvents = (events: Event[], userId: string) => {
  return events.filter(event => {
    // Find current user in participants
    const currentUserParticipant = event.participants.find(
      p => p.uid === userId
    )

    // User has declined this event
    const userHasDeclined = currentUserParticipant?.status === "declined"

    // At least one other participant hasn't declined
    const someoneElseHasNotDeclined = event.participants.some(
      p => p.uid !== userId && p.status !== "declined"
    )

    return userHasDeclined && someoneElseHasNotDeclined
  })
}

export const categorizeEvents = (events: Event[], userId: string) => {
  const { upcoming, past } = splitByDate(events)

  const haveToGo = filterHaveToGoEvents(upcoming, userId)

  const haveToGoIds = haveToGo.map(event => event.id)

  const pending = upcoming.filter(
    event => event.status === "pending" && !haveToGoIds.includes(event.id)
  )

  const confirmed = upcoming.filter(
    event => event.status === "confirmed" && !haveToGoIds.includes(event.id)
  )

  const declined = upcoming.filter(
    event => event.status === "cancelled" && !haveToGoIds.includes(event.id)
  )

  return {
    pending,
    confirmed,
    declined,
    haveToGo,
    past,
  }
}
