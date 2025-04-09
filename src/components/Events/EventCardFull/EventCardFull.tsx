"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@heroui/react"
import { Toaster } from "react-hot-toast"
import {
  AttendanceStatus,
  Event,
  getEventById,
  updateParticipantStatus,
} from "@/lib/firebase/events"
import { UserProfile } from "@/lib/firebase/users"
import { User } from "firebase/auth"
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card"

type Props = {
  event: Event
  handleShare?: () => void
  handleJoinEvent?: () => void
  user?: UserProfile | User
  onEventUpdate?: (updatedEvent: Event) => void
}

function getRandomOneOrTwo() {
  return Math.random() < 0.5 ? 1 : 2
}

export const EventCardFull: React.FC<Props> = ({
  event,
  handleShare,
  handleJoinEvent,
  user,
  onEventUpdate,
}) => {
  const randomNumber = getRandomOneOrTwo()
  const isParticipant = user && event.participants.some(p => p.uid === user.uid)
  const currentParticipant = isParticipant
    ? event.participants.find(p => p.uid === user.uid)
    : undefined

  const handleAttendanceChange = async (status: AttendanceStatus) => {
    if (!user || !event.id) return

    try {
      await updateParticipantStatus(event.id, user.uid, status)
      // Refresh the event data after updating status
      const updatedEvent = await getEventById(event.id)

      // Pass the updated event back to the parent component
      if (updatedEvent && onEventUpdate) {
        onEventUpdate(updatedEvent)
      }
    } catch (error) {
      console.error("Failed to update attendance:", error)
    }
  }
  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        {/* Event status badge */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{event.title}</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              event.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : event.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
        {isParticipant && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Your attendance</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                className={
                  currentParticipant?.status === "declined"
                    ? "bg-amber-300"
                    : "bg-sky-300"
                }
                onPress={() => handleAttendanceChange("confirmed")}
              >
                I'll attend
              </Button>
              <Button
                className={
                  currentParticipant?.status === "declined"
                    ? "bg-amber-300"
                    : "bg-sky-300"
                }
                onPress={() => handleAttendanceChange("declined")}
              >
                Don't want to go anymore
              </Button>
            </div>
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Participants</h3>
          <ul className="divide-y">
            {event.participants.map((participant, index) => (
              <li
                key={index}
                className="py-2 flex justify-between items-center"
              >
                <span>{participant.name || participant.email}</span>
                <span
                  className={`text-sm ${
                    participant.status === "confirmed"
                      ? "text-green-600"
                      : participant.status === "declined"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {participant.status.charAt(0).toUpperCase() +
                    participant.status.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Card className="py-4 max-w-[600px] mx-auto">
          <CardHeader className="overflow-visible py-2">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src={`/images/to-do-variant-${randomNumber}.jpg`}
              width={600}
              height={600}
            />
          </CardHeader>
          <CardBody className="pb-0 pt-2 px-4 flex-col items-start">
            <span className="text-tiny uppercase font-bold">Event</span>
            <h1 className="font-bold text-xl">{event.title}</h1>
            <p>{event.description}</p>
            <p>
              Location: <strong>{event.location}</strong>
            </p>
            <p>
              Date: <strong>{event.date}</strong>
            </p>
          </CardBody>
          <CardFooter className="justify-center gap-8">
            {handleShare && (
              <>
                <Button className="bg-sky-300" onPress={handleShare}>
                  Share Event
                </Button>
                <Toaster />
              </>
            )}
            {handleJoinEvent && !event.attendeeIds.includes(user!.uid) && (
              <Button className="bg-sky-300" onPress={handleJoinEvent}>
                Join Event
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
