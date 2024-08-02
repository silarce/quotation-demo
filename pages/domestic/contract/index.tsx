import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

//  gear
import PageHeader02, { TpanelList, Tlink } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// components
import ContractList from 'components/page/domestic/contract/contractList';
// composition
import ContractReviewForm from 'components/composition/contractReviewForm/contractReviewForm';

// option
import { optionsCreator_county, Toption } from 'js/utils/options/countryAndDistrict';
// import { optionsCreator_doorModel } from 'js/utils/options/productOptions';

// api
import { Tparams, useContract_infinite, useGetContract_employee } from 'js/api/api_quotation';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

import scss from './index.module.scss';
import { TuserDto } from 'js/api/dtoTypes';

// ===========================================

type Tquery = {
  county: string | undefined;
  customerName: string | undefined;
  keyWord: string | undefined;
  source: 'all' | 'pendingReview' | undefined;
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
export default function Contract({ userInfo }: { userInfo: TuserDto }) {
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    county,
    customerName,
    keyWord,
    source = 'all',
  } = query;

  const userId = userInfo.employee?.id;

  // --------------------------------------------------

  const [activeContractId, setActiveContractId] = useState<string>();

  // --------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      sort: 'contractNumber',
      filter: {
        version: { $eq: 1 },
        'content.county': { $eq: county },
        'content.customer.name': { $contains: customerName },
        $or: {
          'content.projectName': { $contains: keyWord },
          contractNumber: { $contains: keyWord },
        },
      },
    };
  }, [county, customerName, keyWord]);

  const {
    //
    dataArr: dataArr_infinite,
    viewRef_bottom,
    isLoadingPage1,
    reset,
    reqSignedBack, // 簽回
  } = useContract_infinite({ customParams: params });

  const {
    //
    data: data_contractArr_employee = [],
    update: update_contractArr_employee,
  } = useGetContract_employee(userId, {
    customParams: params,
  });

  const dataArr = source === 'all' ? dataArr_infinite : data_contractArr_employee;

  // --------------------------------------------------

  // PROPS

  const contractList = useMemo(() => {
    return (dataArr ?? []).map((contract, index) => {
      const { id: contractId, content, isSignedBack, contractNumber } = contract;

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
        viewRef_bottom: source === 'all' && index === dataArr.length - 5 ? viewRef_bottom : undefined,
        href: {
          pathname: `/domestic/contract/quotation`,
          query: { id: contractId, version: 1 },
        },
        isSignedBack: isSignedBack,
        onSignedBackClick: () => {
          myAlert.confirm({
            title: `確認簽回${contractNumber || content.projectName}?`,
            props: {
              onOk: async () => await reqSignedBack(contractId),
            },
          });
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
      defaultValue: query.county,
    },
    {
      placeholder: '請輸入客戶名稱',
      defaultValue: query.customerName,
    },
    {
      placeholder: '請輸入專案名稱或合約編號',
      defaultValue: query.keyWord,
    },
  ];

  const doSearch = (valueArr: (string | Toption | null)[]) => {
    const county = (valueArr[0] as Toption).value;
    const customerName = valueArr[1] as string;
    const keyWord = valueArr[2] as string;

    router.push({
      href: '',
      query: {
        ...router.query,
        county,
        customerName,
        keyWord,
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
    source === 'all' ? reset() : update_contractArr_employee();
  }, [county, customerName, keyWord, source]);

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
