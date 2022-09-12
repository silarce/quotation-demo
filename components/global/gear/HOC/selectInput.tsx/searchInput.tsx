import {
  ChangeEvent,
  Fragment
} from "react"


// css
import style from "./searchInput.module.scss"




// globalGear
import Select03, { Toption } from "components/global/gear/select/select03"




interface TselectProps {
  stateValue: Toption | null
  options: Toption[]
  placeholder: string
  onChange: (option: Toption | null) => void
  className?: string
  width?: string
}

interface TinputProps {
  stateValue: string
  placeholder?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
  width?: string
  options?: undefined
}



export default function SearchInput({ label, searchInputPropsList }:
  {
    label: string
    searchInputPropsList: (TselectProps | TinputProps)[]
  }) {




  return (
    <div className={style.container}>

      <span>{label}</span>

      {searchInputPropsList.map((target, index) => {
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
          <input className={style.input} key={index}
            type="text" autoComplete="off"
            style={theStyle}
            placeholder={placeholder}
            value={stateValue}
            onChange={onChange}
          />
        )
      })}
    </div>
  )
}

// ================================================

export type {
  TselectProps,
  TinputProps,
}


