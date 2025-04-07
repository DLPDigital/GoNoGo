"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@heroui/react"
import { Toaster } from "react-hot-toast"
import { Event } from "@/lib/firebase/events"
import { UserProfile } from "@/lib/firebase/users"
import { User } from "firebase/auth"
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card"

type Props = {
  event: Event
  handleShare: () => void
  handleJoinEvent: () => void
  user?: UserProfile | User
}

function getRandomOneOrTwo() {
  return Math.random() < 0.5 ? 1 : 2
}

export const EventCardFull: React.FC<Props> = ({
  event,
  handleShare,
  handleJoinEvent,
  user,
}) => {
  const randomNumber = getRandomOneOrTwo()
  return (
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
        <p>Location: <strong>{event.location}</strong></p>
        <p>Date: <strong>{event.date}</strong></p>
      </CardBody>
      <CardFooter className="justify-center gap-8">
        <Button color="primary" onPress={handleShare}>
          Share Event
        </Button>
        <Toaster />
        {!event.attendeeIds.includes(user!.uid) && (
          <Button color="primary" onPress={handleJoinEvent}>
            Join Event
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
