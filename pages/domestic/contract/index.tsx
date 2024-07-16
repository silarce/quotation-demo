import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import ContractList from 'components/page/domestic/contract/contractList';
// composition
import ContractReviewForm from 'components/page/domestic/quotation/quotation/contractReviewForm/contractReviewForm';

// option
import { optionsCreator_county, Toption } from 'js/utils/options/countryAndDistrict';
// import { optionsCreator_doorModel } from 'js/utils/options/productOptions';

// api
import { useContract_infinite } from 'js/api/api_quotation';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// ===========================================

// const optionDoorModel = optionsCreator_doorModel({ haveEmpty: true });
const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });

// ===========================================
// 合約列表單個項目展開裡的內容是追加追減項目
// 合約列表單個項目展開裡的內容是追加追減項目
// 合約列表單個項目展開裡的內容是追加追減項目
export default function Contract() {
  const router = useRouter();
  const query = router.query as {
    county: string | undefined;
    customerName: string | undefined;
    projectName: string | undefined;
  };

  // --------------------------------------------------

  const [activeContractId, setActiveContractId] = useState<string>();

  // --------------------------------------------------

  const params = {
    sort: 'contractNumber',
    filter: {
      version: { $eq: 1 },
      'content.county': { $eq: query.county as string },
      'content.customer.name': { $contains: query.customerName as string },
      'content.projectName': { $contains: query.projectName as string },
    },
  };

  const {
    //
    dataArr,
    viewRef_bottom,
    isLoadingPage1,
    reset,
  } = useContract_infinite({ customParams: params });

  useEffect(() => {
    reset();
  }, [router.query]);

  // --------------------------------------------------

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

  // ===================================================

  const contractList =
    dataArr?.map((contract, index) => {
      const { id: contractId, content } = contract;

      const { managerReviewedAt } = content;

      const verifyFormText = managerReviewedAt ? '已審核完畢' : '未審核完畢';

      return {
        id: contract.id,
        // quotationId: content.quotationNumber,
        quotationId: contract.contractNumber ?? '',
        clientName: content.customer?.name ?? '',
        quotationName: content.projectName,
        discount: contract.discount,
        priceTotal: String(contract.total),
        contactPerson: content.contactPerson,
        contactPhone: content.contactNumber,
        attn: content.agentEmployee?.chName ?? '',
        verifyForm: (
          <span
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
      };
    }) ?? [];

  return (
    <SubLayer isLoading_subLayer={isLoadingPage1}>
      {/* header panel */}
      <PageHeader02 tag="合約" panelList={panelList} />
      {/*  */}
      <div>
        <ContractList contractList={contractList} />
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
