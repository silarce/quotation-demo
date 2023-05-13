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
  mealsCost: "",
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



  } // constructor
  private _reRender
  private _item



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


  get mealsCost() { return this._item.mealsCost }
  set mealsCost(v) { this._item.mealsCost = v; this._reRender() }

  get description() {
    return this._item.description
  }
  set description(v: string) {
    this._item.description = v
    this._reRender()
  }

  get postBody(): TcreateDailyReportItemDto {
    return {
      periodOfDay: this.periodOfDay,
      customerName: this.customerName,
      contactName: this.contactName,
      mealsCost: this.mealsCost,
      description: this.description,
    }
  }

} // Class_dailyReportItem




const useReport = () => {

  const [render, setRender] = useState(1)
  const reRender = () => setRender(state => ++state)

  const [report, setReport] = useState<ThookEmptyReport>()
  const [reportTemp, setReportTemp] = useState<ThookEmptyReport>()
  // ------------------------------------------------------------------
  const emptyReportCre = (): ThookEmptyReport => ({
    id: undefined,
    date: moment().format("yyyy-MM-DD"),
    items: [new Class_reportItem(reRender)],
    reviewedAt: undefined,
    isEdit: false
  })
  // 
  const reNew_report = (
    { dailyReport }:
      {
        dailyReport?: TdailyReportDto,
      }
  ) => {
    if (!dailyReport) return setReport(emptyReportCre())
    const theReport: ThookEmptyReport = {
      id: dailyReport.id,
      date: dailyReport.date,
      items: dailyReport.items.map((item) => new Class_reportItem(reRender, item)),
      reviewedAt: dailyReport.reviewedAt,
      isEdit: false
    }
    setReport(theReport)
  }
  // 
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
  // 
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
  // 
  const switchIsEdit = () => {
    if (!report) return
    if (!report.isEdit) setReportTemp(_.cloneDeep(report))
    else {
      setReport(_.cloneDeep(reportTemp))
      setReportTemp(undefined)
      return;
    }

    setReport(report => {
      if (!report) return
      const id = report.id
      const date = report.date
      const items = report.items
      const reviewedAt = report.reviewedAt
      const isEdit = !report.isEdit
      return { id, date, items, reviewedAt, isEdit }
    })
  }
  // 
  const reportIsEdit = (() => {
    if (!report) return false
    return (report.reviewedAt || !report.isEdit) ? false : true
  })()
  // 
  return {
    report, setReport, reNew_report,
    addReportItem, changeReviewToChecked, switchIsEdit,
    reportIsEdit
  }
}


export { Class_reportItem, useReport }