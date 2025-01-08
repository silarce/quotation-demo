import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import ContractList, { Tcontract } from 'components/page/worksDepartment/contracList/contractList';

// api
import {
  //  useContract_infinite,
  Tparams,
  useContract_infinite_topBottom,
} from 'js/api/api_quotation';

// option
import { optionsCreator_county, districtOptionsSelector } from 'js/utils/options/countryAndDistrict';

import type { Toption } from 'js/utils/options/countryAndDistrict';

// ===========================================

const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });
// ===========================================

type Tquery = {
  doorType: string | undefined;
  county: string | undefined;
  district: string | undefined;
  address: string | undefined;
  customerName: string | undefined;
  keyWord: string | undefined;
  //
  activeContractId?: string | undefined;
  activeContractPage?: string | undefined;
};

export default function ContractList_forDepartment({ targetUrl }: { targetUrl: string }) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { activeContractId, activeContractPage, doorType, county, district, address, customerName, keyWord } = query;

  const [hadMoved, setHadMoved] = useState(false);

  // ---------------------------------------------------------------------

  const params: Tparams = {
    sort: 'contractNumber',
    order: 'ASC',
    filter: {
      'content.product.doorModelName': { $eq: doorType },
      'content.customer.name': { $contains: customerName },
      $and: {
        'content.county': { $eq: county || undefined },
        'content.district': { $eq: district || undefined },
        'content.address': { $contains: address || undefined },
      },
      $or: {
        'content.projectName': { $contains: keyWord },
        contractNumber: { $contains: keyWord },
      },
      engineeringContactId: { $notNull: true },
    },
  };

  const {
    //
    getRawDataArr,
    rawData_page,
    viewRef_top,
    viewRef_bottom,
    isLoadingPage1,
    reset,
    ref_container,
  } = useContract_infinite_topBottom({
    startPage: Number(activeContractPage || '1'),
    customParams: params,
  });

  // ===================================================

  const [countyState, setCountyState] = useState<string | undefined>(undefined);
  const [districtState, setDistrictState] = useState<string | undefined>(undefined);
  const [addressState, setAddressState] = useState<string | undefined>(undefined);
  const [customerNameState, setCustomerNameState] = useState<string | undefined>(undefined);
  const [keyWordState, setKeyWordState] = useState<string | undefined>(undefined);

  // ===================================================

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      options: optionsCounty,
      placeholder: '選擇縣市',
      width: '80px',
      value: countyState,
      onChange: (v) => {
        setCountyState(v);
        setDistrictState(undefined);
      },
    },
    {
      options: (() => {
        const arr = districtOptionsSelector(countyState ?? '');
        arr.unshift({ value: '', label: '不拘' });

        return arr;
      })(),
      placeholder: '選擇地區',
      width: '80px',
      value: districtState,
      onChange: (v) => {
        setDistrictState(v);
      },
    },
    {
      placeholder: '請輸入地址',
      value: addressState,
      onChange: (v) => {
        setAddressState(v);
      },
    },
    {
      placeholder: '請輸入客戶名稱',
      value: customerNameState,
      onChange: (v) => {
        setCustomerNameState(v);
      },
    },
    {
      placeholder: '工程名稱或合約編號',
      value: keyWordState,
      onChange: (v) => {
        setKeyWordState(v);
      },
    },
  ];

  const doSearch: TsearchGroup['doSearch'] = (vArr) => {
    const [_, __, address, customerName, keyword] = vArr;

    const county = (vArr[0] as Toption)?.value;
    const district = (vArr[1] as Toption)?.value;

    router.replace({
      query: {
        ...router.query,
        county: county,
        district: district,
        address: (address || '') as string,
        customerName: (customerName || '') as string,
        keyWord: (keyword || '') as string,
      },
    });
  };

  const searchGroup = {
    searchTargetList,
    doSearch,
    controlled: true,
  };
  // -----------------------

  const panelList: TpanelList = [{ searchGroup }];

  // ===================================================

  const contractArr: Tcontract[] = useMemo(() => {
    const arr: Tcontract[] = [];
    // rawData_page
    Object.entries(rawData_page ?? {}).forEach(([page, rawDataDict]) => {
      Object.values(rawDataDict).forEach((rawData) => {
        const { id, content, contractNumber, unReviewPicture, unReviewWorkSheet } = rawData;

        const obj: Tcontract = {
          contractId: id,
          page,
          // quotationNumber: content.quotationNumber,
          contractNumber: contractNumber ?? '',
          customerName: content.customer?.name ?? '',
          contactName: content.contactPerson,
          contactNumber: content.contactNumber,
          agentName: content.agentEmployee?.chName ?? '',
          date: content.quotationDate,
          county: content.county,
          projectName: content.projectName,
          //
          QtyOfProjectPatternForReview: 0,
          QtyOfWorkwheetForReview: 0,
          unReviewPicture,
          unReviewWorkSheet,
        };

        arr.push(obj);
      });
    });

    return arr;
  }, [rawData_page]);

  // --------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    setCountyState(county);
    setDistrictState(district);
    setAddressState(address);
    setCustomerNameState(customerName);
    setKeyWordState(keyWord);
  }, [router.query]);

  useEffect(() => {
    rawData_page && reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [county, district, address, customerName, keyWord]);

  useEffect(() => {
    if (!hadMoved && rawData_page) {
      const target = document.getElementById(activeContractId ?? '');
      target?.scrollIntoView({
        block: 'center',
      });

      setHadMoved(true);
    }
  }, [!!rawData_page]);

  // --------------------------------------------------------------------------

  return (
    <SubLayer isLoading_subLayer={isLoadingPage1}>
      <PageHeader02 tag="合約" panelList={panelList} />
      <div>
        <ContractList
          targetUrl={targetUrl}
          //
          viewRef={viewRef_bottom}
          viewRef_top={viewRef_top}
          contractArr={contractArr}
          ref={ref_container}
          activeContractId={activeContractId}
          onChangeActiveContract={(contractId) => {
            let activeContractPage = undefined;

            if (contractId && rawData_page) {
              Object.entries(rawData_page).forEach(([page, data]) => {
                if (!!data[contractId]) {
                  activeContractPage = page;
                }
              });
            }

            router.replace({
              query: {
                ...query,
                activeContractId: contractId,
                activeContractPage,
              },
            });
          }}
        />
      </div>
    </SubLayer>
  );
}
