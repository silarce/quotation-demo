

// global
import CellWithBar from "components/global/gear/cell/cellWithBar"



import { ChangeEvent, Dispatch, SetStateAction } from "react"



// css
import style from "./dispatchList.module.scss"

// fake
import { TfakeDispatch } from "pages/worksDepartment/contractList/[contractId]/dispatchList"


export default function List(
  { list, setList }:
    {
      list: TfakeDispatch[]
      setList: Dispatch<SetStateAction<TfakeDispatch[]>>
    }) {

  

  return (
    <div className={style.list}>
      <div className={style.thead}>
        {indexKeys01.map((key, index) => {
          const { label } = config01[key]
          return (
            <div key={index}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      <div className={style.tbody}>
        {list.map((item, index) => {
          return (
            <CellWithBar className={style.row} key={index}>
              {indexKeys01.map((key, index) => {
                const value = item[key]
                return (
                  <div key={index}>
                    <span>{value}</span>
                  </div>
                )
              })}
            </CellWithBar>
          )
        })}


      </div>
    </div>
  )
}

// ==================================================


type TindexKey01 = keyof Pick<TfakeDispatch,
  "日期" | "工務人員" | "辦理事項"
>

const indexKeys01: TindexKey01[]
  = ["日期", "工務人員", "辦理事項"]

type Tconfig<keys extends string> = {
  [key in keys]: {
    label: string
  }
}

const config01: Tconfig<TindexKey01> = {
  日期: {
    label: "日期"
  },
  工務人員: {
    label: "工務人員"
  },
  辦理事項: {
    label: "辦理事項"
  },

}
