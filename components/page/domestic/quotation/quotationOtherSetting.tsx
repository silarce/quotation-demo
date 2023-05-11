import { useState, useEffect } from "react"

import classNames from "classnames"

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"
import InputSel from "components/global/gear/inputAndSel/inputSel"
import AddButton from "components/global/gear/button/addButton"

import { Class_legacyQuotation } from "hooks/quotation/useLegacyQuotation"

// icon
import { IconDelete01, IconCopy } from "public/image/icon/svgComponent/svgIcons"


// css
import styleL from "./local.module.scss"
import scss from "./quotationOtherSetting.module.scss"




export default function QuotationOtherSetting(
  {
    classQuotation,
    disabled }:
    {
      classQuotation: Class_legacyQuotation
      disabled: boolean
    }
) {

  const [activeIndex, setActiveIndex] = useState(-1)



  const { partCellConfig, } = classQuotation


  const activeProd = classQuotation.mainProductArr[classQuotation.activeMainProd]
  const partList = activeProd?.partArr ?? []

  const { addPart, removePart } = activeProd ?? {}


  const partKeyindex = partCellConfig.keyList
  const cellConfig = partCellConfig.cellConfig


  useEffect(() => {
    setActiveIndex(-1)
  }, [activeProd])






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
          <div className={styleL.rowIndex}>
            <span></span>
          </div>
          {partKeyindex.map((item, index) => {
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
        <div>
          {partList.length === 0 &&
            <>
              <div className={styleL.rowIndex}></div>
              <span className={styleL.noListTip}>尚未選擇產品</span>
            </>}
        </div>
        {/*  */}
        {partList?.map((part, pIndex) => {
          return (
            <CellWithBar key={pIndex} isActive={activeIndex === pIndex}
              className={classNames(styleL.row, scss.row)}
              onClick={() => { setActiveIndex(pIndex) }}
            >
              <div className={scss.delBtn}>
                <IconDelete01
                  onClick={(e) => { e.stopPropagation(), removePart(pIndex) }}
                />
              </div>

              <div className={styleL.rowIndex}>
                <span>{pIndex + 1}</span>
              </div>

              {partKeyindex.map((key, cIndex) => {
                const { width, flex, type } = cellConfig[key]
                const theStyle = { width, flex }


                return (
                  <div className={styleL.column} key={cIndex} style={theStyle}>
                    <InputSel
                      disabled={disabled}
                      inputProps={{
                        value: part[key],
                        onChange: (v) => part[key] = v
                      }}
                    />
                  </div>
                )
              })}
            </CellWithBar>
          )
        })}
        {activeProd &&
          <AddButton
            className={scss.addBtn}
            label="新增項目"
            onClick={addPart} />
        }
      </div>

    </div>
  )

}




