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
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"

// fakeData
import { fakeEmployeeArr, TfakeEmployee } from "./_tempFakeData/fakeEmployeeArr"
import {
  TfakeDailyReport,
  fakeDailyReport as fakeDailyReportOri, generateData
} from "./_tempFakeData/fakeDailyReportArr"
import { TreportDetail, fakeReportDetailArr } from "./_tempFakeData/fakeReportDetailArr"


// api
import {
  TcreateDailyReportItemDto, TdailyReportDto,
  useApiDailyReports,
  useApiDailyReports_Reporters,
  useApiDailyReports_isReporters_me,
  useApiDailyReports_my,
  useApiDailyReports_id,
  apiPatchDailyReports_Reporters,
  apiPatchDailyReports_my,
  apiDailyReports_id,
} from "js/api/api_dailyReport"

import {
  TemployeeDto,
  useEmployee
} from "js/api/api_employee"

// type
import { TuserDto, TdailyReportItemDto, TerpFeatureDto } from "js/api/dtoTypes";







// css
import scss from "./dailyReport.module.scss"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// =====================================================================
export type Ttag = { reportId: string, employeeId: string, name: string, date: string }
// =====================================================================
const fakeDailyReport = generateData(fakeDailyReportOri, "2023-04-26", "2023-05-03")
// =====================================================================

export default function DailyReport(
  { userInfo, userErpFeature, }:
    {
      userInfo: TuserDto
      userErpFeature: TerpFeatureDto[]
    }
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
  // state
  // 送進SetReportEmpModal的arr
  const [reportEmpArr_preEdit, setReportEmpArr_preEdit] =
    useState<Parameters<typeof SetReportEmpModal>[0]["dataArr"]>()
  // 

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
  // const {
  //   dailyReport_my,
  //   updateDailyReports_my
  // } = useApiDailyReports_my(today)
  // 取得指定日報表
  // const {
  //   dailyReport_id,
  //   updateDailyReports_id
  // } = useApiDailyReports_id("ddd")
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
        // await updateDailyReports_id() // 取得指定日報表
      }
      if (isSubordinate) {
        // await updateIsReporter()  // 檢查自己是不是回報人員
        // await updateDailyReports_my() // 取得自己指定日期的日報表 //基本上就是當日
      }
      await updateDailyReports() // 取得指定月份所有日報表 //基本上就是當月
      // await apiDailyReports_id("8ffea857-f99d-4afc-90a6-b762b7073d93")
    })()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ----------------------------------------------------------------------

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
  const addTag = (tag: Ttag) => {
    if (userInfo.employee!.id !== tag.employeeId) return myAlert.warning({ title: "只能編輯自己的日報表" })
    if (tagArr.some(tag => tag.reportId === tag.reportId)) return
    setTagArr(arr => { arr.push(tag); return [...arr] })

  }
  const removeTag = (index: number) => {
    setTagArr(arr => { arr.splice(index, 1); return [...arr] })
  }

  // ----------------------------------------------------------------------
  // SetReportEmpModal
  // 搜尋功能寫在SetReportEmpModal裡面，不經由後端，在前端直接過濾
  const editReportEmpArr = () => {
    setReportEmpArr_preEdit(reportEmpArr)
  }
  const onConfirm = async (employeeArr: Parameters<typeof SetReportEmpModal>[0]["dataArr"]) => {
    const employeeIds: string[] = []
    employeeArr.forEach((employee) => {
      if (employee.shouldReport) employeeIds.push(employee.id)
    })
    try {
      showRootLoading(true)
      await apiPatchDailyReports_Reporters({ employeeIds })
      await updateDailyReports()
      onCancel()
    }
    catch {
      myAlert.err({ title: "更新回報人員失敗" })
    }
    finally { showRootLoading(false) }
  }
  const onCancel = () => {
    setReportEmpArr_preEdit(undefined)
  }
  // ----------------------------------------------------------------------

  // 編輯中的日報表，送進ReportTable
  const [reportInEdit, setReportInEdit]
    = useState<{ date: Date, items: Class_dailyReportItem[] }>()
  const [render, setRender] = useState(1)
  const reRender = () => setRender(state => ++state)

  const editNewDailyReport = async (reportId?: string, employeeId?: string) => {
    let date: Date
    let items: Class_dailyReportItem[]
    if (!reportId) {
      date = new Date()
      items = [new Class_dailyReportItem(reRender)]
    }
    else {
      let res;
      try {
        showRootLoading(true)
        res = await apiDailyReports_id(reportId, ["items"])
      }
      catch {
        myAlert.err({ title: "取得日報表失敗" })
      }
      finally { showRootLoading(false) }
      if (!res) return;
      date = new Date(res.date)
      items
        = res.items.map((item) => new Class_dailyReportItem(reRender, item))
    }
    setReportInEdit({ date, items })
  }


  const addDailyReportItem = () => {
    setReportInEdit(report => {
      if (!report) return report
      const date = report.date
      const items = report.items
      items.push(new Class_dailyReportItem(reRender))
      return { date, items }
    })

  }
  const cancelEditNewDailyReport = () => {
    setReportInEdit(undefined)
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
        if (!reportInEdit) return
        const date = reportInEdit.date
        const items = reportInEdit.items.map((item) => item.postBody)
        try {
          showRootLoading(true)
          await apiPatchDailyReports_my({ date, items })
          await updateDailyReports()
          cancelEditNewDailyReport()
        }
        catch { myAlert.err({ title: "更新日報表失敗" }) }
        finally { showRootLoading(false) }
      },
    },
    {
      type: "myButton",
      label: "取消",
      onClick: cancelEditNewDailyReport,
    },
  ]

  const panelList =
    !reportInEdit ? undefined :
      isSubordinate ? panelList02 : panelList01

  // ----------------------------------------------------------------------
  const customeLeft =
    [
      <TagCarousel key="1"
        tagArr={tagArr}
        editNewDailyReport={editNewDailyReport}
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

        {!reportInEdit &&
          <TheCalendar
            dailyReportArr={dailyReport ?? []}
            editReportEmpArr={isSubordinate ? undefined : editReportEmpArr}
            editDailyReport={isSubordinate ? editNewDailyReport : undefined}
            // editDailyReport={isSubordinate ? () => { } : undefined}
            addTag={addTag}
            isSubordinate={isSubordinate}
          />
        }

        {reportInEdit &&
          <ReportTable
            classDailyReportItemArr={reportInEdit.items}
            addDailyReportItem={addDailyReportItem}
            isSubordinate={isSubordinate} />
        }

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

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================




export class Class_dailyReportItem {
  constructor(
    reRender: () => void,
    dailyReportItem: TdailyReportItemDto = _.cloneDeep(emptyDailyReportItem)
  ) {
    this._reRender = reRender
    this._item = dailyReportItem

    this._install = this._item.workingTypes.includes("install")
    this._repair = this._item.workingTypes.includes("repair")
    this._powerDelivery = this._item.workingTypes.includes("power-delivery")
    this._maintenance = this._item.workingTypes.includes("maintenance")
    this._inspection = this._item.workingTypes.includes("inspection")

  } // constructor
  private _reRender
  private _item
  private _install
  private _repair
  private _powerDelivery
  private _maintenance
  private _inspection


  get id() {
    return this._item.id
  }

  get periodOfDay() {
    return this._item.periodOfDay
  }
  set periodOfDay(v: "AM" | "PM") {
    this._item.periodOfDay = v
    this._reRender()
  }

  get customerName() {
    return this._item.customerName
  }
  set customerName(v: string) {
    this._item.customerName = v
    console.log("test")
    this._reRender()
  }

  get contactName() {
    return this._item.contactName
  }
  set contactName(v: string) {
    this._item.contactName = v
    this._reRender()
  }

  get order() {
    return this._item.order
  }
  // set order(v: string) {
  //   this._item.order = v
  //   this._reRender()
  // }

  get workingTypes() {
    return this._item.workingTypes
  }
  // set workingTypes(v: ("install" | "repair" | "power-delivery" | "maintenace" | "inspection")[]) {
  //   this._item.workingTypes = v
  //   this._reRender()
  // }
  get install() { return this._install }
  set install(v: boolean) {
    this._install = v
    this._reRender()
  }

  get repair() { return this._repair }
  set repair(v: boolean) {
    this._repair = v
    this._reRender()
  }

  get powerDelivery() { return this._powerDelivery }
  set powerDelivery(v: boolean) {
    this._powerDelivery = v
    this._reRender()
  }

  get maintenance() { return this._maintenance }
  set maintenance(v: boolean) {
    this._maintenance = v
    this._reRender()
  }

  get inspection() { return this._inspection }
  set inspection(v: boolean) {
    this._inspection = v
    this._reRender()
  }


  get description() {
    return this._item.description
  }
  set description(v: string) {
    this._item.description = v
    this._reRender()
  }

  get postBody(): TcreateDailyReportItemDto {

    const workingTypes: TcreateDailyReportItemDto["workingTypes"] = []
    if (this.install) workingTypes.push("install")
    if (this.repair) workingTypes.push("repair")
    if (this.powerDelivery) workingTypes.push("power-delivery")
    if (this.maintenance) workingTypes.push("maintenance")
    if (this.inspection) workingTypes.push("inspection")

    return {
      periodOfDay: this.periodOfDay,
      customerName: this.customerName,
      contactName: this.contactName,
      description: this.description,
      workingTypes
    }

  }

} // Class_dailyReportItem


const emptyDailyReportItem: TdailyReportItemDto = {
  periodOfDay: "AM",
  customerName: "",
  contactName: "",
  workingTypes: [],
  description: "",
}

