import { useState, useEffect } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// component
import { ExportToIncomeBill } from './exportToIncomeBill';
// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// icon
import { IconCheck02, IconEdit, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './index.module.scss';

import {
  TaccountantKey,
  //
  lookup_keyArr,
  rowCellPropsList,
} from './rowCellProps';

import { TpaymentType, Tstate_accountant, TreqPost, TreqPatch, TreqPostPatchIsImported, TreqDelete } from '.';

// type
import type { Toption } from 'js/utils/options/options';
import type { TaccountantDto, TaccountsReceivableDeductionDto } from 'js/api/dtoTypes';

import { calcQuota } from './function';

// ============================================================================
const Cell_span = ({
  //
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) => {
  return (
    <div className={classNames(scss.cell, scss.cell_span, className)} style={style}>
      {children}
    </div>
  );
};

// ============================================================================
const Thead = ({ paymentType }: { paymentType: TpaymentType }) => {
  const keyArr = lookup_keyArr[paymentType];

  return (
    <div className={classNames(scss.row, scss.thead)}>
      {keyArr.map((key) => {
        const config = rowCellPropsList[key];

        const label = config?.label ?? config?.labelByPaymentType?.[paymentType] ?? key;

        return (
          <Cell_span key={key} {...config}>
            {label}
          </Cell_span>
        );
      })}
    </div>
  );
};
// ============================================================================

const Row = ({
  paymentType,
  data_accountant,
  className,
  postProps,
  reqPatch,
  reqDelete,

  setAccountantId,
  bankAccountOptionArr,
  reqPatchIsImported,
  isWorksDepartment,
}: {
  paymentType: TpaymentType;
  data_accountant: TaccountantDto | undefined;
  className?: string;
  postProps?: {
    year: number;
    month: number;
    reqPost: TreqPost;
  };
  reqPatch?: TreqPatch;
  reqDelete?: TreqDelete;
  // isReadOnly: boolean;
  setAccountantId?: (accountant: TaccountantDto | undefined) => void;
  bankAccountOptionArr: Toption[];
  reqPatchIsImported?: TreqPostPatchIsImported;
  isWorksDepartment: boolean;
}) => {
  const isNew = !!postProps;

  const [disabled = !!data_accountant?.billSerialNumber, setDisabled] = useState(!isNew);
  const [state_accountant, setState_accountant] = useState<Tstate_accountant>(cre_emptyStateAccountant());

  let keyArr = lookup_keyArr[paymentType];
  keyArr = [...keyArr];

  keyArr = keyArr.slice(1);

  const theKeyArr = keyArr as Exclude<TaccountantKey, 'btn' | 'accountsReceivableDeduction'>[];

  const limitedDate =
    state_accountant.insertDate ??
    (postProps &&
      moment({
        year: postProps.year,
        month: postProps.month - 1,
      }));

  // 匯入發票匯入紙本時的額度
  const quota = data_accountant ? calcQuota(data_accountant) : 0;
  // const quota = (() => {
  //   const { price, splitPayment } = data_accountant ?? {};

  //   const paymentTotal_d = (splitPayment ?? []).reduce((total, payment) => {
  //     return total.add(payment);
  //   }, new Decimal(0));

  //   return new Decimal(price || 0).minus(paymentTotal_d).toNumber();
  // })();

  // ---------------------------------------------------

  const { condition, fonbiddenText } = determineCondition({
    isWorksDepartment,
    data_accountant,
    state_accountant,
  });

  // ---------------------------------------------------

  const handle_check = async () => {
    if (postProps) {
      postProps.reqPost(state_accountant);
    } else if (data_accountant?.id && reqPatch) {
      await reqPatch(data_accountant.id, state_accountant);
      setDisabled(true);
    } else {
      alert('錯誤，data_accountant.id或reqPatch為undefined');
    }
  };

  const handle_delete = async () => {
    if (data_accountant?.id && reqDelete) {
      myAlert.confirm({
        title: '確定刪除',
        props: {
          onOk: async () => {
            await reqDelete(data_accountant.id);
            setDisabled(true);
          },
        },
      });
    } else {
      alert('錯誤，data_accountant.id或reqDelete為undefined');
    }
  };

  const handle_checkIsImported = async () => {
    if (data_accountant?.id && reqPatchIsImported) {
      const modal = myAlert.btnBar({});

      modal.update({
        title: '匯入紙本應收帳款',
        content: (
          <ExportToIncomeBill
            onConfirm={({ isoString, splitPayment: separatePayment }) =>
              reqPatchIsImported(data_accountant.id, isoString, separatePayment)
            }
            onCancel={modal.destroy}
            // defaultPayment={Number(state_accountant.price)}
            quota={quota}
          />
        ),
      });
    }
  };

  // ---------------------------------------------------

  useEffect(() => {
    if (!data_accountant) {
      setState_accountant({
        ...cre_emptyStateAccountant(),
      });

      return;
    }

    const {
      //
      insertDate,
      noteMaturityDate,
      receiptCollectionDate,
      receiptEstimatedDate,
      //

      importAccountingNumber,
      noteNumber,
      accountingNumber,
      vendorName,
      price,
      billSerialNumber,
      notes,
      isImported,
      currency,
      exchangeRate,
      currencyValue,
      incomeBill,

      //
      splitPayment,
      //
    } = data_accountant;

    // 在IDE裡型別為TaccountsReceivableDeductionDto[]，
    // 但是在編譯時被認為是(TaccountsReceivableDeductionDto | undefined)[]
    // 因此在最後使用型別斷言
    const accountsReceivableDeduction: TaccountsReceivableDeductionDto[] = incomeBill
      .flatMap((ib) => ib.accountsReceivableDeduction)
      .filter((item) => !!item) as TaccountsReceivableDeductionDto[];

    // const isPaperImported = incomeBill.some((bill) => bill.isPaperImported);

    setState_accountant({
      insertDate: insertDate ? moment(insertDate) : null,
      importAccountingNumber: importAccountingNumber ?? '',
      noteNumber: noteNumber ?? '',
      accountingNumber: accountingNumber ?? ' ',
      vendorName: vendorName ?? '',
      price: String(price),
      billSerialNumber: billSerialNumber ?? [],
      notes: notes ?? '',
      isImported: isImported,
      accountsReceivableDeduction: accountsReceivableDeduction,
      noteMaturityDate: noteMaturityDate ? moment(noteMaturityDate) : null,
      receiptCollectionDate: receiptCollectionDate ? moment(receiptCollectionDate) : null,
      receiptEstimatedDate: receiptEstimatedDate ? moment(receiptEstimatedDate) : null,
      currency: currency,
      exchangeRate: String(exchangeRate || ''),
      currencyValue: String(currencyValue || ''),

      splitPayment: splitPayment ?? [],
    });
  }, [disabled, data_accountant?.id, data_accountant?.updatedAt]);

  // ---------------------------------------------------------------------------

  return (
    <div className={classNames(scss.row, className)}>
      <div
        className={classNames(
          //
          scss.cell,
          scss.cell_btn,
          rowCellPropsList?.btn?.className
        )}
        style={rowCellPropsList?.btn?.style}
      >
        {condition === 'notAllow' && <span className="text-center">{fonbiddenText}</span>}
        {condition === 'allowEdit' && (
          <>
            <IconCheck02 className={classNames(disabled && 'invisible')} onClick={handle_check} />
            <IconEdit
              //
              className={classNames(!disabled && scss.active, isNew && 'invisible')}
              onClick={() => setDisabled((state) => !state)}
            />
            <IconDelete01 className={classNames(!disabled && 'invisible')} onClick={handle_delete} />
          </>
        )}
        {condition === 'allowExport' && (
          <div className={scss.subBtnBar}>
            <MyButton_v2 px="px22" py="py4" onClick={() => setAccountantId?.(data_accountant)}>
              匯入發票
            </MyButton_v2>
            <MyButton_v2 px="px22" py="py4" onClick={handle_checkIsImported}>
              匯入紙本
            </MyButton_v2>
          </div>
        )}
      </div>

      {theKeyArr.map((key) => {
        const isbillSerialNumber = key === 'billSerialNumber';

        const config = rowCellPropsList[key];

        const { reactNode, ...props } =
          config?.inputSelPropsCreator({
            disabled,
            bankAccountOptionArr,
            limitedDate,
            state_accountant,
            setState_accountant,
            handle_checkIsImported,
            // isAllowToEditIsImported,
          }) ?? {};

        const theDiasbled = isbillSerialNumber || disabled;

        return (
          <div key={key} className={classNames(scss.cell, config?.className)} style={config?.style}>
            {reactNode ? (
              reactNode
            ) : (
              <InputSel
                //
                disabled={theDiasbled}
                showBaseline="auto"
                fontSize="14"
                {...config?.inputSelProps}
                {...props}
              />
            )}
          </div>
        );
      })}

      {/*  */}
    </div>
  );
};

// ============================================================================

const cre_emptyStateAccountant = (): Tstate_accountant => ({
  insertDate: null,
  importAccountingNumber: '',
  noteNumber: '',
  accountingNumber: '',
  vendorName: '',
  price: '',
  billSerialNumber: [],
  notes: '',
  isImported: false,
  accountsReceivableDeduction: [],
  noteMaturityDate: null,
  receiptCollectionDate: null,
  receiptEstimatedDate: null,
  currency: 'TWD 新臺幣',
  exchangeRate: '1', // 預設為1，不然price計算結果為0
  currencyValue: '', // 金額

  splitPayment: [],
});

const determineCondition = ({
  isWorksDepartment,
  data_accountant,
  state_accountant,
}: // isNew,
{
  isWorksDepartment: boolean;
  data_accountant: TaccountantDto | undefined;
  state_accountant: Tstate_accountant;
  // isNew: boolean;
}): {
  condition: 'allowEdit' | 'allowExport' | 'notAllow' | null;
  fonbiddenText: string | null;
} => {
  const isAlreadyImportIncomeBill = data_accountant?.isAlreadyImportIncomeBill;
  const isIncomeBillExist = !!state_accountant.billSerialNumber.length;

  let condition: 'allowEdit' | 'allowExport' | 'notAllow' | null = null;
  let fonbiddenText: string | null = null;

  if (isAlreadyImportIncomeBill) {
    condition = 'notAllow';
    fonbiddenText = '匯入額度已滿';
  } else if (!isWorksDepartment && isIncomeBillExist) {
    condition = 'notAllow';
    fonbiddenText = '已匯入不可編輯';
  } else if (!isWorksDepartment && !isIncomeBillExist) {
    condition = 'allowEdit';
  } else if (isWorksDepartment && !isAlreadyImportIncomeBill) {
    condition = 'allowExport';
  }

  return {
    condition,
    fonbiddenText,
  };

  // 原本的判斷，留作參考 // 20240821後還沒有回頭看這個的話就可以刪掉了
  // const isAllowToEdit = !isWorksDepartment;

  // const {
  //   // billSerialNumber,
  //   // isImported, exchangeFromId,
  //   isAlreadyImportIncomeBill,
  // } = data_accountant ?? {};
  // // const isBillSerialNumberValid = billSerialNumber && billSerialNumber.length > 0;

  // let isAllowToEditIsImported = false;

  // const isIncomeBillExist = !!state_accountant.billSerialNumber.length;

  // if (
  //   !isNew &&
  //   isWorksDepartment &&
  //   // && !state_accountant.billSerialNumber.length
  //   !isAlreadyImportIncomeBill
  // ) {
  //   isAllowToEditIsImported = true;
  // }

  // let fonbiddenText: string | null = null;

  // if (isAlreadyImportIncomeBill) {
  //   fonbiddenText = '已匯入/已兌現';
  // } else if (isIncomeBillExist) {
  // }

  // 更舊的判斷，留作參考 // 20240821後還沒有回頭看這個的話就可以刪掉了
  // // if ((isImported || isBillSerialNumberValid) && exchangeFromId) {
  // //   fonbiddenText = '已匯入/已兌現';
  // // } else if (isImported || isBillSerialNumberValid) {
  // //   fonbiddenText = '已匯入';
  // // } else if (exchangeFromId) {
  // //   fonbiddenText = '已兌現';
  // // }
};

// =============================================================================

export { Cell_span, Thead, Row };
