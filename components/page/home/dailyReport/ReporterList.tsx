
import { useState, useMemo } from "react"
import Image from "next/image"
import moment from 'moment'
import classNames from "classnames"
import _ from "lodash"

// antd
import { Badge } from "antd"

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"
// import MyButton from "components/global/gear/button/myButton"

// img
// import iconCircle from "public/image/icon/circle.svg"
// import iconCircle_Checked from "public/image/icon/circle_checked.svg"
// import iconRedDot from "public/image/icon/redDot.svg"

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
    // editReportEmpArr,
    editDailyReport,
    updateDailyReports
  }:
    {
      dailyReportArr: TdailyReportDto_simple[]
      addTag: (employee: Ttag) => void
      // editReportEmpArr?: () => void
      editDailyReport?: () => void
      updateDailyReports: () => void
    }
) {

  const [reviewerArr, setReviewerArr] = useState(fakeReviewerArr)
  const switchStatu = (index: number) => {
    setReviewerArr(arr => {
      const newArr = [...arr]
      newArr[index] = { ...newArr[index] }
      newArr[index].statu = !newArr[index].statu
      return newArr
    })
  }


  // console.log(dailyReportArr)

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
                  <StatuBtn key={index} onClick={() => switchStatu(index)}
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
  { statu, name, onClick }:
    {
      statu: boolean
      name: string
      onClick?: () => void
    }
) => {
  const color = statu ? "green" : "red"
  return (
    <button className={scss.statuBtn} onClick={(e) => { e.stopPropagation(); onClick?.() }}>
      <Badge color={color} />
      <span>{name}</span>
    </button>
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
  { statu: true, name: "李冠華" },
  { statu: true, name: "李冠華" },
  { statu: false, name: "李冠華" },
]


















