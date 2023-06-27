import moment from "moment"

type Tcalendar = {
  西元日期: string,
  星期: string,
  是否放假: string,
  備註: string,
}

type Tcalendar_group = {
  [key: string]: (Tcalendar & {
    iso: string
    dateDay: string
  })[]
}

const filterHolidays = (calendar: Tcalendar[]) => {
  const calendar_group: Tcalendar_group = {}

  calendar.forEach((c) => {
    if (c.是否放假 === "2") {
      const month = moment(c.西元日期).month() + 1
      if (!calendar_group[month]) calendar_group[month] = []
      const iso = moment(c.西元日期).toISOString()
      const dateDay = moment(c.西元日期).date().toString()

      calendar_group[month].push({
        ...c,
        iso,
        dateDay
      })
    }
  })
  return calendar_group
}


export { filterHolidays }