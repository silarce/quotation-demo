import {
  useState, Fragment
} from "react"
import Link from "next/link"
import { useRouter } from "next/router"


// css
import style from "./pageHeaderFlex01.module.scss"



// type
interface Ttag {
  label: string
  onClick: () => void
}

interface Tlink {
  label: string
  href: string
}

export default function PageHeaderFlex01(
  {
    tagList = [],
    linkList = [],
  }:
    {
      tagList?: Ttag[] // 左邊的多個標籤，帶click事件
      linkList?: Tlink[] // 左邊的標籤，不過是Link
    }) {
  const [active, setActive] = useState(0)

  const router = useRouter()
  const { asPath } = router


  return (
    <div className={style.pageHeaderFlex01}>
      <TagList />{/* 多個tag 附帶onClick */}
      <LinkList />{/* 連結 */}
    </div >
  )
  // =====================================
  // ---
  function TagList() {
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
  // ---
  function LinkList() {
    if (!linkList[0]) return null
    return (
      <>
        {linkList.map((config, index) => {
          const { label, href } = config;
          const isActive = href === asPath ? style.active : ""
          return (
            <Link href={href} key={index}>
              <a className={isActive}>
                <span>{label}</span>
                <hr className={style.bottomBar} />
              </a>
            </Link>
          )
        })}
      </>
    )
  }
}
