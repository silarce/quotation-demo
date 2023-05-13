
import { useState } from "react"
import classNames from "classnames"
import _ from "lodash"

// antd
import { Badge } from "antd"

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"

// tool
import { yearConversion_standardToCh } from "js/tools/date/yearConversion_standardToCh"

// css
import scss from "./reporterList.module.scss"

// type
import { TdailyReportDto_simple } from "js/api/api_dailyReport"
import { Ttag } from "pages/home/dailyReport"


export default function ReporterList(
  {
    dailyReportArr,
    addTag,
  }:
    {
      dailyReportArr: TdailyReportDto_simple[]
      addTag: (employee: Ttag) => void
    }
) {

  const [reviewerArr, setReviewerArr] = useState(fakeReviewerArr)


  return (
    <div className={scss.container}>
      {dailyReportArr.map((report, index) => {

        const { date, employee, id: reportId } = report
        const { chName, id: employeeId } = employee
        const chDate = yearConversion_standardToCh(date, true)

        const tag: Ttag = {
          reportId,
          employeeId,
          name: chName,
          date: chDate,
        }


        return (
          <CellWithBar key={index} className={classNames(scss.row)}
            onClick={() => { addTag(tag) }}>
            <div className={classNames("w-[95px]")}><span>{chDate}</span></div>
            <div className={classNames(scss.chName, "w-[120px]")}><span>{chName}</span></div>
            <div className={classNames(scss.reviewerList, "w-full")}>
              {reviewerArr.map((item, index) => {
                const { statu, name } = item
                return (
                  <StatuBtn key={index}
                    statu={statu} name={name} />
                )
              })}
            </div>
          </CellWithBar>
        )
      })}
    </div>
  )
}

// ==========================================================================

const StatuBtn = (
  { statu, name }:
    {
      statu: boolean
      name: string
    }
) => {
  const color = statu ? "green" : "red"
  return (
    <div className={scss.statuBtn}>
      <Badge color={color} />
      <span>{name}</span>
    </div>
  )
}

// ==========================================================================

const fakeReviewerArr = [
  { statu: true, name: "李冠華" },
  { statu: true, name: "李冠華" },
  { statu: false, name: "李冠華" },
  { statu: false, name: "李冠華" },
  { statu: true, name: "李冠華" },
  { statu: false, name: "李冠華" },
  { statu: true, name: "李冠華" },
]


















