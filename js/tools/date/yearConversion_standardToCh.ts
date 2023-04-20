import moment from 'moment';




export const yearConversion_standardToCh = (
  dateStringOri: string
) => {
  if (!dateStringOri) return ""

  const arr = dateStringOri.split("-")
  const year = (parseInt(arr[0]) - 1911).toString().padStart(4, "0")
  const dateString = `${year}-${arr[1]}-${arr[2]}`

  return dateString
}


