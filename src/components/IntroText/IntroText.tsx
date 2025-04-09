import React from "react"

export const IntroText = () => (
  <div className="flex flex-col items-center mb-8">
    <h1 className="font-poppins text-4xl mb-8">Welcome to GoNoGo</h1>
    <p className="font-roboto">
      The ultimate app for planning events with friends—where commitment is key,
      and flaking comes with a twist! Whether it’s brunch, game night, or a
      weekend getaway, we make scheduling simple, fun, and just a little bit
      cheeky. Say goodbye to ghosting plans and hello to accountability with our
      unique ‘You Have to Go’ feature. Ready to lock in your plans? Let’s get
      started!"
    </p>
    <h2 className="font-poppins text-2xl mt-8">
      How It Works: Step-by-Step Guide
    </h2>
    <ol className="list-none list-inside space-y-4 mt-4">
      <li className="mt-4">
        <h3 className="font-poppins text-xl mb-2">1. Create Your Event</h3>
        <p>
          Start by logging in and creating an event—whether it's a dinner party,
          a movie night, or just hanging out. Once you’ve added the details, the
          event will appear in your Pending List.
        </p>
      </li>
      <li className="mt-4">
        <h3 className="font-poppins text-xl mb-2">2. Invite Your Friends</h3>
        <p>
          Send the event to your friends! When they sign up, the event will also
          appear in their Pending List.
        </p>
      </li>
      <li className="mt-4">
        <h3 className="font-poppins text-xl mb-2">
          3. Confirm Your Attendance
        </h3>
        <p>
          Each person can choose "Yes, I'm going", which moves the event into
          their Confirmed List.
        </p>
      </li>
      <li className="mt-4">
        <h3 className="font-poppins text-xl mb-2">
          4. Change Your Mind? Here’s the Twist!
        </h3>
        <p>
          If you decide you don’t want to go anymore, select "I don't want to go
          anymore." But here’s where it gets interesting:
        </p>
        <ul className="list-disc list-inside ml-4 mt-4">
          <li>
            If only you opt out, the event moves into your "You Have to Go"
            List—because plans are commitments, right? 😉
          </li>
          <li>
            If everyone opts out (i.e., all invitees select "I don't want to go
            anymore"), the event is officially canceled and moves into
            everyone’s Declined Events List.
          </li>
        </ul>
      </li>
      <li className="mt-4">
        <h3 className="font-poppins text-xl mb-2">
          5. Stay Accountable (and Have Fun!)
        </h3>
        <p>
          The unique "You Have to Go" mechanic adds a playful layer of
          accountability to your plans—because sometimes all it takes is a
          little nudge to make memories happen!
        </p>
      </li>
    </ol>
  </div>
)
