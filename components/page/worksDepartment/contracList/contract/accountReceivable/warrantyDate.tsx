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

  const onConfirm = async () => {
    const body: TupdateAccountReceivableDto = {
      warrantyDate: state_warrantyDate ? state_warrantyDate.toISOString() : null,
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
    const v = accountReceivable.warrantyDate ? moment(accountReceivable.warrantyDate) : null;
    setState_warrantyDate(v);
  }, [accountReceivable.warrantyDate, disabled]);

  return (
    <div className={classNames('flex items-end gap-2', className)}>
      <InputSel
        wrapperStyle={{ width: '300px' }}
        caption="保固日期"
        disabled={disabled}
        // showBaseline="auto"
        datePickerProps={{
          props: {
            value: state_warrantyDate,
            onChange: (date) => {
              setState_warrantyDate(date);
            },
          },
        }}
      />

      <IconEdit
        className={scss.icon}
        isActive={!disabled}
        onClick={() => {
          setDisabled(!disabled);
        }}
      />
      <IconCheck02 className={classNames(scss.icon, disabled && 'hidden')} onClick={onConfirm} />
    </div>
  );
}
