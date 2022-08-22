import { useState } from "react"

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"

// icon
import { Icondelete01, IconCopy } from "public/image/icon/svgComponent/svgIcons copy"

// css
import style from "./productList.module.scss"

// data type
import { TuseProduct } from "./useProduct"

export default function ProductList({ productStates }:
  { productStates: TuseProduct }) {

  const { theadList, dndBody } = productStates

  // =======================================
  const [isActive, setIsActive] = useState(-1)
  // =======================================
  return (
    <div className={style.container} >
      {dndBody.map((item, pIndex) => {
        return (

          <CellWithBar key={pIndex} isActive={isActive === pIndex}>
            <div className={style.row}
              onFocus={() => setIsActive(pIndex)}
              onBlur={() => setIsActive(-1)}
            >
              <div className={style.buttonBox}>
                <Icondelete01 />
                <IconCopy />
                <span>1</span>
              </div>
              {item.map((item, cIndex) => {
                const width = theadList[cIndex].width
                const theStyle = { width }
                return (
                  <div className={style.column} key={`${pIndex}${cIndex}`} style={theStyle} >
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
