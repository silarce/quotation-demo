import {
  useState, Fragment
} from "react"

// global gear
import MyButton from "components/global/gear/button/myButton"
import RedButton from "components/global/gear/button/redButton"
import AddButton from "components/global/gear/button/addButton"
import InputSearch from "components/global/gear/input/inputSearch"
import SearchBar from "components/global/gear/HOC/searchBar/searchBar"


// css
import style from "./pageHeader02.module.scss"

// type
import { TsearchGroup } from "components/global/gear/HOC/searchBar/searchBar"

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
  custom?: undefined
  searchGroup?: undefined
}
interface Tpanel02 {
  type: "inputSearch"
  placeholder: string
  onClick: (value: string) => void
  label?: undefined
  className?: string
  img?: string
  custom?: undefined
  searchGroup?: undefined
}
interface Tpanel03 {
  custom: JSX.Element
  type?: undefined
  label?: undefined
  onClick?: undefined
  placeholder?: undefined
  className?: undefined
  img?: undefined
  searchGroup?: undefined
}

// SearchBar 用的
interface TpanelSearchBar {
  searchGroup: TsearchGroup
  custom?: undefined
  type?: undefined
  label?: undefined
  onClick?: undefined
  placeholder?: undefined
  className?: undefined
  img?: undefined
}


type TpanelList = (
  Tpanel01 | Tpanel02 | Tpanel03 | TpanelSearchBar | null
)[]
type TtagList = Ttag[]



export default function PageHeader02(
  {
    tag,
    tagList = [],
    panelList = []
  }:
    {
      tag?: string // 最左邊的標籤(標題)
      tagList?: Ttag[] // 左邊的多個標籤，帶click事件
      panelList?: TpanelList //右邊的一排按鈕
    }) {

  const [active, setActive] = useState(0)

  return (
    <div className={style.container}>

      {/* tagBox */} {/* 左邊的部分 */}
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

      {/* buttonBox */} {/* 右邊的部分 */}
      <div className={style.buttonBox}>
        {panelList.map((item, index) => {

          if (!item) return null

          // 客製化panel
          if (item.custom) return (
            <Fragment key={index}>
              {item.custom}
            </Fragment>
          )

          if (item.searchGroup) {
            const { searchTargetList, doSearch } = item.searchGroup
            return <SearchBar
              key={index}
              searchTargetList={searchTargetList}
              doSearch={doSearch}
            />
          }

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
