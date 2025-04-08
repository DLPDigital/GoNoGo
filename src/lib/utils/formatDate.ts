export const formatDate = (date: Date): string => {
  const dateToParse = new Date(date)
  const parsedDay = dateToParse.getDate()
  return `${parsedDay} ${dateToParse.toLocaleString("en-US", {
    month: "short",
  })} ${dateToParse.getFullYear()}`
}