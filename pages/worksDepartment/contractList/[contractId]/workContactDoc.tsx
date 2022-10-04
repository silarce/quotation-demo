// 工程聯絡單
// 工程聯絡單
// 工程聯絡單

import React from "react"
import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"

// component
import Profile from "components/page/worksDepartment/contracList/contract/workContactDoc/profile"
import WorkProject from "components/page/worksDepartment/contracList/contract/workContactDoc/workProject"
import Remark from "components/page/worksDepartment/contracList/contract/workContactDoc/remark"

// css
import style from "./contract.module.scss"



export default function WorkContactDoc() {

  return (
    <div className={style.workContactDoc}>
      <Profile />
      <WorkProject />
      <Remark />
    </div>
  )
}
// ===========================================================
// ===========================================================
// ===========================================================

WorkContactDoc.getLayout = (page: React.ReactNode) => {
  return (
    <ContractNavLayout>
      {page}
    </ContractNavLayout>
  )
}
