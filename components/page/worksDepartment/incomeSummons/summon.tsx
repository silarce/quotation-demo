import React, { useState, useMemo, useEffect, forwardRef, useContext } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';
import _ from 'lodash';

// antd
import { Badge } from 'antd';

// component
import EditDefunctionBtn, {
  Tprops_deductionEditor_modal,
} from 'components/page/worksDepartment/contracList/contract/accountReceivable/accountantDeductionEditor';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import Tip from 'components/global/myAntd/popover/tip';

// type
import type { Tcurrency, TincomeBillSerialDto } from 'js/api/dtoTypes';
import { TreqPatch } from 'pages/worksDepartment/incomeSummons';

// icon
import { IconCheck02, IconEdit } from 'public/image/icon/svgComponent/svgIcons';
// import { UpDownArrow } from 'components/global/myAntd/collapse';

import scss from './summon.module.scss';

// untils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { calcIncomeBillUnpaidPayment, calcIncomeBillExchangeBenefits } from 'js/utils/calc/calcIncomeBill';

// global state
import { useVipInfo } from 'hooks/globalState/useVipInfo';

// context
import { AppContext } from 'pages/_app';

import { optionsCreator_currency } from 'js/utils/options/options';

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
  //
  //
  isCashierSeen: boolean | null;
  isWorkSupervisorSeen: boolean | null;
  isManagerSeen: boolean | null;
  //
  //
  // 外銷相關

  // '出口報單幣別'
  declarationCurrency: Tcurrency | null;
  // '出口報單匯率'
  declarationExchangeRate: string | null;
  // '出口報單外幣金額'
  declarationCurrencyPayment: string | null;
  // '出口報單台幣金額'
  declarationPayment: string | null;
  // '收款幣別'
  receivableCurrency: Tcurrency | null;
  // '收款匯率'
  receivableExchangeRate: string | null;
  // '收款外幣金額'
  receivableCurrencyPayment: string | null;
  // '國外匯費_新台幣'
  foreignFee: string | null;
  // '國外匯費_外幣'
  foreignCurrencyFee: string | null;
  // '兌換利益'
  exchangeBenefits: string | null;
};

type Tstate_deduction = {
  id?: string;
  itemName: string; // 扣款項目
  detailedAmount: string; // 扣款金額
};

type TconfigItem = {
  label: React.ReactNode;
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
      //
      | 'declarationCurrency'
      | 'declarationExchangeRate'
      | 'declarationCurrencyPayment'
      | 'declarationPayment'
      | 'receivableCurrency'
      | 'receivableExchangeRate'
      | 'receivableCurrencyPayment'
      | 'foreignFee'
      | 'foreignCurrencyFee'
      | 'exchangeBenefits'
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
    isForeign,
  }: {
    className?: string;
    incomeBillSerial: TincomeBillSerialDto;
    reqPatch: TreqPatch;
    update_incomeBill: () => void;
    changeActive?: () => void;
    isForeign: boolean;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  const { userInfo } = useContext(AppContext);
  const userId = userInfo?.employee?.id;

  const {
    manager,
    worksDepartment_cashier: cashier,
    worksDepartment_workSupervisor: workSupervisor,
  } = useVipInfo((state) => ({
    manager: state.manager,
    worksDepartment_cashier: state.worksDepartment_cashier,
    worksDepartment_workSupervisor: state.worksDepartment_workSupervisor,
  }));

  const identity =
    userId === manager.id
      ? 'manager'
      : userId === cashier.id
      ? 'cashier'
      : userId === workSupervisor.id
      ? 'workSupervisor'
      : '';

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

  const handle_review = async () => {
    if (!identity) {
      return;
    }

    const body = _.cloneDeep(state_incomeBillSerial);

    identity === 'cashier' && (body.isCashierSeen = !body.isCashierSeen);
    identity === 'workSupervisor' && (body.isWorkSupervisorSeen = !body.isWorkSupervisorSeen);
    identity === 'manager' && (body.isManagerSeen = !body.isManagerSeen);

    await reqPatch(incomeBillSerial.id, body).then(() => {});
  };

  // ---------------------------------------------------------------------

  const keyArr = getKeyArr({ isForeign });

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
          <div onClick={handle_review} className={classNames(scss.reviewer, identity === 'cashier' && scss.isReviewer)}>
            <Badge status={checkStatus(state_incomeBillSerial.isCashierSeen)} />
            <span>{cashier.name}</span>
          </div>
          <div
            onClick={handle_review}
            className={classNames(scss.reviewer, identity === 'workSupervisor' && scss.isReviewer)}
          >
            <Badge status={checkStatus(state_incomeBillSerial.isWorkSupervisorSeen)} />
            <span>{workSupervisor.name}</span>
          </div>
          <div onClick={handle_review} className={classNames(scss.reviewer, identity === 'manager' && scss.isReviewer)}>
            <Badge status={checkStatus(state_incomeBillSerial.isManagerSeen)} />
            <span>{manager.title}</span>
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

// const keyArr_ori: TconfigKey[] = [
//   'billSerialNumber', // 收入傳票序號
//   'contractNumber', // 合約編號
//   'receiveDate', // 日期
//   'projectName', // 工程名稱
//   'vendorName', // 廠商名稱
//   'contractPayment', // 承攬價
//   'periodPayment', // 本期計價
//   'noteNumber', // 票據號碼
//   'importAccountingNumber', // 票據/匯入帳號
//   'noteMaturityDate', // 票據日期

//   'declarationCurrency', // 外銷 出口報單幣別
//   'declarationExchangeRate', // 外銷 出口報單匯率
//   'declarationCurrencyPayment', // 外銷 出口報單外幣金額
//   'declarationPayment', // 外銷 出口報單台幣金額

//   'priorPeriodPayment', // 前期已收

//   'receivableCurrency', // 外銷 收款幣別
//   'receivableExchangeRate', // 外銷 收款匯率
//   'receivableCurrencyPayment', // 外銷 收款外幣金額
//   'receivablePayment', // w 收款金額 新臺幣

//   'fee', // 匯費
//   'foreignCurrencyFee', // 外銷 國外匯費_外幣
//   'foreignFee', // 外銷 國外匯費_新台幣

//   'exchangeBenefits', // 外銷 兌換利益

//   'deductionPayment', // 扣款金額
//   'unpaidPayment', // 餘額
//   'note', // 備註
// ];

const keyArr_domain: TconfigKey[] = [
  'billSerialNumber', // 收入傳票序號
  'contractNumber', // 合約編號
  'receiveDate', // 日期
  'projectName', // 工程名稱
  'vendorName', // 廠商名稱
  'contractPayment', // 承攬價
  'periodPayment', // 本期計價
  'noteNumber', // 票據號碼
  'importAccountingNumber', // 票據/匯入帳號
  'noteMaturityDate', // 票據日期

  'priorPeriodPayment', // 前期已收

  'receivablePayment', // w 收款金額 新臺幣

  'fee', // 匯費

  'deductionPayment', // 扣款金額
  'unpaidPayment', // 餘額

  'note', // 備註
];

const keyArr_foreign: TconfigKey[] = [
  'billSerialNumber', // 收入傳票序號
  'receiveDate', // 日期
  'contractNumber', // 合約編號
  'vendorName', // 廠商名稱

  'declarationCurrency', // 外銷 出口報單幣別
  'declarationExchangeRate', // 外銷 出口報單匯率
  'declarationCurrencyPayment', // 外銷 出口報單外幣金額
  'declarationPayment', // 外銷 出口報單台幣金額

  'priorPeriodPayment', // 前期已收

  'receivableCurrency', // 外銷 收款幣別
  'receivableExchangeRate', // 外銷 收款匯率
  'receivableCurrencyPayment', // 外銷 收款外幣金額
  'receivablePayment', // w 收款金額 新臺幣

  'fee', // 匯費

  'foreignCurrencyFee', // 外銷 國外匯費_外幣
  'foreignFee', // 外銷 國外匯費_新台幣

  'exchangeBenefits', // 外銷 兌換利益

  'note', // 備註
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
          copy.unpaidPayment = calcUnpaidPayment(copy);
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
          copy.unpaidPayment = calcUnpaidPayment(copy);
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
          copy.unpaidPayment = calcUnpaidPayment(copy);
          copy.exchangeBenefits = calcExchangeBebefits(copy);

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

      const inputSelProps: TinputSelProps = {
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value: value,
            onChange: (e) => {
              setState_incomeBillSerial((state) => {
                const copy = { ...state };
                copy.receivablePayment = e.target.value;
                copy.unpaidPayment = calcUnpaidPayment(copy);
                copy.exchangeBenefits = calcExchangeBebefits(copy);

                return copy;
              });
            },
          },
        },
      };

      return inputSelProps;
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
            copy.unpaidPayment = calcUnpaidPayment(copy);

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
    label: (
      <span className={classNames(scss.tipLabel, scss.plus)}>
        餘額 <Tip content={calcIncomeBillUnpaidPayment.description} />
      </span>
    ),
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
                copy.unpaidPayment = calcUnpaidPayment(copy);
                copy.exchangeBenefits = calcExchangeBebefits(copy);

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
    createInputSelProps: ({ disabled, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const inputSelProps: TinputSelProps = {
        disabled: disabled,
        showBaseline: 'auto',
        inputProps: {
          props: {
            // className: 'text-center',
            value: state_incomeBillSerial.vendorName,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  vendorName: e.target.value,
                };
              });
            },
          },
        },
      };

      return inputSelProps;
    },
  },
  //
  //
  //

  declarationCurrency: {
    label: '出口報單幣別',
    style: { width: 150 },
    // className: 'text-center',
    createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const value = state_incomeBillSerial.declarationCurrency ?? '';

      const inputSelProps: TinputSelProps = {
        disabled,
        showBaseline: 'auto',
        selectProps: {
          props: {
            classNames: {
              menuPortal: () => classNames(scss.inputSel_select_menuPortal, scss.plus),
            },
            options: optionsCreator_currency(),
            // className: 'text-center',
            value: {
              value: value,
              label: value,
            },
            onChange: (option) => {
              if (!option) {
                return;
              }

              setState_incomeBillSerial((state) => {
                return {
                  ...state,
                  declarationCurrency: option.value as Tcurrency,
                  declarationExchangeRate: null,
                  declarationCurrencyPayment: null,
                };
              });
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  declarationExchangeRate: {
    label: '出口報單匯率',
    style: { width: 120 },
    // className: 'text-center',
    createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const inputSelProps: TinputSelProps = {
        disabled,
        showBaseline: 'auto',
        inputProps: {
          props: {
            // className: 'text-center',
            value: state_incomeBillSerial.declarationExchangeRate ?? '',
            onChange: (e) => {
              setState_incomeBillSerial((state) => {
                const copy = { ...state };

                copy.declarationExchangeRate = e.target.value;
                const declarationCurrencyPayment_num = calc_twToForeign({
                  exchangeRate: (copy.declarationExchangeRate || 0) as `${number}`,
                  twPayment: (copy.declarationPayment || 0) as `${number}`,
                });
                copy.declarationCurrencyPayment = declarationCurrencyPayment_num.toString();

                return copy;
              });
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  declarationCurrencyPayment: {
    label: '出口報單外幣金額',
    style: { width: 150 },
    className: 'text-right',
    // className: 'text-center',
    createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.declarationCurrencyPayment ?? '',
      });

      // const declarationCurrency = state_incomeBillSerial.declarationCurrency;
      // const currencyCode = declarationCurrency ? extractCurrencyCode(declarationCurrency) : '';

      const inputSelProps: TinputSelProps = {
        // //
        // caption: currencyCode,
        // captionSize: '18',
        // wrapperStyle: { gap: '5px' },
        // //
        disabled,
        showBaseline: 'auto',
        inputProps: {
          props: {
            className: 'text-right',
            // className: 'text-center',
            type,
            value,
            onChange: (e) => {
              setState_incomeBillSerial((state) => {
                const copy = { ...state };
                copy.declarationCurrencyPayment = e.target.value;
                const declarationPayment_num = calc_foreignToTw({
                  exchangeRate: (copy.declarationExchangeRate || 0) as `${number}`,
                  foreignPayment: (copy.declarationCurrencyPayment || 0) as `${number}`,
                });
                copy.declarationPayment = declarationPayment_num.toString();
                copy.exchangeBenefits = calcExchangeBebefits(copy);

                return copy;
              });
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  declarationPayment: {
    label: '出口報單台幣金額',
    style: { width: 150 },
    className: 'text-right',
    // className: 'text-center',
    createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.declarationPayment ?? '',
      });
      const inputSelProps: TinputSelProps = {
        disabled,
        showBaseline: 'auto',
        inputProps: {
          props: {
            type,
            className: 'text-right',
            // className: 'text-center',
            value,
            onChange: (e) => {
              setState_incomeBillSerial((state) => {
                const copy = { ...state };
                copy.declarationPayment = e.target.value;
                const declarationCurrencyPayment_num = calc_twToForeign({
                  exchangeRate: (copy.declarationExchangeRate || 0) as `${number}`,
                  twPayment: (copy.declarationPayment || 0) as `${number}`,
                });
                copy.declarationCurrencyPayment = declarationCurrencyPayment_num.toString();
                copy.exchangeBenefits = calcExchangeBebefits(copy);

                return copy;
              });
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  receivableCurrency: {
    label: '收款幣別',
    style: { width: 150 },
    // className: 'text-center',
    createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const value = state_incomeBillSerial.receivableCurrency ?? '';

      const inputSelProps: TinputSelProps = {
        showBaseline: 'auto',
        selectProps: {
          props: {
            classNames: {
              menuPortal: () => classNames(scss.inputSel_select_menuPortal, scss.plus),
            },
            options: optionsCreator_currency(),
            // className: 'text-center',
            value: {
              value: value,
              label: value,
            },
            onChange: (option) => {
              if (!option) {
                return;
              }

              setState_incomeBillSerial((state) => ({
                ...state,
                receivableCurrency: option.value as Tcurrency,
                receivableExchangeRate: null,
                receivableCurrencyPayment: null,
              }));
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  receivableExchangeRate: {
    label: '收款匯率',
    style: { width: 100 },
    // className: 'text-right',

    createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const inputSelProps: TinputSelProps = {
        inputProps: {
          props: {
            // className: 'text-right',

            value: state_incomeBillSerial.receivableExchangeRate ?? '',
            onChange: (e) => {
              setState_incomeBillSerial((state) => {
                const copy = { ...state };
                copy.receivableExchangeRate = e.target.value;
                const receivableCurrencyPayment_num = calc_twToForeign({
                  exchangeRate: (copy.receivableExchangeRate || 0) as `${number}`,
                  twPayment: (copy.receivablePayment || 0) as `${number}`,
                });
                copy.receivableCurrencyPayment = receivableCurrencyPayment_num.toString();

                copy.foreignFee = calc_foreignToTw({
                  exchangeRate: (copy.receivableExchangeRate || 0) as `${number}`,
                  foreignPayment: (copy.foreignCurrencyFee || 0) as `${number}`,
                }).toString();
                copy.exchangeBenefits = calcExchangeBebefits(copy);

                return copy;
              });
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  receivableCurrencyPayment: {
    label: '收款外幣金額',
    style: { width: 150 },
    className: 'text-right',
    // className: 'text-center',
    createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.receivableCurrencyPayment ?? '',
      });

      const inputSelProps: TinputSelProps = {
        inputProps: {
          props: {
            className: 'text-right',
            // className: 'text-center',
            type,
            value: value,
            onChange: (e) => {
              setState_incomeBillSerial((state) => {
                const copy = { ...state };
                copy.receivableCurrencyPayment = e.target.value;
                const receivablePayment_num = calc_foreignToTw({
                  exchangeRate: (copy.receivableExchangeRate || 0) as `${number}`,
                  foreignPayment: (copy.receivableCurrencyPayment || 0) as `${number}`,
                });
                copy.receivablePayment = receivablePayment_num.toString();

                return copy;
              });
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  exchangeBenefits: {
    label: (
      <span className={classNames(scss.tipLabel, scss.plus)}>
        兌換利益 <Tip content={calcIncomeBillExchangeBenefits.description} />
      </span>
    ),
    style: { width: 150 },
    className: 'text-right',
    createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
      let exchangeBenefits = Number(state_incomeBillSerial.exchangeBenefits ?? '0');
      exchangeBenefits = new Decimal(exchangeBenefits).toDecimalPlaces(0).toNumber();

      const { type, value } = reducer_input({
        disabled: true,
        value: exchangeBenefits,
      });

      const inputSelProps: TinputSelProps = {
        disabled: true,
        showBaseline: 'auto',
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            onChange: (e) => {
              // setState_incomeBillSerial((state) => ({
              //   ...state,
              //   exchangeBenefits: e.target.value,
              // }));
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  foreignCurrencyFee: {
    label: '國外匯費(外幣)',
    style: { width: 150 },
    className: 'text-right',

    createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.foreignCurrencyFee ?? '',
      });

      const inputSelProps: TinputSelProps = {
        disabled,
        showBaseline: 'auto',
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            onChange: (e) => {
              setState_incomeBillSerial((state) => {
                const copy = { ...state };

                copy.foreignCurrencyFee = e.target.value;
                copy.foreignFee = calc_foreignToTw({
                  exchangeRate: (copy.receivableExchangeRate || 0) as `${number}`,
                  foreignPayment: (copy.foreignCurrencyFee || 0) as `${number}`,
                }).toString();
                copy.exchangeBenefits = calcExchangeBebefits(copy);

                return copy;
              });
            }, // onChange
            //
          },
        },
      };

      return inputSelProps;
    },
  },

  foreignFee: {
    label: '國外匯費(新台幣)',
    style: { width: 150 },
    className: 'text-right',

    createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
      // const { type, value } = reducer_input({
      //   disabled,
      //   value: state_incomeBillSerial.currencyFee ?? '',
      // });\\

      let foreignFee: string | number = Number(state_incomeBillSerial.foreignFee ?? '0');
      foreignFee = new Decimal(foreignFee).toDecimalPlaces(0).toNumber().toLocaleString();

      const inputSelProps: TinputSelProps = {
        disabled: true,
        showBaseline: 'auto',
        inputProps: {
          props: {
            className: 'text-right',
            type: 'text',
            value: foreignFee,
            onChange: (e) => {
              // setState_incomeBillSerial((state) => ({
              //   ...state,
              //   currencyFee: e.target.value,
              // }));
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  // internalUnderestimationPayment: {
  //   label: '不足預估之收款',
  //   style: { width: 150 },
  //   className: 'text-right',

  //   createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
  //     const { type, value } = reducer_input({
  //       disabled,
  //       value: state_incomeBillSerial.internalUnderestimationPayment ?? '',
  //     });

  //     const inputSelProps: TinputSelProps = {
  //       disabled,
  //       showBaseline: 'auto',
  //       inputProps: {
  //         props: {
  //           className: 'text-right',
  //           type,
  //           value,
  //           onChange: (e) => {
  //             setState_incomeBillSerial((state) => {
  //               const copy = { ...state };
  //               copy.internalUnderestimationPayment = e.target.value;

  //               return copy;
  //             });
  //           }, // onChange
  //           //
  //         },
  //       },
  //     };

  //     return inputSelProps;
  //   },
  // },

  // foreignUnderestimationPayment: {
  //   label: '不足預估之收款(外銷)',
  //   style: { width: 150 },
  //   className: 'text-right',

  //   createInputSelProps: ({ disabled, isPaperImported, state_incomeBillSerial, setState_incomeBillSerial }) => {
  //     const { type, value } = reducer_input({
  //       disabled,
  //       value: state_incomeBillSerial.foreignUnderestimationPayment ?? '',
  //     });

  //     const inputSelProps: TinputSelProps = {
  //       disabled,
  //       showBaseline: 'auto',
  //       inputProps: {
  //         props: {
  //           className: 'text-right',
  //           type,
  //           value,
  //           onChange: (e) => {
  //             setState_incomeBillSerial((state) => {
  //               const copy = { ...state };
  //               copy.foreignUnderestimationPayment = e.target.value;

  //               return copy;
  //             });
  //           }, // onChange
  //           //
  //         },
  //       },
  //     };

  //     return inputSelProps;
  //   },
  // },

  //
  //
  //
}; // cellPropsList_summon END

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
    receivablePayment,
  } = state_incomeBillSerial;

  const unpaidPayment = calcIncomeBillUnpaidPayment({
    contractPayment: Number(contractPayment),
    periodPayment: Number(periodPayment),
    priorPeriodPayment: Number(priorPeriodPayment),
    deductionPayment: Number(deductionPayment),
    fee: Number(fee),
    receivablePayment: Number(receivablePayment),
  });
  // const unpaidPayment = new Decimal(contractPayment || periodPayment || 0)
  //   .minus(priorPeriodPayment || 0)
  //   .minus(deductionPayment || 0)
  //   .minus(fee || 0)
  //   .toNumber();

  return unpaidPayment.toString();
};

const calcExchangeBebefits = (state_incomeBillSerial: Tstate_incomeBillSerial) => {
  const {
    //
    declarationPayment,
    priorPeriodPayment,
    receivablePayment,
    fee,
    foreignFee,
  } = state_incomeBillSerial;

  const exchangeBenefits = calcIncomeBillExchangeBenefits({
    declarationPayment: Number(declarationPayment || 0),
    priorPeriodPayment: Number(priorPeriodPayment || 0),
    receivablePayment: Number(receivablePayment || 0),
    fee: Number(fee || 0),
    foreignFee: Number(foreignFee || 0),
  });

  return exchangeBenefits.toString();
};

// const calceCurrencyPayment = ({
//   exchangeRate, // tw to foreign
//   twPayment,
//   foreignPayment,
// }:
//   | {
//       exchangeRate: number;
//     } & (
//       | {
//           twPayment: number;
//           foreignPayment?: undefined;
//         }
//       | {
//           twPayment?: undefined;
//           foreignPayment: number;
//         }
//     )) => {
//   if (twPayment) {
//     foreignPayment = new Decimal(twPayment).div(exchangeRate).toNumber();
//   }

//   if (foreignPayment) {
//     twPayment = new Decimal(foreignPayment).times(exchangeRate).toNumber();
//   }

//   return {
//     exchangeRate,
//     twPayment: twPayment as number,
//     foreignPayment: foreignPayment as number,
//   };
// };

const calc_twToForeign = ({
  exchangeRate,
  twPayment,
}: {
  exchangeRate: `${number}`;
  twPayment: number | `${number}`;
}) => {
  return new Decimal(twPayment).div(exchangeRate).toDecimalPlaces(0).toNumber();
};

const calc_foreignToTw = ({
  exchangeRate,
  foreignPayment,
}: {
  exchangeRate: number | `${number}`;
  foreignPayment: number | `${number}`;
}) => {
  return new Decimal(foreignPayment).times(exchangeRate).toDecimalPlaces(2).toNumber();
};

// const calc_exchangeRate = ({
//   foreignPayment,
//   twPayment,
// }: {
//   foreignPayment: number | `${number}`;
//   twPayment: number | `${number}`;
// }) => {
//   return new Decimal(foreignPayment).div(twPayment).toNumber();
// };

const getKeyArr = ({ isForeign }: { isForeign?: boolean } = {}) => {
  let keyArr: TconfigKey[] = keyArr_domain;
  isForeign && (keyArr = keyArr_foreign);

  return keyArr;
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
      //
      //
      //
      isCashierSeen,
      isWorkSupervisorSeen,
      isManagerSeen,
      //
      //
      //
      declarationCurrency,
      declarationExchangeRate,
      declarationCurrencyPayment,
      declarationPayment,
      receivableCurrency,
      receivableExchangeRate,
      receivableCurrencyPayment,
      foreignFee,
      foreignCurrencyFee,
      exchangeBenefits,
      vendorName,
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
      vendorName: vendorName ?? '',

      state_deduction: state_deduction,
      //
      //
      isManagerSeen,
      isCashierSeen,
      isWorkSupervisorSeen,
      //
      //
      declarationCurrency,
      declarationExchangeRate,
      declarationCurrencyPayment,
      declarationPayment,
      receivableCurrency,
      receivableExchangeRate,
      receivableCurrencyPayment,
      foreignFee: foreignFee,
      foreignCurrencyFee,
      exchangeBenefits,
    };

    return defaultState;
  }, [incomeBillSerial]);
};

const checkStatus = (bool: boolean | null | undefined) => {
  return bool ? 'success' : 'error';
};

// 抽出貨幣代碼 // 留著，未來可能會用到
// type Tcurrency = 'TWD 新臺幣' | 'USD 美元';
// const extractCurrencyCode = (currency: Tcurrency) => {
//   const currencyCode = currency.split(' ')[0] as Tcurrency;

//   return currencyCode;
// };

// =============================================================================

export default Summons;
export {
  //
  getKeyArr,
  SummonsRow,
  cellPropsList_summon,
};
