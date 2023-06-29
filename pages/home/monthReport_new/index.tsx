import { useState, useEffect, useMemo } from "react"
import classNames from "classnames"
import _ from "lodash"

import { useRouter } from "next/router";
import moment from "moment";


// layer
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import SubLayer from "components/Layer/SubLayer/SubLayer"

// components
import MonthReportTable from "components/page/home/monthReport/monthReportTable_new";

// gear
import SelectBar, { TselectProps } from "components/global/gear/select/selectBar/selectBar";

// api
import {
  // TdailyReportDto,
  TaccountingReportDto,
  // useApiDailyReports,
  useApiAccountReports,

} from "js/api/api_dailyReport"

// css
import scss from "./monthReport.module.scss"

// other
import { createNumberRangeOptionArr } from "js/utils/options/options";
import { convertDate_reduce1911, convertDate_add1911 } from "js/utils/helpers/date/convertDate";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import { holidaysLookup } from "config/date/holidaysLookup";


const holidaysLookupKeyArr = Object.keys(holidaysLookup)
// =============================================================


export default function MonthReport() {
  const router = useRouter()
  // const query = router.query as {
  //   month?: string | undefined,
  //   year?: string | undefined
  // }

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // -------------------------------------------------------------------------

  const thisYear_tw =
    moment(convertDate_reduce1911(new Date().toISOString())).format("yy")
  const thisMonth =
    moment(convertDate_reduce1911(new Date().toISOString())).format("M")

  const [year_tw, setYear_tw] = useState<string>(thisYear_tw)
  const [month, setMonth] = useState<string>(thisMonth)

  const { params, isoDate } = useMemo(() => {

    const dateStr = (() => {
      const year_stand = (() => {
        return moment(convertDate_add1911(year_tw)).format("YYYY")
      })()
      const theMonth = moment(month).format("MM")
      return `${year_stand}-${theMonth}`
    })()

    const isoDate = moment(dateStr).toISOString()
    const monthStart: string =
      moment(isoDate).startOf('month').toISOString()
    const monthEnd: string =
      moment(isoDate).endOf('month').toISOString()


    const params = {
      // populate:
      //   ["employee", "items"],
      pageSize: 9999,
      filter: {
        ["statistics.date"]: {
          $gte: monthStart,
          $lte: monthEnd
        },
      }
    }
    return { params, isoDate }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year_tw, month])

  const { accountingReport, updateAccountReports, } = useApiAccountReports(params)


  useEffect(() => {
    if (!router.isReady) return
    (async () => {
      try {
        setIsLoading(true)
        await updateAccountReports()
      }
      catch { myAlert.err({ title: "取得資料失敗" }) }
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, params])

  // 新api不需要分組
  // const groupedReport = useMemo(() => {
  //   const sorted = (_.sortBy(accountReport, ["id", "date"]) ?? []).reverse()
  //   const grouped = _.groupBy(sorted, (report) => report.employee.id) as { [key: string]: TaccountingReportDto[] }
  //   const groupedArray = Object.entries(grouped).map(([key, value]) => grouped[key])

  //   const groupedObj = groupedArray.map((group) => {
  //     const obj: { [key: string]: (typeof group[number]) | undefined } = {}
  //     let chName: string = ""
  //     group.forEach((item) => {
  //       const dateDay = moment(item.date).format("D")
  //       obj[dateDay] = item
  //       chName = item.employee.chName
  //     })
  //     return {
  //       chName,
  //       list: obj
  //     }
  //   })
  //   return groupedObj
  // }, [accountReport])
  // --------------------------------------------------



  const yearOptionArr = createNumberRangeOptionArr({
    start: +holidaysLookupKeyArr[0],
    end: +holidaysLookupKeyArr[holidaysLookupKeyArr.length - 1],
    suffix: "年"
  }
  )
  const monthOptionArr = createNumberRangeOptionArr({
    start: 1,
    end: 12,
    suffix: "月",
    padStart: [2, "0"]
  })

  const selectPropsArr: Parameters<typeof SelectBar>[0]["selectPropsArr"] = [
    {
      selectProps: {
        value: year_tw,
        options: yearOptionArr,
        onChange: (option) => { setYear_tw(option!.value) },
      },
      boxStyle: { width: "110px" }
    },
    {
      selectProps: {
        value: month,
        options: monthOptionArr,
        onChange: (option) => { setMonth(option!.value) },
      },
      boxStyle: { width: "100px" }
    }
  ]


  const panelList: TpanelList = [
    {
      custom: <SelectBar
        selectPropsArr={selectPropsArr}
      />
    },
  ]


  // --------------------------------------------------
  return (
    <SubLayer bodyClassName={classNames(scss.subLayerBody, scss.plus)}
      isLoading_subLayer={isLoading}
    >
      <PageHeader02 tag="報表" panelList={panelList} />

      <MonthReportTable
        key={year_tw + month}
        isoDate={isoDate}
        accountingReport={accountingReport}
      />

    </SubLayer>
  )
}
