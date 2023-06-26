import { useState, useEffect, createContext, useMemo } from "react"
import classNames from "classnames"
import _ from "lodash"
import { AxiosError } from "axios";
import { useRouter, NextRouter } from "next/router";
import moment from "moment";


// layer
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import PageHeader_mobile_dailyReport from "pages/home/dailyReport/pageHeader_mobile/PageHeader_mobile_dailyReport";
import SubLayer from "components/Layer/SubLayer/SubLayer"


// api
import {
  TdailyReportDto, Tparams,
  useApiDailyReports, useApiDailyReports_reviewers,
  useApiDailyReports_v2,
  apiPatchDailyReports_my,
  apiDailyReports_id,
  apiDailyReports_review,
  apiPatchDailyReports_reviewers,
  apiIsReviewer,
} from "js/api/api_dailyReport"





// =============================================================


export default function MonthReport() {

  const router = useRouter()
  const query = router.query as {
    month?: string | undefined,
    year?: string | undefined
  }


  const params: Tparams = useMemo(() => {
    // let monthStart: string | undefined =
    //   moment(`${query.year}-${query.month}-01`).startOf('month').toISOString()
    // let monthEnd: string | undefined =
    //   moment(`${query.year}-${query.month}-01`).endOf('month').toISOString()

    // if (!query.month || !query.year) {
    //   monthStart = undefined
    //   monthEnd = undefined
    // }

    const monthStart: string =
      moment("2023-06").startOf('month').toISOString()
    const monthEnd: string =
      moment("2023-06").endOf('month').toISOString()

    return {
      pageSize: 999,
      filter: {
        date: {
          $gte: monthStart,
          $lte: monthEnd
        },
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.month, query.year])


  const {
    dailyReport,
    setDailyReports, updateDailyReports,
  } = useApiDailyReports(params)


  useEffect(() => {
    if (!router.isReady) return
    updateDailyReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, params])

  const groupedReport = useMemo(() => {
    const sorted = (_.sortBy(dailyReport, ["id", "date"]) ?? []).reverse()
    const grouped = _.groupBy(sorted, (report) => report.employee.id) as { [key: string]: TdailyReportDto[] }
    const groupedArray = Object.entries(grouped).map(([key, value]) => grouped[key])

    const groupedObj = groupedArray.map((group) => {
      const obj: { [key: string]: typeof group[number] } = {}
      group.forEach((item) => {
        const dateDay = moment(item.date).format("DD")
        obj[dateDay] = item
      })
      return obj
    })
    return groupedObj
  }, [dailyReport])


  // --------------------------------------------------


  // --------------------------------------------------
  return (
    <SubLayer>
      <PageHeader02 tag="報表" />

      <div></div>


    </SubLayer>
  )
}























