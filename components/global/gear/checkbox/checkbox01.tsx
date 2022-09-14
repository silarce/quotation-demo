

// css
import style from "./checkbox.module.scss"

import checkIcon from "public/image/icon/check.svg"


export default function Checkbox01({ stateValue, onClick, className }:
  {
    stateValue: boolean
    onClick: () => void
    className?: string
  }) {

  return (
    <div className={`${style.checkbox01} ${className}`} onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {stateValue && <img src={checkIcon.src} alt="" />}
    </div>
  )
}
