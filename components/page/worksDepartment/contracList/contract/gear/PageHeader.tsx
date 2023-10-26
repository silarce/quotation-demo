import React from 'react';
import { useRouter } from 'next/router';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import PageHeaderFlex01 from 'components/PageHeader/pageHeaderFlex01';

export type { TpanelList };

export default function PageHeader({
  tagCallback,
  panelList,
  contractNumber = '未取得',
}: {
  tagCallback?: (contractId: string) => string;
  panelList?: TpanelList;
  contractNumber?: string;
}) {
  const router = useRouter();
  const isReady = router.isReady;

  if (!isReady) {
    return null;
  }

  const { contractId, version } = router.query;
  const query = router.query;

  const tag = (tagCallback && tagCallback(contractId as string)) || `合約編號 ${contractNumber}`;

  const pathHead = `/worksDepartment/contractList/contract`;
  const linkList = [
    {
      label: '工程聯絡單',
      href: {
        pathname: `${pathHead}/workContactDoc`,
        query,
      },
    },
    {
      label: '工作表',
      // disabled: true,
      href: {
        pathname: `${pathHead}/workSheet`,
        query,
      },
    },
    {
      label: '出庫單',
      disabled: true,
      href: {
        pathname: `${pathHead}/outboundOrder`,
        query,
      },
    },
    {
      label: '應收帳款明細',
      disabled: true,
      href: {
        pathname: `${pathHead}/accountsReceivableDetails`,
        query,
      },
    },
    {
      label: '派工單列表',
      href: {
        pathname: `${pathHead}/dispatchList`,
        query,
      },
    },
    {
      label: '送電備品列表',
      href: {
        pathname: `${pathHead}/powerTransmissionSpareList`,
        query,
      },
    },
    {
      label: '調(退)貨單列表',
      // disabled: true,
      href: {
        pathname: `${pathHead}/listOfDeliveryOrders`,
        query,
      },
    },
    {
      label: '備忘錄',
      disabled: true,
      href: {
        pathname: `${pathHead}/memorandum`,
        query,
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
