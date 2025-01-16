import { useContext } from 'react';

import { useRouter } from 'next/router';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import PageHeaderFlex01 from 'components/PageHeader/pageHeaderFlex01';

import { AppContext } from 'pages/_app';
import { erpFeaturesLookup, swappedErpFeaturesLookup } from 'components/Layer/SideNav/pathList/type';

// globalState
import { useUrlHistory } from 'hooks/globalState/useUrlHistory';

// ========================================================

import { TdocType } from 'js/api/dtoTypes';

export type { TpanelList };

// ========================================================

const documentType: TdocType = '保固書';

const {
  //
  BasicDataCreation,
  HRAuthoritySetup,
  legacyContractIntegration,
  domestic,
  statisticsTable,
  worksDepartment,
  accountsReceivable,
  accountingDepartment,
  worksDepartment_worksheet,
  worksDepartment_deliveryList,
} = erpFeaturesLookup;

// ========================================================
export default function PageHeader({
  tagCallback,
  panelList = [],
  contractNumber = '未取得',
  returnBtn = true,
}: {
  tagCallback?: (contractId: string) => string;
  panelList?: TpanelList;
  contractNumber?: string;
  returnBtn?: boolean;
}) {
  const { erpFeature } = useContext(AppContext);
  const history_contractList = useUrlHistory((state) => state.contractList);

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
  // worksDepartment
  // accountsReceivable
  // worksDepartment_worksheet
  // worksDepartment_deliveryList

  const pass = erpFeature?.some((feature) => {
    return (
      feature.name === erpFeaturesLookup['worksDepartment'] ||
      feature.name === erpFeaturesLookup['accountsReceivable'] ||
      feature.name === erpFeaturesLookup['worksDepartment_worksheet'] ||
      feature.name === erpFeaturesLookup['worksDepartment_deliveryList']
    );
  });

  const domesticPass = erpFeature?.some((feature) => {
    return feature.name === erpFeaturesLookup['domestic'];
  });

  // -------------------------------------------------------------

  const tag = (tagCallback && tagCallback(contractId ?? '')) || `合約編號 ${contractNumber}`;

  const pathHead = `/worksDepartment/contractList/contract`;

  const linkList_pass = [
    isShowAccountReceivable
      ? {
          label: '合約',
          disabled: !isShowAccountReceivable,
          href: {
            pathname: `${pathHead}/contractTable`,
            query: {
              contractId,
              version,
            },
          },
        }
      : null,
    isShowAccountReceivable
      ? {
          label: '合約審核表',
          disabled: !isShowAccountReceivable,
          href: {
            pathname: `${pathHead}/quotationVerifyForm`,
            query: {
              contractId,
              version,
            },
          },
        }
      : null,
    {
      label: '工程聯絡單',
      href: {
        pathname: `${pathHead}/workContactDoc`,
        query: {
          contractId,
          version,
        },
      },
      erpFeatures: [],
    },
    {
      label: '工作表',
      // disabled: true,
      href: {
        pathname: `${pathHead}/workSheet`,
        query: {
          contractId,
          version,
        },
      },
    },
    {
      label: '工程管理單',
      // disabled: true,
      href: {
        pathname: `${pathHead}/outboundOrder`,
        query: {
          contractId,
          version,
        },
      },
    },
    isShowAccountReceivable
      ? {
          label: '應收帳款明細',
          disabled: !isShowAccountReceivable,
          href: {
            pathname: `${pathHead}/accountReceivable`,
            query: {
              contractId,
              version,
            },
          },
        }
      : null,

    {
      label: '派工單列表',
      href: {
        pathname: `${pathHead}/dispatchList`,
        query: {
          contractId,
          version,
        },
      },
    },
    // 已送入deprecated
    // {
    //   label: '送電備品列表_old',
    //   href: {
    //     pathname: `${pathHead}/powerTransmissionSpareList`,
    //     query: {
    //       contractId,
    //       version,
    //     },
    //   },
    // },
    {
      label: '送電備品列表',
      href: {
        pathname: `${pathHead}/electronicSupplies`,
        query: {
          contractId,
          version,
        },
      },
    },
    {
      label: '會議記錄',
      href: {
        pathname: `${pathHead}/meetingMinutes`,
        query: {
          contractId,
          version,
        },
      },
    },
    {
      label: '調(退)貨單列表',
      // disabled: true,
      href: {
        pathname: `${pathHead}/listOfDeliveryOrders`,
        query: {
          contractId,
          version,
        },
      },
    },
    {
      label: '備忘錄',
      // disabled: true,
      href: {
        pathname: `${pathHead}/memorandum`,
        query: {
          contractId,
          version,
        },
      },
    },
    {
      label: '保固書',
      href: {
        pathname: `${pathHead}/certifiedDocument`,
        query: {
          contractId,
          version,
          documentType,
        },
      },
    },
    // {
    //   label: '修繕報價',
    //   disabled: true,
    //   href: {
    //     pathname: `${pathHead}/undefined`,
    //     query: {
    //       contractId,
    //       version,
    //     },
    //   },
    // },
    // {
    //   label: '證明書/保固書',
    //   disabled: true,
    //   href: {
    //     pathname: `${pathHead}/undefined`,
    //     query: {
    //       contractId,
    //       version,
    //     },
    //   },
    // },
  ];

  const linkList_domestic = linkList_pass.reduce((arr, item) => {
    item?.label === '工程管理單' && arr.push(item);
    item?.label === '工程聯絡單' && arr.push(item);

    return arr;
  }, [] as typeof linkList_pass);

  const linkList = pass ? linkList_pass : domesticPass ? linkList_domestic : [];

  if (returnBtn) {
    panelList = [
      ...panelList,
      {
        type: 'myButton',
        label: '返回合約列表',
        onClick: () => {
          router.push(history_contractList);
        },
      },
    ];
  }

  return (
    <div>
      {/* 上面的 */}
      <PageHeader02 tag={tag} panelList={panelList} />
      {/* 下面的 */}
      <PageHeaderFlex01 linkList={linkList} />
    </div>
  );
}

// ====================================================================
