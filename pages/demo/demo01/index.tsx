import { useState } from 'react'

import {
  EventProps, EventWrapperProps,
  Calendar, momentLocalizer,
} from 'react-big-calendar'

import BigCalendar from 'react-big-calendar';

import moment from 'moment'

// antd
import { Badge } from "antd"




import scss from "./lab01.module.scss"



const localizer = momentLocalizer(moment)


export default function Lab01() {
  const [render, setRender] = useState(false)
  const reRender = () => {
    setRender((state) => !state)
  }

  const [eventsArr, setEventsArr]
    = useState(lotFakeData.map((item) => new Class_isRead(item, reRender)))
    // = useState(fakeData.map((item) => new Class_isRead(item, reRender)))



  return (
    <div className={`${scss.lab01} h-full overflow-auto`}>


      <Calendar
        localizer={localizer}
        events={eventsArr}
        showAllEvents
        views={['month']}
        style={{
          minHeight: 750,
          height: "100%"
        }}

        components={{
          month: {
            // event: Cevent,
            // header: Cviews // 最上方標明星期幾的row
            // dateHeader: Cviews,
          },
          // event並不是cell的子元素
          // dateCellWrapper:Cviews, //底下的格子 
          eventWrapper: Cviews, // 壓在格子上方的event


          // toolbar: FooJSX,


        }}


      />
    </div>
  )
}


const FooJSX = (toolbar: BigCalendar.ToolbarProps<Class_isRead, object>) => {


  const { onNavigate, label } = toolbar

  // 'PREV' | 'NEXT' | 'TODAY' | 'DATE'
  const next = () => {
    onNavigate('NEXT');
  }
  const prev = () => {
    onNavigate('PREV');
  }
  const today = () => {
    onNavigate('TODAY');
  }


  return (
    <div>
      <h1 onClick={prev}>prev</h1>
      <h1 onClick={next}>nxet</h1>
      <h1 onClick={today}>today</h1>
      <h1>{label}</h1>
    </div>
  )

}












const Cviews = (e: EventWrapperProps<Class_isRead>) => {

  const { event } = e
  const { job, name, isReaded, switchIsReaded } = event

  const color = isReaded ? "blue" : "red"

  return (
    <div className="flex justify-between cursor-pointer px-2 mb-2 hover:bg-slate-200"
      onClick={switchIsReaded}
    >
      <div className='grid grid-cols-[40px_auto] gap-2 justify-start'>
        <span>{job}</span>
        <span>{name}</span>
      </div>
      <Badge color={color} />
    </div>
  )
}

// ============================================


class Class_isRead implements Tevent {
  constructor(data: Tdata, reRender: () => void) {
    this.reRender = reRender

    const { job, name, isReaded, date, } = data
    this.job = job
    this.name = name
    this.isReaded = isReaded
    this.start = date
    this.end = date
  } // constructor

  reRender: () => void
  job: string
  name: string
  start: string
  end: string

  isReaded: boolean
  switchIsReaded = () => {
    this.isReaded = !this.isReaded
    this.reRender()


  }
}




interface Tdata {
  job: string
  name: string
  isReaded: boolean,
  date: string,

}


interface Tevent {
  job: string
  name: string
  isReaded: boolean,
  start: string,
  end: string,
  // allDay?: boolean
  // resource?: any,
}



const fakeData: Tdata[] = [
  {
    job: "BO",
    name: "大雄",
    isReaded: false,
    date: "2023-03-01",
  },
  {
    job: "BO",
    name: "靜香",
    isReaded: false,
    date: "2023-03-01",
  },
  {
    job: "PD",
    name: "小夫",
    isReaded: false,
    date: "2023-03-01",
  },
  {
    job: "BO",
    name: "胖虎",
    isReaded: true,
    date: "2023-03-01",
  },
  {
    job: "GA",
    name: "小明",
    isReaded: false,
    date: "2023-03-01",
  },
  {
    job: "ED",
    name: "曉東",
    isReaded: true,
    date: "2023-03-01",
  },
  {
    job: "ED",
    name: "傑西",
    isReaded: false,
    date: "2023-03-01",
  },
  {
    job: "RD",
    name: "凱莉",
    isReaded: false,
    date: "2023-03-01",
  },
  {
    job: "HR",
    name: "哆啦",
    isReaded: false,
    date: "2023-03-01",
  },
  {
    job: "RD",
    name: "A夢",
    isReaded: false,
    date: "2023-03-01",
  },
]


function generateData(
  data: Tdata[],
  startDate: string,
  endDate: string
): Tdata[] {
  const newData: Tdata[] = []

  const startTime = new Date(startDate).getTime()
  const endTime = new Date(endDate).getTime()

  data.forEach((item) => {
    const { job, name, isReaded } = item

    for (let time = startTime; time <= endTime; time += 86400000) {
      const date = new Date(time).toISOString().slice(0, 10)
      newData.push({
        job,
        name,
        isReaded,
        date,
      })
    }
  })

  return newData
}


const lotFakeData = generateData(fakeData, "2023-02-26", "2023-04-02")

// console.log(generateData(fakeData, "2023-02-26", "2023-04-02"))





