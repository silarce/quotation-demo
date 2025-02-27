import { useState, useEffect } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';

import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import type { TaccountsReceivableDto, TupdateAccountReceivableDto } from 'js/api/dtoTypes';
import type { TreqPatchAccountReceivable } from 'pages/worksDepartment/contractList/contract/accountReceivable';

import { IconEdit, IconCheck01, IconCheck02 } from 'public/image/icon/svgComponent/svgIcons';

import scss from './warrantyDate.module.scss';

// ===========================================================================
type Tprops = {
  className?: string;
  accountReceivable: TaccountsReceivableDto;
  reqPatchAccountReceivable: TreqPatchAccountReceivable;
};

export default function WarrantyDate({ accountReceivable, reqPatchAccountReceivable, className }: Tprops) {
  const [disabled, setDisabled] = useState(true);

  const [state_warrantyDate, setState_warrantyDate] = useState<Moment | null>(null);
  const [state_warrantyPeriod, setState_warrantyPeriod] = useState<`${number}` | ''>('');

  const onConfirm = async () => {
    const body: TupdateAccountReceivableDto = {
      warrantyDate: state_warrantyDate ? state_warrantyDate.toISOString() : null,
      warrantyPeriod: state_warrantyPeriod || null,
      //
      pendingTasks: accountReceivable.pendingTasks,
      finalPayment: accountReceivable.finalPayment || '0',
      paymentPending: accountReceivable.paymentPending,
    };

    await reqPatchAccountReceivable(body)
      .then(() => {
        setDisabled(true);
      })
      .catch(() => {});
  };

  useEffect(() => {
    const warrantyDate = accountReceivable.warrantyDate ? moment(accountReceivable.warrantyDate) : null;
    const warrantyPeriod = accountReceivable.warrantyPeriod || '';
    setState_warrantyDate(warrantyDate);
    setState_warrantyPeriod(warrantyPeriod);
  }, [accountReceivable.warrantyDate, accountReceivable.warrantyPeriod, disabled]);

  return (
    <div
      className={classNames(
        // 'flex items-end gap-3',
        'border border-border w-fit p-3',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <IconEdit
          className={scss.icon}
          isActive={!disabled}
          onClick={() => {
            setDisabled(!disabled);
          }}
        />
        <IconCheck02 className={classNames(scss.icon, disabled && 'hidden')} onClick={onConfirm} />
      </div>

      <InputSel
        wrapperStyle={{ width: '300px' }}
        caption="保固日期"
        disabled={disabled}
        showBaseline="auto"
        datePickerProps={{
          props: {
            placeholder: '未設置',
            value: state_warrantyDate,
            onChange: (date) => {
              setState_warrantyDate(date);
            },
          },
        }}
      />

      <br />

      <InputSel
        wrapperStyle={{ width: '300px' }}
        caption="保固年數"
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {
            placeholder: '未設置',
            type: 'number',
            min: 0,
            step: 1,
            value: state_warrantyPeriod,
            onChange: (e) => {
              e.target.validity.valid && setState_warrantyPeriod(e.target.value as `${number}` | '');
            },
          },
        }}
      />
    </div>
  );
}
