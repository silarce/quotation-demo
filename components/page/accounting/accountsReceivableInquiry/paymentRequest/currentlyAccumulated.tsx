import classNames from 'classnames';

import { DataEntry_fong } from 'components/global/gear/dataEntry';
import { Collapse } from 'components/global/myAntd/collapse';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

// =============================================================================

type Tdata = Tres_apiGetARPaymentData['accountsReceivables'];

// =============================================================================
const CurrentlyAccumulated = ({ data, className }: { data: Tdata | undefined; className?: string }) => {
  const {
    prAmount, //已請款金額 總計
    taxes, //稅金
    totalAmount, // 總金額

    customerName,
    taxId,
  } = data ?? {};

  return (
    <Collapse
      className={className}
      items={[
        {
          label: '目前累計',
          children: (
            <div className={classNames('grid grid-cols-4 gap-fong')}>
              <DataEntry_fong caption="目前累計請款金額" disabled={true}>
                {toLocaleString(prAmount)}
              </DataEntry_fong>
              <DataEntry_fong caption="營業稅(5%)" disabled={true}>
                {toLocaleString(taxes)}
              </DataEntry_fong>
              <DataEntry_fong caption="本期合計" disabled={true}>
                no property
              </DataEntry_fong>
              <DataEntry_fong caption="保留款(%)" disabled={true}>
                no property
              </DataEntry_fong>
              <DataEntry_fong caption="稅" disabled={true}>
                no property
              </DataEntry_fong>
              <DataEntry_fong caption="保留款金額" disabled={true}>
                no property
              </DataEntry_fong>
              <DataEntry_fong caption="金額總計" disabled={true}>
                {toLocaleString(totalAmount)}
              </DataEntry_fong>
              <DataEntry_fong caption="發票日期" disabled={true}>
                no property
              </DataEntry_fong>
              <DataEntry_fong caption="發票號碼" disabled={true}>
                no property
              </DataEntry_fong>
              <DataEntry_fong caption="發票金額" disabled={true}>
                no property
              </DataEntry_fong>
              <DataEntry_fong caption="買受人" disabled={true}>
                {customerName}
              </DataEntry_fong>
              <DataEntry_fong caption="統一編號" disabled={true}>
                {taxId}
              </DataEntry_fong>
            </div>
          ),
        },
      ]}
    />
  );
};

const toLocaleString = (v: number | null | undefined) => {
  if (v === null || v === undefined) {
    return '';
  }

  return '$' + v.toLocaleString();
};

export default CurrentlyAccumulated;
