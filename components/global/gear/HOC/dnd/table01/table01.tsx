import { useState } from "react"


// gear
import DndThead from "./gear/dndThead"
import TableList from "./gear/tableList"

// css
import style from "./table01.module.scss"

// type
import { TdndCellConfigkeys } from "config/dndCellConfig"


export default function Table01
  // <N extends string, I extends string>
  <N extends TdndCellConfigkeys, I extends TdndCellConfigkeys>
  ({ tableData, config, keyIndex }:
    {
      tableData: Ttable01<N, I>
      config: Ttable01Config<N, I>
      keyIndex: (N | I)[]
    }) {


  // const [theadIndex, setTheadIndex] = useState<(N | I)[]>(keyIndex)
  const [theadIndex, setTheadIndex] = useState<(N | I)[]>(keyIndex)

  const [allowMove, setAllowMove] = useState(false)

  return (
    <div className={style.table01}>
      <div className={style.header}>
        <h2>主產品設定</h2>
        <button className={((allowMove && style.active) || "")}
          onClick={() => setAllowMove(state => !state)}>
          {allowMove ? "確定排序" : "設定排序"}
        </button>
      </div>
      <DndThead<N, I>
        config={config} allowMove={allowMove}
        theadIndex={theadIndex} setTheadIndex={setTheadIndex}
      />
      <TableList<N, I>
        theadIndex={theadIndex}
        tableData={tableData}
      />
    </div>
  )
}

// =========================================================
// =========================================================
// =========================================================
type Ttable01<N extends TdndCellConfigkeys, I extends TdndCellConfigkeys> = {
  list: (
    {
      [key in N]: {
        value: string
      }
    }
    &
    {
      [key in I]: {
        value: string
        icon: string
      }
    }
  )[]
}

// type Ttable01Config<keys extends string> = {
//   keyIndex: keys[]
type Ttable01Config<N extends TdndCellConfigkeys, I extends TdndCellConfigkeys> = {
  keyIndex: (N | I)[]
  config: {
    [key in (N | I)]: {
      id: key
      label: string
      width: string
    }
  }
}



export type { Ttable01, Ttable01Config }