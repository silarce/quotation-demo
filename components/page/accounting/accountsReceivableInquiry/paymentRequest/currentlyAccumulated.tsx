import classNames from 'classnames';

import { DataEntry_fong } from 'components/global/gear/dataEntry';
import { Collapse } from 'components/global/myAntd/collapse';

const CurrentlyAccumulated = ({
  className,
}: {
  className?: string;
} = {}) => {
  return (
    <Collapse
      className={className}
      items={[
        {
          label: '目前累計',
          children: (
            <div className={classNames('grid grid-cols-4 gap-fong')}>
              <DataEntry_fong caption="目前累計請款金額" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="營業稅(5%)" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="本期合計" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="保留款(%)" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="稅" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="保留款金額" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="金額總計" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="發票日期" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="發票號碼" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="發票金額" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="買受人" disabled={true}>
                fooo
              </DataEntry_fong>
              <DataEntry_fong caption="統一編號" disabled={true}>
                fooo
              </DataEntry_fong>
            </div>
          ),
        },
      ]}
    />
  );
};

export default CurrentlyAccumulated;
