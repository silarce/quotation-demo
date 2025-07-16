import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import dayjs, { Dayjs } from 'dayjs';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// antd
import { Spin } from 'antd';

// gear
import Row_, { Cell, Tprops_row } from 'components/global/gear/table/row';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// utils
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

import scss from './index.module.scss';

// api
import {
  Tparams,
  TupdateAccountantDto,
  TaccountantDto,
  TaccountantExchangeFromDto,
  TcreateAccountantExchangeFromDto,
  //
  apiPatchAccountant,
  apiPostAccountantExchangeFrom,
  //
  useGetAccountant,
} from 'js/api/api_accountant';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// ============================================================================

type Tquery = {
  year: `${number}` | '' | undefined;
  month: `${number}` | '' | undefined;
  keyword: string;
};

type TreqPatchReceiptCashedDate = (
  accountantId: string,
  receiptCashedDate: string | null
) => Promise<TupdateAccountantDto>;

// ============================================================================

const Row = ({ className, ...props }: Tprops_row) => {
  return <Row_ {...props} className={classNames(scss.row, className)} />;
};

// ============================================================================

// MARK:START

export default function BillCashingDetailList() {
  const { thisYear, thisMonth, yearOptionArr, monthOptionArr } = useYearMonth_options({
    emptyYearOption: true,
    emptyMonthOption: true,
  });

  const router = useRouter();
  const query = router.query as Tquery;
  const { year = thisYear.toString(), month = thisMonth.toString() } = query;
  const keyword = query.keyword || undefined;

  // --------------------------------------------------------------------------

  const [selectedAccountantIdArr, setSelectedAccountantIdArr] = useState<string[]>([]);

  // --------------------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    const [insertDateGte, insertDateLte] = year
      ? [
          dayjs()
            .year(Number(year))
            .month(Number(month || 1) - 1)
            .startOf('month')
            .toISOString(),
          dayjs()
            .year(Number(year))
            .month(Number(month || 12) - 1)
            .endOf('month')
            .toISOString(),
        ]
      : [];

    const params: Tparams = {
      sort: 'exchangeFrom.sheetNumber',
      pageSize: 999999,
      populate: [
        // 'incomeBill',
        // 'invoices',
        'exchangeFrom',
      ],
      filter: {
        paymentType: {
          $eq: '票據',
        },
        insertDate: {
          $gte: insertDateGte,
          $lte: insertDateLte,
        },
        $or: [
          {
            'exchangeFrom.sheetNumber': {
              $eq: keyword,
            },
          },
          {
            noteNumber: {
              $eq: keyword,
            },
          },
          {
            importAccountingNumber: {
              $contains: keyword,
            },
          },
          {
            vendorName: {
              $contains: keyword,
            },
          },
          {
            price: {
              // $eq: keyword,
              $eq: isNaN(Number(keyword)) ? undefined : keyword,
            },
          },
          {
            accountingNumber: {
              $contains: keyword,
            },
          },
        ],
      },
    };

    return params;
  }, [year, month, keyword]);

  const { data: data_accountantArr = [], dataList, update: update_accountant } = useGetAccountant({ params });

  const selectedAccountantArr = useMemo(() => {
    const arr = selectedAccountantIdArr.map((id) => {
      return dataList[id];
    });

    return arr;
  }, [selectedAccountantIdArr, dataList]);

  // --------------------------------------------------------------------------

  // MARK: REQUEST

  const reqPostExchangeFrom = async (accountantIdArr: string[]) => {
    const body: TcreateAccountantExchangeFromDto = {
      accountantId: accountantIdArr,
    };

    try {
      await apiPostAccountantExchangeFrom(body);
      await update_accountant();
    } catch (err) {}
  };

  const reqPatchReceiptCashedDate: TreqPatchReceiptCashedDate = async (accountantId, receiptCashedDate) => {
    const body: TupdateAccountantDto = { receiptCashedDate: receiptCashedDate || null };
    const res = await apiPatchAccountant(accountantId, { body });
    update_accountant();

    return res;
  };

  // MARK: FUNCTION

  const handle_check = (accountantId: string) => {
    return selectedAccountantIdArr?.some((id) => id === accountantId);
  };

  const handle_onCheck = (accountantId: string, checked: boolean) => {
    setSelectedAccountantIdArr((prev) => {
      if (checked) {
        return [...prev, accountantId];
      } else {
        return prev.filter((item) => item !== accountantId);
      }
    });
  };

  const handle_onExchange = async () => {
    if (selectedAccountantIdArr.length === 0) {
      return;
    }

    const onOk = async () => {
      await reqPostExchangeFrom(selectedAccountantIdArr);
      setSelectedAccountantIdArr([]);
    };

    const modal = myAlert.confirm({});
    modal.update({
      width: 'fit-content',
      title: '請確認要匯出的票據',
      content: <NoteTable accountantArr={selectedAccountantArr} />,
      onOk,
    });
  };
  // --------------------------------------------------------------------------

  // MARK:PROPS

  const total = useMemo(() => {
    return data_accountantArr
      .reduce((acc, item) => {
        return acc + item.price || 0;
      }, 0)
      .toLocaleString();
  }, [data_accountantArr]);

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
      onClick: handle_onExchange,
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

      <div className={scss.table}>
        <Row className={scss.thead} thead={true} fullWidth={true}>
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
                handle_onCheck(data.id, isChecked);
              }}
              reqPatchReceiptCashedDate={reqPatchReceiptCashedDate}
            />
          );
        })}

        {/*  */}
        {/*  */}

        <Row className={scss.bottom} fullWidth={true} thead={true}>
          <Cell style={config.selectBox.style} />
          {keyArr.slice(0, 5).map((key) => {
            return <Cell key={key} style={config[key].style} />;
          })}
          <Cell style={config['noteMaturityDate'].style}>總計</Cell>
          <Cell style={config['price'].style}>{total}</Cell>
        </Row>
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
  reqPatchReceiptCashedDate,
}: {
  data_accountant: TaccountantDto;
  isChecked: boolean;
  onCheck: (isChecked: boolean) => void;
  reqPatchReceiptCashedDate: TreqPatchReceiptCashedDate;
}) => {
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(false);
  const [state_receiptCashedDate, setState_receiptCashedDate] = useState<Dayjs | null>(null);

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

  // -------------------------------------------------------------

  const handle_onReceiptCashedDateChange = async (m: Dayjs | null) => {
    const oldDate = state_receiptCashedDate;

    setIsFetching(true);
    setState_receiptCashedDate(m);
    await reqPatchReceiptCashedDate(data_accountant.id, m?.toISOString() || null)
      .then((res) => {
        if ('receiptCashedDate' in res) {
          setState_receiptCashedDate(res.receiptCashedDate ? dayjs(res.receiptCashedDate) : null);
        } else {
          throw new Error('回應沒有receiptCashedDate');
        }
      })
      .catch(() => {
        setState_receiptCashedDate(oldDate);
      });

    setIsFetching(false);
  };

  const handle_onDetailClick = () => {
    if (!exchangeFrom) {
      return;
    }

    router.push({
      pathname: router.pathname + '/exchangedBill',
      query: {
        id: exchangeFrom.id,
      },
    });
  };

  // -------------------------------------------------------------
  const list: { [key in Tkey]?: React.ReactNode } = {
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
    const state = receiptCashedDate ? dayjs(receiptCashedDate) : null;
    setState_receiptCashedDate(state);
  }, [data_accountant]);

  return (
    <Row fullWidth={true}>
      <Cell className={classNames(sheetNumber && 'invisible')} style={config.selectBox.style}>
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
            {key === 'sheetNumber' && list[key] && (
              //
              <IconDetail className="ml-1" onClick={handle_onDetailClick} />
            )}
          </Cell>
        );
      })}
      <Cell style={config.receiptCashedDate.style}>
        <Spin spinning={isFetching}>
          <InputSel
            disabled={!!sheetNumber}
            showBaseline="auto"
            datePickerProps={{
              props: {
                value: state_receiptCashedDate || null,
                onChange: handle_onReceiptCashedDateChange,
              },
            }}
          />
        </Spin>
      </Cell>
    </Row>
  );
};

const NoteTable = ({ accountantArr }: { accountantArr: TaccountantDto[] }) => {
  return (
    <div className={classNames(scss.table, 'mt-5')}>
      <Row thead={true} fullWidth={true}>
        <Cell style={config.selectBox.style} />
        {keyArr_simple.map((key) => {
          const { label, style } = config[key];

          return (
            <Cell key={key} style={style}>
              {label}
            </Cell>
          );
        })}
      </Row>

      {accountantArr.map((data) => {
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
        } = data;

        const { sheetNumber = '' } = exchangeFrom ?? {};

        const list: { [key in Tkey]?: React.ReactNode } = {
          receiptStatus,
          sheetNumber,
          noteNumber,
          importAccountingNumber,
          vendorName,
          noteMaturityDate: getTaiwanDateStr(noteMaturityDate),
          price,
          accountingNumber,
          receiptEstimatedDate: getTaiwanDateStr(receiptEstimatedDate),
          receiptCashedDate: getTaiwanDateStr(receiptCashedDate),
        };

        return (
          <Row key={data.id} fullWidth={true}>
            <Cell style={config.selectBox.style} />
            {keyArr_simple.map((key) => {
              const { label, style } = config[key];

              return (
                <Cell key={key} style={style}>
                  {list[key]}
                </Cell>
              );
            })}
          </Row>
        );
      })}
    </div>
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
      | 'receiptCashedDate'
    >
  | keyof Pick<TaccountantExchangeFromDto, 'sheetNumber'>;

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
];

const keyArr_simple: Tkey[] = [
  'noteNumber',
  'importAccountingNumber',
  'vendorName',
  'noteMaturityDate',
  'price',
  'accountingNumber',
  'receiptEstimatedDate',
  'receiptCashedDate',
];

const config: Tconfig = {
  selectBox: {
    label: '',
    style: {
      width: '60px',
    },
  },
  receiptStatus: {
    label: '狀態',
    style: {
      width: '70px',
    },
  },
  sheetNumber: {
    label: '匯兌單號',
    style: {
      width: '110px',
    },
  },
  noteNumber: {
    label: '票據號碼',
    style: {
      width: '130px',
    },
  },
  importAccountingNumber: {
    label: '付款帳號',
    style: {
      width: '130px',
    },
  },
  vendorName: {
    label: '廠商名稱',
    style: {
      width: '210px',
    },
  },
  noteMaturityDate: {
    label: '票據到期日',
    style: {
      width: '120px',
    },
  },
  price: {
    label: '金額',
    style: {
      width: '130px',
    },
  },
  accountingNumber: {
    label: '存入帳號',
    style: {
      width: '210px',
    },
  },
  receiptEstimatedDate: {
    label: '預兌日',
    style: {
      width: '120px',
    },
  },
  receiptCashedDate: {
    label: '兌現日',
    style: {
      width: '120px',
    },
  },
};
