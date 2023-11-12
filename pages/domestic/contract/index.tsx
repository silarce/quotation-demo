import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// global gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// components
import ContractList, { Tcontract } from 'components/page/domestic/contract/contractList';

// option
import { optionsCreator_county } from 'js/utils/options/countryAndDistrict';
import { optionsCreator_doorModel, Toption } from 'js/utils/options/productOptions';

// api
import { useGetContract, useContract_infinite } from 'js/api/api_quotation';
// css
import style from './contract.module.scss';

// ===========================================

const optionDoorModel = optionsCreator_doorModel({ haveEmpty: true });
const optionsCounty = optionsCreator_county();
optionsCounty.unshift({ value: '', label: '不拘' });

// ===========================================
// 合約列表單個項目展開裡的內容是追加追減項目
// 合約列表單個項目展開裡的內容是追加追減項目
// 合約列表單個項目展開裡的內容是追加追減項目
export default function Contract() {
  const router = useRouter();

  const params = {
    filter: {
      version: { $eq: 1 },
    },
  };

  // const { data, update } = useGetContract(params);

  // useEffect(() => {
  //   update();
  // }, []);

  const {
    //
    dataArr,
    viewRef_bottom,
    isLoadingPage1,
    // isLoading,
    init,
    reset,
  } = useContract_infinite({ customParams: params });

  useEffect(() => {
    reset();
  }, [router.query]);

  // --------------------------------------------------

  const searchTargetList = [
    {
      options: optionDoorModel,
      placeholder: '選擇門型',
      width: '100px',
      defaultValue: router.query.doorModel as string,
    },
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
    const doorModel = (valueArr[0] as Toption).value;
    const county = (valueArr[1] as Toption).value;
    const clientName = valueArr[2] as string;
    const projectName = valueArr[3] as string;

    router.push({
      href: '',
      query: {
        ...router.query,
        doorModel,
        county,
        clientName,
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
    dataArr?.map((item, index) => {
      const content = item.content;

      return {
        id: item.id,
        quotationId: content.quotationNumber,
        clientName: content.customer.name,
        quotationName: content.projectName,
        discount: item.discount,
        priceTotal: String(item.total),
        contactPerson: content.contactPerson,
        contactPhone: content.contactNumber,
        attn: content.agentEmployee.chName,
        viewRef_bottom: index === dataArr.length - 5 ? viewRef_bottom : undefined,
      };
    }) ?? [];

  return (
    <div className={style.container}>
      {/* header panel */}
      <PageHeader02 tag="合約" panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <ContractList contractList={contractList} />
      </div>
    </div>
  );
}
