import React from "react"
import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"

// component
import Profile from "components/page/worksDepartment/contracList/contract/workContactDoc/profile"


// css
import style from "./contract.module.scss"




export default function WorkContactDoc() {

  return (
    <div className={style.workContactDoc}>
      <Profile />
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
