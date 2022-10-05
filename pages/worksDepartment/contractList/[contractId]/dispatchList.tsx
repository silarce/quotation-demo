




import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"
import React from "react"







export default function DispatchList() {

  return (
    <div>
      <h1>派工單列表</h1>
      <h1>派工單列表</h1>
      <h1>派工單列表</h1>
      <h1>派工單列表</h1>
      <h1>派工單列表</h1>
    </div>
  )
}


DispatchList.getLayout = (page: React.ReactNode) => {
  return (
    <ContractNavLayout>
      {page}
    </ContractNavLayout>
  )
}
