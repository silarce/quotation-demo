import { useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import classNames from 'classnames';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import Row, { Cell } from 'components/global/gear/table/row';

// utils
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// api
import {
  Tparams,
  TcreateAccountantDto,
  TupdateAccountantDto,
  TupdateAccountReceivableDeductionDto,
  //
  apiPostAccountant,
  apiPatchAccountant,
  deleteAccountant,

  //
  useGetAccountant,
  useGetAccountantPreset,
} from 'js/api/api_accountant';

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
      populate: ['incomeBill', 'invoices'],
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

  const total = data_accountant.reduce((acc, curr) => acc + curr.price || 0, 0).toLocaleString();

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
            billSerialNumber,

            // incomeBill,
            invoices,
          } = accountant;

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
            billSerialNumber,
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

type Tkey =
  | 'insertDate'
  | 'vendorName'
  | 'importAccountingNumber'
  | 'price'
  | 'notes'
  | 'noteNumber'
  | 'noteMaturityDate'
  | 'invoiceNumber'
  | 'billSerialNumber';

const keyArr: Tkey[] = [
  'insertDate',
  'vendorName',
  'importAccountingNumber',
  'price',
  'notes',
  'noteNumber',
  'noteMaturityDate',
  'invoiceNumber',
  'billSerialNumber',
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
    style: { width: 160, textAlign: 'right' },
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
};
