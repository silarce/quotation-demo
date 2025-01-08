import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// global gear
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import ContractList_sorted, {
  Tcontract,
  Tcontrol_sortedContractList,
} from 'components/page/worksDepartment/contracList/contractList_sorted';

// api
import { useGetContract, Tparams } from 'js/api/api_quotation';

// option
import { optionsCreator_county, districtOptionsSelector } from 'js/utils/options/countryAndDistrict';

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
  year: string | undefined;
  isDone: string | undefined;
};

export default function WdContractList() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { doorType, county, district, address, customerName, keyWord, year, isDone } = router.query as Tquery;

  const { yearStart, yearEnd } = useMemo(() => {
    if (!year) {
      return { yearStart: undefined, yearEnd: undefined };
    }

    const yearStart = moment().year(Number(year)).startOf('year').toISOString();
    const yearEnd = moment().year(Number(year)).endOf('year').toISOString();

    return { yearStart, yearEnd };
  }, [year]);

  // =====================================================================
  const [countyState, setCountyState] = useState<string | undefined>(undefined);
  const [districtState, setDistrictState] = useState<string | undefined>(undefined);
  const [addressState, setAddressState] = useState<string | undefined>(undefined);
  const [customerNameState, setCustomerNameState] = useState<string | undefined>(undefined);
  const [keyWordState, setKeyWordState] = useState<string | undefined>(undefined);

  useEffect(() => {
    setCountyState(county);
    setDistrictState(district);
    setAddressState(address);
    setCustomerNameState(customerName);
    setKeyWordState(keyWord);
  }, [router.query]);

  // =====================================================================

  const params: Tparams = {
    pageSize: 99999,
    sort: 'contractNumber',
    order: 'ASC',
    populate: [
      //
      'content.customer',
      'content.agentEmployee',
      'content.reviewSalesEmployee',
      'accountReceivable',
      'content.products',
    ],

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
        'content.quotationNumber': { $contains: keyWord },
      },
      engineeringContactId: { $notNull: true },
      'content.quotationDate': {
        $gte: yearStart,
        $lte: yearEnd,
      },

      // 報價單若沒有accountReceivable，取得的資料連accountReceivable這個property都不會有
      // 送accountReceivable相關的參數會400錯誤
      // 所以無法以api的filter過濾accountReceivable相關資料
      // accountReceivable: { $notNull: true },
      // 'accountReceivable.isDone': isDone === 'true' ? { $eq: true } : isDone === 'false' ? { $eq: false } : undefined,
      // 'accountReceivable.isDone': isDone === 'true' ? { $eq: true } : { $ne: true },
    },
  };

  const { data, update } = useGetContract(params);

  const dataArr = useMemo(() => {
    // 因為無法使用api的filter過濾accountReceivable相關資料，所以在前端這邊過濾
    const dataArr = (data ?? []).filter((item) => {
      if (isDone === 'true') {
        return item.accountReceivable?.isDone === true;
      } else {
        return item.accountReceivable?.isDone !== true;
      }
    });

    return dataArr;
  }, [data]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await update();
      setIsLoading(false);
    })();
  }, [router.query]);

  const control_sortedContractList: Tcontrol_sortedContractList = useMemo(() => {
    const list: Tcontrol_sortedContractList = {
      northernArr: [],
      centralArr: [],
      southernArr: [],
      // easternArr: [],
      abroadArr: [],
    };

    dataArr.forEach((contract) => {
      const { content, accountReceivable, unReviewPicture, unReviewWorkSheet } = contract;
      let { contractNumber } = contract;
      contractNumber = contractNumber || '';

      const {
        //
        customer,
        contactPerson,
        contactNumber,
        agentEmployee,
        quotationDate,
        county,
        projectName,
      } = content;

      const { hasNoContract, hasUncollectedAmounts } = accountReceivable ?? {};

      const obj: Tcontract = {
        contractId: contract.id,
        contractNumber: contractNumber ?? '',
        customerName: customer?.name ?? '',
        contactName: contactPerson,
        contactNumber: contactNumber,
        agentName: agentEmployee?.chName || agentEmployee?.enName || '',
        date: quotationDate,
        county,
        projectName,
        alertLight: hasNoContract,
        remindLight: hasUncollectedAmounts,
        //
        QtyOfProjectPatternForReview: 0,
        QtyOfWorkwheetForReview: 0,
        unReviewPicture,
        unReviewWorkSheet,
      };

      contractNumber.startsWith('N-')
        ? list.northernArr.push(obj)
        : contractNumber.startsWith('M-')
        ? list.centralArr.push(obj)
        : contractNumber.startsWith('H-')
        ? list.southernArr.push(obj)
        : list.abroadArr.push(obj);
    });

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
    router.push({
      query: {
        ...router.query,
        county: countyState,
        district: districtState,
        address: addressState,
        customerName: customerNameState,
        keyWord: keyWordState,
      },
    });
  };

  const searchGroup = {
    searchTargetList,
    doSearch,
    controlled: true,
  };
  // -----------------------

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.push({
          pathname: '/worksDepartment/yearContractList',
        });
      },
    },
  ];

  // ===================================================

  return (
    <SubLayer isLoading_subLayer={isLoading}>
      {/* header panel */}
      <PageHeader02 tag="合約" panelList={panelList} />
      {/*  */}
      <div>
        <ContractList_sorted control={control_sortedContractList} />
      </div>
    </SubLayer>
  );
}
