import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
// import { nanoid } from 'nanoid';
import classNames from 'classnames';

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

// css
import scss from './index.module.scss';

// =========================================================================

type Tquery = {
  year: string;
  month: string;
  keyword: string;
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
};

type Tconfig = {
  [key in Tkey]: configItem;
};

// =========================================================================

// MARK: START
export default function InvoiceManagement() {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth_options();

  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year = thisYear.toString(),
    month = thisMonth.toString(),
    keyword,
  } = query;

  // --------------------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      pageSIze: 99999,
      sort: 'invoiceDate',
      filter: {
        year: {
          $eq: year,
        },
        month: {
          $eq: month,
        },
        $or: {
          invoiceNumber: {
            $eq: keyword,
          },
          actualPrice: {
            $eq: keyword,
          },
          invoiceStatus: {
            $eq: keyword,
          },
        },
      },
    };
  }, [year, month, keyword]);

  const { data: data_invoiceArr = [] } = useGetAccountReceivableInvoices_all({
    params,
    autoUpdate: false,
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
        defaultValue: keyword,
        placeholder: '請輸入關鍵字',
        width: '200px',
      },
    ],
    doSearch: (arr) => {
      const keyword = arr[0] as string;
      router.replace({
        query: {
          ...query,
          keyword,
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
                const { style, className } = config[key];

                return (
                  <Cell key={key} style={style} className={className}>
                    {list[key]}
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
// region FAKE

// const fakeInvoiceArr: TaccountsReceivableInvoiceDto[] = Array.from({ length: 100 }, (_, i) => {
//   const invoiceDate = `2021-09-${i.toString().padStart(2, '0')}`; // 生成日期，從2021-09-01開始
//   const invoiceNumber = `A${(1001 + i).toString().padStart(4, '0')}`; // 生成發票號碼，從A1001開始
//   const actualPrice = 1000 + i * 10; // 每個發票的實際價格增加10
//   const invoiceStatus = i % 2 === 0 ? '已開立' : '已作廢'; // 交替設置發票狀態

//   return {
//     id: nanoid(),
//     createdAt: '2021-09-01',
//     updatedAt: '2021-09-01',
//     invoiceDate,
//     invoiceNumber,
//     actualPrice,
//     invoiceStatus,
//     note: '備註',
//     accountsReceivablePeriodId: '1',
//     allowance: 0,
//   };
// });
