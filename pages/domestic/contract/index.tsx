import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link, { LinkProps } from 'next/link';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// global gear
import PageHeader02, { TpanelList, Tlink } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import ContractList from 'components/page/domestic/contract/contractList';
// composition
import ContractReviewForm from 'components/composition/contractReviewForm/contractReviewForm';

// option
import { optionsCreator_county, Toption } from 'js/utils/options/countryAndDistrict';
// import { optionsCreator_doorModel } from 'js/utils/options/productOptions';

// api
import { useContract_infinite } from 'js/api/api_quotation';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

import scss from './index.module.scss';

// ===========================================

type Tquery = {
  county: string | undefined;
  customerName: string | undefined;
  projectName: string | undefined;
  source: string | undefined;
};

// ===========================================

// const optionDoorModel = optionsCreator_doorModel({ haveEmpty: true });
const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });

// ===========================================
// 合約列表單個項目展開裡的內容是追加追減項目
// 合約列表單個項目展開裡的內容是追加追減項目
// 合約列表單個項目展開裡的內容是追加追減項目

// MARK: START
export default function Contract() {
  const router = useRouter();
  const query = router.query as Tquery;
  query.source = query.source || 'all';
  const { county, customerName, projectName } = query;

  // --------------------------------------------------

  const [activeContractId, setActiveContractId] = useState<string>();

  // --------------------------------------------------

  const params = {
    sort: 'contractNumber',
    filter: {
      version: { $eq: 1 },
      'content.county': { $eq: county },
      'content.customer.name': { $contains: customerName },
      'content.projectName': { $contains: projectName },
    },
  };

  const {
    //
    dataArr,
    viewRef_bottom,
    isLoadingPage1,
    reset,
  } = useContract_infinite({ customParams: params });

  // --------------------------------------------------

  // PROPS

  const contractList = useMemo(() => {
    return (dataArr ?? []).map((contract, index) => {
      const { id: contractId, content } = contract;

      const { managerReviewedAt } = content;

      const verifyFormText = managerReviewedAt ? '已審核完畢' : '未審核完畢';

      return {
        id: contract.id,
        // quotationId: content.quotationNumber,
        quotationId: contract.contractNumber ?? '---',
        clientName: content.customer?.name ?? '---',
        quotationName: content.projectName,
        discount: contract.discount,
        priceTotal: String(contract.total),
        contactPerson: content.contactPerson,
        contactPhone: content.contactNumber,
        attn: content.agentEmployee?.chName ?? '---',
        verifyForm: (
          <span
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActiveContractId(contractId);
            }}
          >
            <span style={{ color: !managerReviewedAt ? 'red' : undefined }}>{verifyFormText}</span>
            <IconDetail className="inline-block" />
          </span>
        ),
        viewRef_bottom: index === dataArr.length - 5 ? viewRef_bottom : undefined,
        href: {
          pathname: `/domestic/contract/quotation`,
          query: { id: contractId, version: 1 },
        },
      };
    });
  }, [dataArr]);

  // ______________________________________________________________________
  // ______________________________________________________________________

  const searchTargetList = [
    // {
    //   options: optionDoorModel,
    //   placeholder: '選擇門型',
    //   width: '100px',
    //   defaultValue: router.query.doorModel as string,
    // },
    {
      options: optionsCounty,
      placeholder: '選擇地區',
      width: '80px',
      defaultValue: router.query.county as string,
    },
    {
      placeholder: '請輸入客戶名稱',
      defaultValue: router.query.clientName as string,
    },
    {
      placeholder: '請輸入專案名稱',
      defaultValue: router.query.projectName as string,
    },
  ];

  const doSearch = (valueArr: (string | Toption | null)[]) => {
    // const doorModel = (valueArr[0] as Toption).value;
    const county = (valueArr[0] as Toption).value;
    const customerName = valueArr[1] as string;
    const projectName = valueArr[2] as string;

    router.push({
      href: '',
      query: {
        ...router.query,
        // doorModel,
        county,
        customerName,
        projectName,
      },
    });
  };

  const searchGroup = {
    searchTargetList,
    doSearch,
  };

  const panelList: TpanelList = [
    {
      searchGroup,
    },
  ];

  // -----------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    reset();
  }, [county, customerName, projectName]);

  // -----------------------------------------------------------------------
  // MARK: RENDER

  return (
    <SubLayer isLoading_subLayer={isLoadingPage1}>
      {/* header panel */}
      <PageHeader02 tag="合約" panelList={panelList} />
      {/*  */}
      <div>
        <ApprovalsBar query={query} />
        <ContractList
          className={'m-[4px] mt-0'}
          contractList={contractList}
          setActiveContractId={setActiveContractId}
        />
      </div>

      <ContractReviewForm
        showModal={!!activeContractId}
        readOnly={true}
        contractId={activeContractId}
        isInContract={true}
        onCancel={() => setActiveContractId(undefined)}
      />
    </SubLayer>
  );
}

// MARK: END

// ========================================================================

const ApprovalsBar = ({ query }: { query: Tquery }) => {
  // const router = useRouter();
  // const query = router.query as Tquery;

  const linkList: Tlink[] = [
    {
      label: '全部',
      linkProps: {
        replace: true,
        href: {
          pathname: '',
          query: {
            ...query,
            source: 'all',
          },
        },
      },
      isActive: query.source === 'all',
    },
    {
      label: '待審核',
      linkProps: {
        replace: true,
        href: {
          pathname: '',
          query: {
            ...query,
            source: 'pendingReview',
          },
        },
      },
      isActive: query.source === 'pendingReview',
    },
  ];

  return (
    <div className={scss.approvalsBar}>
      <PageHeader02 linkList={linkList} />
    </div>
  );
};
