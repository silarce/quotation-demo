import moment from 'moment';

import { Modal, ModalProps } from 'antd';

// api
import { TaccountantDto, TaccountantExchangeFromDto } from 'js/api/api_accountant';

export default function Pdf_exchangedBill(
  props: ModalProps & { accountantExchangeFromDto: TaccountantExchangeFromDto }
) {
  const { accountantExchangeFromDto } = props;

  const { sheetNumber, cashExchangeDate, cashExchangeAccount } = accountantExchangeFromDto;

  return (
    <Modal {...props}>
      <div>
        <div>批次兌現單</div>
        <div>
          <p>兌現日期:{moment(cashExchangeDate).format('YYYY-MM-DD')}</p>
          <p></p>
          <p>兌現帳戶:{cashExchangeAccount}</p>
          <p>兌現單號:{sheetNumber}</p>
          <p></p>
          <p>憑證號碼:{}</p>
        </div>
        <div></div>
      </div>
    </Modal>
  );
}
