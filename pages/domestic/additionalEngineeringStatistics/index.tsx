/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import _ from 'lodash';
import ExcelJs, { TableProperties } from 'exceljs';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// antd
import { Select } from 'antd';

// component
import Table, {
  Tcontrol_personalPerformanceStatistics,
  Tcontrol_row,
  Tcontrol_subTotalList,
  Tcontrol_total,
  TareaContent,
  TareaList,
} from 'components/page/domestic/additionalEngineeringStatistics/Table';

// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';

// option
import { optionsCreator_month, optionsCreator_region, optionsCreator_year } from 'js/utils/options/options';

// api
import { useQuotationAccounting_modifyContract } from 'js/api/api_quotation';

// ==================================================================
type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tquery = {
  year: string | undefined;
  month: string | undefined;
  region: 'northern' | 'central' | 'southern' | 'eastern' | undefined;
  regionArr: ('northern' | 'central' | 'southern' | 'eastern')[] | undefined;
  keyWord: string | undefined;
};

// type TareaContent = {
//   areaName: string;
//   pricesum_num: number; // 承價
//   pricesum: string; // 承價
// };

// type TareaList = {
//   [key: string]: TareaContent;
// };

// ==================================================================
const yearOptionArr = optionsCreator_year();
const monthOptionArr = optionsCreator_month({ emptyOption: true });
const regionOptionArr = optionsCreator_region({ emptyOption: true });
const regionOptionArr2 = optionsCreator_region();

// ==================================================================

// MARK: START

export default function AdditionalEngineeringStatistics() {
  const router = useRouter();
  const { year, month, region, regionArr } = router.query as Tquery;

  // ------------------------------------------------------------------

  const { data, update } = useQuotationAccounting_modifyContract({
    year: year ? Number(year) + 1911 : undefined,
    month: month ? Number(month) : undefined,
    area: region || 'all',
  });

  // ------------------------------------------------------------------

  // region cooked Data

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
        areaList: {},
      };
    }

    const areaList: TareaList = {};

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
    data.forEach((item, index) => {
      const {
        //
        projectname,
        quotationnumber,

        year,
        month,
        totalsum,
        pricesum,
        county,
        area,
        // percentage,
      } = item;

      areaList[area || '---'] = {
        areaName: area || '---',
        pricesum_num: new Decimal(areaList[area || '---']?.pricesum_num ?? 0).add(pricesum || 0).toNumber(),
        pricesum: '',
      };

      const key = `${index}-${quotationnumber}`;

      let { quotetype, percentage } = item;

      if (!quotetype) {
        quotetype = '無資料';
      }

      if (percentage === null) {
        percentage = 0;
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

      // 原本quotationnumber是唯一且不可為null的值
      // 但是某天quotationnumber可null了，所以改用key處理rowList的索引
      // 還好原本就沒有用quotationnumber找到特定資料的處理，所以key可以是任意唯一值
      if (!rowList[key]) {
        rowList[key] = {
          quotationNumber: quotationnumber ?? '---',
          projectName: projectname,
          list: {},
        };
      }

      rowList[key].list[quotetype] = {
        totalsum: Number(totalsum).toLocaleString(),
        pricesum: Number(pricesum).toLocaleString(),
        percentage: `${percentage}%`,
      };

      // if (!rowList[quotationnumber]) {
      //   rowList[quotationnumber] = {
      //     quotationNumber: quotationnumber,
      //     projectName: projectname,
      //     list: {},
      //   };
      // }

      // rowList[quotationnumber].list[quotetype] = {
      //   totalsum: Number(totalsum).toLocaleString(),
      //   pricesum: Number(pricesum).toLocaleString(),
      //   percentage: `${percentage}%`,
      // };
    }); // data.forEach
    //
    const control_rowArr: Tcontrol_row[] = Object.values(rowList).map((item) => {
      return item;
    });

    const theSubTotalList: Tcontrol_subTotalList = {};

    Object.keys(subTotalList).forEach((key) => {
      const percent = new Decimal(subTotalList[key].percentage).div(listKeyQty[key]).toDecimalPlaces(2).toNumber();

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
      percentage: `${new Decimal(total.percentage).div(data.length).toDecimalPlaces(2).toNumber()}%`,
    };

    const listKeyArr = Object.keys(listKeyQty);

    Object.values(areaList).forEach((areaContent) => {
      areaContent.pricesum = areaContent.pricesum_num.toLocaleString();
    });

    return {
      rowArr: control_rowArr,
      subTotalList: theSubTotalList,
      total: theTotal,
      listKeyArr,
      // areaList,
      areaList: {}, // 待api更新
    };
  }, [data]);

  // ------------------------------------------------------------------

  // region PROPS

  const excelTitle = (() => {
    let str = `${year}　年`;

    month && (str = str + `　${month}　月`);
    region && (str = str + `　${lookup_region[region]}`);
    str = str + '　追加工程統計表';

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

  const customeLeft = [
    //
    <SelectBar key="0" className="ml-[6px]" selectPropsArr={selectPropsArr} />,
    // <Select
    //   key="1"
    //   className="ml-[6px] w-[280px]"
    //   mode="multiple"
    //   allowClear
    //   //
    //   placeholder="區域，可複選"
    //   value={regionArr}
    //   options={regionOptionArr2}
    //   onChange={(arr) => {
    //     router.replace({
    //       query: {
    //         ...router.query,
    //         regionArr: arr,
    //       },
    //     });
    //   }}
    // />,
  ];

  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '匯出excel',
      onClick: () => {
        dlExcel({
          excelName: excelTitle.replaceAll('　', ''),
          data: control_table,
          title: excelTitle,
        });
      },
    },
  ];

  // ------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    update();
  }, [year, month, region]);

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

  // region: RENDER

  return (
    <SubLayer>
      <PageHeader02 tag="追加工程統計表" customeLeft={customeLeft} panelList={panelList} />

      <Table control={control_table} />
    </SubLayer>
  );
}

// MARK: END

// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================

const lookup_region: { [key: string]: string | undefined } = {
  northern: '北部',
  central: '中部',
  southern: '南部',
  eastern: '東部',
  all: '全區',
};

// MARK: dlExcel

const dlExcel = async ({
  excelName = 'fooo',
  data,
  title,
}: {
  excelName?: string;
  data: Tcontrol_personalPerformanceStatistics;
  title: string;
}) => {
  data = _.cloneDeep(data);

  const { listKeyArr, rowArr, subTotalList, total, areaList } = data;

  // ------------------------------------------------------------------
  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet();

  sheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9,
  };

  // ------------------------------------------------------------------

  const width_A = 6;
  const width_B = 20;
  const width_data = 10;
  const width_percent = 9;

  // ------------------------------------------------------------------
  let row_title: ExcelJs.Row;
  let row_subTitle: ExcelJs.Row;
  let row_caption: ExcelJs.Row;
  let row_subCaption: ExcelJs.Row;
  const rowArr_data: ExcelJs.Row[] = [];
  let row_subTotal: ExcelJs.Row;

  let row_empty: ExcelJs.Row;

  const rowArr_area: ExcelJs.Row[] = [];
  let row_totalCaption: ExcelJs.Row;
  let row_total: ExcelJs.Row;

  let reviewerRow: ExcelJs.Row;

  let col_A = sheet.getColumn(1);
  let col_B = sheet.getColumn(2);

  // ------------------------------------------------------------------

  col_A.width = width_A;
  col_B.width = width_B;

  col_A.alignment = {
    wrapText: true,
  };
  col_B.alignment = {
    wrapText: true,
  };

  const mergeLetter01 = 'A';
  const mergeLetter02 = 'N';

  // ------------------------------------------------------------------

  row_title = sheet.addRow(['三久建材工業股份有限公司']);
  row_subTitle = sheet.addRow([title]);

  // ------------------------------------------------------------------

  row_caption = sheet.addRow(['合約編號', '工程名稱']);
  row_subCaption = sheet.addRow(['', '']);

  let mergeCellFnArr: (() => void)[] = [];

  listKeyArr.forEach((key) => {
    let values_caption = row_caption.values as ExcelJs.CellValue[];

    values_caption.shift();
    // 每次以陣列附直的方式都會初始化row，因此上面要shift，合併儲存格也要在最後再做
    values_caption = [...values_caption, key, '', ''];
    row_caption.values = values_caption;

    const keyCell = row_caption.getCell(values_caption.length - 2);
    const latestCell = row_caption.getCell(values_caption.length);

    // 把函式抽出，迭代完後再執行
    const fn = () => sheet.mergeCells(keyCell.address, latestCell.address);
    mergeCellFnArr.push(fn);
    // ______________________________________________________

    let values_subCaption = row_subCaption.values as ExcelJs.CellValue[];
    values_subCaption.shift();
    values_subCaption = [...values_subCaption, '牌價', '承價', '%'];
    row_subCaption.values = values_subCaption;
  });

  mergeCellFnArr.forEach((fn) => fn());
  mergeCellFnArr = [];

  // ------------------------------------------------------------------

  rowArr.forEach((data) => {
    const { quotationNumber, projectName, list } = data;

    const values = listKeyArr.reduce((arr, key) => {
      let { percentage = '0', pricesum = '0', totalsum = '0' } = list[key] ?? {};

      percentage = percentage.replace('%', '');
      const percentage_num = new Decimal(percentage).div(100).toNumber();
      const pricesum_num = Number(pricesum.replace(/,/g, ''));
      const totalsum_num = Number(totalsum.replace(/,/g, ''));

      arr.push(totalsum_num, pricesum_num, percentage_num);

      return arr;
    }, [] as number[]);

    rowArr_data.push(
      //
      sheet.addRow([quotationNumber, projectName, ...values])
    );
  });

  // ------------------------------------------------------------------

  const values_subTotal = listKeyArr.reduce((arr, key) => {
    let { percentage = '0', pricesum = '0', totalsum = '0' } = subTotalList[key] ?? {};

    percentage = percentage.replace('%', '');
    const percentage_num = new Decimal(percentage).div(100).toNumber();

    const pricesum_num = Number(pricesum.replace(/,/g, ''));
    const totalsum_num = Number(totalsum.replace(/,/g, ''));

    arr.push(totalsum_num, pricesum_num, percentage_num);

    return arr;
  }, [] as number[]);

  row_subTotal = sheet.addRow(['', '小計', ...values_subTotal]);

  rowArr_data.push(row_subTotal);

  // ------------------------------------------------------------------
  // row_empty = sheet.addRow([]);
  // row_totalCaption = sheet.addRow(['', '', '總承價']);
  // row_totalCaption = sheet.addRow([]);

  (() => {
    Object.values(areaList).forEach((areaContent) => {
      rowArr_area.push(sheet.addRow(['', areaContent.areaName, areaContent.pricesum_num]));
    });

    // ________________________________________________________________
    // ________________________________________________________________
    let {
      // percentage = '',
      pricesum = '',
      // totalsum = '',
    } = total ?? {};

    // percentage = percentage.replace('%', '');
    // const percentage_num = new Decimal(percentage).div(100).toNumber();

    const pricesum_num = Number(pricesum.replace(/,/g, ''));
    // const totalsum_num = Number(totalsum.replace(/,/g, ''));

    row_total = sheet.addRow(['', '總承價', pricesum_num]);
    // rowArr_data.push(row_total);
  })();

  // ------------------------------------------------------------------

  sheet.addRow([]);

  reviewerRow = sheet.addRow([]);
  reviewerRow.values = ['　　　總經理 : 　　　　　　　　主管: 　　　　　　　　製表: 　　　　　　　　'];

  // ------------------------------------------------------------------

  // 樣式調整

  const size_l = 18;
  const size_m = 13;
  const height_total = 30;

  //

  row_title.height = height_total;
  row_title.font = {
    size: size_l,
    bold: true,
  };
  row_title.alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };

  sheet.mergeCells(`${mergeLetter01}1:${mergeLetter02}1`);

  //
  row_subTitle.height = height_total;
  row_subTitle.font = {
    size: size_l,
    bold: true,
  };
  row_subTitle.alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  sheet.mergeCells(`${mergeLetter01}2:${mergeLetter02}2`);
  //
  row_caption.font = {
    size: size_m,
    bold: true,
  };
  row_caption.alignment = {
    horizontal: 'center',
  };
  //
  row_subCaption.font = {
    size: size_m,
    bold: true,
  };
  row_subCaption.alignment = {
    horizontal: 'center',
  };
  //
  row_subTotal.getCell(2).font = {
    size: size_m,
    bold: true,
  };
  row_subTotal.getCell(2).alignment = {
    horizontal: 'right',
  };
  //
  // row_totalCaption.font = {
  //   size: size_m,
  //   bold: true,
  // };
  // row_totalCaption.alignment = {
  //   horizontal: 'center',
  // };
  //

  [...rowArr_area, row_total].forEach((row) => {
    row.getCell(2).font = {
      size: size_m,
      bold: true,
    };
    row.getCell(2).alignment = {
      horizontal: 'right',
    };
    row.getCell(3).numFmt = '#,##0';
  });

  // row_total.getCell(2).font = {
  //   size: size_m,
  //   bold: true,
  // };
  // row_total.getCell(2).alignment = {
  //   horizontal: 'right',
  // };
  //

  reviewerRow.font = {
    size: size_m,
    bold: true,
  };
  reviewerRow.getCell(1).alignment.wrapText = false;
  reviewerRow.getCell(2).alignment.wrapText = false;
  const reviewerRowNumber = reviewerRow.number;
  sheet.mergeCells(`${mergeLetter01 + reviewerRowNumber}:${mergeLetter02 + reviewerRowNumber}`);

  //
  sheet.columns.forEach((col, index) => {
    index = index + 1;

    if (index <= 2) {
      return;
    }

    const count = index - 2;

    col.width = width_data;

    if (count % 3 === 0) {
      col.width = width_percent;
    }
  });

  rowArr_data.forEach((row) => {
    row.eachCell((cell, index) => {
      index = index + 1;

      cell.alignment = {
        ...cell.alignment,
        wrapText: true,
        vertical: 'middle',
      };

      if (index <= 2) {
        return;
      }

      cell.numFmt = '#,##0';

      if (index % 3 === 0) {
        // 百分比
        cell.numFmt = '0.00%';
      }
    });
  });

  // const rowLength = row_subCaption.values.length as number;
  // row_empty.values = Array(rowLength - 1).fill('');

  sheet.eachRow((row, index) => {
    index = index + 1;

    if (row_title === row || row_subTitle === row || reviewerRow === row) {
      return;
    }

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // ------------------------------------------------------------------
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
