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
      // Add the event to the user's upcoming events
      await addUserToEvent(event!.id!, user!.uid)
      // Redirect to the dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to join event:", error)
      setError("Failed to join event")
    }
  }

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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <EventCardFull
        event={event}
        handleShare={handleShare}
        handleJoinEvent={handleJoinEvent}
        user={user ?? undefined}
      />
    </div>
  )
}
