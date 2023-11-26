import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import Table from 'components/page/domestic/quoteStatistics/index/Table';

// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';
type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

// api
import { useQuotationAccounting } from 'js/api/api_quotation';

// option
import { optionsCreator_month, optionsCreator_region, optionsCreator_year } from 'js/utils/options/options';
const monthOptionArr = optionsCreator_month({ emptyOption: true });
const regionOptionArr = optionsCreator_region({ emptyOption: true });
const yearOptionArr = optionsCreator_year();

type Tquery = {
  year: string | undefined;
  month: string | undefined;
  region: 'northern' | 'central' | 'southern' | 'eastern' | undefined;
  keyWord: string | undefined;
};

// ==================================================================
export default function QuoteStatistics() {
  const router = useRouter();
  const { year, month, region } = router.query as Tquery;

  const { data, update } = useQuotationAccounting({
    year: year ? Number(year) + 1911 : undefined,
    month: month ? Number(month) : undefined,
    area: region || 'all',
  });

  useEffect(() => {
    update();
  }, [year, month, region]);

  useEffect(() => {
    const now = new Date();
    const theYear = year || now.getFullYear() - 1911;
    const theMonth = month || now.getMonth() + 1;

    router.push({
      query: {
        year: theYear,
        month: theMonth,
        region: region,
      },
    });
  }, []);

  const { formatedDataArr, listPriceTotal, bearPriceTotal, percent } = useMemo(() => {
    if (!data) {
      return {
        formatedDataArr: [],
        listPriceTotal: '0',
        bearPriceTotal: '0',
        percent: '0',
      };
    }

    let listPriceTotal = 0;
    let bearPriceTotal = 0;
    let percent = new Decimal(0);

    const arr: Tdata[] = data.map((item) => {
      listPriceTotal += Number(item.pricesum || 0);
      bearPriceTotal += Number(item.totalsum || 0);
      percent = percent.add(item.percentage);

      return {
        idNumber: item.quotation_number,
        designDepartment: '設計單位',
        constructionName: item.project_name,
        customer: [
          {
            customerName: item.customername,
            contactPerson: item.contactperson,
            contactPhone: item.contactnumber,
            listPrice: Number(item.pricesum).toLocaleString(),
            bearPrice: Number(item.totalsum).toLocaleString(),
            percent: `${item.percentage}%`,
          },
        ],
      };
    });

    const percent_locale = percent.div(arr.length).toString() + '%';

    return {
      formatedDataArr: arr,
      listPriceTotal: listPriceTotal.toLocaleString(),
      bearPriceTotal: bearPriceTotal.toLocaleString(),
      percent: percent_locale,
    };
  }, [data]);

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
      <Table
        dataArr={formatedDataArr}
        totalInfo={{
          listPrice: listPriceTotal,
          bearPrice: bearPriceTotal,
          percent: percent,
        }}
      />
    </SubLayer>
  );
}
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

export type Tdata = {
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
};
