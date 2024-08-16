import { useEffect, useMemo, Fragment } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import ExcelJs, { TableProperties } from 'exceljs';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import scss from './annualPerformanceStatistics.module.scss';

// api
import { useQuotationAccounting_years } from 'js/api/api_quotation';

import { cnNums } from 'js/tools/numToChineseNum';

// --------------------------------------------------------------------

type Tlist = {
  // 這一層是company_location
  [company_location: string]: {
    // 這一層是year
    [year: string]: {
      companyName: string;
      year: string; // totalSum
      '1': string; // totalSum
      '2': string; // totalSum
      '3': string; // totalSum
      '4': string; // totalSum
      '5': string; // totalSum
      '6': string; // totalSum
      '7': string; // totalSum
      '8': string; // totalSum
      '9': string; // totalSum
      '10': string; // totalSum
      '11': string; // totalSum
      '12': string; // totalSum
      inTotal: string; // 總合計
      成長率: string;
      // noMonth: string; // totalSum
    };
  };
};

type TcompanyNameLookup = {
  [key: string]: string | undefined;
};

// --------------------------------------------------------------------

// 會收到的資料結構

const leftStrArr = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
  // '舊合約',
  '總計',
  '成長率',
];

const monthArr = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  // 'noMonth'
] as const;

const companyNameLookup: TcompanyNameLookup = {
  Taichung: '台中分公司',
  Taipei: '台北分公司',
};

// --------------------------------------------------------------------
// MARK: START

export default function AnnualPerformanceStatistics() {
  const { data, update } = useQuotationAccounting_years();

  // --------------------------------------------------------------------
  const list = useMemo(() => {
    if (!data) {
      return {};
    }

    const list: Partial<Tlist> = {};
    data.forEach((data) => {
      const { totalsum, company_location } = data;

      if (!data.year || !data.month) {
        return;
      }

      // const year = data.year.toString();
      const year = data.year.toString();
      const yer_num = Number(year) - 1911;

      const month = data.month.toString() as (typeof monthArr)[number];

      if (list[company_location] === undefined) {
        list[company_location] = {};
      }

      if (list[company_location]![year] === undefined) {
        list[company_location]![year] = {} as Tlist[string][string];
        list[company_location]![year].year = `${yer_num} 年度`;
      }

      list[company_location]![year].companyName = companyNameLookup[company_location] ?? '查無分公司';

      list[company_location]![year][month] = totalsum;

      // 統計表給的不一定齊全，可能沒有12月，而且12月在陣列中也不見得會在1月後面
      // 所以這個部份不能用
      // if (month === '12') {
      //   let inTotal = 0;
      //   monthArr.forEach((month) => {
      //     const totalSum = Number(list[company_location]![year][month]);
      //     inTotal += totalSum;
      //     list[company_location]![year][month] = totalSum.toLocaleString();
      //   });
      //   list[company_location]![year].inTotal = inTotal.toLocaleString();
      //   list[company_location]![year].成長率 = '成長率';
      // }
    });

    Object.values(list).forEach((item_c) => {
      if (!item_c) {
        return;
      }

      Object.values(item_c).forEach((item_y) => {
        let inTotal = 0;

        const keyArr = Object.keys(item_y) as (keyof typeof item_y)[];
        keyArr.forEach((key) => {
          if (Number(key) >= 1) {
            const value_num = Number(item_y[key]);
            inTotal += value_num;
            item_y[key] = value_num.toLocaleString();
          }
        });
        item_y.inTotal = inTotal.toLocaleString();
        item_y.成長率 = '---';
      });
    });

    return list as Tlist;
  }, [data]);

  // --------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '匯出excel',
      onClick: () =>
        dlExcel({
          list,
          excelName: 'foo',
        }),
    },
    // {
    //   searchGroup: {
    //     searchTargetList: [
    //       {
    //         placeholder: '輸入搜尋內容',
    //       },
    //     ],
    //     doSearch: (v) => {
    //       console.log(v);
    //     },
    //   },
    // },
  ];

  // -----------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    update();
  }, []);

  // -----------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer>
      {/* 其實這應該叫全年業績統計表才對 */}
      <PageHeader02 tag="年度業績統計表" panelList={panelList} />

      <div className={scss.wrapper}>
        <div className={scss.table}>
          {/*  */}
          <div className={scss.left}>
            <div className={scss.corner}></div>
            {leftStrArr.map((key, index, arr) => {
              const isLast = index === arr.length - 1;

              return (
                <div key={index} className={classNames(isLast && scss.noBottom)}>
                  <span>{key}</span>
                </div>
              );
            })}
          </div>
          {/*  */}

          {Object.values(list).map((item_c, index_c, arr_c) => {
            const arr = Object.values(item_c);

            const isLastC = index_c === arr_c.length - 1;

            return (
              <div key={index_c} className={scss.main}>
                {arr.map((item, index, arr) => {
                  const { companyName, year, inTotal, 成長率 } = item;

                  const span = arr.length;

                  const isLastColumn = index === arr.length - 1 && isLastC;

                  return (
                    <Fragment key={index}>
                      {index === 0 && (
                        <div
                          className={classNames(scss.companyName, isLastC && scss.noRight)}
                          style={{ gridColumn: `span ${span}` }}
                        >
                          <span>{companyName}</span>
                        </div>
                      )}
                      <div className={classNames(scss.year, isLastColumn && scss.noRight)}>
                        <span>{year}</span>
                      </div>
                      {monthArr.map((month, index_m) => {
                        const value = item[month];

                        return (
                          <div key={index_m} className={classNames(isLastColumn && scss.noRight)}>
                            <span>{value}</span>
                          </div>
                        );
                      })}

                      <div className={classNames(isLastColumn && scss.noRight)}>
                        <span>{inTotal}</span>
                      </div>
                      <div className={classNames(scss.noBottom, isLastColumn && scss.noRight)}>
                        <span>{成長率}</span>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            );
          })}

          {/*  */}
        </div>
      </div>
    </SubLayer>
  );
}

// MARK: EDN

// ===============================================================

type TlocationDir = {
  [company_location: string]: {
    key: string;
    name: string;
    cellQty: number;
  };
};

const dlExcel = async ({
  //
  excelName,
  list,
}: {
  excelName: string;
  list: Tlist;
}) => {
  list = _.cloneDeep(list);
  const thisYear = new Date().getFullYear() - 1911;

  const locationDir: TlocationDir = {};
  Object.keys(list).forEach((key) => {
    // yearQty[company_location] = Object.keys(list[company_location]).length;
    locationDir[key] = {
      key: key,
      name: companyNameLookup[key] ?? '---',
      cellQty: Object.keys(list[key]).length,
    };
  });
  const locationArr = Object.values(locationDir);

  // -----------------------------------------------------------------------

  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet();

  sheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9,
  };

  // -----------------------------------------------------------------------

  const col_data_Width = 15;
  const dataRowQty = 15;
  const tableStartRow = 3;

  // -----------------------------------------------------------------------

  sheet.columns = [
    {
      header: '',
      key: 'side',
      width: 10,
    },
  ];

  // -----------------------------------------------------------------------

  sheet.mergeCells(`A${tableStartRow}:A${tableStartRow + 1}`);

  // cnNums
  let thisYear_str = thisYear.toString();
  thisYear_str = thisYear_str
    .split('')
    .map((letter) => cnNums[Number(letter)])
    .join('　');

  const subTitle = `${thisYear_str}　年　業　績　統　計　表`;

  const col_A = sheet.getColumn('A');
  col_A.width = 10;
  col_A.values = [
    '三　久　建　材　工　業　股　份　有　限　公　司',
    subTitle,
    '',
    '',
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
    '總合計',
    '成長率',
  ];

  // -----------------------------------------------------------------------

  // 批次上方的合併分公司名稱儲存格

  batchMergeCells({
    sheet,
    row: tableStartRow,
    cellContentArr: locationArr,
    firstCol: 2,
    callBack_cell: (cell) => {
      cell.alignment = {
        horizontal: 'center',
      };
      cell.font = {
        size: 18,
        bold: true,
      };
    },
  });

  // -----------------------------------------------------------------------

  // 將list的資料轉為二維陣列
  // [
  //   年度,
  //   1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月,
  //   合計,
  //   成長率,
  // ]

  const colValues2DArr: (string | number)[][] = [];
  const latestYearColArr: ExcelJs.Column[] = [];

  let count = 1;

  Object.values(list).forEach((item_location) => {
    const itemArr_year = Object.values(item_location);
    count += itemArr_year.length;

    itemArr_year.forEach((item_year, index_item_year) => {
      const itemArr: (string | number)[] = [];

      const { companyName, year, inTotal, 成長率 } = item_year;

      const inTotal_num = Number(inTotal.replace(/,/g, ''));

      itemArr[0] = year;

      new Array(12).fill(0).forEach((_, index) => {
        let str = item_year[`${index + 1}` as keyof Tlist[string][string]] ?? '0';
        str = str.replace(/,/g, '');
        const num = Number(str);

        itemArr[index + 1] = num ?? '';
      });

      itemArr['13'] = inTotal_num;
      itemArr['14'] = 成長率;
      //
      colValues2DArr.push(itemArr);

      if (index_item_year === itemArr_year.length - 1) {
        latestYearColArr.push(sheet.getColumn(count));
      }
    });
  });

  latestYearColArr.forEach((col) => {
    col.eachCell((cell) => {
      cell.border = {
        ...cell.border,
        right: {
          style: 'thin',
        },
      };
    });
  });

  colValues2DArr.forEach((item, index) => {
    index = index + 2;

    const col = sheet.getColumn(index);
    const valuesArr = [...col.values, ...item];
    valuesArr.splice(0, 1);

    col.values = valuesArr;
    col.eachCell((cell, rowIndex) => {
      // 3~15
      if (rowIndex >= tableStartRow + 2 && rowIndex <= tableStartRow + dataRowQty - 1) {
        cell.numFmt = '#,##0';
      }
    });
    col.width = col_data_Width;

    // if (index + 1 === colValues2DArr.length) {
    //   col.eachCell((cell) => {
    //     cell.border = {
    //       ...cell.border,
    //       right: {
    //         style: 'thin',
    //       },
    //     };
    //   });
    // }
  });

  // -----------------------------------------------------------------------

  const columnArr = sheet.columns;
  const latestCol = columnArr[columnArr.length - 1];
  sheet.mergeCells(`A1:${latestCol.letter}1`);
  sheet.mergeCells(`A2:${latestCol.letter}2`);

  // -----------------------------------------------------------------------

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: {
          style: 'thin',
        },
        bottom: {
          style: 'thin',
        },
        left: {
          style: 'thin',
        },
        right: {
          style: 'thin',
        },
      };
    });
  });

  col_A.eachCell((cell) => {
    cell.border = {
      ...cell.border,
      right: {
        style: 'thin',
      },
      left: {
        style: 'thin',
      },
    };
  });

  const tableFirstRow = sheet.getRow(tableStartRow);
  tableFirstRow.eachCell((cell) => {
    cell.border = {
      ...cell.border,
      top: {
        style: 'thin',
      },
    };
  });

  const tableSecondRow = sheet.getRow(tableStartRow + 1);
  tableSecondRow.eachCell((cell) => {
    cell.alignment = {
      ...cell.alignment,
      horizontal: 'center',
    };
  });

  const row_total = sheet.getRow(tableStartRow + dataRowQty - 1);
  row_total.eachCell((cell, colIndex) => {
    cell.border = {
      ...cell.border,
      top: {
        style: 'double',
      },
    };
  });

  const row_latest = sheet.getRow(tableStartRow + dataRowQty - 1 + 1);
  row_latest.eachCell((cell, colIndex) => {
    cell.border = {
      ...cell.border,
      bottom: {
        style: 'thin',
      },
    };
  });

  const firstRow = sheet.getRow(1);
  const secondRow = sheet.getRow(2);
  const thirdRow = sheet.getRow(3);

  firstRow.alignment = {
    ...firstRow.alignment,
    horizontal: 'center',
    vertical: 'middle',
  };
  firstRow.border = {
    ...firstRow.border,
    right: undefined,
  };
  firstRow.height = 35;
  firstRow.font = {
    // ...firstRow.font,
    size: 18,
    bold: true,
  };

  secondRow.alignment = {
    ...secondRow.alignment,
    horizontal: 'center',
    vertical: 'middle',
  };

  secondRow.border = {
    // ...secondRow.border,
    right: undefined,
  };
  secondRow.height = 35;
  secondRow.font = {
    ...secondRow.font,
    size: 18,
    bold: true,
  };

  thirdRow.alignment = {
    ...thirdRow.alignment,
    horizontal: 'center',
    vertical: 'middle',
  };

  // -----------------------------------------------------------------------

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

function batchMergeCells({
  //
  sheet,
  row,
  cellContentArr: valueArr,
  firstCol = 1,
  callBack_cell,
}: {
  sheet: ExcelJs.Worksheet;
  row: number;
  cellContentArr: {
    name: string;
    cellQty: number;
  }[];
  firstCol?: number;
  callBack_cell?: (cell: ExcelJs.Cell) => void;
}) {
  let startCol = firstCol;
  let endCol = startCol + valueArr[0].cellQty - 1;
  const startCell = sheet.getCell(row, startCol);
  const endCell = sheet.getCell(row, endCol);
  startCell.value = valueArr[0].name;
  sheet.mergeCells(startCell.address + ':' + endCell.address);
  callBack_cell?.(startCell);

  for (
    //
    let i = 1;
    i < valueArr.length;
    i++
  ) {
    const { name, cellQty } = valueArr[i];

    startCol = endCol + 1;
    endCol = startCol + cellQty - 1;
    const startCell = sheet.getCell(row, startCol);
    const endCell = sheet.getCell(row, endCol);
    startCell.value = name;
    sheet.mergeCells(startCell.address + ':' + endCell.address);
    callBack_cell?.(startCell);
  }
}

// function mergeCellsInGroupsOfFive({
//   //
//   sheet,
//   row,
//   times,
//   cellQty,
//   firstCol = 1,
// }: {
//   sheet: ExcelJs.Worksheet;
//   row: number;
//   cellQty: number;
//   times: number;
//   firstCol?: number;
// }) {
//   let startCol = firstCol;
//   let endCol = startCol + cellQty - 1;
//   const startCell = sheet.getCell(row, startCol);
//   const endCell = sheet.getCell(row, endCol);
//   sheet.mergeCells(startCell.address + ':' + endCell.address);

//   for (
//     //
//     let i = 2;
//     i <= times;
//     i++
//   ) {
//     startCol = endCol + 1;
//     endCol = startCol + cellQty - 1;
//     const startCell = sheet.getCell(row, startCol);
//     const endCell = sheet.getCell(row, endCol);
//     sheet.mergeCells(startCell.address + ':' + endCell.address);
//   }
// }
