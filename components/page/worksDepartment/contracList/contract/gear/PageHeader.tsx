import { useContext } from 'react';

import { useRouter } from 'next/router';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import PageHeaderFlex01, { Tlink } from 'components/PageHeader/pageHeaderFlex01';

import { AppContext } from 'pages/_app';
import { erpFeaturesLookup } from 'components/Layer/SideNav/pathList/type';

// globalState
import { useUrlHistory } from 'hooks/globalState/useUrlHistory';

// ========================================================

import { TdocType } from 'js/api/dtoTypes';

export type { TpanelList };

// ========================================================

const documentType: TdocType = '保固書';

// ========================================================
export default function PageHeader({
  panelList = [],
  contractNumber = '未取得',
  createTagLable,
  showReturnBtn = true,
  linkForbidden,
  contactThatSkipContract,
}: {
  panelList?: TpanelList;
  contractNumber?: string;
  createTagLable?: (contractId: string) => string;
  showReturnBtn?: boolean;
  linkForbidden?: boolean;
  contactThatSkipContract: boolean;
}) {
  const history_contractList = useUrlHistory((state) => state.contractList);

  if (!history_contractList.pathname) {
    history_contractList.pathname = '/worksDepartment/contractList';
    history_contractList.query = undefined;
  }

  const router = useRouter();
  const query = router.query as {
    contractId: string | undefined;
    version: string | undefined;
  };
  const { contractId } = query as {
    contractId: string | undefined;
    version: string | undefined;
  };

  // -------------------------------------------------------------

  const tag = (createTagLable && createTagLable(contractId ?? '')) || `合約編號 ${contractNumber}`;

  const linkList = useLink({ contactThatSkipContract });

  if (showReturnBtn) {
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
      {!linkForbidden && <PageHeaderFlex01 linkList={linkList} />}
    </div>
  );
}

// ====================================================================

// MARK:useLink
const useLink = ({ contactThatSkipContract }: { contactThatSkipContract: boolean | undefined }) => {
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

  const pass = erpFeature?.some((feature) => {
    return (
      feature.name === erpFeaturesLookup['worksDepartment'] ||
      feature.name === erpFeaturesLookup['accountsReceivable'] ||
      feature.name === erpFeaturesLookup['worksDepartment_worksheet'] ||
      feature.name === erpFeaturesLookup['worksDepartment_deliveryList'] ||
      feature.name === erpFeaturesLookup['worksDepartment_readonly']
    );
  });

  const domesticPass = erpFeature?.some((feature) => {
    return (
      feature.name === erpFeaturesLookup['domestic'] || feature.name === erpFeaturesLookup['worksDepartment_readonly']
    );
  });

  // -------------------------------------------------------------

  const {
    contractTable,
    quotationVerifyForm,
    workContactDoc,
    workSheet,
    outboundOrder,
    accountReceivable,
    dispatchList,
    electronicSupplies,
    meetingMinutes,
    listOfDeliveryOrders,
    memorandum,
    certifiedDocument,
  } = createLinkList({
    isShowAccountReceivable,
    contractId,
    version,
  });

  const linkList_pass: (Tlink | null)[] = [
    isShowAccountReceivable && !contactThatSkipContract ? contractTable : null,
    isShowAccountReceivable && !contactThatSkipContract ? quotationVerifyForm : null,
    workContactDoc,
    !contactThatSkipContract ? workSheet : null,
    !contactThatSkipContract ? outboundOrder : null,
    isShowAccountReceivable && !contactThatSkipContract ? accountReceivable : null,
    !contactThatSkipContract ? dispatchList : null,
    electronicSupplies,
    !contactThatSkipContract ? meetingMinutes : null,
    listOfDeliveryOrders,
    !contactThatSkipContract ? memorandum : null,
    !contactThatSkipContract ? certifiedDocument : null,
  ];

  const linkList_domestic = linkList_pass.reduce((arr, item) => {
    item?.label === '工程管理單' && arr.push(item);
    item?.label === '工程聯絡單' && arr.push(item);

    return arr;
  }, [] as typeof linkList_pass);

  const linkList = pass ? linkList_pass : domesticPass ? linkList_domestic : [];

  return linkList;
};

const createLinkList = ({
  isShowAccountReceivable,
  contractId,
  version,
}: {
  isShowAccountReceivable: boolean | undefined;
  contractId: string | undefined;
  version: string | undefined;
}) => {
  const pathHead = `/worksDepartment/contractList/contract`;

  const contractTable: Tlink = {
    label: '合約',
    disabled: !isShowAccountReceivable,
    href: {
      pathname: `${pathHead}/contractTable`,
      query: {
        contractId,
        version,
      },
    },
  };

  const quotationVerifyForm: Tlink = {
    label: '合約審核表',
    disabled: !isShowAccountReceivable,
    href: {
      pathname: `${pathHead}/quotationVerifyForm`,
      query: {
        contractId,
        version,
      },
    },
  };

  const workContactDoc: Tlink = {
    label: '工程聯絡單',
    href: {
      pathname: `${pathHead}/workContactDoc`,
      query: {
        contractId,
        version,
      },
    },
  };

  const workSheet: Tlink = {
    label: '工作表',
    // disabled: true,
    href: {
      pathname: `${pathHead}/workSheet`,
      query: {
        contractId,
        version,
      },
    },
  };

  const outboundOrder: Tlink = {
    label: '工程管理單',
    // disabled: true,
    href: {
      pathname: `${pathHead}/outboundOrder`,
      query: {
        contractId,
        version,
      },
    },
  };

  const accountReceivable: Tlink = {
    label: '應收帳款明細',
    disabled: !isShowAccountReceivable,
    href: {
      pathname: `${pathHead}/accountReceivable`,
      query: {
        contractId,
        version,
      },
    },
  };

  const dispatchList: Tlink = {
    label: '派工單列表',
    href: {
      pathname: `${pathHead}/dispatchList`,
      query: {
        contractId,
        version,
      },
    },
  };

  const electronicSupplies: Tlink = {
    label: '送電備品列表',
    href: {
      pathname: `${pathHead}/electronicSupplies`,
      query: {
        contractId,
        version,
      },
    },
  };

  const meetingMinutes: Tlink = {
    label: '會議記錄',
    href: {
      pathname: `${pathHead}/meetingMinutes`,
      query: {
        contractId,
        version,
      },
    },
  };

  const listOfDeliveryOrders: Tlink = {
    label: '調(退)貨單列表',
    href: {
      pathname: `${pathHead}/listOfDeliveryOrders`,
      query: {
        contractId,
        version,
      },
    },
  };

  const memorandum: Tlink = {
    label: '備忘錄',
    // disabled: true,
    href: {
      pathname: `${pathHead}/memorandum`,
      query: {
        contractId,
        version,
      },
    },
  };

  const certifiedDocument: Tlink = {
    label: '保固書',
    href: {
      pathname: `${pathHead}/certifiedDocument`,
      query: {
        contractId,
        version,
        documentType,
      },
    },
  };

  return {
    contractTable,
    quotationVerifyForm,
    workContactDoc,
    workSheet,
    outboundOrder,
    accountReceivable,
    dispatchList,
    electronicSupplies,
    meetingMinutes,
    listOfDeliveryOrders,
    memorandum,
    certifiedDocument,
  };
};
