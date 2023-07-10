import React from 'react';
import { useRouter } from 'next/router';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import PageHeaderFlex01 from 'components/PageHeader/pageHeaderFlex01';

export type { TpanelList };

export default function PageHeader({
  tagCallback,
  panelList,
}: {
  tagCallback?: (contractId: string) => string;
  panelList?: TpanelList;
}) {
  const router = useRouter();
  const isReady = router.isReady;

  if (!isReady) {
    return null;
  }

  const { contractId } = router.query;

  const tag = (tagCallback && tagCallback(contractId as string)) || `合約編號${contractId}`;

  const pathHead = `/worksDepartment/contractList/contract`;
  const linkList = [
    {
      label: '工程聯絡單',
      href: {
        pathname: `${pathHead}/workContactDoc`,
        query: { contractId },
      },
    },
    {
      label: '工作表',
      href: {
        pathname: `${pathHead}/workSheet`,
        query: { contractId },
      },
    },
    {
      label: '出庫單',
      href: {
        pathname: `${pathHead}/outboundOrder`,
        query: { contractId },
      },
    },
    {
      label: '應收帳款明細',
      href: {
        pathname: `${pathHead}/accountsReceivableDetails`,
        query: { contractId },
      },
    },
    {
      label: '派工單列表',
      href: {
        pathname: `${pathHead}/dispatchList`,
        query: { contractId },
      },
    },
    {
      label: '送電備品列表',
      href: {
        pathname: `${pathHead}/powerTransmissionSpareList`,
        query: { contractId },
      },
    },
    {
      label: '調(退)貨單列表',
      href: {
        pathname: `${pathHead}/listOfDeliveryOrders`,
        query: { contractId },
      },
    },
    {
      label: '備忘錄',
      href: {
        pathname: `${pathHead}/memorandum`,
        query: { contractId },
      },
    },
  ];

  return (
    <div>
      {/* 上面的 */}
      <PageHeader02 tag={tag} panelList={panelList} />
      {/* 下面的 */}
      <PageHeaderFlex01 linkList={linkList} />
    </div>
  );
}
