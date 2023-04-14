
import {
  Dispatch, SetStateAction,
  Fragment
} from "react"



// global gear
import MyButton from "components/global/gear/button/myButton"
import RedButton from "components/global/gear/button/redButton"
import AddButton from "components/global/gear/button/addButton"
import ExportButton from "components/global/gear/button/exportButton"
import InputSearch from "components/global/gear/input/inputSearch"
import SearchBar from "components/global/gear/HOC/searchBar/searchBar"


// css
import scss from "./pageHeader02.module.scss"

// type
import { TsearchGroup } from "components/global/gear/HOC/searchBar/searchBar"


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


export type TpanelList = (
  Tpanel01 | Tpanel02 | Tpanel03 | TpanelSearchBar | null
)[]



export default function PanelList({ panelList }:
  { panelList: TpanelList }) {

  if (!panelList[0]) return null
  return (
    <div className={scss.panelList}>
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
