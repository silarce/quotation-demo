import { useState, } from "react"
import _ from "lodash"
import moment from "moment";

// type
import { TdailyReportItemDto, TuserDto, TdailyReportWokerDto } from "js/api/dtoTypes";
// api
import { TcreateDailyReportItemDto, TdailyReportDto, } from "js/api/api_dailyReport"
// other
import { convertDate_add1911, convertDate_reduce1911 } from "js/utils/helpers/date/convertDate"

// =================================================================

type ThookEmptyReport = {
  id: string | undefined
  date: string
  items: Class_reportItem[]
  isAllowToReview: boolean
  isReviewedByOther: boolean
  isReviewedByUser: boolean
  isReviewCompleted: boolean
  isUserIsViewer: boolean
  isEdit: boolean
  employeeId: string | undefined
  employeeChName: string
}

// type TemptyReportItem = Omit<TdailyReportItemDto, "meals"> & { meals: TdailyReportItemDto["meals"] | "none" }
type TemptyReportItem = TdailyReportItemDto


const emptyReportItem: TemptyReportItem = {
  id: "",
  order: -1,
  createdAt: "",
  updatedAt: "",
  periodOfDay: "AM",
  customerName: "",
  contactName: "",
  meals: [],
  description: "",
  departureTime: null,
  arrivalTime: null,
  departureWorksiteTime: null,
  licensePlate: "",
  stayLength: null,
  workers: [],
  workOrderNumber: ""
}

// =================================================================

/**不送dailyReportItem參數會自動送進emptyDailyReportItem */
class Class_reportItem {
  constructor(
    reRender: () => void,
    reportItem: TemptyReportItem = _.cloneDeep(emptyReportItem)
  ) {
    this._reRender = reRender
    this._item = reportItem
    this._stayLength = `${this._item.stayLength}`
    this._workers = (reportItem.workers || []) as TdailyReportWokerDto[]
    this._meals = (reportItem.meals || []) as TdailyReportItemDto["meals"]
    // this._meals = ([]) as TdailyReportItemDto["meals"]

  } // constructor
  private _reRender
  private _item
  private _stayLength
  private _workers
  private _meals

  get id() {
    if ("id" in this._item) return this._item.id
    return undefined
  }

  get periodOfDay() {
    return this._item.periodOfDay
  }
  set periodOfDay(v) {
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

  get meals() { return this._meals }
  // set meals(v) {
  //   this._item.meals = v as ("breakfast" | "lunch" | "dinner");
  //   this._reRender()
  // }

  addMeals = (v: TdailyReportItemDto["meals"][number]) => {
    this._meals.push(v)
    this._reRender()
  }
  removeMeals = (index: number) => {
    this._meals?.splice(index, 1)
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
  set departureTime(v) { this._item.departureTime = v; this._reRender() }

  get arrivalTime() { return this._item.arrivalTime }
  set arrivalTime(v) { this._item.arrivalTime = v; this._reRender() }

  get departureWorksiteTime() { return this._item.departureWorksiteTime }
  set departureWorksiteTime(v) {
    this._item.departureWorksiteTime = v;
    this._reRender()
  }

  get licensePlate() { return this._item.licensePlate }
  set licensePlate(v) { this._item.licensePlate = v; this._reRender() }

  get stayLength() {
    return this._stayLength
  }
  set stayLength(v) {
    this._stayLength = v
    this._item.stayLength = parseInt(v);
    this._reRender()
  }

  get dispatchOrderId() { return this._item.workOrderNumber }
  set dispatchOrderId(v) { this._item.workOrderNumber = v; this._reRender() }


  get workers() { return this._workers }
  addWorker = (v: TdailyReportWokerDto) => {
    this._workers.push(v)
    this._reRender()
  }
  removeWorker = (index: number) => {
    this._workers?.splice(index, 1)
    this._reRender()
  }

  get postBody(): TcreateDailyReportItemDto {
    const workerIdArr = (() => {
      const idArr = this.workers.map((worker) => {
        return worker.id
      })
      if (idArr.length === 0) return []
      return idArr
    })()

    const meals = (() => {
      if (this._meals.length === 0) return []
      else return this._meals
    })()

    return {
      periodOfDay: this.periodOfDay || "AM",
      customerName: this.customerName,
      contactName: this.contactName,
      // meals,
      meals,
      description: this.description,
      departureTime: this.departureTime || null,
      arrivalTime: this.arrivalTime || null,
      departureWorksiteTime: this.departureWorksiteTime || null,
      licensePlate: this.licensePlate || "",
      stayLength: this._item.stayLength || 0,
      workerIds: workerIdArr,
      workOrderNumber: this.dispatchOrderId ?? "",
      // test
      // periodOfDay: "AM",
      // customerName: "",
      // contactName: "",
      // meals: null,
      // description: "",
      // departureTime: null,
      // arrivalTime: null,
      // departureWorksiteTime: null,
      // licensePlate: "",
      // stayLength: 0,
      // workerIds: null,
      // workOrderNumber: "",
      // 
    }
  }

} // Class_dailyReportItem


const useReport = (
  { userInfo }:
    { userInfo: TuserDto }
) => {

  const [render, setRender] = useState(1)
  const reRender = () => setRender(state => ++state)

  const [report, setReport] = useState<ThookEmptyReport>()
  const [reportTemp, setReportTemp] = useState<ThookEmptyReport>()

  // ------------------------------------------------------------------
  const emptyReportCre = (): ThookEmptyReport => ({
    id: undefined,
    // date: moment().format("yyyy-MM-DD"),
    date: convertDate_reduce1911(moment().format("yyyy-MM-DD")),
    items: [new Class_reportItem(reRender)],
    isAllowToReview: false,
    isReviewedByOther: false,
    isReviewedByUser: false,
    isReviewCompleted: false,
    isUserIsViewer: false,
    isEdit: false,
    employeeId: undefined,
    employeeChName: userInfo.employee?.chName || ""
  }) // emptyReportCre
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
    let isReviewedByUser: boolean = false
    let isUserIsViewer: boolean = false

    const isReviewedByOther = dailyReport.reviewStatus.some((statu) => {
      const statuType = statu.type
      const reviewerId = statu.reviewerEmployee?.id ?? null
      const reviewedAt = statu.reviewedAt
      if (reviewerId === userInfo.employee?.id) {
        isAllowToReview = true
        if (statuType === "examiner") isUserIsViewer = true
        if (reviewedAt) isReviewedByUser = true
      }
      return !!reviewedAt
    })

    const theReport: ThookEmptyReport = {
      id: dailyReport.id,
      date: convertDate_reduce1911(dailyReport.date),
      items: dailyReport.items.map((item) => new Class_reportItem(reRender, item)),
      isAllowToReview,
      isReviewedByOther: isReviewedByOther,
      isReviewedByUser,
      isReviewCompleted: dailyReport.isReviewCompleted,
      isUserIsViewer,
      isEdit: false,
      employeeId: dailyReport.employee?.id,
      employeeChName: dailyReport.employee?.chName,
    }
    setReport(theReport)
  } // reNew_report
  // 
  const addReportItem = () => {
    setReport(report => {
      if (!report) return report
      const items = report.items
      items.push(new Class_reportItem(reRender))
      return { ...report }
    })
  }
  const removeReportItem = (index: number) => {
    setReport(report => {
      if (!report) return report
      const items = report.items
      items.splice(index, 1)
      return { ...report }
    })
  }
  // 
  const changeReviewToChecked = (isReviewedByOther: boolean) => {
    setReport(report => {
      if (!report) return report
      const isReviewedByUser = true
      return { ...report, isReviewedByOther, isReviewedByUser, }
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
      const isEdit = !report.isEdit
      return { ...report, isEdit, }
    })
  }
  // 
  const changeReportDate = (v: string) => {
    setReport(report => {
      if (!report) return report
      report.date = v
      return { ...report }
    })
  }
  // 
  const reportIsEdit = (() => {
    if (!report) return false
    return (report.isReviewedByOther || !report.isEdit) ? false : true
  })()
  // 
  // 
  return {
    report, setReport, reNew_report,
    addReportItem, removeReportItem, changeReviewToChecked, switchIsEdit,
    changeReportDate,
    reportIsEdit
  }
}

export type { ThookEmptyReport }
export { Class_reportItem, useReport }