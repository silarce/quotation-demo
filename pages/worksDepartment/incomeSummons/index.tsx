import { useState, useMemo, useEffect, forwardRef } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import { IconCheck02, IconEdit } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './index.module.scss';

// type
import type { TincomeBillSerialDto } from 'js/api/dtoTypes';

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
  receiveDate: Moment | null;
  contractNumber: string;
  projectName: string;
  contractPayment: string;
  periodPayment: string;
  priorPeriodPayment: string;
  importAccountingNumber: string;
  noteNumber: string;
  noteMaturityDate: Moment | null;
  receivablePayment: string;
  deductionPayment: string;
  unpaidPayment: string;
  difference: string;
};

type TreqPatch = (incomeBillSerialId: string, state_incomeBillSerial: Tstate_incomeBillSerial) => Promise<void>;

// ==============================================================================

// MARK:START

export default function IncomeSummons() {
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

  const params = useMemo(() => {
    return {
      sort: 'receiveDate',
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
  }, [isForeign, month, year]);

  const {
    data: data_incomeBill = [],
    update: update_incomeBill,
    isFetching,
  } = useGetAccountReceivableIncomeBills({
    params,
  });

  // -----------------------------------------------------------------------------

  // region REQUEST

  const reqPatch = async (
    //
    incomeBillSerialId: string,
    state_incomeBillSerial: Tstate_incomeBillSerial
  ) => {
    const {
      receiveDate,
      contractNumber,
      projectName,
      contractPayment,
      periodPayment,
      priorPeriodPayment,
      importAccountingNumber,
      noteNumber,
      noteMaturityDate,
      receivablePayment,
      deductionPayment,
      unpaidPayment,
      difference,
    } = state_incomeBillSerial;

    const body: TupdateIncomeBillSerialDto = {
      receiveDate: receiveDate ? receiveDate.toISOString() : null,
      contractNumber: contractNumber,
      projectName: projectName,
      contractPayment: contractPayment ? Number(contractPayment) : null,
      periodPayment: periodPayment ? Number(periodPayment) : null,
      priorPeriodPayment: priorPeriodPayment ? Number(priorPeriodPayment) : null,
      importAccountingNumber: importAccountingNumber,
      noteNumber: noteNumber,
      noteMaturityDate: noteMaturityDate ? noteMaturityDate.toISOString() : null,
      receivablePayment: receivablePayment ? Number(receivablePayment) : null,
      deductionPayment: deductionPayment ? Number(deductionPayment) : null,
      unpaidPayment: unpaidPayment ? Number(unpaidPayment) : null,
      difference: difference ? difference : null,
    };

    await apiPatchIncomeBill(incomeBillSerialId, body).then(async (res) => {
      await update_incomeBill();
    });
  };

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
  // MARK: RENDER
  return (
    <SubLayer isLoading_subLayer={isFetching}>
      <PageHeader02
        tagList={tagList}
        customeLeft={[<SelectBar key="selectBar" className={'ml-5'} selectPropsArr={selectPropsArr} />]}
      />
      <div className={scss.main}>
        <div className={scss.tableWrapper}>
          <div className={scss.table}>
            <Row className={scss.thead}>
              <div style={config.btnPanel.style} className={config.btnPanel.className}></div>
              {keyArr.map((key) => {
                const { label, style, className } = config[key];

                return (
                  <div key={key} style={style} className={className}>
                    {label}
                  </div>
                );
              })}
            </Row>

            {data_incomeBill.map((data, index) => {
              return <Summons key={data.id} incomeBillSerial={data} reqPatch={reqPatch} />;
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
    reqPatch,
  }: {
    incomeBillSerial: TincomeBillSerialDto;
    reqPatch: TreqPatch;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  const defaultState = useMemo(() => {
    const {
      billSerialNumber,
      receiveDate,
      contractNumber,
      projectName,
      contractPayment,
      periodPayment,
      priorPeriodPayment,
      importAccountingNumber,
      noteNumber,
      noteMaturityDate,
      receivablePayment,
      deductionPayment,
      unpaidPayment,
      difference,
    } = incomeBillSerial;

    const defaultState: Tstate_incomeBillSerial = {
      billSerialNumber: billSerialNumber,
      receiveDate: receiveDate ? moment(receiveDate) : null,
      contractNumber: contractNumber || '',
      projectName: projectName || '',
      contractPayment: String(contractPayment || ''),
      periodPayment: String(periodPayment || ''),
      priorPeriodPayment: String(priorPeriodPayment || ''),
      importAccountingNumber: importAccountingNumber || '',
      noteNumber: noteNumber || '',
      noteMaturityDate: noteMaturityDate ? moment(noteMaturityDate) : null,
      receivablePayment: String(receivablePayment || ''),
      deductionPayment: String(deductionPayment || ''),
      unpaidPayment: String(unpaidPayment || ''),
      difference: difference || '',
    };

    return defaultState;
  }, [incomeBillSerial]);

  const [state_incomeBillSerial, setState_incomeBillSerial] = useState<Tstate_incomeBillSerial>(defaultState);

  const [disabled, setDisabled] = useState(true);

  const isPaperImported = incomeBillSerial.isPaperImported;

  // ---------------------------------------------------------------------

  const handle_onConfirm = async () => {
    await reqPatch(incomeBillSerial.id, state_incomeBillSerial).then(() => {
      setDisabled(true);
    });
  };

  // ---------------------------------------------------------------------

  useEffect(() => {
    setState_incomeBillSerial(defaultState);
  }, [defaultState, disabled]);

  // ---------------------------------------------------------------------

  return (
    <Row ref={ref} className={classNames(scss.tbody, !disabled && scss.enabled)}>
      <div className={scss.btnPanel} style={config.btnPanel.style}>
        <IconEdit className={classNames(!disabled && scss.enable)} onClick={() => setDisabled((state) => !state)} />
        <IconCheck02 className={classNames(disabled && 'invisible')} onClick={handle_onConfirm} />
      </div>

      {keyArr.map((key) => {
        const { style, className, createInputSelProps: createInputAttr } = config[key];

        const inputSelProps = createInputAttr({
          disabled,
          state_incomeBillSerial,
          setState_incomeBillSerial,
        });

        return (
          <div key={key} style={style} className={className}>
            <InputSel
              //
              disabled={disabled || !isPaperImported}
              showBaseline="auto"
              {...inputSelProps}
            />
          </div>
        );
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

// MARK: FUNCTION

const reducer_input = ({ disabled, value }: { disabled: boolean; value: string | number }) => {
  const type = disabled ? 'text' : 'number';
  const value_num = Number(value);

  const theValue = (disabled ? value_num?.toLocaleString() : value) || '';

  return {
    type,
    value: theValue,
  };
};

// ==============================================================================

// MARK: config

type TconfigKey = keyof Omit<TincomeBillSerialDto, 'id' | 'createdAt' | 'updatedAt' | 'isForeign' | 'isPaperImported'>;

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
  className?: string;
  createInputSelProps: (props: {
    disabled: boolean;
    state_incomeBillSerial: Tstate_incomeBillSerial;
    setState_incomeBillSerial: React.Dispatch<React.SetStateAction<Tstate_incomeBillSerial>>;
  }) => TinputSelProps;
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
    style: { width: 70 },
    className: scss.btnPanel,
    createInputSelProps: () => ({}),
  },

  billSerialNumber: {
    label: '收入傳票序號',
    style: { width: 150 },
    className: scss.billSerialNumber,
    createInputSelProps: ({ state_incomeBillSerial }) => ({
      disabled: true,
      showBaseline: 'invisible',
      inputProps: {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.billSerialNumber,
        },
      },
    }),
  },

  receiveDate: {
    label: '日期',
    style: { width: 130 },
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => ({
      datePickerProps: {
        props: {
          value: state_incomeBillSerial.receiveDate,
          onChange: (date) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                receiveDate: date,
              };
            });
          },
        },
      },
    }),
  },
  contractNumber: {
    label: '合約編號',
    style: { width: 100 },
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => ({
      inputProps: {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.contractNumber,
          onChange: (e) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                contractNumber: e.target.value,
              };
            });
          },
        },
      },
    }),
  },
  projectName: {
    label: '工程名稱',
    style: {
      // flex: '1',
      width: 200,
    },
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => ({
      inputProps: {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.projectName,
          onChange: (e) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                projectName: e.target.value,
              };
            });
          },
        },
      },
    }),
  },
  contractPayment: {
    label: '承攬價',
    style: { width: 100 },
    createInputSelProps: ({
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.contractPayment,
      });

      return {
        disabled,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            readOnly: disabled,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  contractPayment: e.target.value,
                };
              });
            },
          },
        },
      };
    },
  },
  periodPayment: {
    label: '本期計價',
    style: { width: 100 },
    createInputSelProps: ({
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.periodPayment,
      });

      return {
        disabled,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            readOnly: disabled,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  periodPayment: e.target.value,
                };
              });
            },
          },
        },
      };
    },
  },
  priorPeriodPayment: {
    label: '前期已收',
    style: { width: 100 },
    createInputSelProps: ({
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.priorPeriodPayment,
      });

      return {
        disabled,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            readOnly: disabled,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  priorPeriodPayment: e.target.value,
                };
              });
            },
          },
        },
      };
    },
  },
  importAccountingNumber: {
    label: '票據/匯入帳號',
    style: { width: 140 },
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => ({
      inputProps: {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.importAccountingNumber,
          onChange: (e) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                importAccountingNumber: e.target.value,
              };
            });
          },
        },
      },
    }),
  },
  noteNumber: {
    label: '票據號碼',
    style: { width: 100 },
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => ({
      inputProps: {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.noteNumber,
          onChange: (e) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                noteNumber: e.target.value,
              };
            });
          },
        },
      },
    }),
  },
  noteMaturityDate: {
    label: '票據日期', // (到期日)
    style: { width: 130 },
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => ({
      datePickerProps: {
        props: {
          value: state_incomeBillSerial.noteMaturityDate,
          onChange: (date) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                noteMaturityDate: date,
              };
            });
          },
        },
      },
    }),
  },
  receivablePayment: {
    label: '收款金額',
    style: { width: 100 },
    createInputSelProps: ({
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.receivablePayment,
      });

      return {
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value: value,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  receivablePayment: e.target.value,
                };
              });
            },
          },
        },
      };
    },
  },
  deductionPayment: {
    label: '扣款金額',
    style: { width: 100 },
    createInputSelProps: ({
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled: disabled,
        value: state_incomeBillSerial.deductionPayment,
      });

      return {
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  deductionPayment: e.target.value,
                };
              });
            },
          },
        },
      };
    },
  },
  unpaidPayment: {
    label: '餘額',
    style: { width: 100 },
    createInputSelProps: ({
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.unpaidPayment,
      });

      return {
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  unpaidPayment: e.target.value,
                };
              });
            },
          },
        },
      };
    },
  },

  difference: {
    label: '差額',
    style: { width: 200 },
    createInputSelProps: ({
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.difference,
      });

      return {
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  difference: e.target.value,
                };
              });
            },
          },
        },
      };
    },
  },
} as const;
