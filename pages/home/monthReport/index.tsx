import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import { useRouter } from 'next/router';
import moment from 'moment';
import ExcelJs from 'exceljs';

// layer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import MonthReportTable from 'components/page/home/monthReport/monthReportTable';
import EmployeeSelector from 'components/global/gear/modal/employeeSelector';
import ReportTable_simple from 'components/page/home/monthReport/reportTable_simple';

// gear
import SelectBar from 'components/global/gear/select/selectBar/selectBar';

// api
import { useApiAccountReports } from 'js/api/api_dailyReport';
import { TemployeeDto, TaccountingReportDto } from 'js/api/api_dailyReport';

// css
import scss from './monthReport.module.scss';

// other
import { createNumberRangeOptionArr } from 'js/utils/options/options';
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { holidaysLookup } from 'config/date/holidaysLookup';
import { myConfig } from 'config/myConfig';

// icon
import iconDownload from 'public/image/icon/download.svg';

const holidaysLookupKeyArr = Object.keys(holidaysLookup);

// =============================================================

export default function MonthReport() {
  const router = useRouter();
  const query = router.query as {
    reportId: string;
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // -------------------------------------------------------------------------

  const thisYear_tw = moment(convertDate_reduce1911(new Date().toISOString())).format('yy');
  const thisMonth = moment(convertDate_reduce1911(new Date().toISOString())).format('M');

  const [year_tw, setYear_tw] = useState<string>(thisYear_tw);
  const [month, setMonth] = useState<string>(thisMonth);

  const isoDate = useMemo(() => {
    const isoDate = (() => {
      const year_i18n = parseInt(year_tw) + 1911;

      // 因為時區誤差，所以設15號
      return moment(`${year_i18n}-${month}-15`).toISOString();
    })();

    return isoDate;
  }, [year_tw, month]);

  const { accountingReport, updateAccountReports } = useApiAccountReports(isoDate);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    (async () => {
      try {
        setIsLoading(true);
        await updateAccountReports();
      } catch {
        myAlert.err({ title: '取得資料失敗' });
      }

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, isoDate]);

  // --------------------------------------------------

  const [isShowSelector, setIsShowSelector] = useState<boolean>(false);

  // 搜尋/過濾用的
  const [employeeIdArr, setEmployeeIdArr] = useState<string[]>();

  const onConfirm = (arr: TemployeeDto[]) => {
    if (arr.length === 0) {
      return setEmployeeIdArr(undefined);
    }

    const idArr = arr.map((item) => item.id);
    setEmployeeIdArr(idArr);
  };

  const onCancel = () => {
    setIsShowSelector(false);
  };

  // --------------------------------------------------

  const yearOptionArr = createNumberRangeOptionArr({
    start: +holidaysLookupKeyArr[0],
    end: +holidaysLookupKeyArr[holidaysLookupKeyArr.length - 1] - 1911,
    suffix: '年',
  });
  const monthOptionArr = createNumberRangeOptionArr({
    start: 1,
    end: 12,
    suffix: '月',
    padStart: [2, '0'],
  });

  const selectPropsArr: Parameters<typeof SelectBar>[0]['selectPropsArr'] = [
    {
      selectProps: {
        value: year_tw,
        options: yearOptionArr,
        onChange: (option) => {
          setYear_tw(option!.value);
        },
      },
      boxStyle: { width: '110px' },
    },
    {
      selectProps: {
        value: month,
        options: monthOptionArr,
        onChange: (option) => {
          setMonth(option!.value);
        },
      },
      boxStyle: { width: '100px' },
    },
  ];

  const panelList_list: TpanelList = [
    {
      type: employeeIdArr ? 'redButton' : 'myButton',
      label: employeeIdArr ? '清除搜尋' : '搜尋',
      onClick: () => {
        employeeIdArr ? setEmployeeIdArr(undefined) : setIsShowSelector(true);
      },
      className: scss.btn,
    },
    {
      custom: <SelectBar className={scss.selectBar} selectPropsArr={selectPropsArr} />,
    },
  ];

  const panelList_showReport: TpanelList = [
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.push({
          query: {
            ...query,
            reportId: undefined,
          },
        });
      },
      className: scss.btn,
    },
  ];

  const panelList = query.reportId ? panelList_showReport : panelList_list;
  panelList.unshift({
    type: 'myButton',
    label: '下載Excel檔',
    onClick: () => exportExcel(accountingReport, employeeIdArr),
    img: iconDownload.src,
    className: scss.btn,
  });

  // --------------------------------------------------

  const pushReportId = (id: string) => {
    router.push({
      query: {
        ...query,
        reportId: id,
      },
    });
  };

  // --------------------------------------------------
  //使搜尋清單只會有存在於accountingReport的人員
  const accountingReportIdArr = accountingReport?.map((item) => item.employeeId);

  const customFilter = {
    id: {
      $in: accountingReportIdArr,
    },
  };
  // --------------------------------------------------

  return (
    <>
      <SubLayer bodyClassName={classNames(scss.subLayerBody, scss.plus)} isLoading_subLayer={isLoading}>
        <PageHeader02 tag="報表" panelList={panelList} />

        {!query.reportId && (
          <MonthReportTable
            key={year_tw + month}
            isoDate={isoDate}
            accountingReport={accountingReport}
            employeeIdArr={employeeIdArr}
            pushReportId={pushReportId}
          />
        )}

        {query.reportId && <ReportTable_simple reportId={query.reportId} />}
      </SubLayer>
      <EmployeeSelector
        showModal={isShowSelector}
        onConfirm={onConfirm}
        onCancel={onCancel}
        customFilter={customFilter}
      />
    </>
  );
}

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

const exportExcel = async (dataArr: TaccountingReportDto[] | undefined, employeeIdArr: string[] | undefined) => {
  /**
   * 在同一個worksheet裡面(未試過不同worksheet的情況)，
   * 不能同時使用addTable與mergeCells
   * addTable與mergeCells都用的話，產出的xlsx檔無法給微軟的excel開啟
   */

  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet('報表');

  sheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 2 }];
  // -----------------------------------------------------------

  const cA = sheet.getColumn(1);
  cA.key = 'caption';
  cA.width = 18;
  cA.font = {
    bold: true,
    size: 16,
  };
  cA.alignment = {
    vertical: 'middle',
    horizontal: 'center',
  };
  sheet.mergeCells('A1:A2');

  const dateDayArr = new Array(31).fill(0).map((item, index) => index + 1);
  cA.values = [undefined, '日期', ...dateDayArr, '合計', '餐費', '外宿費', '餐+宿', '本月總合計'];
  // -----------------------------------------------------------
  let monthTotal = 0;
  let tableCount = 0;
  // -----------------------------------------------------------
  dataArr?.forEach((data) => {
    const { employeeName, employeeId, statistic } = data;

    // 過濾/搜尋用的
    const shouldShow = filterIdArr({ employeeIdArr, employeeId });

    if (!shouldShow) {
      return;
    }

    const class_statisticCalc = new Class_statisticCalc();

    // const dataRow: Array<Array<'V' | '1' | undefined>> = new Array(31).fill([]);
    const c1Arr: Array<'V' | '1' | undefined> = new Array(31).fill(undefined);
    const c2Arr: Array<'V' | '1' | undefined> = new Array(31).fill(undefined);
    const c3Arr: Array<'V' | '1' | undefined> = new Array(31).fill(undefined);
    const c4Arr: Array<'V' | '1' | undefined> = new Array(31).fill(undefined);

    // -----------------------------------------------------------
    statistic.forEach((item) => {
      const { date, meals, stayLength, dailyReportId } = item;

      const { isBreakfast, isLunch, isDinner } = class_statisticCalc.calcQty(meals ?? []);
      class_statisticCalc.stayLength = class_statisticCalc.stayLength + stayLength;

      const breakfast = isBreakfast ? 'V' : undefined;
      const lunch = isLunch ? 'V' : undefined;
      const dinner = isDinner ? 'V' : undefined;

      const stayLengthV = stayLength ? '1' : undefined;

      const dateDay = new Date(date).getDate();
      // dataRow[dateDay - 1] = [breakfast, lunch, dinner, stayLengthV];
      c1Arr[dateDay - 1] = breakfast;
      c2Arr[dateDay - 1] = lunch;
      c3Arr[dateDay - 1] = dinner;
      c4Arr[dateDay - 1] = stayLengthV;
    });

    // -----------------------------------------------------------
    const c1 = sheet.getColumn(`${numberToLetters(tableCount * 4 + 2)}`);
    const c2 = sheet.getColumn(`${numberToLetters(tableCount * 4 + 2 + 1)}`);
    const c3 = sheet.getColumn(`${numberToLetters(tableCount * 4 + 2 + 2)}`);
    const c4 = sheet.getColumn(`${numberToLetters(tableCount * 4 + 2 + 3)}`);

    c1.values = [
      employeeName,
      '早',
      ...c1Arr,
      class_statisticCalc.breakfastQty,
      class_statisticCalc.total_mealsCost,
      class_statisticCalc.stayCost,
      class_statisticCalc.subTotal,
    ];
    c2.values = [undefined, '午', ...c2Arr, class_statisticCalc.lunchQty];
    c3.values = [undefined, '晚', ...c3Arr, class_statisticCalc.dinnerQty];
    c4.values = [undefined, '外宿', ...c4Arr, class_statisticCalc.stayLength];

    // -----------------------------------------------------------

    monthTotal = monthTotal + class_statisticCalc.subTotal;

    // -----------------------------------------------------------
    // sheet.addTable({
    //   name: employeeId,
    //   ref: `${numberToLetters(tableCount * 4 + 2)}1`,
    //   headerRow: false,
    //   columns: [{ name: 'breakfast' }, { name: 'lunch' }, { name: 'dinner' }, { name: 'stayLength' }],
    //   rows: [
    //     [employeeName],
    //     ['早', '中', '晚', '外宿'],
    //     ...dataRow,
    //     [
    //       class_statisticCalc.breakfastQty,
    //       class_statisticCalc.lunchQty,
    //       class_statisticCalc.dinnerQty,
    //       class_statisticCalc.stayLength,
    //     ],
    //     [class_statisticCalc.total_mealsCost],
    //     [class_statisticCalc.stayCost],
    //     [class_statisticCalc.subTotal],
    //   ],
    // });
    // -----------------------------------------------------------

    sheet.mergeCells(`${numberToLetters(tableCount * 4 + 2)}1:${numberToLetters(tableCount * 4 + 2 + 3)}1`);
    sheet.mergeCells(`${numberToLetters(tableCount * 4 + 2)}35:${numberToLetters(tableCount * 4 + 2 + 3)}35`);
    sheet.mergeCells(`${numberToLetters(tableCount * 4 + 2)}36:${numberToLetters(tableCount * 4 + 2 + 3)}36`);
    sheet.mergeCells(`${numberToLetters(tableCount * 4 + 2)}37:${numberToLetters(tableCount * 4 + 2 + 3)}37`);

    tableCount++;
  });

  sheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      cell.font = { size: 14 };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    });
  });

  const cell_total_caption = sheet.getCell('A38');
  const cell_total = sheet.getCell('B38');
  cell_total_caption.font = { bold: true, size: 16 };

  cell_total.value = monthTotal;
  cell_total.font = { bold: true, size: 16 };
  cell_total.numFmt = '#,##0.00;[Red]-#,##0.00';
  sheet.mergeCells(`B38:E38`);
  // -----------------------------------------------------------

  await workbook.xlsx.writeBuffer();

  // -----------------------------------------------------------
  // 表格裡面的資料都填寫完成之後，訂出下載的callback function
  // 異步的等待他處理完之後，創建url與連結，觸發下載
  workbook.xlsx.writeBuffer().then((content) => {
    const link = document.createElement('a');
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });

    const today = moment().format('yyyy-MM-DD');
    link.download = `三久ERP_報表_${today}.xlsx`;
    link.href = URL.createObjectURL(blobData);
    link.click();
    link.remove();
  });
};

// 數字轉字母
function numberToLetters(num: number) {
  let result = '';

  while (num > 0) {
    const remainder = (num - 1) % 26;
    result = String.fromCharCode(remainder + 65) + result;
    num = Math.floor((num - 1) / 26);
  }

  return result;
}

class Class_statisticCalc {
  // 各項的數量合計
  breakfastQty = 0;
  lunchQty = 0;
  dinnerQty = 0;
  stayLength = 0;

  calcQty = (meals: string[]) => {
    let isBreakfast = false;
    let isLunch = false;
    let isDinner = false;

    // 去除陣列中的重複值後forEach
    _.uniq(meals ?? []).forEach((meal) => {
      if (meal === 'breakfast') {
        this.breakfastQty++;
        isBreakfast = true;
      }

      if (meal === 'lunch') {
        this.lunchQty++;
        isLunch = true;
      }

      if (meal === 'dinner') {
        this.dinnerQty++;
        isDinner = true;
      }
    });

    return {
      isBreakfast,
      isLunch,
      isDinner,
    };
  };

  // 餐費
  get total_mealsCost() {
    return (
      this.breakfastQty * myConfig.breakfastCost +
      this.lunchQty * myConfig.lunchCost +
      this.dinnerQty * myConfig.dinnerCost
    );
  }
  // 外宿費
  get stayCost() {
    return this.stayLength * myConfig.stayCost;
  }
  // 餐加宿
  get subTotal() {
    return this.total_mealsCost + this.stayCost;
  }
}

const filterIdArr = ({ employeeIdArr, employeeId }: { employeeIdArr: string[] | undefined; employeeId: string }) => {
  if (!employeeIdArr) {
    return true;
  }

  if (employeeIdArr.includes(employeeId)) {
    return true;
  }

  return false;
};

export { Class_statisticCalc, filterIdArr };
