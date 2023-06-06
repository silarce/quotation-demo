import { useState, useEffect, useContext } from "react"
import _ from "lodash"


// gear
import ModalListSelectorWithSearch from "components/global/gear/modal/modalListSelectorWithSearch"
import CellWithBar from "components/global/gear/cell/cellWithBar"

import scss from "./setReportEmpModal.module.scss"

import { AppContext } from "pages/_app"

// ========================================================================

export type TsetReportEmpModalData = {
  id: string
  chName: string
  idNumber: string
  job: string
  grade: number
  shouldReport: boolean
  isHaveUser: boolean
}

// ========================================================================
export default function SetReportEmpModal(
  { visible,
    onConfirm,
    onCancel,
    // onSearch,
    dataArr,
    label,
    tip,
  }:
    {
      visible: boolean
      onConfirm: (dataArr: TsetReportEmpModalData[]) => void
      onCancel: () => void
      // onSearch: (v: string) => void
      /**會經過cloneDeep處理 */
      dataArr: TsetReportEmpModalData[]
      label?: string
      tip?: string
    }
) {

  const { rwd1023 } = useContext(AppContext)


  const [theDataArr, setTheDataArr]
    = useState<TsetReportEmpModalData[]>(_.cloneDeep(dataArr))
  const [searchValue, setSearchValue] = useState("")



  useEffect(() => {
    setTheDataArr(_.cloneDeep(dataArr))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataArr])


  const onSearch = (v: string) => {
    setSearchValue(v)
  }


  return (
    <ModalListSelectorWithSearch
      className={scss.antdModal}
      label={label ?? ""}
      visible={visible}
      onConfirm={() => onConfirm(theDataArr)}
      onCancel={onCancel}
      onSearch={onSearch}
      width={rwd1023 ? "80vw" : "800px"}
      tip={tip}
    >
      <div className={scss.body}>
        {theDataArr.map((data, index) => {
          const { idNumber, chName, job, grade, shouldReport } = data
          const onClick = () => {
            setTheDataArr((prevDataArr) => {
              const newDataArr = [...prevDataArr];
              const updatedData = {
                ...newDataArr[index],
                shouldReport: !newDataArr[index].shouldReport,
              };
              newDataArr[index] = updatedData;
              return newDataArr;
            });
          };


          if (searchValue) {
            const regex = new RegExp(searchValue, 'i');
            if (
              !idNumber.match(regex) &&
              !chName.match(regex) &&
              !job.match(regex) &&
              !`${grade}`.match(regex)
            ) {
              return null;
            }
          }
          return (
            <CellWithBar key={index} className={scss.row}
              isActive={shouldReport}
              onClick={onClick}
            >
              <span className={scss.idNumber}>{idNumber}</span>
              <span>{chName}</span>
              <span>{job}</span>
              <span>LV {grade}</span>
            </CellWithBar>
          )
        })}

      </div>
    </ModalListSelectorWithSearch >
  )
}




