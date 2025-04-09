"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { addUserToEvent, Event } from "@/lib/firebase/events"
import { getEventById } from "@/lib/firebase/events"
import { AuthForms } from "@/components/Auth/AuthForms"
import { EventCardFull } from "@/components/Events/EventCardFull"

export default function EventInvitePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id as string)
        setEvent(eventData)
      } catch (error) {
        console.error("Failed to fetch event:", error)
        setError("Failed to fetch event")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  useEffect(() => {
    if (user && event) {
      // If the user is logged in and accepting an invitation
      const userEmail = user.email;
      const isPendingParticipant = event.participants.some(
        p => p.email === userEmail && p.uid === ""
      );
      
      if (isPendingParticipant) {
        // Update the user's status in the event
        addUserToEvent(id as string, user.uid)
          .then(() => {
            // Redirect to the event page
            router.push(`/events/${id}`);
          })
          .catch(error => {
            console.error("Failed to join event:", error);
            setError("Failed to join event");
          });
      } else {
        // If not a pending participant, just redirect
        router.push(`/events/${id}`);
      }
    }
  }, [user, event, id, router]);

  useEffect(() => {
    if (user && event) {
      // If the user is logged in, redirect to the event page
      router.push(`/events/${id}`)
    }
  }, [user, event, id, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!event) {
    return <div>Event not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
      <EventCardFull event={event} user={user ?? undefined} />
      <AuthForms invited />
    </div>
  )
}
