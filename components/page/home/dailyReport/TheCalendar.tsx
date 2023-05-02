
import { useState, } from "react"
import Image from "next/image"
import moment from 'moment'
import classNames from "classnames"

const _ = require("lodash")

// 行事曆元件
import BigCalendar from 'react-big-calendar';
import {
  EventWrapperProps,
  Calendar, momentLocalizer,
} from 'react-big-calendar'


// global gear
import MyButton from "components/global/gear/button/myButton"


// img
import iconCircle from "public/image/icon/circle.svg"
import iconCircle_Checked from "public/image/icon/circle_checked.svg"
import iconRedDot from "public/image/icon/redDot.svg"

// tool
import { month_chToNumber } from "js/tools/date/conversionTable";

// css
import scss from "./theCalendar.module.scss"

const localizer = momentLocalizer(moment)

// ===========================================================================

interface Tdata {
  job: string
  name: string
  isChecked: boolean,
  isForbidden: boolean,
  date: string,
}

interface Tevent {
  job: string
  name: string
  isChecked: boolean,
  isForbidden: boolean,
  start: string,
  end: string,
  // allDay?: boolean
  // resource?: any,
}

type Ttag = { name: string, date: string }
// ===========================================================================

export default function TheCalendar(
  { dataArr, editReportEmpArr, addTag, isSubordinate, editDailyReport }:
    {
      dataArr: Tdata[]
      addTag: (employee: Ttag) => void
      isSubordinate: boolean
      editReportEmpArr?: () => void
      editDailyReport?: () => void
    }
) {

  const [render, setRender] = useState(false)
  const reRender = () => {
    setRender((state) => !state)
  }

  const [eventsArr, setEventsArr]
    = useState(dataArr.map((data) => new Class_isRead(data, reRender, addTag)))

  return (
    // <div className={`${scss.dailyReport} h-full overflow-auto mx-[3px] mb-[3px]`}>
    <div className={`${scss.dailyReport} h-full mx-[3px] mb-[3px]`}>
      <Calendar
        localizer={localizer}
        events={eventsArr}
        showAllEvents
        views={['month']}
        components={{
          month: {
            // event: Cevent,
            header: Header, // 最上方標明星期幾的row
            dateHeader: DateHeader, // 日期格
          },
          // event並不是dateCellWrappe的子元素
          // !!!dateCellWrapper的props的型別是{}，但實際上props裡有三個property!!!
          // !!!因此使用@ts-ignore !!!
          // @ts-ignore 
          dateCellWrapper: DateCellWrapper, //底下的格子，裡面沒有裝東西，似僅作為背景
          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          eventWrapper: EventWrapper, // 壓在格子上方的event
          // toolbar: ToolBar, // 最上方的操作面板
          toolbar:
            (toolbar: BigCalendar.ToolbarProps<Class_isRead, object>) =>
              ToolBar(toolbar, editReportEmpArr, editDailyReport), // 最上方的操作面板
        }}
      />
    </div>
  ) // return
}
// ======================================================================
const checkIconTable = {
  "0": iconCircle,
  "1": iconCircle_Checked,
  "forbidden": iconRedDot,
}
// ============================================================================

class Class_isRead implements Tevent {
  constructor(data: Tdata, reRender: () => void, addTag: (employee: Ttag) => void) {
    this._reRender = reRender
    this._addTag = addTag

    const { job, name, isChecked, date, isForbidden } = data
    this.job = job
    this.name = name
    this.isChecked = isChecked
    this.isForbidden = isForbidden
    this.start = date
    this.end = date
    this.date = date
  } // constructor

  private _reRender
  private _addTag

  job
  name
  start
  end
  date
  isChecked
  isForbidden

  addTag = () => {
    this._addTag({
      name: this.name,
      date: this.date
    })
    this._reRender()
  }


  // switchIsReaded = () => {
  //   if (this.isForbidden) return
  //   this.isChecked = !this.isChecked
  //   this._reRender()
  // }
} // Clss_isRead

// ============================================================================

const ToolBar = (
  // toolbar: BigCalendar.ToolbarProps<Class_isRead, object>
  toolbar: BigCalendar.ToolbarProps<Class_isRead, object>,
  editReportEmpArr?: () => void,
  editDailyReport?: () => void
) => {

  const { onNavigate, label } = toolbar

  // 'PREV' | 'NEXT' | 'TODAY' | 'DATE'
  const nextMonth = () => {
    onNavigate('NEXT');
  }
  const prevMonth = () => {
    onNavigate('PREV');
  }
  const toToday = () => {
    onNavigate('TODAY');
  }

  let [month, year] = label.split(" ")

  const theMonth = month.replace("月", "") as keyof typeof month_chToNumber
  const Nummonth = month_chToNumber[theMonth] ?? "錯誤月份"

  return (
    <div className={scss.toolBar}>
      <div className={scss.left}>
        <MyButton label="Today" onClick={toToday} px="px22" />
      </div>
      <div className={scss.center}>
        <MyButton className={scss.arrow} preImg="arrow02_left"
          onClick={prevMonth} />
        <span>{Nummonth}月 {year}</span>
        <MyButton className={scss.arrow} preImg="arrow02_right"
          onClick={nextMonth} />
      </div>
      <div className={scss.right}>
        {editReportEmpArr &&
          <MyButton label="回報人員設定" onClick={editReportEmpArr} px="px2227" />
        }
        {editDailyReport &&
          <MyButton label="編輯/新增回報" onClick={() => editDailyReport()} px="px2227" />
        }

      </div>
    </div>
  )

}

// ======================================================================

// 壓在格子上方的event
const EventWrapper = (e: EventWrapperProps<Class_isRead>) => {
  const { event } = e
  const { job, name, isChecked, isForbidden, addTag } = event
  const theIsChecked = +isChecked as 0 | 1
  const checkIcon =
    isForbidden
      ? checkIconTable["forbidden"]
      : checkIconTable[`${theIsChecked}`]
  return (
    <div className={classNames("px-2 mb-2 cursor-pointer", scss.eventWrapper)}
      onClick={addTag}
    >
      <div className={classNames(
        "grid grid-cols-[20px_40px_auto] gap-2 justify-start items-center",
        "text-lg"
      )}>
        <Image src={checkIcon} alt="" />
        <span>{job}</span>
        <span>{name}</span>
      </div>
    </div>
  )
}

// ======================================================================
const Header = (HeaderProps: BigCalendar.HeaderProps) => {
  const { label } = HeaderProps
  const day = label.replace("週", "")
  return (
    <div>
      <span>{day}</span>
    </div>
  )
}

// ======================================================================

const DateHeader = (DateHeaderProps: BigCalendar.DateHeaderProps) => {
  const { label, date } = DateHeaderProps
  const showDate = parseInt(label)
  const isCurrentMonth = moment(date).isSame(new Date(), "month")
  return (
    <div className={classNames("my-[10px] mx-2", scss.dateHeader)}>
      <span className={classNames(
        "block w-fit px-3 m-auto ml-0",
        "text-base bg-[#e6e6e6] rounded-full",
        { [scss.isCurrentMonth]: !isCurrentMonth }
      )}>{showDate}</span>
    </div>
  )
}

// ======================================================================
const DateCellWrapper = (props: {
  range: Date[];
  value: Date;
  children: JSX.Element;
}) => {

  const { children, range, value } = props

  const isToday = moment(value).isSame(new Date(), "date")

  // children的className為 rbc-day-bg rbc-off-range-bg，留作備註
  // rbc-day-bg rbc-off-range-bg
  return (
    <div className={classNames(
      "rbc-day-bg", scss.dateCellWrapper,
      { [scss.isToday]: isToday }
    )}>
      <div className={scss.border} />
    </div>
  )
}
// ======================================================================

