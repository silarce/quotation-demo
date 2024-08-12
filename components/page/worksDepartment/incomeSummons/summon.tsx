import { useState, useMemo, useEffect, forwardRef } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';

// component
import EditDefunctionBtn from 'components/page/worksDepartment/contracList/contract/accountReceivable/accountantDeductionEditor';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// type
import type { Tparams, TincomeBillSerialDto } from 'js/api/dtoTypes';
import { TreqPatch } from 'pages/worksDepartment/incomeSummons';

// icon
import { IconCheck02, IconEdit } from 'public/image/icon/svgComponent/svgIcons';
import { UpDownArrow } from 'components/global/myAntd/collapse';

import scss from './summon.module.scss';

// untils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ============================================================================

type Tstate_incomeBillSerial = {
  id: string;
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
  //
  readonly fee: number; // 現在是從accountant裡面拿
  //
  note: string;
  vendorName: string;

  // 看錯需求，這是不需要的，待PR之前再把這個註解刪掉
  // temporary_separatePayment: string;

  //
  readonly accountsReceivableDeduction: TincomeBillSerialDto['accountsReceivableDeduction'];
};

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
  className?: string;
  createInputSelProps: (props: {
    disabled: boolean;
    isPaperImported: boolean;
    state_incomeBillSerial: Tstate_incomeBillSerial;
    setState_incomeBillSerial: React.Dispatch<React.SetStateAction<Tstate_incomeBillSerial>>;
    //
    accountantId?: string;
    update_incomeBill?: () => void;
  }) => TinputSelProps;
};

type Tconfig = {
  [key in TconfigKey]: TconfigItem;
} & {
  btnPanel: TconfigItem;
};

type TconfigKey =
  | keyof Pick<
      TincomeBillSerialDto,
      | 'billSerialNumber'
      | 'receiveDate'
      | 'contractNumber'
      | 'projectName'
      | 'contractPayment'
      | 'periodPayment'
      | 'priorPeriodPayment'
      | 'importAccountingNumber'
      | 'noteNumber'
      | 'noteMaturityDate'
      | 'receivablePayment'
      | 'deductionPayment'
      | 'unpaidPayment'
      | 'difference'
      | 'note'

      // 看錯需求，這是不需要的，待PR之前再把這個註解刪掉
      // | 'temporary_separatePayment'
    >
  | 'fee'
  | 'vendorName';

// ============================================================================
// MARK:SummonsRow_pre
const SummonsRow_pre = (
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

// ============================================================================

// MARK:Summons_pre

const Summons_pre = (
  {
    //
    incomeBillSerial,
    reqPatch,
    update_incomeBill,
    changeActive,
  }: {
    incomeBillSerial: TincomeBillSerialDto;
    reqPatch: TreqPatch;
    update_incomeBill: () => void;
    changeActive: () => void;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  const accountantId = incomeBillSerial.accountant.id;

  const defaultState = useMemo(() => {
    const {
      id,
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
      //
      accountant,
      //
      note,

      accountsReceivableDeduction,
      fee,
    } = incomeBillSerial;

    let { difference } = incomeBillSerial;
    difference = (difference ?? '').trimEnd();

    const defaultState: Tstate_incomeBillSerial = {
      id,
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
      fee: fee || 0,
      //
      note: note ?? '',
      vendorName: accountant.vendorName ?? '',

      accountsReceivableDeduction: accountsReceivableDeduction,

      // 看錯需求，這是不需要的，待PR之前再把這個註解刪掉
      // temporary_separatePayment: (temporary_separatePayment || 0).toLocaleString(),
    };

    return defaultState;
  }, [incomeBillSerial]);

  const [state_incomeBillSerial, setState_incomeBillSerial] = useState<Tstate_incomeBillSerial>(defaultState);

  const [disabled, setDisabled] = useState(true);

  // isPaperImported 已匯入紙本應收帳款(舊的收款紀錄)，若為true，則可以編輯所有欄位
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
    <SummonsRow ref={ref} className={classNames(scss.tbody, !disabled && scss.enabled)}>
      <div className={scss.btnPanel} style={config.btnPanel.style}>
        <UpDownArrow className="h-[20px]" onClick={changeActive} />
        <IconEdit className={classNames(!disabled && scss.enable)} onClick={() => setDisabled((state) => !state)} />
        <IconCheck02 className={classNames(disabled && 'invisible')} onClick={handle_onConfirm} />
      </div>

      {keyArr.map((key) => {
        const { style, className, createInputSelProps: createInputAttr } = config[key];

        // 要使!isPaperImported為true的狀態仍可以編輯
        // 將送進createInputAttr中的disabled回傳即可
        const inputSelProps = createInputAttr({
          disabled: disabled,
          isPaperImported,
          state_incomeBillSerial,
          setState_incomeBillSerial,
          accountantId,
          update_incomeBill,
        });

        return (
          <div key={key} style={style} className={classNames(className)}>
            <InputSel
              //
              disabled={disabled || !isPaperImported}
              showBaseline="auto"
              {...inputSelProps}
            />
          </div>
        );
      })}
    </SummonsRow>
  );
};

// forwardRef
const SummonsRow = forwardRef(SummonsRow_pre);
const Summons = forwardRef(Summons_pre);
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

const keyArr: TconfigKey[] = [
  'billSerialNumber',
  // 'invoiceType',
  'receiveDate',
  'contractNumber',
  'projectName',
  'vendorName',
  'contractPayment',
  'periodPayment',
  'priorPeriodPayment',
  'importAccountingNumber',
  'noteNumber',
  'noteMaturityDate',
  'receivablePayment',
  'deductionPayment',
  'fee',
  'unpaidPayment',
  'difference',

  'note',
];

const config: Tconfig = {
  btnPanel: {
    label: '',
    style: { width: 120 },
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
          onChange: () => {},
        },
      },
    }),
  },

  receiveDate: {
    label: '日期',
    style: { width: 130 },
    className: 'text-center',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const datePickerProps: TinputSelProps['datePickerProps'] = {
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
      };

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.receiveDate
            ? getTaiwanDateStr(state_incomeBillSerial.receiveDate.toISOString()) ?? ''
            : '',
          onChange: () => {},
        },
      };

      const inputSelProps = disabled || !isPaperImported ? { inputProps } : { datePickerProps };

      return inputSelProps;
    },
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
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => {
      //
      // const inputProps: TinputSelProps['inputProps'] = {
      //   props: {
      //     // className: 'text-center',
      //     value: state_incomeBillSerial.projectName,
      //     onChange: (e) => {
      //       setState_incomeBillSerial((prev) => {
      //         return {
      //           ...prev,
      //           projectName: e.target.value,
      //         };
      //       });
      //     },
      //   },
      // };
      //

      const textareaProps: TinputSelProps['textareaProps'] = {
        props: {
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
      };

      //

      return { textareaProps };
    },
  },
  contractPayment: {
    label: '承攬價',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.contractPayment,
      });

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState_incomeBillSerial((prev) => {
          const copy = { ...prev };
          copy.contractPayment = e.target.value;
          copy.unpaidPayment = calcUnpaidPayment(copy).toString();
          copy.periodPayment = '';

          return copy;
        });
      };

      const inputSelProps = {
        disabled,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            readOnly: disabled,
            onChange,
          },
        },
      };

      return inputSelProps;
    },
  },
  periodPayment: {
    label: '本期計價',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.periodPayment,
      });

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState_incomeBillSerial((prev) => {
          const copy = { ...prev };
          copy.periodPayment = e.target.value;
          copy.unpaidPayment = calcUnpaidPayment(copy).toString();
          copy.contractPayment = '';

          return copy;
        });
      };

      const inputSelProps = {
        disabled,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            readOnly: disabled,
            onChange: onChange,
          },
        },
      };

      return inputSelProps;
    },
  },
  priorPeriodPayment: {
    label: '前期已收',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.priorPeriodPayment,
      });

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState_incomeBillSerial((prev) => {
          const copy = { ...prev };
          copy.priorPeriodPayment = e.target.value;
          copy.unpaidPayment = calcUnpaidPayment(copy).toString();

          return copy;
        });
      };

      const inputSelProps = {
        disabled,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            readOnly: disabled,
            onChange: onChange,
          },
        },
      };

      return inputSelProps;
    },
  },
  importAccountingNumber: {
    label: '票據/匯入帳號',
    className: 'text-center',
    style: { width: 250 },
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
    style: { width: 150 },
    className: 'text-center',
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
    className: 'text-center',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const datePickerProps: TinputSelProps['datePickerProps'] = {
        props: {
          placeholder: '',
          value: state_incomeBillSerial.noteMaturityDate,
          className: 'text-center',
          onChange: (date) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                noteMaturityDate: date,
              };
            });
          },
        },
      };

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-center',
          placeholder: '',
          value: state_incomeBillSerial.noteMaturityDate
            ? getTaiwanDateStr(state_incomeBillSerial.noteMaturityDate.toISOString()) ?? ''
            : '',
          onChange: () => {},
        },
      };

      const inputSelProps = disabled || !isPaperImported ? { inputProps } : { datePickerProps };

      return inputSelProps;
    },
  },
  receivablePayment: {
    label: '收款金額',
    style: { width: 100 },
    className: 'text-right',
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
    style: { width: 150 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial,
      accountantId,
      update_incomeBill,
    }) => {
      const { type, value } = reducer_input({
        disabled: disabled || !isPaperImported,
        value: state_incomeBillSerial.deductionPayment,
      });

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState_incomeBillSerial((prev) => {
          const copy = { ...prev };
          copy.deductionPayment = e.target.value;
          copy.unpaidPayment = calcUnpaidPayment(copy).toString();

          return copy;
        });
      };

      const inputSelProps: TinputSelProps = {
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            onChange: onChange,
          },
        },
        suffix: accountantId && (
          <EditDefunctionBtn
            //
            accountantId={accountantId}
            incomeBillId={state_incomeBillSerial.id}
            onConfirm={update_incomeBill}
          />
        ),
      };

      return inputSelProps;
    },
  },
  unpaidPayment: {
    label: '餘額',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled: disabled || !isPaperImported,
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
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      // const { type, value } = reducer_input({
      //   disabled,
      //   value: state_incomeBillSerial.difference,
      // });

      return {
        textareaProps: {
          allowNewLineByUser: true,
          props: {
            className: 'text-right',
            placeholder: '',
            // type,
            value: state_incomeBillSerial.difference,
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

  fee: {
    label: '匯費',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({ disabled, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const inputSelProps: TinputSelProps = {
        disabled: disabled,
        inputProps: {
          props: {
            className: 'text-right',
            defaultValue: state_incomeBillSerial.fee.toLocaleString(),
          },
        },
      };

      return inputSelProps;
    },
  },

  note: {
    label: '備註',
    style: { width: 200 },
    className: '',
    createInputSelProps: ({ disabled, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const inputSelProps: TinputSelProps = {
        disabled,
        textareaProps: {
          allowNewLineByUser: true,
          props: {
            value: state_incomeBillSerial.note,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  note: e.target.value,
                };
              });
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  vendorName: {
    label: '廠商名稱',
    style: { width: 150 },
    // className: 'text-center',
    createInputSelProps: ({ state_incomeBillSerial }) => {
      const inputSelProps: TinputSelProps = {
        disabled: true,
        showBaseline: 'invisible',
        inputProps: {
          props: {
            // className: 'text-center',
            value: state_incomeBillSerial.vendorName,
            disabled: true,
          },
        },
      };

      return inputSelProps;
    },
  },

  // 看錯需求，這是不需要的，待PR之前再把這個註解刪掉
  // temporary_separatePayment: {
  //   label: '分出金額',
  //   style: { width: 100 },
  //   className: 'text-right',
  //   createInputSelProps: ({ disabled, state_incomeBillSerial, setState_incomeBillSerial }) => {
  //     const inputSelProps: TinputSelProps = {
  //       disabled: true,
  //       inputProps: {
  //         props: {
  //           className: 'text-right',
  //           defaultValue: state_incomeBillSerial.temporary_separatePayment,
  //         },
  //       },
  //     };

  //     return inputSelProps;
  //   },
  // },

  //
} as const;

// ============================================================================
const reducer_input = ({ disabled, value }: { disabled: boolean; value: string | number }) => {
  const type = disabled ? 'text' : 'number';
  const value_num = Number(value);

  const theValue = (disabled ? value_num?.toLocaleString() : value) || '';

  return {
    type,
    value: theValue,
  };
};

const calcUnpaidPayment = (state_incomeBillSerial: Tstate_incomeBillSerial) => {
  // 餘額=承攬價/本期計價-上期已計價-扣款-匯費

  const {
    //
    contractPayment,
    periodPayment,
    priorPeriodPayment,
    deductionPayment,
    fee,
  } = state_incomeBillSerial;

  const unpaidPayment = new Decimal(contractPayment || periodPayment || 0)
    .minus(priorPeriodPayment || 0)
    .minus(deductionPayment || 0)
    .minus(fee || 0)
    .toNumber();

  return unpaidPayment;
};

// =============================================================================

export default Summons;
export { SummonsRow, keyArr, config };
