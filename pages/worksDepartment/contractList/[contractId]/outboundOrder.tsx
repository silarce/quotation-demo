




import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"
import React from "react"







export default function OutboundOrder() {

  return (
    <div>
      <h1>出庫單</h1>
      <h1>出庫單</h1>
      <h1>出庫單</h1>
      <h1>出庫單</h1>
      <h1>出庫單</h1>
    </div>
  )
}


OutboundOrder.getLayout = (page: React.ReactNode) => {
  return (
    <ContractNavLayout>
      {page}
    </ContractNavLayout>
  )
}
