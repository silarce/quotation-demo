import {
  ChangeEvent,
  Fragment, useState
} from "react"

// globalGear
import Select03 from "components/global/gear/select/select03"

// icon
import { IconSearch } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./searchBar.module.scss"

// type
import { Toption } from "components/global/gear/select/select03"

interface TsearchObj {
  [key: string]: string
}

interface TsearchTargetSel {
  // stateValue: Toption | null
  options: Toption[]
  placeholder?: string
  // onChange: (option: Toption | null) => void
  className?: string
  width?: string
}

interface TsearchTargetInput {
  // stateValue: string
  placeholder?: string
  // onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
  width?: string
  options?: undefined
}

export type TdoSearch
  = (valueArr: (Toption | null | string)[]) => void

interface TsearchGroup {
  searchTargetList: (TsearchTargetSel | TsearchTargetInput)[]
  doSearch: TdoSearch
}




export default function SearchBar({ searchTargetList, doSearch, className = "" }:
  {
    searchTargetList: (TsearchTargetSel | TsearchTargetInput)[]
    doSearch: TdoSearch
    className?: string
  }) {


  const [valueArr, setValueArr]
    = useState<(Toption | null | string)[]>([])


  return (
    <div className={`${style.container} ${className}`}>

      {searchTargetList.map((item, index) => {
        const { options, placeholder, width }
          = item
        const className = item.className || ""
        const theStyle = { width }
        if (options) return (
          <div className={style.selectBox} key={index} style={theStyle}>
            <Select03
              className={`${style.select} ${className}`}
              stateValue={valueArr[index] ?? options[0]}
              options={options}
              placeholder={placeholder}
              onChange={(option: Toption | null) => {
                if (!option) return
                setValueArr(arr => {
                  arr[index] = option
                  return [...arr]
                })
              }} />
          </div>
        )
        else return (
          <Fragment key={index}>
            <div className={style.pilar} />
            <label className={`${style.label} ${className}`}>
              <input type="text" autoComplete="off"
                style={theStyle}
                placeholder={placeholder}
                value={valueArr[index] as string ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  setValueArr(arr => {
                    arr[index] = value
                    return [...arr]
                  })
                }}
              />
            </label>
          </Fragment>
        )
      })}

      <IconSearch className={style.iconSearch}
        onClick={() => { doSearch(valueArr) }}
      />
    </div>
  )
}


export type { TsearchObj, TsearchGroup }







