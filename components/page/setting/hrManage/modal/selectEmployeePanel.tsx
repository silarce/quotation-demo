import {
  useState, useEffect,
} from "react"

// antd
import { Modal } from 'antd';

// global gear
import TwoBtnFooter from "components/global/gear/modal/footer/twoBtnFooter";
import CellWithBar from "components/global/gear/cell/cellWithBar";

// css
import style from "./selectEmployeePanel.module.scss"

// api
import { TemployeeDto } from "js/api/api_employee";

// ===============================================================================
export default function SelectEmployeePanel(
  {
    visible,
    employeeList,
    label,
    tip,
    onConfirm,
    onCancel,
    selectLimit
  }:
    {
      visible: boolean,
      employeeList: TemployeeDto[]
      label: string
      tip?: string
      onConfirm: (indexArr: number[]) => void
      onCancel: () => void
      selectLimit?: number
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
      if (!selectLimit) {
        activeIndex.push(index)
      }
      else if (activeIndex.length < selectLimit) {
        activeIndex.push(index)
      }
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
      width={800}
      destroyOnClose={true}
      onCancel={onCancel}
      footer={<TwoBtnFooter {...{ onConfirm: theOnConfirm, onCancel }} />}
    >
      <div className={style.title}>
        <span>{label}</span>
        <span className={style.note}>{tip}</span>
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




