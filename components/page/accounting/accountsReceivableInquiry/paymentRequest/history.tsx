import classNames from 'classnames';
import Decimal from 'decimal.js';

import { DataEntry_fong } from 'components/global/gear/dataEntry';
import { Collapse } from 'components/global/myAntd/collapse';

import { Tres_apiGetARPaymentData } from 'js/api/api_netCore/schemas';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

type TpaymentRequestLogs = Tres_apiGetARPaymentData['paymentRequestLogs'];
type TpaymentRequestLog = TpaymentRequestLogs[number];

const History = ({ paymentRequestLogs }: { paymentRequestLogs: TpaymentRequestLogs | undefined }) => {
  return (
    <div>
      <div className="text-xl font-semibold mb-6">請款紀錄</div>
      <Collapse
        items={paymentRequestLogs?.map((log) => {
          const period = log.period.padStart(2, '0');
          const type = log.type;
          const typePeriod = log.typePeriod && log.typePeriod.padStart(2, '0');

          return {
            key: log.id,
            label: `第${period}期請款-${type} 第${typePeriod}期`,
            children: <HistoryDetail log={log} />,
          };
        })}
      />
    </div>
  );
};

const HistoryDetail = ({ log }: { log: TpaymentRequestLog }) => {
  const { paymentAmount } = log;

  const 本期請款金額 = new Decimal(paymentAmount || 0).div(1.05).toNumber();
  const 營業稅 = new Decimal(本期請款金額).mul(0.05).toNumber();

  return (
    <div className={classNames('grid grid-cols-4 gap-fong ')}>
      <DataEntry_fong caption="本期請款金額" disabled={true}>
        {toLocaleString(本期請款金額)}
      </DataEntry_fong>
      <DataEntry_fong caption="營業稅(5%)" disabled={true}>
        {toLocaleString(營業稅)}
      </DataEntry_fong>
      <DataEntry_fong caption="本期合計" disabled={true}>
        {toLocaleString(paymentAmount)}
      </DataEntry_fong>
      <div />
      {/*  */}
      <DataEntry_fong caption="保留款(%)" disabled={true}>
        {log.retainageRate}
      </DataEntry_fong>
      <DataEntry_fong caption="稅" disabled={true}>
        {log.retainageTaxCategory}
      </DataEntry_fong>
      <DataEntry_fong caption="保留款金額" disabled={true}>
        {toLocaleString(log.retainageAmount)}
      </DataEntry_fong>
      <DataEntry_fong caption="發票日期" disabled={true}>
        {getTaiwanDateStr(log.invoiceDate)}
      </DataEntry_fong>
      {/*  */}
      <DataEntry_fong caption="發票號碼" disabled={true}>
        {log.invoiceNumber}
      </DataEntry_fong>
      <DataEntry_fong caption="發票金額" disabled={true}>
        {toLocaleString(log.invoiceAmount)}
      </DataEntry_fong>
      <DataEntry_fong caption="買受人" disabled={true}>
        {log.customerName}
      </DataEntry_fong>
      <DataEntry_fong caption="統一編號" disabled={true}>
        {log.taxId}
      </DataEntry_fong>
    </div>
  );
};

const toLocaleString = (value: number | undefined | null) => {
  if (value === undefined || value === null) {
    return '';
  }

  return '$' + value.toLocaleString();
};

export default History;
