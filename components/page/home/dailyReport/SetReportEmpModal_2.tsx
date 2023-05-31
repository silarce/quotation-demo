import { useState, useEffect } from "react"
import _ from "lodash"


// gear
import ModalListSelectorWithSearch from "components/global/gear/modal/modalListSelectorWithSearch"
import CellWithBar from "components/global/gear/cell/cellWithBar"

import { TemployeeDto, useApiDailyReports_reviewers } from "js/api/api_dailyReport"

// css
import scss from "./setReportEmpModal.module.scss"


export default function SetReportEmpModal(
  { visible,
    onConfirm,
    onCancel,
    label,
    tip,
  }:
    {
      visible: boolean
      onConfirm: (dataArr: TemployeeDto[]) => void
      onCancel: () => void
      label?: string
      tip?: string
    }
) {

  // 搜尋字串
  const [searchValue, setSearchValue] = useState<string>()
  // 被選擇的審核人員
  const [selReviewerArr, setSelReviewerArr] = useState<TemployeeDto[]>([])

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])


  const onClick = (newViewer: TemployeeDto) => {
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


  // const [theDataArr, setTheDataArr]
  //   = useState<TsetReportEmpModalData[]>(_.cloneDeep(dataArr))
  // const [searchValue, setSearchValue] = useState("")



  // useEffect(() => {
  //   setTheDataArr(_.cloneDeep(dataArr))
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dataArr])


  const onSearch = (v: string | undefined) => {
    if (!v) v = undefined
    setSearchValue(v)
  }


  return (
    <ModalListSelectorWithSearch
      className={scss.antdModal}
      label={label ?? ""}
      visible={visible}
      onConfirm={() => onConfirm(selReviewerArr)}
      onCancel={onCancel}
      onSearch={onSearch}
      width="800px"
      tip={tip}
    >
      <div className={scss.body}>
        {reviewersArr.map((emp, index) => {
          // const { idNumber, chName, job, grade } = emp
          const { idNumber, chName, jobs } = emp

          const sortedJobs = _.sortBy(jobs, "grade")
          const jobName = sortedJobs[0].name
          const grade = sortedJobs[0].grade


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
          const isActive = selReviewerArr.some(selEmp => selEmp.id === emp.id)
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
    </ModalListSelectorWithSearch >
  )
}




