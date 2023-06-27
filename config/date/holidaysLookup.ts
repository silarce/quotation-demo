import holidays_112 from "public/calendar/holidays_112.json";
import holidays_113 from "public/calendar/holidays_113.json";


type Tlookup = {
  [key: string]: typeof holidays_112 | typeof holidays_113
}

const holidaysLookup: Tlookup = {
  "2023": holidays_112,
  "2024": holidays_113
}

export { holidaysLookup };













