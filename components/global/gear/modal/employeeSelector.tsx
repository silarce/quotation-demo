
import {
  Dispatch, SetStateAction,
  useState, useMemo, useEffect
} from 'react';
import { useInView } from 'react-intersection-observer';
import _ from "lodash"

// global gear
import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch'
import CellWrapper from 'components/global/gear/cell/cellWithBar';
import CellWithBar from "components/global/gear/cell/cellWithBar";
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';

// css
import style from "./employeeSelector.module.scss"

// type
import { TemployeeDto } from 'js/api/dtoTypes';



export default function EmployeeSelector(
  {
    showModal, setShowModal,
    employeeArr, getCustomerByPage,
    searchCustomer: searchEmployee,
    onConfirm,
    onCancel,
    label,
  }:
    {
      showModal: boolean
      employeeArr: TemployeeDto[]
      searchCustomer: (v: string) => void
      onConfirm: (v: TemployeeDto[]) => void
      onCancel: () => void
      label?: string
      getCustomerByPage?: () => void
      setShowModal?: Dispatch<SetStateAction<boolean>>
    }
) {


  // const [viewRef, inView] = useInView();


  // useEffect(() => {
  //   if (!inView) return
  //   getCustomerByPage()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [inView])


  // ==================================================
  // 被選的資料
  // const [selClient, setSelClient] = useState<TemployeeDto>()
  const [activeKeyArr, setActiveKeyArr] = useState<number[]>([])

  // 搜尋過濾
  // ==================================================
  const onClick = (newKey: number) => {
    const index = activeKeyArr.findIndex((key) => { key === newKey })
    const arrCopy = _.cloneDeep(activeKeyArr)
    if (index === -1) { arrCopy.push(newKey) }
    else { arrCopy.splice(index, 1) }
    setActiveKeyArr(arrCopy)
  }

  const theOnConfirm = () => {
    if (!activeKeyArr) return ModalInfo("請選擇公司")
    const theEmployeeArr = activeKeyArr.map((key) => employeeArr[key])
    onConfirm(theEmployeeArr)
    theOnCancel()
  }

  const theOnCancel = () => {
    onCancel()
    setActiveKeyArr([])
  }

  // const onSearch = (value: string) => { setSearchValue(value) }
  // ==================================================

  return (
    <ModalListSelectorWithSearch
      label={label ?? ""}
      visible={showModal}
      onConfirm={theOnConfirm}
      onCancel={theOnCancel}
      onSearch={searchEmployee}
      width={"800"}
      className={style.container}
    >
      <div className={style.listContainer}>
        {employeeArr.map((item, index) => {
          const { idNumber, chName, jobs } = item
          const { name, grade } = jobs?.[0] ?? {}

          const isActive = activeKeyArr.includes(index)
          return (
            <CellWithBar key={index} isActive={isActive}>
              <div className={`${style.listItem}`}
                onClick={() => onClick(index)}
              >
                <span>{idNumber}</span>
                <span>{chName}</span>
                <span>{name}</span>
                <span>{grade && `Level ${grade}`}</span>
              </div>
            </CellWithBar>
          )
        })}
      </div>
    </ModalListSelectorWithSearch >
  )
}

