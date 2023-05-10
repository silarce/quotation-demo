
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

import { Toption } from "fakeDatabase/options/options"


// ==========================================================
// ==========================================================
import { Class_legacyQuotation } from "hooks/quotation/useLegacyQuotation"
import type {
  TmainProdInputCellType, TmainProdSelectWithIconCellType,
  TmainProdCheckboxCellType
} from "hooks/quotation/useLegacyQuotation"


// ==========================================================
// ==========================================================
export default function ProductList_legacy(
  { classQuotation, disabled }:
    {
      classQuotation: Class_legacyQuotation
      disabled: boolean
    }) {

  const {
    mainProductArr,
    mainProdCellConfig: prodCellConfig,
    activeMainProd,
    delMainProd, copyMainProd,
  } = classQuotation


  const theadIndex = prodCellConfig.keyList
  // =======================================
  const centerReg = /L|W|h|B|typhoonProof|ejectionDoor/
  // =======================================
  return (
    <div className={style.container} >
      {mainProductArr.map((dataItem, pIndex) => {
        return (
          <CellWithBar key={pIndex} isActive={activeMainProd === pIndex}>
            <div className={style.row}
              onClick={() => classQuotation.activeMainProd = pIndex}
            >
              <div className={style.buttonBox}>

                <IconDelete01
                  onClick={(e) => { e.stopPropagation(), delMainProd(pIndex) }}
                />
                <IconCopy
                  onClick={() => copyMainProd(pIndex)}
                />
                {/* <span>{pIndex + 1}</span> */}
              </div>
              {theadIndex.map((key) => {
                const { width, id, type, inputType } = prodCellConfig.cellConfig[key]
                const textCenter = centerReg.test(id) ? styleL.textCenter : ""
                const theStyle = { width }
                const stateValue = dataItem[key]
                const TheCell =
                  cellSwitcher({
                    dataItem, key, type, disabled, stateValue, inputType,
                  })
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
  function cellSwitcher({ dataItem, key, type, disabled, stateValue, inputType }:
    {
      dataItem: Class_legacyQuotation["mainProductArr"][number]
      key: Class_legacyQuotation["mainProdCellConfig"]["keyList"][number]
      type: "input" | "selectWithIcon" | "checkbox"
      disabled: boolean
      stateValue: string | boolean | Toption
      inputType?: string
    }
  ) {

    switch (type) {

      case "input": {
        if (typeof stateValue !== "string") return null
        const onChange
          = (value: string) => dataItem[key as keyof TmainProdInputCellType] = value

        return (
          <InputSel
            disabled={disabled}
            inputProps={{
              value: stateValue,
              onChange: onChange,
              inputType: inputType
            }}
          />
        )
      }


      case "selectWithIcon": {
        if (typeof stateValue === "boolean") return null
        let options: Toption[]
        // if (key === "doorRail") options = dataItem.doorRailOptions
        // else options = optionsObjList[key as ToptionsObjKey]
        options = dataItem.doorRailOptions

        const onChange =
          (option: Toption | null) => dataItem[key as keyof TmainProdSelectWithIconCellType] = option!.value
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
              fontSize: "16px",
              customComponents: customComponents,
              selClassNames: {
                singleValue: () => style.inputSelSingleValue,
                placeholder: () => style.inputSelPlaceholder,
                input: () => style.inputSelInput,
              }
            }}
          />
        )
      }

      case "checkbox": {
        if (typeof stateValue !== "boolean") return null
        const onClick = () => {
          if (disabled) return
          dataItem[key as keyof TmainProdCheckboxCellType] = !dataItem[key]
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
