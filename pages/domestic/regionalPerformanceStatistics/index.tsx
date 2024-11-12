/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useMemo } from 'react';
import Decimal from 'decimal.js';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import ExcelJs, { TableProperties } from 'exceljs';
import _ from 'lodash';
import moment from 'moment';

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
      percentage: string | null; // 百分比
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
        // list[area][quotetype].percentage = new Decimal(list[area][quotetype].percentage).add(percentage).toString();
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
          const p = new Decimal(item_q.pricesum).div(item_q.totalsum).toDecimalPlaces(4).mul(100);

          return p.isNaN() ? null : p.toString() + '%';
        })();

        item_q.totalsum = Number(item_q.totalsum).toLocaleString();
        item_q.pricesum = Number(item_q.pricesum).toLocaleString();
      }); // Object.keys(item_c).forEach

      pricesumTotal = pricesumTotal.toDecimalPlaces(2);
      totalsumTotal = totalsumTotal.toDecimalPlaces(2);

      const percentageAve = pricesumTotal.div(totalsumTotal).toDecimalPlaces(4).mul(100).toString() + '%';

      item_c['合計'] = {
        totalsum: totalsumTotal.toNumber().toLocaleString(),
        pricesum: pricesumTotal.toNumber().toLocaleString(),
        percentage: percentageAve,
      };
    }); // Object.keys(list).forEach

    quotetypeList.合計 = '合計';

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

          obj.totalsum = new Decimal(obj.totalsum).add(unformat(value.totalsum) || 0).toNumber();
          obj.pricesum = new Decimal(obj.pricesum).add(unformat(value.pricesum) || 0).toNumber();
          obj.percentage = 0; //在下面重新計算
        }); // Object.entries
      }); //arr_area.forEach

      const 總價 = Object.entries(_.cloneDeep(總價_num)).reduce((obj, [key, value]) => {
        const {
          totalsum,
          pricesum,
          //  percentage
        } = value;

        const percentage = (() => {
          const p = new Decimal(pricesum).div(totalsum).toDecimalPlaces(4).mul(100);

          return p.isNaN() ? null : p.toString() + '%';
        })();

        obj[key] = {
          totalsum: totalsum.toLocaleString(),
          pricesum: pricesum.toLocaleString(),
          percentage: percentage,
        };

        return obj;
      }, {} as Tdata[string]);

      return 總價;
    })();

    // ______________________________________________________________________
    // ______________________________________________________________________

    const list_ordered: Tdata = (() => {
      const { 北部, 中部, 南部, 東部, 外銷, 總價, ...rest } = list;

      let list_ordered: Tdata = {
        北部,
        中部,
        南部,
        東部,
        外銷,
        ...rest,
        總價,
      };

      list_ordered = _.omitBy(list_ordered, (item) => !item);

      return list_ordered;
    })();

    // return { formatedList: list, quotetypeArr };
    return { formatedList: list_ordered, quotetypeArr };
  }, [data]);

  // -----------------------------------------------------------------------------

  // region PROPS

  const excelTitle = (() => {
    let str = `${year}　年`;
    month && (str = str + `　${month}　月`);
    str = str + '　業績統計表';

    return str;
  })();

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
        if (!formatedList || !quotetypeArr) {
          return;
        }

        dlExcel({
          title: excelTitle,
          excelName: excelTitle.replaceAll('　', ''),
          formatedList,
          quotetypeArr,
        });
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
              // if (quotetype === '合計') {
              //   quotetype = '合計';
              // }

              // if (quotetype === 'remark') {
              //   quotetype = '備註';
              // }

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

const unformat = (str: string) => {
  return str.replaceAll(/[,|%]/g, '');
};

// ==================================================================

// region dlExcel

const dlExcel = async ({
  excelName = moment().format('YYYY-MM-DD HH:mm:ss'),
  title,
  formatedList,
  quotetypeArr,
}: {
  excelName?: string;
  title: string;
  formatedList: Tdata;
  readonly quotetypeArr: string[];
}) => {
  formatedList = _.cloneDeep(formatedList);

  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet();

  sheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9,
  };

  // -------------------------------------------------------------------------

  const size_l = 18;
  const size_m = 13;
  const height_title = 30;
  const height_rowGroup = 25;
  const height_rowCaption = 26;

  // -------------------------------------------------------------------------

  let row_title: ExcelJs.Row;
  let row_subTitle: ExcelJs.Row;
  let row_caption: ExcelJs.Row;
  let row_reviewer: ExcelJs.Row;
  const rowGroup2DArr: ExcelJs.Row[][] = [];

  // -------------------------------------------------------------------------

  row_title = sheet.addRow(['三　久　建　材　工　業　股　份　有　限　公　司']);
  row_subTitle = sheet.addRow([title]);

  // -------------------------------------------------------------------------
  row_caption = sheet.addRow(['區域', '價別', ...quotetypeArr]);

  // -------------------------------------------------------------------------

  type TvalueList = {
    totalsum: (number | null)[];
    pricesum: (number | null)[];
    percentage: (number | null)[];
  };

  type Tvalue = string | number | null;

  Object.entries(formatedList).forEach(([key, subList]) => {
    const values_row1: Tvalue[] = [key, '承包價'];
    const values_row2: Tvalue[] = [null, '牌價'];
    const values_row3: Tvalue[] = [`${key}百分比`, null];

    const valueList: TvalueList = quotetypeArr.reduce(
      (list, type) => {
        if (!subList[type]) {
          list.totalsum.push(null);
          list.pricesum.push(null);
          list.percentage.push(null);

          return list;
        }

        const { totalsum, pricesum, percentage } = subList[type];
        const totalsum_num = Number(unformat(totalsum));
        const pricesum_num = Number(unformat(pricesum));
        const percentage_num = percentage ? new Decimal(unformat(percentage)).div(100).toNumber() : null;

        list.totalsum.push(totalsum_num);
        list.pricesum.push(pricesum_num);
        list.percentage.push(percentage_num);

        return list;
      },
      {
        totalsum: [],
        pricesum: [],
        percentage: [],
      } as TvalueList
    );
    values_row1.push(...valueList.pricesum);
    values_row2.push(...valueList.totalsum);
    values_row3.push(...valueList.percentage);

    rowGroup2DArr.push([
      //
      sheet.addRow(values_row1),
      sheet.addRow(values_row2),
      sheet.addRow(values_row3),
    ]);
  }); //  Object.entries(formatedList).forEach

  // -------------------------------------------------------------------------

  row_reviewer = sheet.addRow(['　　總經理 :　　　　　　　　主管 :　　　　　　　　製表:　　　　　　　　']);

  // -------------------------------------------------------------------------

  sheet.columns.forEach((col, index) => {
    let width = 12;
    index <= 1 && (width = 9);
    col.width = width;
    col.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };

    col.eachCell?.((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });
  // _______________________________________________________________________
  // _______________________________________________________________________

  const rowTitleArr = [row_title, row_subTitle];

  rowTitleArr.forEach((row) => {
    row.border = {};
    row.font = {
      size: size_l,
      bold: true,
    };
    row.height = height_title;

    const cellQrty = Math.min(14, Math.max(8, row_caption.cellCount));

    sheet.mergeCells(row.getCell(1).address, row.getCell(cellQrty).address);
  });

  // _______________________________________________________________________
  // _______________________________________________________________________

  row_caption.height = height_rowCaption;
  row_caption.font = {
    ...row_caption.font,
    size: size_m,
    bold: true,
  };

  row_caption.eachCell((cell) => {
    cell.border = {
      ...cell.border,
      bottom: { style: 'double' },
    };
  });

  // _______________________________________________________________________
  // _______________________________________________________________________

  rowGroup2DArr.forEach((rowArr) => {
    const [row1, row2, row3] = rowArr;

    rowArr.forEach((row) => {
      row.height = height_rowGroup;
    });

    row1.eachCell({ includeEmpty: true }, (cell, index) => {
      if (index <= 2) {
        cell.font = {
          ...cell.font,
          size: size_m,
        };

        return;
      }

      cell.alignment = {
        ...cell.alignment,
        horizontal: 'right',
      };
      cell.numFmt = '#,##0';
    });
    row2.eachCell({ includeEmpty: true }, (cell, index) => {
      if (index <= 2) {
        cell.font = {
          ...cell.font,
          size: size_m,
        };

        return;
      }

      cell.alignment = {
        ...cell.alignment,
        horizontal: 'right',
      };
      cell.numFmt = '#,##0';
    });
    row3.eachCell({ includeEmpty: true }, (cell, index) => {
      cell.border = {
        ...cell.border,
        bottom: { style: 'double' },
      };

      if (index <= 2) {
        cell.font = {
          ...cell.font,
          size: size_m,
        };

        return;
      }

      cell.alignment = {
        ...cell.alignment,
        horizontal: 'right',
      };
      cell.numFmt = '0.00%';
    });

    sheet.mergeCells(row1.getCell(1).address, row2.getCell(1).address);
    sheet.mergeCells(row3.getCell(1).address, row3.getCell(2).address);
  });

  // _______________________________________________________________________
  // _______________________________________________________________________
  row_reviewer.height = 30;
  row_reviewer.border = {};
  row_reviewer.alignment = {
    horizontal: 'left',
    vertical: 'bottom',
  };
  row_reviewer.font = {
    ...row_reviewer.font,
    size: size_m,
  };
  // _______________________________________________________________________
  // _______________________________________________________________________

  // -------------------------------------------------------------------------

  await workbook.xlsx.writeBuffer();

  workbook.xlsx.writeBuffer().then((content) => {
    const link = document.createElement('a');
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });

    link.download = `${excelName}.xlsx`;
    link.href = URL.createObjectURL(blobData);
    link.click();
    link.remove();
  });
};
