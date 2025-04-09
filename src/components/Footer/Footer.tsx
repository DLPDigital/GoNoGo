import React from "react"

const getDate = () => {
  const currentDate = new Date()
  return currentDate.getFullYear()
}

export const Footer: React.FC = () => (
  <div className="w-full bg-rose-400">
    <div className="flex flex-col items-center justify-center py-8 mt-8">
      <p className="text-white">
        GoNoGo is built with NextJS, HeroUI, Tailwind and Firebase, hosted on
        Netflify.
      </p>
      <p className="text-white">
        View on{" "}
        <a
          href="https://github.com/DLPDigital/GoNoGo"
          target="_blank"
          title="View GoNoGo on GitHub"
          rel="noreferrer"
          className="underline"
        >
          GitHub
        </a>
      </p>
      <p className="text-white">&#169; {getDate()}</p>
    </div>
  </div>
)
