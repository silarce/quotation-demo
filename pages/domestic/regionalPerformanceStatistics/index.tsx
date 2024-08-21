import { useEffect, useMemo } from 'react';
import Decimal from 'decimal.js';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import ExcelJs, { TableProperties } from 'exceljs';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';

// option
import { optionsCreator_month, optionsCreator_year } from 'js/utils/options/options';

// css
import scss from './regionalPerformanceStatistics.module.scss';

// api
import {
  //
  TquotationAccouting_area,
  useQuotationAccounting_area,
} from 'js/api/api_quotation';

// ==================================================================
type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tquery = {
  year: string | undefined;
  month: string | undefined;
  keyWord: string | undefined;
};

type Tdata = {
  /**地區 */
  [area: string]: {
    /**門型 追加 合計 */
    [quotetype: string]: {
      totalsum: string; // 牌價複價
      pricesum: string; // 承包價複價
      percentage: string; // 百分比
    };
  };
};

type Tarea_num = {
  [quotetype: string]: {
    totalsum: number; // 牌價複價
    pricesum: number; // 承包價複價
    percentage: number; // 百分比
  };
};

// ==================================================================
const monthOptionArr = optionsCreator_month({ emptyOption: true });
const yearOptionArr = optionsCreator_year();

// ==================================================================
// MARK: 全區業績統計表
//
//
//
//
//
// MARK: START
export default function RegionalPerformanceStatistics() {
  const router = useRouter();
  const { year, month } = router.query as Tquery;

  // ------------------------------------------------------------------

  const params = {
    year: year ? Number(year) + 1911 : undefined,
    month: month ? Number(month) : undefined,
  };

  const { data, update } = useQuotationAccounting_area(params);

  // ------------------------------------------------------------------

  const { formatedList, quotetypeArr } = useMemo(() => {
    if (!data) {
      return {};
    }

    const list: Tdata = {};

    const quotetypeList: { [key: string]: string } = {};

    data.forEach((item) => {
      const {
        //  year, month,
        totalsum, // 牌價
        pricesum, // 承包價
      } = item;
      let {
        //
        percentage,
        quotetype,
        // county,
        // area,
      } = item;
      let area: TquotationAccouting_area['area'] | '---' = item.area;

      if (percentage === null) {
        percentage = 0;
      }

      if (!quotetype) {
        quotetype = '---';
      }

      if (!area) {
        area = '---';
      }

      quotetypeList[quotetype] = quotetype;

      if (!list[area]) {
        list[area] = {};
      }

      if (!list[area][quotetype]) {
        list[area][quotetype] = {
          totalsum: totalsum,
          pricesum: pricesum,
          percentage: String(percentage),
        };
      } else {
        list[area][quotetype].totalsum = new Decimal(list[area][quotetype].totalsum).add(totalsum).toString();
        list[area][quotetype].pricesum = new Decimal(list[area][quotetype].pricesum).add(pricesum).toString();
        list[area][quotetype].percentage = new Decimal(list[area][quotetype].percentage).add(percentage).toString();
      }
    });
    //
    //

    Object.keys(list).forEach((key_c) => {
      const item_c = list[key_c];

      let totalsumTotal = new Decimal(0);
      let pricesumTotal = new Decimal(0);

      Object.keys(item_c).forEach((key_q) => {
        const item_q = item_c[key_q];

        //

        totalsumTotal = totalsumTotal.add(item_q.totalsum);
        pricesumTotal = pricesumTotal.add(item_q.pricesum);
        //
        //
        // item_q.percentage的賦值必須在下面那兩行之前，因為數字串格式不同
        item_q.percentage = (() => {
          const p = new Decimal(item_q.pricesum).div(item_q.totalsum).toDecimalPlaces(2).mul(100);

          return p.isNaN() ? 'n/a' : p.toString() + '%';
        })();

        item_q.totalsum = Number(item_q.totalsum).toLocaleString();
        item_q.pricesum = Number(item_q.pricesum).toLocaleString();
      }); // Object.keys(item_c).forEach

      pricesumTotal = pricesumTotal.toDecimalPlaces(2);
      totalsumTotal = totalsumTotal.toDecimalPlaces(2);

      const percentageAve = pricesumTotal.div(totalsumTotal).toDecimalPlaces(2).mul(100).toString() + '%';

      item_c['total'] = {
        totalsum: totalsumTotal.toNumber().toLocaleString(),
        pricesum: pricesumTotal.toNumber().toLocaleString(),
        percentage: percentageAve,
      };
    }); // Object.keys(list).forEach

    quotetypeList.total = 'total';

    const quotetypeArr = Object.keys(quotetypeList);

    // ______________________________________________________________________

    list.總價 = (() => {
      const 總價_num: Tarea_num = {};

      const arr_area = Object.values(list);

      arr_area.forEach((quotetypeList) => {
        Object.entries(quotetypeList).forEach(([key, value]) => {
          //
          if (!總價_num[key]) {
            總價_num[key] = {
              totalsum: 0,
              pricesum: 0,
              percentage: 0,
            };
          }
          //

          const obj = 總價_num[key];

          obj.totalsum = new Decimal(obj.totalsum).add(toNum(value.totalsum) || 0).toNumber();
          obj.pricesum = new Decimal(obj.pricesum).add(toNum(value.pricesum) || 0).toNumber();
          obj.percentage = 0; //在下面重新計算
        }); // Object.entries
      }); //arr_area.forEach

      const 總價 = Object.entries(_.cloneDeep(總價_num)).reduce((obj, [key, value]) => {
        const {
          totalsum,
          pricesum,
          //  percentage
        } = value;

        // const percentage = new Decimal(pricesum).div(totalsum).toDecimalPlaces(2).mul(100).toString() + '%';
        const percentage = (() => {
          const p = new Decimal(pricesum).div(totalsum).toDecimalPlaces(2).mul(100);

          return p.isNaN() ? 'n/a' : p.toString() + '%';
        })();

        obj[key] = {
          totalsum: totalsum.toLocaleString(),
          pricesum: pricesum.toLocaleString(),
          percentage: percentage.toString(),
        };

        return obj;
      }, {} as Tdata[string]);

      return 總價;
    })();

    // ______________________________________________________________________

    return { formatedList: list, quotetypeArr };
  }, [data]);

  // console.log(formatedList);
  // console.log(quotetypeArr);

  // -----------------------------------------------------------------------------

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
  ];

  const customeLeft = [<SelectBar key="0" className="ml-[6px]" selectPropsArr={selectPropsArr} />];

  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '匯出Excel',
      onClick: () => {
        dlExcel();
      },
    },
  ];

  // -----------------------------------------------------------------------------
  // region useEffect

  useEffect(() => {
    const now = new Date();
    const theYear = year || now.getFullYear() - 1911;
    const theMonth = month;

    router.push({
      query: {
        year: theYear,
        month: theMonth,
      },
    });
  }, []);

  useEffect(() => {
    update();
  }, [year, month]);

  // --------------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer>
      <PageHeader02 tag="全區業績統計表" customeLeft={customeLeft} panelList={panelList} />

      <div className={scss.wrapper}>
        <div className={scss.table}>
          <div className={scss.thead}>
            <div></div>
            {/*  */}
            {quotetypeArr?.map((quotetype, index) => {
              if (quotetype === 'total') {
                quotetype = '合計';
              }

              if (quotetype === 'remark') {
                quotetype = '備註';
              }

              return (
                <div key={index}>
                  <span>{quotetype}</span>
                </div>
              );
            })}
            {/*  */}
          </div>
          <div className={scss.tbody}>
            {Object.keys(formatedList ?? {}).map((key, index) => {
              if (!formatedList?.[key]) {
                return null;
              }

              const item = formatedList[key];

              return (
                <div key={index} className={scss.row}>
                  <div>
                    <div className={classNames(scss.noBottom, scss.plus, scss.titleCell)}>
                      <span>{key}</span>
                    </div>
                    <div>
                      <span>承包價</span>
                    </div>
                    <div>
                      <span>牌價</span>
                    </div>
                    <div className={classNames(scss.noBottom, scss.plus)}>
                      <span>{key}百分比</span>
                    </div>
                  </div>
                  {/*  */}

                  {quotetypeArr.map((key, index_q) => {
                    const item_q = item[key];

                    const { totalsum, pricesum, percentage } = item_q ?? {};

                    return (
                      <div key={index_q}>
                        <div>
                          <span>{pricesum}</span>
                        </div>
                        <div>
                          <span>{totalsum}</span>
                        </div>
                        <div className={classNames(scss.noBottom, scss.plus)}>
                          <span>{percentage}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/*  */}
                </div>
              );
            })}
          </div>
          {/* table close */}
        </div>
      </div>
    </SubLayer>
  );
}
// MARK:END

// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================

const toNum = (str: string) => {
  return str.replaceAll(',', '');
};

// ==================================================================

const dlExcel = () => {
  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet();

  sheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9,
  };
};
