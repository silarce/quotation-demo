// input02是有標題的input
// input02是有標題的input
// input02是有標題的input
// input02是有標題的input
// input02是有標題的input



import { ChangeEvent } from "react"
// 產生隨機字串(作為id)
import { nanoid } from 'nanoid'

// ui
import TextareaAutosize from 'react-textarea-autosize';

// antd
import { Input } from 'antd';
const { TextArea } = Input;

// css
import style from "./input02.module.scss"

const Input02 = (
  { label, stateValue, placeholder, onChange,
    id, className, width, labelWidth, gap,
    disabled
  }:
    {
      label: string,
      stateValue: string | number | undefined | null,
      // onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
      onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void,
      placeholder?: string | false,
      id?: string | number
      className?: string
      width?: string
      labelWidth?: string
      gap?: string
      disabled?: boolean | undefined
    }) => {
  // ========================================================
  className = className ? className : ""
  // ========================================================
  if (id === undefined) id = nanoid()
  id = `${id}`

  if (placeholder === undefined) placeholder = `請輸入${label}`
  if (placeholder === false) placeholder = ""

  // ========================================================

  const lableStyle = {
    width: width ? width : "",
    gridTemplateColumns: labelWidth ? `${labelWidth} auto` : "",
    gap: gap ? gap : "",
  }

  const styleDisabled = disabled ? style.disabled : ""

  // ========================================================

  return (
    <label className={`${style.label} ${className} ${styleDisabled}`} htmlFor={id}
      style={lableStyle}
    >
      <span>{label}</span>

      <TextareaAutosize className={style.textArea}
        id={id} placeholder={placeholder}
        autoComplete="off"
        value={stateValue ?? ""}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.code === "Enter") e.preventDefault()
          if (e.code === "NumpadEnter") e.preventDefault()
        }}
        disabled={disabled}
      />

      {/* <input id={id} type="text" placeholder={placeholder}
        autoComplete="off"
        value={stateValue}
        onChange={onChange}
        disabled={disabled}
      /> */}


      <hr />
    </label>
  )
}


export default Input02


