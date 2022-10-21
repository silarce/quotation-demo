import React from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import PageHeaderFlex01 from "components/PageHeader/pageHeaderFlex01"

export type { TpanelList }



export default function PageHeader({ panelList }:
  { panelList?: TpanelList }) {

  const router = useRouter()
  const isReady = router.isReady
  if (!isReady) return null

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
      <PageHeader02
        tag={`合約編號${contractId}`}
        panelList={panelList} />
      <PageHeaderFlex01 linkList={linkList} />
    </div>
  )
}

















