import { useState } from "react"
import classNames from "classnames"

import Image from "next/image"

// icon
import iconCheck from "public/image/icon/check.svg"

// css
import scss from "./_button.module.scss"
import scss2 from "./checkButton.module.scss"

export default function CheckButton(
  {
    checkLabel,
    uncheckLable,
    onClick,
    className,
    px,
    defaultCheck,

    value,

  }:
    {
      checkLabel?: string
      uncheckLable?: string
      onClick: (isCheck: boolean) => void
      className?: string
      px?: "px22" | "px44" | "px2227"
      defaultCheck?: boolean

      value?: boolean

    }) {

  const [isCheck, setIsCheck] = useState(defaultCheck ?? false)

  const theOnClick = () => {
    onClick(isCheck)
    if (value !== undefined) return
    setIsCheck(state => !state)
  }

  const label = isCheck ? checkLabel : uncheckLable

  return (
    <button className={classNames(scss.button, px && scss[px], className)}
      onClick={theOnClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className={classNames(scss2.checkbox)}>
        {/* {isCheck && <Image src={iconCheck} alt="check" />} */}
        {value === undefined && isCheck && <Image src={iconCheck} alt="check" />}
        {value && <Image src={iconCheck} alt="check" />}
      </div>
      {label && <span >{label}</span>}
    </button>
  )
}

// ======================================================

