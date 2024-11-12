/* eslint-disable prefer-const */

import { useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';
import ExcelJs from 'exceljs';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import EditDefunctionBtn from 'components/page/worksDepartment/contracList/contract/accountReceivable/accountantDeductionEditor';

// gear
import Row, { Cell } from 'components/global/gear/table/row';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// utils
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// api
import { Tparams, useGetAccountant } from 'js/api/api_accountant';
import { apiGetAccountReceivable_id, TaccountantDto, TincomeBillSerialDto } from 'js/api/api_engineering';
import { TapiError } from 'js/api/api_engineering';
import { AxiosError } from 'axios';

// css
import scss from './index.module.scss';
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';

// --------------------------------------------------------------

type Tquery = {
  year: string;
  month: string;
  keyword: string;
};

// --------------------------------------------------------------
// MARK: START
export default function CollectionDetailList() {
  const { thisYear, thisMonth, yearOptionArr, monthOptionArr } = useYearMonth_options();

  const router = useRouter();
  const query = router.query as Tquery;
  const { year = thisYear.toString(), month = thisMonth.toString() } = query;
  const keyword = query.keyword || undefined;

  // --------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      populate: ['incomeBill.accountsReceivableDeduction', 'invoices'],
      pageSize: 999999,
      filter: {
        insertDate: {
          $gte: moment()
            .set({ year: Number(year), month: Number(month) - 1 })
            .startOf('month')
            .toISOString(),
          $lte: moment()
            .set({ year: Number(year), month: Number(month) - 1 })
            .endOf('month')
            .toISOString(),
        },
        $or: [
          {
            vendorName: {
              $contains: keyword,
            },
          },
          {
            accountingNumber: {
              $contains: keyword,
            },
          },
          {
            price: {
              $eq: isNaN(Number(keyword)) ? undefined : keyword,
            },
          },
          {
            notes: {
              $contains: keyword,
            },
          },
          {
            noteNumber: {
              $contains: keyword,
            },
          },
          {
            // 以後有時間應該要把到期日另外以select處理
            $and: {
              noteMaturityDate: (() => {
                const data_m = moment(keyword);

                if (!keyword || !data_m.isValid()) {
                  return undefined;
                }

                const [_, month, day] = keyword.split('-');

                let year = data_m.year();

                if (year < 500) {
                  year = year + 1911;
                }

                data_m.year(year);

                const range = day ? 'day' : month ? 'month' : 'year';
                const $gte = data_m.startOf(range).toISOString();
                const $lte = data_m.endOf(range).toISOString();

                return {
                  $gte,
                  $lte,
                };
              })(),
            },
          },
          {
            'invoices.invoiceNumber': {
              $contains: keyword,
            },
          },
          {
            billSerialNumber: {
              $contains: keyword,
            },
          },
        ],
      },
    };
  }, [year, month, keyword]);

  const { data: data_accountant = [] } = useGetAccountant({ params });

  // --------------------------------------------------------------
  // 底下的總計
  const total = data_accountant.reduce((acc, curr) => acc + curr.price || 0, 0).toLocaleString();

  // --------------------------------------------------------------
  // MARK:PROPS

  const selectPropsArr = useYearMonth_selectBar_query({
    year,
    month,
    yearOptionArr,
    monthOptionArr,
  });

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      width: '200px',
      defaultValue: keyword,
      placeholder: '關鍵字搜尋',
    },
  ];

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch: (arr) => {
      const keyword = arr[0] as string;

      router.replace({
        query: {
          ...router.query,
          keyword,
        },
      });
    },
  };

  const panelList: TpanelList = [
    { searchGroup },
    {
      label: '匯出excel',
      type: 'myButton',
      onClick: () => dlExcel({ excelName: '收款明細表', data_accountant, year: year as `${number}`, month }),
    },
  ];
  // ________________________________________________________________
  // ________________________________________________________________

  // --------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag="收款明細表"
        customeLeft={[
          <SelectBar
            //
            key="selectBar"
            className="ml-5"
            selectPropsArr={selectPropsArr}
          />,
        ]}
        panelList={panelList}
      />

      <div className={scss.table}>
        <Row className={scss.thead} thead={true} fullWidth={true}>
          {keyArr.map((key) => {
            const { label, style } = config[key];

            return (
              <Cell key={key} style={style}>
                {label}
              </Cell>
            );
          })}
        </Row>

        {data_accountant.map((accountant, index) => {
          const {
            id,
            insertDate,
            vendorName,
            accountingNumber,
            price,
            notes,
            noteNumber,
            noteMaturityDate,
            // invoiceNumber,
            // billSerialNumber,

            incomeBill,
            invoices,
          } = accountant;

          const { totalFee, totalDeduction } = calcTotalFeeAndTotalDefuction(incomeBill);

          const node_billSerialNumber = _.sortBy(incomeBill, 'billSerialNumber').map((incomeBill) => {
            const { id, accountantId, billSerialNumber, accountReceivableId } = incomeBill;

            return (
              <div key={id}>
                <span
                  //
                  className={classNames(accountReceivableId && scss.billSerialNumberWithAccountReceivable)}
                  onClick={() => accountReceivableId && directToAccountReceivable(accountReceivableId)}
                >
                  {billSerialNumber}
                </span>

                <EditDefunctionBtn forbidden={true} className={'ml-2'} accountantId={accountantId} incomeBillId={id} />
              </div>
            );
          });

          const invoiceNumber = invoices?.[0]?.invoiceNumber as string | undefined;

          const list = {
            insertDate: getTaiwanDateStr(insertDate),
            vendorName,
            accountingNumber,
            price: price.toLocaleString(),
            notes,
            noteNumber,
            noteMaturityDate: getTaiwanDateStr(noteMaturityDate),
            invoiceNumber,
            // billSerialNumber: billSerialNumber?.join('\n') ?? '',
            billSerialNumber: node_billSerialNumber,
            totalFee,
            totalDeduction,
          } as const;

          return (
            <Row key={id} fullWidth={true}>
              {keyArr.map((key) => {
                const { style, bodyClassName } = config[key];

                return (
                  <Cell key={key} style={style} className={classNames(bodyClassName)} preBuilt="block">
                    {list[key]}
                  </Cell>
                );
              })}
            </Row>
          );
        })}

        {/*  */}

        <Row className={scss.bottom} fullWidth={true}>
          <Cell preBuilt="block" className={scss.totalCell} style={config.insertDate.style} />
          <Cell preBuilt="block" className={scss.totalCell} style={config.vendorName.style} />
          <Cell preBuilt="block" className={scss.totalCell} style={config.accountingNumber.style}>
            總計
          </Cell>
          <Cell preBuilt="block" style={config.price.style}>
            {total}
          </Cell>
        </Row>
      </div>
      {/*  */}
    </SubLayer>
  );
}
// MARK: END

// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================

const directToAccountReceivable = async (accountReceivableId: string | null | undefined) => {
  if (!accountReceivableId) {
    myAlert.info({ title: '無應收帳款明細' });

    return;
  }

  return await apiGetAccountReceivable_id(accountReceivableId, {
    populate: ['contract'],
  })
    .then((AccountReceivable) => {
      const { contract } = AccountReceivable;

      const contractId = contract!.id;
      // const path = `/worksDepartment/contractList/contract/accountReceivable?contractId=${contractId}&version=1`;
      const path = `accountReceivable?contractId=${contractId}`;
      window.open(path, '_blank');
    })
    .catch((err: AxiosError<TapiError>) => {
      myAlert.err({ title: '取得應收帳款明細失敗', content: err.response?.data?.message || err.message });
    });
};

const calcTotalFeeAndTotalDefuction = (incomeBill: TincomeBillSerialDto[]) => {
  return incomeBill.reduce(
    (obj, bill) => {
      const { fee } = bill;
      const accountsReceivableDeduction = bill.accountsReceivableDeduction ?? [];
      const deductionAmount = accountsReceivableDeduction.reduce((detailedAmount, curr) => {
        return new Decimal(detailedAmount).add(curr.detailedAmount || 0).toNumber();
      }, 0);

      obj.totalFee = new Decimal(obj.totalFee).add(fee || 0).toNumber();
      obj.totalDeduction = new Decimal(obj.totalDeduction).add(deductionAmount).toNumber();

      return obj;
    },
    { totalFee: 0, totalDeduction: 0 }
  );
};

// =============================================================================

type Tkey =
  | 'insertDate'
  | 'vendorName'
  | 'accountingNumber'
  | 'price'
  | 'notes'
  | 'noteNumber'
  | 'noteMaturityDate'
  | 'invoiceNumber'
  | 'billSerialNumber'
  | 'totalFee'
  | 'totalDeduction';

const keyArr: Tkey[] = [
  'insertDate',
  'vendorName',
  'accountingNumber',
  'price',
  'noteNumber',
  'noteMaturityDate',
  'invoiceNumber',
  'totalFee',
  'totalDeduction',
  'billSerialNumber',
  'notes',
];

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
  className?: string;
  bodyClassName?: string;
};

type Tconfig = {
  [key in Tkey]: TconfigItem;
};

const config: Tconfig = {
  insertDate: {
    label: '收款日期',
    style: { width: 110 },
    className: undefined,
  },
  vendorName: {
    label: '客戶簡稱',
    style: { width: 200 },
    className: undefined,
  },
  accountingNumber: {
    label: '存入帳號',
    style: { width: 170 },
    className: undefined,
  },
  price: {
    label: '收款金額',
    style: { width: 100, textAlign: 'right' },
  },
  notes: {
    label: '備註',
    style: {
      flex: 1,
      // textAlign: 'left'
    },
    className: undefined,
  },
  noteNumber: {
    label: '票據號碼',
    style: { width: 120 },
    className: undefined,
  },
  noteMaturityDate: {
    label: '到期日',
    style: { width: 110 },
    className: undefined,
  },
  invoiceNumber: {
    label: '發票號碼',
    style: { width: 120 },
    className: undefined,
  },
  billSerialNumber: {
    label: '收入傳票序號',
    style: { width: 120 },
    className: undefined,
  },
  totalFee: {
    label: '匯費',
    style: { width: 100 },
    className: undefined,
  },
  totalDeduction: {
    label: '扣款金額',
    style: { width: 100 },
    className: undefined,
  },
};

// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================

const dlExcel = async ({
  //
  excelName,
  data_accountant,
  year,
  month,
}: {
  excelName: string;
  data_accountant: TaccountantDto[];
  year: `${number}` | number;
  month: string;
}) => {
  const twYear = Number(year) - 1911;
  month = month.padStart(2, '0');

  // ---------------------------------------------------------------------------

  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet();

  sheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9,
  };

  // ---------------------------------------------------------------------------

  const colSetting_insertDate = {
    label: '收款日期',
    key: 'insertDate',
    width: 12,
  };
  const colSetting_vendorName = {
    label: '客戶簡稱',
    key: 'vendorName',
    width: 20,
  };
  const colSetting_accountingNumber = {
    label: '存入帳號',
    key: 'accountingNumber',
    width: 25,
  };
  const colSetting_price = {
    label: '收款金額',
    key: 'price',
    width: 12,
  };
  const colSetting_notes = {
    label: '備註',
    key: 'notes',
    width: 25,
  };
  const colSetting_noteNumber = {
    label: '票據號碼',
    key: 'noteNumber',
    width: 14,
  };
  const colSetting_noteMaturityDate = {
    label: '到期日',
    key: 'noteMaturityDate',
    width: 12,
  };
  const colSetting_invoiceNumber = {
    label: '發票號碼',
    key: 'invoiceNumber',
    width: 14,
  };
  const colSetting_billSerialNumber = {
    label: '收入傳票序號',
    key: 'billSerialNumber',
    width: 15,
  };
  const colSetting_totalFee = {
    label: '匯費',
    key: 'totalFee',
    width: 12,
  };
  const colSetting_totalDeduction = {
    label: '扣款金額',
    key: 'totalDeduction',
    width: 12,
  };
  const colSetting_deductionDetail = {
    label: '扣款明細',
    key: 'deductionDetail',
    width: 20,
  };

  // ---------------------------------------------------------------------------

  sheet.columns = [
    colSetting_insertDate,
    colSetting_vendorName,
    colSetting_accountingNumber,
    colSetting_price,
    colSetting_noteNumber,
    colSetting_noteMaturityDate,
    colSetting_invoiceNumber,
    colSetting_totalFee,
    colSetting_totalDeduction,
    colSetting_deductionDetail,
    colSetting_billSerialNumber,
    colSetting_notes,
  ];

  // ---------------------------------------------------------------------------

  const col_insertDate = sheet.getColumn(colSetting_insertDate.key);
  const col_vendorName = sheet.getColumn(colSetting_vendorName.key);
  const col_accountingNumber = sheet.getColumn(colSetting_accountingNumber.key);
  const col_price = sheet.getColumn(colSetting_price.key);
  const col_notes = sheet.getColumn(colSetting_notes.key);
  const col_noteNumber = sheet.getColumn(colSetting_noteNumber.key);
  const col_noteMaturityDate = sheet.getColumn(colSetting_noteMaturityDate.key);
  const col_invoiceNumber = sheet.getColumn(colSetting_invoiceNumber.key);
  const col_billSerialNumber = sheet.getColumn(colSetting_billSerialNumber.key);
  const col_totalFee = sheet.getColumn(colSetting_totalFee.key);
  const col_totalDeduction = sheet.getColumn(colSetting_totalDeduction.key);
  const col_deductionDetail = sheet.getColumn(colSetting_deductionDetail.key);

  let row_title: ExcelJs.Row;
  let row_subTitle: ExcelJs.Row;
  let row_caption: ExcelJs.Row;
  let rowArr_data: ExcelJs.Row[] = [];
  let row_totalPrice: ExcelJs.Row;

  // ---------------------------------------------------------------------------

  let totalPrice = 0;

  // ---------------------------------------------------------------------------

  row_title = sheet.addRow(['三　久　建　材　股　份　有　限　公　司']);
  row_subTitle = sheet.addRow([`民國${twYear}年${month}月`]);
  sheet.addRow({});

  row_caption = sheet.addRow({
    insertDate: colSetting_insertDate.label,
    vendorName: colSetting_vendorName.label,
    accountingNumber: colSetting_accountingNumber.label,
    price: colSetting_price.label,
    notes: colSetting_notes.label,
    noteNumber: colSetting_noteNumber.label,
    noteMaturityDate: colSetting_noteMaturityDate.label,
    invoiceNumber: colSetting_invoiceNumber.label,
    billSerialNumber: colSetting_billSerialNumber.label,
    totalFee: colSetting_totalFee.label,
    totalDeduction: colSetting_totalDeduction.label,
    deductionDetail: colSetting_deductionDetail.label,
  });

  // ---------------------------------------------------------------------------

  data_accountant.forEach((accountant) => {
    const {
      insertDate,
      vendorName,
      accountingNumber,
      price,
      notes,
      noteNumber,
      noteMaturityDate,
      invoices,
      incomeBill,
      // billSerialNumber,
    } = accountant;

    totalPrice = new Decimal(totalPrice).add(price || 0).toNumber();

    const { totalFee, totalDeduction } = calcTotalFeeAndTotalDefuction(incomeBill);

    const billSerialNumber = _.sortBy(incomeBill, 'billSerialNumber')
      .map((incomeBill) => {
        return incomeBill.billSerialNumber;
      })
      .join('\n');

    const accountsReceivableDeductionArr = incomeBill.flatMap((bill) => bill.accountsReceivableDeduction ?? []);
    const accountsReceivableDeductionDict = accountsReceivableDeductionArr.reduce((target, deduction) => {
      const { itemName, detailedAmount } = deduction;
      !target[itemName] && (target[itemName] = 0);
      target[itemName] = new Decimal(target[itemName]).add(detailedAmount || 0).toNumber();

      return target;
    }, {} as { [key: string]: number });

    const accountsReceivableDeductionStr = Object.entries(accountsReceivableDeductionDict)
      .map(([key, item]) => {
        return `${key}: ${item.toLocaleString()}`;
      })
      .join('\n');

    const thisRow = sheet.addRow({
      insertDate: getTaiwanDateStr(insertDate),
      vendorName,
      accountingNumber,
      price,
      notes,
      noteNumber,
      noteMaturityDate: getTaiwanDateStr(noteMaturityDate),
      invoiceNumber: invoices?.[0]?.invoiceNumber,
      billSerialNumber,
      totalFee,
      totalDeduction,
      deductionDetail: accountsReceivableDeductionStr,
    });
    rowArr_data.push(thisRow);
  });

  // ---------------------------------------------------------------------------
  sheet.addRow({});
  row_totalPrice = sheet.addRow({
    accountingNumber: '收款金額總計',
    price: totalPrice,
  });

  // ---------------------------------------------------------------------------

  row_title.font = { size: 20, bold: true };
  row_subTitle.font = { size: 16, bold: true };
  row_caption.font = { bold: true };
  // __________________________________________________________________________
  // __________________________________________________________________________
  col_price.numFmt = '#,##0';
  col_totalFee.numFmt = '#,##0';
  col_totalDeduction.numFmt = '#,##0';
  // __________________________________________________________________________
  // __________________________________________________________________________
  rowArr_data.forEach((row) => {
    const cell_billSerialNumber = row.getCell(col_billSerialNumber.key!);
    cell_billSerialNumber.alignment = { wrapText: true };

    const cell_deductionDetail = row.getCell(col_deductionDetail.key!);
    cell_deductionDetail.alignment = { wrapText: true };
  });

  // ---------------------------------------------------------------------------
  await workbook.xlsx.writeBuffer();

  workbook.xlsx.writeBuffer().then((content) => {
    const link = document.createElement('a');
    const blobData = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });

    link.download = `${excelName}_${twYear}${month}.xlsx`;
    link.href = URL.createObjectURL(blobData);
    link.click();
    link.remove();
  });
};
