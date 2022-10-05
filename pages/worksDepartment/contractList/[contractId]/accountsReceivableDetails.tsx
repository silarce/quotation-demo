




import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"
import React from "react"







export default function AccountsReceivableDetails() {

  return (
    <div>
      <h1>應收帳款明細</h1>
      <h1>應收帳款明細</h1>
      <h1>應收帳款明細</h1>
      <h1>應收帳款明細</h1>
      <h1>應收帳款明細</h1>
    </div>
  )
}


AccountsReceivableDetails.getLayout = (page: React.ReactNode) => {
  return (
    <ContractNavLayout>
      {page}
    </ContractNavLayout>
  )
}
