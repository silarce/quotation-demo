import { useState } from 'react';
import { Moment } from 'moment';

// gaer
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './exportToIncomeBill.module.scss';

// ============================================================================

type TonConfirm = (params: { isoString: string; temporary_separatePayment: number }) => Promise<void>;

// ============================================================================

const ExportToIncomeBill = ({
  //
  onConfirm,
  onCancel,
}: {
  onConfirm: TonConfirm;
  onCancel: () => void;
}) => {
  const [state_incomeBillDate, setState_incomeBillDate] = useState<Moment | null>(null);
  const [state_temporary_separatePayment, setState_temporary_separatePayment] = useState<number | null>(null);

  const handle_onConfirm = async () => {
    if (state_incomeBillDate) {
      await onConfirm({
        isoString: state_incomeBillDate.toISOString(),
        temporary_separatePayment: state_temporary_separatePayment || 0,
      });
      onCancel();
    } else {
      myAlert.info({ title: '請選擇日期' });
    }
  };

  return (
    <div className="w-[300px]">
      <br />

      <InputSel
        caption="收入傳票日期"
        datePickerProps={{
          props: {
            className: scss.datePicker,
            placeholder: '請選擇日期',
            value: state_incomeBillDate,
            onChange: (m) => {
              setState_incomeBillDate(m);
            },
          },
        }}
      />

      <InputSel
        className="mt-3"
        caption="分出金額"
        inputProps={{
          props: {
            type: 'number',
            value: state_temporary_separatePayment ?? '',
            onChange: (e) => {
              setState_temporary_separatePayment(Number(e.target.value));
            },
          },
        }}
      />

      <div className="flex gap-5 mt-10 justify-center">
        <MyButton_v2 px="px22" py="py6" onClick={handle_onConfirm}>
          確定
        </MyButton_v2>

        <MyButton_v2 theme="danger" px="px22" py="py6" buttonProps={{ htmlType: 'submit' }} onClick={onCancel}>
          取消
        </MyButton_v2>
      </div>
    </div>
  );
};

export { ExportToIncomeBill };
