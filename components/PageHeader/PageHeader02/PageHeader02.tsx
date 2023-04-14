import {
  Dispatch, SetStateAction,
  useState, Fragment, useEffect
} from "react"
import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"


// global gear
import MyButton from "components/global/gear/button/myButton"
import RedButton from "components/global/gear/button/redButton"
import AddButton from "components/global/gear/button/addButton"
import ExportButton from "components/global/gear/button/exportButton"
import InputSearch from "components/global/gear/input/inputSearch"
import SearchBar, { TsearchObj } from "components/global/gear/HOC/searchBar/searchBar"


// css
import style from "./pageHeader02.module.scss"

// type
import { TsearchGroup } from "components/global/gear/HOC/searchBar/searchBar"

type Thref = React.ComponentProps<typeof Link>["href"];
// ========================================================

// type
interface Ttag {
  label: string
  onClick: () => void
}

interface Tlink {
  label: string
  href: Thref
  isActive?: boolean
}

// 各種按鈕，可以變更或加上icon
interface Tpanel01 {
  type: "myButton" | "redButton" | "addButton" | "exportButton"
  label: string
  onClick: () => void
  placeholder?: undefined
  className?: string
  img?: string
  custom?: undefined
  searchGroup?: undefined
}

// 搜尋input
interface Tpanel02 {
  type: "inputSearch"
  placeholder: string
  onClick: (value: string) => void
  label?: undefined
  className?: string
  img?: string
  custom?: undefined
  searchGroup?: undefined
  stateValue?: string
  setStateValue?: Dispatch<SetStateAction<string>>
  defaultValue?: string
}

// 客製化元件
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
    panelList = [],
    linkList = [],
  }:
    {
      tag?: string // 最左邊的標籤(標題)
      tagList?: Ttag[] // 左邊的多個標籤，帶click事件
      linkList?: Tlink[] // 左邊的標籤，不過是Link
      panelList?: TpanelList //右邊的一排按鈕
    }) {

  const [active, setActive] = useState(0)

  const router = useRouter()
  const { pathname } = router

  return (
    <div className={style.container}>
      {/* tagBox */} {/* 左邊的部分 */}
      <div className={style.tagBox}>
        <Tag tag={tag} />{/* 單一tag */}
        <TagList
          tagList={tagList}
          active={active} setActive={setActive}
        />{/* 多個tag 附帶onClick */}
        <LinkList
          linkList={linkList} pathname={pathname} />{/* 連結 */}
      </div>
      {/* buttonBox */} {/* 右邊的部分 */}
      <PanelList panelList={panelList} />
    </div >
  )
  // ===========================================================
  // ===========================================================
  // ===========================================================





} // PageHeader02 // PageHeader02 // PageHeader02 
// ===========================================================
// ===========================================================
// ===========================================================
function Tag({ tag }: { tag?: string }) {
  if (!tag) return null
  return (
    <div>
      <span>{tag}</span>
      <hr className={style.bottomBar} />
    </div>
  )
}
// ---
function TagList({ tagList, active, setActive }:
  {
    tagList: Ttag[]
    active: number
    setActive: Dispatch<SetStateAction<number>>
  }) {

  if (!tagList[0]) return null
  return (
    <>
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
          >
            <span>{label}</span>
            <hr className={style.bottomBar} />
          </button>
        )
      })}
    </>
  )
}

// -----------
function LinkList({ linkList, pathname }:
  {
    linkList: Tlink[]
    pathname: string
  }) {
  if (!linkList[0]) return null
  return (
    <>
      {linkList.map((config, index) => {
        let { label, href, isActive } = config;

        let classActive: string | undefined

        if (isActive) classActive = style.active
        if (isActive === false) classActive = undefined
        if (isActive === undefined) classActive = href === pathname ? style.active : undefined

        return (
          <Link className={classNames(classActive)} href={href} key={index}>
            <span>{label}</span>
            <hr className={style.bottomBar} />
          </Link>
        )
      })}
    </>
  )
}

// -----------
function PanelList({ panelList }:
  { panelList: TpanelList }) {

  if (!panelList[0]) return null
  return (
    <div className={style.buttonBox}>
      {panelList.map((item, index) => {
        if (!item) return null
        // 客製化panel
        if (item.custom) return (
          <Fragment key={index}>
            {item.custom}
          </Fragment>
        )
        // 搜尋bar
        if (item.searchGroup) {
          const { searchTargetList, doSearch } = item.searchGroup
          return (
            <SearchBar
              key={index}
              searchTargetList={searchTargetList}
              doSearch={doSearch}
            />
          )
        }
        // 通常的按鈕bar
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
                    : type === "exportButton" ? <ExportButton {...{ label, onClick, className, img }} />
                      : type === "inputSearch" ? <InputSearch {...item} />
                        : <></>
            }
          </Fragment>
        )
      })}
    </div>
  )
} // PanelList









export type { TpanelList, TtagList, TsearchObj, TsearchGroup }

// ===========================================================













