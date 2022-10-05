




import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"
import React from "react"







export default function WorkSheet() {

  return (
    <div>
      <h1>工作表</h1>
      <h1>工作表</h1>
      <h1>工作表</h1>
      <h1>工作表</h1>
      <h1>工作表</h1>
    </div>
  )
}


WorkSheet.getLayout = (page: React.ReactNode) => {
  return (
    <ContractNavLayout>
      {page}
    </ContractNavLayout>
  )
}
