import { ChangeEvent } from "react"

import { components } from "react-select";
const { Option } = components

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"
import Checkbox01 from "components/global/gear/checkbox/checkbox01"
import InputSel from "components/global/gear/inputAndSel/inputSel";
import { OptionWithIcon01 } from "components/global/gear/select/optionWithIcon";
import { SingleValueWithIcon01 } from "components/global/gear/select/singleValueWithIcon";



// icon
import { IconDelete01, IconCopy } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./productList.module.scss"
import styleL from "../local.module.scss"

// data type
import {
  TuseProduct, ProdClass, TprodKeys,
  prodCellConfigOri
} from "../hook/useProduct"
import {
  TproductString,
  TproductObject,
} from "fakeDatabase/domestic/quotation/fakeQuotProductionList"
// options
import {
  Toption, ToptionPlus,
  optionsCreator_quoteType,
  optionsCreator_material,
  optionsCreator_surface,
  optionsCreator_doorRail,
  optionsCreator_B,
  optionsCreator_horsepower,
  optionsCreator_doorType,
} from "fakeDatabase/options/options"
import Placeholder from "react-select/dist/declarations/src/components/Placeholder";



// ==========================================================
// 格子的設定
const { cellConfig } = prodCellConfigOri()

type ToptionsObjKey = keyof TproductObject
type ToptionsObjList = {
  [key in ToptionsObjKey]: Toption[]
}
const optionsObjList: ToptionsObjList = {
  quoteType: optionsCreator_quoteType(),
  material: optionsCreator_material(),
  surface: optionsCreator_surface(),
  doorRail: optionsCreator_doorRail(),
  B: optionsCreator_B(),
  horsepower: optionsCreator_horsepower(),
  doorType: optionsCreator_doorType(),
}
// ==========================================================
// ==========================================================
export default function ProductList({ productStates }:
  { productStates: TuseProduct }) {

  const { theadIndex, productList,
    deleteProduct, copyProduct,
    activeRow, setActiveRow,
    disabled
  } = productStates

  // =======================================
  const centerReg = /L|W|H|B|typhoonProof|ejectionDoor/
  // =======================================
  return (
    <div className={style.container} >
      {productList.map((dataItem, pIndex) => {
        const { quoteType, doorType } = dataItem
        return (
          <CellWithBar key={pIndex} isActive={activeRow === pIndex}>
            <div className={style.row}
              onClick={() => setActiveRow(pIndex)}
            >
              <div className={style.buttonBox}>

                <IconDelete01
                  onClick={(e) => deleteProduct(e, pIndex)}
                />
                <IconCopy
                  onClick={() => copyProduct(pIndex)}
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

                if (
                  (key === "ejectionDoor" && quoteType.quoteTypeType !== "rollerDoor")
                  || (key === "typhoonProof" && doorType.value !== "SJ-302")
                ) return <div className={`${styleL.column}`} key={key} style={theStyle} />

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
      key: TprodKeys
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
          = (value: string) => onInputChange(value, key as keyof TproductString)
        return (
          <InputSel
            disabled={disabled}
            inputProps={{
              value: stateValue,
              onChange: onChange
            }}
          />
        )
      }

      case "readOnly": {
        if (typeof stateValue !== "string") return null
        const onChange
          = (value: string) => onInputChange(value, key as keyof TproductString)
        return (
          <InputSel
            disabled={true}
            showBaseline="invisible"
            inputProps={{
              value: stateValue,
              onChange: onChange
            }}
          />
        )
      }

      case "select": {
        if (typeof stateValue === "boolean") return null
        const options = optionsObjList[key as ToptionsObjKey]
        const onChange =
          (option: Toption | null) => onSelChange(option, key as keyof TproductObject)
        return (
          <InputSel
            disabled={disabled}
            selectProps={{
              value: stateValue,
              options: options,
              onChange: onChange,
              arrowType: "black",
              classNames: {
                singleValue: style.inputSelSingleValue,
                placeholder: style.inputSelPlaceholder,
                input: style.inputSelInput
              }
            }}
          />
        )
      }

      case "selectWithIcon": {
        if (typeof stateValue === "boolean") return null
        const options = optionsObjList[key as ToptionsObjKey]
        const onChange =
          (option: Toption | null) => onSelChange(option, key as keyof TproductObject)

        const customComponents = {
          Option: OptionWithIcon01,
          SingleValue: SingleValueWithIcon01,
        }

        return (
          <InputSel
            disabled={disabled}
            selectProps={{
              value: stateValue,
              options: options,
              onChange: onChange,
              arrowType: "black",
              customComponents: customComponents,
              classNames: {
                singleValue: style.inputSelSingleValue,
                placeholder: style.inputSelPlaceholder,
                input: style.inputSelInput,
              }
            }}
          />
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
