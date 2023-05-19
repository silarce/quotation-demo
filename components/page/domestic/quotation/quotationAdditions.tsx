import { useState, useEffect } from "react"

import classNames from "classnames"

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"
import InputSel from "components/global/gear/inputAndSel/inputSel"
import AddButton from "components/global/gear/button/addButton"

import { Class_legacyContract, Class_addition } from "hooks/quotation/useLegacyContract"

// icon
import { IconDelete01, IconCopy } from "public/image/icon/svgComponent/svgIcons"


// css
import styleL from "./local.module.scss"
import scss from "./quotationAdditions.module.scss"




export default function QuotationAdditions(
  {
    legacyContract,
    disabled }:
    {
      legacyContract: Class_legacyContract
      disabled: boolean
    }
) {

  const [activeIndex, setActiveIndex] = useState(-1)

  const { additionCellConfig: additionCellConfig, } = legacyContract



  const additionArr = legacyContract.classAdditionArr

  const { addAddition, delAddition } = legacyContract ?? {}

  const additionKeyindex = additionCellConfig.keyList
  const cellConfig = additionCellConfig.cellConfig



  return (
    <div className={scss.container}>
      <div className={styleL.header}>
        <h2>其他設定</h2>
      </div>

      <div className={styleL.scrollDiv + " " + scss.scrollDiv}>

        {/* thead */}
        <div className={styleL.thead + " " + scss.thead}>

          <div className={scss.delBtn}>
            <span></span>
          </div>
          {/* <div className={styleL.rowIndex}>
            <span></span>
          </div> */}
          {additionKeyindex.map((item, index) => {
            const { label, flex, width } = cellConfig[item]
            const theStyle = { width, flex }
            return (
              <div className={styleL.theadCell} key={index} style={theStyle}>
                <span>{label}</span>
              </div>
            )
          })}
        </div>


        {/* tbody */}
        {/* <div>
          {additionArr.length === 0 &&
            <>
              <div className={styleL.rowIndex}></div>
              <span className={styleL.noListTip}>尚未選擇產品</span>
            </>}
        </div> */}
        {/*  */}
        {additionArr?.map((part, pIndex) => {
          return (
            <CellWithBar key={pIndex} isActive={activeIndex === pIndex}
              className={classNames(styleL.row, scss.row)}
              onClick={() => { setActiveIndex(pIndex) }}
            >
              <div className={scss.delBtn}>
                <IconDelete01
                  onClick={(e) => { e.stopPropagation(), delAddition(pIndex) }}
                />
              </div>

              {/* <div className={styleL.rowIndex}>
                <span>{pIndex + 1}</span>
              </div> */}

              {additionKeyindex.map((key, cIndex) => {
                const { width, flex, type, inputType } = cellConfig[key]
                const theStyle = { width, flex }


                return (
                  <div className={styleL.column} key={cIndex} style={theStyle}>
                    <InputSel
                      disabled={disabled}
                      inputProps={{
                        value: part[key],
                        onChange: (v) => part[key] = v,
                        inputType: inputType
                      }}
                    />
                  </div>
                )
              })}
            </CellWithBar>
          )
        })}
        {!disabled &&
          <AddButton
            className={scss.addBtn}
            label="新增項目"
            onClick={addAddition} />
        }
      </div>

    </div>
  )

}




