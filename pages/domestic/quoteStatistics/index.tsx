import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
// import ExcelJs, { TableProperties } from 'exceljs';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import Table, { Tcontrol_row, TcontrolTotalList } from 'components/page/domestic/quoteStatistics/index/Table';

// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

// api
import { useQuotationAccounting } from 'js/api/api_quotation';

// option
import {
  optionsCreator_month,
  optionsCreator_region,
  optionsCreator_year,
  optionsCreator_quotationStatus,
} from 'js/utils/options/options';

import { TquotationStatus } from 'js/api/dtoTypes';

// ==================================================================

type Tquery = {
  year: string | undefined;
  month: string | undefined;
  region: 'northern' | 'central' | 'southern' | 'eastern' | undefined;
  keyWord: string | undefined;
  quotationStatus: TquotationStatus | undefined;
};

type Tdata = {
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

export type { Tdata };

// ==================================================================

const yearOptionArr = optionsCreator_year();
const monthOptionArr = optionsCreator_month({ emptyOption: true });
const regionOptionArr = optionsCreator_region({ emptyOption: true });
const quotationStatusArr = optionsCreator_quotationStatus({ emptyOption: true, need: 'basic' });

// ==================================================================

// MARK: START

export default function QuoteStatistics() {
  const router = useRouter();
  const { year, month, region, quotationStatus } = router.query as Tquery;

  // ------------------------------------------------------------------

  const { data, update } = useQuotationAccounting({
    year: year ? Number(year) + 1911 : undefined,
    month: month ? Number(month) : undefined,
    area: region || 'all',
    quotationStatus: quotationStatus || 'all',
  });

  // ------------------------------------------------------------------
  const { control_rowArr, groupListKeyArr, control_totalList } = useMemo(() => {
    if (!data) {
      return {
        control_rowArr: [],
        groupListKeyArr: [],
        control_totalList: {},
      };
    }

    const list: {
      [key: string /**quotation_number */]: Tcontrol_row;
    } = {};

    // 只是要在最後取key
    const quoteTypeQtyList: { [key: string]: number } = {};

    const totalList: {
      [key: string]: {
        listPrice: number;
        bearPrice: number;
        percent: number;
      };
    } = {};

    data.forEach((item) => {
      const {
        //
        quotation_number,
        // quotetype,
        project_name,
        customername,
        contactperson,
        contactnumber,
        // percentage,
        pricesum,
        totalsum,
        percentage,
      } = item;

      let quotetype = item.quotetype;

      if (!quotetype) {
        quotetype = '無資料';
      }

      quoteTypeQtyList[quotetype] = (quoteTypeQtyList[quotetype] ?? 0) + 1;

      // _______________________
      if (!totalList[quotetype]) {
        totalList[quotetype] = {
          listPrice: 0,
          bearPrice: 0,
          percent: 0,
        };
      }

      totalList[quotetype].listPrice = new Decimal(totalList[quotetype].listPrice).add(totalsum || 0).toNumber();
      totalList[quotetype].bearPrice = new Decimal(totalList[quotetype].bearPrice).add(pricesum || 0).toNumber();
      totalList[quotetype].percent = new Decimal(totalList[quotetype].percent).add(percentage || 0).toNumber();

      // _______________________

      if (!list[quotation_number]) {
        list[quotation_number] = {
          idNumber: quotation_number,
          designDepartment: '',
          constructionName: project_name,
          subRowArr: [],
        };
      }

      let subRowIndex = list[quotation_number].subRowArr.findIndex((item) => {
        return item.customerName === customername;
      });

      if (subRowIndex === -1) {
        list[quotation_number].subRowArr.push({
          customerName: customername,
          contactPerson: contactperson,
          contactPhone: contactnumber,
          groupList: {},
        });
        subRowIndex = 0;
      }

      list[quotation_number].subRowArr[subRowIndex].groupList[quotetype] = {
        listPrice: Number(item.totalsum).toLocaleString(),
        bearPrice: Number(item.pricesum).toLocaleString(),
        percent: `${item.percentage ?? ''}%`,
      };
    });

    const groupListKeyArr = Object.keys(quoteTypeQtyList);

    groupListKeyArr.forEach((key) => {
      const qty = quoteTypeQtyList[key];
      const percent = totalList[key].percent;
      totalList[key].percent = new Decimal(percent).div(qty).toDecimalPlaces(2).toNumber();
    });

    const control_totalList: TcontrolTotalList = {};

    Object.keys(totalList).forEach((key) => {
      control_totalList[key] = {
        listPrice: totalList[key].listPrice.toLocaleString(),
        bearPrice: totalList[key].bearPrice.toLocaleString(),
        percent: `${totalList[key].percent ?? ''}%`,
      };
    });

    return {
      //
      control_rowArr: Object.values(list),
      groupListKeyArr,
      control_totalList,
    };
  }, [data]);

  // ------------------------------------------------------------------

  // region PROPS

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

  const panelList: TpanelList = [
    // {
    //   type: 'myButton',
    //   label: '匯出Excel',
    //   onClick: dlExcel,
    // },
  ];
  // ------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    update();
  }, [year, month, region, quotationStatus]);

  useEffect(() => {
    const now = new Date();
    const theYear = year || now.getFullYear() - 1911;
    const theMonth = month;

    router.push({
      query: {
        year: theYear,
        month: theMonth,
        region: region,
      },
    });
  }, []);

  // ------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer>
      <PageHeader02 tag="報價統計表" customeLeft={customeLeft} panelList={panelList} />
      <Table
        control={{
          rowArr: control_rowArr,
          groupListKeyArr,
          totalList: control_totalList,
        }}
      />
    </SubLayer>
  );
}

// MARK: END

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
