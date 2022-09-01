import { useState } from "react"

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"

// icon
import { Icondelete01, IconCopy } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./productList.module.scss"
import styleL from "../local.module.scss"

// data type
import { TuseProduct } from "../hook/useProduct"

export default function ProductList({ productStates }:
  { productStates: TuseProduct }) {

  const { theadList, dndBody,
    deleteProduct, copyProduct,
    activeRow, setActiveRow,
  } = productStates

  // =======================================
  const lwhbReg = /L|W|H|B/
  // =======================================

  return (
    <div className={style.container} >
      {dndBody.map((item, pIndex) => {
        return (
          <CellWithBar key={pIndex} isActive={activeRow === pIndex}>
            <div className={style.row}
              onClick={() => setActiveRow(pIndex)}
            >
              <div className={style.buttonBox}>
                <Icondelete01 onClick={() => deleteProduct(pIndex)} />
                <IconCopy onClick={() => copyProduct(pIndex)} />
                <span>1</span>
              </div>
              {item.map((item, cIndex) => {
                const { width, id } = theadList[cIndex]
                const textCenter = lwhbReg.test(id) ? styleL.textCenter : ""
                const theStyle = { width }
                return (
                  <div className={`${styleL.column} ${textCenter}`} key={`${pIndex}${cIndex}`} style={theStyle} >
                    {item}
                  </div>
                )
              })} {/* column */}
            </div> {/* row */}
          </CellWithBar>
        )
      })}
    </div>
  )
}

// ================================================
