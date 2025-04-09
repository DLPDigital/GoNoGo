"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Event } from "@/lib/firebase/events"
import { getEventById, addUserToEvent } from "@/lib/firebase/events"
import toast from "react-hot-toast"
import { EventCardFull } from "@/components/Events/EventCardFull"

export default function EventPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      // If the user is not logged in, redirect to the invite page
      router.push(`/events/invite/${id}`)
      return
    }

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
  }, [id, user, router])

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/events/invite/${id}`
    await navigator.clipboard.writeText(eventUrl)
    toast.success("Copied to clipboard!", {
      duration: 2000,
      position: "top-center",
    })
  }

  const handleJoinEvent = async () => {
    try {
      if (!event || !user) {
        setError("Event or user data missing");
        return;
      }
  
      // Check if the user is already a pending participant by email
      const userEmail = user.email;
      const isPendingParticipant = event.participants.some(
        p => p.email === userEmail && p.uid === ""
      );
      
      // Check if the user is already a full participant
      const isParticipant = event.participants.some(p => p.uid === user.uid);
      
      if (isParticipant) {
        toast.success("You're already part of this event!");
        return;
      }
      
      // Add the user to the event
      await addUserToEvent(event.id!, user.uid);
      
      // Refresh the event data to show updated participant status
      const updatedEvent = await getEventById(event.id!);
      setEvent(updatedEvent);
      
      toast.success("Successfully joined the event!");
    } catch (error) {
      console.error("Failed to join event:", error);
      setError("Failed to join event");
      toast.error("Failed to join the event");
    }
  };

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!event) {
    return <div>Event not found</div>
  }
  
  const handleEventUpdate = (updatedEvent: Event) => {
    setEvent(updatedEvent)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <EventCardFull
        event={event}
        handleShare={handleShare}
        handleJoinEvent={handleJoinEvent}
        user={user ?? undefined}
        onEventUpdate={handleEventUpdate}
      />
    </div>
  )
}
