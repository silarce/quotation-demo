import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// antd
import { Spin } from 'antd';

// gear
import Row, { Cell } from 'components/global/gear/table/row';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// utils
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import scss from './index.module.scss';

// api
import {
  Tparams,
  TcreateAccountantDto,
  TupdateAccountantDto,
  TupdateAccountReceivableDeductionDto,
  TaccountantDto,
  TaccountantExchangeFromDto,
  //
  apiPostAccountant,
  apiPatchAccountant,
  deleteAccountant,
  apiPatchAccountant_accountReceivable,
  //
  useGetAccountant,
  useGetAccountantPreset,
} from 'js/api/api_accountant';
import { set } from 'lodash';

// ============================================================================

type Tquery = {
  year: string;
  month: string;
  keyword: string;
};

// ============================================================================

// MARK:START

export default function BillCashingDetailList() {
  const { thisYear, thisMonth, yearOptionArr, monthOptionArr } = useYearMonth_options();

  const router = useRouter();
  const query = router.query as Tquery;
  const { year = thisYear.toString(), month = thisMonth.toString() } = query;
  const keyword = query.keyword || undefined;

  // --------------------------------------------------------------------------

  const [selectedAccountantArr, setSelectedAccountantArr] = useState<TaccountantDto[]>([]);

  // --------------------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      populate: [
        //
        // 'incomeBill',
        // 'invoices',
        'exchangeFrom',
      ],
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
          // {
          //   vendorName: {
          //     $contains: keyword,
          //   },
          // },
        ],
      },
    };
  }, [year, month, keyword]);

  const { data: data_accountantArr = [] } = useGetAccountant({ params });

  // --------------------------------------------------------------------------
  // MARK: FUNCTION

  const handle_check = (accountantId: string) => {
    return selectedAccountantArr?.some((item) => item.id === accountantId);
  };

  const handle_onCheck = (accountant: TaccountantDto, checked: boolean) => {
    setSelectedAccountantArr((prev) => {
      if (checked) {
        return [...prev, accountant];
      } else {
        return prev.filter((item) => item !== accountant);
      }
    });
  };

  // --------------------------------------------------------------------------

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
      type: 'myButton',
      label: '匯出',
      onClick: () => {},
    },
  ];
  // --------------------------------------------------------------------------

  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag="票據兌現明細表"
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
      <div>
        <div className={scss.table}>
          <Row thead={true} fullWidth={true}>
            <Cell style={config.selectBox.style} />
            {keyArr.map((key) => {
              const { label, style } = config[key];

              return (
                <Cell key={key} style={style}>
                  {label}
                </Cell>
              );
            })}

            <Cell style={config.receiptCashedDate.style}>{config.receiptCashedDate.label}</Cell>
          </Row>

          {data_accountantArr.map((data) => {
            return (
              <Accountant
                key={data.id}
                data_accountant={data}
                isChecked={handle_check(data.id)}
                onCheck={(isChecked) => {
                  handle_onCheck(data, isChecked);
                }}
              />
            );
          })}
        </div>
      </div>
    </SubLayer>
  );
}

// MARK:END
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// MARK: COMPONENTS

const Accountant = ({
  data_accountant,
  isChecked,
  onCheck,
}: {
  data_accountant: TaccountantDto;
  isChecked: boolean;
  onCheck: (isChecked: boolean) => void;
}) => {
  const [state_receiptCashedDate, setState_receiptCashedDate] = useState<Moment | null>(null);

  const {
    receiptStatus,
    noteNumber,
    importAccountingNumber,
    vendorName,
    noteMaturityDate,
    price,
    accountingNumber,
    receiptEstimatedDate,
    receiptCashedDate,

    exchangeFrom,
  } = data_accountant;

  const { sheetNumber = '' } = exchangeFrom ?? {};

  const list: { [key in Tkey]: React.ReactNode } = {
    receiptStatus,
    sheetNumber,
    noteNumber,
    importAccountingNumber,
    vendorName,
    noteMaturityDate: getTaiwanDateStr(noteMaturityDate),
    price,
    accountingNumber,
    receiptEstimatedDate: getTaiwanDateStr(receiptEstimatedDate),
  };

  useEffect(() => {
    const state = receiptCashedDate ? moment(receiptCashedDate) : null;
    setState_receiptCashedDate(state);
  }, [data_accountant]);

  return (
    <Row fullWidth={true} className={scss.row}>
      <Cell style={config.selectBox.style}>
        <input
          className={'cursor-pointer scale-150'}
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheck(e.target.checked)}
        />
      </Cell>
      {keyArr.map((key) => {
        const { style } = config[key];

        return (
          <Cell key={key} style={style}>
            {list[key]}
          </Cell>
        );
      })}
      <Cell style={config.receiptCashedDate.style}>
        <Spin spinning={false}>
          <InputSel
            datePickerProps={{
              props: {
                value: state_receiptCashedDate,
                onChange: (m) => {
                  setState_receiptCashedDate(m);
                },
              },
            }}
          />
        </Spin>
      </Cell>
    </Row>
  );
};

// ============================================================================
// MARK: CONFIG

// type Tkey = Extract<keyof TaccountantDto, 'aaaa'>;
type Tkey =
  | keyof Pick<
      TaccountantDto,
      | 'receiptStatus'
      | 'noteNumber'
      | 'importAccountingNumber'
      | 'vendorName'
      | 'noteMaturityDate'
      | 'price'
      | 'accountingNumber'
      | 'receiptEstimatedDate'
    >
  | keyof Pick<TaccountantExchangeFromDto, 'sheetNumber'>;

const keyArr: Tkey[] = [
  'receiptStatus',
  'sheetNumber',
  'noteNumber',
  'importAccountingNumber',
  'vendorName',
  'noteMaturityDate',
  'price',
  'accountingNumber',
  'receiptEstimatedDate',
] as const;

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
  className?: string;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
};

type Tconfig = {
  [key in Tkey | 'selectBox' | 'receiptCashedDate']: TconfigItem;
};

const config: Tconfig = {
  selectBox: {
    label: '',
    style: {
      width: '50px',
    },
  },
  receiptStatus: {
    label: '狀態',
    style: {
      width: '60px',
    },
  },
  sheetNumber: {
    label: '匯兌單號',
    style: {
      width: '80px',
    },
  },
  noteNumber: {
    label: '票據號碼',
    style: {
      width: '120px',
    },
  },
  importAccountingNumber: {
    label: '付款帳號',
    style: {
      width: '120px',
    },
  },
  vendorName: {
    label: '廠商名稱',
    style: {
      width: '200px',
    },
  },
  noteMaturityDate: {
    label: '票據到期日',
    style: {
      width: '110px',
    },
  },
  price: {
    label: '金額',
    style: {
      width: '90px',
    },
  },
  accountingNumber: {
    label: '存入帳號',
    style: {
      width: '200px',
    },
  },
  receiptEstimatedDate: {
    label: '預兌日',
    style: {
      width: '110px',
    },
  },
  receiptCashedDate: {
    label: '兌現日',
    style: {
      width: '110px',
    },
  },
};
