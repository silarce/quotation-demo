

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
// css
import styled from "./nav.module.scss"

// icon
import icon_home from "public/image/icon/home.svg"
import icon_setting from "public/image/icon/setting.svg"
import icon_domestic from "public/image/icon/domestic.svg"
import icon_foreign from "public/image/icon/foreign.svg"
import icon_project from "public/image/icon/project.svg"











export default function Nav() {
  // const pathname = useRouter().pathname
  const router = useRouter()
  const pathname = router.pathname



  return (
    <div className={styled.container}>
      {linkList.map((item, index) => {
        const { icon, href, label, subLabel: subLabel } = item
        const reg = new RegExp(`^${href}`)
        let active = reg.test(pathname) ? styled.active : ""
        if (href === "/") active = pathname === href ? styled.active : ""
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

const linkList = [
  { icon: icon_home, href: "/", label: "首頁" },
  { icon: icon_setting, href: "/setting/theCompanyInfo", label: "公司設定" },
  { icon: icon_domestic, href: "/domestic/budget", label: "營業部", subLabel: "-國內工程" },
  { icon: icon_foreign, href: "/foreign", label: "營業部", subLabel: "-國外工程", },
  { icon: icon_project, href: "/project", label: "工務部" },
]

