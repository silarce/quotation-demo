import { useState, useMemo, CSSProperties } from "react"
import classNames from "classnames";
import Image from "next/image";

// icon
import iconEyeOpen from "public/image/icon/eyeOpen.svg"
import iconEyeProhibit from "public/image/icon/eyeProhibit.svg"

// css
import scss from "./Input_pw.module.scss"



export default function Input_pw(
  {
    value,
    onChange,
    label,
    placeholder,
    inputType,
    width,
    captionWidth,
    firstGap,
    secondGap,
    className,
  }:
    {
      value: string
      onChange: (v: string) => void

      label: string
      placeholder?: string

      inputType?: "password" | "text" | "auto"

      width?: CSSProperties["width"]
      captionWidth?: CSSProperties["width"]
      firstGap?: CSSProperties["paddingRight"]
      secondGap?: CSSProperties["paddingLeft"]
      className?: string
    }
) {

  const [isShowPw, setIsShowPw] = useState(false)

  const iconEye = isShowPw ? iconEyeOpen : iconEyeProhibit

  let theInputType = inputType
  if (!inputType || inputType === "auto") {
    theInputType = isShowPw ? "text" : "password"
  }

  return (
    <label className={classNames(scss.container, className)}
      style={{ width }}
    >
      <span style={{ width: captionWidth, marginRight: firstGap }}>
        {label}
      </span>
      <input
        type={theInputType}
        value={value}
        onChange={(e) => { onChange(e.target.value) }}
        placeholder={placeholder ?? `請輸入${label}`}
        autoComplete="password"
      />
      {inputType === "auto" &&
        <Image src={iconEye} alt="切換密碼顯示"
          style={{ marginLeft: secondGap }}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setIsShowPw((state) => !state)
          }
          } />
      }
    </label>
  )

}