
import { useState } from "react"

// css
import style from "./pageHeader.module.scss"

// hooks
import usePageInfo from "hooks/usePageInfo"


export default function PageHeader({ children }: { children: React.ReactNode }) {
  // 頁面資料
  const pageInfo = usePageInfo()
  const { label } = pageInfo

  const [foo, setFoo] = useState(123)

  return (
    <div className={style.container}>
      <span className={style.pageTitle}>{label}</span>
      <div className={style.panel}>
        {children}
      </div>
    </div>
  )
}


