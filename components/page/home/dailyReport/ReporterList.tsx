
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
import { TdailyReportReviewStatusDto } from "js/api/dtoTypes"
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

              const statusChecker = (status: TdailyReportReviewStatusDto) => {
                const { reviewedAt, type } = status
                if (type === "examiner") return 1
                if (!reviewedAt) return 2
                else return 3
              }

              const gradeChecker = (status: TdailyReportReviewStatusDto) => {
                const jobArr = status.reviewerEmployee.jobs ?? []
                const sortedJobs = _.sortBy(jobArr, "grade").reverse()
                const grade = sortedJobs[0]?.grade || 0
                return grade
              }

              const sortteStatuArr =
                _.sortBy(reviewStatus, [statusChecker, gradeChecker])
                  .reverse()

              return (
                <CellWithBar key={index} className={classNames(scss.row)}
                  onClick={() => { addTag(tag) }}>
                  <div className={classNames(scss.chName, "w-[120px]")}><span>{chName}</span></div>

                  <div className={classNames(scss.reviewerList, "w-full")}>

                    {sortteStatuArr?.map((item, index) => {
                      const { reviewerEmployee, reviewedAt, type } = item
                      let statu = (() => {
                        if (type === "examiner") return "gray"
                        if (reviewedAt) return "green"
                        return "red"
                      })()
                      const { chName } = reviewerEmployee

                      return (
                        <StatuBtn key={index}
                          statu={statu} name={chName} />
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
      statu: string
      name: string
    }
) => {

  return (
    <div className={scss.statuBtn}>
      <Badge color={statu} />
      <span>{name}</span>
    </div>
  )
}

// ==========================================================================
