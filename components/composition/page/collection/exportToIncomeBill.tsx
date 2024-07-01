import { useState } from 'react';
import moment, { Moment } from 'moment';

// gaer
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel, {
  TinputProps,
  TselectProps,
  TdatePickerProps,
  TcheckBoxProps_v2,
  TinputSelProps,
} from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

import { Tcurrency, TperiodType } from 'js/api/dtoTypes';

import { TreqPatchIsImported } from '.';

import scss from './exportToIncomeBill.module.scss';

// ============================================================================

type TonClick = (isoString: string) => Promise<void>;

// ============================================================================

const ExportToIncomeBill = ({
  //
  onRequestPaymentClick,
  onDepositClick,
  onCancel,
}: {
  onRequestPaymentClick: TonClick;
  onDepositClick: TonClick;
  onCancel: () => void;
}) => {
  const [incomeBillDate, setIncomeBillDate] = useState<Moment | null>(null);

  const handle_onRequestPaymentClick = async () => {
    if (incomeBillDate) {
      await onRequestPaymentClick(incomeBillDate.toISOString());
      onCancel();
    } else {
      myAlert.info({ title: '請選擇日期' });
    }
  };

  const handle_onDepositClick = async () => {
    if (incomeBillDate) {
      onDepositClick(incomeBillDate.toISOString());
      onCancel();
    } else {
      myAlert.info({ title: '請選擇日期' });
    }
  };

  return (
    <div>
      <br />

      <InputSel
        datePickerProps={{
          props: {
            className: scss.datePicker,
            placeholder: '請選擇日期',
            value: incomeBillDate,
            onChange: (m) => {
              setIncomeBillDate(m);
            },
          },
        }}
      />

      <br />
      <div className="flex gap-5 mt-10">
        <MyButton_v2 px="px22" py="py6" onClick={handle_onRequestPaymentClick}>
          新增請款
        </MyButton_v2>

        <MyButton_v2 px="px22" py="py6" onClick={handle_onDepositClick}>
          新增訂金
        </MyButton_v2>

        <MyButton_v2 theme="danger" px="px22" py="py6" buttonProps={{ htmlType: 'submit' }} onClick={onCancel}>
          取消
        </MyButton_v2>
      </div>
    </div>
  );
};

export { ExportToIncomeBill };
