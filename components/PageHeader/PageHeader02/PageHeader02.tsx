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
import { TsearchGroup } from "components/global/gear/HOC/searchBar/searchBar"


// ========================================================

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
    <div className={scss.container}>
      {/* tagBox */} {/* 左邊的部分 */}
      <div className={scss.tagBox}>
        <Tag tag={tag} />{/* 單一tag */}
        <TagList
          tagList={tagList}
          active={active} setActive={setActive}
        />{/* 多個tag 附帶onClick */}
        <LinkList
          linkList={linkList} pathname={pathname} />{/* 超連結 */}
      </div>
      {/* buttonBox */} {/* 右邊的部分 */}
      <PanelList panelList={panelList} />
    </div >
  )
} // PageHeader02 



export type { TpanelList, TtagList, TsearchObj, TsearchGroup }

// ===========================================================













