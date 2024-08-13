import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import Decimal from 'decimal.js';
import _ from 'lodash';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import { IconRemoveCircle, IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';
import iconEyeOpen from 'public/image/icon/eyeOpen.svg';

// option
import { optionsCreator_deduction } from 'js/utils/options/options';

// css
import scss from './index.module.scss';

import {
  TupdateAccountantDeductionDto,
  //
  useGetAccountant_id,
  //
  // apiPatchAccountant_accountReceivable,
} from 'js/api/api_accountant';

import { TupdateIncomeBillSerialDto, apiPatchIncomeBill } from 'js/api/api_engineering';

import calcIncomeBillUnpaidPayment from 'js/utils/calc/calcIncomeBillUnpaidPayment';

// ===============================================================]

type Tstate_deduction = {
  id?: string;
  itemName: string; // 扣款項目
  detailedAmount: string; // 扣款金額
};

type Tprops = {
  accountantId?: string;
  incomeBillId?: string;
  defaultStateArr?: Tstate_deduction[];

  // 現在api只有回傳fee跟id，未來真的需要時再請後端回傳完整的TaccountantDto
  onConfirm?: (props: { accountant: null; state_deductionArr: Tstate_deduction[] }) => void;
  onCancel?: () => void;
  cancelOnSuccess?: boolean;
};

type Tprops_modal = Pick<Tprops, 'accountantId' | 'incomeBillId' | 'defaultStateArr' | 'onConfirm' | 'cancelOnSuccess'>;

export type { Tstate_deduction };

// ===============================================================]

// ====================================================================
// MARK:START

function EditDeductionPanel({
  // accountantId與defaultStateArr擇一
  // 若有accountantId就會呼叫api取得資料，否則就會用defaultStateArr
  // accountantId與defaultStateArr都有的話，accountantId會優先
  accountantId,
  incomeBillId,
  defaultStateArr,
  onConfirm,
  onCancel,
  cancelOnSuccess,
}: Tprops) {
  // --------------------------------------------------------------------
  const [readonly, setReadonly] = useState(true);
  const [state_deductionArr, setState_deductionArr] = useState<Tstate_deduction[]>([]);

  if (cancelOnSuccess === undefined) {
    if (!!accountantId) {
      cancelOnSuccess = false;
    } else {
      cancelOnSuccess = true;
    }
  }

  // --------------------------------------------------------------------

  const {
    data: data_accountant,
    update: update_accountant,
    // isFetching: isFetching_accountant
  } = useGetAccountant_id(accountantId);

  const data_incomeBill = useMemo(() => {
    if (!data_accountant) {
      return null;
    }

    const incomeBill = data_accountant.incomeBill.find((item) => item.id === incomeBillId);

    !incomeBill &&
      myAlert.err({
        title: '找不到incomeBill',
        content: `
      accountantId:${accountantId}，
      incomeBillId:${incomeBillId}
      `,
      });

    return incomeBill || null;
  }, [data_accountant, incomeBillId]);

  // --------------------------------------------------------------------

  // region FUNCTION

  const handle_edit = (index: number, key: 'itemName' | 'detailedAmount', value: string) => {
    const copy = [...state_deductionArr];
    copy[index][key] = value;

    setState_deductionArr(copy);
  };

  const handle_Add = () => {
    setState_deductionArr((pre) => [...pre, { itemName: '', detailedAmount: '' }]);
  };

  const handle_Remove = (index: number) => {
    const copy = [...state_deductionArr];
    copy.splice(index, 1);
    setState_deductionArr(copy);
  };

  const handle_confirm = async () => {
    //
    const accountsReceivableDeduction = state_deductionArr.map((item) => {
      return {
        ...item,
        detailedAmount: Number(item.detailedAmount),
      };
    });

    if (accountantId && incomeBillId) {
      if (!data_incomeBill) {
        return;
      }

      const deductionPayment = accountsReceivableDeduction.reduce((deductionPayment, item) => {
        deductionPayment = new Decimal(deductionPayment).add(item.detailedAmount || 0).toNumber();

        return deductionPayment;
      }, 0);

      const unpaidPayment = calcIncomeBillUnpaidPayment({
        contractPayment: Number(data_incomeBill.contractPayment || 0),
        periodPayment: Number(data_incomeBill.periodPayment || 0),
        priorPeriodPayment: Number(data_incomeBill.priorPeriodPayment || 0),
        deductionPayment: deductionPayment,
        fee: Number(data_incomeBill.fee || 0),
      });

      const body: TupdateIncomeBillSerialDto = {
        ...data_incomeBill,
        incomeBillDeduction: accountsReceivableDeduction,
        unpaidPayment,
      };

      // 現在api只有回傳fee跟id，未來真的需要時再請後端回傳完整的TaccountantDto
      const res = await apiPatchIncomeBill(incomeBillId, body)
        .then(async (res) => {
          onConfirm?.({
            accountant: null,
            state_deductionArr,
          });

          if (cancelOnSuccess) {
            onCancel?.();
          } else {
            await update_accountant();
            setReadonly(true);
          }

          return res;
        })
        .catch(() => {});
    } else {
      onConfirm?.({
        accountant: null,
        state_deductionArr,
      });
      cancelOnSuccess && onCancel?.();
      setReadonly(true);
    }
  };

  // ---------------------------------------------------------------------------

  // MARK: useEffect

  const defaultState = useMemo(() => {
    const deductionArr = (() => {
      let deductionArr;

      if (!data_accountant) {
        deductionArr = defaultStateArr;
      } else {
        const incomeBill = data_accountant.incomeBill.find((item) => item.id === incomeBillId);

        if (incomeBill) {
          deductionArr = incomeBill?.accountsReceivableDeduction;
        }
      }

      return deductionArr || [];
    })();

    const state_deductionArr: Tstate_deduction[] = deductionArr.map((deduction) => {
      return {
        id: deduction.id,
        itemName: deduction.itemName,
        detailedAmount: String(deduction.detailedAmount),
      };
    });

    return state_deductionArr;
  }, [data_accountant, defaultStateArr]);

  useEffect(() => {
    setState_deductionArr(_.cloneDeep(defaultState));
  }, [defaultState, readonly]);

  // ---------------------------------------------------------------------------

  // MARK:RENDER

  return (
    <div className={scss.editDeduction}>
      {/*  */}
      <div className={scss.table}>
        <div className={classNames(scss.row, scss.thead)}>
          <div className={classNames(scss.cell, readonly && 'invisible')}>
            <IconAddCircle onClick={handle_Add} className={scss.btn_svg} />
          </div>
          <div className={scss.cell}>扣款項目</div>
          <div className={scss.cell}>扣款金額</div>
        </div>
        {/*  */}
        {state_deductionArr.map((deduction, index) => {
          const { itemName, detailedAmount } = deduction;

          const value_itemName = itemName ? { value: itemName, label: itemName } : null;

          return (
            <div key={index} className={classNames(scss.row)}>
              <div className={classNames(scss.cell, readonly && 'invisible')}>
                <IconRemoveCircle className={scss.btn_svg} onClick={() => handle_Remove(index)} />
              </div>

              <InputSel
                disabled={readonly}
                showBaseline="auto"
                selectProps={{
                  props: {
                    menuPortalTarget: undefined,
                    isSearchable: true,
                    options: optionsCreator_deduction(),
                    value: value_itemName,
                    onChange: (option) => {
                      if (!option) {
                        handle_edit(index, 'itemName', '');
                      } else {
                        handle_edit(index, 'itemName', option.value);
                      }
                    },
                  },
                }}
              />

              <InputSel
                disabled={readonly}
                showBaseline="auto"
                inputProps={{
                  props: {
                    value: detailedAmount,
                    onChange: (e) => {
                      handle_edit(index, 'detailedAmount', e.target.value);
                    },
                  },
                }}
              />
            </div>
          );
        })}
      </div>
      {/*  */}

      {!readonly && (
        <div className={classNames(scss.btnBar)}>
          <MyButton_v2 onClick={() => setReadonly(true)}>取消</MyButton_v2>
          <MyButton_v2 theme="danger" onClick={handle_confirm}>
            確定
          </MyButton_v2>
        </div>
      )}

      {readonly && (
        <div className={classNames(scss.btnBar)}>
          <MyButton_v2 onClick={() => setReadonly(false)}>編輯</MyButton_v2>
          <MyButton_v2 onClick={onCancel}>關閉</MyButton_v2>
        </div>
      )}

      {/*  */}
    </div>
  );
}

// MARK:END
// ====================================================================

// 直接呼叫modal的靜態函式
const editDeduction = ({ accountantId, incomeBillId, defaultStateArr, onConfirm, cancelOnSuccess }: Tprops_modal) => {
  const modal = myAlert.clear({});

  modal.update({
    content: (
      <EditDeductionPanel
        //
        accountantId={accountantId}
        incomeBillId={incomeBillId}
        defaultStateArr={defaultStateArr}
        onConfirm={onConfirm}
        onCancel={modal.destroy}
        cancelOnSuccess={cancelOnSuccess}
      />
    ),
  });
};

const EditDefunctionBtn = ({
  className,
  accountantId,
  incomeBillId,
  defaultStateArr,
  onConfirm,
}: {
  className?: string;
} & Tprops_modal) => {
  return (
    <Image
      className={classNames('cursor-pointer', className)}
      src={iconEyeOpen}
      alt="編輯扣款"
      onClick={() => {
        editDeduction({
          accountantId,
          incomeBillId,
          defaultStateArr,
          onConfirm,
        });
      }}
    />
  );
};

// ====================================================================

export default EditDefunctionBtn;
export { editDeduction };
