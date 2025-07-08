import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';

// gaer
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './exportToIncomeBill.module.scss';

// ============================================================================

type TonConfirm = (params: { isoString: string; splitPayment: number; isForeign: boolean }) => Promise<void>;

// ============================================================================

const ExportToIncomeBill = ({
  //
  onConfirm,
  onCancel,
  // defaultPayment,
  quota,
  currency,
}: {
  onConfirm: TonConfirm;
  onCancel: () => void;
  // defaultPayment: number;
  quota: number;
  currency: string;
}) => {
  const [state_incomeBillDate, setState_incomeBillDate] = useState<Dayjs | null>(null);
  const [state_splitPayment, setState_splitPayment] = useState<number>(quota);
  const [isForeign, setIsForeign] = useState<boolean>(false);

  const handle_onConfirm = async () => {
    if (!state_incomeBillDate) {
      myAlert.info({ title: '請選擇日期' });

      return;
    }

    if (state_splitPayment > quota) {
      myAlert.info({ title: '分出金額不可大於可分配金額' });

      return;
    }

    await onConfirm({
      isoString: state_incomeBillDate.toISOString(),
      splitPayment: state_splitPayment,
      isForeign,
    });
    onCancel();
  };

  useEffect(() => {
    currency !== 'TWD' && setIsForeign(true);
  }, []);

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
        prefix={currency}
        inputProps={{
          props: {
            type: 'number',
            value: state_splitPayment ?? '',
            onChange: (e) => {
              setState_splitPayment(Number(e.target.value));
            },
          },
        }}
      />

      <InputSel
        className="mt-3"
        radioProps={{
          props: {
            value: isForeign,
            onChange(e) {
              setIsForeign(e.target.value);
            },
          },
          radioPropsArr: [
            {
              value: false,
              children: '國內收入',
            },
            {
              value: true,
              children: '國外收入',
            },
          ],
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
