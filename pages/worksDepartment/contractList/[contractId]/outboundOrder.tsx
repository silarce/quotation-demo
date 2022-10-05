// 出庫單
// 出庫單
// 出庫單





import ContractNavLayout from "components/page/worksDepartment/contracList/contract/contractNavLayout"
import React from "react"



import style from "./contract.module.scss"



export default function OutboundOrder() {

  return (
    <div className={style.outboundOrder}>

      <div className={style.title}>
        <div>
          <span>工程編號</span>
          <span>{"M-1101201"}</span>
        </div>
        <div>
          <span>工程名稱</span>
          <span>{"台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程"}</span>
        </div>
      </div>

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
