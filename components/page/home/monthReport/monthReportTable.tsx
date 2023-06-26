import { useMemo } from "react";
import classNames from "classnames";
import moment from "moment";
import { Badge } from "antd";

// css
import scss from "./monthReportTable.module.scss"

// type
import { TdailyReportDto } from "js/api/dtoTypes";




// =============================================================

export default function MonthReportTable(
  {
    isoDate,
    groupedReport }:
    {
      isoDate: string
      groupedReport: {
        chName: string;
        list: { [key: string]: TdailyReportDto | undefined; }
      }[]
    }
) {

  const dayArr = useMemo(() => {
    const weekDays = [];
    const date = moment(isoDate).startOf('month');
    const daysInMonth = date.daysInMonth();

    for (let i = 0; i < daysInMonth; i++) {
      const day = date.day(); // 使用 date() 取得當前的天數
      const dateStr = date.format('yyyy-MM-DD');
      const dateMoment = date.clone();
      weekDays.push({
        day,
        date: dateStr,
        dateMoment
      });

      date.add(1, 'day');
    }
    return weekDays;
  }, [isoDate]);


  // console.log(groupedReport)



  return (
    <div className={scss.table}>

      <Side dayArr={dayArr} />


      {/* group */}
      <div className={scss.main}>

        {groupedReport.map((group, gIndex) => {
          const { chName, list } = group
          return (
            <div key={gIndex} className={scss.item}>
              <Head chName={chName} />

              {dayArr.map((dayObj) => {
                const { day, date, dateMoment } = dayObj
                const dateDay = dateMoment.date().toString().padStart(2, "0")
                const { items } = list[dateDay] ?? {}
                let breakfast = 0
                let lunch = 0
                let dinner = 0
                let stayLength = 0

                items?.forEach((item) => {
                  stayLength = stayLength + (item.stayLength || 0)
                  const meals = item.meals
                  meals.forEach((meal) => {
                    if (meal === "breakfast") breakfast++
                    if (meal === "lunch") lunch++
                    if (meal === "dinner") dinner++
                  })
                })


                const isHoliday = checkIsHoliday(day)

                return (
                  <div key={date} className={classNames(scss.row, { [scss.isHoliday]: isHoliday })}>
                    <div className={scss.cell}>{breakfast !== 0 && <MyBadge />}</div>
                    <div className={scss.cell}>{lunch !== 0 && <MyBadge />}</div>
                    <div className={scss.cell}>{dinner !== 0 && <MyBadge />}</div>
                    <div className={scss.cell}>{stayLength || null}</div>
                  </div>
                )

              })}
            </div>
          )
        })}
      </div>
      {/* group */}


    </div>
  )
}

// =============================================================
// =============================================================
// =============================================================

const checkIsHoliday = (day: number) => {
  if (day === 0 || day === 6) return true
  return false
}

// =============================================================
// =============================================================
// =============================================================

const MyBadge = () => {

  return (
    <Badge color="#08F366" className={scss.myBadge} />
  )

}



const Side = (
  { dayArr }:
    {
      dayArr: {
        day: number;
        date: string;
        dateMoment: moment.Moment;
      }[]
    }
) => {
  return (
    <div className={scss.side}>
      <div className={scss.head}><span>日期</span></div>
      {dayArr.map((dayObj) => {
        const { day, date, dateMoment } = dayObj
        const dateDay = dateMoment.date()
        const isHoliday = checkIsHoliday(day)
        return (
          <div key={date} className={classNames(scss.cell, { [scss.isHoliday]: isHoliday })}>
            <span>{dateDay}</span>
          </div>
        )
      })}
    </div>
  )
}

const Head = (
  { chName }:
    { chName: string }
) => {
  return (
    <div className={scss.head}>
      <div className={scss.cell}><span>{chName}</span></div>
      <div className={scss.cell}><span>早</span></div>
      <div className={scss.cell}><span>中</span></div>
      <div className={scss.cell}><span>晚</span></div>
      <div className={scss.cell}><span>外宿</span></div>
    </div>
  )
}








