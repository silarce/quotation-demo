import { useMemo } from 'react';
import { useRouter } from 'next/router';
// import { nanoid } from 'nanoid';
import classNames from 'classnames';
import dayjs from 'dayjs';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import Row, { Cell } from 'components/global/gear/table/row';
// import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
// import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// utils
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';

import {
  Tparams,
  TaccountsReceivableInvoiceDto,
  useGetAccountReceivableInvoices_all,
  // useGetAccountReceivableInvoices_all_infinite
} from 'js/api/api_engineering';
import type { TinvoiceStatus } from 'js/api/dtoTypes';
import type { Toption } from 'js/utils/options/options';

// css
import scss from './index.module.scss';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import type { TmyPageProps } from 'pages/_app';

// =========================================================================

type Tquery = {
  year?: string;
  month?: string;
  keyword?: string | undefined;
  invoiceStatus?: string | undefined;
};

// ________________________________________________________________________
// ________________________________________________________________________

type Tkey =
  | keyof Pick<TaccountsReceivableInvoiceDto, 'invoiceDate' | 'invoiceNumber' | 'actualPrice' | 'invoiceStatus'>
  | 'tax'
  | 'total'
  | 'buyerTitle'
  | 'buyerTaxId';

type configItem = {
  label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  reducer?: (data: TaccountsReceivableInvoiceDto) => React.ReactNode;
};

type Tconfig = {
  [key in Tkey]: configItem;
};

// =========================================================================

// MARK: START
export default function InvoiceManagement(props?: TmyPageProps) {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth_options();

  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year = thisYear.toString(),
    month = thisMonth.toString(),
    keyword,
    invoiceStatus,
  } = query;

  // --------------------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      pageSIze: 99999,
      sort: 'invoiceDate',
      filter: {
        invoiceDate: {
          $gte: dayjs(`${year}-${month}`, 'YYYY-MM').startOf('month').toISOString(),
          $lte: dayjs(`${year}-${month}`, 'YYYY-MM').endOf('month').toISOString(),
        },

        $or: {
          invoiceNumber: {
            $eq: keyword,
          },
          actualPrice: {
            $eq: isNaN(Number(keyword)) ? undefined : keyword,
          },
          invoiceStatus: {
            $eq: checkInvoiceStatus(invoiceStatus),
          },
        },
      },
    };
  }, [year, month, keyword, invoiceStatus]);

  const { data: data_invoiceArr = [] } = useGetAccountReceivableInvoices_all({
    params,
    // autoUpdate: false,
  });

  // --------------------------------------------------------------------------

  // region PROPS

  const totals = useMemo(() => {
    const total_actualPrice = data_invoiceArr.reduce((acc, data) => acc + data.actualPrice, 0);
    // const total_actualPrice = fakeInvoiceArr.reduce((acc, data) => acc + data.actualPrice, 0);

    return {
      actualPrice: total_actualPrice.toLocaleString(),
      tax: '0',
      total: '0',
    };
  }, [data_invoiceArr]);

  const selectPropsArr = useYearMonth_selectBar_query({
    year: year,
    month: month,
    yearOptionArr,
    monthOptionArr,
  });

  const searchGroup: TsearchGroup = {
    searchTargetList: [
      {
        options: [
          {
            value: '已開立',
            label: '已開立',
          },
          {
            value: '已作廢',
            label: '已作廢',
          },
        ],
        defaultValue: invoiceStatus ?? '',
        placeholder: '發票狀態',
        width: '100px',
      },
      {
        defaultValue: keyword,
        placeholder: '請輸入關鍵字',
        width: '200px',
      },
    ],
    doSearch: (arr) => {
      const invoiceStatus = arr[0] as Toption;
      const keyword = arr[1] as string;
      router.replace({
        query: {
          ...query,
          keyword,
          invoiceStatus: invoiceStatus.value,
        },
      });
    },
  };

  const penalList_disabled: TpanelList = [
    { searchGroup },
    // {
    //   type: 'myButton',
    //   label: '編輯',
    //   onClick: () => setDisabled(false),
    // },
  ];

  const panelList = penalList_disabled;

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // region RENDER

  return (
    <SubLayer>
      <PageHeader02
        tag="開立發票管理"
        customeLeft={[<SelectBar key="selectBar" className="ml-10" selectPropsArr={selectPropsArr} />]}
        panelList={panelList}
      />

      <div className={scss.table}>
        <MyRow className={classNames(scss.thead)} thead={true}>
          {keyArr.map((key) => {
            const { label, style, className } = config[key];

            return (
              <Cell key={key} style={style} className={className}>
                {label}
              </Cell>
            );
          })}
        </MyRow>

        {data_invoiceArr.map((data) => {
          const list = {
            invoiceDate: data.invoiceDate,
            invoiceNumber: data.invoiceNumber,
            actualPrice: data.actualPrice,
            invoiceStatus: data.invoiceStatus,
            tax: '',
            total: '',
            buyerTitle: '',
            buyerTaxId: '',
          } as const;

          return (
            <MyRow key={data.id}>
              {keyArr.map((key) => {
                const { style, className, reducer } = config[key];

                let value: React.ReactNode = list[key];

                if (reducer) {
                  value = reducer(data);
                }

                return (
                  <Cell key={key} style={style} className={className}>
                    {value}
                  </Cell>
                );
              })}
            </MyRow>
          );
        })}

        <MyRow className={scss.bottomRow}>
          <Cell style={config[keyArr[0]].style} bgc="gray"></Cell>
          <Cell style={config[keyArr[1]].style} bgc="gray" className="border-r border-l">
            總計
          </Cell>
          <Cell style={config[keyArr[2]].style} className="border-r">
            {totals.actualPrice}
          </Cell>
          <Cell style={config[keyArr[3]].style} className="border-r">
            {totals.tax}
          </Cell>
          <Cell style={config[keyArr[4]].style} className="border-r">
            {totals.total}
          </Cell>
        </MyRow>
      </div>
    </SubLayer>
  );
}
// MARK: END

// =========================================================================

const MyRow = (props: Parameters<typeof Row>[0]) => {
  return (
    <Row fullWidth={true} style={{ gap: 0 }} {...props}>
      {props.children}
    </Row>
  );
};

// =========================================================================

// region CONFIG

const keyArr: readonly Tkey[] = [
  //
  'invoiceDate',
  'invoiceNumber',

  'actualPrice',
  'tax',
  'total',
  'buyerTitle',
  'buyerTaxId',

  'invoiceStatus',
];

const config: Tconfig = {
  invoiceDate: {
    label: '開立日期',
    style: { width: 120 },
    reducer: (data) => {
      const invoiceDate = data.invoiceDate;

      return getTaiwanDateStr(invoiceDate);
    },
  },
  invoiceNumber: {
    label: '發票號碼',
    style: { width: 150 },
  },
  actualPrice: {
    label: '銷售額',
    style: { width: 120 },
  },
  invoiceStatus: {
    label: '狀態',
    style: { width: 120 },
  },
  tax: {
    label: '營業稅',
    style: { width: 120 },
  },
  total: {
    label: '總計',
    style: { width: 120 },
  },
  buyerTitle: {
    label: '買受人抬頭',
    style: { width: 120 },
  },
  buyerTaxId: {
    label: '買受人統一編號',
    style: { width: 120 },
  },
};

// endregion CONFIG

// =========================================================================

const checkInvoiceStatus = (value: string | undefined) => {
  const statusArr: TinvoiceStatus[] = ['已開立', '已作廢'];

  const isPass = statusArr.includes(value as TinvoiceStatus);

  return isPass ? value : undefined;
};
