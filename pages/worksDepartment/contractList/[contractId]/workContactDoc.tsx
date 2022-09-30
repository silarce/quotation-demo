




import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"
import React from "react"







export default function WorkContactDoc() {

  return (
    <div>
      <h1>workContactDoc</h1>
      <h1>workContactDoc</h1>
      <h1>workContactDoc</h1>
      <h1>workContactDoc</h1>
      <h1>workContactDoc</h1>
    </div>
  )
}


WorkContactDoc.getLayout = (page: React.ReactNode) => {
  return (
    <ContractNavLayout>
      {page}
    </ContractNavLayout>
  )
}
