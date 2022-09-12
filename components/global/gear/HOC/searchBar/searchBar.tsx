import {
  ChangeEvent,
  Fragment
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
  stateValue: Toption | null
  options: Toption[]
  placeholder: string
  onChange: (option: Toption | null) => void
  className?: string
  width?: string
}

interface TsearchTargetInput {
  stateValue: string
  placeholder?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
  width?: string
  options?: undefined
}

interface TsearchGroup {
  searchTargetList: (TsearchTargetSel | TsearchTargetInput)[]
  doSearch: () => void
}




export default function SearchBar({ searchTargetList, doSearch, className = "" }:
  {
    searchTargetList: (TsearchTargetSel | TsearchTargetInput)[]
    doSearch: () => void
    className?: string
  }) {

  return (
    <div className={`${style.container} ${className}`}>
      {searchTargetList.map((target, index) => {
        const { stateValue, options, placeholder, onChange, width } = target
        const className = target.className || ""
        const theStyle = { width }
        if (options) return (
          <div className={style.selectBox} key={index} style={theStyle}>
            <Select03
              className={`${style.select} ${className}`}
              stateValue={stateValue}
              options={options}
              placeholder={placeholder}
              onChange={onChange} />
          </div>
        )
        else return (
          <Fragment key={index}>
            <div className={style.pilar} />
            <label className={`${style.label} ${className}`}>
              <input type="text" autoComplete="off"
                style={theStyle}
                placeholder={placeholder}
                value={stateValue}
                onChange={onChange}
              />
            </label>
          </Fragment>
        )
      })}
      <IconSearch className={style.iconSearch} onClick={doSearch} />
    </div>
  )
}


export type { TsearchObj, TsearchGroup }







