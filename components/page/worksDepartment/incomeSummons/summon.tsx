import { useState, useMemo, useEffect, forwardRef } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';

// antd
import { Badge } from 'antd';

// component
import EditDefunctionBtn, {
  Tprops_deductionEditor_modal,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/accountantDeductionEditor';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// type
import type { TincomeBillSerialDto } from 'js/api/dtoTypes';
import { TreqPatch } from 'pages/worksDepartment/incomeSummons';

// icon
import { IconCheck02, IconEdit } from 'public/image/icon/svgComponent/svgIcons';
// import { UpDownArrow } from 'components/global/myAntd/collapse';

import scss from './summon.module.scss';

// untils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import calcIncomeBillUnpaidPayment from 'js/utils/calc/calcIncomeBillUnpaidPayment';

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

  //
  // readonly accountsReceivableDeduction: TincomeBillSerialDto['accountsReceivableDeduction'];
  state_deduction: Tstate_deduction[];
};

type Tstate_deduction = {
  id?: string;
  itemName: string; // 扣款項目
  detailedAmount: string; // 扣款金額
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

type TcellPropsList_summon = {
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

export type { Tstate_incomeBillSerial };

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
    className,
    incomeBillSerial,
    reqPatch,
    update_incomeBill,
    changeActive,
  }: {
    className?: string;
    incomeBillSerial: TincomeBillSerialDto;
    reqPatch: TreqPatch;
    update_incomeBill: () => void;
    changeActive?: () => void;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  const accountantId = incomeBillSerial.accountant.id;
  const defaultState = useDefaultState(incomeBillSerial);

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

  // MARK: RENDER

  return (
    <SummonsRow ref={ref} className={classNames(scss.tbody, !disabled && scss.enabled, className)}>
      <div className={scss.btnPanel} style={cellPropsList_summon.btnPanel.style}>
        <div className={scss.reviewerBox}>
          <div className={scss.reviewer}>
            <Badge status="default" />
            <span>名字</span>
          </div>
          <div className={scss.reviewer}>
            <Badge status="success" />
            <span>名字</span>
          </div>
          <div className={scss.reviewer}>
            <Badge status="error" />
            <span>名字</span>
          </div>
        </div>
        {/* <UpDownArrow className="h-[20px]" onClick={changeActive} /> */}

        <IconEdit className={classNames(!disabled && scss.enable)} onClick={() => setDisabled((state) => !state)} />
        <IconCheck02 className={classNames(disabled && 'invisible')} onClick={handle_onConfirm} />
      </div>

      {keyArr.map((key) => {
        const { style, className, createInputSelProps: createInputAttr } = cellPropsList_summon[key];

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

// MARK: END

// forwardRef
const SummonsRow = forwardRef(SummonsRow_pre);
const Summons = forwardRef(Summons_pre);
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// region PROPSLIST

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
  // 'difference',

  'note',
];

const cellPropsList_summon: TcellPropsList_summon = {
  btnPanel: {
    label: '',
    style: { width: 170 },
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
    style: { width: 120 },
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
        // disabled: disabled || !isPaperImported,
        disabled: true,
        value: state_incomeBillSerial.deductionPayment,
      });

      const editDefunctionBtnProps_able: Tprops_deductionEditor_modal = {
        accountantId: undefined,
        incomeBillId: undefined,
        defaultStateArr: state_incomeBillSerial.state_deduction,
        onConfirm: ({ state_deductionArr }) => {
          const deductionPayment = state_deductionArr.reduce((deductionPayment, item) => {
            deductionPayment = new Decimal(deductionPayment).add(item.detailedAmount || 0).toNumber();

            return deductionPayment;
          }, 0);

          setState_incomeBillSerial((prev) => {
            const copy = { ...prev };
            copy.state_deduction = state_deductionArr;
            copy.deductionPayment = deductionPayment.toString();
            copy.unpaidPayment = calcUnpaidPayment(copy).toString();

            return copy;
          });
        },
      };

      const editDefunctionBtnProps_disable: Tprops_deductionEditor_modal = {
        accountantId: accountantId,
        incomeBillId: state_incomeBillSerial.id,
        // defaultStateArr: undefined,
        onConfirm: update_incomeBill,
        // forbidden: true,
      };

      const editDefunctionBtnProps = disabled ? editDefunctionBtnProps_disable : editDefunctionBtnProps_able;

      const inputSelProps: TinputSelProps = {
        disabled: true,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            onChange: () => {},
          },
        },
        suffix: accountantId && (
          <EditDefunctionBtn
            {...editDefunctionBtnProps}
            //
            // accountantId={accountantId}
            // incomeBillId={state_incomeBillSerial.id}
            // defaultStateArr={defaultStateArr}
            // onConfirm={update_incomeBill}
          />
        ),
      };

      return inputSelProps;
    },
  },
  unpaidPayment: {
    label: '餘額',
    style: { width: 120 },
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
    createInputSelProps: ({
      //
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled: disabled,
        value: state_incomeBillSerial.fee,
      });

      const inputSelProps: TinputSelProps = {
        disabled: disabled,
        inputProps: {
          props: {
            type,
            className: 'text-right',
            value,
            onChange: (e) => {
              setState_incomeBillSerial((state) => {
                const copy = { ...state };
                copy.fee = Number(e.target.value || 0);
                copy.unpaidPayment = calcUnpaidPayment(copy).toString();

                return copy;
              });
            },
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

  const unpaidPayment = calcIncomeBillUnpaidPayment({
    contractPayment: Number(contractPayment),
    periodPayment: Number(periodPayment),
    priorPeriodPayment: Number(priorPeriodPayment),
    deductionPayment: Number(deductionPayment),
    fee: Number(fee),
  });
  // const unpaidPayment = new Decimal(contractPayment || periodPayment || 0)
  //   .minus(priorPeriodPayment || 0)
  //   .minus(deductionPayment || 0)
  //   .minus(fee || 0)
  //   .toNumber();

  return unpaidPayment;
};

// =============================================================================

const useDefaultState = (incomeBillSerial: TincomeBillSerialDto) => {
  return useMemo(() => {
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

    const state_deduction = (accountsReceivableDeduction ?? []).map((item) => {
      return {
        id: item.id,
        itemName: item.itemName,
        detailedAmount: String(item.detailedAmount),
      };
    });

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

      state_deduction: state_deduction,
    };

    return defaultState;
  }, [incomeBillSerial]);
};

// =============================================================================

export default Summons;
export { SummonsRow, keyArr, cellPropsList_summon };
