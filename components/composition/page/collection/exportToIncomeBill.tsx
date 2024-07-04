import { useState } from 'react';
import { Moment } from 'moment';

// gaer
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './exportToIncomeBill.module.scss';

// ============================================================================

type TonClick = (isoString: string) => Promise<void>;

// ============================================================================

const ExportToIncomeBill = ({
  //
  onConfirm,
  onCancel,
}: {
  onConfirm: TonClick;
  onCancel: () => void;
}) => {
  const [incomeBillDate, setIncomeBillDate] = useState<Moment | null>(null);

  const handle_onConfirm = async () => {
    if (incomeBillDate) {
      await onConfirm(incomeBillDate.toISOString());
      onCancel();
    } else {
      myAlert.info({ title: '請選擇日期' });
    }
  };

  return (
    <div className="w-[300px]">
      <br />
      <p className="text-2xl mb-3">收入傳票日期</p>
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
