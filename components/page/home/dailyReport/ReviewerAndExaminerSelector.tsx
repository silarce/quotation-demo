import { useState, useEffect } from "react"
import _ from "lodash"
import classNames from "classnames"

// antd
import { Modal } from "antd"

// gear
import CellWithBar from "components/global/gear/cell/cellWithBar"
import TwoBtnFooter from "components/global/gear/modal/footer/twoBtnFooter";
import InputSearch from 'components/global/gear/input/inputSearch';


import { TemployeeDto, useApiDailyReports_reviewers } from "js/api/api_dailyReport"

import { TdailyReportReviewStatusDto } from "js/api/dtoTypes"

// css
import scss from "./reviewerAndExaminerSelector.module.scss"


export default function ReviewerAndExaminerSelector(
  { visible,
    onConfirm,
    onCancel,
    userId,
    lastStatus
  }:
    {
      visible: boolean
      onConfirm: (reviewerArr: TemployeeDto[], examinerArr: TemployeeDto[]) => void
      onCancel: () => void
      userId: string | undefined
      lastStatus: TdailyReportReviewStatusDto[]
      // defaultRviewer: TemployeeDto[]
      // defaultExaminer: TemployeeDto[]
    }
) {

  const defaultRviewer: TemployeeDto[] = []
  const defaultExaminer: TemployeeDto[] = []

  lastStatus.forEach((status) => {
    if (status.type === "reviewer") {
      defaultRviewer.push(status.reviewerEmployee)
    }
    if (status.type === "examiner") {
      defaultExaminer.push(status.reviewerEmployee)
    }
  })


  // 搜尋字串
  const [searchValue_reviewer, setSearchValue_reviewer] = useState<string>()
  const [searchValue_examiner, setSearchValue_examiner] = useState<string>()
  // 被選擇的檢視人員
  const [selReviewerArr, setSelReviewerArr] = useState<TemployeeDto[]>(defaultRviewer)
  const [selExaminerArr, setSelExaminerArr] = useState<TemployeeDto[]>(defaultExaminer)

  // 取得所有檢視人員
  const {
    reviewersArr,
    updateReviewersArr, setReviewersArr
  } = useApiDailyReports_reviewers()


  useEffect(() => {
    if (visible) {
      (async () => {
        setSelReviewerArr(defaultRviewer)
        setSelExaminerArr(defaultExaminer)
        await updateReviewersArr()
      })()
    }
    else {
      setReviewersArr([])
      setSelReviewerArr([])
      setSelExaminerArr([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])


  const onClick_reviewer = (newViewer: TemployeeDto) => {
    const newArr = [...selReviewerArr]
    // if (selLimit === 1) {
    //   newArr[0] = newEmp
    //   setSelEmployeeArr(newArr)
    //   return
    // }
    const theIndex = newArr.findIndex((emp) => emp.id === newViewer.id)
    if (theIndex > -1) newArr.splice(theIndex, 1)
    else newArr.push(newViewer)
    setSelReviewerArr(newArr)
  }

  const onClick_examiner = (newExaminer: TemployeeDto) => {
    const newArr = [...selExaminerArr]
    // if (selLimit === 1) {
    //   newArr[0] = newEmp
    //   setSelEmployeeArr(newArr)
    //   return
    // }
    const theIndex = newArr.findIndex((emp) => emp.id === newExaminer.id)
    if (theIndex > -1) newArr.splice(theIndex, 1)
    else newArr.push(newExaminer)
    setSelExaminerArr(newArr)
  }



  const onSearch_reviewer = (v: string | undefined) => {
    if (!v) v = undefined
    setSearchValue_reviewer(v)
  }
  const onSearch_examiner = (v: string | undefined) => {
    if (!v) v = undefined
    setSearchValue_examiner(v)
  }

  return (
    <Modal
      className={classNames(scss.modal)}
      visible={visible}
      closable={false}
      centered={true}
      destroyOnClose={true}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div className={scss.container}>
        <Selector
          employeeArr={reviewersArr}
          selEmployeeArr={selReviewerArr}
          otherSelEmployeeArr={selExaminerArr}
          searchValue={searchValue_reviewer}
          onSearch={onSearch_reviewer}
          onClick={onClick_reviewer}
          label="請選擇檢視人員"
          userId={userId}
        />
      </div>

      {/* 下面的 */}
      <div className={scss.container}>
        <Selector
          employeeArr={reviewersArr}
          selEmployeeArr={selExaminerArr}
          otherSelEmployeeArr={selReviewerArr}
          searchValue={searchValue_examiner}
          onSearch={onSearch_examiner}
          onClick={onClick_examiner}
          label="請選擇觀察人員"
          userId={userId}
        />
        {/*  */}
        <TwoBtnFooter
          onConfirm={() => onConfirm(selReviewerArr, selExaminerArr)}
          onCancel={onCancel}
        />
      </div>
    </Modal >
  )
}

// ==========================================================================

const Selector = (
  {
    employeeArr,
    selEmployeeArr,
    otherSelEmployeeArr,
    searchValue,
    onSearch,
    onClick,
    label,
    userId,
  }:
    {
      employeeArr: TemployeeDto[]
      selEmployeeArr: TemployeeDto[]
      otherSelEmployeeArr: TemployeeDto[]
      searchValue: string | undefined
      onSearch: (v: string) => void
      onClick: (v: TemployeeDto) => void
      label: string
      userId: string | undefined
    }
) => {

  return (
    <>
      <div className={scss.header}>
        <div className={scss.left}>
          <div className={scss.label}>{label}</div>
          <div className={scss.tip}>{"可複選"}</div>
        </div>
        <InputSearch placeholder="請輸入搜尋內容"
          onClick={onSearch} />
      </div>
      {/*  */}
      <div className={scss.body}>
        {employeeArr.map((emp, index) => {
          const { idNumber, chName, jobs, id } = emp
          const sortedJobs = _.sortBy(jobs || [], "grade")
          const jobName = sortedJobs[0]?.name || ""
          const grade = sortedJobs[0]?.grade || ""
          const isActive = selEmployeeArr.some(selEmp => selEmp.id === emp.id)

          if (searchValue) {
            const regex = new RegExp(searchValue, 'i');
            if (
              !idNumber.match(regex) &&
              !chName.match(regex) &&
              !jobName.match(regex) &&
              !`${grade}`.match(regex)
            ) {
              return null;
            }
          }

          if (userId === id) return null

          const isOther = otherSelEmployeeArr.some((other) => other.id === id)
          if (isOther) return null

          return (
            <CellWithBar key={index} className={scss.row}
              isActive={isActive}
              onClick={() => onClick(emp)}
            >
              <span>{idNumber}</span>
              <span>{chName}</span>
              <span>{jobName}</span>
              <span>LV {grade}</span>
            </CellWithBar>
          )
        })}
      </div>
    </>
  )


}

