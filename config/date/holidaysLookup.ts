import holidays_112 from "public/calendar/holidays_112.json";
import holidays_113 from "public/calendar/holidays_113.json";


type Tcalendar = {
  西元日期: string,
  星期: string,
  是否放假: string,
  備註: string,
}

type Tcalendar_group = {
  [key: string]: {
    [key: string]: (Tcalendar & {
      iso: string
      dateDay: string
    })
  }
}

type Tlookup = {
  [key: string]: Tcalendar_group
}

const holidaysLookup: Tlookup = {
  "2023": holidays_112,
  "2024": holidays_113
}

export { holidaysLookup };













