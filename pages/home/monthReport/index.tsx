import { useState, useEffect, useMemo } from "react"
import classNames from "classnames"
import _ from "lodash"

import { useRouter } from "next/router";
import moment from "moment";


// layer
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import SubLayer from "components/Layer/SubLayer/SubLayer"

// components
import MonthReportTable from "components/page/home/monthReport/monthReportTable";
import SetReportEmpModal from "components/page/home/dailyReport/SetReportEmpModal"
import EmployeeSelector from "components/global/gear/modal/employeeSelector";
import ReportTable_simple from "components/page/home/monthReport/reportTable_simple";


// gear
import SelectBar from "components/global/gear/select/selectBar/selectBar";

// api
import { useApiAccountReports, } from "js/api/api_dailyReport"
import { TemployeeDto } from "js/api/api_dailyReport";

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
  const query = router.query as {
    reportId: string
  }

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // -------------------------------------------------------------------------

  const thisYear_tw =
    moment(convertDate_reduce1911(new Date().toISOString())).format("yy")
  const thisMonth =
    moment(convertDate_reduce1911(new Date().toISOString())).format("M")

  const [year_tw, setYear_tw] = useState<string>(thisYear_tw)
  const [month, setMonth] = useState<string>(thisMonth)

  const isoDate = useMemo(() => {
    const isoDate = (() => {
      const year_stand = (() => {
        return moment(convertDate_add1911(year_tw)).format("YYYY")
      })()
      const theMonth = moment(month).format("MM")
      // 因為時區誤差，所以設15號
      return moment(`${year_stand}-${theMonth}-15`).toISOString()
    })()
    return isoDate
  }, [year_tw, month])

  const { accountingReport, updateAccountReports, } = useApiAccountReports(isoDate)


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
  }, [router.isReady, isoDate])


  // --------------------------------------------------

  const [isShowSelector, setIsShowSelector] = useState<boolean>(false)

  // 搜尋/過濾用的
  const [employeeIdArr, setEmployeeIdArr] = useState<string[]>()

  const onConfirm = (arr: TemployeeDto[]) => {
    if (arr.length === 0) return setEmployeeIdArr(undefined)
    const idArr = arr.map((item) => item.id)
    setEmployeeIdArr(idArr)
  }

  const onCancel = () => {
    setIsShowSelector(false)
  }

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

  const panelList_list: TpanelList = [
    {
      type: employeeIdArr ? "redButton" : "myButton",
      label: employeeIdArr ? "清除搜尋" : "搜尋",
      onClick: () => {
        employeeIdArr ? setEmployeeIdArr(undefined) : setIsShowSelector(true)
      },
      className: scss.btn,
    },
    {
      custom: <SelectBar
        selectPropsArr={selectPropsArr}
      />
    },
  ]


  // --------------------------------------------------

  const pushReportId = (id: string) => {
    router.push({
      query: {
        ...query,
        reportId: id
      }
    })
  }

  // --------------------------------------------------
  //使搜尋清單只會有存在於accountingReport的人員
  const accountingReportIdArr = accountingReport?.map((item) => item.employeeId)

  const customFilter = {
    id: {
      $in: accountingReportIdArr
    },
  }
  // --------------------------------------------------
  return (
    <>
      <SubLayer bodyClassName={classNames(scss.subLayerBody, scss.plus)}
        isLoading_subLayer={isLoading}
      >
        <PageHeader02 tag="報表" panelList={panelList_list} />

        {!query.reportId &&
          <MonthReportTable
            key={year_tw + month}
            isoDate={isoDate}
            accountingReport={accountingReport}
            employeeIdArr={employeeIdArr}
            pushReportId={pushReportId}
          />
        }

        {query.reportId && <ReportTable_simple />}

      </SubLayer>
      <EmployeeSelector
        showModal={isShowSelector}
        onConfirm={onConfirm}
        onCancel={onCancel}
        customFilter={customFilter}
      />
    </>
  )
}
