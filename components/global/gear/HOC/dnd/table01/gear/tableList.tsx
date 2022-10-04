import { Dispatch, SetStateAction } from "react"


// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"

// css
import style from "../table01.module.scss"


// type
import { Ttable01, Ttable01Config } from "../table01"


export default function TableList
  <N extends string, I extends string>
  ({
    tableData,
    config: theConfig,
    theadIndex,
  }:
    {
      tableData: Ttable01<N, I>
      config: Ttable01Config<N, I>
      theadIndex: (N | I)[]
    }) {

  const { list } = tableData
  const { keyIndex, config } = theConfig

  const centerReg = /L|H|B/

  return (
    <div className={style.tableList} >
      {list.map((item, rowIndex) => {
        return (
          <CellWithBar key={rowIndex} >
            <div className={style.row}>
              <div className={style.rowIndex}><span>{rowIndex + 1}</span></div>
              {theadIndex.map((key, columnIndex) => {
                const { width, id } = config[key]
                const { value, icon } = item[key]
                const theStyle = { width }
                const textCenter = centerReg.test(id) ? style.textCenter : ""
                return (
                  <div className={`${style.column} ${textCenter}`}
                    key={key} style={theStyle} >
                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                    {icon && <img src={icon} alt="" />}
                    <span>{value}</span>
                  </div>
                )
              })}
            </div>
          </CellWithBar>
        )
      })}
    </div>
  )
}
