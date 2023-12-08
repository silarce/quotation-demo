import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import Table, {
  Tcontrol_personalPerformanceStatistics,
  Tcontrol_row,
  Tcontrol_subTotalList,
  Tcontrol_total,
} from 'components/page/domestic/additionalEngineeringStatistics/Table';

// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';

// option
import { optionsCreator_month, optionsCreator_region, optionsCreator_year } from 'js/utils/options/options';

// api
import { useQuotationAccounting_modifyContract } from 'js/api/api_quotation';

// css
import scss from './index.module.scss';

// ==================================================================
type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tquery = {
  year: string | undefined;
  month: string | undefined;
  region: 'northern' | 'central' | 'southern' | 'eastern' | undefined;
  keyWord: string | undefined;
};

// ==================================================================
const yearOptionArr = optionsCreator_year();
const monthOptionArr = optionsCreator_month();
const regionOptionArr = optionsCreator_region({ emptyOption: true });

// ==================================================================
export default function AdditionalEngineeringStatistics() {
  const router = useRouter();
  const { year, month, region } = router.query as Tquery;

  // ------------------------------------------------------------------

  const { data, update } = useQuotationAccounting_modifyContract({
    // year: 2023,
    // month: 11,
    // area: 'all',
    year: year ? Number(year) + 1911 : undefined,
    month: month ? Number(month) : undefined,
    area: region || 'all',
  });

  useEffect(() => {
    update();
  }, []);

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

  // console.log(data);

  // ------------------------------------------------------------------

  const control_table: Tcontrol_personalPerformanceStatistics = useMemo(() => {
    if (!data) {
      return {
        rowArr: [],
        subTotalList: {},
        total: {
          totalsum: '',
          pricesum: '',
          percentage: '',
        },
        listKeyArr: [],
      };
    }

    const rowList: {
      [key: string]: Tcontrol_row;
    } = {};

    const subTotalList: {
      [key: string]: {
        totalsum: number;
        pricesum: number;
        percentage: number;
      };
    } = {};

    const total = {
      totalsum: 0,
      pricesum: 0,
      percentage: 0,
    };

    const listKeyQty: { [key: string]: number } = {};

    //
    //
    //
    data.forEach((item) => {
      const {
        //
        projectname,
        quotationnumber,
        // quotetype,
        year,
        month,
        totalsum,
        pricesum,
        county,
        percentage,
      } = item;

      let quotetype = item.quotetype;

      if (!quotetype) {
        quotetype = '無資料';
      }

      listKeyQty[quotetype] = (listKeyQty[quotetype] ?? 0) + 1;

      if (!subTotalList[quotetype]) {
        subTotalList[quotetype] = {
          totalsum: 0,
          pricesum: 0,
          percentage: 0,
        };
      }

      subTotalList[quotetype].totalsum = new Decimal(subTotalList[quotetype].totalsum).add(totalsum).toNumber();
      subTotalList[quotetype].pricesum = new Decimal(subTotalList[quotetype].pricesum).add(pricesum).toNumber();
      subTotalList[quotetype].percentage = new Decimal(subTotalList[quotetype].percentage).add(percentage).toNumber();

      total.totalsum = new Decimal(total.totalsum).add(totalsum).toNumber();
      total.pricesum = new Decimal(total.pricesum).add(pricesum).toNumber();
      total.percentage = new Decimal(total.percentage).add(percentage).toNumber();

      if (!rowList[quotationnumber]) {
        rowList[quotationnumber] = {
          quotationNumber: quotationnumber,
          projectName: projectname,
          list: {},
        };
      }

      rowList[quotationnumber].list[quotetype] = {
        totalsum: Number(totalsum).toLocaleString(),
        pricesum: Number(pricesum).toLocaleString(),
        percentage: `${percentage}%`,
      };
    }); // data.forEach
    //
    const control_rowArr: Tcontrol_row[] = Object.values(rowList).map((item) => {
      return item;
    });

    const theSubTotalList: Tcontrol_subTotalList = {};

    Object.keys(subTotalList).forEach((key) => {
      const percent = new Decimal(subTotalList[key].percentage).div(listKeyQty[key]).toNumber();

      theSubTotalList[key] = {
        ...subTotalList[key],
        totalsum: Number(subTotalList[key].totalsum).toLocaleString(),
        pricesum: Number(subTotalList[key].pricesum).toLocaleString(),
        percentage: `${percent}%`,
      };
    });

    const theTotal = {
      totalsum: Number(total.totalsum).toLocaleString(),
      pricesum: Number(total.pricesum).toLocaleString(),
      percentage: `${new Decimal(total.percentage).div(data.length).toNumber()}%`,
    };

    const listKeyArr = Object.keys(listKeyQty);

    return {
      rowArr: control_rowArr,
      subTotalList: theSubTotalList,
      total: theTotal,
      listKeyArr,
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

  const customeLeft = [<SelectBar key="0" className="ml-[6px]" selectPropsArr={selectPropsArr} />];

  // ------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader02 tag="追加工程統計表" customeLeft={customeLeft} />

      <Table control={control_table} />
    </SubLayer>
  );
}
