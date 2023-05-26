
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
    searchEmployee,
    onConfirm,
    onCancel,
    label,
    tip,
  }:
    {
      showModal: boolean
      employeeArr: TemployeeDto[]
      searchEmployee: (v: string) => void
      // onConfirm: (v: TemployeeDto[]) => void
      onConfirm: (v: TemployeeDto[]) => void
      onCancel: () => void
      label?: string
      tip?: React.ReactNode
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
  const [selEmployeeArr, setSelEmployeeArr] = useState<TemployeeDto[]>([])

  // 搜尋過濾
  // ==================================================
  const onClick = (newEmp: TemployeeDto) => {
    const newArr = [...selEmployeeArr]
    const theIndex = newArr.findIndex((emp) => emp.id === newEmp.id)
    if (theIndex > -1) newArr.splice(theIndex, 1)
    else newArr.push(newEmp)
    setSelEmployeeArr(newArr)
  }

  const theOnConfirm = () => {
    if (!selEmployeeArr) return ModalInfo("請選擇公司")
    onConfirm(selEmployeeArr)
    theOnCancel()
  }

  const theOnCancel = () => {
    onCancel()
    setSelEmployeeArr([])
  }

  // // 被選的資料
  // const [selEmployee, setSelEmployee] = useState<TemployeeDto[]>([])

  // // 搜尋過濾
  // // ==================================================
  // const onClick = (newEmp: TemployeeDto) => {

  //   const index = selEmployee.findIndex((emp) => {
  //     return emp.id === newEmp.id
  //   })

  //   const arrCopy = _.cloneDeep(selEmployee)
  //   if (index === -1) { arrCopy.push(newEmp) }
  //   else { arrCopy.splice(index, 1) }

  //   setSelEmployee(arrCopy)
  // }

  // const theOnConfirm = () => {
  //   if (!selEmployee[0]) return ModalInfo("請選擇公司")
  //   onConfirm(selEmployee)
  //   theOnCancel()
  // }

  // const theOnCancel = () => {
  //   onCancel()
  //   setSelEmployee([])
  // }

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
      tip={tip}
    >
      <div className={style.listContainer}>
        {employeeArr.map((emp, index) => {
          const { idNumber, chName, jobs } = emp
          const { name, grade } = jobs?.[0] ?? {}

          const isActive = selEmployeeArr.some(selEmp => selEmp.id === emp.id)
          return (
            <CellWithBar key={index} isActive={isActive}>
              <div className={`${style.listItem}`}
                onClick={() => onClick(emp)}
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

