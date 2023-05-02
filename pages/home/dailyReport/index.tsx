import { useState, useEffect, useMemo } from "react"
import classNames from "classnames"
import { useRouter } from "next/router"
import _ from "lodash"
import moment from "moment";

// layer
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import SubLayer from "components/Layer/SubLayer/SubLayer"
// component
import TheCalendar from "components/page/home/dailyReport/TheCalendar"
import SetReportEmpModal from "components/page/home/dailyReport/SetReportEmpModal"
import ReportTable from "components/page/home/dailyReport/ReportTable"
import TagCarousel from "components/page/home/dailyReport/TagCarousel"
// gear
import CheckButton from "components/global/gear/button/checkButton"

// fakeData
import { fakeEmployeeArr, TfakeEmployee } from "./_tempFakeData/fakeEmployeeArr"
import {
  TfakeDailyReport,
  fakeDailyReport as fakeDailyReportOri, generateData
} from "./_tempFakeData/fakeDailyReportArr"
import { TreportDetail, fakeReportDetailArr } from "./_tempFakeData/fakeReportDetailArr"


// api
import {
  useApiDailyReports,
  useApiDailyReports_Reporters,
  useApiDailyReports_isReporters_me,
  useApiDailyReports_my,
  useApiDailyReports_id,
  apiPatchDailyReports_Reporters,
  apiPatchDailyReports_my,
} from "js/api/api_dailyReport"

import {
  TemployeeDto,
  useEmployee
} from "js/api/api_employee"

// type
import { TerpFeatureDto } from "js/api/dtoTypes";







// css
import scss from "./dailyReport.module.scss"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// =====================================================================
type Ttag = { name: string, date: string }
// =====================================================================
const fakeDailyReport = generateData(fakeDailyReportOri, "2023-04-26", "2023-05-03")
// =====================================================================

export default function DailyReport(
  { userErpFeature }:
    { userErpFeature: TerpFeatureDto[] }
) {
  // -----------------------------------------------------------
  // const router = useRouter()
  // const isSubordinate = false
  const isSubordinate = (() => {
    let isSubordinate: boolean = true
    if (userErpFeature) {
      const result = userErpFeature.find((erp) => {
        return erp.name === "人事權限建立"
      })
      if (result) isSubordinate = false
    }
    return isSubordinate
  })()
  // -----------------------------------------------------------


  // const [reportEmpArr_preEdit, setReportEmpArr_preEdit] = useState<TfakeEmployee[]>()
  const [reportEmpArr_preEdit, setReportEmpArr_preEdit] =
    useState<Parameters<typeof SetReportEmpModal>[0]["dataArr"]>()

  const [tagArr, setTagArr] = useState<Ttag[]>([])

  // ----------------------------------------------------------------------
  const today = moment().format("YYYY-MM-DD");
  const thisMonth = moment().format("YYYY-MM");

  // 取得所有回報人員
  const {
    dailyReports_ReportersArr,
    updateDailyReports_ReportersArr
  } = useApiDailyReports_Reporters()
  // 檢查自己是不是回報人員
  const {
    dailyReports_isReporters_me: isReporter,
    updateDailyReports_isReporters_me: updateIsReporter
  } = useApiDailyReports_isReporters_me()
  // 取得指定月份所有日報表
  const {
    dailyReport,
    updateDailyReports,
  } = useApiDailyReports(thisMonth)
  // 取得自己指定日期的日報表
  const {
    dailyReport_my,
    updateDailyReports_my
  } = useApiDailyReports_my(today)
  // 取得指定日報表
  const {
    dailyReport_id,
    updateDailyReports_id
  } = useApiDailyReports_id("ddd")
  // 取得所有人員
  const { data: employeeRes, update: updateEmployeeArr }
    = useEmployee({ pageSize: 999999, populate: ["jobs"] })
  const employeeArr = employeeRes?.data

  // ----------------------------------------------------------------------
  useEffect(() => {

    (async () => {

      if (!isSubordinate) {
        const allArr = [
          updateDailyReports_ReportersArr(), // 取得所有回報人員
          updateEmployeeArr() // 取得所有人員
        ]
        await Promise.all(allArr)
      }
      // await updateIsReporter()  // 檢查自己是不是回報人員
      await updateDailyReports() // 取得指定月份所有日報表
      // await updateDailyReports_my() // 取得自己指定日期的日報表
      // await updateDailyReports_id() // 取得指定日報表
    })()


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const reportEmpArr = useMemo(() => {
    if (!dailyReports_ReportersArr || !employeeArr) return []

    const result = employeeArr.map((item) => {
      const match = dailyReports_ReportersArr.find((x) => x.id === item.id)
      const shouldReport = match ? true : false

      let theJobs = (() => {
        if (item.jobs) {
          return _.sortBy(item.jobs, "grade")
        }
        else return []
      })();

      const obj = {
        id: item.id,
        chName: item.chName,
        idNumber: item.idNumber,
        job: theJobs[0]?.name ?? "",
        grade: theJobs[0]?.grade ?? "",
        shouldReport
      }
      return obj
    })
    return result
  }, [dailyReports_ReportersArr, employeeArr,])



  // ----------------------------------------------------------------------
  // TagCarousel
  const addTag = (employee: Ttag) => {
    setTagArr(arr => { arr.push(employee); return [...arr] })
  }
  const removeTag = (index: number) => {
    setTagArr(arr => { arr.splice(index, 1); return [...arr] })
  }

  // ----------------------------------------------------------------------
  // SetReportEmpModal
  const editReportEmpArr = () => {
    setReportEmpArr_preEdit(reportEmpArr)
  }
  const onConfirm = async (employeeArr: Parameters<typeof SetReportEmpModal>[0]["dataArr"]) => {
    const employeeIds: string[] = []
    employeeArr.forEach((employee) => {
      if (employee.shouldReport) employeeIds.push(employee.id)
    })
    try {
      await apiPatchDailyReports_Reporters({ employeeIds })
    }
    catch {
      myAlert.err({ title: "更新失敗" })
    }
  }
  const onCancel = () => {
    setReportEmpArr_preEdit(undefined)
  }
  const onSearch = (v: string) => {
    console.log(v)
  }
  // ----------------------------------------------------------------------
  const panelList01: TpanelList = [
    {
      custom: <CheckButton
        checkLabel="已讀"
        uncheckLable="未讀"
        onClick={(isCheck) => { console.log(isCheck) }}
        defaultCheck={true}
      />
    }
  ]

  const panelList02: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: async () => {


        // apiPatchDailyReports_my({
        //   date: new Date(),
        //   items: [
        //     {
        //       periodOfDay: "AM",
        //       customerName: "測試",
        //       contactName: "測試",
        //       workingTypes: ["install"],
        //       description: "測試測試測試測試",
        //     }
        //   ]
        // })


      },
    },
    {
      type: "myButton",
      label: "取消",
      onClick: () => { },
    },
  ]
  const panelList = isSubordinate ? panelList02 : panelList01

  // ----------------------------------------------------------------------
  const customeLeft =
    [
      <TagCarousel key="1"
        tagArr={tagArr}
        removeTag={removeTag} />
    ]
  // ----------------------------------------------------------------------

  return (
    <>
      {/* <SubLayer bodyClassName={scss.subLayer}> */}
      <SubLayer bodyClassName={classNames(scss.subLayer, scss.plus)}>
        <PageHeader02 tag="日報表" tagClassName={scss.pageHeaderTag}
          panelList={panelList}
          customeLeft={customeLeft}
        />

        <TheCalendar dataArr={fakeDailyReport}
          editReportEmpArr={editReportEmpArr}
          addTag={addTag}
        />
        {/* <ReportTable reportDetailArr={fakeReportDetailArr} isSubordinate={isSubordinate} /> */}

      </SubLayer>

      <SetReportEmpModal
        visible={!!reportEmpArr_preEdit}
        onConfirm={onConfirm}
        onCancel={onCancel}
        // onSearch={onSearch}
        dataArr={reportEmpArr_preEdit ?? []}
      />
    </>
  )
}

// ==========================================================






