




import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"
import React from "react"







export default function PowerTransmissionSpareList() {

  return (
    <div>
      <h1>送電備品列表</h1>
      <h1>送電備品列表</h1>
      <h1>送電備品列表</h1>
      <h1>送電備品列表</h1>
      <h1>送電備品列表</h1>
    </div>
  )
}


PowerTransmissionSpareList.getLayout = (page: React.ReactNode) => {
  return (
    <ContractNavLayout>
      {page}
    </ContractNavLayout>
  )
}
