import { ChangeEvent } from "react"

import { components } from "react-select";
const { Option } = components

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"
import Input03 from "components/global/gear/input/input03"
import Select03 from "components/global/gear/select/select03"
import Checkbox01 from "components/global/gear/checkbox/checkbox01"
import { OptionWithIcon01 } from "components/global/gear/select/optionWithIcon";
import { SingleValueWithIcon01 } from "components/global/gear/select/singleValueWithIcon";
// icon
import { Icondelete01, IconCopy } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./productList.module.scss"
import styleL from "../local.module.scss"

// data type
// import { TprodCellKey, TuseProduct } from "../hook/useProduct"
import type { TuseProduct_new, TprodCellKey, ProdClass } from "../hook/useProduct_new"
import {
  emptyProduct,
  TproductString,
  TproductBoolean,
  TproductObject,
} from "fakeDatabase/domestic/quotation/fakeQuotProductionList_new"
// options
import {
  Toption, ToptionPlus,
  optionsCreator_quoteType_new,
  optionsCreator_material_new,
  optionsCreator_surface_new,
  optionsCreator_doorRail_new,
  optionsCreator_B_new,
} from "fakeDatabase/options/options"

// ==========================================================
// 格子的設定
import { prodCellConfigOri } from "fakeDatabase/domestic/quotation/fakeQuotProductionList_new"
const { cellConfig } = prodCellConfigOri()

type ToptionsObjKey = keyof TproductObject
type ToptionsObjList = {
  [key in ToptionsObjKey]: ToptionPlus
}
const optionsObjList: ToptionsObjList = {
  quoteType: optionsCreator_quoteType_new(),
  material: optionsCreator_material_new(),
  surface: optionsCreator_surface_new(),
  doorRail: optionsCreator_doorRail_new(),
  B: optionsCreator_B_new(),
}
// ==========================================================
// ==========================================================
export default function ProductList({ productStates }:
  { productStates: TuseProduct_new }) {

  const { theadIndex, productList,
    // deleteProduct, copyProduct,
    activeRow, setActiveRow,
    // onInputChange, onSelChange, onCheckboxClick, 
    disabled
  } = productStates

  // =======================================
  const centerReg = /L|W|H|B|typhoonProof|ejectionDoor/
  // =======================================
  return (
    <div className={style.container} >
      {productList.map((dataItem, pIndex) => {
        const { quoteType } = dataItem
        return (
          <CellWithBar key={pIndex} isActive={activeRow === pIndex}>
            <div className={style.row}
              onClick={() => setActiveRow(pIndex)}
            >
              <div className={style.buttonBox}>

                <Icondelete01
                //  onClick={(e) => deleteProduct(e, pIndex)} 
                />
                <IconCopy
                //  onClick={() => copyProduct(pIndex)} 
                />
                <span>1</span>
              </div>
              {theadIndex.map((key) => {
                const { width, id, type } = cellConfig[key]
                const textCenter = centerReg.test(id) ? styleL.textCenter : ""
                const theStyle = { width }
                const stateValue = dataItem[key]
                const TheCell =
                  cellSwitcher({ dataItem, key, type, disabled, stateValue })
                if (key === "ejectionDoor" && quoteType.quoteTypeType !== "rollerDoor")
                  return <div className={`${styleL.column}`} key={key} style={theStyle} />

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
  function cellSwitcher({ dataItem, key, type, disabled, stateValue }:
    {
      dataItem: ProdClass
      key: TprodCellKey
      // key: TproductString | TproductBoolean | TproductObject
      type: string
      disabled: boolean
      stateValue: string | boolean | Toption
    }
  ) {

    const {
      onInputChange, onSelChange, onChcekBoxClick,
    } = dataItem


    switch (type) {

      case "input": {
        if (typeof stateValue !== "string") return null
        const onChange
          = (e: ChangeEvent<HTMLInputElement>) => onInputChange(e, key as keyof TproductString)
        return (
          <Input03
            {...{ stateValue, onChange, disabled }} />
        )
      }

      case "readOnly": {
        if (typeof stateValue !== "string") return null
        const onChange
          = (e: ChangeEvent<HTMLInputElement>) => onInputChange(e, key as keyof TproductString)
        return (
          <Input03
            {...{ stateValue, onChange, disabled: true }} />
        )
      }

      case "select": {
        const options = optionsObjList[key as ToptionsObjKey].options
        const onChange =
          (option: Toption | null) => onSelChange(option, key as keyof TproductObject)
        return (
          <Select03 {...{
            stateValue: stateValue as Toption, options, onChange, disabled
          }} />
        )
      }

      case "selectWithIcon": {
        const options = optionsObjList[key as ToptionsObjKey].options
        const onChange =
          (option: Toption | null) => onSelChange(option, key as keyof TproductObject)

        const customComponents = {
          Option: OptionWithIcon01,
          SingleValue: SingleValueWithIcon01,
        }

        return (
          <Select03 {...{
            stateValue: stateValue as Toption, options, onChange, disabled,
            customComponents
          }} />
        )
      }

      case "checkbox": {
        if (typeof stateValue !== "boolean") return null
        const onClick = () => {
          if (disabled) return
          onChcekBoxClick(key as "ejectionDoor")
        }
        return (
          <div className={styleL.checkbox}>
            <Checkbox01
              stateValue={stateValue}
              disabled={disabled}
              onClick={onClick} />
          </div>
        )
      }
      default:
        return null
    }
  }

} //ProductList

// ================================================

