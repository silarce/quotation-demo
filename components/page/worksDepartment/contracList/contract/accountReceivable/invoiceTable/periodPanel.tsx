import React, {
  //
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useContext,
} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Decimal from 'decimal.js';
import moment, { Moment } from 'moment';

// antd
import { Checkbox, Radio, Popover } from 'antd';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
// import { Select } from 'components/global/gear/dataEntry';
import { Select } from 'antd';

// css
import scss from './periodTable.module.scss';

import type {
  TquotationProductDto,
  TcompletedProductDto,
  TretainageType,
  TaccountsReceivableInvoiceDto,
  TquotationContentOtherDto,
  TperiodType,
} from 'js/api/dtoTypes';
import { Toption } from 'js/utils/options/options';

import { Tinvoice_reduce as Tperiod_reduce, Tstate_period } from './periodTable';

// api
import { TaccountantInvoiceBookDto, useGetAccountantInvoiceBook } from 'js/api/api_accountant';
import { useGetAccountReceivableInvoices_all } from 'js/api/api_engineering';

// icon
import { IconEdit, IconCheck02, Icon_info } from 'public/image/icon/svgComponent/svgIcons';

import { AccountReceivableContext } from 'pages/worksDepartment/contractList/contract/accountReceivable';

import { isInteger } from 'js/utils/checkValue';

import { taxRate } from 'config/config_common';
// ==========================================================================

type Tcenter = {
  renderCount?: number; // 判斷是否要rerender用的，來自Tstate_invoice
  caption: string;

  rowArr: {
    itemName: string;
    completedQuantity: string;
    completedPayment: string;
    completedPayment_localeString: string;
    oncompletedQuantityChange: (value: string) => void;
    oncompletedPaymentChange: (value: string) => void;
  }[];
  totals: {
    subTotal: React.ReactNode;
    tax: React.ReactNode;
    contractTotal: React.ReactNode;
  };
  other: Class_OtherNode;
};

type TimperativeHandle_panel = {
  getState: () => Tstate_period;
};

export type { Tcenter, TimperativeHandle_panel };

// ==========================================================================

const options_periodType = (): { value: TperiodType; label: React.ReactNode }[] => [
  {
    value: '訂金',
    label: '訂金',
  },
  {
    value: '貨到',
    label: '貨到',
  },
  {
    value: '支軌',
    label: '支軌',
  },
  {
    value: '安裝',
    label: '安裝',
  },
  {
    value: '送電',
    label: '送電',
  },
  {
    value: '清潔',
    label: '清潔',
  },
  {
    value: '其他',
    label: '其他',
  },
];

const Selector_invoiceBook = selectModalCreator_multi<['invoiceBook']>({
  selectorArr: [
    {
      key: 'invoiceBook',
      caption: '請選擇發票本',
      tip: '不選擇即可清空',
      limit: 1,
      forbiddenCheck_dataList: (data) => {
        return data.isAlreadyDeclare;
      },
    },
  ],
});

const useSelector_contract = (thisContractId: string | undefined) => {
  const Selector_contract = useMemo(() => {
    return selectModalCreator_multi<['contract']>({
      selectorArr: [
        {
          key: 'contract',
          caption: '請選擇同屬合約',
          tip: '不選擇即可清空',
          forbiddenCheck_dataList: (data) => !data.accountReceivableId || thisContractId === data.id,
        },
      ],
    });
  }, [thisContractId]);

  return Selector_contract;
};

// ==========================================================================

// region START

function PeriodPanel_pre(
  {
    indexNumber,
    data_period,
    finalProdArr,
    data_otherArr,
    totalsTotal,
    onPanelStateChange,
    reqPatchInvoiceAllowance,
    reqDeleteInvoice,
    reqDeletePeriod,
    currency,
    contractId,
  }: {
    indexNumber?: string | number;
    data_period?: Tperiod_reduce;
    finalProdArr: TquotationProductDto[];
    data_otherArr: TquotationContentOtherDto[];
    // 用來取代原本的totals，內容為所有totals的總和
    totalsTotal?: {
      subTotal: number;
      tax: number;
      contractTotal: number;
    };
    onPanelStateChange?: (state_invoice: Tstate_period) => void;
    reqPatchInvoiceAllowance?: (invoiceId: string, allowance: number) => void;
    reqDeleteInvoice?: (invoiceId: string) => void;
    reqDeletePeriod?: (periodId: string) => void;
    currency: string;
    contractId?: string;
  },
  ref: React.ForwardedRef<TimperativeHandle_panel>
) {
  const Selector_contract = useSelector_contract(contractId);
  const { haveTax } = useContext(AccountReceivableContext);

  // --------------------------------------------------------------------------
  const isTotal = !!totalsTotal;

  const { defaultState, isNew } = useDefaultState({
    data_period,
    finalProdArr,
    data_otherArr,
  });
  // --------------------------------------------------------------------------

  // region STATE

  const [disabled, setDisabled] = useState(!isNew || !!totalsTotal);
  const [state_period, setState_period] = useState<Tstate_period>(defaultState);

  const [showSelector_invoiceBook, setShowSelector_invoiceBook] = useState(false);
  const [showSelector_contract, setShowSelector_contract] = useState(false);

  // --------------------------------------------------------------------------

  const {
    data: issuedInvoiceArr,
    update: update_issuedInvoiceArr,
    clear: clear_issuedInvoiceArr,
  } = useGetAccountReceivableInvoices_all(
    useMemo(() => {
      return {
        params: {
          pageSize: 9999999,
          sort: 'invoiceNumber',
          filter: {
            accountantInvoiceBookId: { $eq: state_period?.invoiceBook?.id },
          },
        },
        autoUpdate: false,
      };
    }, [state_period?.invoiceBook?.id])
  );

  // --------------------------------------------------------------------------

  // region FUNCTION

  const resetDefault = () => {
    setState_period(defaultState);
  };

  // --------------------------------------------------------------------------

  // region HANDLER

  const handle_editInvoiceRow = ({
    rowIndex,
    key,
    value,
    haveTax,
  }: {
    rowIndex: number;
    key: 'completedQuantity' | 'completedPayment';
    value: string;
    haveTax: boolean;
  }) => {
    setState_period((period) => {
      period = { ...period };

      const row = period.rowArr[rowIndex];
      const basePrice = row.basePrice;

      if (key === 'completedQuantity') {
        row.completedQuantity = value;
        row.completedPayment = new Decimal(value || 0).mul(basePrice).toDecimalPlaces(0).toString();
      } else if (key === 'completedPayment') {
        row.completedPayment = value;
        row.completedQuantity = new Decimal(value || 0).div(basePrice).toDecimalPlaces(3).toString();
      }

      const totals_num = calcTotals(period.rowArr, { haveTax });

      period.subTotal = totals_num.subTotal;
      period.tax = totals_num.tax;
      period.contractTotal = totals_num.contractTotal;

      period.retainage = calcRetainage(period);
      period.price = calcPrice(period, { haveTax });

      return period;
    });
  };

  const handle_editType = (type: Tperiod_reduce['type']) => {
    setState_period((invoice) => {
      invoice = { ...invoice };
      invoice.renderCount++;
      invoice.type = type as Tperiod_reduce['type'];

      return invoice;
    });
  };

  const handle_confirm_allowance = async () => {
    if (!state_period.firstInvoiceId) {
      myAlert.err({ title: '本期未綁定發票' });

      return;
    }

    reqPatchInvoiceAllowance &&
      (await reqPatchInvoiceAllowance(state_period.firstInvoiceId, Number(state_period.allowance || 0)));
  };

  const handle_deleteInvoice = () => {
    if (!reqDeleteInvoice) {
      return;
    }

    if (state_period.firstInvoiceId) {
      const modal = myAlert.btnBar({});
      modal.update({
        title: `確定要刪除發票嗎?`,
        content: (
          <BtnConfirm
            content={`${caption} 發票`}
            onConfirm={async () => {
              await reqDeleteInvoice(state_period.firstInvoiceId!);
              modal.destroy();
            }}
            onCancel={modal.destroy}
          />
        ),
      });
    } else {
      myAlert.err({ title: '發票不存在' });
    }
  };

  const handle_deletePeriod = () => {
    if (!reqDeletePeriod) {
      return;
    }

    if (state_period.firstInvoiceId) {
      myAlert.err({ title: '請先刪除本期發票' });

      return;
    }

    if (state_period.id) {
      const modal = myAlert.btnBar({});
      modal.update({
        title: `確定要刪除本期嗎?`,
        content: (
          <BtnConfirm
            content={`${caption}`}
            onConfirm={async () => {
              state_period.id && (await reqDeletePeriod(state_period.id));
              modal.destroy();
            }}
            onCancel={modal.destroy}
          />
        ),
      });
    } else {
      myAlert.err({ title: `本期 ${caption}不存在` });
    }
  };

  // --------------------------------------------------------------------------

  // region PROPS

  const options_invoiceNumber = useMemo(() => {
    if (!state_period?.invoiceBook || !issuedInvoiceArr) {
      return undefined;
    }

    const {
      alphabeticLetter,

      startNumber,
      endNumber,
    } = state_period.invoiceBook;

    const startNumber_num = Number(startNumber);
    const endNumber_num = Number(endNumber);

    let options: Toption[] = [];

    for (let i = startNumber_num; i <= endNumber_num; i++) {
      const value = String(i).padStart(8, '0');

      options.push({
        value: alphabeticLetter + value,
        label: alphabeticLetter + value,
      });
    }

    options = options.filter((option) => {
      return !issuedInvoiceArr.some((issuedInvoice) => issuedInvoice.invoiceNumber === option.value);
    });

    return options;
  }, [state_period?.invoiceBook, issuedInvoiceArr]);

  const { caption, rowArr, totals, other }: Tcenter = useMemo(() => {
    const {
      //

      renderCount,
      rowArr: rowArr_state,

      period,
      type,

      subTotal,
      tax,
      contractTotal,
    } = state_period;

    let subTotal_d = new Decimal(0);

    const rowArr: Tcenter['rowArr'] = rowArr_state.map((row, rowIndex) => {
      const { itemName, completedQuantity, completedPayment } = row;

      subTotal_d = subTotal_d.add(completedPayment || 0);

      return {
        itemName,
        completedQuantity: completedQuantity,
        completedPayment: completedPayment,
        completedPayment_localeString: Number(completedPayment).toLocaleString(),
        oncompletedQuantityChange: (value) => {
          handle_editInvoiceRow({
            rowIndex,
            key: 'completedQuantity',
            value,
            haveTax,
          });
        },
        oncompletedPaymentChange: (value) => {
          if (!isInteger(value) && value !== '') {
            return;
          }

          handle_editInvoiceRow({
            rowIndex,
            key: 'completedPayment',
            value,
            haveTax,
          });
        },
      };
    });

    let totals = {
      subTotal: subTotal.toLocaleString(),
      tax: tax.toLocaleString(),
      contractTotal: contractTotal.toLocaleString(),
    };

    if (totalsTotal) {
      totals = {
        subTotal: totalsTotal.subTotal.toLocaleString(),
        tax: totalsTotal.tax.toLocaleString(),
        contractTotal: totalsTotal.contractTotal.toLocaleString(),
      };
    }

    // _______________________________________________________________________
    // _______________________________________________________________________

    const other: Tcenter['other'] = new Class_OtherNode({
      state_period,
      setState_period,
      haveTax,
    });

    // _______________________________________________________________________
    // _______________________________________________________________________

    let caption = `第${indexNumber}期請款-${type} 第${period}期`;

    if (totalsTotal) {
      caption = '合計';
    }

    return {
      renderCount,
      caption: caption,
      rowArr,
      totals,
      other,
    };
  }, [state_period, totalsTotal]);

  // _______________________________________________________________________
  // _______________________________________________________________________

  // ==============================================================================
  // region  USE EFFECT
  useEffect(() => {
    // setState_invoice(defaultState);
    resetDefault();
  }, [defaultState]);

  useEffect(() => {
    onPanelStateChange && onPanelStateChange(state_period);
  }, [state_period]);

  useEffect(() => {
    if (state_period?.invoiceBook?.id) {
      update_issuedInvoiceArr();
    } else {
      clear_issuedInvoiceArr();
    }
  }, [state_period?.invoiceBook?.id]);

  // ==============================================================================

  useImperativeHandle(
    ref,
    (): TimperativeHandle_panel => ({
      getState: () => state_period,
    })
  );

  // ==============================================================================
  // region RENDER
  return (
    <div
      className={classNames(scss.invoice, scss.center, isNew && scss.new)}
      onWheel={(e) => {
        const target = e.target as HTMLElement;

        // 修正當input type為number時，避免因為滾輪而意外改變了值
        if (target.tagName === 'INPUT') {
          target.blur();
        }
      }}
    >
      <Thead caption={caption}>
        <div className={scss.top}>
          {isNew && (
            <Select
              className={scss.periosSelect}
              options={options_periodType()}
              value={state_period.type}
              onChange={(value) => {
                handle_editType(value);
              }}
            />
            // <Radio.Group
            //   disabled={disabled}
            //   onChange={(e) => {
            //     handle_editType(e.target.value);
            //   }}
            //   value={state_period.type}
            // >
            //   <Radio value={'請款'}>請款</Radio>
            //   <Radio value={'訂金'}>訂金</Radio>
            // </Radio.Group>
          )}

          {!isNew && caption}
        </div>

        <div className={classNames(scss.captionBar, scss.row)}>
          <span>完成數量</span>
          <span>完成金額</span>
        </div>
      </Thead>

      <Tbody totals={totals} currency={currency}>
        {rowArr.map((row, index) => {
          const {
            itemName,
            completedQuantity: doneQty,
            completedPayment_localeString: donePrice_localeString,
            oncompletedQuantityChange: onDoneQtyChange,
            oncompletedPaymentChange: onDonePriceChange,
          } = row;
          let { completedPayment: donePrice } = row;

          disabled && (donePrice = donePrice_localeString);

          const inputType = disabled ? 'text' : 'number';

          return (
            <div key={index} className={classNames(scss.row)}>
              <TheInput
                className={classNames(disabled && scss.readyOnly)}
                value={doneQty}
                onChange={(e) => onDoneQtyChange(e.target.value)}
                readOnly={disabled}
                type={inputType}
              />
              <CurrencyBox currency={currency}>
                <TheInput
                  className={classNames(disabled && scss.readyOnly)}
                  value={donePrice}
                  onChange={(e) => onDonePriceChange(e.target.value)}
                  readOnly={disabled}
                  type={inputType}
                />
              </CurrencyBox>

              {/* 不記得為什麼會加這個了 */}
              <span className={scss.test}>{itemName}</span>
            </div>
          );
        })}
      </Tbody>

      <Tfoot
        readOnly={disabled}
        node_other={other}
        isTotal={isTotal}
        onConfirm_allowance={handle_confirm_allowance}
        resetDefault={resetDefault}
        setShowSelector={setShowSelector_invoiceBook}
        setShowSelector_contract={setShowSelector_contract}
        currency={currency}
        options_invoiceNumber={options_invoiceNumber}
      />

      {/* <br />
      <br /> */}

      <div className={classNames(scss.deleteBar, isTotal && 'invisible')}>
        {!state_period.allow_EditDeduction_or_deleteInvoice && <p className="text-xl text-main">已連結收款</p>}
        {state_period.allow_EditDeduction_or_deleteInvoice && (
          <>
            <MyButton_v2
              className={classNames(!state_period.firstInvoiceId && 'invisible')}
              theme="danger"
              px="px22"
              py="py4"
              onClick={handle_deleteInvoice}
            >
              刪除發票
            </MyButton_v2>

            <MyButton_v2
              className={classNames(!state_period.id && 'invisible', state_period.firstInvoiceId && 'invisible')}
              theme="danger"
              px="px22"
              py="py4"
              onClick={handle_deletePeriod}
            >
              刪除本期
            </MyButton_v2>
          </>
        )}
      </div>

      <Selector_invoiceBook
        showModal={showSelector_invoiceBook}
        onConfirm={async ([invoiceBookArr]) => {
          const invoiceBook = invoiceBookArr[0] as TaccountantInvoiceBookDto | undefined;

          other.invoiceBook = invoiceBook || null;
        }}
        onCancel={() => setShowSelector_invoiceBook(false)}
      />

      <Selector_contract
        showModal={showSelector_contract}
        defaultSeletedDataArrArr={[[...other.contractArr]]}
        onConfirm={(theArr) => {
          const contractArr = theArr[0];

          other.contractArr = contractArr;
        }}
        onCancel={() => {
          setShowSelector_contract(false);
        }}
      />
    </div>
  );
}

// region END

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// region COMPONENT
//
//
//
//
//

const BtnConfirm = ({
  //
  content,
  onConfirm,
  onCancel,
}: {
  content?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div>
      <p className={'mt-5'}>{content}</p>
      <div className="flex gap-5 mt-10">
        <MyButton_v2 onClick={onCancel}>取消</MyButton_v2>
        <MyButton_v2 onClick={onConfirm} theme="danger">
          確定
        </MyButton_v2>
      </div>
    </div>
  );
};

// region Thead
const Thead = ({ caption, children }: { caption?: React.ReactNode; children: React.ReactNode[] }) => {
  return (
    <div className={scss.thead}>
      {children && (
        <>
          {children[0]}
          {children[1]}
        </>
      )}
    </div>
  );
};

// region Tbody
const Tbody = ({
  children,
  totals: { subTotal, tax, contractTotal },
  isConrtract,
  currency,
}: {
  children: React.ReactNode;
  totals: Tcenter['totals'];
  isConrtract?: boolean;
  currency: string;
}) => {
  const { haveTax } = useContext(AccountReceivableContext);

  const tax_str = new Decimal(taxRate).mul(100).toString();
  const label_tax = haveTax ? `營業稅${tax_str}%` : '無營業稅';

  return (
    <div className={scss.tbody}>
      <div>{children}</div>
      <div className={classNames(scss.totals)}>
        <span>{isConrtract ? '合約合計' : '本期合計'}</span>
        <CurrencyBox currency={currency} width="120px">
          {subTotal}
        </CurrencyBox>

        <span>{label_tax}</span>
        <CurrencyBox currency={currency} width="120px">
          {tax}
        </CurrencyBox>

        <span>
          <span>{isConrtract ? '合約總計' : '本期總計'}</span>
        </span>
        <CurrencyBox currency={currency} width="120px">
          {contractTotal}
        </CurrencyBox>
      </div>
    </div>
  );
};

// region Tfoot

const Tfoot = ({
  //
  readOnly,
  node_other: class_other,
  isTotal,
  onConfirm_allowance: onConfirm_allowance,
  resetDefault,
  setShowSelector,
  setShowSelector_contract,
  currency,
  options_invoiceNumber,
}: {
  readOnly: boolean;
  node_other: Tcenter['other'];
  isTotal: boolean;
  onConfirm_allowance: () => void;
  resetDefault: () => void;
  setShowSelector: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSelector_contract: React.Dispatch<React.SetStateAction<boolean>>;
  currency: string;
  options_invoiceNumber: Toption[] | undefined;
}) => {
  const {
    invoiceNumber,
    price,

    retainage_localeString,
    deduction_localeString,
    writeOffDeposit_localeString,
    actualPrice_localeString,

    minusRetainage: haveRetainage,
    minusDeduction: haveDeduction,
    minusWriteOffDeposit: haveWriteOffDeposit,

    retainageType,
    allowance,
    note,

    allowEditDeduction,

    invoiceDate,
  } = class_other;

  let { retainage, deduction, writeOffDeposit, actualPrice } = class_other;

  if (readOnly) {
    retainage = retainage_localeString;
    deduction = deduction_localeString;
    writeOffDeposit = writeOffDeposit_localeString;
    actualPrice = actualPrice_localeString;
  }

  // ------------------------------------------------------------------

  const [disabled_allowance, setDisabled_allowance] = useState(true);

  let showInvoiceNumberCheck = true;

  // ------------------------------------------------------------------

  const inputType = readOnly ? 'text' : 'number';

  if (readOnly) {
    showInvoiceNumberCheck = false;
  } else if (!invoiceNumber) {
    showInvoiceNumberCheck = false;
  }

  // ------------------------------------------------------------------
  const handle_confirm_allowance = async () => {
    onConfirm_allowance && (await onConfirm_allowance());
    setDisabled_allowance(true);
  };
  // ------------------------------------------------------------------

  useEffect(() => {
    if (disabled_allowance) {
      resetDefault();
    }
  }, [disabled_allowance]);

  // ------------------------------------------------------------------

  // region Tfoot Render

  return (
    <div className={classNames(scss.tfoot)}>
      <div className={classNames(scss.row)}>
        {/* <span>保留款</span> */}
        <div className={scss.totalInfoWrapper}>
          <Popover
            //
            trigger="hover"
            title="保留款由下方的保留款百分比與含稅未稅選項決定"
            content={
              <div>
                圈選含稅
                <br />
                保留款 = 保留款百分比 * 本期合計
                <br />
                <br />
                圈選未稅
                <br />
                保留款 = 保留款百分比 * 本期總計
                <br />
                <br />
                圈選無則保留款為0
                <br />
                <br />
                編輯完成數量或完成金額會依據保留款百分比與含稅未稅計算保留款
                <br />
                編輯保留款會依據本期合計或本期總計計算保留款百分比
              </div>
            }
          >
            <span>
              <Icon_info />
            </span>
          </Popover>
          保留款
        </div>

        <CurrencyBox currency={currency}>
          <TheInput
            className={classNames((readOnly || class_other.isRetainageLocked) && scss.readyOnly)}
            value={retainage}
            onChange={(e) => {
              class_other.retainage = e.target.value;
            }}
            readOnly={readOnly || class_other.isRetainageLocked}
            type={inputType}
          />
        </CurrencyBox>
      </div>

      <div className={classNames(scss.row)}>
        <span>扣款</span>

        <CurrencyBox currency={currency}>
          <TheInput
            className={classNames((readOnly || !allowEditDeduction) && scss.readyOnly)}
            value={deduction}
            onChange={(e) => (class_other.deduction = e.target.value)}
            readOnly={readOnly || !allowEditDeduction}
            type={inputType}
          />
        </CurrencyBox>
      </div>

      <div className={classNames(scss.row)}>
        <span>沖訂金</span>
        <CurrencyBox currency={currency}>
          <TheInput
            className={classNames(readOnly && scss.readyOnly)}
            value={writeOffDeposit}
            onChange={(e) => (class_other.writeOffDeposit = e.target.value)}
            readOnly={readOnly}
            type={inputType}
          />
        </CurrencyBox>
      </div>

      <div className={classNames(isTotal && 'invisible')}>
        <div className="flex gap-2">
          <span>保留款</span>
          <InputSel
            //
            wrapperStyle={{ width: 60, gap: '5px' }}
            fontSize="14"
            disabled={readOnly || class_other.retainageType === 'null'}
            showBaseline="auto"
            inputProps={{
              props: {
                type: 'number',
                placeholder: '',
                value: class_other.retainagePercent,
                onChange: (e) => {
                  class_other.retainagePercent = e.target.value;
                },
              },
            }}
            suffix="%"
          />
        </div>

        <div className={scss.checkBar}>
          <Radio.Group
            disabled={readOnly}
            value={retainageType}
            onChange={(e) => {
              class_other.retainageType = e.target.value;
            }}
          >
            <Radio value={'含稅' as TretainageType}>含稅</Radio>
            <Radio value={'未稅' as TretainageType}>未稅</Radio>
            <Radio value={'null'}>無</Radio>
          </Radio.Group>
        </div>
      </div>

      <div className={classNames(scss.checkBar, isTotal && 'invisible')}>
        <Checkbox
          disabled={readOnly}
          checked={haveRetainage}
          onChange={(e) => {
            class_other.minusRetainage = e.target.checked;
          }}
        >
          保留款
        </Checkbox>
        <Checkbox
          disabled={readOnly}
          checked={haveDeduction}
          onChange={(e) => {
            class_other.minusDeduction = e.target.checked;
          }}
        >
          扣款
        </Checkbox>
        <Checkbox
          disabled={readOnly}
          checked={haveWriteOffDeposit}
          onChange={(e) => {
            class_other.minusWriteOffDeposit = e.target.checked;
          }}
        >
          沖訂金
        </Checkbox>
      </div>

      <div className={classNames(scss.row)}>
        <div className={scss.totalInfoWrapper}>
          <Popover trigger="hover" title="計算方式" content={<span>金額總計 = 本期總計 - 保留款 - 扣款 - 冲訂金</span>}>
            <span>
              <Icon_info />
            </span>
          </Popover>
          金額總計
        </div>
        <CurrencyBox currency={currency}>
          <span>{price}</span>
        </CurrencyBox>
      </div>

      <div className={classNames(scss.row, isTotal && 'invisible')}>
        <div className={scss.totalInfoWrapper}>
          <Popover trigger="hover" content={<span>發票實際金額與發票本沒有值的時候強制設為不勾選</span>}>
            <span>
              <Icon_info />
            </span>
          </Popover>
          額外收入
        </div>
        {/* isOriginalCustomer為false，此筆請款視為額外收入 */}
        {/* 注意 checked與onChange都做了布林值逆轉 */}
        <div className="m-auto ml-0 relative top-[-3px]">
          <Checkbox
            checked={!class_other.isOriginalCustomer}
            onChange={(e) => {
              if (readOnly || class_other.isOriginalCustomerLocked) {
                return;
              }

              class_other.isOriginalCustomer = !e.target.checked;
            }}
          />
        </div>
      </div>

      <div className={classNames(scss.row, isTotal && 'invisible')}>
        <div className={scss.totalInfoWrapper}>
          <Popover trigger="hover" content={<span>是否為舊的手key發票</span>}>
            <span>
              <Icon_info />
            </span>
          </Popover>
          舊發票
        </div>

        <div className="m-auto ml-0 relative top-[-3px]">
          <Checkbox
            checked={class_other.isOlderInvoice}
            onChange={(e) => {
              if (readOnly) {
                return;
              }

              class_other.isOlderInvoice = e.target.checked;
            }}
          />
        </div>
      </div>

      <div className={classNames(scss.row)}>
        <div className={scss.totalInfoWrapper}>
          <Popover
            trigger="hover"
            title="發票實際金額或發票本有值的時候視為有發票"
            content="這時必須填寫發票實際金額、發票本、發票日期、發票號碼"
          >
            <span>
              <Icon_info />
            </span>
          </Popover>
          發票實際金額
        </div>
        <CurrencyBox currency={<span className="font-bold">TWD</span>}>
          <TheInput
            className={classNames(readOnly && scss.readyOnly)}
            value={actualPrice}
            onChange={(e) => (class_other.actualPrice = e.target.value)}
            readOnly={readOnly}
            type={inputType}
          />
        </CurrencyBox>
      </div>

      <div className={classNames(scss.row, isTotal && 'invisible')}>
        <div className={scss.totalInfoWrapper}>
          <Popover
            trigger="hover"
            title="先選擇發票本才可以選擇發票日期與發票號碼"
            content="點擊後請先選擇右上方的日期。若不選擇便會清空發票本"
          >
            <span>
              <Icon_info />
            </span>
          </Popover>
          發票本
        </div>
        <InputSel
          disabled={readOnly}
          showBaseline="auto"
          onClick={() => {
            !class_other.isOlderInvoice && setShowSelector(true);
          }}
          inputProps={{
            props: {
              value: class_other.invoiceBook?.alphabeticLetter ?? '',
              readOnly: class_other.isOlderInvoice,
              onChange: () => {},
            },
          }}
        />
      </div>

      <div className={classNames(scss.row, isTotal && 'invisible')}>
        <span>發票日期</span>
        <InputSel
          key={class_other.invoiceDateRange?.toISOString()}
          disabled={readOnly}
          showBaseline="auto"
          datePickerProps={{
            props: {
              defaultPickerValue: class_other.invoiceDateRange,
              value: invoiceDate,
              onChange: (date_m) => {
                date_m && (date_m = date_m.startOf('day'));
                class_other.invoiceDate = date_m;
              },
              // disabledDate: (date_m) => class_other.disabledInvoiceDate(date_m),
            },
          }}
        />
      </div>

      <div className={classNames(scss.row, isTotal && 'invisible')}>
        <div className={scss.invoiceNumberSpinWrapper}>
          <span>發票號碼</span>
        </div>

        <InputSel
          disabled={readOnly}
          showBaseline="auto"
          {...(() => {
            const selectProps: TinputSelProps['selectProps'] = {
              props: {
                value: { label: class_other.invoiceNumber, value: class_other.invoiceNumber },
                // options: class_other.invoiceNumberOptions,
                options: options_invoiceNumber,
                onChange: (option) => {
                  const value = option?.value || '';
                  class_other.invoiceNumber = value;
                },
              },
            };

            const inputProps: TinputSelProps['inputProps'] = {
              props: {
                value: class_other.invoiceNumber,
                onChange: (e) => {
                  class_other.invoiceNumber = e.target.value;
                },
              },
            };

            const inputSelProps = class_other.isOlderInvoice ? { inputProps } : { selectProps };

            return inputSelProps;
          })()}
        />
      </div>

      <div className={classNames(scss.row, isTotal && 'invisible')}>
        <span>發票買受人</span>
        <InputSel
          disabled={readOnly}
          showBaseline="auto"
          textareaProps={{
            props: {
              minRows: 2,
              value: class_other.nameOfBusinessEntity,
              onChange: (e) => (class_other.nameOfBusinessEntity = e.target.value),
            },
          }}
        />
      </div>

      <div className={classNames(scss.row, isTotal && 'invisible')}>
        <span>發票統一編號</span>
        <TheInput
          className={classNames(readOnly && scss.readyOnly)}
          value={class_other.businessIdNumber}
          onChange={(e) => (class_other.businessIdNumber = e.target.value)}
          readOnly={readOnly}
        />
      </div>

      {/*  */}
      {/*  */}
      {/*  */}
      <div className={classNames(scss.row)}>
        <div className={scss.allowancePanel}>
          <span className={classNames(scss.allowanceBtnBar, (!readOnly || isTotal) && 'invisible')}>
            <IconEdit
              className={classNames(!disabled_allowance && scss.active)}
              onClick={() => {
                setDisabled_allowance((bool) => !bool);
              }}
            />
            <IconCheck02
              //
              className={classNames(disabled_allowance && 'invisible')}
              onClick={handle_confirm_allowance}
            />
          </span>
          <span>折讓</span>
        </div>
        <CurrencyBox currency={<span className="font-bold">TWD</span>}>
          <TheInput
            readOnly={readOnly === false ? false : disabled_allowance}
            className={classNames(readOnly === false ? false : disabled_allowance && scss.readyOnly)}
            type="number"
            value={allowance}
            onChange={(e) => (class_other.allowance = e.target.value)}
          />
        </CurrencyBox>
      </div>
      {/*  */}
      {/*  */}
      {/*  */}
      <div className={classNames(scss.row, isTotal && 'invisible')}>
        <span>備註</span>
        <TheInput
          className={classNames(readOnly && scss.readyOnly)}
          value={note}
          onChange={(e) => (class_other.note = e.target.value)}
          readOnly={readOnly}
        />
      </div>

      <div
        className={classNames(
          //
          scss.row,
          scss.contractRow,
          scss.plus,
          (class_other.id || isTotal) && 'invisible'
        )}
      >
        <span>同屬合約</span>
        <div className={scss.contractList} onClick={() => setShowSelector_contract(true)}>
          {class_other.contractArr.length === 0 && <span className={scss.placeholder}>點擊新增</span>}

          {class_other.contractArr.map((contract) => {
            const {
              id,
              contractNumber,
              content: { projectName },
            } = contract;

            return (
              <div key={id} className={scss.contract}>
                <span>{contractNumber}</span>
                <span>{projectName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// MARK: CurrencyBox
const CurrencyBox = ({
  className,
  currency,
  children,
  width,
}: {
  className?: string;
  currency: React.ReactNode;
  children: React.ReactNode;
  width?: React.CSSProperties['width'];
}) => {
  // const { className, currency, children } = props;

  return (
    <span className={classNames(scss.currencyInput, className, !width && 'w-full', width && `w-[${width}]`)}>
      <span>{currency}</span>
      {children}
    </span>
  );
};

// MARK: TheInput
const TheInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className, ...rest } = props;

  return <input {...rest} className={classNames(scss.theInput, className)} />;
};

// ==========================================================================

// region FUNCTION

const calcTotals = (
  //
  rowArr: { completedPayment: number | string }[],
  { haveTax }: { haveTax: boolean }
) => {
  let subTotal_d = new Decimal(0);

  rowArr.forEach((row) => {
    const completedPayment = Number(row.completedPayment);
    subTotal_d = subTotal_d.add(completedPayment);
  });

  const taxRate_ = haveTax ? taxRate : 0;

  const tax_d = subTotal_d.mul(taxRate_).toDecimalPlaces(0);

  return {
    subTotal: subTotal_d.toNumber(),
    tax: tax_d.toNumber(),
    contractTotal: subTotal_d.add(tax_d).toNumber(),
  };
};

const calcPrice = (state_period: Tstate_period, { haveTax }: { haveTax: boolean }) => {
  const period = state_period;

  const {
    //
    retainage,
    deduction,
    writeOffDeposit,
    minusRetainage,
    minusDeduction,
    minusWriteOffDeposit,
  } = period;

  const totals_num = calcTotals(period.rowArr, { haveTax });
  let price_d = new Decimal(totals_num.contractTotal);

  minusRetainage && (price_d = price_d.sub(retainage || 0));
  minusDeduction && (price_d = price_d.sub(deduction || 0));
  minusWriteOffDeposit && (price_d = price_d.sub(writeOffDeposit || 0));

  const price = price_d.toNumber();

  return price;
};

const calcRetainage = (state_period: Tstate_period) => {
  const period = state_period;

  const { subTotal, contractTotal, retainageType, retainagePercent } = period;

  const percent = new Decimal(retainagePercent || 0).div(100);

  let retainage = '';

  if (retainageType === '含稅') {
    retainage = new Decimal(contractTotal).mul(percent).toDecimalPlaces(0).toString();
  } else if (retainageType === '未稅') {
    retainage = new Decimal(subTotal).mul(percent).toDecimalPlaces(0).toString();
  }

  return retainage;
};

const calcRegainagePercent = (state_period: Tstate_period) => {
  const period = state_period;

  const { subTotal, contractTotal, retainageType, retainage } = period;

  const percent = new Decimal(retainage || 0)
    .div(retainageType === '含稅' ? contractTotal : subTotal)
    .mul(100)
    .toDecimalPlaces(2);

  return percent.toString();
};

// ==========================================================================

// region Hook

const useDefaultState = ({
  //
  data_period,
  finalProdArr,
  data_otherArr,
}: {
  data_period: Tperiod_reduce | undefined;
  finalProdArr: TquotationProductDto[];
  data_otherArr: TquotationContentOtherDto[];
}) => {
  const { customer, haveTax } = useContext(AccountReceivableContext);

  const { defaultState, isNew } = useMemo(() => {
    const isNew = !data_period;

    const {
      //
      id: periodId,
      type,
      period,
      depositPeriod,
      completedProduct = [],
      retainage,
      deduction,
      writeOffDeposit,
      isRetainage,
      isDeduction,
      isWriteOffDeposit,
      //
      retainageType,
      retainagePercent,

      note,
      //
      invoices,
      price,
    } = data_period ?? create_emptyPeriod();

    const notAllow_EditDeduction_or_deleteInvoice = invoices.some((invoice) => {
      return invoice.incomeBillSerialList?.some(({ accountsReceivableDeduction }) => {
        return accountsReceivableDeduction && accountsReceivableDeduction.length > 0;
      });
    });

    const completedProductList: { [id: string]: TcompletedProductDto } = {};
    completedProduct?.forEach((cp) => {
      completedProductList[cp.productId] = cp;
    });

    const rowArr: Tstate_period['rowArr'] = finalProdArr.map((finalProd) => {
      const { id: finalProdId, itemName } = finalProd;

      const cp = completedProductList[finalProdId] || {
        productId: finalProdId,
        basePrice: finalProd.unitPrice,
        completedQuantity: '',
        completedPayment: '',
      };

      return {
        ...cp,
        itemName,
        basePrice: finalProd.unitPrice,
        completedQuantity: String(cp.completedQuantity),
        completedPayment: String(cp.completedPayment),
      };
    });
    const rowArr_other: Tstate_period['rowArr'] = data_otherArr.map((other) => {
      const { id, item, unitPrice } = other;
      const cp = completedProductList[id] || {
        productId: id,
        basePrice: unitPrice,
        completedQuantity: '',
        completedPayment: '',
      };

      return {
        ...cp,
        itemName: item,
        basePrice: unitPrice,
        completedQuantity: String(cp.completedQuantity),
        completedPayment: String(cp.completedPayment),
      };
    });

    rowArr.push(...rowArr_other);

    const totals_num = calcTotals(rowArr, { haveTax });

    // 目前發票只會有一張，UI與post,patch的用法都是假設發票只有一張的情況
    const invoice: TaccountsReceivableInvoiceDto | undefined = invoices[0] as TaccountsReceivableInvoiceDto | undefined;
    const {
      //
      id: invoiceId,
      invoiceDate,
      invoiceNumber = '',
      nameOfBusinessEntity,
      businessIdNumber,
      isOlderInvoice = false,
    } = invoice ?? {};

    let { actualPrice = 0, allowance = 0, isOriginalCustomer = true } = invoice ?? {};
    !invoiceId && (isOriginalCustomer = true);

    // 如果是最後的totalPanel，invoices會有多項。未來invoices也可能會有多項
    if (invoices.length > 1) {
      const totals = invoices.reduce(
        (acc, cur) => {
          acc.actualPrice += cur.actualPrice;
          acc.allowance += cur.allowance ?? 0;

          return acc;
        },
        { actualPrice: 0, allowance: 0 }
      );

      actualPrice = totals.actualPrice;
      allowance = totals.allowance;
    }

    const defaultState: Tstate_period = {
      id: periodId,
      firstInvoiceId: invoice?.id ?? null,
      renderCount: 0,
      rowArr,
      retainage: String(retainage || ''),
      deduction: String(deduction || ''),
      writeOffDeposit: String(writeOffDeposit || ''),
      price: price || 0,
      invoiceNumber,

      type,
      period: period || depositPeriod || 0,

      minusRetainage: isRetainage,
      minusDeduction: isDeduction,
      minusWriteOffDeposit: isWriteOffDeposit,

      subTotal: totals_num.subTotal,
      tax: totals_num.tax,
      contractTotal: totals_num.contractTotal,

      retainageType: retainageType || 'null',
      retainagePercent: retainagePercent || '',

      allowance: String(allowance || ''),
      note: note || '',

      allow_EditDeduction_or_deleteInvoice: !notAllow_EditDeduction_or_deleteInvoice,

      actualPrice: String(actualPrice || ''),
      invoiceDate: invoiceDate ? moment(invoiceDate) : null,
      invoiceBook: invoice?.accountantInvoiceBook ?? null,

      //

      nameOfBusinessEntity: (isNew ? customer?.name : nameOfBusinessEntity) ?? '',
      businessIdNumber: (isNew ? customer?.taxId : businessIdNumber) ?? '',
      isOriginalCustomer,
      isOlderInvoice,
      //
      contractArr: [],
    };

    return { defaultState, isNew };
  }, [data_period, finalProdArr]);

  return {
    defaultState,
    isNew,
  };
};

// ==========================================================================

// MARK: Class_OtherNode
class Class_OtherNode {
  constructor({
    //
    state_period,
    setState_period,
    haveTax,
  }: {
    state_period: Tstate_period;
    setState_period: React.Dispatch<React.SetStateAction<Tstate_period>>;
    haveTax: boolean;
  }) {
    this.state_period = _.cloneDeep(state_period);
    this.setState_period = setState_period;
    this.haveTax = haveTax;
  }

  readonly state_period: Tstate_period;
  readonly setState_period: React.Dispatch<React.SetStateAction<Tstate_period>>;
  readonly haveTax: boolean;
  // --------------------------------------------------------------------------

  get id() {
    return this.state_period.id;
  }

  get price() {
    const price = this.state_period.price;

    return price ? price.toLocaleString() : '';
  }

  get invoiceNumber() {
    return this.state_period.invoiceNumber;
  }
  set invoiceNumber(value) {
    this.setState_period((period) => ({
      ...period,
      invoiceNumber: value,
    }));
  }

  get retainage() {
    return this.state_period.retainage;
  }

  set retainage(value) {
    if (!isInteger(value) && value !== '') {
      return;
    }

    this.setState_period((period) => {
      period = { ...period };
      period.retainage = value;
      period.price = calcPrice(period, { haveTax: this.haveTax });

      period.retainagePercent = calcRegainagePercent(period);

      return period;
    });
  }

  get retainage_localeString() {
    const retainage = this.state_period.retainage;

    return retainage ? Number(retainage).toLocaleString() : '';
  }

  get deduction() {
    return this.state_period.deduction;
  }
  set deduction(value) {
    if (!isInteger(value) && value !== '') {
      return;
    }

    this.setState_period((period) => {
      period = { ...period };
      period.deduction = value;
      period.price = calcPrice(period, { haveTax: this.haveTax });

      return period;
    });
  }

  get deduction_localeString() {
    const deduction = this.state_period.deduction;

    return deduction ? Number(deduction).toLocaleString() : '';
  }

  get writeOffDeposit() {
    return this.state_period.writeOffDeposit;
  }
  set writeOffDeposit(value) {
    if (!isInteger(value) && value !== '') {
      return;
    }

    this.setState_period((period) => {
      period = { ...period };
      period.writeOffDeposit = value;
      period.price = calcPrice(period, { haveTax: this.haveTax });

      return period;
    });
  }

  get writeOffDeposit_localeString() {
    const writeOffDeposit = this.state_period.writeOffDeposit;

    return writeOffDeposit ? Number(writeOffDeposit).toLocaleString() : '';
  }

  get minusRetainage() {
    return this.state_period.minusRetainage;
  }
  set minusRetainage(bool) {
    this.setState_period((period) => {
      period = { ...period };
      period.minusRetainage = bool;
      period.price = calcPrice(period, { haveTax: this.haveTax });

      return period;
    });
  }

  get minusDeduction() {
    return this.state_period.minusDeduction;
  }
  set minusDeduction(bool) {
    this.setState_period((period) => {
      period = { ...period };
      period.minusDeduction = bool;
      period.price = calcPrice(period, { haveTax: this.haveTax });

      return period;
    });
  }

  get minusWriteOffDeposit() {
    return this.state_period.minusWriteOffDeposit;
  }
  set minusWriteOffDeposit(bool) {
    this.setState_period((period) => {
      period = { ...period };
      period.minusWriteOffDeposit = bool;
      period.price = calcPrice(period, { haveTax: this.haveTax });

      return period;
    });
  }

  get retainageType() {
    return this.state_period.retainageType;
  }
  set retainageType(value) {
    this.setState_period((period) => {
      period = { ...period };
      period.retainageType = value;

      if (value === 'null') {
        period.retainagePercent = '';
      } else if (!period.retainagePercent) {
        period.retainagePercent = '10';
      }

      period.retainage = calcRetainage(period);
      period.price = calcPrice(period, { haveTax: this.haveTax });

      return period;
    });
  }

  get retainagePercent() {
    return this.state_period.retainagePercent;
  }
  set retainagePercent(value) {
    this.setState_period((period) => {
      period = { ...period };
      period.retainagePercent = value;
      period.retainage = calcRetainage(period);
      period.price = calcPrice(period, { haveTax: this.haveTax });

      return period;
    });
  }

  get allowance() {
    return this.state_period.allowance;
  }
  set allowance(value) {
    if (!isInteger(value) && value !== '') {
      return;
    }

    this.setState_period((period) => ({
      ...period,
      allowance: value,
    }));
  }

  get note() {
    return this.state_period.note;
  }
  set note(value) {
    this.setState_period((period) => ({
      ...period,
      note: value,
    }));
  }

  get actualPrice() {
    return this.state_period.actualPrice;
  }
  set actualPrice(string) {
    if (!isInteger(string) && string !== '') {
      return;
    }

    const isEmpty = !!string;

    this.setState_period((period) => ({
      ...period,
      actualPrice: string,
      isOriginalCustomer: isEmpty === true ? true : period.isOriginalCustomer,
    }));
  }

  get actualPrice_localeString() {
    const actualPrice = this.state_period.actualPrice;

    return actualPrice ? Number(actualPrice).toLocaleString() : '';
  }

  get invoiceDate() {
    return this.state_period.invoiceDate;
  }
  set invoiceDate(date_m) {
    this.setState_period((period) => ({
      ...period,
      invoiceDate: date_m,
    }));
  }

  get nameOfBusinessEntity() {
    return this.state_period.nameOfBusinessEntity;
  }

  set nameOfBusinessEntity(value) {
    this.setState_period((period) => ({
      ...period,
      nameOfBusinessEntity: value,
    }));
  }

  get businessIdNumber() {
    return this.state_period.businessIdNumber;
  }

  set businessIdNumber(value) {
    this.setState_period((period) => ({
      ...period,
      businessIdNumber: value,
    }));
  }

  get isOriginalCustomer() {
    return this.state_period.isOriginalCustomer;
  }

  set isOriginalCustomer(bool) {
    this.setState_period((period) => ({
      ...period,
      isOriginalCustomer: bool,
    }));
  }

  get contractArr() {
    return this.state_period.contractArr;
  }
  set contractArr(arr) {
    this.setState_period((period) => ({
      ...period,
      contractArr: arr,
    }));
  }

  // --------------------------------------------------------------------------
  get allowEditDeduction() {
    return this.state_period.allow_EditDeduction_or_deleteInvoice;
  }

  get invoiceBook() {
    return this.state_period.invoiceBook;
  }
  set invoiceBook(invoiceBook) {
    const isEmpty = !!invoiceBook;

    this.setState_period((period) => ({
      ...period,
      invoiceBook,
      // invoiceDate: null,
      invoiceNumber: '',
      isOriginalCustomer: isEmpty === true ? true : period.isOriginalCustomer,
    }));
  }

  get isOriginalCustomerLocked() {
    if (!this.actualPrice && !this.invoiceBook) {
      return true;
    } else {
      return false;
    }
  }

  get isRetainageLocked() {
    const retainageType = this.state_period.retainageType;

    if (retainageType === 'null') {
      return true;
    }
  }

  // 舊發票
  get isOlderInvoice() {
    return this.state_period.isOlderInvoice;
  }

  set isOlderInvoice(bool: boolean) {
    this.setState_period((state) => ({
      ...state,
      isOlderInvoice: bool,
      invoiceBook: null,
    }));
  }

  get invoiceDateRange() {
    if (!this.invoiceBook) {
      return undefined;
    }

    const { year, month } = this.invoiceBook;

    return moment()
      .year(Number(year))
      .month(Number(month) - 1);
  }

  get invoiceNumberOptions() {
    const invoiceBook = this.invoiceBook;

    if (!invoiceBook) {
      return [];
    }

    const {
      alphabeticLetter,

      startNumber,
      endNumber,

      latestInvoiceNumber,
    } = invoiceBook;

    const startNumber_num = latestInvoiceNumber ? Number(latestInvoiceNumber) + 1 : Number(startNumber);
    const endNumber_num = Number(endNumber);

    const options: Toption[] = [];

    for (let i = startNumber_num; i <= endNumber_num; i++) {
      const value = String(i).padStart(8, '0');

      options.push({
        value: alphabeticLetter + value,
        label: alphabeticLetter + value,
      });
    }

    return options;
  }

  // ------------------------------------------------------------------------------
  disabledInvoiceDate(currentDate: Moment): boolean {
    if (this.isOlderInvoice) {
      return false;
    }

    let disabled = true;

    if (!this.invoiceBook) {
      return disabled;
    }

    const { year, month, latestInvoiceDate } = this.invoiceBook;

    const bookDate = moment(`${year}-${month}`, 'YYYY-MM');
    const bookDate_next = moment(`${year}-${Number(month) + 1}`, 'YYYY-MM');

    const latestInvoiceDate_m = moment(latestInvoiceDate).endOf('date');
    const begin = latestInvoiceDate_m.subtract(1, 'day');

    if (currentDate.isSame(bookDate, 'month') || currentDate.isSame(bookDate_next, 'month')) {
      if (!latestInvoiceDate) {
        disabled = false;
      } else {
        disabled = currentDate.isBefore(begin);
      }
    }

    return disabled;
  }
} // Class_OtherNode

// ===============================================================================
const create_emptyPeriod = (): Tperiod_reduce => {
  const invoice: Tperiod_reduce = {
    id: '',
    updatedAt: 'undefined',

    type: '訂金',
    period: null,
    depositPeriod: null,

    completedProduct: [],
    retainage: 0,
    deduction: 0,
    writeOffDeposit: 0,
    isRetainage: false,
    isDeduction: false,
    isWriteOffDeposit: false,
    retainageType: '含稅',
    retainagePercent: '10',

    note: '',

    invoices: [],
    price: 0,
  };

  return invoice;
};

const PeriodPanel = forwardRef(PeriodPanel_pre);

export { Thead, Tbody, Tfoot, CurrencyBox };
export default PeriodPanel;
