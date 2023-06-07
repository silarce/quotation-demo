import Image from "next/image"


// gear
import MyButton from "components/global/gear/button/myButton"
import CheckButton from "components/global/gear/button/checkButton"


// css
import scss from "./pageHeader_mobile_dailyReport.module.scss"

// icon
import iconSearch from "public/image/icon/search.svg"
import iconArrow from "public/image/icon/arrow03_left.svg"

// type
import { ThookEmptyReport } from "hooks/home/useDailyReport"
import { TuserDto } from "js/api/dtoTypes"

// ====================================================================
export default function PageHeader_mobile_dailyReport(
  { doShowDrawer, editRivewerPickArr,
    employeeChName,
    date,

    userInfo,
    identity,
    reportInEdit,
    doCheck,
    isReportEdit,
    editReport_today,
    switchIsEdit,
    setShowReviewerForReportModal,
    cancelEditNewDailyReport,
  }:
    {
      doShowDrawer: () => void
      editRivewerPickArr: () => void
      employeeChName: string | undefined
      date: string | undefined

      userInfo: TuserDto
      identity: string | undefined
      reportInEdit: ThookEmptyReport | undefined
      doCheck: () => void
      isReportEdit: boolean
      editReport_today: () => void
      switchIsEdit: () => void
      setShowReviewerForReportModal: (v: boolean) => void
      cancelEditNewDailyReport: () => void
    }
) {

  const Bar = (() => {

  return Bar_reporter_notInEdit
    // return () => { return null }
  })()


  return (
    <div className={scss.container}>

      {employeeChName &&
        <div className={scss.title}>
          <Image src={iconArrow} alt="return" onClick={cancelEditNewDailyReport} />
          <span>{employeeChName} {date}</span>
          <div />
        </div>
      }

      <div className={scss.btnBar}>
        <div className={scss.right}>
          <Bar />
        </div>
      </div>

    </div>
  )
  // --------------------------------------------------------------

  // function Bar_manager_notInEdit() {
  //   return (
  //     <>
  //       <MyButton label="搜尋" img={iconSearch.src}
  //         onClick={doShowDrawer} />
  //       <MyButton label="審核人員設定" onClick={editRivewerPickArr} />
  //     </>
  //   )
  // }
  // 
  // function Bar_reviewer_inEdit_user() {
  //   return (
  //     <CheckButton
  //       // checkLabel="已讀"
  //       checkLabel="已讀"
  //       uncheckLable="未讀"
  //       value={!!reportInEdit?.isReviewedByUser}
  //       onClick={doCheck}
  //     />
  //   )
  // }

  // 
  function Bar_reporter_notInEdit() {
    return (
      <>
        <MyButton label="搜尋" img={iconSearch.src}
          onClick={doShowDrawer} />
        <MyButton label="今日回報"
          onClick={editReport_today} />
      </>
    )
  }
  // 
  // function Bar_reporter_inEdit02() {
  //   return (
  //     <>

  //       <MyButton label={isReportEdit ? "取消" : "編輯"}
  //         onClick={switchIsEdit} />

  //       {isReportEdit &&
  //         <MyButton label="上傳"
  //           onClick={() => { setShowReviewerForReportModal(true) }} />
  //       }
  //     </>
  //   )
  // }
  // 





} // PageHeader_mobile_dailyReport
// ====================================================================






