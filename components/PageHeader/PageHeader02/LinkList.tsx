
import classNames from "classnames"
import Link from "next/link"


// css
import scss from "./pageHeader02.module.scss"


type Thref = React.ComponentProps<typeof Link>["href"];

export interface Tlink {
  label: string
  href: Thref
  isActive?: boolean
}

/**
 * 如果linkList的item沒有isActive，會用pathname判斷是否isActive
 * 有了isActive參數後pathname好像多餘了
 */
export default function LinkList({ linkList, pathname }:
  {
    linkList: Tlink[]
    pathname?: string
  }) {
  if (!linkList[0]) return null
  return (
    <>
      {linkList.map((config, index) => {
        let { label, href, isActive } = config;

        let classActive: string | undefined

        if (isActive) classActive = scss.active
        if (isActive === false) classActive = undefined
        if (isActive === undefined) classActive = href === pathname ? scss.active : undefined

        return (
          <Link className={classNames(classActive)} href={href} key={index}>
            <span>{label}</span>
            <hr className={scss.bottomBar} />
          </Link>
        )
      })}
    </>
  )
}





