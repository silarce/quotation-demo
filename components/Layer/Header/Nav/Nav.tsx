

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
        // const { icon, path01, href, label,  } = item
        const reg = new RegExp(`^${path01}`)
        let active = reg.test(pathname) ? styled.active : ""
        if (path01 === "/") active = pathname === path01 ? styled.active : ""
        return (
          <Link className={`${styled.link} ${active}`}
            href={href} key={index}>

            <Image src={icon} alt={label + subLabel} />
            {/* <Image src={icon} alt={label} /> */}
            
            <span>{label}</span>
            {subLabel && <span>{subLabel}</span>}


          </Link>
        )
      })}
    </div >
  )
}

// ========================================
