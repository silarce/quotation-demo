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
  onClick: () => void
  placeholder?: undefined
  className?: string
  img?: string
}
interface Tpanel02 {
  type: "inputSearch"
  placeholder: string
  onClick: (value: string) => void
  label?: undefined
  className?: string
  img?: string
}

type TpanelList = (Tpanel01 | Tpanel02)[]
type TtagList = Ttag[]



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
          const {
            label, type, onClick,
            placeholder, className, img
          } = item

          return (
            <Fragment key={index}>
              {
                type === "myButton" ? <MyButton {...{ label, onClick, className, img }} />
                  : type === "redButton" ? <RedButton {...{ label, onClick, className, img }} />
                    : type === "addButton" ? <AddButton {...{ label, onClick, className, img }} />
                      : type === "inputSearch" ? <InputSearch {...{ placeholder, onClick, className }} />
                        : <></>
              }
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}


export type { TpanelList, TtagList }
