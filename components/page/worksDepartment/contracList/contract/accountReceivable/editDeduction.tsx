import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import Decimal from 'decimal.js';

// gear
import TopBar from 'components/page/worksDepartment/contracList/contract/accountReceivable/ui/topBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import { IconRemoveCircle, IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

// option
import { optionsCreator_deduction } from 'js/utils/options/options';

// css
import scss from './editDeduction.module.scss';

// type
import type { TaccountantDto, TaccountsReceivableDeductionDto } from 'js/api/dtoTypes';

import type { Tstate_deduction } from './accountantDetails';

// ===============================================================]
export default function EditDeduction({
  state_deduction,
  onConfirm,
  onCancel,
}: {
  state_deduction: Tstate_deduction[];
  onConfirm: (state_deduction: Tstate_deduction[]) => void;
  onCancel: () => void;
}) {
  const [state_deductionArr, setState_deductionArr] = useState<Tstate_deduction[]>(state_deduction);

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

  const handle_confirm = () => {
    onConfirm(state_deductionArr);
  };

  // ---------------------------------------------------------------------------
  // IconRemoveCircle
  return (
    <div className={scss.editDeduction}>
      {/*  */}
      <div className={scss.table}>
        <div className={classNames(scss.row, scss.thead)}>
          <div className={scss.cell}>
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
              <div className={scss.cell}>
                <IconRemoveCircle className={scss.btn_svg} onClick={() => handle_Remove(index)} />
              </div>

              <InputSel
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

      <div className={scss.btnBar}>
        <MyButton_v2 theme="danger" onClick={handle_confirm}>
          確定
        </MyButton_v2>
        <MyButton_v2 onClick={onCancel}>取消</MyButton_v2>
      </div>

      {/*  */}
    </div>
  );
}
