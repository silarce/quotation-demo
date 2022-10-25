
import {
  Dispatch, SetStateAction,
  useState, useEffect, ChangeEvent
} from "react"

// global gear
import Input03 from "components/global/gear/input/input03"
import Select03 from "components/global/gear/select/select03"
import CellWithBar from "components/global/gear/cell/cellWithBar"

// icon
import { IconDelete01 } from "public/image/icon/svgComponent/svgIcons"
import { IconAddCircle } from "public/image/icon/svgComponent/svgIcons"

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
  { transferList,
    setTransferList }:
    {
      transferList: Ttransfer[]
      setTransferList: Dispatch<SetStateAction<Ttransfer[]>>
    }

) {


  return (
    <div className={style.editTransfer}>
      <div className={style.thead}>
        <div /> {/* 填空格 */}
        <div /> {/* 填空格 */}
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
      <div className={style.tbody}>

        {transferList.map((data, rowIndex) => {

          return (
            <CellWithBar className={style.row} key={rowIndex}>
              {/*  */}
              <div><IconDelete01 /></div>
              <div>{rowIndex + 1}</div>
              {/*  */}
              {indexKeys.map((key, index) => {
                const stateValue = data[key]


                const { type, width, marginRight,
                  flex, options, center }
                  = config[key]



                const theStyle = { width, marginRight, flex }

                const onChangeInput
                  = (e: ChangeEvent<HTMLInputElement>) => {
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
                      <Input03 className={style.input}
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
              {/*  */}
            </CellWithBar> // row
          )
        })}
        {/* <div>
          <div></div>
        </div> */}
        {/* 做新增項目 */}
        {/* 做新增項目 */}
        {/* 做新增項目 */}
        {/* 做新增項目 */}
        {/* 做新增項目 */}
      </div>
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



