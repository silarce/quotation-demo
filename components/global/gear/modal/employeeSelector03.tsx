
import {
  Dispatch, SetStateAction,
  useState, useMemo, useEffect
} from 'react';
import { useInView } from 'react-intersection-observer';
import _ from "lodash"

// global gear
import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch'
import CellWithBar from "components/global/gear/cell/cellWithBar";
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';

// css
import style from "./employeeSelector.module.scss"

// type
import { TemployeeDto } from 'js/api/dtoTypes';

// api
import { useEmployee, TapiGetEmployeeParams } from 'js/api/api_employee';



export default function EmployeeSelector03(
  {
    showModal,
    // employeeArr,
    // searchEmployee,
    onConfirm,
    onCancel,
    label,
    tip,
    selLimit,
  }:
    {
      showModal: boolean
      onConfirm: (v: TemployeeDto[]) => void
      onCancel: () => void
      label?: string
      tip?: React.ReactNode
      selLimit?: 1
      // employeeArr: TemployeeDto[]
      // searchEmployee: (v: string) => void
      // getCustomerByPage?: () => void
      // setShowModal?: Dispatch<SetStateAction<boolean>>
    }
) {

  // 被選的資料
  const [selEmployeeArr, setSelEmployeeArr] = useState<TemployeeDto[]>([])

  const [searchValue, setSearchValue] =
    useState<string | undefined | null>(null)
  const [page, setPage] = useState(1)

  const params: TapiGetEmployeeParams = (() => {
    const allNum = /^\d+$/.test(searchValue ?? "n")
    const grade = allNum ? searchValue : undefined
    return {
      page: page,
      pageSize: 20,
      populate: ["jobs"],
      filter: {
        "$or": {
          idNumber: { $containsi: searchValue },
          chName: { $containsi: searchValue },
          "jobs.name": { $containsi: searchValue },
          "jobs.grade": { $eq: grade },
        }
      }
    }
  })()

  const { data, update, update_infinite } = useEmployee(params)
  const employeeArr = data?.data || []
  const meta = data?.meta

  const [viewRef, inView] = useInView();

  useEffect(() => {
    if (!showModal) return
    setPage(1)
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, showModal])

  useEffect(() => {
    if (!showModal) return
    if (!inView) return
    if (!meta?.hasNextPage) return;
    setPage(page => ++page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  useEffect(() => {
    if (page === 1) return;
    update_infinite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])



  // ==================================================

  const onClick = (newEmp: TemployeeDto) => {
    const newArr = [...selEmployeeArr]
    if (selLimit === 1) {
      newArr[0] = newEmp
      setSelEmployeeArr(newArr)
      return
    }
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

  const onSearch = (v: string) => {
    setSearchValue(v)
  }

  // ==================================================

  return (
    <ModalListSelectorWithSearch
      label={label ?? ""}
      visible={showModal}
      onConfirm={theOnConfirm}
      onCancel={theOnCancel}
      onSearch={onSearch}
      width={"800"}
      className={style.container}
      tip={tip}
    >
      <div className={style.listContainer}>
        {employeeArr.map((emp, index, arr) => {
          const { idNumber, chName, jobs } = emp
          const { name, grade } = jobs?.[0] ?? {}

          const isActive = selEmployeeArr.some(selEmp => selEmp.id === emp.id)

          const theViewRef = (() => {
            if (arr.length - 11 === index) return viewRef
            return undefined
          })()

          return (
            <CellWithBar key={index} isActive={isActive}>
              <div className={`${style.listItem}`}
                onClick={() => onClick(emp)}
                ref={theViewRef}
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

