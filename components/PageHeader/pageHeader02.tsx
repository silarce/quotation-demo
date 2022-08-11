import { useState, Fragment } from "react"

// components
import MyButton from "components/global/gear/button/myButton"
import RedButton from "components/global/gear/button/redButton"
import AddButton from "components/global/gear/button/addButton"
import InputSearch from "components/global/gear/input/inputSearch"

// css
import style from "./pageHeader02.module.scss"

// ========================================================

// type
interface Ttag {
  label: string
  onClick: () => void
}

interface Tpanel01 {
  type: "myButton" | "redButton" | "addButton"
  label: string
  placeholder?: undefined
  onClick: () => void
}
interface Tpanel02 {
  type: "inputSearch"
  placeholder: string
  label?: undefined
  onClick: (value: string) => void
}

type TpanelList = (Tpanel01 | Tpanel02)[]



export default function PageHeader02(
  {
    tag,
    tagList = [],
    panelList = []
  }:
    {
      tag?: string
      tagList?: Ttag[]
      panelList?: TpanelList
    }) {

  const [active, setActive] = useState(0)

  return (
    <div className={style.container}>

      {/* tagBox */}
      <div className={style.tagBox}>
        {/* simple tag */}
        {tag && <span>{tag}</span>}
        {/* tags */}
        {tagList.map((item, index) => {
          const { label, onClick } = item
          const theOnClick = () => {
            onClick();
            setActive(index)
          }
          const isActive = active === index ? style.active : ""
          return (
            <button key={index} className={isActive}
              onClick={theOnClick}
            >{label}
            </button>
          )
        })}
      </div>
      {/* buttonBox */}
      <div className={style.buttonBox}>
        {panelList.map((item, index) => {
          const { label, type, onClick, placeholder } = item

          return (
            <Fragment key={index}>
              {
                type === "myButton" ? <MyButton {...{ label, onClick }} />
                  : type === "redButton" ? <RedButton {...{ label, onClick }} />
                    : type === "addButton" ? <AddButton {...{ label, onClick }} />
                      : type === "inputSearch" ? <InputSearch {...{ placeholder, onClick }} />
                        : <></>
              }
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}


export type { TpanelList }
