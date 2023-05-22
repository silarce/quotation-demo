import { useState, } from "react"
import _ from "lodash"
import moment from "moment";

// type
import { TdailyReportItemDto, TemployeeDto, TuserDto } from "js/api/dtoTypes";
// api
import { TcreateDailyReportItemDto, TdailyReportDto, } from "js/api/api_dailyReport"

// option
import { optionsCreator_mealsCost } from "fakeDatabase/options/options";

// =================================================================

type ThookEmptyReport = {
  id: string | undefined
  date: string
  items: Class_reportItem[]
  isAllowToReview: boolean
  isReviewedByUser: boolean
  isEdit: boolean
  employeeId: string | undefined
}


const emptyReportItem: TcreateDailyReportItemDto = {
  periodOfDay: "AM",
  customerName: "",
  contactName: "",
  mealsCost: "breakfase",
  description: "",
  departureTime: "",
  arrivalTime: "",
  departureWorksiteTime: "",
  licensePlate: "",
  stayLength: "",
}

// =================================================================

/**不送dailyReportItem參數會自動送進emptyDailyReportItem */
class Class_reportItem {
  constructor(
    reRender: () => void,
    reportItem: TdailyReportItemDto | TcreateDailyReportItemDto = _.cloneDeep(emptyReportItem)
  ) {
    this._reRender = reRender
    this._item = reportItem
    // this._mealsCost = `${this._item.mealsCost}`


  } // constructor
  private _reRender
  private _item
  // private _mealsCost


  get id() {
    if ("id" in this._item) return this._item.id
    return undefined
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
    if ("order" in this._item) return this._item.order
    return undefined
  }

  get mealsCost() { return this._item.mealsCost }
  set mealsCost(v) {
    this._item.mealsCost = v as ("breakfase" | "lunch" | "dinner");
    this._reRender()
  }

  get description() {
    return this._item.description
  }
  set description(v: string) {
    this._item.description = v
    this._reRender()
  }

  get departureTime() { return this._item.departureTime }
  set departureTime(v) { this._item.departureTime; this._reRender() }

  get arrivalTime() { return this._item.arrivalTime }
  set arrivalTime(v) { this._item.arrivalTime; this._reRender() }

  get departureWorksiteTime() { return this._item.departureWorksiteTime }
  set departureWorksiteTime(v) { this._item.departureWorksiteTime; this._reRender() }

  get licensePlate() { return this._item.licensePlate }
  set licensePlate(v) { this._item.licensePlate; this._reRender() }

  get stayLength() { return this._item.stayLength }
  set stayLength(v) { this._item.stayLength; this._reRender() }






  get postBody(): TcreateDailyReportItemDto {
    const mealsCost = parseFloat(this.mealsCost) || 0
    return {
      periodOfDay: this.periodOfDay,
      customerName: this.customerName,
      contactName: this.contactName,
      mealsCost: this.mealsCost,
      description: this.description,
      departureTime: this.departureTime || "",
      arrivalTime: this.arrivalTime || "",
      departureWorksiteTime: this.departureWorksiteTime || "",
      licensePlate: this.licensePlate || "",
      stayLength: this.stayLength || "",
    }
  }

} // Class_dailyReportItem




const useReport = () => {

  const [render, setRender] = useState(1)
  const reRender = () => setRender(state => ++state)

  const [report, setReport] = useState<ThookEmptyReport>()
  const [reportTemp, setReportTemp] = useState<ThookEmptyReport>()

  const opitonArr_mealsCost = optionsCreator_mealsCost()
  // ------------------------------------------------------------------
  const emptyReportCre = (): ThookEmptyReport => ({
    id: undefined,
    date: moment().format("yyyy-MM-DD"),
    items: [new Class_reportItem(reRender)],
    isAllowToReview: false,
    isReviewedByUser: false,
    isEdit: false,
    employeeId: undefined
  })
  // 
  const reNew_report = (
    { dailyReport, userInfo }:
      {
        dailyReport?: TdailyReportDto,
        userInfo: TuserDto
      }
  ) => {
    if (!dailyReport) return setReport(emptyReportCre())

    let isAllowToReview: boolean = false
    const isReviewedByUser = dailyReport.reviewStatus.some((statu) => {
      const employeeId = statu.reviewerEmployee.id
      const reviewedAt = statu.reviewedAt
      if (employeeId === userInfo.employee?.id) {
        isAllowToReview = true
        return !!reviewedAt
      }
      return false
    })

    const theReport: ThookEmptyReport = {
      id: dailyReport.id,
      date: dailyReport.date,
      items: dailyReport.items.map((item) => new Class_reportItem(reRender, item)),
      isAllowToReview,
      isReviewedByUser,
      isEdit: false,
      employeeId: dailyReport.employee?.id
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
      const isAllowToReview = report.isAllowToReview
      const isReviewedByUser = report.isReviewedByUser
      const isEdit = report.isEdit
      const employeeId = report.employeeId
      items.push(new Class_reportItem(reRender))
      return { id, date, items, isAllowToReview, isReviewedByUser, isEdit, employeeId }
    })
  }
  // 
  const changeReviewToChecked = (isReviewedByUser: boolean) => {
    setReport(report => {
      if (!report) return report
      const id = report.id
      const date = report.date
      const items = report.items
      const isEdit = report.isEdit
      const isAllowToReview = report.isAllowToReview
      const employeeId = report.employeeId
      return { id, date, items, isReviewedByUser, isEdit, isAllowToReview, employeeId }
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
      const isAllowToReview = report.isAllowToReview
      const isReviewedByUser = report.isReviewedByUser
      const isEdit = !report.isEdit
      const employeeId = report.employeeId
      return { id, date, items, isAllowToReview, isReviewedByUser, isEdit, employeeId }
    })
  }
  // 
  const reportIsEdit = (() => {
    if (!report) return false
    return (report.isReviewedByUser || !report.isEdit) ? false : true
  })()
  // 
  return {
    report, setReport, reNew_report,
    addReportItem, changeReviewToChecked, switchIsEdit,
    reportIsEdit
  }
}


export { Class_reportItem, useReport }