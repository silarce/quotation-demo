import { useState, } from "react"
import _ from "lodash"
import moment from "moment";

// type
import { TdailyReportItemDto } from "js/api/dtoTypes";
// api
import {
  TcreateDailyReportItemDto, TdailyReportDto,
} from "js/api/api_dailyReport"



type ThookEmptyReport = {
  id: string | undefined
  date: string
  items: Class_reportItem[]
  reviewedAt: Date | null | undefined
  isEdit: boolean
}


const emptyReportItem: TdailyReportItemDto = {
  periodOfDay: "AM",
  customerName: "",
  contactName: "",
  workingTypes: [],
  description: "",
}


/**不送dailyReportItem參數會自動送進emptyDailyReportItem */
class Class_reportItem {
  constructor(
    reRender: () => void,
    reportItem: TdailyReportItemDto = _.cloneDeep(emptyReportItem)
  ) {
    this._reRender = reRender
    this._item = reportItem

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
  // 後端還沒有這個property
  private _meals = "888"
  // 



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

  // 後端還沒有這個property
  get meals() { return this._meals }
  set meals(v) { this._meals = v; this._reRender() }
  // 

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




const useReport = () => {

  const [render, setRender] = useState(1)
  const reRender = () => setRender(state => ++state)

  const [report, setReport] = useState<ThookEmptyReport>()

  const emptyReportCre = (): ThookEmptyReport => ({
    id: undefined,
    date: moment().format("yyyy-MM-DD"),
    items: [new Class_reportItem(reRender)],
    reviewedAt: undefined,
    isEdit: false
  })

  const reNew_report = (
    { dailyReport }:
      {
        dailyReport?: TdailyReportDto,
      }
  ) => {
    if (!dailyReport) {
      return setReport(emptyReportCre())
    }
    const theReport: ThookEmptyReport = {
      id: dailyReport.id,
      date: dailyReport.date,
      items: dailyReport.items.map((item) => new Class_reportItem(reRender, item)),
      reviewedAt: dailyReport.reviewedAt,
      isEdit: false
    }
    setReport(theReport)
  }

  const addReportItem = () => {
    setReport(report => {
      if (!report) return report
      const id = report.id
      const date = report.date
      const items = report.items
      const reviewedAt = report.reviewedAt
      const isEdit = report.isEdit
      items.push(new Class_reportItem(reRender))
      return { id, date, items, reviewedAt, isEdit }
    })
  }

  const changeReviewToChecked = (reviewedAt: Date) => {
    setReport(report => {
      if (!report) return report
      const id = report.id
      const date = report.date
      const items = report.items
      const isEdit = report.isEdit
      return { id, date, items, reviewedAt, isEdit }
    })
  }

  const switchIsEdit = () => {
    setReport(report => {
      if (!report) return report
      const id = report.id
      const date = report.date
      const items = report.items
      const reviewedAt = report.reviewedAt
      const isEdit = !report.isEdit
      return { id, date, items, reviewedAt, isEdit }
    })
  }


  const reportIsEdit = (() => {
    if (!report) return false
    return (report.reviewedAt || !report.isEdit) ? false : true
  })()

  return {
    report, setReport, reNew_report,
    addReportItem, changeReviewToChecked, switchIsEdit,
    reportIsEdit
  }
}


export { Class_reportItem, useReport }