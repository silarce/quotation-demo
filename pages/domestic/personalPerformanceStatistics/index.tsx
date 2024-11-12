/* eslint-disable prefer-const */

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import ExcelJs, { TableProperties } from 'exceljs';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Table, {
  Tcontrol_personalPerformanceStatistics,
  Tcontrol_row,
  Tcontrol_subTotalList,
} from 'components/page/domestic/personalPerformanceStatistics/Table';

// gaer
import SelectBar from 'components/global/gear/select/selectBar/selectBar';

// option
import { optionsCreator_month, optionsCreator_year } from 'js/utils/options/options';

// api
import {
  TquotationAccounting_personal_contract,
  //
  useQuotationAccounting_personalContract,
} from 'js/api/api_quotation';
import { useEmployee, TemployeeDto, Tparams } from 'js/api/api_employee';
import {
  // TbonusDto,
  //
  useGetReportForm_bonus,
} from 'js/api/api_reportForm';

// css
import scss from './index.module.scss';

// ==================================================================
type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tquery = {
  year: string | undefined;
  month: string | undefined;
  emp: string | undefined;
  keyWord: string | undefined;
};

// ==================================================================
const yearOptionArr = optionsCreator_year();
const monthOptionArr = optionsCreator_month({ emptyOption: true });

// ==================================================================

const empParams: Tparams = {
  populate: ['jobs.department'],
  pageSize: 99999,
  sort: 'idNumber',
  filter: {
    'jobs.department.name': { $eq: '業務部' },
  },
};

const inValidSymbol = '---';

// ==================================================================

// MARK: START

// 個人業績統計表
export default function PersonalPerformanceStatistics() {
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year = new Date().getFullYear() - 1911,
    month,
    emp,
  } = query;

  // ------------------------------------------------------------------

  const params = {
    year: year ? Number(year) + 1911 : undefined,
    month: month ? Number(month) : undefined,
    employeeId: emp,
  };

  const { data, update, isFetching } = useQuotationAccounting_personalContract(params);

  const params_bouus: Tparams = useMemo(() => {
    return {
      // populate: ['salesEmployee'],
      filter: {
        bonusYear: { $eq: Number(year) + 1911 },
        bonusMonth: { $eq: month ? String(month) : undefined },
        salesEmployeeId: { $eq: emp },
      },
    };
  }, [year, month, emp]);

  const {
    //
    data: data_bonus,
    update: update_bonus,
    clear: clear_bonus,
    isFetching: isFetching_bonus,
  } = useGetReportForm_bonus(params_bouus, { isAutoUpdate: false });

  // ------------------------------------------------------------------

  const { data: data_emp, update: update_emp } = useEmployee(empParams);

  // ------------------------------------------------------------------
  // region PROPS

  const { empOptionArr, employee } = useMemo(() => {
    if (!data_emp) {
      return {
        empOptionArr: [],
        employee: undefined,
      };
    }

    const employee = getEmployee(data_emp.data, emp || '');

    const empArr = data_emp.data;

    const empOptionArr = empArr.map((emp) => {
      return {
        label: emp.chName || emp.enName || inValidSymbol,
        value: emp.id,
      };
    });

    return { empOptionArr, employee };
  }, [data_emp]);

  //________________________________________________________________________
  //________________________________________________________________________
  const activeEmp = empOptionArr.find((option) => option.value === emp);
  //________________________________________________________________________
  //________________________________________________________________________

  const { bonus: bonus_closed, sales: sales_closed } = useMemo(() => {
    if (!data_bonus) {
      return {
        bonus: inValidSymbol,
        sales: inValidSymbol,
      };
    }

    let bonus_d = new Decimal(0);
    let sales_d = new Decimal(0);

    data_bonus.forEach((data) => {
      const { totalBonus, totalSales } = data;

      bonus_d = bonus_d.add(totalBonus || 0);
      sales_d = sales_d.add(totalSales || 0);
    });

    return {
      bonus: bonus_d.toNumber().toLocaleString(),
      sales: sales_d.toNumber().toLocaleString(),
    };
  }, [data_bonus]);
  //________________________________________________________________________
  //________________________________________________________________________

  const control_table = useControl_personalPerformanceStatistics({
    data,
    bonus_closed,
    sales_closed,
    employee,
  });
  //_____

  //________________________________________________________________________
  //________________________________________________________________________
  const selectPropsArr: TselectPropsArr = [
    {
      selectProps: {
        value: emp,
        options: empOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.replace({
              query: {
                ...router.query,
                emp: option.value,
              },
            });
          }
        },
      },
      placeholder: '選擇員工',
      boxStyle: { width: '140px' },
    },
    {
      selectProps: {
        value: year,
        options: yearOptionArr,
        onChange: (option) => {
          if (typeof option?.value === 'string') {
            router.replace({
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
            router.replace({
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
  //________________________________________________________________________
  //________________________________________________________________________
  const tagList: TtagList = [
    {
      label: '個人業績統計表',
      isActive: true,
    },
    {
      label: '獎金統計表',
      onClick: () => {
        router.replace('/domestic/personalPerformanceStatistics/bonusStatisticsTable');
      },
    },
    {
      label: '獎金週期維護',
      onClick: () => {
        router.replace('/domestic/personalPerformanceStatistics/bonusPeriod');
      },
    },
  ];
  //________________________________________________________________________
  //________________________________________________________________________

  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '下載Excel',
      onClick: () => {
        let subTitle = `${year} 年　`;
        month && (subTitle = subTitle + `${month} 月　`);
        subTitle = subTitle + '業 績 統 計 表';
        dlExcel({
          data: control_table,
          excelName: `個人業績統計表_${activeEmp?.label}_${year}-${month}`,
          subTitle,
        });
      },
    },
  ];

  // ------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    update();
  }, [year, month, emp]);

  useEffect(() => {
    update_emp();
  }, []);

  useEffect(() => {
    if (emp) {
      update_bonus();
    } else {
      clear_bonus();
    }
  }, [params_bouus]);

  // ------------------------------------------------------------------

  // region RENDER

  return (
    <SubLayer
      //
      isLoading_subLayer={isFetching || isFetching_bonus}
      bodyClassName={scss.subLayerBody}
    >
      <PageHeader02 tagList={tagList} panelList={panelList} />

      <div className={scss.body}>
        <div className={scss.selectBarWrapper}>
          <SelectBar selectPropsArr={selectPropsArr} />
          {/* <div className={scss.bonusBar}>
            <span>業績 : </span>
            <span>{sales_closed}</span>
            <span>獎金 : </span>
            <span>{bonus_closed}</span>
          </div> */}
        </div>

        <div className={scss.tableWrapper}>
          <Table control={control_table} />
        </div>
      </div>
    </SubLayer>
  );
}

// MARK: END

// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================

// region HOOK

const useControl_personalPerformanceStatistics = ({
  data,
  bonus_closed,
  sales_closed,
  employee,
}: {
  data: TquotationAccounting_personal_contract[] | undefined;
  bonus_closed?: string;
  sales_closed?: string;
  employee: TemployeeDto | undefined;
}) => {
  const control: Tcontrol_personalPerformanceStatistics & {
    bounsCalcProcess_str: string;
  } = useMemo(() => {
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
        bonus: '',
        bounsCalcProcess: '',
        bounsCalcProcess_str: '',
      };
    }

    const list: {
      [key: string]: // Tcontrol_row
      Omit<Tcontrol_row, 'total'> & { total: number };
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
      // percentage: 0,
    };

    const listKeyList: { [key: string]: string } = {};

    data.forEach((item) => {
      const {
        //
        projectName: projectname,
        projectNumber: quotationnumber,
        // quotetype,
        totalSum,
        priceSum,
        percentage,
        contractor,
        designUnit,
      } = item;

      const isValid = typeof percentage === 'number';

      let quotetype = item.quoteType;

      if (!quotetype) {
        quotetype = '無資料';
      }

      if (!subTotalList[quotetype]) {
        subTotalList[quotetype] = {
          totalsum: 0,
          pricesum: 0,
          percentage: 0,
        };
      }

      if (listKeyList[quotetype] === undefined) {
        listKeyList[quotetype] = quotetype;
      }

      if (isValid) {
        subTotalList[quotetype].totalsum = new Decimal(subTotalList[quotetype].totalsum).add(totalSum).toNumber();
        subTotalList[quotetype].pricesum = new Decimal(subTotalList[quotetype].pricesum).add(priceSum).toNumber();
        subTotalList[quotetype].percentage = new Decimal(subTotalList[quotetype].percentage)
          .add(percentage ?? 0)
          .toNumber();

        total.totalsum = new Decimal(total.totalsum).add(totalSum).toNumber();
        total.pricesum = new Decimal(total.pricesum).add(priceSum).toNumber();
      }

      if (!list[quotationnumber]) {
        list[quotationnumber] = {
          quotationNumber: quotationnumber,
          projectName: projectname,
          builder: contractor ?? '',
          designer: designUnit ?? '',
          list: {},
          total: 0,
          employeeName: employee?.chName ?? '',
        };
      }

      // 格子裡的文字
      list[quotationnumber].list[quotetype] = {
        totalsum: isValid ? Number(totalSum).toLocaleString() : inValidSymbol,
        pricesum: isValid ? Number(priceSum).toLocaleString() : inValidSymbol,
        percentage: isValid ? `${percentage}%` : inValidSymbol,
      };

      if (isValid) {
        list[quotationnumber].total = new Decimal(list[quotationnumber].total).add(priceSum).toNumber();
      }
    });
    //
    //
    const control_rowArr: Tcontrol_row[] = Object.values(list).map((item) => {
      return {
        ...item,
        total: Number(item.total).toLocaleString(),
      };
    });

    const theSubTotalList: Tcontrol_subTotalList = {};

    Object.keys(subTotalList).forEach((key) => {
      const percent = new Decimal(subTotalList[key].pricesum)
        .div(subTotalList[key].totalsum)
        .mul(100)
        .toDecimalPlaces(2)
        .toNumber();

      theSubTotalList[key] = {
        ...subTotalList[key],
        totalsum: Number(subTotalList[key].totalsum).toLocaleString(),
        pricesum: Number(subTotalList[key].pricesum).toLocaleString(),
        percentage: isNaN(percent) ? inValidSymbol : `${percent}%`,
      };
    });

    const totalPercentage_num = new Decimal(total.pricesum).div(total.totalsum).mul(100).toDecimalPlaces(2).toNumber();

    const theTotal = {
      totalsum: Number(total.totalsum).toLocaleString(),
      pricesum: Number(total.pricesum).toLocaleString(),
      percentage: totalPercentage_num.toString() + '%',
    };

    const listKeyArr = Object.keys(listKeyList);
    // _______________________________________________________________________
    const threshold = 2000000; // 六個0
    const threshold_str = threshold.toLocaleString();
    const performance = new Decimal(total.pricesum).minus(threshold).toNumber();
    const performance_str = performance.toLocaleString();

    const bonus = new Decimal(total.pricesum)
      .minus(threshold)
      .mul(0.01)
      .mul(totalPercentage_num)
      .div(100)
      .toDecimalPlaces(0)
      .toNumber();
    const bonus_str = bonus.toLocaleString();
    const bounsCalcProcess = (
      <>
        <p>依統計表計算</p>
        {theTotal.pricesum} - {threshold_str} = {performance_str}
        <br />
        {performance_str} * 1% * {totalPercentage_num}% = <span className="text-danger font-bold">{bonus_str}</span>
        <hr />
        結算業績 : {sales_closed}　 結算獎金 : <span className="text-danger font-bold">{bonus_closed}</span>
      </>
    );

    const bounsCalcProcess_str = `\
依統計表計算
${theTotal.pricesum} - ${threshold_str} = ${performance_str}
${performance_str} * 1% * ${totalPercentage_num}% = ${bonus_str}

結算業績 : ${sales_closed}　 結算獎金 : ${bonus_closed}
`;

    // _______________________________________________________________________

    return {
      rowArr: control_rowArr,
      subTotalList: theSubTotalList,
      total: theTotal,
      listKeyArr,
      bounsCalcProcess,
      bounsCalcProcess_str,
    };

    //
    //
  }, [data]);

  return control;
};

// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================

const getEmployee = (employeeArr: TemployeeDto[], empId: string): TemployeeDto | undefined => {
  return employeeArr.find((emp) => emp.id === empId);
};

// =====================================================================

// region dlExcel

const dlExcel = async ({
  //
  data,
  excelName,
  subTitle,
}: {
  data: Tcontrol_personalPerformanceStatistics & { bounsCalcProcess_str: string };
  excelName: string;
  subTitle: string;
}) => {
  const {
    //
    listKeyArr,
    rowArr: dataArr,
    subTotalList,
    total,
    bounsCalcProcess_str,
  } = data;

  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet();

  sheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9,
  };

  // ----------------------------------------------------------------------

  const width_data = 11;
  const width_percent = 10;

  const colSetting_projectNumber = {
    label: '工程編號',
    key: 'projectNumber',
    width: 12,
  };
  const colSetting_projectName = {
    label: '工程名稱',
    key: 'projectName',
    width: 20,
  };

  const colSetting_contractor = {
    label: '營造',
    key: 'contractor',
    width: 8,
  };

  const colSetting_designUnit = {
    label: '設計單位',
    key: 'designUnit',
    width: 7,
  };

  const colSetting_projectTotal = {
    label: '總價',
    key: 'totalSum',
    width: width_data,
  };

  const colSetting_employeeName = {
    label: '業務',
    key: 'salesName',
    width: width_data,
  };

  const colSettingArr = [
    colSetting_projectNumber,
    colSetting_projectName,
    colSetting_contractor,
    colSetting_designUnit,
  ];

  // ----------------------------------------------------------------------

  (() => {
    const captionArr = listKeyArr
      .map((key) => {
        return [
          {
            key: key + '_totalsum',
            width: width_data,
          },
          {
            key: key + '_pricesum',
            width: width_data,
          },
          {
            key: key + '_percentage',
            width: width_percent,
          },
        ];
      })
      .flat();

    sheet.columns = [
      //
      colSetting_projectNumber,
      colSetting_projectName,
      colSetting_contractor,
      colSetting_designUnit,
      ...captionArr,
      colSetting_projectTotal,
      colSetting_employeeName,
    ];
  })();

  // ----------------------------------------------------------------------

  const col_projectNumber = sheet.getColumn('projectNumber');
  const col_projectName = sheet.getColumn('projectName');
  const col_contractor = sheet.getColumn('contractor');
  const col_designUnit = sheet.getColumn('designUnit');
  const col_totalSum = sheet.getColumn('totalSum');
  const col_employeeName = sheet.getColumn('salesName');
  const colNumber_latestData = col_employeeName.number - 4;

  let row_title: ExcelJs.Row;
  let row_subTitle: ExcelJs.Row;
  let row_caption: ExcelJs.Row;
  let row_subCaption: ExcelJs.Row;
  let row_subTotal: ExcelJs.Row;
  let row_total: ExcelJs.Row;
  let row_reviewer: ExcelJs.Row;
  let row_calcProcess: ExcelJs.Row;

  const rowArr_data: ExcelJs.Row[] = [];

  let cell_bounsCalcProcess: ExcelJs.Cell;

  // ----------------------------------------------------------------------

  row_title = sheet.addRow(['三　久　建　材　股　份　有　限　公　司']);
  row_subTitle = sheet.addRow([subTitle]);

  // ----------------------------------------------------------------------

  (() => {
    const captionArr = listKeyArr
      .map((key) => {
        return [key, null, null];
      })
      .flat();

    const values = [
      //
      ...colSettingArr.map((setting) => setting.label),
      ...captionArr,
      colSetting_projectTotal.label,
      colSetting_employeeName.label,
    ];

    row_caption = sheet.addRow(values);
  })();

  // ----------------------------------------------------------------------

  (() => {
    const subCaptionArr = listKeyArr
      .map((key) => {
        return ['牌價', '承價', '%'];
      })
      .flat();

    const values = [
      //
      ...colSettingArr.map((setting) => null),
      ...subCaptionArr,
      null,
    ];

    row_subCaption = sheet.addRow(values);
  })();

  // ----------------------------------------------------------------------

  (() => {
    dataArr.forEach((data) => {
      const {
        //
        builder,
        designer,
        projectName,
        quotationNumber,
        total,
        list,
        employeeName,
      } = data;

      const total_num = Number(total.replaceAll(',', ''));

      const mainDataArr: ExcelJs.CellValue[] = listKeyArr
        .map((key) => {
          let totalsum: ExcelJs.CellValue = list[key]?.totalsum;
          let pricesum: ExcelJs.CellValue = list[key]?.pricesum;
          let percentage: ExcelJs.CellValue = list[key]?.percentage;

          let percentage_num = Number(percentage?.replace('%', '') || '0');
          percentage_num = new Decimal(percentage_num).div(100).toNumber();

          totalsum && (totalsum = Number(totalsum.replaceAll(',', '')));
          pricesum && (pricesum = Number(pricesum.replaceAll(',', '')));
          percentage && (percentage = percentage_num);

          return [totalsum, pricesum, percentage];
        })
        .flat();

      const values: ExcelJs.CellValue[] = [
        //
        quotationNumber,
        projectName,
        builder,
        designer,
        ...mainDataArr,
        total_num,
        employeeName,
      ];

      rowArr_data.push(sheet.addRow(values));
    });
  })();

  // ----------------------------------------------------------------------

  (() => {
    row_calcProcess = sheet.addRow([]);
    cell_bounsCalcProcess = row_calcProcess.getCell(colNumber_latestData);
    cell_bounsCalcProcess.value = bounsCalcProcess_str;
  })();

  // ----------------------------------------------------------------------

  (() => {
    const mainDataArr: ExcelJs.CellValue[] = listKeyArr
      .map((key) => {
        let totalsum: ExcelJs.CellValue = subTotalList[key]?.totalsum;
        let pricesum: ExcelJs.CellValue = subTotalList[key]?.pricesum;
        let percentage: ExcelJs.CellValue = subTotalList[key]?.percentage;

        let percentage_num = Number(percentage?.replace('%', '') || '0');
        percentage_num = new Decimal(percentage_num).div(100).toNumber();

        totalsum && (totalsum = Number(totalsum.replaceAll(',', '')));
        pricesum && (pricesum = Number(pricesum.replaceAll(',', '')));
        percentage && (percentage = percentage_num);

        return [totalsum, pricesum, percentage];
      })
      .flat();

    const values: ExcelJs.CellValue[] = ['', '小計', '', '', ...mainDataArr];

    row_subTotal = sheet.addRow(values);
  })();

  // ----------------------------------------------------------------------

  (() => {
    const { totalsum, pricesum, percentage } = total;

    let percentage_num = Number(percentage.replace('%', ''));
    percentage_num = new Decimal(percentage_num).div(100).toNumber();

    row_total = sheet.addRow(['', '總計']);
    row_total.getCell(colNumber_latestData).value = Number(totalsum.replaceAll(',', ''));
    row_total.getCell(colNumber_latestData + 1).value = Number(pricesum.replaceAll(',', ''));
    row_total.getCell(colNumber_latestData + 2).value = percentage_num;
  })();

  // ----------------------------------------------------------------------

  row_reviewer = sheet.addRow([]);
  row_reviewer.values = ['　　　總經理 : 　　　　　　　　主管: 　　　　　　　　製表: 　　　　　　　　'];

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  sheet.mergeCells(`A${row_title.number}:M${row_title.number}`);
  sheet.mergeCells(`A${row_subTitle.number}:M${row_subTitle.number}`);

  // _______________________________________________________________________
  // _______________________________________________________________________

  row_caption.eachCell((cell, colNum) => {
    const row = cell.fullAddress.row;
    const col = cell.fullAddress.col;

    if (colNum <= 4) {
      sheet.mergeCells(row, col, row + 1, col);
    } else if (colNum === row_caption.cellCount || colNum === row_caption.cellCount - 1) {
      sheet.mergeCells(row, col, row + 1, col);
    } else {
      if (!cell.isMerged) {
        sheet.mergeCells(row, col, row, col + 2);
      }
    }
  });
  // _______________________________________________________________________
  // _______________________________________________________________________

  (() => {
    const row = cell_bounsCalcProcess.fullAddress.row;
    const col = cell_bounsCalcProcess.fullAddress.col;

    sheet.mergeCells(row, col, row, col + 3);
  })();
  // _______________________________________________________________________
  // _______________________________________________________________________

  sheet.mergeCells(`A${row_reviewer.number}:M${row_reviewer.number}`);

  // ----------------------------------------------------------------------

  const size_l = 18;
  const size_m = 13;

  // _______________________________________________________________________
  // _______________________________________________________________________
  [col_projectNumber, col_projectName, col_contractor, col_designUnit].forEach((col) => {
    col.alignment = {
      ...col.alignment,
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true,
    };
  });

  col_totalSum.eachCell((cell) => {
    cell.border = {
      ...cell.border,
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' },
    };
  });
  col_employeeName.eachCell((cell) => {
    cell.border = {
      ...cell.border,
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' },
    };
  });

  // _______________________________________________________________________
  // _______________________________________________________________________

  [row_title, row_subTitle].forEach((row) => {
    const cell = row.getCell(1);

    row.height = 30;

    cell.alignment = {
      ...cell.alignment,
      horizontal: 'center',
      vertical: 'middle',
    };

    cell.font = {
      ...cell.font,
      size: size_l,
      bold: true,
    };
  });

  // _______________________________________________________________________
  // _______________________________________________________________________
  [row_caption, row_subCaption].forEach((row) => {
    row.alignment = {
      ...row.alignment,
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    row.font = {
      ...row.font,
      size: size_m,
      bold: true,
    };
  });

  // _______________________________________________________________________
  // _______________________________________________________________________

  [...rowArr_data, row_subTotal, row_total].forEach((row) => {
    row.alignment = {
      ...row.alignment,
      vertical: 'middle',
      // horizontal: 'center',
      wrapText: true,
    };

    row.eachCell({ includeEmpty: true }, (cell) => {
      const colKey = sheet.getColumn(cell.fullAddress.col).key;

      if (colKey?.includes('_totalsum') || colKey?.includes('_pricesum') || colKey?.includes('totalSum')) {
        cell.numFmt = '#,##0';
      } else if (colKey?.includes('_percentage')) {
        cell.numFmt = '0.00%';
      }
    });
  });

  // _______________________________________________________________________
  // _______________________________________________________________________

  sheet.eachRow((row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        ...cell.border,
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
      };
    });
  });

  [row_title, row_subTitle].forEach((row) => {
    row.border = {};
  });

  row_subCaption.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      ...cell.border,
      bottom: { style: 'double' },
    };
  });

  [row_subTotal, row_total].forEach((row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        ...cell.border,
        top: { style: 'double' },
      };
    });
  });

  // _______________________________________________________________________
  // _______________________________________________________________________
  row_reviewer.height = 50;
  row_reviewer.alignment = {
    ...row_reviewer.alignment,
    vertical: 'middle',
    horizontal: 'left',
  };
  row_reviewer.border = {};

  // _______________________________________________________________________
  // _______________________________________________________________________

  row_calcProcess.height = 150;
  cell_bounsCalcProcess.alignment = {
    ...cell_bounsCalcProcess.alignment,
    wrapText: true,
    vertical: 'middle',
  };

  // ----------------------------------------------------------------------

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
