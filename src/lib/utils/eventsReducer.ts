import { Event } from "@/lib/firebase/events"

type EventsState = {
  pending: Event[]
  confirmed: Event[]
  declined: Event[]
  haveToGo: Event[]
  past: Event[]
  loading: boolean
}

type EventsAction =
  | { type: "FETCH_START" }
  | {
      type: "FETCH_SUCCESS"
      payload: {
        pending: Event[]
        confirmed: Event[]
        declined: Event[]
        haveToGo: Event[]
        past: Event[]
      }
    }
  | { type: "FETCH_ERROR" }

export const initialState: EventsState = {
  pending: [],
  confirmed: [],
  declined: [],
  haveToGo: [],
  past: [],
  loading: true,
}

export const eventsReducer = (
  state: EventsState,
  action: EventsAction
): EventsState => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true }
    case "FETCH_SUCCESS":
      return { ...state, ...action.payload, loading: false }
    case "FETCH_ERROR":
      return { ...state, loading: false }
    default:
      return state
  }
}
