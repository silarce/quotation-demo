import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// global gear
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';

// components
import ContractList, { Tcontract } from 'components/page/worksDepartment/contracList/contractList';

// css
import style from './contractList.module.scss';

// api
import { useContract_infinite } from 'js/api/api_quotation';

// type
import { Toption } from 'js/utils/options/options';

// ===========================================

export default function WdContractList() {
  // ===================================================

  const { dataList, dataArr, viewRef_top, viewRef_bottom, isLoadingPage1, isLoading, meta, init, reset } =
    useContract_infinite({});

  useEffect(() => {
    reset();
  }, []);

  // ===================================================

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      // stateValue: doorType,
      options: doorTypeOptions,
      placeholder: '選擇門型',
      width: '90px',
      // onChange: (option: Toption | null) => {
      //   if (!option) return
      //   setDoorType(option)
      // }
    },
    {
      // stateValue: country,
      options: countryOptions,
      placeholder: '選擇地區',
      width: '80px',
      // onChange: (option: Toption | null) => {
      //   if (!option) return
      //   setCountry(option)
      // }
    },
    {
      // stateValue: clientName,
      placeholder: '請輸入客戶名稱',
      // onChange: (e: ChangeEvent<HTMLInputElement>) => setClientName(e.target.value)
    },
    {
      // stateValue: projectName,
      placeholder: '請輸入專案名稱',
      // onChange: (e: ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)
    },
  ];

  const doSearch: TsearchGroup['doSearch'] = (vArr) => {
    const doorType = (vArr[0] as Toption).value;
    const country = (vArr[1] as Toption).value;
    const clientName = vArr[2] as string;
    const projectName = vArr[3] as string;
  };

  const searchGroup = {
    searchTargetList,
    doSearch,
  };
  // -----------------------

  const panelList: TpanelList = [{ searchGroup }];

  // ===================================================

  const contractArr: Tcontract[] = dataArr.map((item) => {
    const { content } = item;

    const foo: Tcontract = {
      contractId: item.id,
      quotationNumber: content.quotationNumber,
      customerName: content.customer.name,
      contactName: content.contactPerson,
      contactNumber: content.contactNumber,
      agentName: content.agentEmployee.chName,
      discount: content.discount,
      doorQty: String(content.quantity),
      totalPrice: content.total.toLocaleString(),
      date: content.quotationDate,
      county: content.county,
      projectName: content.projectName,
    };

    return foo;
  });

  // ===================================================

  return (
    <div className={style.container}>
      {/* header panel */}
      <PageHeader02 tag="合約" panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <ContractList contractArr={contractArr} />
      </div>
    </div>
  );
}

// ==========================================================
// ==========================================================
// ==========================================================
const doorTypeOptions: Toption[] = [
  { value: '', label: '不拘' },
  { value: 'SJ-30287', label: 'SJ-30287' },
  { value: 'SJ-302', label: 'SJ-302' },
  { value: '門型一', label: '門型一' },
  { value: '門型二', label: '門型二' },
  { value: '門型三', label: '門型三' },
];
const countryOptions: Toption[] = [
  { value: '', label: '不拘' },
  { value: '台北市', label: '台北市' },
  { value: '新北市', label: '新北市' },
  { value: '基隆縣', label: '基隆縣' },
  { value: '桃園市', label: '桃園市' },
  { value: '新竹縣', label: '新竹縣' },
  { value: '新竹市', label: '新竹市' },
  { value: '苗栗縣', label: '苗栗縣' },
  { value: '台中市', label: '台中市' },
];

// ==========================================================
