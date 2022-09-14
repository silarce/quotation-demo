import { ChangeEvent } from "react"

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"
import Input03 from "components/global/gear/input/input03"
import Select03 from "components/global/gear/select/select03"
import Checkbox01 from "components/global/gear/checkbox/checkbox01"
// icon
import { Icondelete01, IconCopy } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./productList.module.scss"
import styleL from "../local.module.scss"

// data type
import { TprodCellKey, TuseProduct } from "../hook/useProduct"

// options
import {
  Toption,
  optionsCreator_quoteType,
  optionsCreator_material,
  optionsCreator_surface,
  optionsCreator_memo,
} from "fakeDatabase/options/options"

// ==========================================================
// 格子的設定
import { prodCellConfigOri } from "fakeDatabase/domestic/quotation/fakeQuotProductionList"
const { cellConfig } = prodCellConfigOri()

type TcellConfigKey = keyof typeof cellConfig
type ToptionsObjKey =
  Extract<
    TcellConfigKey,
    "quoteType" | "material" | "surface" | "memo"
  >
type ToptionsObjList = {
  [key in ToptionsObjKey]: Toption[]
}
const optionsObjList: ToptionsObjList = {
  quoteType: optionsCreator_quoteType(),
  material: optionsCreator_material(),
  surface: optionsCreator_surface(),
  memo: optionsCreator_memo(),
}
// ==========================================================
// ==========================================================
export default function ProductList({ productStates }:
  { productStates: TuseProduct }) {

  const { theadIndex, productList,
    deleteProduct, copyProduct,
    activeRow, setActiveRow,
    onInputChange, onSelChange, onCheckboxClick, disabled
  } = productStates

  // =======================================
  const lwhbReg = /L|W|H|B/
  // =======================================

  return (
    <div className={style.container} >
      {productList.map((dataItem, pIndex) => {
        return (
          <CellWithBar key={pIndex} isActive={activeRow === pIndex}>
            <div className={style.row}
              onClick={() => setActiveRow(pIndex)}
            >
              <div className={style.buttonBox}>
                <Icondelete01 onClick={(e) => deleteProduct(e, pIndex)} />
                <IconCopy onClick={() => copyProduct(pIndex)} />
                <span>1</span>
              </div>
              {theadIndex.map((key) => {
                const { width, id, type } = cellConfig[key]
                const textCenter = lwhbReg.test(id) ? styleL.textCenter : ""
                const theStyle = { width }
                const stateValue = dataItem[key]

                const TheCell =
                  cellSwitcher({ key, pIndex, type, disabled, stateValue })

                return (
                  <div className={`${styleL.column} ${textCenter}`}
                    key={key} style={theStyle} >
                    {TheCell}
                  </div>
                )
              })} {/* column */}
            </div> {/* row */}
          </CellWithBar>
        )
      })}
    </div>
  ) // return

  // ===========================================================
  // ===========================================================
  // ===========================================================
  function cellSwitcher({ key, pIndex, type, disabled, stateValue }:
    {
      key: TprodCellKey
      pIndex: number
      type: string
      disabled: boolean
      stateValue: string | boolean
    }
  ) {

    switch (type) {
      case "input": {
        if (typeof stateValue !== "string") return null
        const onChange
          = (e: ChangeEvent<HTMLInputElement>) => onInputChange(e, pIndex, key)
        return (
          <Input03 key={`${pIndex}${key}`}
            {...{ stateValue, onChange, disabled }} />
        )
      }
      case "select": {
        if (typeof stateValue !== "string") return null
        const options = optionsObjList[key as ToptionsObjKey]
        const onChange =
          (option: Toption | null) => onSelChange(option, pIndex, key)
        return (
          <Select03 {...{
            stateValue, options, onChange, disabled
          }} />
        )
      }

      case "checkbox": {
        if (typeof stateValue !== "boolean") return null
        const onClick = () => onCheckboxClick(pIndex, key)
        return (
          <div className={styleL.checkbox}>
            <Checkbox01 stateValue={stateValue} onClick={onClick} />
          </div>
        )
      }
      default:
        return null
    }
  }

} //ProductList

// ================================================










