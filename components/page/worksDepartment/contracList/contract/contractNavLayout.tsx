

// 用不到了，但暫時先留著備用
// 用不到了，但暫時先留著備用
// 用不到了，但暫時先留著備用
// 用不到了，但暫時先留著備用
// 用不到了，但暫時先留著備用



import { useState, useMemo } from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"


// global gear
import PageHeader02 from "components/PageHeader/PageHeader02/PageHeader02"
import PageHeaderFlex01 from "components/PageHeader/pageHeaderFlex01"

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

  const pathHead = `/worksDepartment/contractList/contract`

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
    <div className={style.container}>
      <div >

        {/* <PageHeader02 tag={`合作編號${contractId}`} /> */}
        {/* <div className={style.title}>
            <span>合作編號</span>
            <span>{contractId}</span>
          </div> */}

        <div className={style.headerWrapper}>
          <PageHeaderFlex01 linkList={linkList} />
        </div>
      </div>

      <div className={`${style.mainContainer} ${style.childrenWrapper}`}>
        {children}
      </div>
    </div >

  )
}










