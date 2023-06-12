import { useState, useEffect, useMemo, createContext } from "react"
import classNames from "classnames"
import _ from "lodash"
import moment from "moment";
import { AxiosError } from "axios";
import { useRouter } from "next/router";

// layer
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import PageHeader_mobile_dailyReport from "pages/home/dailyReport/pageHeader_mobile/PageHeader_mobile_dailyReport";
import SubLayer from "components/Layer/SubLayer/SubLayer"

// component
import TheCalendar from "components/page/home/dailyReport/TheCalendar"
import ReporterList from "components/page/home/dailyReport/ReporterList";
import SetReportEmpModal from "components/page/home/dailyReport/SetReportEmpModal"
import ReviewerAndExaminerSelector from "components/page/home/dailyReport/ReviewerAndExaminerSelector"
import ReportTable from "components/page/home/dailyReport/ReportTable"
import TagCarousel from "components/page/home/dailyReport/TagCarousel"

// mobile
import SearchDrawer from "components/page/home/dailyReport/SearchDrawer";
import DailyReportTablePanel_mobile from "components/page/home/dailyReport/DailyReportTablePanel_mobile"

// gear
import CheckButton from "components/global/gear/button/checkButton"
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01";
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// antd
import { Badge } from "antd"

// hook
import { Class_reportItem, useReport, ThookEmptyReport } from "hooks/home/useDailyReport";

// tool
import { yearConversion_chToStandard } from "js/tools/date/yearConversion_chToStandard";
import { convertDate_add1911, convertDate_reduce1911 } from "js/utils/helpers/date/convertDate";

// icon
import iconFourCube from "public/image/icon/fourCube.svg"
import iconMenu from "public/image/icon/menu.svg"
// api
import {
  useApiDailyReports,
  useApiDailyReports_reviewers,
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
import { TuserDto, } from "js/api/dtoTypes";
import { TdoSearch, Toption } from "components/global/gear/HOC/searchBar/searchBar";

// css
import scss from "./dailyReport.module.scss"

// =====================================================================
export type Ttag = { reportId: string, employeeId: string, name: string, date: string }
export { Class_reportItem }
// =====================================================================

const reportedAtOptions = [
  { label: "全部", value: "全部" },
  { label: "未檢視", value: "未檢視" },
  { label: "已檢視", value: "已檢視" },
]

// =====================================================================
type TdailyReportContext = {
  // doShowDrawer: () => void
  // editReport_today: () => void
  reportInEdit: ThookEmptyReport | undefined
  isReportEdit: boolean
  switchIsEdit: () => void
  setShowReviewerForReportModal: (v: boolean) => void
  cancelEditNewDailyReport: () => void
  changeReportDate: (v: string) => void
  identity: "manager" | "reviewer" | "reporter" | undefined
  // editRivewerPickArr: () => void
  doCheck: () => void,
  userInfo: TuserDto
}



export const DailyReportContext = createContext<TdailyReportContext>(null!)


// =====================================================================
export default function DailyReport({ userInfo, }: { userInfo: TuserDto }) {
  const userId = userInfo.employee?.id ?? ""
  const router = useRouter()
  const isMine = router.query.isMine === undefined ? true
    : router.query.isMine === "true" ? true : false
  const isCalendar = router.query.isCalendar === "true" ? true : false

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
  // 送進 檢視人員設定 SetReportEmpModal的arr
  const [reviewersPickArr, setReviewersPickArr] =
    useState<Parameters<typeof SetReportEmpModal>[0]["dataArr"]>()

  // 每個日報上傳前要選reviewer，這是那個modal的開關
  const [showReviewerForReportModal, setShowReviewerForReportModal] = useState(false)


  // 日報表tagArr，送進TagCarousel
  const [tagArr, setTagArr] = useState<Ttag[]>([])

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  const [searchObj, setSearchObj] = useState<{
    isUserReviewed: boolean | undefined
    date: string | undefined
  }>()

  const filterIsMine = (() => {
    if (isMine) return { $eq: userId }
    if (!isMine) return { $ne: userId }
    return undefined
  })()

  const params = (() => {

    let userId = userInfo.employee?.id
    let isUserReviewed
    let isReviewCompleted
    if (searchObj?.isUserReviewed === undefined) {
      isUserReviewed = undefined
      isReviewCompleted = undefined
    }
    if (searchObj?.isUserReviewed === true) {
      isUserReviewed = { $notNull: true }
      isReviewCompleted = true
    }
    if (searchObj?.isUserReviewed === false) {
      isUserReviewed = { $null: true }
      isReviewCompleted = false
    }

    if (isMine) {
      userId = undefined
      isUserReviewed = undefined
    }
    else {
      isReviewCompleted = undefined
    }

    return {
      filter: {
        "employee.id": filterIsMine,
        "$and": {
          "reviewStatus.reviewedAt": isUserReviewed,
          "reviewStatus.reviewerEmployee.id": { $eq: userId },
        },
        "isReviewCompleted": { $eq: isReviewCompleted },
        date: { $eq: searchObj?.date },
      },
    }
  })()


  const { dailyReport, updateDailyReports } = useApiDailyReports(params)
  const { sortedDailyReport, reportDateArr } = useMemo(() => {
    const sortedDailyReport = _.sortBy(dailyReport, "date").reverse()
    const reportDateArr = (() => {
      if (!isMine) return []
      const arr = dailyReport?.map((report) => convertDate_reduce1911(report.date)) ?? []
      return arr
    })()
    return { sortedDailyReport, reportDateArr }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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


  // 取得所有檢視人員
  const { updateReviewersArr: updateReviewersArr } = useApiDailyReports_reviewers()

  const { update: updateEmployeeArr }
    = useEmployee({
      pageSize: 999999, populate: ["jobs", "user"],
      sort: "idNumber",
    })

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (!router.isReady) return
    cancelEditNewDailyReport();
    (async () => {
      try {
        setIsLoading(true)
        await updateDailyReports() // 取得指定月份所有日報表 //基本上就是當月
      }
      catch { myAlert.err({ title: "取得總日報失敗" }) }
      finally { setIsLoading(false) }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchObj])

  useEffect(() => {
    setSearchObj({
      isUserReviewed: undefined,
      date: undefined,
    })
  }, [isMine])

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // 編輯中的日報表，送進ReportTable
  const {
    report: reportInEdit,
    setReport,
    reNew_report,
    addReportItem: addDailyReportItem,
    removeReportItem: removeDailyReportItem,
    changeReviewToChecked, switchIsEdit,
    reportIsEdit: isReportEdit,
    changeReportDate
  } = useReport({ userInfo })

  const editReport = async (reportId: string) => {
    const dailyReport = await reqApiDailyReports_id(reportId)
    if (!dailyReport) return
    reNew_report({ dailyReport, userInfo })
  }

  const editReport_today = async () => {
    // const res = await reqApiDailyReports_my()
    // if (res === "fail") return
    // else reNew_report({ dailyReport: res, userInfo })

    // if (res && userInfo?.employee?.id) {
    //   const tag = {
    //     reportId: res.id,
    //     employeeId: userInfo.employee.id,
    //     name: userInfo.employee.chName,
    //     date: res.date
    //   }
    //   if (tagArr.some(theTag => theTag.reportId === tag.reportId)) return
    //   setTagArr(arr => {
    //     const newArr = _.cloneDeep(arr);
    //     newArr.push(tag);
    //     return newArr
    //   })
    // }
    reNew_report({ dailyReport: undefined, userInfo })

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
  // 檢視人員設定
  // SetReportEmpModal

  // 搜尋功能寫在SetReportEmpModal裡面，不經由後端，在前端直接過濾
  //**開啟回報人員設定面板 */
  const editRivewerPickArr = async () => {

    const resArr = await Promise.all([
      updateReviewersArr(), // 取得所有檢視人員
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
  /**發出設定檢視人員apiReq */
  const reqApiPatchDailyReports_viewers = async (employeeArr: Parameters<typeof SetReportEmpModal>[0]["dataArr"]) => {

    const shouldReportEmpArr: typeof employeeArr = []
    employeeArr.forEach((employee) => {
      if (employee.shouldReport) shouldReportEmpArr.push(employee)
    })

    const isPass = !shouldReportEmpArr.some(emp => emp.isHaveUser === false)
    if (!isPass) return myAlert.warning({ title: "名單錯誤", content: "只能選擇有ERP操作權限的人員" })

    const employeeIds = shouldReportEmpArr.map(emp => emp.id)

    try {
      showRootLoading(true)
      await apiPatchDailyReports_reviewers({ employeeIds })
      cancelSetRivewerModal()
      myAlert.success({ title: "更新檢視人員成功" })
      try {
        await Promise.all([
          updateDailyReports_withLoading(),
          updateReviewersArr(),
        ])
      }
      catch { myAlert.err({ title: "日報表或檢視人員取得失敗" }) }
    }
    catch {
      myAlert.err({ title: "更新檢視人員失敗" })
    }
    finally { showRootLoading(false) }
  }
  /**關閉回報人員設定面板 */
  const cancelSetRivewerModal = () => {
    setReviewersPickArr(undefined)
  }

  // ----------------------------------------------------------------------
  // 更新日報表

  /**發出更新日報表請求 */
  const reqApiPatchDailyReports_my = async (
    reviewerArr: TemployeeDto[],
    examinerArr: TemployeeDto[],
  ) => {

    if (!reportInEdit) return
    if (reviewerArr.length === 0) {
      return myAlert.warning({ title: "請選擇檢視人員" })
    }
    const reviewerIds = reviewerArr.map((emp) => emp.id)
    const examinerIds = examinerArr.map((emp) => emp.id)

    const theDate = convertDate_add1911(reportInEdit.date)

    const items = reportInEdit.items.map((item) => {
      const year = new Date(theDate).getFullYear()
      const month = new Date(theDate).getMonth()
      const th = new Date(theDate).getDate()

      const setDateToReportDate = (dateStr: string) => {
        const date = new Date(dateStr)
        date.setFullYear(year)
        date.setMonth(month)
        date.setDate(th)
        return date.toISOString()
      }
      const postBody = item.postBody
      postBody.arrivalTime = setDateToReportDate(postBody.arrivalTime!)
      postBody.departureTime = setDateToReportDate(postBody.departureTime!)
      postBody.departureWorksiteTime = setDateToReportDate(postBody.departureWorksiteTime!)
      return postBody
    })

    try {
      showRootLoading(true)
      await apiPatchDailyReports_my({
        // date: reportInEdit.date,
        date: theDate,
        body: {
          reviewerIds,
          examinerIds,
          items
        }
      })
      cancelEditNewDailyReport()
      myAlert.success({ title: "更新日報表完成" })
      await updateDailyReports_withLoading()
    }
    catch (error) {

      const err = error as AxiosError<{
        error: string
        message: string
        statusCode: number
      }>
      const { message, statusCode } = err.response?.data ?? {}

      const isReviewed = message?.includes("has already reviewed")
      if (isReviewed) return myAlert.warning({ title: "更新日報表失敗", content: "該日報表已被檢視，不能再變更" })

      myAlert.err({ title: "更新日報表失敗" })
    }
    finally { showRootLoading(false) }
    setShowReviewerForReportModal(false)
  }

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  const searchTargetList = (() => {
    const arr = [
      { options: reportedAtOptions, width: "110px" },
      { placeholder: "搜尋日期", width: "80px" }
    ]
    return arr
  })()

  const doSearch: TdoSearch = (arr) => {

    const reviewedAtValue = (arr[0] as Toption).value
    const isUserReviewed = (() => {
      if (reviewedAtValue === "全部") return undefined
      if (reviewedAtValue === "未檢視") return false
      if (reviewedAtValue === "已檢視") return true
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
    setSearchObj({
      isUserReviewed,
      date
    })
  }
  const searchGroup = {
    searchTargetList,
    doSearch
  }

  // --------------------
  const listSwitchButton: TpanelList[number] = {
    type: "myButton",
    label: isCalendar ? "列表" : "月曆",
    onClick: () => {
      router.push({
        query: {
          ...router.query,
          isCalendar: isCalendar ? "false" : "true"
        }
      })
    },
    img: isCalendar ? iconMenu.src : iconFourCube.src
  }
  // --------------------
  /**manager 檢視人員設定 */
  const panelList_manager_notInEdit: TpanelList = [
    { searchGroup },
    {
      type: "myButton",
      label: "檢視人員設定",
      onClick: editRivewerPickArr
    },
    listSwitchButton
  ]

  /**reporter 新增回報 */
  const panelList_reporter_notInEdit: TpanelList = [
    { searchGroup },
    {
      type: "myButton",
      label: "新增回報",
      onClick: editReport_today
    },
    listSwitchButton
  ]
  // ---
  const doCheck = async () => {

    if (reportInEdit?.isReviewedByUser === true) {
      return myAlert.warning({ title: "已檢視過" })
    }
    if (!reportInEdit?.id) return;
    try {
      showRootLoading(true)
      const res = await apiDailyReports_review(reportInEdit.id)
      changeReviewToChecked(!!res)
      showRootLoading(false)
      await updateDailyReports_withLoading()
    }
    catch (error) {
      const err = error as AxiosError<{
        error: string
        message: string
        statusCode: number
      }>
      const { message, statusCode } = err.response?.data ?? {}
      if (statusCode === 403) return myAlert.warning({ title: "您沒有權限檢視該日報表" })
      myAlert.err({ title: "檢視失敗" })
    }
    finally { showRootLoading(false) }
  }

  /**reviewer 已讀/未讀 isReviewedByUser */
  const panelList_reviewer_inEdit_user: TpanelList = [
    {
      custom: <CheckButton
        // checkLabel="已讀"
        checkLabel="已讀"
        uncheckLable="未讀"
        value={!!reportInEdit?.isReviewedByUser}
        onClick={doCheck}
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
      onClick: () => setShowReviewerForReportModal(true),
    },
    {
      type: "myButton",
      label: "取消",
      onClick: switchIsEdit,
    },
  ]

  const panelList_reporter_reviewed: TpanelList = [
    {
      custom: <Badge
        className={scss.antdBadge02}
        color="auto"
        text="已檢視" />
    },
  ]

  const panelList = (() => {
    if (reportInEdit?.isUserIsViewer) {
      return []
    }

    if (identity === "manager") {
      if (!reportInEdit) return panelList_manager_notInEdit
      else if (reportInEdit.isAllowToReview) return panelList_reviewer_inEdit_user
      else return []
    }

    if (identity === "reviewer") {
      if (!reportInEdit) return panelList_reporter_notInEdit
      else {
        if (!reportInEdit?.employeeId || reportInEdit?.employeeId === userInfo?.employee?.id) {
          if (isReportEdit) return panelList_reporter_inEdit02
          if (reportInEdit.isReviewedByOther) return panelList_reporter_reviewed
          return panelList_reporter_inEdit01
        }
        else if (reportInEdit.isAllowToReview) {
          return panelList_reviewer_inEdit_user
        }
        return []
      }
    }

    if (identity === "reporter") {
      if (!reportInEdit) return panelList_reporter_notInEdit
      else {
        // if (reportInEdit.isUserReviewed) return panelList_reporter_reviewed
        if (reportInEdit.isReviewedByOther) return panelList_reporter_reviewed
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
  const leftTagOnClick = () => { cancelEditNewDailyReport() }
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // mobile
  const [showSearchDrawer, setShowSearchDrawer] = useState(false)
  const doShowDrawer = () => { setShowSearchDrawer(true) }
  const closeShowDrawer = () => { setShowSearchDrawer(false) }


  const dailyReportContextValue: TdailyReportContext = {
    // doShowDrawer,
    // editReport_today,
    reportInEdit,
    isReportEdit,
    switchIsEdit,
    setShowReviewerForReportModal,
    cancelEditNewDailyReport,
    changeReportDate,
    identity,
    // editRivewerPickArr,
    doCheck,
    userInfo,
  }



  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  return (
    <>
      <SubLayer bodyClassName={classNames(scss.subLayer, scss.plus)}
        containerChildren={<LoadingCover01 isLoading={isLoading} />}
      >
        {/*  */}
        <PageHeader02
          key={+isMine}
          tag="日報表"
          tagClassName={classNames(scss.pageHeaderTag, scss.plus, scss.pplus)}
          tagOnClick={leftTagOnClick}
          panelList={panelList}
          customeLeft={customeLeft}
        />
        <PageHeader_mobile_dailyReport
          doShowDrawer={doShowDrawer}
          editRivewerPickArr={editRivewerPickArr}
          employeeChName={reportInEdit?.employeeChName}
          date={reportInEdit?.date}
          identity={identity}
          editReport_today={editReport_today}
          cancelEditNewDailyReport={cancelEditNewDailyReport}
          isSearch={!!(searchObj?.isUserReviewed !== undefined || searchObj?.date !== undefined)}
        />


        {/*  */}
        {!isCalendar &&
          <ReporterList
            dailyReportArr={sortedDailyReport ?? []}
            addTag={addTag}
          />
        }
        {isCalendar &&
          <TheCalendar
            addTag={addTag}
            dailyReportArr={sortedDailyReport}
            updateDailyReports={updateDailyReports}
          />
        }

        {/* {reportInEdit &&
            <ReportTable
              classDailyReportItemArr={reportInEdit.items}
              addDailyReportItem={addDailyReportItem}
              removeDailyReportItem={removeDailyReportItem}
              isEdit={isReportEdit}
            />
        } */}
        <DailyReportContext.Provider value={dailyReportContextValue}>
          <ReportTable
            classDailyReportItemArr={reportInEdit?.items}
            addDailyReportItem={addDailyReportItem}
            removeDailyReportItem={removeDailyReportItem}
            isEdit={isReportEdit}
            reportDateArr={reportDateArr}
          />
        </DailyReportContext.Provider>



        {/* mobile */}
        <SearchDrawer visible={showSearchDrawer}
          onSearch={doSearch}
          onCancel={closeShowDrawer}
        />
        {/*  */}
      </SubLayer>

      <SetReportEmpModal
        visible={!!reviewersPickArr}
        onConfirm={reqApiPatchDailyReports_viewers}
        onCancel={cancelSetRivewerModal}
        dataArr={reviewersPickArr ?? []}
        label="檢視人員設定"
        tip="可複選"
      />

      {/* 上傳前選擇兩種人員 */}
      <ReviewerAndExaminerSelector
        visible={showReviewerForReportModal}
        onConfirm={reqApiPatchDailyReports_my}
        onCancel={() => setShowReviewerForReportModal(false)}
        userId={userInfo.employee?.id}
        lastStatus={sortedDailyReport[0]?.reviewStatus || []}
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
      shouldReport,
      isHaveUser: !!item.user
    }
    return obj
  })
  return result
}

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

