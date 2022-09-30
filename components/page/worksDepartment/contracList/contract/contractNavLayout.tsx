
import { useState, useMemo } from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"


// global gear
import PageHeader02 from "components/PageHeader/pageHeader02"

// css
import style from "./contractNavLayout.module.scss"













export default function ContractNavLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isReady = router.isReady

  if (!isReady) return null

  return (
    <TheContractLayout router={router}>
      {children}
    </TheContractLayout>
  )
}


function TheContractLayout({ router, children }:
  {
    router: NextRouter
    children: React.ReactNode
  }) {
  const { contractId } = router.query


  const pathHead = `/worksDepartment/contractList/${contractId}`

  const linkList = [
    {
      label: "工程聯絡單",
      href: `${pathHead}/workContactDoc`,
    },
    {
      label: "工作表",
      href: `${pathHead}/workSheet`,
    },
    {
      label: "出庫單",
      href: `${pathHead}/outboundOrder`,
    },
    {
      label: "應收帳款明細",
      href: `${pathHead}/accountsReceivableDetails`,
    },
    {
      label: "派工單列表",
      href: `${pathHead}/dispatchList`,
    },
    {
      label: "送電備品列表",
      href: `${pathHead}/powerTransmissionSpareList`,
    },
    {
      label: "調(退)貨單列表",
      href: `${pathHead}/listOfDeliveryOrders`,
    },
    {
      label: "備忘錄",
      href: `${pathHead}/memorandum`,
    },
  ]

  return (
    <div>
      <div className={style.title}>
        <span>合作編號</span>
        <span>{contractId}</span>
      </div>

      <div className={style.headerWrapper}>
        <PageHeader02 linkList={linkList} />
      </div>

      <div className={style.childrenWrapper}>
        {children}
      </div>
    </div>
  )
}










