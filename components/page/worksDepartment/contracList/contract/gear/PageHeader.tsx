import { useContext } from 'react';

import { useRouter } from 'next/router';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import PageHeaderFlex01 from 'components/PageHeader/pageHeaderFlex01';

import { AppContext } from 'pages/_app';

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
  const { erpFeature } = useContext(AppContext);
  const router = useRouter();
  const query = router.query as {
    contractId: string | undefined;
    version: string | undefined;
  };
  const { contractId, version } = query as {
    contractId: string | undefined;
    version: string | undefined;
  };

  const isShowAccountReceivable = !!erpFeature?.find((item) => item.name === '應收帳款');

  // -------------------------------------------------------------

  const tag = (tagCallback && tagCallback(contractId ?? '')) || `合約編號 ${contractNumber}`;

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
      // disabled: true,
      href: {
        pathname: `${pathHead}/outboundOrder`,
        query,
      },
    },
    isShowAccountReceivable
      ? {
          label: '應收帳款明細',
          disabled: !isShowAccountReceivable,
          href: {
            pathname: `${pathHead}/accountReceivable`,
            query,
          },
        }
      : null,
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
    {
      label: '修繕報價',
      disabled: true,
      href: {
        pathname: `${pathHead}/undefined`,
        query,
      },
    },
    {
      label: '證明書/保固書',
      disabled: true,
      href: {
        pathname: `${pathHead}/undefined`,
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
