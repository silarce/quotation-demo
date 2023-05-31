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

// css
import scss from "./setReportEmpModal_2.module.scss"


export default function SetReportEmpModal(
  { visible,
    onConfirm,
    onCancel,
  }:
    {
      visible: boolean
      onConfirm: (dataArr: TemployeeDto[]) => void
      onCancel: () => void
    }
) {

  // 搜尋字串
  const [searchValue_reviewer, setSearchValue_reviewer] = useState<string>()
  const [searchValue_examiner, setSearchValue_examiner] = useState<string>()
  // 被選擇的審核人員
  const [selReviewerArr, setSelReviewerArr] = useState<TemployeeDto[]>([])
  const [selExaminerArr, setSelExaminerArr] = useState<TemployeeDto[]>([])

  // 取得所有審核人員
  const {
    reviewersArr,
    updateReviewersArr, setReviewersArr
  } = useApiDailyReports_reviewers()


  useEffect(() => {
    if (visible) {
      (async () => {
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
          label="請選擇審核人員"
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
          label="請選擇審核人員"
        />
        {/*  */}
        <TwoBtnFooter
          onConfirm={() => onConfirm(selReviewerArr)}
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
  }:
    {
      employeeArr: TemployeeDto[]
      selEmployeeArr: TemployeeDto[]
      otherSelEmployeeArr: TemployeeDto[]
      searchValue: string | undefined
      onSearch: (v: string) => void
      onClick: (v: TemployeeDto) => void
      label: string
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
          const sortedJobs = _.sortBy(jobs, "grade")
          const jobName = sortedJobs[0].name
          const grade = sortedJobs[0].grade
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

