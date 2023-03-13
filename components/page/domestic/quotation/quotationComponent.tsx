import {
  useMemo,
  Dispatch, SetStateAction
} from "react"

// global gear
import Select03 from "components/global/gear/select/select03"

// css
import style from "./quotationComponent.module.scss"
import styleL from "./local.module.scss"

// options
import {
  Toption,
  optionsCreator_material,
  optionsCreator_surface,

} from "fakeDatabase/options/options"

const optionsObj: {
  [key: string]: Toption[]
} = {
  material: optionsCreator_material(),
  surface: optionsCreator_surface()
}

// type
import { PartClass } from "./hook/useProduct"

// =========================================================
export default function QuotationComponent(
  { partList, disabled = false }:
    {
      partList: PartClass[] | undefined,
      disabled: boolean
    }) {


  return (
    <>
      <div className={styleL.header}>
        <h2>材料/配件設定</h2>
      </div>

      <div className={styleL.scrollDiv + " " + style.scrollDiv}>
        {/* thead */}
        <div className={styleL.thead + " " + style.thead}>
          <div className={styleL.rowIndex}>
            <span></span>
          </div>
          {partKeys.map((item, index) => {
            const { label, width } = config[item]
            const theStyle = { width }
            return (
              <div className={styleL.theadCell} key={index} style={theStyle}>
                <span>{label}</span>
              </div>
            )
          })}
        </div>

        {/* tbody */}
        <div>
          {!partList &&
            <>
              <div className={styleL.rowIndex}></div>
              <span className={styleL.noListTip}>尚未選擇產品</span>
            </>}
        </div>
        {/*  */}
        {partList?.map((row, pIndex) => {
          const { onSelChange } = row
          return (
            <div className={styleL.row} key={pIndex}>
              <div className={styleL.rowIndex}>
                <span>{pIndex + 1}</span>
              </div>

              {partKeys.map((key, cIndex) => {
                const { width } = config[key]
                const theStyle = { width }
                let item = row[key]
                // _______
                if (item === null) return (
                  <div className={styleL.column} key={cIndex} style={theStyle}>
                    <div><span></span></div>
                  </div>
                )
                // _______
                if (typeof item === "string") {
                  // 如果是數值，就加千分位符號
                  const intReg = /^[0-9]*$/
                  const floatReg = /^[+-]?\d+(\.\d+)?$/
                  if (intReg.test(item) || floatReg.test(item))
                    item = item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                  // 改變平方單位的格式
                  const unitReg = /cm2|m2|km2|mm2 /
                  let theTwo;
                  if (unitReg.test(item)) {
                    item = item.replace(/[0-9]/g, '')
                    theTwo = 2
                  }
                  return (
                    <div className={styleL.column} key={cIndex} style={theStyle}>
                      <div>
                        <span>{item}</span>
                        <sup>{theTwo}</sup>
                      </div>
                    </div>
                  )
                }
                // _______
                if (optionsObj[key]) {
                  const onChange = (option: Toption | null) => {
                    if (key === "material")
                      onSelChange(option, key)
                  }
                  return (
                    <div className={styleL.column} key={cIndex} style={theStyle}>
                      <Select03
                        stateValue={item}
                        options={optionsObj[key]}
                        onChange={onChange}
                        disabled={disabled}
                      />
                    </div>
                  )
                }
              })}
            </div>
          )
        })}
      </div>
    </>

  )
}


// ================================================

// type TpartKeys = keyof PartClass
type TpartKeys = keyof Pick<PartClass,
  "subType" | "subTypeName" | "id" | "material" |
  "basicWeight" | "unit" | "qty" | "listPrice" | "totalListPrice" |
  "price" | "totalPrice"
>

const partKeys: TpartKeys[] = [
  "subType", "subTypeName", "id", "material",
  "basicWeight", "unit", "qty", "listPrice", "totalListPrice",
  "price", "totalPrice",
]

type Tconfig = {
  [key in TpartKeys]: {
    label: string
    width: string
  }
}

const config: Tconfig = {
  "subType": { label: "中類", width: "45px" },
  "subTypeName": { label: "種類名稱", width: "160px" },
  "id": { label: "代號", width: "116px" },
  "material": { label: "材料", width: "120px" },
  // "surface": { label: "表面", width: "55px" },
  "basicWeight": { label: "重量基重", width: "75px" },
  "unit": { label: "單位", width: "40px" },
  "qty": { label: "數量", width: "60px" },
  "listPrice": { label: "牌價", width: "84px" },
  "totalListPrice": { label: "牌價複價", width: "84px" },
  "price": { label: "單價", width: "84px" },
  "totalPrice": { label: "複價", width: "84px" },
}


