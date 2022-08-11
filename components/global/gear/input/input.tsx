
import { ChangeEvent } from "react"
// 產生隨機字串(作為id)
import { nanoid } from 'nanoid'

// css
import style from "./input.module.scss"

const Input01 = ({ label, stateValue, placeholder, onChange,
  id, className, width, labelWidth }:
  {
    label: string,
    stateValue: string | number,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    id?: string | number
    className?: string
    width?: string
    labelWidth?: string
  }) => {
  // ========================================================
  className = className ? className : ""
  // ========================================================
  if (id === undefined) id = nanoid()
  id = `${id}`
  // ========================================================

  const lableStyle = {
    width: width ? width : "",
    gridTemplateColumns: labelWidth ? `${labelWidth} auto` : ""
  }
  // ========================================================

  return (
    <label className={`${style.label} ${className}`} htmlFor={id}
      style={lableStyle}
    >
      <span>{label}</span>
      <input id={id} type="text" placeholder={placeholder}
        autoComplete="off"
        value={stateValue}
        onChange={onChange}
      />
      <hr />
    </label>
  )
}

export { Input01 }


