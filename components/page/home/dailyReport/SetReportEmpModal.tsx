import { useState } from "react"


// gear
import ModalListSelectorWithSearch from "components/global/gear/modal/modalListSelectorWithSearch"
import CellWithBar from "components/global/gear/cell/cellWithBar"

import scss from "./setReportEmpModal.module.scss"


type Tdata = {
  idNumber: string
  chName: string
  jobName: string
  grade: string
  shouldReport: boolean
}


export default function SetReportEmpModal(
  { visible,
    onConfirm,
    onCancel,
    onSearch,
    dataArr
  }:
    {
      visible: boolean
      onConfirm: (dataArr: Tdata[]) => void
      onCancel: () => void
      onSearch: (v: string) => void
      dataArr: Tdata[]
    }
) {

  const [render, setRender] = useState(1)
  const reRender = () => setRender(state => ++state)


  return (
    <ModalListSelectorWithSearch
      className={scss.antdModal}
      label="回報人員設定"
      visible={visible}
      onConfirm={() => onConfirm(dataArr)}
      onCancel={onCancel}
      onSearch={onSearch}
      width="800px"
    >
      <div className={scss.body}>
        {dataArr.map((data, index, arr) => {
          const { idNumber, chName, jobName, grade, shouldReport } = data
          const onClick = () => {
            arr[index].shouldReport = !arr[index].shouldReport
            reRender()
          }
          return (
            <CellWithBar key={index} className={scss.row}
              isActive={shouldReport}
              onClick={onClick}
            >
              <span>{idNumber}</span>
              <span>{chName}</span>
              <span>{jobName}</span>
              <span>{grade}</span>
            </CellWithBar>
          )
        })}

      </div>
    </ModalListSelectorWithSearch >
  )
}




