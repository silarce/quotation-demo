import {
  ChangeEvent,
  Fragment, useState
} from "react"

import classNames from "classnames"

// globalGear
import InputSel from "../../inputAndSel/inputSel"

// icon
import { IconSearch } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./searchBar.module.scss"

// type
import { Toption } from "fakeDatabase/options/options"

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
  defaultValue?: string | Toption
}

interface TsearchTargetInput {
  // stateValue: string
  placeholder?: string
  // onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
  width?: string
  options?: undefined
  defaultValue?: string
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
    = useState<(Toption | null | string)[]>(
      searchTargetList.map((item) => {
        const { defaultValue, options } = item

        if (defaultValue) return defaultValue
        if (options) return options[0]
        return ""
      })
    )

  return (
    <div className={`${style.container} ${className}`}>

      {searchTargetList.map((item, index) => {
        const { options, placeholder, width, defaultValue }
          = item
        const className = item.className || ""
        const theStyle = { width }
        if (valueArr[index] === undefined) {
          setValueArr(arr => {
            arr[index] = options?.[0] ?? null
            return [...arr]
          })
        }
        if (options) return (
          <div className={style.selectBox} key={index}
            style={theStyle}>

            <InputSel
              className={classNames(style.select, className)}
              showBaseline="invisible"
              selectProps={{
                value: valueArr[index] ?? options[0],                
                // value: undefined,                
                options,
                arrowType: "black",
                onChange: (option: Toption | null) => {
                  if (!option) return
                  setValueArr(arr => {
                    arr[index] = option
                    return [...arr]
                  })
                },
                selClassNames: {
                  option: () => style.selOption,
                  singleValue: () => style.selSinglevalue,
                  placeholder: () => style.selPlaceholder
                }
              }}
            />

          </div>
        )
        else return (
          <Fragment key={index}>
            <div className={style.pilar} />
            <label className={`${style.label} ${className}`}>
              <input type="text" autoComplete="off"
                style={theStyle}
                placeholder={placeholder}
                value={typeof valueArr[index] === "string" ? valueArr[index] as string : ""}
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


export type { TsearchObj, TsearchGroup, Toption }







