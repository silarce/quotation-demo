import { useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

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
import { apiGetAccountReceivable_id } from 'js/api/api_engineering';
import { TapiError } from 'js/api/api_engineering';
import { AxiosError } from 'axios';

// css
import scss from './index.module.scss';

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
            importAccountingNumber: {
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

  const panelList: TpanelList = [{ searchGroup }];
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
            importAccountingNumber,
            price,
            notes,
            noteNumber,
            noteMaturityDate,
            // invoiceNumber,
            // billSerialNumber,

            incomeBill,
            invoices,
          } = accountant;

          const { totalFee, totalDeduction } = incomeBill.reduce(
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
            importAccountingNumber,
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
          <Cell preBuilt="block" className={scss.totalCell} style={config.importAccountingNumber.style}>
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

// =============================================================================

type Tkey =
  | 'insertDate'
  | 'vendorName'
  | 'importAccountingNumber'
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
  'importAccountingNumber',
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
  importAccountingNumber: {
    label: '銀行帳號',
    style: { width: 120 },
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
