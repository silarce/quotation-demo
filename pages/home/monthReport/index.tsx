import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import { useRouter } from 'next/router';
import moment from 'moment';

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
import { convertDate_reduce1911, convertDate_add1911 } from 'js/utils/helpers/date/convertDate';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { holidaysLookup } from 'config/date/holidaysLookup';

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
      custom: <SelectBar selectPropsArr={selectPropsArr} />,
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
    type: 'exportButton',
    label: '下載Excel檔',
    onClick: () => exportExcel(accountingReport),
    // onClick: () => {
    //   alert('功能開發中');
    // },
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

// =============================================================

import ExcelJs from 'exceljs';

const exportExcel = async (dataArr: TaccountingReportDto[] | undefined) => {
  // console.log(data);
  const workbook = new ExcelJs.Workbook();

  // const sheetName = 'foo';
  // const sheet = workbook.addWorksheet('foo');

  // sheet.columns = [
  //   { header: '日期1', key: 'date', width: 20 },
  //   { header: '日期2', key: 'date1', width: 20 },
  //   { header: '日期3', key: 'date2', width: 20 },
  //   { header: '日期4', key: 'date3', width: 20 },
  // ];
  // const worksheet = workbook.getWorksheet('foo');

  // sheet.mergeCells('A1:B1');

  // 第一個值為row1，會蓋掉header
  // undefined會被當成空白
  // sheet.getColumn(1).values = [1, 2, 3, 4, 5];
  // sheet.getColumn('date1').values = [5, 4, 3, 2, 1, 0];
  // sheet.getColumn('date2').values = [undefined, undefined, 3, 2, , 0];

  // sheet.addTable({
  //   name: 'MyTable',
  //   ref: 'A1',
  //   // style: {
  //   //   showFirstColumn: true,
  //   // },

  //   columns: [{ name: 'a' }],
  //   rows: [['1', '1', '1', '1', '1']],
  // });

  // sheet.addTable({
  //   name: 'MyTable',
  //   ref: 'A1',
  //   columns: [{ name: 'a' }, { name: 'b' }],
  //   rows: [['1', '5']],
  // });
  // sheet.addTable({
  //   name: 'MyTable',
  //   ref: 'C1',
  //   columns: [{ name: 'a' }, { name: 'b' }],
  //   rows: [['1', '5']],
  // });
  // sheet.addTable({
  //   name: 'MyTable',
  //   ref: 'E1',
  //   columns: [{ name: 'a' }, { name: 'b' }],
  //   rows: [['1', '5']],
  // });

  // sheet.addTable({
  //   name: 'MyTotal',
  //   ref: 'G1',
  //   headerRow: true,
  //   totalsRow: true,
  //   columns: [
  //     { name: 'Date', totalsRowLabel: 'Totals:', filterButton: true },
  //     // { name: 'Amount', totalsRowFunction: 'sum', filterButton: false },
  //     { name: 'Amount', totalsRowFunction: 'average', filterButton: false },
  //   ],
  //   rows: [
  //     [new Date('2019-07-20'), 70.1],
  //     [new Date('2019-07-21'), 70.6],
  //     [new Date('2019-07-22'), 70.1],
  //   ],
  // });

  // -----------------------------------------------------------
  const sheet = workbook.addWorksheet('報表');
  // -----------------------------------------------------------

  const cA = sheet.getColumn(1);
  cA.width = 15;
  cA.key = 'caption';
  sheet.mergeCells('A1:A2');

  const dateDayArr = new Array(31).fill(0).map((item, index) => index + 1);

  cA.values = [undefined, '日期', ...dateDayArr, '合計', '餐費', '外宿費', '餐+宿', '本月總合計'];
  // -----------------------------------------------------------

  dataArr?.forEach((data, index) => {
    const { employeeName, employeeId, statistic } = data;
    // const { date, meals, stayLength, dailyReportId, isWorker } = statistic;

    const dataRow: Array<Array<'V' | '1' | undefined>> = new Array(31).fill([]);

    statistic.forEach((item) => {
      const { date, meals, stayLength, dailyReportId } = item;

      const stayLengthV = stayLength ? '1' : undefined;

      let breakfast: 'V' | undefined = undefined;
      let lunch: 'V' | undefined = undefined;
      let dinner: 'V' | undefined = undefined;

      meals?.forEach((meal) => {
        if (meal === 'breakfast') {
          breakfast = 'V';
        }

        if (meal === 'lunch') {
          lunch = 'V';
        }

        if (meal === 'dinner') {
          dinner = 'V';
        }
      });

      const dateDay = new Date(date).getDate();
      dataRow[dateDay - 1] = [breakfast, lunch, dinner, stayLengthV];
    });

    // console.log(dataRow[0]);

    sheet.addTable({
      name: employeeId,
      ref: `${numberToLetters(index * 4 + 2)}1`,
      headerRow: false,
      columns: [{ name: 'breakfast' }, { name: 'lunch' }, { name: 'dinner' }, { name: 'stayLength' }],
      rows: [[employeeName], ['早', '中', '晚', '外宿'], ...dataRow],
    });

    sheet.mergeCells(`${numberToLetters(index * 4 + 2)}1:${numberToLetters(index * 4 + 2 + 3)}1`);
  });

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

    const id = 'foo';
    // const today = Moment().format('yyyy-MM-DD');
    // link.download = `${id}_${today}.xlsx`;
    link.download = `foo.xlsx`;
    link.href = URL.createObjectURL(blobData);
    link.click();
    link.remove();
  });
};

// 數字轉字母 // from gpt3.5
function numberToLetters(num: number) {
  let result = '';

  while (num > 0) {
    const remainder = (num - 1) % 26;
    result = String.fromCharCode(remainder + 65) + result;
    num = Math.floor((num - 1) / 26);
  }

  return result;
}
