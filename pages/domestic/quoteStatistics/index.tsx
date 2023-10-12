import { useState } from 'react';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import Table from 'components/page/domestic/quoteStatistics/index/Table';

// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';
type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

// option
import { optionsCreator_month, optionsCreator_region, optionsCreator_year } from 'js/utils/options/options';
const monthOptionArr = optionsCreator_month({ emptyOption: true });
const regionOptionArr = optionsCreator_region({ emptyOption: true });
const yearOptionArr = optionsCreator_year();

type Tquery = {
  year: string | undefined;
  month: string | undefined;
  region: string | undefined;
  keyWord: string | undefined;
};

// ==================================================================
export default function QuoteStatistics() {
  const router = useRouter();
  const { year, month, region } = router.query as Tquery;

  const params = {
    filter: {},
  };

  // ------------------------------------------------------------------
  const selectPropsArr: TselectPropsArr = [
    {
      selectProps: {
        value: year,
        options: yearOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.push({
              query: {
                ...router.query,
                year: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇年份',
      boxStyle: { width: '140px' },
    },
    {
      selectProps: {
        value: month,
        options: monthOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.push({
              query: {
                ...router.query,
                month: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇月份',
      boxStyle: { width: '140px' },
    },
    {
      selectProps: {
        value: region,
        options: regionOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.push({
              query: {
                ...router.query,
                region: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇區域',
      boxStyle: { width: '140px' },
    },
  ];

  // ------------------------------------------------------------------
  const customeLeft = [<SelectBar key="0" className="ml-[6px]" selectPropsArr={selectPropsArr} />];

  const panelList: TpanelList = [
    {
      type: 'inputSearch',
      placeholder: '輸入搜尋內容',
      /**
      要搜尋的欄位有 編號 工程名稱 客戶 聯絡人 連絡電話
       */
      onClick: (str) => {
        router.push({
          query: {
            ...router.query,
            keyWord: str,
          },
        });
      },
    },
  ];
  // ------------------------------------------------------------------

  return (
    <SubLayer>
      <PageHeader02 tag="報價統計表" customeLeft={customeLeft} panelList={panelList} />

      <Table fakeDataArr={fakeDataArr} />
    </SubLayer>
  );
}
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

export type TfakeData = {
  idNumber: string;
  designDepartment: string;
  constructionName: string;
  customer: {
    customerName: string;
    contactPerson: string;
    contactPhone: string;
    listPrice: string;
    bearPrice: string;
    percent: string;
  }[];
  // listPrice: string
  // bearPrice: string
  // percent: string
};

const fakeDataOri01 = (): TfakeData => ({
  idNumber: 'M-2222202',
  designDepartment: '賴文魁 三久',
  constructionName: '台中市台中地區農會四民辦事處新建工程',
  customer: [
    {
      customerName: '昭雄營造',
      contactPerson: '王小明副理',
      contactPhone: '0987654321',
      listPrice: '1,373,614',
      bearPrice: '841,913',
      percent: '60%',
    },
  ],
});
const fakeDataOri02 = (): TfakeData => ({
  idNumber: 'M-2222202',
  designDepartment: '賴文魁 三久',
  constructionName: '台中市台中地區農會四民辦事處新建工程',
  customer: [
    {
      customerName: '昭雄營造',
      contactPerson: '王小明副理',
      contactPhone: '0987654321',
      listPrice: '1,373,614',
      bearPrice: '841,913',
      percent: '60%',
    },
    {
      customerName: '勇立興建築',
      contactPerson: '王小明副理',
      contactPhone: '0987654321',
      listPrice: '1,373',
      bearPrice: '841',
      percent: '40%',
    },
  ],
});

const fakeDataArr = [
  fakeDataOri01(),
  fakeDataOri02(),
  fakeDataOri01(),
  fakeDataOri02(),
  fakeDataOri01(),
  fakeDataOri02(),
];

// ---------------------------------------------------------------
