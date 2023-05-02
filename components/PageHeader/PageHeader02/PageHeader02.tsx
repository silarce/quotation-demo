import { useState } from "react"
import { useRouter } from "next/router"

// component
import Tag from "./Tag"
import TagList, { Ttag, TtagList } from "./TagList"
import LinkList, { Tlink } from "./LinkList"
import PanelList, { TpanelList } from "./PanelList"

// global gear
import { TsearchObj } from "components/global/gear/HOC/searchBar/searchBar"

// css
import scss from "./pageHeader02.module.scss"

// type
import { TsearchGroup, Toption } from "components/global/gear/HOC/searchBar/searchBar"


// ========================================================

export default function PageHeader02(
  {
    tag,
    tagClassName,
    tagList = [],
    panelList = [],
    linkList = [],
    customeLeft = [],
    customeRight = [],
  }:
    {
      tag?: string // 最左邊的標籤(標題)
      tagClassName?: string
      tagList?: Ttag[] // 左邊的多個標籤，帶click事件
      linkList?: Tlink[] // 左邊的標籤，不過是Link
      /**外容器的display為flex*/
      customeLeft?: React.ReactNode[]
      customeRight?: React.ReactNode[]

      panelList?: TpanelList //右邊的一排按鈕
    }) {

  const [active, setActive] = useState(0)

  const router = useRouter()
  const { pathname } = router

  return (
    <div className={scss.container}>
      {/* tagBox */} {/* 左邊的部分 */}
      <div className={scss.left}>
        <div className={scss.prebuilt}>
          <Tag tag={tag} className={tagClassName}/>{/* 單一tag */}
          <TagList
            tagList={tagList}
            active={active} setActive={setActive}
          />{/* 多個tag 附帶onClick */}
          <LinkList
            linkList={linkList} pathname={pathname} />{/* 超連結 */}
        </div>
        {customeLeft}
      </div>

      {/* buttonBox */} {/* 右邊的部分 */}
      <div className={scss.right} >
        {customeRight}
        <PanelList panelList={panelList} />
      </div>
    </div >
  )
} // PageHeader02 



export type { TpanelList, TtagList, TsearchObj, TsearchGroup, Toption }

// ===========================================================













