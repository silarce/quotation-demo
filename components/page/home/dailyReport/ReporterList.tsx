
import { useMemo } from "react"
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
import { TdailyReportDto } from "js/api/api_dailyReport"
import { Ttag } from "pages/home/dailyReport"


type TgroupReport = { date: string, reportArr: TdailyReportDto[] }

export default function ReporterList(
  {
    dailyReportArr,
    addTag,
  }:
    {
      dailyReportArr: TdailyReportDto[]
      addTag: (employee: Ttag) => void
    }
) {

  const groupReportArr = useMemo(() => {
    const groupReportList = _.groupBy(dailyReportArr, "date")
    const groupReportArr: TgroupReport[] = []
    for (const [key, value] of Object.entries(groupReportList)) {
      groupReportArr.push({
        date: key,
        reportArr: value
      })
    }
    return groupReportArr
  }, [dailyReportArr])


  return (
    <div className={scss.container}>

      {groupReportArr.map((group, index) => {
        const { date, reportArr } = group
        return (
          <div key={index}>
            <div className={classNames(scss.groupHeader)}>
              <span>{date}</span>
            </div>

            {reportArr.map((report, index) => {
              const { date, employee, id: reportId, reviewStatus } = report
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
                  <div className={classNames("w-[95px]", scss.chDate)}><span>{chDate}</span></div>
                  <div className={classNames(scss.chName, "w-[120px]")}><span>{chName}</span></div>
                  <div className={classNames(scss.reviewerList, "w-full")}>

                    {reviewStatus?.map((item, index) => {
                      const { reviewerEmployee, reviewedAt } = item
                      const { chName, } = reviewerEmployee
                      return (
                        <StatuBtn key={index}
                          statu={!!reviewedAt} name={chName} />
                      )
                    })}
                  </div>
                </CellWithBar>
              )
            })}

          </div>
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














