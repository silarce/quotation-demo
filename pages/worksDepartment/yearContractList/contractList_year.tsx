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

// css
import style from '../contractList.module.scss';

// api
import { useGetContract, Tparams } from 'js/api/api_quotation';

// type
import { TnorthernCounty, TcentralCounty, TsouthernCounty, TeasternCounty, Tabroad } from 'js/api/dtoTypes';

// option
import { optionsCreator_county, districtOptionsSelector } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_doorModelName } from 'js/utils/options/productOptions';

// ===========================================
const optionDoorModel = optionsCreator_doorModelName({ haveEmpty: true });
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
      // 導致filter出錯
      // 在後端做出處置前，先在前端過濾
      // 'accountReceivable.isDone': isDone === 'true' ? { $eq: true } : isDone === 'false' ? { $eq: false } : undefined,
      // 'accountReceivable.isDone': isDone === 'true' ? { $eq: true } : { $ne: true },
      // accountReceivable: { $notNull: true },
    },
  };

  const { data, update } = useGetContract(params);
  // 在後端做出處置前，先在前端過濾
  const dataArr = (data ?? []).filter((item) => {
    if (isDone === 'true') {
      return item.accountReceivable?.isDone === true;
    } else {
      return item.accountReceivable?.isDone !== true;
    }
  });

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
      const { content, accountReceivable } = contract;
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
      };

      contractNumber.startsWith('N-')
        ? list.northernArr.push(obj)
        : contractNumber.startsWith('M-')
        ? list.centralArr.push(obj)
        : contractNumber.startsWith('H-')
        ? list.southernArr.push(obj)
        : list.abroadArr.push(obj);

      // if (northernCountyArr.includes(county as TnorthernCounty)) {
      //   list.northernArr.push(obj);
      // } else if (centralCountyArr.includes(county as TcentralCounty)) {
      //   list.centralArr.push(obj);
      // } else if (southernCountyArr.includes(county as TsouthernCounty)) {
      //   list.southernArr.push(obj);
      // } else if (easternCountyArr.includes(county as TeasternCounty)) {
      //   list.easternArr.push(obj);
      // } else if (abroadArr.includes(county as Tabroad)) {
      //   list.abroadArr.push(obj);
      // }
    });

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ===================================================

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    // 現在後端filter doorModelName無效，所以先拿掉
    // {
    //   defaultValue: doorType ?? '',
    //   options: optionDoorModel,
    //   placeholder: '選擇門型',
    //   width: '90px',
    // },
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
    // const doorType = (vArr[0] as Toption).value;
    // const county = (vArr[0] as Toption).value;
    // const customerName = vArr[1] as string;
    // const keyWord = vArr[2] as string;
    // router.push({
    //   query: {
    //     ...router.query,
    //     // doorType,
    //     county,
    //     customerName,
    //     keyWord,
    //   },
    // });
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
      <div className={style.mainContainer}>
        <ContractList_sorted control={control_sortedContractList} />
      </div>
    </SubLayer>
  );
}

// // 判斷依據是跟後端要的
// const northernCountyArr: TnorthernCounty[] = [
//   '臺北市',
//   '新北市',
//   '基隆市',
//   '新竹市',
//   '桃園市',
//   '新竹縣',
//   '宜蘭縣',
//   '連江縣',
// ];
// const centralCountyArr: TcentralCounty[] = ['臺中市', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '金門縣'];
// const southernCountyArr: TsouthernCounty[] = ['高雄市', '臺南市', '嘉義市', '嘉義縣', '屏東縣', '澎湖縣'];
// const easternCountyArr: TeasternCounty[] = ['花蓮縣', '臺東縣'];
// const abroadArr: Tabroad[] = ['海外'];
