
import {
  Dispatch, SetStateAction,
  useState, useEffect, ChangeEvent
} from "react"

// global gear
import Input02 from "components/global/gear/input/input02"
import Select03 from "components/global/gear/select/select03"
import CellWithBar from "components/global/gear/cell/cellWithBar"

// icon
import { IconDelete01 } from "public/image/icon/svgComponent/svgIcons"
import addIcon from "public/image/icon/add.svg"

// css
import style from "./listOfDeliveryOrders.module.scss"

// type
import { Toption } from "fakeDatabase/options/options"

// other
import { optionsCreator_material } from "fakeDatabase/options/options"
const optionMaterial = optionsCreator_material()

// fake
import { Ttransfer } from "pages/worksDepartment/contractList/[contractId]/listOfDeliveryOrders/edit/[id]"


export default function EditTransfer(
  { transferList, setTransferList,
    addTransfer, delTransfer,
  }:
    {
      transferList: Ttransfer[]
      setTransferList: Dispatch<SetStateAction<Ttransfer[]>>
      addTransfer: () => void
      delTransfer: (index: number) => void
    }
) {


  return (
    <div className={style.editTransfer}>
      {/* thead */}
      <div className={style.thead}>
        {/*  */}
        <div className={style.deleteIcon} /> {/* 填空格 */}
        <div className={style.indexNumber} /> {/* 填空格 */}
        {/*  */}
        {indexKeys.map((key, index) => {
          const { label, width, marginRight, flex, center } = config[key]
          const theStyle = { width, marginRight, flex }
          const className = center ? style.center : ""
          return (
            <div className={className} key={index}
              style={theStyle}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      {/* tbody */}
      <div className={style.tbody}>
        {transferList.map((data, rowIndex) => {
          return (
            <CellWithBar key={rowIndex}>
              <div className={style.row}>
                {/*  */}
                <div className={style.deleteIcon}
                  onClick={() => delTransfer(rowIndex)}
                >
                  <IconDelete01 />
                </div>
                <div className={style.indexNumber}>
                  {rowIndex + 1}
                </div>
                {/*  */}
                {indexKeys.map((key, index) => {
                  const stateValue = data[key]
                  const { type, width, marginRight,
                    flex, options, center }
                    = config[key]
                  const theStyle = { width, marginRight, flex }
                  const onChangeInput
                    = (e: ChangeEvent<HTMLTextAreaElement>) => {
                      const value = e.target.value
                      transferList[rowIndex][key] = value
                      setTransferList([...transferList])
                    }
                  const onChangeSel = (option: Toption | null) => {
                    if (!option) return
                    const value = option!.value
                    transferList[rowIndex][key] = value
                    setTransferList([...transferList])
                  }
                  const className = center ? style.center : ""
                  return (
                    <div className={className} key={index}
                      style={theStyle}>
                      {type === "input" &&
                        <Input02 className={style.input}
                          stateValue={stateValue}
                          onChange={onChangeInput}
                        />
                      }
                      {type === "select" &&
                        <Select03 className={style.sel}
                          stateValue={stateValue}
                          onChange={onChangeSel}
                          options={options!}
                        />
                      }
                    </div>
                  )
                })}
              </div>
              {/*  */}
            </CellWithBar> // row
          )
        })}
        {/* 新增項目 */}
        <div className={style.row}>
          <div className={style.addIcon}
            onClick={addTransfer}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={addIcon.src} alt="" />
            <span>新增項目</span>
          </div>
        </div>
      </div> {/* tbody */}
    </div>
  )
}

// ====================================================


type TindexKeys = keyof Ttransfer

const indexKeys: TindexKeys[]
  = ["itemName", "material", "qty", "reason"]


const config: {
  [key in TindexKeys]: {
    label: string
    type: string
    width: string
    marginRight: string
    flex?: string
    options?: Toption[]
    center?: boolean
  }
} = {
  itemName: {
    label: "物品名稱",
    type: "input",
    width: "120px",
    marginRight: "22px",
  },
  material: {
    label: "材質規格",
    type: "select",
    width: "120px",
    marginRight: "22px",
    options: optionMaterial
  },
  qty: {
    label: "數量",
    type: "input",
    width: "45px",
    marginRight: "22px",
    center: true
  },
  reason: {
    label: "調貨理由",
    type: "input",
    width: "auto",
    marginRight: "0px",
    flex: "auto"
  }
}



