

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
// css
import styled from "./nav.module.scss"

// 路由表
import { topPathList } from "components/Layer/SideNav/pathList"









export default function Nav() {
  const router = useRouter()
  const pathname = router.pathname



  return (
    <div className={styled.container}>
      {topPathList.map((item, index) => {
        const { icon, path01, href, label, subLabel: subLabel } = item
        const reg = new RegExp(`^${path01}`)
        let active = reg.test(pathname) ? styled.active : ""
        if (path01 === "/") active = pathname === path01 ? styled.active : ""
        return (
          <Link href={href} key={index}>
            <a className={`${styled.link} ${active}`}>
              <Image src={icon} alt={label + subLabel} />
              <span>{label}</span>
              {subLabel && <span>{subLabel}</span>}
            </a>
          </Link>
        )
      })}
    </div >
  )
}

// ========================================
