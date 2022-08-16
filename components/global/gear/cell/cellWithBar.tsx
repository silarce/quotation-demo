
import { ReactNode } from "react"

// css
import style from "./cellWithBar.module.scss"

export default function CellWithBar(
  { children, isActive, className, element }:
    {
      children: ReactNode
      isActive?: boolean
      className?: string
      element?: string
    }) {

  const active = isActive ? style.active : ""


  return (
    <>
      {element === "li"
        ?
        <li className={`${style.container} ${active} ${className}`}>
          {children}
          < div className={style.bar} />
        </li >
        :
        <div className={`${style.container} ${active} ${className}`}>
          {children}
          < div className={style.bar} />
        </div >

      }
    </>
  )
}


