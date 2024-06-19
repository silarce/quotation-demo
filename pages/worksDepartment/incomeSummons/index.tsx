import { useState, useMemo, useEffect, forwardRef } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import moment from 'moment';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
// import Table01, { Ttable, Tcell, Tconfig_table } from 'components/global/gear/table/table01';
import SelectBar from 'components/global/gear/select/selectBar/selectBar';

// icon
import { IconCheck02, IconEdit } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './index.module.scss';

// type
import type { TincomeBillSerialDto } from 'js/api/dtoTypes';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// api
import {
  TupdateIncomeBillSerialDto,
  useGetAccountReceivableIncomeBills,
  apiPatchIncomeBill,
} from 'js/api/api_engineering';

// ==============================================================================

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tquery = {
  isForeign: 'true' | 'false';
  year: string;
  month: string;
};

type Tstate_incomeBillSerial = {
  billSerialNumber: string;
  receiveDate: string;
  contractNumber: string;
  projectName: string;
  contractPayment: string;
  periodPayment: string;
  priorPeriodPayment: string;
  importAccountingNumber: string;
  noteNumber: string;
  noteMaturityDate: string;
  receivablePayment: string;
  deductionPayment: string;
  unpaidPayment: string;
};

// ==============================================================================

// MARK:START

export default function IncomeSummons() {
  const timeNow = new Date();
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth();

  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    isForeign = 'false',
    year = String(thisYear),
    month = String(thisMonth),
  } = query;

  // -----------------------------------------------------------------------------

  const customParams = {
    filter: {
      isForeign: {
        $eq: isForeign === 'true',
      },
      receiveDate: {
        $gte: moment(`${year}-${month}`).startOf('month').toISOString(),
        $lte: moment(`${year}-${month}`).endOf('month').toISOString(),
      },
    },
  };

  const { dataArr, viewRef_bottom, isLoadingPage1, isLoading, reset } = useGetAccountReceivableIncomeBills({
    customParams,
  });

  // -----------------------------------------------------------------------------

  // MARK: PROPS

  const tagList: TtagList = [
    {
      label: '收入傳票(內銷)',
      onClick: () => {
        router.replace({
          query: {
            ...query,
            isForeign: 'false',
          },
        });
      },
      isActive: isForeign === 'false',
    },
    {
      label: '收入傳票(外銷)',
      onClick: () => {
        router.replace({
          query: {
            ...query,
            isForeign: 'true',
          },
        });
      },
      isActive: isForeign === 'true',
    },
  ];

  const selectPropsArr = useMemo(() => {
    return [
      {
        selectProps: {
          value: year,
          options: yearOptionArr,
          onChange: (option) => {
            if (typeof option?.value === 'string') {
              router.replace({
                query: {
                  ...query,
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
                  ...query,
                  month: option.value,
                },
              });
            }
          },
        },
        placeholder: '選擇月份',
        boxStyle: { width: '140px' },
      },
    ] as TselectPropsArr;
  }, [year, month, yearOptionArr, monthOptionArr]);

  // -----------------------------------------------------------------------------
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isForeign, year, month]);

  // -----------------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tagList={tagList}
        customeLeft={[<SelectBar key="selectBar" className={'ml-5'} selectPropsArr={selectPropsArr} />]}
      />
      <div className={scss.main}>
        <div className={scss.tableWrapper}>
          <div className={scss.table}>
            <Row className={scss.thead}>
              <div style={config.btnPanel.style}></div>
              {keyArr.map((key) => {
                const { label, style, className } = config[key];

                return (
                  <div key={key} style={style} className={className}>
                    {label}
                  </div>
                );
              })}
            </Row>

            {dataArr.map((data, index) => {
              const ref = index === dataArr.length - 5 ? viewRef_bottom : undefined;

              return <Summons ref={ref} key={data.id} incomeBillSerial={data} />;
            })}
          </div>
        </div>
        {/*  */}
      </div>
    </SubLayer>
  );
}

// MARK: END

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// MARK: COMPONENT

const Row_pre = (
  {
    //
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <div ref={ref} className={classNames(scss.row, className)}>
      {children}
    </div>
  );
};

const Row = forwardRef(Row_pre);

const Summons_pre = (
  {
    //
    incomeBillSerial,
  }: {
    incomeBillSerial: TincomeBillSerialDto;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  const [defaultData, setDefaultData] = useState<TincomeBillSerialDto>(incomeBillSerial);
  const [state_incomeBillSerial, setState_incomeBillSerial] = useState<TincomeBillSerialDto>(defaultData);

  const [isFetching, setIsFetching] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // ---------------------------------------------------------------------
  const handle_onChange = (
    //
    key: 'contractPayment' | 'periodPayment' | 'priorPeriodPayment',
    str: string
  ) => {
    const num = Number(str);

    if (isNaN(num) || isFetching) {
      return;
    }

    setState_incomeBillSerial((prev) => {
      return {
        ...prev,
        [key]: num,
      };
    });
  };

  const reqPatch = async () => {
    const body: TupdateIncomeBillSerialDto = {
      receiveDate: state_incomeBillSerial.receiveDate,
      contractNumber: state_incomeBillSerial.contractNumber,
      projectName: state_incomeBillSerial.projectName,
      contractPayment: state_incomeBillSerial.contractPayment,
      periodPayment: state_incomeBillSerial.periodPayment,
      priorPeriodPayment: state_incomeBillSerial.priorPeriodPayment,
      importAccountingNumber: state_incomeBillSerial.importAccountingNumber,
      noteNumber: state_incomeBillSerial.noteNumber,
      noteMaturityDate: state_incomeBillSerial.noteMaturityDate,
      receivablePayment: state_incomeBillSerial.receivablePayment,
      deductionPayment: state_incomeBillSerial.deductionPayment,
      unpaidPayment: state_incomeBillSerial.unpaidPayment,
    };

    setIsFetching(true);
    await apiPatchIncomeBill(incomeBillSerial.id, body).then((res) => {
      if (res) {
        setDefaultData(res);
        setDisabled(true);
      } else {
        alert('非預期回應void，請與工程師聯繫');
      }
    });
    setIsFetching(false);
  };

  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------

  useEffect(() => {
    setState_incomeBillSerial(defaultData);
  }, [defaultData, disabled]);

  useEffect(() => {
    setDefaultData(incomeBillSerial);
  }, [incomeBillSerial]);

  // ---------------------------------------------------------------------

  return (
    <Row ref={ref} className={classNames(scss.tbody, !disabled && scss.enabled)}>
      <div className={scss.btnPanel} style={config.btnPanel.style}>
        <IconEdit className={classNames(!disabled && scss.enable)} onClick={() => setDisabled((state) => !state)} />
        <IconCheck02 className={classNames(disabled && 'invisible')} onClick={reqPatch} />
      </div>

      {keyArr.map((key) => {
        const { style, className, createInputAttr } = config[key];

        const { attr_input, attr_span } = createInputAttr({
          disabled,
          state_incomeBillSerial,
          handle_onChange,
        });

        if (attr_span) {
          return (
            <div key={key} style={style} className={className}>
              <span
                //
                {...attr_span}
                className={classNames(attr_span.className, scss.readOnly)}
              >
                {attr_span.node}
              </span>
            </div>
          );
        }

        if (attr_input) {
          return (
            <div key={key} style={style} className={className}>
              <input
                //
                {...attr_input}
                className={classNames(
                  attr_input?.className
                  //  isReadOnly && scss.readOnly
                )}
              />
            </div>
          );
        }
      })}
    </Row>
  );
};

// forwardRef
const Summons = forwardRef(Summons_pre);

// ==============================================================================

// MARK: HOOK

const useYearMonth = () => {
  const m_today = moment();
  const thisYear = m_today.year();
  const thisMonth = m_today.month() + 1;

  const yearOptionArr = useMemo(() => {
    const yearOptionArr = Array.from({ length: 20 }, (_, i) => {
      const year = thisYear - i;
      const year_tw = year - 1911;

      return { label: year_tw.toString(), value: year.toString() };
    });

    return yearOptionArr;
  }, [thisYear]);

  const monthOptionArr = useMemo(() => {
    const monthOptionArr = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;

      return { label: month.toString(), value: month.toString() };
    });

    return monthOptionArr;
  }, []);

  return {
    yearOptionArr,
    monthOptionArr,
    thisYear,
    thisMonth,
  };
};

// ==============================================================================

// MARK: config

type TconfigKey = keyof Omit<TincomeBillSerialDto, 'id' | 'createdAt' | 'updatedAt' | 'isForeign'>;

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
  className?: string;
  // createInputAttr: (props: {
  //   disabled: boolean;
  //   state_incomeBillSerial: TincomeBillSerialDto;
  //   handle_onChange: (key: 'contractPayment' | 'periodPayment' | 'priorPeriodPayment', str: string) => void;
  // }) => React.InputHTMLAttributes<HTMLInputElement> | void;
  createInputAttr: (props: {
    disabled: boolean;
    state_incomeBillSerial: TincomeBillSerialDto;
    handle_onChange: (key: 'contractPayment' | 'periodPayment' | 'priorPeriodPayment', str: string) => void;
  }) => {
    attr_input?: React.InputHTMLAttributes<HTMLInputElement>;
    attr_span?: React.HTMLAttributes<HTMLSpanElement> & { node: React.ReactNode };
  };
};

type Tconfig = {
  [key in TconfigKey]: TconfigItem;
} & {
  btnPanel: TconfigItem;
};

const keyArr: TconfigKey[] = [
  'billSerialNumber',
  // 'invoiceType',
  'receiveDate',
  'contractNumber',
  'projectName',
  'contractPayment',
  'periodPayment',
  'priorPeriodPayment',
  'importAccountingNumber',
  'noteNumber',
  'noteMaturityDate',
  'receivablePayment',
  'deductionPayment',
  'unpaidPayment',
  'difference',
];

const config: Tconfig = {
  btnPanel: {
    label: '',
    style: { width: 80 },
    createInputAttr: () => ({}),
  },

  billSerialNumber: {
    label: '收入傳票序號',
    style: { width: 150 },
    className: scss.billSerialNumber,
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: state_incomeBillSerial.billSerialNumber,
        className: 'text-center',
      },
    }),
  },
  // invoiceType: {
  //   label: '發票類別',
  //   style: { width: 80 },
  // },
  receiveDate: {
    label: '日期',
    style: { width: 80 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: getTaiwanDateStr(state_incomeBillSerial.receiveDate) ?? '',
        className: 'text-center',
      },
    }),
  },
  contractNumber: {
    label: '合約編號',
    style: { width: 100 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: state_incomeBillSerial.contractNumber ?? '',
        className: 'text-center',
      },
    }),
  },
  projectName: {
    label: '工程名稱',
    style: {
      // flex: '1',
      width: 200,
    },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: state_incomeBillSerial.projectName ?? '',
        className: 'text-center',
      },
    }),
  },
  contractPayment: {
    label: '承攬價',
    style: { width: 100 },
    createInputAttr: ({ disabled, state_incomeBillSerial, handle_onChange }) => {
      const type = disabled ? 'text' : 'number';
      const value =
        (disabled
          ? state_incomeBillSerial.contractPayment?.toLocaleString()
          : state_incomeBillSerial.contractPayment) ?? '';
      const readOnly = disabled ? true : false;
      // const className = classNames('text-right', readOnly && scss.readOnly);

      return {
        attr_input: {
          type,
          value,
          readOnly,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            handle_onChange('contractPayment', e.target.value);
          },
          // className,
          className: 'text-right',
        },
      };
    },
  },
  periodPayment: {
    label: '本期計價',
    style: { width: 100 },
    createInputAttr: ({ disabled, state_incomeBillSerial, handle_onChange }) => {
      const type = disabled ? 'text' : 'number';
      const value =
        (disabled ? state_incomeBillSerial.periodPayment?.toLocaleString() : state_incomeBillSerial.periodPayment) ??
        '';
      const readOnly = disabled ? true : false;

      return {
        attr_input: {
          type,
          value,
          readOnly,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            handle_onChange('periodPayment', e.target.value);
          },
          className: 'text-right',
        },
      };
    },
  },
  priorPeriodPayment: {
    label: '前期已收',
    style: { width: 100 },
    createInputAttr: ({ disabled, state_incomeBillSerial, handle_onChange }) => {
      const type = disabled ? 'text' : 'number';
      const value =
        (disabled
          ? state_incomeBillSerial.priorPeriodPayment?.toLocaleString()
          : state_incomeBillSerial.priorPeriodPayment) ?? '';
      const readOnly = disabled ? true : false;

      return {
        attr_input: {
          type,
          value,
          readOnly,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            handle_onChange('priorPeriodPayment', e.target.value);
          },
          className: 'text-right',
        },
      };
    },
  },
  importAccountingNumber: {
    label: '票據/匯入帳號',
    style: { width: 120 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: state_incomeBillSerial.importAccountingNumber ?? '',
        className: 'text-center',
      },
    }),
  },
  noteNumber: {
    label: '票據號碼',
    style: { width: 100 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: state_incomeBillSerial.noteNumber ?? '',
        className: 'text-center',
      },
    }),
  },
  noteMaturityDate: {
    label: '票據日期', // (到期日)
    style: { width: 80 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: getTaiwanDateStr(state_incomeBillSerial.noteMaturityDate) ?? '',
        className: 'text-center',
      },
    }),
  },
  receivablePayment: {
    label: '收款金額',
    style: { width: 100 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: state_incomeBillSerial.receivablePayment ?? '',

        className: 'text-right',
      },
    }),
  },
  deductionPayment: {
    label: '扣款金額',
    style: { width: 100 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: state_incomeBillSerial.deductionPayment ?? '',

        className: 'text-right',
      },
    }),
  },
  unpaidPayment: {
    label: '餘額',
    style: { width: 100 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: state_incomeBillSerial.unpaidPayment ?? '',
        className: 'text-right',
      },
    }),
  },

  difference: {
    label: '差額',
    style: { width: 200 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      attr_span: {
        node: state_incomeBillSerial.difference ?? '',
        className: 'text-left',
      },
    }),
  },
} as const;
