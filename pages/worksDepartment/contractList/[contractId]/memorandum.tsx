




import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"
import React from "react"







export default function Memorandum() {

  return (
    <div>
      <h1>備忘錄</h1>
      <h1>備忘錄</h1>
      <h1>備忘錄</h1>
      <h1>備忘錄</h1>
      <h1>備忘錄</h1>
    </div>
  )
}


Memorandum.getLayout = (page: React.ReactNode) => {
  return (
    <ContractNavLayout>
      {page}
    </ContractNavLayout>
  )
}
