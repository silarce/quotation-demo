
import { ChangeEvent } from "react"
// 產生隨機字串(作為id)
import { nanoid } from 'nanoid'

// css
import style from "./input03.module.scss"

const Input03 = (
  { stateValue, placeholder, onChange,
    id, className, width, labelWidth, gap,
    disabled, showBaseline,
  }:
    {
      stateValue: string | number,
      onChange: (e: ChangeEvent<HTMLInputElement>) => void,
      placeholder?: string
      id?: string | number
      className?: string
      width?: string
      labelWidth?: string
      gap?: string
      disabled?: boolean | undefined
      showBaseline?: "always" | "never"
    }) => {
  // ========================================================
  className = className ? className : ""
  // ========================================================
  if (id === undefined) id = nanoid()
  id = `${id}`


  // if (!placeholder) placeholder = ""
  // if (placeholder === undefined) placeholder = `請輸入`
  // if (placeholder === false) placeholder = ""

  // ========================================================

  const lableStyle = {
    width: width ? width : "",
    gridTemplateColumns: labelWidth ? `${labelWidth} auto` : "",
    gap: gap ? gap : "",
  }

  const styleDisabled = disabled ? style.disabled : ""
  const styleShowBaseline =
    showBaseline === "always" ? style.alwaysBaseline :
      showBaseline === "never" ? style.neverBaseline : ""

  // ========================================================

  return (
    <label className={`${style.label} ${className} ${styleDisabled}`} htmlFor={id}
      style={lableStyle}
    >
      <input id={id} type="text" placeholder={placeholder}
        autoComplete="off"
        value={stateValue}
        onChange={onChange}
        disabled={disabled}
      />
      <hr className={`${styleShowBaseline}`} />
    </label>
  )
}

type Tinput03 = typeof Input03
export type { Tinput03 }
export default Input03


