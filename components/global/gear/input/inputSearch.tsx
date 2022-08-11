

import {
  useState,
  MouseEvent
} from "react"

// icon
import { IconSearch } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./inputSearch.module.scss"


export default function InputSearch({ placeholder, onClick, className }:
  {
    placeholder: string
    onClick: (value: string) => void
    className?: string
  }) {

  const [value, setValue] = useState("")
  const newOnClick = () => { onClick(value) }


  return (
    <div className={`${style.inputSearch} ${className || ""}`}>
      <input type="text" placeholder={placeholder}
        value={value}
        onChange={e => { setValue(e.target.value) }}
      />
      <IconSearch onClick={newOnClick} />
      <div className={style.borderBottom} />
    </div>
  )
}