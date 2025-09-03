import { useState } from 'react';
import { Dayjs } from 'dayjs';

import { Container_confirm } from 'components/global/container/modal';
import { DataEntry_fong, Input, DatePicker } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';

import { TpaymentRequestInvoiceList_Dto } from 'components/composition/selectorModal/selector_paymentRequestInvoice';

// ============================================================================

interface Tstate_invoiceInfo {
  invoiceDate: Dayjs | null;
  invoiceAmount: `${number}` | '';
}

// ============================================================================

const InputInvoiceInfo = ({
  invoiceNumber,
  paymentRequest,
  onConfirm,
  onCancel,
}: {
  invoiceNumber: string;
  paymentRequest: TpaymentRequestInvoiceList_Dto;
  onConfirm: (params: Tstate_invoiceInfo) => void;
  onCancel: () => void;
}) => {
  const [state, setState] = useState<Tstate_invoiceInfo>({
    invoiceDate: null,
    invoiceAmount: '',
  });

  const handle_confirm = () => {
    onConfirm(state);
  };

  return (
    <Container_confirm
      title="發票資訊"
      footerRight={
        <>
          <Btn onClick={onCancel} themeColor="red_I">
            取消
          </Btn>
          <Btn onClick={handle_confirm}>確認</Btn>
        </>
      }
    >
      <div className="grid gap-4 w-[600px]">
        <DataEntry_fong caption="案場名稱" disabled={true}>
          {paymentRequest.constructionSite}
        </DataEntry_fong>

        <DataEntry_fong caption="請款期數" disabled={true}>
          {paymentRequest.period}
        </DataEntry_fong>

        <DataEntry_fong caption="請款類型" disabled={true}>
          {paymentRequest.type}
        </DataEntry_fong>

        <DataEntry_fong caption="請款金額" disabled={true}>
          {paymentRequest.paymentAmount}
        </DataEntry_fong>

        <DataEntry_fong caption="發票號碼" disabled={true}>
          {invoiceNumber}
        </DataEntry_fong>

        <DataEntry_fong caption="發票日期">
          <DatePicker value={state.invoiceDate} onChange={(date) => setState({ ...state, invoiceDate: date })} />
        </DataEntry_fong>

        <DataEntry_fong caption="發票金額">
          <Input
            type="number"
            value={state.invoiceAmount}
            onChange={(e) => setState({ ...state, invoiceAmount: e.target.value as `${number}` | '' })}
          />
        </DataEntry_fong>
      </div>
    </Container_confirm>
  );
};

export default InputInvoiceInfo;

export type { Tstate_invoiceInfo };
