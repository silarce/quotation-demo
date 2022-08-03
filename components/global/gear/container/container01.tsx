
import { ReactNode } from "react"

// css
import style from "./container01.module.scss"


function Container01({ children, label }:
  {
    children: ReactNode
    label: string
  }) {
  return (
    <div className={style.container}>
      <p>{label}</p>
      <div className={style.main}>
        {children}
      </div>
    </div>
  )
}


export { Container01 }