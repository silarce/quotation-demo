export const convertDate_reduce1911 = (ISOString: string) => {
  if (!ISOString) return ISOString
  const dateTime = new Date(ISOString)
  const year = dateTime.getFullYear()
  const chYear = year - 1911
  dateTime.setFullYear(chYear)
  return dateTime.toISOString()
}

export const convertDate_add1911 = (ISOString: string) => {
  if (!ISOString) return ISOString
  const dateTime = new Date(ISOString)
  const twYear = dateTime.getFullYear()
  const year = twYear + 1911
  dateTime.setFullYear(year)
  return dateTime.toISOString()
}
