import { useState, useEffect, useMemo } from "react"
import classNames from "classnames"
import _ from "lodash"
import moment from "moment";
import { AxiosError } from "axios";

// layer
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import SubLayer from "components/Layer/SubLayer/SubLayer"

// antd
import { Badge } from 'antd';

// component
// import TheCalendar from "components/page/home/dailyReport/TheCalendar"
import ReporterList from "components/page/home/dailyReport/ReporterList";
import SetReportEmpModal from "components/page/home/dailyReport/SetReportEmpModal"
import ReportTable from "components/page/home/dailyReport/ReportTable"
import TagCarousel from "components/page/home/dailyReport/TagCarousel"
// gear
import CheckButton from "components/global/gear/button/checkButton"
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01";
import myAlert from "components/global/gear/modal/simpleModal/alertModals"


// hook
import { Class_reportItem, useReport } from "hooks/home/useDailyReport";

import { yearConversion_chToStandard } from "js/tools/date/yearConversion_chToStandard";

// api
import {
  // TcreateDailyReportItemDto,
  // TdailyReportDto,
  useApiDailyReports,
  // useApiDailyReports_Reporters,
  // useApiDailyReports_isReporters_me,
  // useApiDailyReports_my,
  // useApiDailyReports_id,
  useApiDailyReports_reviewers,
  // apiPatchDailyReports_Reporters,
  apiPatchDailyReports_my,
  apiDailyReports_id,
  apiDailyReports_review,
  apiDailyReports_my,
  apiPatchDailyReports_reviewers,
  apiIsReviewer,
} from "js/api/api_dailyReport"

import {
  TemployeeDto,
  useEmployee
} from "js/api/api_employee"

// type
import { TuserDto, TdailyReportItemDto, TerpFeatureDto } from "js/api/dtoTypes";
import { TdoSearch, Toption } from "components/global/gear/HOC/searchBar/searchBar";

// css
import scss from "./dailyReport.module.scss"

// =====================================================================
export type Ttag = { reportId: string, employeeId: string, name: string, date: string }
export { Class_reportItem }
// =====================================================================

const reportedAtOptions = [
  { label: "全部", value: "全部" },
  { label: "未審核", value: "未審核" },
  { label: "已審核", value: "已審核" },
]

// =====================================================================
export default function DailyReport({ userInfo, }: { userInfo: TuserDto }) {
  const [isLoading, setIsLoading] = useState(false)
  // -----------------------------------------------------------
  /**權限 */
  const [identity, setIdentity] = useState<"manager" | "reviewer" | "reporter">()

  useEffect(() => {
    (async () => {
      const isSubordinate = checkIsSubordinate(userInfo)
      if (!isSubordinate) return setIdentity("manager")
      const isReviewer = await apiIsReviewer()
      if (isReviewer.isReviewer) return setIdentity("reviewer")
      return setIdentity("reporter")
    })()
  }, [userInfo])

  // -----------------------------------------------------------
  // state
  // 送進 審核人員設定 SetReportEmpModal的arr
  const [reviewersPickArr, setReviewersPickArr] =
    useState<Parameters<typeof SetReportEmpModal>[0]["dataArr"]>()

  // 送進 選擇審核人員 SetReportEmpModal的arr
  const [reviewerArr, setReviewerArr] =
    useState<Parameters<typeof SetReportEmpModal>[0]["dataArr"]>()

  // 日報表tagArr，送進TagCarousel
  const [tagArr, setTagArr] = useState<Ttag[]>([])

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // const today = moment().format("YYYY-MM-DD");
  // const thisMonth = moment().format("YYYY-MM");

  // 取得指定月份所有日報表

  const [params, setParams] = useState<{ filter?: { [key: string]: any } }>({ filter: undefined })


  const {
    dailyReport, updateDailyReports, } = useApiDailyReports(params)
  const sortedDailyReport = useMemo(() => {
    return _.sortBy(dailyReport, "date").reverse()
  }, [dailyReport])

  /**取得指定月份所有日報表，額外做了loading的處理 */
  const updateDailyReports_withLoading = async () => {
    try {
      showRootLoading(false)
      setIsLoading(true)
      await updateDailyReports()
    }
    catch { myAlert.warning({ title: "取得總日報表失敗" }) }
    finally { setIsLoading(false) }
  }


  // 取得所有審核人員
  const { reviewersArr, updateReviewerssArr: updateReviewersArr } = useApiDailyReports_reviewers()

  const { data: employeeRes, update: updateEmployeeArr }
    = useEmployee({ pageSize: 999999, populate: ["jobs"] })
  const employeeArr = employeeRes?.data

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        await updateDailyReports() // 取得指定月份所有日報表 //基本上就是當月
      }
      catch { myAlert.err({ title: "取得總日報失敗" }) }
      finally { setIsLoading(false) }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // 編輯中的日報表，送進ReportTable
  const {
    report: reportInEdit,
    setReport,
    reNew_report,
    addReportItem: addDailyReportItem,
    changeReviewToChecked, switchIsEdit,
    reportIsEdit: isReportEdit
  } = useReport()

  const editReport = async (reportId: string) => {
    const dailyReport = await reqApiDailyReports_id(reportId)
    if (!dailyReport) return
    reNew_report({ dailyReport, userInfo })
  }

  const editReport_today = async () => {
    const res = await reqApiDailyReports_my()
    if (res === "fail") return
    else reNew_report({ dailyReport: res, userInfo })

    if (res && userInfo?.employee?.id) {
      const tag = {
        reportId: res.id,
        employeeId: userInfo.employee.id,
        name: userInfo.employee.chName,
        date: res.date
      }
      if (tagArr.some(theTag => theTag.reportId === tag.reportId)) return
      setTagArr(arr => {
        const newArr = _.cloneDeep(arr);
        newArr.push(tag);
        return newArr
      })
    }
  }

  const cancelEditNewDailyReport = () => {
    setReport(undefined)
  }

  // ----------------------------------------------------------------------
  // TagCarousel
  const addTag = async (tag: Ttag) => {
    if (identity === "reporter") {
      if (userInfo.employee?.id !== tag.employeeId)
        return myAlert.warning({ title: "只能編輯自己的日報表" })
    }
    await editReport(tag.reportId)
    if (tagArr.some(theTag => theTag.reportId === tag.reportId)) return
    setTagArr(arr => {
      const newArr = _.cloneDeep(arr);
      newArr.push(tag);
      return newArr
    })
  }
  const removeTag = (index: number, tagReportId: string) => {
    setTagArr(arr => {
      const newArr = _.cloneDeep(arr);
      newArr.splice(index, 1);
      return newArr
    })
    if (tagReportId === reportInEdit?.id) cancelEditNewDailyReport()
  }

  // ----------------------------------------------------------------------
  // 審核人員設定
  // SetReportEmpModal

  // 搜尋功能寫在SetReportEmpModal裡面，不經由後端，在前端直接過濾
  //**開啟回報人員設定面板 */
  const editRivewerPickArr = async () => {

    const resArr = await Promise.all([
      updateReviewersArr(), // 取得所有審核人員
      updateEmployeeArr() // 取得所有人員
    ])

    const reviewersArr = resArr[0]
    const employeeArr = resArr[1].data
    const reviewersPickArr = formatRiewerPickArr(
      {
        dailyReports_ReportersArr: reviewersArr,
        employeeArr
      }
    )

    setReviewersPickArr(reviewersPickArr)

  }
  /**發出設定審核人員apiReq */
  const reqApiPatchDailyReports_viewers = async (employeeArr: Parameters<typeof SetReportEmpModal>[0]["dataArr"]) => {
    const employeeIds: string[] = []
    employeeArr.forEach((employee) => {
      if (employee.shouldReport) employeeIds.push(employee.id)
    })
    try {
      showRootLoading(true)
      await apiPatchDailyReports_reviewers({ employeeIds })
      cancelSetReportEmpModal()
      myAlert.success({ title: "更新回報人員成功" })
      try {
        await Promise.all([
          updateDailyReports_withLoading(),
          updateReviewersArr(),
        ])
      }
      catch { myAlert.err({ title: "日報表或回報人員取得失敗" }) }
    }
    catch {
      myAlert.err({ title: "更新回報人員失敗" })
    }
    finally { showRootLoading(false) }
  }
  /**關閉回報人員設定面板 */
  const cancelSetReportEmpModal = () => {
    setReviewersPickArr(undefined)
  }

  // ----------------------------------------------------------------------
  // 更新日報表
  // 搜尋功能寫在SetReportEmpModal裡面，不經由後端，在前端直接過濾

  //**開啟審核人員選擇面板 */
  const choseReviewerArr = async () => {
    const reviewerArr = await updateReviewersArr()
    const formetedViewerArr = formatEmployeeArr({ employeeArr: reviewerArr })
    setReviewerArr(formetedViewerArr)
  }
  const cancelReviewerArr = () => {
    setReviewerArr(undefined)
  }
  /**發出更新日報表請求 */
  const reqApiPatchDailyReports_my = async (employeeArr: Parameters<typeof SetReportEmpModal>[0]["dataArr"]) => {

    const employeeIds: string[] = []
    employeeArr.forEach((employee) => {
      if (employee.shouldReport) employeeIds.push(employee.id)
    })
    if (!reportInEdit) return

    const items = reportInEdit.items.map((item) => item.postBody)
    try {
      showRootLoading(true)
      // await apiPatchDailyReports_my({ date, items })
      await apiPatchDailyReports_my({
        date: reportInEdit.date,
        body: {
          reviewerIds: employeeIds,
          items
        }
      })
      cancelEditNewDailyReport()
      myAlert.success({ title: "更新日報表完成" })
      await updateDailyReports_withLoading()
    }
    catch { myAlert.err({ title: "更新日報表失敗" }) }
    finally { showRootLoading(false) }
    cancelReviewerArr()
  }

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  const searchTargetList = (() => {
    const arr = [
      { options: reportedAtOptions, width: "110px" },
      { placeholder: "搜尋日期", width: "150px" }
    ]
    if (identity === "reporter") arr.shift()
    return arr
  })()

  const doSearch: TdoSearch = (arr) => {

    const reviewedAtValue = (arr[0] as Toption).value
    const reviewedAt = (() => {
      if (reviewedAtValue === "全部") return undefined
      if (reviewedAtValue === "未審核") return { $null: true }
      if (reviewedAtValue === "已審核") return { $notNull: true }
    })()

    const date = (() => {
      const theDate = arr[1] as string
      if (!theDate) return undefined
      const date = yearConversion_chToStandard(theDate)
      if (!date) return "wrongDate"
      return date
    })()

    if (date === "wrongDate")
      return myAlert.warning({ title: "時間格式錯誤", content: "時間格式例:101-01-01" })

    setParams({
      filter: {
        reviewedAt,
        date: { $eq: date }
      }
    })
  }

  const searchGroup = {
    searchTargetList,
    doSearch
  }

  // --------------------
  /**manager 審核人員設定 */
  const panelList_manager_notInEdit: TpanelList = [
    { searchGroup },
    {
      type: "myButton",
      label: "審核人員設定",
      onClick: editRivewerPickArr
    }
  ]

  /**reporter 今日回報 */
  const panelList_reporter_notInEdit: TpanelList = [
    { searchGroup },
    {
      type: "myButton",
      label: "今日回報",
      onClick: editReport_today
    }
  ]
  /**reviewer 已讀/未讀 */
  const panelList_reviewer_inEdit: TpanelList = [
    {
      custom: <CheckButton
        checkLabel="已讀"
        uncheckLable="未讀"
        value={!!reportInEdit?.isReviewedByUser}
        onClick={async () => {
          if (reportInEdit?.isReviewedByUser) {
            return myAlert.warning({ title: "已審核過" })
          }
          if (!reportInEdit?.id) return;
          try {
            showRootLoading(true)
            const res = await apiDailyReports_review(reportInEdit.id)
            changeReviewToChecked(!!res)
            showRootLoading(false)
            await updateDailyReports_withLoading()
          }
          catch { myAlert.err({ title: "審核失敗" }) }
          finally { showRootLoading(false) }
        }}
      />
    }
  ]

  /**reporter 編輯 */
  const panelList_reporter_inEdit01: TpanelList = [
    // {
    //   custom: <Badge
    //     className={scss.antdBadge01}
    //     color="auto"
    //     text="未讀" />
    // },
    {
      type: "myButton",
      label: "編輯",
      onClick: switchIsEdit
    }
  ]

  /**reporter 上傳 取消 */
  const panelList_reporter_inEdit02: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: choseReviewerArr,
    },
    {
      type: "myButton",
      label: "取消",
      onClick: switchIsEdit,
    },
  ]

  // const panelList_reporter_reviewed: TpanelList = [
  //   {
  //     custom: <Badge
  //       className={scss.antdBadge02}
  //       color="auto"
  //       text="總經理已閱讀" />
  //   },
  // ]

  const panelList = (() => {

    if (identity === "manager") {
      if (!reportInEdit) return panelList_manager_notInEdit
      else return panelList_reviewer_inEdit
    }

    if (identity === "reviewer") {
      if (!reportInEdit) return panelList_reporter_notInEdit
      else {
        if (!reportInEdit?.employeeId || reportInEdit?.employeeId === userInfo?.employee?.id) {
          if (isReportEdit) return panelList_reporter_inEdit02
          return panelList_reporter_inEdit01
        }
        else return panelList_reviewer_inEdit
      }
    }

    if (identity === "reporter") {
      if (!reportInEdit) return panelList_reporter_notInEdit
      else {
        // if (reportInEdit.isReviewCompleted) return panelList_reporter_reviewed
        if (isReportEdit) return panelList_reporter_inEdit02
        return panelList_reporter_inEdit01
      }
    }
    return []
  })()


  // ----------------------------------------------------------------------
  const customeLeft =
    [
      <TagCarousel key="1"
        tagArr={tagArr}
        editReport={editReport}
        removeTag={removeTag}
        activeId={reportInEdit?.id ?? ""}
      />
    ]
  // ----------------------------------------------------------------------
  const leftTagOnClick = () => {
    cancelEditNewDailyReport()
  }
  // ----------------------------------------------------------------------
  return (
    <>
      <SubLayer bodyClassName={classNames(scss.subLayer, scss.plus)}
        containerChildren={<LoadingCover01 isLoading={isLoading} />}
      >
        <PageHeader02
          tag="日報表"
          tagClassName={classNames(scss.pageHeaderTag, scss.plus, scss.pplus)}
          tagOnClick={leftTagOnClick}
          panelList={panelList}
          customeLeft={customeLeft}
        />

        {!reportInEdit &&
          <ReporterList
            dailyReportArr={sortedDailyReport ?? []}
            addTag={addTag}
          />
        }

        {reportInEdit &&
          <ReportTable
            classDailyReportItemArr={reportInEdit.items}
            addDailyReportItem={addDailyReportItem}
            isEdit={isReportEdit}
          />
        }
      </SubLayer>

      <SetReportEmpModal
        visible={!!reviewersPickArr}
        onConfirm={reqApiPatchDailyReports_viewers}
        onCancel={cancelSetReportEmpModal}
        dataArr={reviewersPickArr ?? []}
        label="審核人員設定"
        tip="可複選"
      />

      <SetReportEmpModal
        visible={!!reviewerArr}
        onConfirm={reqApiPatchDailyReports_my}
        onCancel={cancelReviewerArr}
        dataArr={reviewerArr ?? []}
        label="選擇審核人員"
        tip="可複選"
      />
    </>
  )
}


// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
const reqApiDailyReports_id = async (reportId: string) => {
  try {
    showRootLoading(true)
    const res = await apiDailyReports_id(reportId)
    return res
  }
  catch {
    myAlert.err({ title: "取得日報表失敗" })
  }
  finally { showRootLoading(false) }
}

const reqApiDailyReports_my = async (
  param?: {
    /**YYYY-MM-DD */
    date?: string
  }
) => {

  const date = (() => {
    const today = moment().format("YYYY-MM-DD");
    if (!param?.date) return today
    else return moment(param.date).format("YYYY-MM-DD");
  })()

  try {
    showRootLoading(true)
    const res = await apiDailyReports_my(date)
    return res
  }
  catch (error) {
    const err = error as AxiosError<{
      error: string
      message: string
      statusCode: number
    }>
    const { message, statusCode } = err.response?.data ?? {}
    // 
    if (statusCode === 404) return
    myAlert.err({ title: "取得指定日期日報表失敗" })
    return "fail"
  }
  finally { showRootLoading(false) }
}

// ==========================================================================
/**判斷是否為回報人員權限 */
const checkIsSubordinate = (userInfo: TuserDto) => {
  /**如果使用者是employee，從grade判斷 */
  if (userInfo?.employee?.jobs) {
    const jobs = userInfo.employee.jobs
    if (!jobs[0]) return true

    const jobsCopy = _.sortBy(jobs, "grade").reverse()
    if (jobsCopy[0].grade >= 14) return false
    else return true
  }
  /**使用者不是employee，那就是admin*/
  return false
}


// ==========================================================================

/** 將員工列表變成可以被SetReportEmpModal使用的樣子*/
const formatRiewerPickArr = (
  { dailyReports_ReportersArr,
    employeeArr }:
    {
      dailyReports_ReportersArr: TemployeeDto[]
      employeeArr: TemployeeDto[] | undefined
    }
) => {
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
}

/** 將員工列表變成可以被SetReportEmpModal使用的樣子*/
const formatEmployeeArr = (
  { employeeArr }:
    {
      employeeArr: TemployeeDto[] | undefined
    }
) => {
  if (!employeeArr) return []

  const result = employeeArr.map((item) => {
    const shouldReport = false
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
}









// ========================================================================
/**
待辦事項

等新的api出來後會做其他優化
1.總表會改成分頁取得，滾輪滑到底後會自動取得下一頁然後接在底下
  或是要做成分頁?
  前者我直有做一次的經驗，應該會需要幾個小時研究
 */

