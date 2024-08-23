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
import { useEmployee, Tparams } from 'js/api/api_employee';
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

  // region FUNCTION

  const handle_dlExcel = () => {
    const theMonth = month ? month.padStart(2, '0') : '';

    dlExcel({
      data: control_table,
      sheetName: activeEmp?.label ?? '',
      excelName: `個人業績統計表_${activeEmp?.label}_${year}${theMonth}`,
      year,
      month,
    });
  };

  // ------------------------------------------------------------------
  // region PROPS

  const empOptionArr = useMemo(() => {
    if (!data_emp) {
      return [];
    }

    const empArr = data_emp.data;

    const optionArr = empArr.map((emp) => {
      return {
        label: emp.chName || emp.enName || inValidSymbol,
        value: emp.id,
      };
    });

    return optionArr;
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
      onClick: handle_dlExcel,
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
}: {
  data: TquotationAccounting_personal_contract[] | undefined;
  bonus_closed?: string;
  sales_closed?: string;
}) =>
  //
  {
    const control: Tcontrol_personalPerformanceStatistics = useMemo(() => {
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

      const totalPercentage_num = new Decimal(total.pricesum)
        .div(total.totalsum)
        .mul(100)
        .toDecimalPlaces(2)
        .toNumber();

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
          {theTotal.pricesum} - {threshold_str} ={performance_str}
          <br />
          {performance_str} * 1% * {totalPercentage_num}% = <span className="text-danger font-bold">{bonus_str}</span>
          <hr />
          結算業績 : {sales_closed}　 結算獎金 : <span className="text-danger font-bold">{bonus_closed}</span>
        </>
      );
      // _______________________________________________________________________

      return {
        rowArr: control_rowArr,
        subTotalList: theSubTotalList,
        total: theTotal,
        listKeyArr,
        bounsCalcProcess,
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

// region dlExcel

const dlExcel = async ({
  data,
  sheetName,
  excelName,
  year,
  month,
}: {
  data: Tcontrol_personalPerformanceStatistics;
  sheetName: string;
  excelName: string;
  year: string | number;
  month: string | undefined;
}) =>
  //
  {
    const { listKeyArr, rowArr, subTotalList, total } = data;

    const workbook = new ExcelJs.Workbook();
    const sheet = workbook.addWorksheet(sheetName);

    sheet.views = [{ state: 'frozen', xSplit: 2 }];

    // ----------------------------------------------------------------------

    // ----------------------------------------------------------------------
    // 先建好columns

    const listColumnsProps = listKeyArr.reduce((current, key) => {
      current.push(
        {
          header: key,
          key,
          width: 15,
        },
        {
          width: 15,
        },
        {
          width: 15,
        }
      );

      return current;
    }, [] as Partial<ExcelJs.Column>[]);

    sheet.columns = [
      { header: '編號', key: 'idNumber', width: 15 },
      { header: '工程名稱', key: 'projectName', width: 32 },
      { header: '營造', key: 'C', width: 15 }, // 目前還沒有相關資料
      { header: '設計單位', key: 'D', width: 15 }, // 目前還沒有相關資料
      ...listColumnsProps,
    ];

    // ----------------------------------------------------------------------
    const titleRow = sheet.insertRow(1, ['三久建材股份有限公司']);
    titleRow.font = {
      bold: true,
      size: 20,
    };
    sheet.mergeCells('A1:B1');

    // const dateRow = sheet.insertRow(2, [`${year}年${month}月業績統計表`]);
    const dateRow = sheet.insertRow(2, [`${year}年${month ? `${month}月` : ''}業績統計表`]);
    dateRow.font = {
      bold: true,
      size: 20,
    };
    sheet.mergeCells('A2:B2');

    // ----------------------------------------------------------------------

    // 取得放資料的row

    const row_start = 5;
    const row_end = rowArr.length;
    const rowArr_excel = sheet.getRows(row_start, row_end) ?? [];

    // ----------------------------------------------------------------------

    // 把編號與工程名稱放進去

    rowArr.forEach((row, index_row) => {
      const { quotationNumber, projectName } = row;

      if (rowArr_excel[index_row]) {
        rowArr_excel[index_row].values = [quotationNumber, projectName];
      }
    });

    // ----------------------------------------------------------------------

    // 建立table並把資料放進去

    sheet.columns.forEach((col, index) => {
      if (index <= 3) {
        return;
      }

      if (col.key) {
        sheet.mergeCells(3, index + 1, 3, index + 1 + 2);
        sheet.getCell(`${col.letter}${3}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });

    const listColumns = sheet.columns.slice(4).filter((col) => col.key);

    listColumns.forEach((column) => {
      const tableProps = createTable({
        column,
        rowArr,
        subTotalList,
      });

      sheet.addTable(tableProps);
    });

    sheet.columns.forEach((col, index) => {
      if (index < 4) {
        return;
      }

      col.numFmt = '$#,##0.00';

      if ((index - 3) % 3 === 0) {
        col.numFmt = '0.00%';
      }
    });

    const row_subTotal = sheet.lastRow;

    if (row_subTotal) {
      row_subTotal.getCell(4).value = '小計';
      row_subTotal.getCell(4).alignment = { vertical: 'middle', horizontal: 'right' };
    }

    // --------------------------------------------------------------------

    const col_total = sheet.getColumn(sheet.columns.length + 1);
    col_total.width = 20;
    col_total.numFmt = '$#,##0.00';

    col_total.values = rowArr.reduce(
      (values, row) => {
        values.push(Number(row.total.replaceAll(',', '')));

        return values;
      },
      [undefined, undefined, undefined, '總價'] as (undefined | string | number)[]
    );

    // --------------------------------------------------------------------

    // 處理小計與總計

    sheet.addRow([]);
    const row_totalLabel = sheet.addRow([]);

    const row_total = sheet.addRow([]);

    row_totalLabel.values = [
      //
      undefined,
      undefined,
      undefined,
      undefined,
      '牌價',
      '承價',
      '百分比',
    ];

    row_total.values = [
      //
      undefined,
      undefined,
      undefined,
      '總計',
      Number(total.totalsum.replaceAll(',', '')),
      Number(total.pricesum.replaceAll(',', '')),
      new Decimal(total.percentage.replace('%', '')).div(100).toNumber(),
    ];

    row_total.getCell(4).alignment = { vertical: 'middle', horizontal: 'right' };

    // ----------------------------------------------------------------------

    // const titleRow = sheet.insertRow(1, ['三  久  建  材  股  份  有  限  公  司']);
    // titleRow.font = {
    //   bold: true,
    //   size: 20,
    // };
    // // titleRow.getCell(1)
    // sheet.mergeCells('A1:D1');

    // ----------------------------------------------------------------------

    // 調整樣式

    row_subTotal?.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: {
          style: 'double',
          color: { argb: 'FF000000' },
        },
      };
    });

    rowArr_excel.forEach((row, index_row) => {
      const isOdd = index_row % 2 === 0;

      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isOdd ? 'ffeeeeee' : 'ffdddddd' },
        };
      });
      row.commit();
    });

    sheet.getRow(4).eachCell((cell) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'right',
      };
    });

    row_totalLabel.eachCell((cell) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'right',
      };
    });

    // --------------------------------------------------------------------
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

// =====================================================================

// region createTable

const createTable = ({
  //
  column,
  rowArr,
  subTotalList,
}: {
  column: Partial<ExcelJs.Column>;
  rowArr: Tcontrol_personalPerformanceStatistics['rowArr'];
  subTotalList: Tcontrol_personalPerformanceStatistics['subTotalList'];
}) => {
  const subTotal: Tcontrol_personalPerformanceStatistics['subTotalList'][string] | undefined =
    subTotalList[column.key ?? 'undefined'];

  const rows: TableProperties['rows'] = rowArr.map((row) => {
    const { list } = row;

    if (!column.key || !list[column.key]) {
      return [];
    }

    let totalsum: string | number = list[column.key]?.totalsum || inValidSymbol;
    let pricesum: string | number = list[column.key]?.pricesum || inValidSymbol;
    let percentage: string | number = list[column.key]?.percentage || inValidSymbol;

    if (totalsum !== inValidSymbol) {
      totalsum = Number(totalsum.replaceAll(',', ''));
    }

    if (pricesum !== inValidSymbol) {
      pricesum = Number(pricesum.replaceAll(',', ''));
    }

    if (percentage !== inValidSymbol) {
      // percentage = Number(percentage.replace('%', ''));
      percentage = percentage.replace('%', '');
      percentage = new Decimal(percentage).div(100).toNumber();
    }

    return [totalsum, pricesum, percentage];
  });

  const lastRow = (() => {
    let totalsum: string | number = subTotal.totalsum || inValidSymbol;
    let pricesum: string | number = subTotal.pricesum || inValidSymbol;
    let percentage: string | number = subTotal.percentage || inValidSymbol;

    if (totalsum !== inValidSymbol) {
      totalsum = Number(totalsum.replaceAll(',', ''));
    }

    if (pricesum !== inValidSymbol) {
      pricesum = Number(pricesum.replaceAll(',', ''));
    }

    if (percentage !== inValidSymbol) {
      // percentage = Number(percentage.replace('%', ''));
      percentage = percentage.replace('%', '');
      percentage = new Decimal(percentage).div(100).toNumber();
    }

    return [totalsum, pricesum, percentage];
  })();

  const tableProps: TableProperties = {
    name: column.key ?? 'undefined',
    ref: `${column.letter}${4}`,
    headerRow: true,
    // totalsRow: true,
    style: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      theme: null,
      showRowStripes: true,
    },
    columns: [
      {
        name: '牌價',
        totalsRowFunction: 'sum',
      },
      { name: '承價', totalsRowFunction: 'sum' },
      { name: '百分比', totalsRowFunction: 'average' },
    ],
    rows: [...rows, lastRow],
  };

  return tableProps;
};
