// 工程聯絡單
// 工程聯絡單
// 工程聯絡單
import React from "react"

// component
import PageHeader from "components/page/worksDepartment/contracList/contract/gear/PageHeader"
import Profile from "components/page/worksDepartment/contracList/contract/workContactDoc/profile"
import WorkProject from "components/page/worksDepartment/contracList/contract/workContactDoc/workProject"
import Remark from "components/page/worksDepartment/contracList/contract/workContactDoc/remark"

// css
import style from "./contract.module.scss"







export default function WorkContactDoc() {


  return (
    <div className={style.container}>


      <PageHeader />

      <div className={style.mainContainer}>
        <div className={style.workContactDoc}>
          <Profile />
          <WorkProject />
          <Remark />
        </div>
      </div>

    </div>
  )
}
// ===========================================================
// ===========================================================
// ===========================================================

