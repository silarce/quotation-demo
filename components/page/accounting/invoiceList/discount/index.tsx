import { useState } from 'react';
import { Dayjs } from 'dayjs';

import { Container_confirm } from 'components/global/container/modal';
import { DataEntry_fong, Input, DatePicker } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';

// ============================================================================

interface Tstate {
  date: Dayjs | null;
  amount: string;
  note: string;
}

// ============================================================================
export default function Discount({
  onConfirm,
  onCancel,
}: {
  onConfirm?: (state: Tstate) => void;
  onCancel: () => void;
}) {
  const [state, setState] = useState<Tstate>({ date: null, amount: '', note: '' });

  const handle_confirm = () => {
    onConfirm?.(state);
  };

  const handle_cancel = () => {
    onCancel();
  };

  return (
    <Container_confirm
      title="發票折讓"
      footerRight={
        <>
          <Btn onClick={handle_cancel}>取消</Btn>
          <Btn theme="save" onClick={handle_confirm}>
            儲存
          </Btn>
        </>
      }
    >
      <div className="grid gap-5 w-[450px]">
        <DataEntry_fong caption="折讓日期">
          <DatePicker value={state.date} onChange={(date) => setState((s) => ({ ...s, date }))} />
        </DataEntry_fong>

        <DataEntry_fong caption="折讓金額">
          <Input
            type="number"
            value={state.amount}
            onChange={(e) => setState((s) => ({ ...s, amount: e.target.value }))}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="備註">
          <Input value={state.note} onChange={(e) => setState((s) => ({ ...s, note: e.target.value }))} />
        </DataEntry_fong>
      </div>
    </Container_confirm>
  );
}
