
import { ReactNode } from "react"

// css
import style from "./cellWithBar.module.scss"

export default function CellWithBar(
  { children, isActive, className, element, onClick }:
    {
      children: ReactNode
      isActive?: boolean
      className?: string
      element?: string
      onClick?: () => void
    }) {

  const active = isActive ? style.active : ""


  return (
    <>
      {element === "li"
        ?
        <li className={`${style.container} ${active} ${className}`}
          onClick={onClick}
        >
          {children}
          < div className={style.bar} />
        </li >
        :
        <div className={`${style.container} ${active} ${className}`}
          onClick={onClick}
        >
          {children}
          < div className={style.bar} />
        </div >

      }
    </>
  )
}


