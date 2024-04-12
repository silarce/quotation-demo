import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import ContractList, { Tcontract } from 'components/page/worksDepartment/contracList/contractList';

// css
import style from './contractList.module.scss';

// api
import { useContract_infinite, Tparams } from 'js/api/api_quotation';

// type
import { Toption } from 'js/utils/options/options';

// option
import { optionsCreator_county, districtOptionsSelector } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_doorModel_2 } from 'js/utils/options/productOptions';

// ===========================================
const optionDoorModel = optionsCreator_doorModel_2({ haveEmpty: true });
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
};

export default function WdContractList() {
  const router = useRouter();
  const { doorType, county, district, address, customerName, keyWord } = router.query as Tquery;

  const params: Tparams = {
    sort: 'content.quotationDate',
    order: 'DESC',
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
        'content.quotationNumber': { $eq: keyWord },
      },
      engineeringContactId: { $notNull: true },
    },
  };

  const { dataArr, viewRef_bottom, isLoadingPage1, reset } = useContract_infinite({
    customParams: params,
  });

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  // ===================================================

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
    // const county = (vArr[1] as Toption).value;
    // const customerName = vArr[2] as string;
    // const keyWord = vArr[3] as string;
    // router.push({
    //   query: {
    //     doorType,
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
  };
  // -----------------------

  const panelList: TpanelList = [{ searchGroup }];

  // ===================================================

  const contractArr: Tcontract[] = dataArr.map((item) => {
    const { content, contractNumber } = item;

    const obj: Tcontract = {
      contractId: item.id,
      // quotationNumber: content.quotationNumber,
      contractNumber: contractNumber ?? '',
      customerName: content.customer?.name ?? '',
      contactName: content.contactPerson,
      contactNumber: content.contactNumber,
      agentName: content.agentEmployee.chName,
      date: content.quotationDate,
      county: content.county,
      projectName: content.projectName,
    };

    return obj;
  });

  // ===================================================

  return (
    <SubLayer isLoading_subLayer={isLoadingPage1}>
      <PageHeader02 tag="合約" panelList={panelList} />
      <div className={style.mainContainer}>
        <ContractList viewRef={viewRef_bottom} contractArr={contractArr} />
      </div>
    </SubLayer>
  );
}
