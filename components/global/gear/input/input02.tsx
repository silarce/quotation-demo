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

// css
import style from "./input02.module.scss"

const Input02 = (
  { label, stateValue, placeholder, onChange,
    id, className, width, labelWidth, gap,
    disabled, labelColor, noUnderline
  }:
    {
      label?: string,
      stateValue: string | number | undefined | null,
      // onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
      onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void,
      placeholder?: string | false,
      id?: string | number
      className?: string
      width?: string
      labelWidth?: string
      gap?: string
      disabled?: boolean | undefined,
      labelColor?: string
      noUnderline?: boolean
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
    width: width ? width : undefined,
    gridTemplateColumns:
      !label ? `auto`
        : labelWidth ? `${labelWidth} auto`
          : undefined,
    gap: gap ? gap : undefined,
  }
  // --------------------------
  const styleDisabled = disabled ? style.disabled : ""
  const styleLabelColor = (() => {
    switch (labelColor) {
      case "main": return style.colorMain;
      default: return "";
    }
  })()
  const styleNoUnderline = noUnderline ? style.noUnderline : ""

  // ========================================================

  return (
    <label
      className
      ={[className, style.label, styleDisabled].join(" ")}
      htmlFor={id}
      style={lableStyle}
    >
      {label &&
        <span className={styleLabelColor}>{label}</span>
      }

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
      <hr className={styleNoUnderline} />
    </label>
  )
}


export default Input02


