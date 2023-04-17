import moment from 'moment';



// export const yearConversion_chToStandard = (dateStringOri: string, toDate?: boolean): string | Date | "Invalid Date" => {
export const yearConversion_chToStandard = (
  params: {
    dateString: string
    retuenUndefined?: boolean
  }
): Date | undefined => {


  const { dateString: dateStringOri,  retuenUndefined, } = params

  if (!dateStringOri && retuenUndefined) return undefined

  const arr = dateStringOri.split("-")
  const dateString = `${parseInt(arr[0]) + 1911}-${arr[1]}-${arr[2]}`

  let date;

  date = moment(dateString,"yyyy-MM-DD").toDate()

  // if (isNaN(date.getTime())) {
  //   if (retuenUndefined) date = undefined
  //   else date = "Invalid Date"
  // }

  return date
}


