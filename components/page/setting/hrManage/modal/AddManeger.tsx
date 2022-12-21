import {
  useState, useEffect,
  Dispatch, SetStateAction
} from "react"

// antd
import { Modal } from 'antd';

// global gear
import TwoBtnFooter from "components/global/gear/modal/footer/twoBtnFooter";
import CellWithBar from "components/global/gear/cell/cellWithBar";

// css
import style from "./addManeger.module.scss"

// fakeData
import {
  TdepartmentManageList, TstaffInfo,
} from "fakeDatabase/staff/fakeManagerList"


// api
import { useEmployee, Temployee } from "js/api/api_employee";

// ===============================================================================
export default function AddManager(
  {
    visible,
    employeeList,
    onConfirm,
    onCancel,
  }:
    {
      visible: boolean,
      employeeList: Temployee[]
      onConfirm: (indexArr: number[]) => void
      onCancel: () => void
    }) {


  const [activeIndex, setActiveIndex] = useState<number[]>([])


  useEffect(() => {
    if (!visible) setActiveIndex([])
  }, [visible])


  const onClick = (index: number) => {
    const theIndex = activeIndex.indexOf(index)
    if (theIndex !== -1) {
      activeIndex.splice(theIndex, 1)
    }
    else {
      activeIndex.push(index)
    }
    setActiveIndex([...activeIndex])
  }

  const theOnConfirm = () => onConfirm(activeIndex)


  return (
    <Modal
      className={style.container}
      visible={visible}
      closable={false}
      centered={true}
      width={400}
      destroyOnClose={true}
      onCancel={onCancel}
      footer={<TwoBtnFooter {...{ onConfirm: theOnConfirm, onCancel }} />}
    >
      <div className={style.title}>
        <span>請選擇管理人員</span>
        <span className={style.note}>可複選</span>
      </div>
      <div className={style.listContainer}>

        {employeeList.map((item, index) => {
          const { idNumber, chName, jobs } = item
          const { name, grade } = jobs?.[0] ?? {}

          const isActive = activeIndex.includes(index)
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
    </Modal>
  )
}

// ============================================




