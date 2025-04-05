"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Event } from "@/lib/firebase/events"
import { getEventById, addEventToUser } from "@/lib/firebase/events"
import { Button } from "@heroui/react"

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
    // You can add a toast notification here to confirm the URL was copied
  }

  const handleJoinEvent = async () => {
    try {
      // Add the event to the user's upcoming events
      await addEventToUser(event!, user!.uid)
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
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {event.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {event.description}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {event.location}
              </dd>
            </div>
          </dl>
        </div>
        <div className="px-4 py-5 sm:px-6 flex justify-end space-x-4">
          <Button variant="light" onPress={handleShare}>
            Share
          </Button>
          <Button variant="solid" onPress={handleJoinEvent}>
            Join Event
          </Button>
        </div>
      </div>
    </div>
  )
}
