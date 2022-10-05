




import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"
import React from "react"







export default function ListOfDeliveryOrders() {

  return (
    <div>
      <h1>調貨單列表</h1>
      <h1>調貨單列表</h1>
      <h1>調貨單列表</h1>
      <h1>調貨單列表</h1>
      <h1>調貨單列表</h1>
    </div>
  )
}


ListOfDeliveryOrders.getLayout = (page: React.ReactNode) => {
  return (
    <ContractNavLayout>
      {page}
    </ContractNavLayout>
  )
}
