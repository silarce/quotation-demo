import {
  ChangeEvent,
  useState
} from "react"


// css
import style from "./selectInput.module.scss"




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



export default function SelectInput(
  { label, searchInputPropsList, disabled, labelWidth, className }:
    {
      label: string
      searchInputPropsList: (TselectProps | TinputProps)[]
      disabled?: boolean
      labelWidth?: string
      className?: string
    }) {

  const labelStyle = { width: labelWidth }

  const [isFocus, setIsFocus] = useState(false)
  const styleIsFocus = isFocus ? style.isFocus : ""

  const onFocus = () => { setIsFocus(true) }
  const onBlur = () => { setIsFocus(false) }

  return (
    <div className={`${style.container} ${styleIsFocus} ${className}`}>

      {/* <span style={labelStyle}>{label}</span> */}
      <span style={labelStyle}>{label}</span>

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
              onChange={onChange}
              disabled={disabled}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
        )
        else return (
          <input className={style.input} key={index}
            type="text" autoComplete="off"
            style={theStyle}
            placeholder={placeholder}
            value={stateValue}
            onChange={onChange}
            disabled={disabled}
            onFocus={onFocus}
            onBlur={onBlur}
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


