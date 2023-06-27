import { useMemo } from "react";
import classNames from "classnames";
import moment from "moment";
import { Badge } from "antd";

// css
import scss from "./monthReportTable.module.scss"

// type
import { TdailyReportDto } from "js/api/dtoTypes";

// other
import { myConfig } from "config/myConfig";

import { holidaysLookup } from "config/date/holidaysLookup";

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


  const { weekDays: dayArr, holidayLookup_month } = useMemo(() => {
    const weekDays = [];
    const date = moment(isoDate).startOf('month');
    const year = date.year();
    const month = (date.month() + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
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

    const holidayLookup_month = holidaysLookup[year]?.[month]

    return { weekDays, year, month, holidayLookup_month };
  }, [isoDate]);


  // -----------------------------------------------------------------
  let monthTotal = 0
  // -----------------------------------------------------------------
  return (
    <div className={scss.container}>
      <div className={scss.table}>
        <Side dayArr={dayArr} holidayLookup_month={holidayLookup_month} />
        {/* group */}
        <div className={scss.main}>

          {groupedReport.map((group, gIndex) => {
            const { chName, list } = group

            let breakfastTotal = 0
            let lunchTotal = 0
            let dinnerTotal = 0
            let stayLengthTotal = 0

            return (
              <div key={gIndex} className={scss.item}>
                <Head chName={chName} />

                {dayArr.map((dayObj) => {
                  const { day, date, dateMoment } = dayObj
                  const dateDay = dateMoment.date().toString()
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
                  breakfastTotal = breakfastTotal + breakfast
                  lunchTotal = lunchTotal + lunch
                  dinnerTotal = dinnerTotal + dinner
                  stayLengthTotal = stayLengthTotal + stayLength

                  let isHoliday = false
                  const { 是否放假 } = holidayLookup_month?.[dateDay] ?? {}
                  if (是否放假 === "2") isHoliday = true

                  return (
                    <div key={date} className={classNames(scss.row, { [scss.isHoliday]: isHoliday })}>
                      <div className={scss.cell}>{breakfast !== 0 && <MyBadge />}</div>
                      <div className={scss.cell}>{lunch !== 0 && <MyBadge />}</div>
                      <div className={scss.cell}>{dinner !== 0 && <MyBadge />}</div>
                      <div className={scss.cell}>{stayLength || null}</div>
                    </div>
                  )
                })}

                <div className={classNames(scss.row)}>
                  <div className={classNames(scss.cell, scss.mainColor)}><span>{breakfastTotal}</span></div>
                  <div className={classNames(scss.cell, scss.mainColor)}><span>{lunchTotal}</span></div>
                  <div className={classNames(scss.cell, scss.mainColor)}><span>{dinnerTotal}</span></div>
                  <div className={classNames(scss.cell, scss.mainColor)}><span>{stayLengthTotal}</span></div>
                </div>

                {(() => {
                  const { breakfastCost, lunchCost, dinnerCost, stayCost } = myConfig

                  const mealsCostTotal =
                    breakfastTotal * breakfastCost +
                    lunchTotal * lunchCost +
                    dinnerTotal * dinnerCost

                  const styCostTotal = stayLengthTotal * stayCost
                  const total = mealsCostTotal + styCostTotal
                  monthTotal = monthTotal + total

                  return (
                    <>
                      <div className={classNames(scss.cell, scss.mainColor)}><span>{mealsCostTotal}</span></div>
                      <div className={classNames(scss.cell, scss.mainColor)}><span>{styCostTotal}</span></div>
                      <div className={classNames(scss.cell, scss.bottom)}><span>{total}</span></div>
                    </>
                  )
                })()}
              </div>
            )
          })}
        </div>{/* group */}
      </div> {/* table */}

      <div className={scss.total}>
        <div>
          <div><span>本月總合計</span></div>
          <div><span>{monthTotal}</span></div>
        </div>
      </div>

    </div>
  )
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
  { dayArr, holidayLookup_month }:
    {
      dayArr: {
        day: number;
        date: string;
        dateMoment: moment.Moment;
      }[]
      holidayLookup_month: typeof holidaysLookup[number][number]
    }
) => {
  return (
    <div className={scss.side}>
      <div className={scss.head}><span>日期</span></div>
      {dayArr.map((dayObj) => {
        const { day, date, dateMoment } = dayObj
        const dateDay = dateMoment.date()


        let isHoliday = false
        const { 是否放假 } = holidayLookup_month?.[dateDay] ?? {}
        if (是否放假 === "2") isHoliday = true

        return (
          <div key={date} className={classNames(scss.cell, { [scss.isHoliday]: isHoliday })}>
            <span>{dateDay}</span>
          </div>
        )
      })}
      <div className={classNames(scss.cell, scss.mainColor)}><span>合計</span></div>
      <div className={classNames(scss.cell)}><span>餐費</span></div>
      <div className={classNames(scss.cell)}><span>外宿費</span></div>
      <div className={classNames(scss.cell, scss.bottom, scss.mainColor)}><span>餐加宿</span></div>

    </div>
  )
}

const Head = (
  { chName }:
    { chName: string }
) => {
  return (
    <div className={scss.head}>
      <div className={classNames(scss.cell, scss.chName)}><span>{chName}</span></div>
      <div className={scss.cell}><span>早</span></div>
      <div className={scss.cell}><span>中</span></div>
      <div className={scss.cell}><span>晚</span></div>
      <div className={scss.cell}><span>外宿</span></div>
    </div>
  )
}

